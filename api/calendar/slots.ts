import type { IncomingMessage, ServerResponse } from "node:http";

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
  calendarAccount?: string;
  updatedAt?: string;
}

const RAW_EVENTS_URL = "https://raw.githubusercontent.com/przysieznybartosz-bot/slow-skin-concept/main/google_calendar_events.json";

// Default known synchronized events (Friday 16.10 busy schedule)
const DEFAULT_EVENTS: GoogleCalendarStoredEvent[] = [
  {
    id: "gcal-1016-slowskin-full",
    summary: "Termin zajęty w kalendarzu gabinetu",
    start: "2026-10-16T10:00:00+02:00",
    end: "2026-10-16T19:30:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "10:00",
    endTimeStr: "19:30",
    isAllDay: true,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T22:30:00.000Z"
  }
];

let cachedEvents: GoogleCalendarStoredEvent[] = [...DEFAULT_EVENTS];
let lastCacheTime = 0;

async function getLiveGoogleEvents(): Promise<GoogleCalendarStoredEvent[]> {
  const now = Date.now();
  if (cachedEvents.length > 0 && now - lastCacheTime < 15_000) {
    return cachedEvents;
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
      if (Array.isArray(data)) {
        cachedEvents = data;
        lastCacheTime = now;
        return cachedEvents;
      }
    }
  } catch {
    // fallback to cache
  }
  return cachedEvents.length > 0 ? cachedEvents : DEFAULT_EVENTS;
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

    const allEvents = await getLiveGoogleEvents();
    const specificEvents = allEvents.filter((ev) => ev.dateStr === dateStr);

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
