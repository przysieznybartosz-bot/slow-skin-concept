import type { IncomingMessage, ServerResponse } from "node:http";
import {
  isValidAdminPin,
  createAdminSessionToken,
  serializeCookie,
} from "../../src/server/adminAuth.js";

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

async function parseJsonBody(req: IncomingMessage | any): Promise<any> {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk: any) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Metoda niedozwolona (wymagany POST)." });
  }

  try {
    const body = await parseJsonBody(req);
    const { pin } = body || {};

    if (!pin || typeof pin !== "string" || !pin.trim()) {
      return sendJson(res, 400, { success: false, error: "Wymagany parametr 'pin' (string)." });
    }

    if (!isValidAdminPin(pin)) {
      return sendJson(res, 401, { success: false, error: "Nieprawidłowy PIN administratora gabinetu." });
    }

    const sessionId = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const sessionToken = createAdminSessionToken(sessionId);
    if (!sessionToken) {
      return sendJson(res, 500, {
        success: false,
        error: "Brak skonfigurowanego klucza autoryzacji serwera (ADMIN_JWT_SECRET, ADMIN_SECRET lub GOOGLE_CLIENT_SECRET).",
      });
    }

    const isHttps = req.protocol === "https" || req.headers?.["x-forwarded-proto"] === "https";
    res.setHeader(
      "Set-Cookie",
      serializeCookie("slowskin_admin_session", sessionToken, {
        maxAge: 86400,
        httpOnly: true,
        secure: isHttps,
        sameSite: "Lax",
        path: "/",
      })
    );

    return sendJson(res, 200, {
      success: true,
      message: "Sesja administratora utworzona pomyślnie.",
      sessionId,
    });
  } catch (err: any) {
    return sendJson(res, 500, { success: false, error: err.message || "Błąd logowania administratora." });
  }
}
