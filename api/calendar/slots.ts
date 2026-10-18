import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { getLiveAvailableSlots } from "../../src/server/googleCalendarBackend.js";

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

function getStoredLocalBookings(dateStr: string): Array<{ timeStr: string; durationMinutes: number }> {
  try {
    const candidates = [
      path.join(process.cwd(), "bookings_db.json"),
      path.join(process.cwd(), "..", "bookings_db.json"),
      "/app/applet/bookings_db.json",
    ];
    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((b) => b.dateStr === dateStr)
            .map((b) => ({
              timeStr: b.timeStr,
              durationMinutes: b.durationMinutes || 75,
            }));
        }
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  try {
    const url = new URL(req.url || "", `http://${req.headers?.host || "localhost"}`);
    const dateStr = url.searchParams.get("date") || (req.query?.date as string) || "";
    const duration = parseInt(url.searchParams.get("duration") || (req.query?.duration as string) || "75", 10) || 75;

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return sendJson(res, 400, {
        success: false,
        status: "sync_error",
        error: "Nieprawidłowy format daty (wymagany YYYY-MM-DD).",
        googleCalendarSynced: false,
        slots: [],
      });
    }

    const localBookings = getStoredLocalBookings(dateStr);
    const result = await getLiveAvailableSlots(dateStr, duration, localBookings);

    // If Google Calendar call failed and day is a weekday (needs real synchronization)
    if (!result.success && result.status === "sync_error") {
      return sendJson(res, 503, result);
    }

    return sendJson(res, 200, result);
  } catch (err: any) {
    return sendJson(res, 500, {
      success: false,
      status: "sync_error",
      error: err.message || "Błąd generowania slotów kalendarza.",
      googleCalendarSynced: false,
      lastSuccessfulSyncAt: null,
      slots: [],
    });
  }
}
