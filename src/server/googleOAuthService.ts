import crypto from "node:crypto";
import { google } from "googleapis";
import { BACKEND_CLIENT_ID, SALON_EMAIL, required, encryptionKey, database, session, cookie, signed, unsign, setCookie, json, writeRefreshToken } from "./calendarAuth.js";

export function getEffectiveOAuthCredentials(_origin?: string) {
  const clientId = required("GOOGLE_CLIENT_ID");
  if (clientId !== BACKEND_CLIENT_ID) throw new Error("Nieprawidłowy GOOGLE_CLIENT_ID: wymagany klient backendu gabinetu.");
  const clientSecret = required("GOOGLE_CLIENT_SECRET");
  const redirectUri = required("GOOGLE_REDIRECT_URI");
  const redirect = new URL(redirectUri);
  if (redirect.protocol !== "https:" || redirect.pathname !== "/api/calendar/auth/callback" || redirect.search || redirect.hash) throw new Error("Nieprawidłowy GOOGLE_REDIRECT_URI.");
  return { clientId, clientSecret, redirectUri };
}

export async function oauthLogin(req: any, res: any) {
  try {
    if (req.method !== "GET") return json(res, 405, { error: "Metoda niedozwolona." });
    const admin = session(req);
    if (!admin) return json(res, 401, { error: "Zaloguj się PIN-em w panelu personelu." });
    const { clientId, clientSecret, redirectUri } = getEffectiveOAuthCredentials();
    if (new URL(redirectUri).host !== req.headers.host) throw new Error("Adres callback musi należeć do bieżącego środowiska. Otwórz panel we właściwej domenie.");
    encryptionKey();
    const state = crypto.randomBytes(32).toString("base64url");
    const verifier = crypto.randomBytes(32).toString("base64url");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    await database("slowskin_oauth_states", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({
      state_id: state, session_id: admin.sid, redirect_uri: redirectUri, code_challenge: challenge,
      expires_at: new Date(Date.now() + 600000).toISOString(),
    }) });
    setCookie(res, "slowskin_oauth_attempt", signed({ type: "oauth", state, verifier, sid: admin.sid, exp: Date.now() + 600000 }), 600);
    const oauth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const url = oauth.generateAuthUrl({ access_type: "offline", prompt: "consent select_account", login_hint: SALON_EMAIL,
      scope: ["openid", "email", "https://www.googleapis.com/auth/calendar.readonly", "https://www.googleapis.com/auth/calendar.events"],
      state, code_challenge: challenge, code_challenge_method: "S256" as any });
    res.setHeader("Cache-Control", "no-store");
    if (String(req.headers.accept || "").includes("text/html")) {
      res.statusCode = 302; res.setHeader("Location", url); return res.end();
    }
    return json(res, 200, { success: true, authUrl: url });
  } catch (error) { return json(res, 503, { error: error instanceof Error ? error.message : "Błąd rozpoczęcia OAuth." }); }
}

export async function oauthCallback(req: any, res: any) {
  setCookie(res, "slowskin_oauth_attempt", "", 0);
  try {
    if (req.method !== "GET") return json(res, 405, { error: "Metoda niedozwolona." });
    const url = new URL(req.url, "https://localhost");
    const admin = session(req);
    const attempt = unsign(cookie(req, "slowskin_oauth_attempt"));
    const state = url.searchParams.get("state");
    if (!admin || attempt?.type !== "oauth" || attempt.sid !== admin.sid || !state || state !== attempt.state) return json(res, 400, { error: "Nieprawidłowy lub wygasły stan OAuth. Rozpocznij ponownie w panelu." });
    const { clientId, clientSecret, redirectUri } = getEffectiveOAuthCredentials();
    if (new URL(redirectUri).host !== req.headers.host) throw new Error("Niezgodny adres callback.");
    const consumed = await database("rpc/consume_slowskin_oauth_state", { method: "POST", body: JSON.stringify({ p_state_id: state }) });
    const record = consumed?.[0];
    const challenge = crypto.createHash("sha256").update(attempt.verifier).digest("base64url");
    if (!record?.valid || record.session_id !== admin.sid || record.redirect_uri !== redirectUri || record.code_challenge !== challenge) return json(res, 400, { error: "Stan OAuth został odrzucony lub był już użyty." });
    const code = url.searchParams.get("code");
    if (url.searchParams.has("error") || !code) return json(res, 400, { error: "Nie udzielono zgody Google." });
    const oauth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oauth.getToken({ code, codeVerifier: attempt.verifier });
    if (!tokens.id_token || !tokens.refresh_token) throw new Error("Google nie wydało kompletnych poświadczeń offline.");
    const ticket = await oauth.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
    const account = ticket.getPayload();
    if (!account?.email_verified || account.email?.toLowerCase() !== SALON_EMAIL) return json(res, 403, { error: `Dozwolone jest wyłącznie konto ${SALON_EMAIL}.` });
    oauth.setCredentials(tokens);
    const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || SALON_EMAIL;
    await google.calendar({ version: "v3", auth: oauth }).calendars.get({ calendarId }, { timeout: 10000 });
    await writeRefreshToken(tokens.refresh_token, calendarId);
    res.statusCode = 303; res.setHeader("Cache-Control", "no-store");
    res.setHeader("Location", "/?admin=true&calendar=connected"); return res.end();
  } catch (error) {
    // Avoid reflecting Google token responses, authorization codes, or account details.
    console.warn("[CalendarOAuth] Callback failed", error instanceof Error ? error.name : "Error");
    return json(res, 502, { error: "Nie potwierdzono połączenia i trwałego zapisu tokenu. Sprawdź konfigurację serwera oraz magazyn Supabase." });
  }
}
