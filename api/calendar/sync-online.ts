import type { IncomingMessage, ServerResponse } from "node:http";
import ical from "node-ical";
import { google } from "googleapis";

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

const GITHUB_REPO = "przysieznybartosz-bot/slow-skin-concept";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const SALON_ACCOUNT = "slowskinconcept@gmail.com";
const SALON_CALENDAR_ID = "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com";

function sendJson(res: ServerResponse | any, status: number, data: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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

/**
 * Persists the synchronized Google events to GitHub repository so all clients see it
 */
async function persistToGitHub(events: GoogleCalendarStoredEvent[]): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/google_calendar_events.json`;
    const headers = {
      Authorization: `token ${GITHUB_TOKEN}`,
      "User-Agent": "Slow-Skin-Concept-Calendar-Sync",
      Accept: "application/vnd.github.v3+json",
    };

    let sha = "";
    const getRes = await fetch(url, { headers });
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }

    const contentStr = JSON.stringify(events, null, 2);
    const contentBase64 = Buffer.from(contentStr).toString("base64");

    const putRes = await fetch(url, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `feat(calendar): online correlation sync ${events.length} Google Calendar appointments`,
        content: contentBase64,
        ...(sha ? { sha } : {}),
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.warn("GitHub online correlation notice:", err);
    return false;
  }
}

/**
 * Parses events from an iCal URL or iCal string
 */
async function parseIcalEvents(icalUrlOrData: string): Promise<GoogleCalendarStoredEvent[]> {
  let parsed: any;
  if (icalUrlOrData.startsWith("http://") || icalUrlOrData.startsWith("https://")) {
    parsed = await ical.async.fromURL(icalUrlOrData);
  } else {
    parsed = ical.sync.parseICS(icalUrlOrData);
  }

  const events: GoogleCalendarStoredEvent[] = [];
  const pad = (n: number) => n.toString().padStart(2, "0");

  for (const k in parsed) {
    const item = parsed[k];
    if (item.type !== "VEVENT") continue;

    const start = item.start ? new Date(item.start) : null;
    const end = item.end ? new Date(item.end) : null;
    if (!start) continue;

    const isAllDay = item.datetype === "date" || (start.getHours() === 0 && start.getMinutes() === 0 && (!end || (end.getHours() === 0 && end.getMinutes() === 0)));
    const dateStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;

    let startTimeStr = "10:00";
    let endTimeStr = "19:30";
    if (!isAllDay) {
      startTimeStr = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
      if (end) {
        endTimeStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
      } else {
        endTimeStr = `${pad(start.getHours() + 1)}:${pad(start.getMinutes())}`;
      }
    }

    events.push({
      id: item.uid || `ical-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      summary: item.summary || "Zajęty w Kalendarzu Google",
      start: start.toISOString(),
      end: end ? end.toISOString() : start.toISOString(),
      dateStr,
      startTimeStr: isAllDay ? "07:30" : startTimeStr,
      endTimeStr: isAllDay ? "23:00" : endTimeStr,
      isAllDay: !!isAllDay,
      calendarAccount: SALON_ACCOUNT,
      updatedAt: new Date().toISOString(),
    });
  }

  return events;
}

/**
 * Fetches events directly using Google Calendar API v3 (via googleapis npm package)
 */
async function fetchGoogleApiEvents(accessToken: string): Promise<GoogleCalendarStoredEvent[]> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth });

  const now = new Date();
  const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const timeMax = new Date(now.getFullYear(), now.getMonth() + 3, 28).toISOString();

  const calIds = ["primary", SALON_ACCOUNT, SALON_CALENDAR_ID];
  const allEventsMap = new Map<string, GoogleCalendarStoredEvent>();

  for (const calId of calIds) {
    try {
      const res = await calendar.events.list({
        calendarId: calId,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 250,
      });

      const items = res.data.items || [];
      const pad = (n: number) => n.toString().padStart(2, "0");

      for (const item of items) {
        if (item.status === "cancelled") continue;
        const isAllDay = !item.start?.dateTime && !!item.start?.date;
        let dateStr = "";
        let startTimeStr = "10:00";
        let endTimeStr = "19:30";

        if (isAllDay && item.start?.date) {
          dateStr = item.start.date;
          startTimeStr = "07:30";
          endTimeStr = "23:00";
        } else if (item.start?.dateTime) {
          const startDate = new Date(item.start.dateTime);
          const endDate = item.end?.dateTime ? new Date(item.end.dateTime) : new Date(startDate.getTime() + 60 * 60 * 1000);
          dateStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
          startTimeStr = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
          endTimeStr = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;
        }

        if (dateStr) {
          const id = item.id || `gcal-${dateStr}-${startTimeStr}`;
          allEventsMap.set(id, {
            id,
            summary: item.summary || "Zajęty w Kalendarzu Google",
            start: item.start?.dateTime || item.start?.date || "",
            end: item.end?.dateTime || item.end?.date || "",
            dateStr,
            startTimeStr,
            endTimeStr,
            isAllDay,
            calendarAccount: SALON_ACCOUNT,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (e: any) {
      console.warn(`Could not list events for ${calId}:`, e.message || e);
    }
  }

  return Array.from(allEventsMap.values());
}

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET") {
    return sendJson(res, 200, {
      plugin: "Google Calendar Online Correlator (Slow Skin Concept)",
      version: "2.0.0",
      officialCalendar: SALON_ACCOUNT,
      dedicatedCalendarId: SALON_CALENDAR_ID,
      supportedModes: ["google_oauth_token", "ical_secret_url", "manual_events_sync"],
      status: "ready",
    });
  }

  if (req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      let parsedEvents: GoogleCalendarStoredEvent[] = [];

      if (body?.icalUrl) {
        // Mode 1: Correlate via Google Calendar iCal feed
        parsedEvents = await parseIcalEvents(body.icalUrl);
      } else if (body?.googleToken) {
        // Mode 2: Correlate via Google Calendar API with token
        parsedEvents = await fetchGoogleApiEvents(body.googleToken);
      } else if (Array.isArray(body?.events) && body.events.length > 0) {
        // Mode 3: Direct event sync
        parsedEvents = body.events;
      } else {
        return sendJson(res, 400, {
          error: "Wymagany parametr 'googleToken', 'icalUrl' lub 'events' do korelacji kalendarza online.",
        });
      }

      // Sort chronological
      parsedEvents.sort((a, b) => `${a.dateStr} ${a.startTimeStr || ""}`.localeCompare(`${b.dateStr} ${b.startTimeStr || ""}`));

      // Persist to GitHub repository
      const githubSaved = await persistToGitHub(parsedEvents);

      return sendJson(res, 200, {
        success: true,
        count: parsedEvents.length,
        githubSaved,
        account: SALON_ACCOUNT,
        message: `Pomyślnie skorelowano online ${parsedEvents.length} terminów z Kalendarzem Google (${SALON_ACCOUNT}). Zajęte godziny są zablokowane na stronie.`,
        events: parsedEvents,
      });
    } catch (err: any) {
      console.error("Online calendar correlation error:", err);
      return sendJson(res, 500, {
        success: false,
        error: err.message || "Błąd korelacji kalendarza online.",
      });
    }
  }

  return sendJson(res, 405, { error: "Metoda niedozwolona." });
}
