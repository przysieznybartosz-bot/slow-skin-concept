import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { insertBookingIntoSalonCalendar } from "../../src/server/googleCalendarBackend";

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

const BOOKINGS_DB_FILE = path.join(process.cwd(), "bookings_db.json");

function saveBookingLocally(booking: any) {
  try {
    let list: any[] = [];
    if (fs.existsSync(BOOKINGS_DB_FILE)) {
      list = JSON.parse(fs.readFileSync(BOOKINGS_DB_FILE, "utf-8"));
    }
    list.push(booking);
    fs.writeFileSync(BOOKINGS_DB_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[api/calendar/bookings] Error saving to bookings_db.json:", err);
  }
}

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST") {
    try {
      const data = await parseJsonBody(req);
      if (!data || !data.treatmentName || !data.dateStr || !data.timeStr || !data.clientName || !data.clientPhone) {
        return sendJson(res, 400, {
          success: false,
          error: "Brak wymaganych danych rezerwacji (imię, telefon, zabieg, data, godzina).",
        });
      }

      // Insert directly into verified Google Calendar of the salon
      const googleResult = await insertBookingIntoSalonCalendar({
        treatmentName: data.treatmentName,
        durationMinutes: data.durationMinutes || 75,
        price: data.price || "Cena do potwierdzenia",
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail || "",
        dateStr: data.dateStr,
        timeStr: data.timeStr,
        notes: data.notes,
        isOnlineConsultation: !!data.isOnlineConsultation,
      });

      if (!googleResult.success) {
        // Confirmation is strictly forbidden without verified Google write
        return sendJson(res, 502, {
          success: false,
          error: `Nie udało się zapisać rezerwacji w Kalendarzu Google gabinetu: ${googleResult.error}`,
        });
      }

      const bookingRecord = {
        id: `booking-${Date.now()}`,
        treatmentName: data.treatmentName,
        durationMinutes: data.durationMinutes || 75,
        price: data.price,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        dateStr: data.dateStr,
        timeStr: data.timeStr,
        notes: data.notes,
        isOnlineConsultation: !!data.isOnlineConsultation,
        eventId: googleResult.eventId,
        calendarId: googleResult.calendarId,
        htmlLink: googleResult.htmlLink,
        googleCalendarSynced: true,
        createdAt: new Date().toISOString(),
      };

      saveBookingLocally(bookingRecord);

      return sendJson(res, 201, {
        success: true,
        message: `Rezerwacja na zabieg "${data.treatmentName}" została pomyślnie zapisana w Kalendarzu Google gabinetu.`,
        booking: bookingRecord,
      });
    } catch (err: any) {
      return sendJson(res, 500, {
        success: false,
        error: err.message || "Błąd serwera podczas zapisu rezerwacji.",
      });
    }
  }

  return sendJson(res, 405, { error: "Metoda niedozwolona" });
}
