import type { IncomingMessage, ServerResponse } from "node:http";
import { verifyCalendarConnection, SALON_ACCOUNT_EMAIL, getActiveCalendarId } from "../../src/server/googleCalendarBackend";

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
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

  try {
    const status = await verifyCalendarConnection();
    return sendJson(res, 200, {
      googleAccount: SALON_ACCOUNT_EMAIL,
      calendarId: getActiveCalendarId(),
      connected: status.ready,
      authMethod: status.authMethod,
      operatingHours: {
        weekdays: "10:00 — 19:30",
        saturday: "Nieczynne",
        sunday: "Nieczynne",
      },
      bufferMinutes: 15,
      error: status.error,
      instructions: status.instructions,
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      googleAccount: SALON_ACCOUNT_EMAIL,
      calendarId: getActiveCalendarId(),
      connected: false,
      error: err.message || "Błąd sprawdzania statusu kalendarza Google.",
    });
  }
}
