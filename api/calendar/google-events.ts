import type { IncomingMessage, ServerResponse } from "node:http";

const RAW_EVENTS_URL = "https://raw.githubusercontent.com/przysieznybartosz-bot/slow-skin-concept/main/google_calendar_events.json";

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

const DEFAULT_EVENTS = [
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

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  try {
    const rawRes = await fetch(RAW_EVENTS_URL, { headers: { "Cache-Control": "no-cache" } });
    if (rawRes.ok) {
      const events = await rawRes.json();
      if (Array.isArray(events)) {
        return sendJson(res, 200, {
          success: true,
          totalEvents: events.length,
          events,
          accountEmail: "slowskinconcept@gmail.com",
          syncedAt: new Date().toISOString(),
        });
      }
    }
  } catch {
    // fallback
  }

  return sendJson(res, 200, {
    success: true,
    totalEvents: DEFAULT_EVENTS.length,
    events: DEFAULT_EVENTS,
    accountEmail: "slowskinconcept@gmail.com",
    syncedAt: new Date().toISOString(),
  });
}
