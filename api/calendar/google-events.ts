import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";

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

function getLocalEvents(): any[] | null {
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

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  // 1. Check local filesystem first
  const localEvents = getLocalEvents();
  if (localEvents && localEvents.length > 0) {
    return sendJson(res, 200, {
      success: true,
      totalEvents: localEvents.length,
      events: localEvents,
      accountEmail: "slowskinconcept@gmail.com",
      syncedAt: new Date().toISOString(),
    });
  }

  // 2. Fetch from raw repository
  try {
    const rawRes = await fetch(RAW_EVENTS_URL, { headers: { "Cache-Control": "no-cache" } });
    if (rawRes.ok) {
      const events = await rawRes.json();
      if (Array.isArray(events) && events.length > 0) {
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
    totalEvents: 0,
    events: [],
    accountEmail: "slowskinconcept@gmail.com",
    syncedAt: new Date().toISOString(),
  });
}
