import type { IncomingMessage, ServerResponse } from "node:http";
import {
  getAuthenticatedCalendarClient,
  getActiveCalendarId,
  SALON_ACCOUNT_EMAIL,
} from "../../src/server/googleCalendarBackend";

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

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  const { calendar, authMethod, error } = await getAuthenticatedCalendarClient();
  const calendarId = getActiveCalendarId();

  if (!calendar) {
    return sendJson(res, 200, {
      success: false,
      connected: false,
      authMethod,
      error: error || "Brak uwierzytelnienia serwerowego do Google Calendar gabinetu.",
      accountEmail: SALON_ACCOUNT_EMAIL,
      calendarId,
      totalEvents: 0,
      events: [],
      syncedAt: null,
    });
  }

  try {
    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 3, 28).toISOString();

    const gRes = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
    });

    const items = gRes.data.items || [];
    const events: any[] = [];
    const pad = (n: number) => n.toString().padStart(2, "0");

    for (const item of items) {
      if (item.status === "cancelled") continue;
      if (item.transparency === "transparent") continue;

      const isAllDay = !item.start?.dateTime && !!item.start?.date;
      let dateStr = "";
      let startTimeStr = "10:00";
      let endTimeStr = "19:30";

      if (isAllDay && item.start?.date) {
        dateStr = item.start.date;
      } else if (item.start?.dateTime) {
        const startDate = new Date(item.start.dateTime);
        const endDate = item.end?.dateTime ? new Date(item.end.dateTime) : new Date(startDate.getTime() + 60 * 60 * 1000);
        dateStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
        startTimeStr = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
        endTimeStr = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
      }

      if (dateStr) {
        events.push({
          id: item.id,
          summary: "Zajęty termin w kalendarzu",
          start: item.start?.dateTime || item.start?.date,
          end: item.end?.dateTime || item.end?.date,
          dateStr,
          startTimeStr,
          endTimeStr,
          isAllDay,
          calendarAccount: SALON_ACCOUNT_EMAIL,
        });
      }
    }

    const nowIso = new Date().toISOString();
    return sendJson(res, 200, {
      success: true,
      connected: true,
      authMethod,
      accountEmail: SALON_ACCOUNT_EMAIL,
      calendarId,
      totalEvents: events.length,
      events,
      syncedAt: nowIso,
    });
  } catch (apiErr: any) {
    return sendJson(res, 500, {
      success: false,
      connected: false,
      error: apiErr?.message || "Błąd pobierania wydarzeń z Google Calendar.",
      accountEmail: SALON_ACCOUNT_EMAIL,
      calendarId,
      totalEvents: 0,
      events: [],
      syncedAt: null,
    });
  }
}
