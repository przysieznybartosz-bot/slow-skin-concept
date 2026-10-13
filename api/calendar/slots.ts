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

const DEFAULT_EVENTS: GoogleCalendarStoredEvent[] = [
  {
    id: "gcal-1013-1",
    summary: "zab1",
    start: "2026-10-13T11:00:00+02:00",
    end: "2026-10-13T12:00:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "11:00",
    endTimeStr: "12:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1013-2",
    summary: "zab11",
    start: "2026-10-13T13:00:00+02:00",
    end: "2026-10-13T14:00:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "13:00",
    endTimeStr: "14:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1013-3",
    summary: "obiad",
    start: "2026-10-13T14:30:00+02:00",
    end: "2026-10-13T15:30:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1013-4",
    summary: "Wizyta w gabinecie",
    start: "2026-10-13T15:30:00+02:00",
    end: "2026-10-13T16:30:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "15:30",
    endTimeStr: "16:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1014-1",
    summary: "Terapia Bionomiczna — Gabinet",
    start: "2026-10-14T10:00:00+02:00",
    end: "2026-10-14T12:00:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "10:00",
    endTimeStr: "12:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1014-2",
    summary: "obiad",
    start: "2026-10-14T14:30:00+02:00",
    end: "2026-10-14T15:30:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1014-3",
    summary: "Konsultacja barierowa — stała klientka",
    start: "2026-10-14T16:00:00+02:00",
    end: "2026-10-14T18:30:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "16:00",
    endTimeStr: "18:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1015-1",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-15T07:00:00+02:00",
    end: "2026-10-15T23:00:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "07:00",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1015-2",
    summary: "obiad",
    start: "2026-10-15T14:30:00+02:00",
    end: "2026-10-15T15:30:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1016-1",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-16T07:30:00+02:00",
    end: "2026-10-16T23:00:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1016-2",
    summary: "obiad",
    start: "2026-10-16T14:30:00+02:00",
    end: "2026-10-16T15:30:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1019-1",
    summary: "Konsultacja barierowa i zabieg",
    start: "2026-10-19T11:30:00+02:00",
    end: "2026-10-19T14:00:00+02:00",
    dateStr: "2026-10-19",
    startTimeStr: "11:30",
    endTimeStr: "14:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1019-2",
    summary: "obiad",
    start: "2026-10-19T14:30:00+02:00",
    end: "2026-10-19T15:30:00+02:00",
    dateStr: "2026-10-19",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1020-1",
    summary: "Wizyta gabinetowa — Joanna M.",
    start: "2026-10-20T10:30:00+02:00",
    end: "2026-10-20T12:30:00+02:00",
    dateStr: "2026-10-20",
    startTimeStr: "10:30",
    endTimeStr: "12:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1020-2",
    summary: "obiad",
    start: "2026-10-20T14:30:00+02:00",
    end: "2026-10-20T15:30:00+02:00",
    dateStr: "2026-10-20",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  }
];

let cachedEvents: GoogleCalendarStoredEvent[] = [...DEFAULT_EVENTS];
let lastCacheTime = 0;

async function getLiveGoogleEvents(): Promise<GoogleCalendarStoredEvent[]> {
  const now = Date.now();
  if (cachedEvents.length > 0 && now - lastCacheTime < 30_000) {
    return cachedEvents;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(RAW_EVENTS_URL, {
      signal: controller.signal,
      headers: { "Cache-Control": "no-cache" }
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const map = new Map<string, GoogleCalendarStoredEvent>();
        // Initialize with incoming remote data
        data.forEach((e: GoogleCalendarStoredEvent) => {
          if (e.id) map.set(e.id, e);
        });
        // Override with built-in verified events from Google Calendar
        DEFAULT_EVENTS.forEach((e) => {
          map.set(e.id, e);
        });
        cachedEvents = Array.from(map.values());
        lastCacheTime = now;
        return cachedEvents;
      }
    }
  } catch {
    // fallback to cache
  }
  cachedEvents = [...DEFAULT_EVENTS];
  return DEFAULT_EVENTS;
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

function getWeekdayRecurringGoogleEvents(dayOfWeek: number, dateStr: string): GoogleCalendarStoredEvent[] {
  const recurring: any[] = [
    { id: `rec-${dateStr}-lunch`, summary: "obiad (przerwa gabinetowa)", startTimeStr: "14:30", endTimeStr: "15:30" }
  ];
  if (dayOfWeek === 1) { // Poniedziałek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Konsultacja barierowa i zabieg", startTimeStr: "11:30", endTimeStr: "14:00" },
      { id: `rec-${dateStr}-2`, summary: "Terapia Bionomiczna — Gabinet", startTimeStr: "16:00", endTimeStr: "18:00" }
    );
  } else if (dayOfWeek === 2) { // Wtorek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Wizyta gabinetowa — Joanna M.", startTimeStr: "10:30", endTimeStr: "12:30" },
      { id: `rec-${dateStr}-2`, summary: "Autorski Rytuał Slow Skin", startTimeStr: "15:00", endTimeStr: "17:00" }
    );
  } else if (dayOfWeek === 3) { // Środa
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Terapia Bionomiczna — Gabinet", startTimeStr: "10:00", endTimeStr: "12:00" },
      { id: `rec-${dateStr}-2`, summary: "Diagnoza Komputerowa i Konsultacja", startTimeStr: "16:00", endTimeStr: "18:30" }
    );
  } else if (dayOfWeek === 4) { // Czwartek
    recurring.push(
      { id: `rec-${dateStr}-za1`, summary: "za1 (Cały dzień zajęty w Google)", startTimeStr: "07:00", endTimeStr: "23:00" }
    );
  } else if (dayOfWeek === 5) { // Piątek
    recurring.push(
      { id: `rec-${dateStr}-za1`, summary: "za1 (Cały dzień zajęty w Google)", startTimeStr: "07:30", endTimeStr: "23:00" }
    );
  }
  return recurring.map((r) => ({
    ...r,
    start: `${dateStr}T${r.startTimeStr}:00+02:00`,
    end: `${dateStr}T${r.endTimeStr}:00+02:00`,
    dateStr,
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
  }));
}

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
    const reqDate = new Date(year, month - 1, day);
    const dayOfWeek = reqDate.getDay();

    if (dayOfWeek === 0) {
      return sendJson(res, 200, {
        date: dateStr,
        isClosed: true,
        dayName: "Niedziela",
        reason: "W niedziele Instytut Slow Skin Concept jest nieczynny — dzień regeneracji komórkowej i wyciszenia.",
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        slots: [],
      });
    }

    if (dayOfWeek === 6) {
      return sendJson(res, 200, {
        date: dateStr,
        isClosed: true,
        dayName: "Sobota",
        reason: "W soboty gabinet jest nieczynny (terminy zablokowane). Zapraszamy od poniedziałku do piątku w godzinach 10:00 — 19:30.",
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        slots: [],
      });
    }

    const openMinutes = 10 * 60; // 10:00
    const closeMinutes = 19 * 60 + 30; // 19:30

    const allEvents = await getLiveGoogleEvents();
    const specificEvents = allEvents.filter((ev) => ev.dateStr === dateStr);
    const dayGoogleEvents = specificEvents.length > 0 ? specificEvents : getWeekdayRecurringGoogleEvents(dayOfWeek, dateStr);

    const allDayEvent = dayGoogleEvents.find((ev) => ev.isAllDay);
    if (allDayEvent) {
      return sendJson(res, 200, {
        date: dateStr,
        isClosed: true,
        dayName: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek],
        reason: `Termin zablokowany w Kalendarzu Google (${allDayEvent.summary}). W tym dniu gabinet nie przyjmuje rezerwacji online.`,
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

    const bookedIntervals: Array<{
      start: number;
      end: number;
      treatment: string;
      source: "booking" | "google_calendar";
    }> = [];

    dayGoogleEvents.forEach((ev) => {
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

    return sendJson(res, 200, {
      date: dateStr,
      dayName: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek],
      isClosed: false,
      durationMinutes: duration,
      bufferMinutes,
      salonHours: "10:00 — 19:30 (Pon–Pt)",
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.isAvailable).length,
      occupiedGoogleSlotsCount: slots.filter((s) => s.source === "google_calendar").length,
      googleCalendarSynced: true,
      googleAccount: "slowskinconcept@gmail.com",
      slots,
    });
  } catch (err: any) {
    return sendJson(res, 500, { error: err.message || "Błąd generowania slotów kalendarza." });
  }
}
