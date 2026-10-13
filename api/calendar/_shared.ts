import type { IncomingMessage, ServerResponse } from "node:http";

export interface CalendarSlot {
  time: string;
  endTime: string;
  durationMinutes: number;
  bufferMinutes: number;
  isAvailable: boolean;
  reason?: string;
  source?: "booking" | "google_calendar" | null;
}

export interface GoogleCalendarStoredEvent {
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

export const GITHUB_REPO = "przysieznybartosz-bot/slow-skin-concept";
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
export const RAW_EVENTS_URL = "https://raw.githubusercontent.com/przysieznybartosz-bot/slow-skin-concept/main/google_calendar_events.json";

export const DEFAULT_EVENTS: GoogleCalendarStoredEvent[] = [
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
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1014-2",
    summary: "Diagnoza Komputerowa i Konsultacja",
    start: "2026-10-14T14:00:00+02:00",
    end: "2026-10-14T16:30:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "14:00",
    endTimeStr: "16:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1014-3",
    summary: "Konsultacja barierowa — stała klientka",
    start: "2026-10-14T17:00:00+02:00",
    end: "2026-10-14T19:00:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "17:00",
    endTimeStr: "19:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1015-1",
    summary: "Neurolifting — Fale Nogiera",
    start: "2026-10-15T11:00:00+02:00",
    end: "2026-10-15T13:00:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "11:00",
    endTimeStr: "13:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1015-2",
    summary: "Lift & Firm Therapy — Wizyta stała",
    start: "2026-10-15T15:30:00+02:00",
    end: "2026-10-15T17:30:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "15:30",
    endTimeStr: "17:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1016-1",
    summary: "Konsultacja kosmetologiczna",
    start: "2026-10-16T10:00:00+02:00",
    end: "2026-10-16T12:30:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "10:00",
    endTimeStr: "12:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1016-2",
    summary: "Autorski Rytuał Slow Skin",
    start: "2026-10-16T14:00:00+02:00",
    end: "2026-10-16T16:00:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "14:00",
    endTimeStr: "16:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
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
    updatedAt: "2026-10-13T12:40:00.000Z"
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
    updatedAt: "2026-10-13T12:40:00.000Z"
  }
];

let cachedEvents: GoogleCalendarStoredEvent[] = [...DEFAULT_EVENTS];
let lastCacheTime = 0;

export async function getLiveGoogleEvents(): Promise<GoogleCalendarStoredEvent[]> {
  const now = Date.now();
  if (cachedEvents.length > 0 && now - lastCacheTime < 30_000) {
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
      if (Array.isArray(data) && data.length > 0) {
        cachedEvents = data;
        lastCacheTime = now;
        return data;
      }
    }
  } catch {
    // Return cached / fallback
  }
  return cachedEvents.length > 0 ? cachedEvents : DEFAULT_EVENTS;
}

export function updateInMemoryEvents(events: GoogleCalendarStoredEvent[]): void {
  cachedEvents = events;
  lastCacheTime = Date.now();
}

export function sendJson(res: ServerResponse | any, status: number, data: any) {
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

export async function parseJsonBody(req: IncomingMessage | any): Promise<any> {
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

export function timeToMinutes(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export const pad = (n: number) => n.toString().padStart(2, "0");
export const minutesToTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

export function getWeekdayRecurringGoogleEvents(dayOfWeek: number, dateStr: string): GoogleCalendarStoredEvent[] {
  const recurring: any[] = [];
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
      { id: `rec-${dateStr}-2`, summary: "Diagnoza Komputerowa i Konsultacja", startTimeStr: "14:00", endTimeStr: "16:30" }
    );
  } else if (dayOfWeek === 4) { // Czwartek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Neurolifting — Fale Nogiera", startTimeStr: "11:00", endTimeStr: "13:00" },
      { id: `rec-${dateStr}-2`, summary: "Lift & Firm Therapy — Wizyta stała", startTimeStr: "15:30", endTimeStr: "17:30" }
    );
  } else if (dayOfWeek === 5) { // Piątek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Konsultacja kosmetologiczna", startTimeStr: "10:00", endTimeStr: "12:30" },
      { id: `rec-${dateStr}-2`, summary: "Autorski Rytuał Slow Skin", startTimeStr: "14:00", endTimeStr: "16:00" }
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
