import type { IncomingMessage, ServerResponse } from "node:http";
import { sendJson, parseJsonBody } from "./_shared.js";

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
