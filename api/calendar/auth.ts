import type { IncomingMessage, ServerResponse } from "node:http";
import {
  verifyCalendarConnection,
  saveStoredRefreshToken,
  getStoredRefreshToken,
  removeStoredRefreshToken,
  SALON_ACCOUNT_EMAIL,
  getActiveCalendarId,
} from "../../src/server/googleCalendarBackend.js";
import { verifyAdminRequest } from "../../src/server/adminAuth.js";
import fs from "node:fs";
import path from "node:path";

function getFirebaseConfig(): { oAuthClientId?: string; [key: string]: any } {
  try {
    const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
  } catch {
    // ignore
  }
  return {};
}
const firebaseConfig = getFirebaseConfig();

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Pin");
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
    return sendJson(res, 200, { ok: true });
  }

  // All operations on /api/calendar/auth (GET detailed config, POST token, DELETE disconnect)
  // strictly require administrator authorization.
  const adminCheck = verifyAdminRequest(req);
  if (!adminCheck.isAdmin) {
    return sendJson(res, 401, {
      success: false,
      error: "Brak uprawnień administratora gabinetu. Operacja wymaga zalogowania w panelu personelu.",
    });
  }

  if (req.method === "GET") {
    const status = await verifyCalendarConnection();
    const hasRefreshToken = !!getStoredRefreshToken();
    const clientId = process.env.GOOGLE_CLIENT_ID || firebaseConfig.oAuthClientId;
    const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;

    return sendJson(res, 200, {
      accountEmail: SALON_ACCOUNT_EMAIL,
      calendarId: getActiveCalendarId(),
      connected: status.ready,
      authMethod: status.authMethod,
      config: {
        hasClientId: !!clientId,
        clientIdSnippet: clientId ? `${clientId.substring(0, 12)}...` : null,
        hasClientSecret,
        hasRefreshToken,
      },
      error: status.error,
      instructions: status.instructions,
    });
  }

  if (req.method === "POST") {
    const body = await parseJsonBody(req);
    const { refreshToken } = body;

    if (!refreshToken || typeof refreshToken !== "string" || !refreshToken.trim()) {
      return sendJson(res, 400, {
        error: "Wymagany parametr 'refreshToken' (niepusty ciąg znaków).",
      });
    }

    try {
      await saveStoredRefreshToken(refreshToken);
    } catch (saveErr: any) {
      return sendJson(res, 500, {
        success: false,
        error: saveErr?.message || "Błąd zapisu tokenu w trwałym magazynie serwera.",
      });
    }

    const testResult = await verifyCalendarConnection();

    return sendJson(res, 200, {
      success: testResult.ready,
      message: testResult.ready
        ? "Refresh token został zaszyfrowany i zapisany pomyślnie. Kalendarz Google gabinetu jest aktywny."
        : `Refresh token zapisany, ale test połączenia zwrócił błąd: ${testResult.error}`,
      verification: testResult,
    });
  }

  if (req.method === "DELETE") {
    try {
      await removeStoredRefreshToken();
      return sendJson(res, 200, {
        success: true,
        message: "Kalendarz Google został odłączony, a zapisany token trwale usunięty.",
      });
    } catch (err: any) {
      return sendJson(res, 500, {
        success: false,
        error: err.message || "Błąd usuwania tokenu.",
      });
    }
  }

  return sendJson(res, 405, { error: "Metoda niedozwolona" });
}
