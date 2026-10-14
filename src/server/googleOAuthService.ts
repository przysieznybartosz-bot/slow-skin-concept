import { google } from "googleapis";
import firebaseConfig from "../../firebase-applet-config.json" with { type: "json" };
import {
  saveStoredRefreshToken,
  verifyCalendarConnection,
  getActiveCalendarId,
  SALON_ACCOUNT_EMAIL,
} from "./googleCalendarBackend.js";

export const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export function getEffectiveOAuthCredentials(reqOrigin?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID || firebaseConfig.oAuthClientId;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  // Priority for redirect URI:
  // 1. Explicit GOOGLE_REDIRECT_URI env var
  // 2. If running on slow-skin-concept.pl -> https://slow-skin-concept.pl/api/calendar/auth/callback
  // 3. Current request origin + /api/calendar/auth/callback
  let redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!redirectUri) {
    if (reqOrigin && (reqOrigin.includes("slow-skin-concept.pl") || reqOrigin.includes("vercel.app"))) {
      redirectUri = "https://slow-skin-concept.pl/api/calendar/auth/callback";
    } else if (reqOrigin) {
      redirectUri = `${reqOrigin}/api/calendar/auth/callback`;
    } else {
      redirectUri = "https://slow-skin-concept.pl/api/calendar/auth/callback";
    }
  }

  return { clientId, clientSecret, redirectUri };
}

export function getOAuth2Client(reqOrigin?: string) {
  const { clientId, clientSecret, redirectUri } = getEffectiveOAuthCredentials(reqOrigin);
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function generateAdminAuthUrl(reqOrigin?: string): { url: string; redirectUri: string } {
  const oauth2Client = getOAuth2Client(reqOrigin);
  const { redirectUri } = getEffectiveOAuthCredentials(reqOrigin);

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Force to always return refresh_token
    scope: CALENDAR_SCOPES,
    redirect_uri: redirectUri,
  });

  return { url, redirectUri };
}

export async function handleOAuthCallback(code: string, reqOrigin?: string): Promise<{
  success: boolean;
  message: string;
  calendarId: string;
  hasRefreshToken: boolean;
  verification?: any;
  error?: string;
}> {
  const oauth2Client = getOAuth2Client(reqOrigin);
  const calendarId = getActiveCalendarId();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token) {
      return {
        success: false,
        message: "Google nie zwróciło refresh tokenu (prawdopodobnie pominięto ekran zgody prompt=consent).",
        calendarId,
        hasRefreshToken: false,
        error: "Brak refresh_token w odpowiedzi Google OAuth.",
      };
    }

    saveStoredRefreshToken(tokens.refresh_token);

    // Verify connection immediately
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Test access to the designated salon calendar ID
    let calendarFound = false;
    try {
      const getCal = await calendar.calendars.get({ calendarId });
      if (getCal.status === 200) {
        calendarFound = true;
      }
    } catch (calErr: any) {
      console.warn(`[OAuth] Designated calendar ID ${calendarId} check notice:`, calErr.message);
    }

    const verification = await verifyCalendarConnection();

    return {
      success: verification.ready,
      message: verification.ready
        ? `Pomyślnie autoryzowano kalendarz gabinetu (${SALON_ACCOUNT_EMAIL}). Refresh token został bezpiecznie zapisany na serwerze.`
        : `Token został zapisany, ale test połączenia zwrócił błąd: ${verification.error}`,
      calendarId,
      hasRefreshToken: true,
      verification,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Błąd wymiany kodu autoryzacji Google: ${err.message}`,
      calendarId,
      hasRefreshToken: false,
      error: err.message,
    };
  }
}
