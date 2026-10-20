import type { IncomingMessage, ServerResponse } from "node:http";
import { generateAdminAuthUrl, getEffectiveOAuthCredentials, resolveRedirectUri } from "../../../src/server/googleOAuthService.js";
import { verifyAdminRequest, serializeCookie } from "../../../src/server/adminAuth.js";

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Pin");
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  // 1. Enforce strict administrator authorization.
  // Unauthenticated requests or requests with invalid/unconfigured PIN are blocked.
  const adminCheck = verifyAdminRequest(req);
  if (!adminCheck.isAdmin) {
    return sendJson(res, 401, {
      success: false,
      error: adminCheck.error || "Brak autoryzacji administratora gabinetu. Rozpoczęcie połączenia wymaga aktywnej sesji administratora.",
    });
  }

  // 2. Resolve redirect URI strictly from explicit configuration without trusting arbitrary Host header
  const redirectUri = resolveRedirectUri();
  const { clientSecret, clientId } = getEffectiveOAuthCredentials(redirectUri);

  if (!clientSecret) {
    return sendJson(res, 400, {
      success: false,
      error: "Brak GOOGLE_CLIENT_SECRET w zmiennych środowiskowych serwera.",
      configuredClientId: clientId,
      requiredRedirectUri: redirectUri,
      instruction:
        "Wprowadź GOOGLE_CLIENT_SECRET w panelu Vercel (Environment Variables), a następnie ponów autoryzację.",
    });
  }

  try {
    const { url, state, stateExpiresAt, codeVerifier } = await generateAdminAuthUrl({
      sessionId: adminCheck.sessionId,
      customRedirectUri: redirectUri,
    });

    const isHttps = process.env.NODE_ENV === "production" || !redirectUri.includes("localhost");

    // Set secure HttpOnly cookies for both state and PKCE verifier (10 minute TTL)
    const stateCookie = serializeCookie("slowskin_oauth_state", state, {
      maxAge: 600,
      httpOnly: true,
      secure: isHttps,
      sameSite: "Lax",
      path: "/",
    });

    const pkceCookie = serializeCookie("slowskin_oauth_pkce", codeVerifier, {
      maxAge: 600,
      httpOnly: true,
      secure: isHttps,
      sameSite: "Lax",
      path: "/",
    });

    res.setHeader("Set-Cookie", [stateCookie, pkceCookie]);

    // If request accepts HTML or accessed directly via browser link, redirect to Google consent
    const accept = req.headers?.accept || "";
    if (accept.includes("text/html")) {
      res.writeHead(302, { Location: url });
      res.end();
      return;
    }

    return sendJson(res, 200, {
      success: true,
      url,
      redirectUri,
      state,
      expiresAt: stateExpiresAt,
      pkceEnforced: true,
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      success: false,
      error: err.message || "Błąd generowania adresu autoryzacji Google.",
    });
  }
}
