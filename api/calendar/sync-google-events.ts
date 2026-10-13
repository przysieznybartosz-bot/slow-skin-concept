import type { IncomingMessage, ServerResponse } from "node:http";
import {
  GoogleCalendarStoredEvent,
  updateInMemoryEvents,
  sendJson,
  parseJsonBody,
  GITHUB_REPO,
  GITHUB_TOKEN
} from "./_shared";

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
        updateInMemoryEvents(events);
        // Persist asynchronously / synchronously to GitHub
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
