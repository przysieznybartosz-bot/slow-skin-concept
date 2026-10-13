import type { IncomingMessage, ServerResponse } from "node:http";

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
      const booking = await parseJsonBody(req);
      if (!booking || !booking.treatmentName || !booking.dateStr || !booking.timeStr) {
        return sendJson(res, 400, { error: "Brak wymaganych danych rezerwacji." });
      }

      return sendJson(res, 201, {
        success: true,
        message: `Rezerwacja na zabieg "${booking.treatmentName}" została przyjęta.`,
        booking: {
          id: `booking-${Date.now()}`,
          ...booking,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      return sendJson(res, 500, { error: err.message || "Błąd zapisu rezerwacji." });
    }
  }

  return sendJson(res, 405, { error: "Metoda niedozwolona" });
}
