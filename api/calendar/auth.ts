import type { IncomingMessage, ServerResponse } from "node:http";
import {
  verifyCalendarConnection,
  saveStoredRefreshToken,
  getStoredRefreshToken,
  SALON_ACCOUNT_EMAIL,
  getActiveCalendarId,
} from "../../src/server/googleCalendarBackend";
import firebaseConfig from "../../firebase-applet-config.json";

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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

    if (!refreshToken || typeof refreshToken !== "string") {
      return sendJson(res, 400, {
        error: "Wymagany parametr 'refreshToken' (string).",
      });
    }

    saveStoredRefreshToken(refreshToken);
    const testResult = await verifyCalendarConnection();

    return sendJson(res, 200, {
      success: testResult.ready,
      message: testResult.ready
        ? "Refresh token zapisany pomyślnie. Kalendarz Google gabinetu jest aktywny."
        : `Refresh token zapisany, ale test połączenia zwrócił błąd: ${testResult.error}`,
      verification: testResult,
    });
  }

  return sendJson(res, 405, { error: "Metoda niedozwolona" });
}
