import { google } from "googleapis";
import firebaseConfig from "../../firebase-applet-config.json" with { type: "json" };
import {
  saveStoredRefreshToken,
  verifyCalendarConnection,
  getActiveCalendarId,
  SALON_ACCOUNT_EMAIL,
} from "./googleCalendarBackend.js";
import {
  generateOAuthState,
  validateAndConsumeOAuthState,
  generatePKCE,
  verifyPKCE,
} from "./adminAuth.js";

export const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

// Whitelist of strictly permitted hosts for OAuth redirects
export const ALLOWED_HOSTS = new Set([
  "slow-skin-concept.pl",
  "www.slow-skin-concept.pl",
  "localhost:3000",
  "localhost",
  "127.0.0.1:3000",
  "127.0.0.1",
]);

/**
 * Validates whether an incoming host is in the strict whitelist or authorized preview domain.
 * No arbitrary trust in arbitrary unknown hosts.
 */
export function isAllowedHost(host: string): boolean {
  if (!host) return false;
  const fullClean = host.trim().toLowerCase();
  const domainOnly = fullClean.split(":")[0];
  if (ALLOWED_HOSTS.has(fullClean) || ALLOWED_HOSTS.has(domainOnly)) return true;
  // Allow authorized AI Studio / Google Cloud Run preview instances and Vercel preview environments
  if (
    domainOnly.endsWith(".run.app") ||
    domainOnly.endsWith(".vercel.app")
  ) {
    return true;
  }
  return false;
}

/**
 * Resolves the appropriate redirect URI from explicit configuration.
 * Never blindly trusts unknown host headers.
 * 
 * Precedence:
 * 1. process.env.GOOGLE_REDIRECT_URI (strictly validated against allowed host list)
 * 2. Explicit customRedirectUri if provided and allowed
 * 3. Verified request origin if allowed (e.g. AI Studio preview environment)
 * 4. Canonical production URI: https://slow-skin-concept.pl/api/calendar/auth/callback
 */
export function resolveRedirectUri(explicitUri?: string, requestOrigin?: string): string {
  // 1. Explicit environment variable
  if (process.env.GOOGLE_REDIRECT_URI && process.env.GOOGLE_REDIRECT_URI.trim()) {
    const envUri = process.env.GOOGLE_REDIRECT_URI.trim();
    try {
      const parsed = new URL(envUri);
      if (isAllowedHost(parsed.host)) {
        return envUri;
      }
      console.warn(`[OAuth] GOOGLE_REDIRECT_URI host '${parsed.host}' is not in allowed list.`);
    } catch {
      console.warn("[OAuth] Invalid GOOGLE_REDIRECT_URI syntax.");
    }
  }

  // 2. Explicit argument if passed and valid
  if (explicitUri) {
    try {
      const parsed = new URL(explicitUri);
      if (isAllowedHost(parsed.host)) {
        return explicitUri;
      }
    } catch {
      // ignore
    }
  }

  // 3. Request origin if allowed (e.g. AI Studio development environment)
  if (requestOrigin) {
    try {
      const parsed = new URL(requestOrigin);
      if (isAllowedHost(parsed.host)) {
        return `${parsed.origin}/api/calendar/auth/callback`;
      }
    } catch {
      // ignore
    }
  }

  // 4. Canonical production default
  return "https://slow-skin-concept.pl/api/calendar/auth/callback";
}

export function getEffectiveOAuthCredentials(customRedirectUri?: string) {
  // Strictly use verified client ID from environment
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const redirectUri = resolveRedirectUri(customRedirectUri);

  return { clientId, clientSecret, redirectUri };
}

export function getOAuth2Client(customRedirectUri?: string) {
  const { clientId, clientSecret, redirectUri } = getEffectiveOAuthCredentials(customRedirectUri);
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generates an OAuth consent URL for administrators using PKCE (RFC 7636).
 * Generates a signed, single-use state bound to the admin session, redirectUri, and PKCE challenge.
 */
export async function generateAdminAuthUrl(options: {
  customRedirectUri?: string;
  sessionId?: string;
}): Promise<{
  url: string;
  redirectUri: string;
  state: string;
  stateExpiresAt: number;
  codeVerifier: string;
}> {
  const redirectUri = resolveRedirectUri(options.customRedirectUri);
  const oauth2Client = getOAuth2Client(redirectUri);

  // Generate PKCE code_verifier and code_challenge
  const { codeVerifier, codeChallenge } = generatePKCE();

  const { state, expiresAt } = await generateOAuthState({
    sessionId: options.sessionId || "admin-session",
    redirectUri,
    codeChallenge,
  });

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Force consent screen to reliably receive refresh_token
    scope: CALENDAR_SCOPES,
    redirect_uri: redirectUri,
    login_hint: SALON_ACCOUNT_EMAIL,
    state,
    code_challenge: codeChallenge,
    // Google API supports code_challenge_method
    // @ts-ignore
    code_challenge_method: "S256",
  });

  return {
    url,
    redirectUri,
    state,
    stateExpiresAt: expiresAt,
    codeVerifier,
  };
}

/**
 * Handles Google OAuth callback:
 * 1. Validates and consumes single-use state before exchanging code.
 * 2. Validates PKCE code_verifier against stored code_challenge.
 * 3. Exchanges code with code_verifier for tokens.
 * 4. Verifies authenticated Google account identity strictly matches slowskinconcept@gmail.com.
 * 5. Verifies access to designated salon calendar ID.
 * 6. Saves refresh token in persistent encrypted storage (fails on write error).
 * 7. Never exposes secrets or tokens in result.
 */
export async function handleOAuthCallback(params: {
  code: string;
  state: string;
  cookieState?: string;
  codeVerifier?: string;
  customRedirectUri?: string;
}): Promise<{
  success: boolean;
  message: string;
  calendarId: string;
  accountEmail: string;
  hasRefreshToken: boolean;
  verification?: any;
  error?: string;
}> {
  const calendarId = getActiveCalendarId();

  // Step 1: Validate and consume OAuth state
  const stateCheck = await validateAndConsumeOAuthState(params.state, params.cookieState);
  if (!stateCheck.valid) {
    return {
      success: false,
      message: "Odrzucono próbę autoryzacji: niepoprawny, wygasły lub ponownie użyty stan (state).",
      calendarId,
      accountEmail: SALON_ACCOUNT_EMAIL,
      hasRefreshToken: false,
      error: stateCheck.error || "Błąd walidacji state",
    };
  }

  // Step 2: Validate PKCE code_verifier
  if (stateCheck.payload?.codeChallenge) {
    if (!params.codeVerifier) {
      return {
        success: false,
        message: "Odrzucono autoryzację: brak wymaganego weryfikatora PKCE (code_verifier).",
        calendarId,
        accountEmail: SALON_ACCOUNT_EMAIL,
        hasRefreshToken: false,
        error: "Brak parametru PKCE code_verifier.",
      };
    }

    const pkceValid = verifyPKCE(params.codeVerifier, stateCheck.payload.codeChallenge);
    if (!pkceValid) {
      return {
        success: false,
        message: "Odrzucono autoryzację: niepoprawny weryfikator PKCE (niezgodność challenge).",
        calendarId,
        accountEmail: SALON_ACCOUNT_EMAIL,
        hasRefreshToken: false,
        error: "Nieprawidłowy weryfikator PKCE.",
      };
    }
  }

  // Use the redirectUri originally bound to this signed state
  const redirectUri = stateCheck.payload?.redirectUri || resolveRedirectUri(params.customRedirectUri);
  const oauth2Client = getOAuth2Client(redirectUri);

  try {
    // Step 3: Exchange authorization code with PKCE verifier for tokens
    const tokenOptions: any = {
      code: params.code,
    };
    if (params.codeVerifier) {
      tokenOptions.codeVerifier = params.codeVerifier;
    }

    const { tokens } = await oauth2Client.getToken(tokenOptions);
    if (!tokens.refresh_token) {
      return {
        success: false,
        message: "Google nie zwróciło refresh tokenu (prawdopodobnie pominięto ekran zgody prompt=consent).",
        calendarId,
        accountEmail: SALON_ACCOUNT_EMAIL,
        hasRefreshToken: false,
        error: "Brak refresh_token w odpowiedzi Google OAuth.",
      };
    }

    oauth2Client.setCredentials(tokens);

    // Step 4: Strictly verify authenticated account identity
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const authenticatedEmail = (userInfo.data.email || "").toLowerCase().trim();

    if (authenticatedEmail !== SALON_ACCOUNT_EMAIL.toLowerCase()) {
      return {
        success: false,
        message: `Odrzucono autoryzację. Zalogowano konto Google '${authenticatedEmail}', natomiast jedynym uprawnionym kontem gabinetu jest '${SALON_ACCOUNT_EMAIL}'.`,
        calendarId,
        accountEmail: authenticatedEmail,
        hasRefreshToken: false,
        error: `Nieautoryzowane konto Google: ${authenticatedEmail}. Wymagane: ${SALON_ACCOUNT_EMAIL}.`,
      };
    }

    // Step 5: Verify access to designated salon calendar ID
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    try {
      const getCal = await calendar.calendars.get({ calendarId });
      if (getCal.status !== 200) {
        throw new Error(`Kalendarz ${calendarId} zwrócił status ${getCal.status}`);
      }
    } catch (calErr: any) {
      return {
        success: false,
        message: `Konto ${authenticatedEmail} zostało uwierzytelnione, ale nie ma dostępu do dedykowanego kalendarza gabinetu (${calendarId}).`,
        calendarId,
        accountEmail: authenticatedEmail,
        hasRefreshToken: false,
        error: `Błąd dostępu do kalendarza ${calendarId}: ${calErr.message}`,
      };
    }

    // Step 6: Save refresh token in persistent encrypted storage
    try {
      await saveStoredRefreshToken(tokens.refresh_token);
    } catch (saveErr: any) {
      return {
        success: false,
        message: "Wystąpił błąd trwałego zapisu tokenu na serwerze.",
        calendarId,
        accountEmail: authenticatedEmail,
        hasRefreshToken: false,
        error: saveErr?.message || "Błąd zapisu w trwałym magazynie serwera.",
      };
    }

    // Step 7: Verify full end-to-end connection
    const verification = await verifyCalendarConnection();

    return {
      success: verification.ready,
      message: verification.ready
        ? `Pomyślnie połączono kalendarz gabinetu (${SALON_ACCOUNT_EMAIL}). Refresh token został zaszyfrowany i zapisany na serwerze.`
        : `Token został zapisany, ale test połączenia zwrócił ostrzeżenie: ${verification.error}`,
      calendarId,
      accountEmail: authenticatedEmail,
      hasRefreshToken: true,
      verification,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Błąd wymiany kodu autoryzacji Google: ${err.message}`,
      calendarId,
      accountEmail: SALON_ACCOUNT_EMAIL,
      hasRefreshToken: false,
      error: err.message,
    };
  }
}
