import type { IncomingMessage, ServerResponse } from "node:http";
import { executeBookingWorkflow } from "../../src/server/bookingWorkflow.js";

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Idempotency-Key");
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

  if (req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      const idempotencyKey =
        (req.headers?.["idempotency-key"] as string) || data.idempotencyKey;

      const result = await executeBookingWorkflow({
        ...data,
        idempotencyKey,
      });

      if (!result.success) {
        return sendJson(res, result.statusCode, {
          success: false,
          error: result.error,
          bookingId: result.bookingId,
        });
      }

      return sendJson(res, 201, {
        success: true,
        bookingId: result.bookingId,
        eventId: result.eventId,
        calendarId: result.calendarId,
        htmlLink: result.htmlLink,
        googleAccount: result.googleAccount,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return sendJson(res, 500, {
        success: false,
        error: err.message || "Błąd zapisu rezerwacji.",
      });
    }
  }

  return sendJson(res, 405, { error: "Metoda niedozwolona" });
}
