import type { IncomingMessage, ServerResponse } from "node:http";
import { handleOAuthCallback } from "../../../src/server/googleOAuthService.js";
import { parseCookies, serializeCookie } from "../../../src/server/adminAuth.js";

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  const url = new URL(req.url || "", "http://localhost");
  const code = url.searchParams.get("code") || (req.query?.code as string);
  const state = url.searchParams.get("state") || (req.query?.state as string);
  const errorParam = url.searchParams.get("error") || (req.query?.error as string);

  const cookies = parseCookies(req.headers?.cookie);
  const cookieState = cookies["slowskin_oauth_state"];
  const cookiePkce = cookies["slowskin_oauth_pkce"];

  const isHttps = process.env.NODE_ENV === "production" || !req.headers?.host?.includes("localhost");

  // Clear both OAuth state and PKCE cookies
  const clearStateCookie = serializeCookie("slowskin_oauth_state", "", {
    maxAge: 0,
    httpOnly: true,
    secure: isHttps,
    sameSite: "Lax",
    path: "/",
  });

  const clearPkceCookie = serializeCookie("slowskin_oauth_pkce", "", {
    maxAge: 0,
    httpOnly: true,
    secure: isHttps,
    sameSite: "Lax",
    path: "/",
  });

  res.setHeader("Set-Cookie", [clearStateCookie, clearPkceCookie]);
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (errorParam) {
    res.statusCode = 400;
    res.end(`
      <!DOCTYPE html>
      <html lang="pl">
      <head><meta charset="utf-8"><title>Błąd autoryzacji Google Calendar</title>
      <style>body{font-family:sans-serif;padding:40px;background:#fdfcfb;color:#222;max-width:600px;margin:auto;line-height:1.6}h1{color:#b91c1c}</style>
      </head>
      <body>
        <h1>Błąd autoryzacji Google Calendar</h1>
        <p>Google zwróciło błąd: <strong>${errorParam}</strong></p>
        <p><a href="/admin">← Powrót do panelu administratora</a></p>
      </body>
      </html>
    `);
    return;
  }

  if (!code) {
    res.statusCode = 400;
    res.end(`
      <!DOCTYPE html>
      <html lang="pl">
      <head><meta charset="utf-8"><title>Brak kodu autoryzacji</title>
      <style>body{font-family:sans-serif;padding:40px;background:#fdfcfb;color:#222;max-width:600px;margin:auto;line-height:1.6}</style>
      </head>
      <body>
        <h1>Brak kodu autoryzacji</h1>
        <p>Parametr 'code' nie został przekazany przez Google.</p>
        <p><a href="/admin">← Powrót do panelu administratora</a></p>
      </body>
      </html>
    `);
    return;
  }

  if (!state) {
    res.statusCode = 400;
    res.end(`
      <!DOCTYPE html>
      <html lang="pl">
      <head><meta charset="utf-8"><title>Brak stanu autoryzacji (state)</title>
      <style>body{font-family:sans-serif;padding:40px;background:#fdfcfb;color:#222;max-width:600px;margin:auto;line-height:1.6}</style>
      </head>
      <body>
        <h1>Brak parametru stanu (state)</h1>
        <p>Parametr 'state' jest wymagany ze względów bezpieczeństwa (ochrona przed CSRF).</p>
        <p><a href="/admin">← Powrót do panelu administratora</a></p>
      </body>
      </html>
    `);
    return;
  }

  const result = await handleOAuthCallback({
    code,
    state,
    cookieState,
    codeVerifier: cookiePkce,
  });

  if (result.success) {
    res.statusCode = 200;
    res.end(`
      <!DOCTYPE html>
      <html lang="pl">
      <head><meta charset="utf-8"><title>Autoryzacja Google Calendar zakończona sukcesem</title>
      <style>body{font-family:sans-serif;padding:40px;background:#fcfbf9;color:#1a1918;max-width:640px;margin:auto;line-height:1.6}.card{border:1px solid #e7dfd5;padding:24px;border-radius:4px;background:#fff}.btn{display:inline-block;background:#1a1918;color:#fff;padding:10px 18px;text-decoration:none;border-radius:2px;font-size:13px;margin-top:16px}</style>
      </head>
      <body>
        <div class="card">
          <h2 style="color:#15803d;margin-top:0">✓ Kalendarz Google Połączony Pomyślnie</h2>
          <p>${result.message}</p>
          <p><strong>Konto:</strong> <code>${result.accountEmail}</code></p>
          <p><strong>Identyfikator kalendarza:</strong> <code>${result.calendarId}</code></p>
          <p>Refresh token został zaszyfrowany i zapisany w magazynie serwera. Synchronizacja i blokowanie terminów działają w pełni automatycznie.</p>
          <a class="btn" href="/admin">Przejdź do Panelu Administratora →</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  res.statusCode = result.error?.includes("Nieautoryzowane konto") ? 403 : 400;
  res.end(`
    <!DOCTYPE html>
    <html lang="pl">
    <head><meta charset="utf-8"><title>Odrzucenie autoryzacji kalendarza</title>
    <style>body{font-family:sans-serif;padding:40px;background:#fdfcfb;color:#222;max-width:640px;margin:auto;line-height:1.6}.card{border:1px solid #fecaca;padding:24px;border-radius:4px;background:#fff}</style>
    </head>
    <body>
      <div class="card">
        <h2 style="color:#b91c1c;margin-top:0">✕ Błąd autoryzacji kalendarza Google</h2>
        <p>${result.message}</p>
        ${result.error ? `<pre style="background:#fef2f2;padding:12px;overflow:auto;font-size:12px;color:#991b1b">${result.error}</pre>` : ""}
        <p><a href="/admin">← Powrót do panelu administratora</a></p>
      </div>
    </body>
    </html>
  `);
}
