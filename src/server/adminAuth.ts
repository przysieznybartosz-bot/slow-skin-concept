import crypto from "node:crypto";
import type { IncomingMessage } from "node:http";

/**
 * Moduł uwierzytelniania administratora gabinetu Slow Skin Concept.
 * 
 * Zasady:
 * 1. Osobny, losowy sekret sesji administratora (ADMIN_JWT_SECRET) o entropii co najmniej 256 bitów
 *    (minimum 32 bajty binarne lub 64 znaki szesnastkowe hex).
 *    Sekret podpisywania sesji NIGDY nie jest wyprowadzany z ADMIN_PIN ani z GOOGLE_CLIENT_SECRET.
 * 2. Ochrona przed atakiem brute-force / zgadywaniem PIN-u:
 *    Maksymalnie 5 błędnych prób w oknie 15 minut. Po 5 próbach następuje czasowa blokada
 *    danego adresu IP na 15 minut (kod HTTP 429).
 *    ADMIN_PIN służy WYŁĄCZNIE do uwierzytelnienia logowania personelu, nie do podpisywania danych.
 * 3. PKCE (RFC 7636, S256) dla bezpiecznego przepływu Google OAuth.
 * 4. Kryptograficzny jednorazowy state powiązany z sesją, wygasający po 10 minutach.
 */

// Zwraca klucz do podpisywania tokenów sesji i stanów OAuth.
// WYMAGA niezależnego ADMIN_JWT_SECRET o entropii >= 256 bitów.
export function getServerAuthSecret(): string | null {
  const secret =
    process.env.ADMIN_JWT_SECRET?.trim() ||
    process.env.ADMIN_SECRET?.trim();

  if (secret) {
    // Sprawdzenie entropii: co najmniej 256 bitów (32 bajty binarne lub 64 znaki hex lub 32+ znaki utf8)
    const isHex64 = /^[0-9a-fA-F]{64}$/.test(secret);
    const byteLength = isHex64 ? 32 : Buffer.byteLength(secret, "utf8");
    if (byteLength < 32 && process.env.NODE_ENV !== "test") {
      throw new Error(
        "ADMIN_JWT_SECRET nie spełnia wymogu bezpieczeństwa: wymaga co najmniej 256 bitów entropii (min. 32 bajty binarne lub 64 znaki hex)."
      );
    }
    return secret;
  }

  // W środowisku testowym pozwalamy na dedykowany klucz testowy o pełnej entropii 256 bitów
  if (process.env.NODE_ENV === "test") {
    return "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e";
  }

  return null;
}

export interface AdminSession {
  role: "admin";
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
}

export interface OAuthStatePayload {
  id: string; // Unikalny identyfikator stanu
  sessionId: string;
  redirectUri: string;
  codeChallenge?: string;
  issuedAt: number;
  expiresAt: number;
}

// Magazyn zużytych stanów OAuth w pamięci
const usedStateIds = new Set<string>();

// ============================================================================
// Ochrona przed brute-force / zgadywaniem PIN-u (Rate Limiter & Lockout)
// ============================================================================
interface LoginAttemptRecord {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
}

const loginAttemptsByIp = new Map<string, LoginAttemptRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minut okno
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minut blokada po przekroczeniu limitu

export function checkLoginRateLimit(clientIp: string): {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
} {
  const now = Date.now();
  const record = loginAttemptsByIp.get(clientIp);
  if (!record) {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }

  // Sprawdzenie czy trwa aktywna blokada
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
  }

  // Jeśli okno czasowe minęło, czyścimy
  if (now - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    loginAttemptsByIp.delete(clientIp);
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }

  const attemptsLeft = Math.max(0, MAX_FAILED_ATTEMPTS - record.attempts);
  return { isLocked: false, remainingSeconds: 0, attemptsLeft };
}

export function recordFailedLogin(clientIp: string): {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
} {
  const now = Date.now();
  let record = loginAttemptsByIp.get(clientIp);
  if (!record || now - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    record = {
      attempts: 1,
      firstAttemptAt: now,
      lockedUntil: null,
    };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttemptsByIp.set(clientIp, record);
    return {
      isLocked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsLeft: 0,
    };
  }

  loginAttemptsByIp.set(clientIp, record);
  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft: MAX_FAILED_ATTEMPTS - record.attempts,
  };
}

export function recordSuccessfulLogin(clientIp: string): void {
  loginAttemptsByIp.delete(clientIp);
}

// ============================================================================
// Obsługa ciasteczek i sesji administratora
// ============================================================================
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [name, ...valParts] = pair.trim().split("=");
    if (name) {
      cookies[name] = decodeURIComponent(valParts.join("="));
    }
  }
  return cookies;
}

export function buildCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    maxAgeSeconds?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None" | string;
    path?: string;
  } = {}
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  const maxAge = options.maxAge ?? options.maxAgeSeconds;
  if (maxAge !== undefined) {
    parts.push(`Max-Age=${maxAge}`);
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  } else {
    parts.push("Path=/");
  }
  if (options.httpOnly !== false) {
    parts.push("HttpOnly");
  }
  if (options.secure) {
    parts.push("Secure");
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join("; ");
}

export { buildCookie as serializeCookie };

/**
 * Podpisuje payload z użyciem HMAC-SHA256
 */
export function signPayload(data: string): string {
  const secret = getServerAuthSecret();
  if (!secret) {
    throw new Error(
      "Brak klucza autoryzacji serwera (ADMIN_JWT_SECRET, ADMIN_SECRET lub ADMIN_PIN). Operacja zablokowana."
    );
  }
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * Tworzy podpisany token sesji administratora (ważny 24 godziny)
 */
export function createAdminSessionToken(sessionId: string): string | null {
  const secret = getServerAuthSecret();
  if (!secret) {
    return null;
  }

  const now = Date.now();
  const session: AdminSession = {
    role: "admin",
    sessionId,
    issuedAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000,
  };

  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

/**
 * Weryfikuje podpisany token sesji administratora
 */
export function verifyAdminSessionToken(token?: string): AdminSession | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  let expectedSig: string;
  try {
    expectedSig = signPayload(payload);
  } catch {
    return null;
  }

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const raw = Buffer.from(payload, "base64url").toString("utf-8");
    const session: AdminSession = JSON.parse(raw);
    if (session.role !== "admin" || !session.expiresAt || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Sprawdza poprawność podanego PIN-u administratora.
 * Zwraca false jeśli żaden PIN nie został skonfigurowany w zmiennych środowiska.
 */
export function isValidAdminPin(pin: string): boolean {
  if (!pin || typeof pin !== "string") return false;
  const trimmed = pin.trim().toLowerCase();

  const envPins = [
    process.env.ADMIN_PIN?.trim().toLowerCase(),
    process.env.ADMIN_PASSWORD?.trim().toLowerCase(),
  ].filter(Boolean) as string[];

  if (envPins.length === 0) {
    return false;
  }

  return envPins.includes(trimmed);
}

/**
 * Weryfikuje czy żądanie HTTP pochodzi od uwierzytelnionego administratora.
 */
export function verifyAdminRequest(req: IncomingMessage | any): {
  isAdmin: boolean;
  sessionId?: string;
  error?: string;
} {
  const secret = getServerAuthSecret();
  const hasConfiguredPins = Boolean(
    process.env.ADMIN_PIN ||
    process.env.ADMIN_PASSWORD
  );

  if (!secret) {
    return {
      isAdmin: false,
      error: "Brak skonfigurowanego klucza ADMIN_JWT_SECRET o entropii min. 256 bitów w środowisku serwera. Operacja zablokowana.",
    };
  }

  if (!hasConfiguredPins) {
    return {
      isAdmin: false,
      error: "Brak skonfigurowanego poświadczenia ADMIN_PIN administratora w środowisku serwera. Operacja zablokowana.",
    };
  }

  // 1. Sprawdź Cookie: slowskin_admin_session
  const cookieHeader = req.headers?.cookie || "";
  const cookies = parseCookies(cookieHeader);
  const sessionCookie = cookies["slowskin_admin_session"];
  if (sessionCookie) {
    const session = verifyAdminSessionToken(sessionCookie);
    if (session) {
      return { isAdmin: true, sessionId: session.sessionId };
    }
  }

  // 2. Sprawdź nagłówek Authorization: Bearer
  const authHeader = req.headers?.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const session = verifyAdminSessionToken(token);
    if (session) {
      return { isAdmin: true, sessionId: session.sessionId };
    }
    if (isValidAdminPin(token)) {
      return { isAdmin: true, sessionId: "pin-auth" };
    }
  }

  // 3. Sprawdź nagłówek X-Admin-Pin
  const pinHeader = req.headers?.["x-admin-pin"] as string;
  if (pinHeader && isValidAdminPin(pinHeader)) {
    return { isAdmin: true, sessionId: "pin-header" };
  }

  return {
    isAdmin: false,
    error: "Wymagana autoryzacja administratora gabinetu Slow Skin Concept.",
  };
}

/**
 * Generuje parę PKCE code_verifier oraz code_challenge (RFC 7636, SHA-256 base64url)
 */
export function generatePKCE(): {
  codeVerifier: string;
  codeChallenge: string;
} {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { codeVerifier, codeChallenge };
}

/**
 * Sprawdza poprawność code_verifier względem wyzwania code_challenge
 */
export function verifyPKCE(codeVerifier: string, expectedChallenge: string): boolean {
  if (!codeVerifier || !expectedChallenge) return false;
  const computed = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  const compBuf = Buffer.from(computed);
  const expBuf = Buffer.from(expectedChallenge);
  if (compBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(compBuf, expBuf);
}

/**
 * Generuje podpisany parametr OAuth `state` powiązany z sesją, wygasający po 10 minutach.
 * Zapisuje stan w trwałej tabeli Supabase slowskin_oauth_states oraz podpisuje HMAC-SHA256.
 */
export async function generateOAuthState(params: {
  sessionId: string;
  redirectUri: string;
  codeChallenge?: string;
}): Promise<{ state: string; stateId: string; expiresAt: number }> {
  const stateId = crypto.randomBytes(24).toString("hex");
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minut TTL

  const payloadData: OAuthStatePayload = {
    id: stateId,
    sessionId: params.sessionId,
    redirectUri: params.redirectUri,
    codeChallenge: params.codeChallenge,
    issuedAt: now,
    expiresAt,
  };

  const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64url");
  const sig = signPayload(payload);
  const state = `${payload}.${sig}`;

  // Persist to Supabase if configured
  try {
    const { isSupabaseAvailable, saveOAuthStateInSupabase } = await import("./supabaseStore.js");
    if (isSupabaseAvailable()) {
      await saveOAuthStateInSupabase({
        stateId,
        sessionId: params.sessionId,
        redirectUri: params.redirectUri,
        codeChallenge: params.codeChallenge,
        expiresAt,
      });
    }
  } catch (err: any) {
    console.warn("[AdminAuth] Ostrzeżenie zapisu stanu OAuth w bazie Supabase:", err.message);
  }

  return { state, stateId, expiresAt };
}

/**
 * Sprawdza podpis, ważność, unikalność oraz zgodność parametru `state`.
 * Konsumuje stan atomowo w bazie Supabase oraz w pamięci procesu.
 */
export async function validateAndConsumeOAuthState(
  stateParam?: string,
  cookieState?: string
): Promise<{
  valid: boolean;
  payload?: OAuthStatePayload;
  error?: string;
}> {
  if (!stateParam || typeof stateParam !== "string") {
    return { valid: false, error: "Brak parametru 'state' w odpowiedzi autoryzacji Google." };
  }

  const parts = stateParam.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Nieprawidłowy format parametru 'state'." };
  }

  const [payloadStr, sig] = parts;
  let expectedSig: string;
  try {
    expectedSig = signPayload(payloadStr);
  } catch (err: any) {
    return { valid: false, error: err.message || "Błąd weryfikacji podpisu stanu." };
  }

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: "Podrobiony lub nieprawidłowy podpis parametru 'state'." };
  }

  let payload: OAuthStatePayload;
  try {
    payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
  } catch {
    return { valid: false, error: "Błąd dekodowania zawartości parametru 'state'." };
  }

  const now = Date.now();
  if (!payload.expiresAt || payload.expiresAt < now) {
    return { valid: false, error: "Parametr 'state' wygasł (maksymalny czas na autoryzację to 10 minut)." };
  }

  if (usedStateIds.has(payload.id)) {
    return { valid: false, error: "Parametr 'state' został już wcześniej wykorzystany. Proszę rozpocząć proces ponownie." };
  }

  if (cookieState && cookieState !== stateParam) {
    return { valid: false, error: "Niezgodność parametru 'state' z sesją przeglądarki administratora (możliwy atak CSRF)." };
  }

  // Atomically consume in Supabase if available
  try {
    const { isSupabaseAvailable, atomicConsumeOAuthStateInSupabase } = await import("./supabaseStore.js");
    if (isSupabaseAvailable()) {
      const dbResult = await atomicConsumeOAuthStateInSupabase(payload.id);
      if (!dbResult.valid) {
        return {
          valid: false,
          error: dbResult.error || "Stan OAuth odrzucony przez bazę danych Supabase.",
        };
      }
    }
  } catch (err: any) {
    console.warn("[AdminAuth] Błąd atomowej konsumpcji stanu w Supabase:", err.message);
  }

  usedStateIds.add(payload.id);
  return { valid: true, payload };
}
