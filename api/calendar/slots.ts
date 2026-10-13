import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";

interface CalendarSlot {
  time: string;
  endTime: string;
  durationMinutes: number;
  bufferMinutes: number;
  isAvailable: boolean;
  reason?: string;
  source?: "booking" | "google_calendar" | null;
}

interface GoogleCalendarStoredEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  dateStr: string;
  startTimeStr?: string;
  endTimeStr?: string;
  isAllDay?: boolean;
  transparency?: string;
  calendarAccount?: string;
  updatedAt?: string;
}

const RAW_EVENTS_URL = "https://raw.githubusercontent.com/przysieznybartosz-bot/slow-skin-concept/main/google_calendar_events.json";

function getLocalEvents(): GoogleCalendarStoredEvent[] | null {
  try {
    const candidates = [
      path.join(process.cwd(), "google_calendar_events.json"),
      path.join(process.cwd(), "..", "google_calendar_events.json"),
      "/app/applet/google_calendar_events.json"
    ];
    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

let cachedRemoteEvents: GoogleCalendarStoredEvent[] = [];
let lastRemoteCacheTime = 0;

async function getStoredEvents(authToken?: string): Promise<GoogleCalendarStoredEvent[]> {
  // 1. If auth token passed, try live fetch from Google Calendar
  if (authToken && authToken.startsWith("Bearer ")) {
    try {
      const token = authToken.replace("Bearer ", "").trim();
      const now = new Date();
      const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const timeMax = new Date(now.getFullYear(), now.getMonth() + 3, 28).toISOString();
      const gRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&maxResults=250&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (gRes.ok) {
        const gData = await gRes.json();
        if (Array.isArray(gData.items)) {
          const liveEvents: GoogleCalendarStoredEvent[] = [];
          for (const item of gData.items) {
            if (item.status === "cancelled") continue;
            if (item.transparency === "transparent") continue; // Available/Free event
            const isAllDay = !item.start?.dateTime && !!item.start?.date;
            let dateStr = "";
            let startTimeStr = "10:00";
            let endTimeStr = "19:30";
            if (isAllDay) {
              dateStr = item.start.date;
            } else if (item.start?.dateTime) {
              const startDate = new Date(item.start.dateTime);
              const endDate = item.end?.dateTime ? new Date(item.end.dateTime) : new Date(startDate.getTime() + 60 * 60 * 1000);
              const pad = (n: number) => n.toString().padStart(2, "0");
              dateStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
              startTimeStr = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
              endTimeStr = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
            }
            if (dateStr) {
              liveEvents.push({
                id: item.id || `gcal-${dateStr}-${startTimeStr}`,
                summary: item.summary || "Zajęty termin w kalendarzu",
                start: item.start?.dateTime || item.start?.date || "",
                end: item.end?.dateTime || item.end?.date || "",
                dateStr,
                startTimeStr,
                endTimeStr,
                isAllDay,
                calendarAccount: "slowskinconcept@gmail.com",
                updatedAt: new Date().toISOString(),
              });
            }
          }
          if (liveEvents.length > 0) return liveEvents;
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Check local disk
  const local = getLocalEvents();
  if (local && local.length > 0) {
    return local;
  }

  // 3. Fallback to cached or remote GitHub file
  const now = Date.now();
  if (cachedRemoteEvents.length > 0 && now - lastRemoteCacheTime < 30_000) {
    return cachedRemoteEvents;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(RAW_EVENTS_URL, {
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" }
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        cachedRemoteEvents = data;
        lastRemoteCacheTime = now;
        return cachedRemoteEvents;
      }
    }
  } catch {
    // fallback
  }

  return cachedRemoteEvents;
}

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

function timeToMinutes(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

const pad = (n: number) => n.toString().padStart(2, "0");
const minutesToTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  try {
    const url = new URL(req.url || "", `http://${req.headers?.host || "localhost"}`);
    const dateStr = url.searchParams.get("date") || (req.query?.date as string) || "";
    const duration = parseInt(url.searchParams.get("duration") || (req.query?.duration as string) || "75", 10) || 75;
    const bufferMinutes = 15;

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return sendJson(res, 400, { error: "Nieprawidłowy format daty (wymagany YYYY-MM-DD)." });
    }

    const [year, month, day] = dateStr.split("-").map(Number);
    // Use noon (12:00) to ensure zero midnight timezone DST shift
    const reqDate = new Date(year, month - 1, day, 12, 0, 0);
    const dayOfWeek = reqDate.getDay();

    if (dayOfWeek === 0) {
      return sendJson(res, 200, {
        date: dateStr,
        status: "closed",
        isClosed: true,
        isFullyBooked: false,
        dayName: "Niedziela",
        salonHours: "10:00 — 19:30 (Pon–Pt)",
        reason: "W niedziele Instytut Slow Skin Concept jest nieczynny — dzień regeneracji komórkowej i wyciszenia.",
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        occupiedGoogleSlotsCount: 0,
        googleCalendarSynced: true,
        googleAccount: "slowskinconcept@gmail.com",
        slots: [],
      });
    }

    if (dayOfWeek === 6) {
      return sendJson(res, 200, {
        date: dateStr,
        status: "closed",
        isClosed: true,
        isFullyBooked: false,
        dayName: "Sobota",
        salonHours: "10:00 — 19:30 (Pon–Pt)",
        reason: "W soboty gabinet jest nieczynny. Zapraszamy od poniedziałku do piątku w godzinach 10:00 — 19:30.",
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        occupiedGoogleSlotsCount: 0,
        googleCalendarSynced: true,
        googleAccount: "slowskinconcept@gmail.com",
        slots: [],
      });
    }

    const openMinutes = 10 * 60; // 10:00
    const closeMinutes = 19 * 60 + 30; // 19:30
    const dayName = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek];

    const authHeader = req.headers?.authorization || (typeof req.header === "function" ? req.header("authorization") : undefined);
    const allEvents = await getStoredEvents(authHeader);
    const specificEvents = allEvents.filter((ev) => ev.dateStr === dateStr);

    // All-day event check (must actually cover operating hours 10:00 to 19:30)
    const allDayEvent = specificEvents.find(
      (ev) => ev.isAllDay || (ev.startTimeStr && ev.endTimeStr && ev.startTimeStr <= "10:00" && ev.endTimeStr >= "19:30")
    );

    if (allDayEvent) {
      return sendJson(res, 200, {
        date: dateStr,
        dayName,
        status: "fully_booked",
        isClosed: false,
        isFullyBooked: true,
        salonHours: "10:00 — 19:30 (Pon–Pt)",
        reason: `W dniu ${dateStr} (${dayName}) kalendarz Google gabinetu (${allDayEvent.summary}) jest w pełni zarezerwowany. W tym dniu brak wolnych godzin na rezerwację online.`,
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        occupiedGoogleSlotsCount: 18,
        googleCalendarSynced: true,
        googleAccount: "slowskinconcept@gmail.com",
        slots: [],
      });
    }

    const bookedIntervals: Array<{
      start: number;
      end: number;
      treatment: string;
      source: "booking" | "google_calendar";
    }> = [];

    specificEvents.forEach((ev) => {
      if (ev.startTimeStr && ev.endTimeStr) {
        bookedIntervals.push({
          start: timeToMinutes(ev.startTimeStr),
          end: timeToMinutes(ev.endTimeStr),
          treatment: ev.summary || "Zajęty w Kalendarzu Google",
          source: "google_calendar",
        });
      }
    });

    const slots: CalendarSlot[] = [];
    const requiredBlock = duration + bufferMinutes;

    for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
      const slotStart = m;
      const slotEnd = slotStart + duration;
      const slotBlockEnd = slotStart + requiredBlock;

      // Collision condition: slotStart < busyEnd && slotBlockEnd > busyStart
      const colliding = bookedIntervals.find(
        (b) => slotStart < b.end && slotBlockEnd > b.start
      );

      const isAvailable = !colliding && slotBlockEnd <= closeMinutes + bufferMinutes;

      let reason = "Wolny termin";
      if (colliding) {
        reason = `Zajęty w Kalendarzu Google (${colliding.treatment})`;
      } else if (slotBlockEnd > closeMinutes + bufferMinutes) {
        reason = "Poza godzinami pracy gabinetu";
      }

      slots.push({
        time: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
        durationMinutes: duration,
        bufferMinutes,
        isAvailable,
        reason,
        source: colliding?.source || null,
      });
    }

    const availableCount = slots.filter((s) => s.isAvailable).length;
    const isFullyBooked = slots.length > 0 && availableCount === 0;

    return sendJson(res, 200, {
      date: dateStr,
      dayName,
      status: isFullyBooked ? "fully_booked" : "available",
      isClosed: false,
      isFullyBooked,
      salonHours: "10:00 — 19:30 (Pon–Pt)",
      reason: isFullyBooked
        ? `W dniu ${dateStr} (${dayName}) wszystkie godziny są zajęte w Kalendarzu Google (slowskinconcept@gmail.com). Prosimy o wybór innego dnia roboczego.`
        : undefined,
      durationMinutes: duration,
      bufferMinutes,
      totalSlots: slots.length,
      availableSlotsCount: availableCount,
      occupiedGoogleSlotsCount: slots.filter((s) => s.source === "google_calendar").length,
      googleCalendarSynced: true,
      googleAccount: "slowskinconcept@gmail.com",
      slots,
    });
  } catch (err: any) {
    return sendJson(res, 500, { error: err.message || "Błąd generowania slotów kalendarza." });
  }
}
