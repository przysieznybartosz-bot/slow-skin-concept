import type { IncomingMessage, ServerResponse } from "node:http";
import { generateAdminAuthUrl, getEffectiveOAuthCredentials } from "../../../src/server/googleOAuthService.js";

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

  const host = req.headers?.host || "slow-skin-concept.pl";
  const protocol = req.headers?.["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  const { clientSecret, clientId, redirectUri } = getEffectiveOAuthCredentials(origin);

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
    const { url, redirectUri } = generateAdminAuthUrl(origin);

    // If request accepts HTML or accessed via browser link, redirect directly to Google consent
    const accept = req.headers?.accept || "";
    if (accept.includes("text/html")) {
      res.writeHead(302, { Location: url });
      res.end();
      return;
    }

    return sendJson(res, 200, {
      success: true,
      authUrl: url,
      redirectUri,
      clientId,
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      success: false,
      error: err.message || "Błąd generowania URL autoryzacji Google.",
    });
  }
}
