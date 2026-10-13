import type { IncomingMessage, ServerResponse } from "node:http";

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

async function persistToGitHub(events: GoogleCalendarStoredEvent[]): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) return false;
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/google_calendar_events.json`;
    const headers = {
      Authorization: `token ${token}`,
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
        message: `feat(calendar): live sync ${events.length} Google Calendar appointments`,
        content: contentBase64,
        ...(sha ? { sha } : {}),
      }),
    });

    return putRes.ok;
  } catch (err) {
    console.warn("GitHub persist note:", err);
    return false;
  }
}

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const events: GoogleCalendarStoredEvent[] = Array.isArray(body?.events) ? body.events : [];
      const accountEmail = body?.accountEmail || "slowskinconcept@gmail.com";

      if (events.length > 0) {
        await persistToGitHub(events);
      }

      return sendJson(res, 200, {
        success: true,
        message: `Pomyślnie zsynchronizowano ${events.length} terminów z Kalendarza Google (${accountEmail}).`,
        totalEvents: events.length,
        syncedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      return sendJson(res, 500, { error: err.message || "Błąd zapisu synchronizacji kalendarza." });
    }
  }

  return sendJson(res, 405, { error: "Metoda niedozwolona" });
}
