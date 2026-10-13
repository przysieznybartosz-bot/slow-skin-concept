import type { IncomingMessage, ServerResponse } from "node:http";
import { getLiveGoogleEvents, sendJson } from "./_shared";

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  const events = await getLiveGoogleEvents();
  return sendJson(res, 200, {
    googleAccount: "slowskinconcept@gmail.com",
    calendarId: "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com",
    totalBlockedEvents: events.length,
    status: "online",
    syncedAt: new Date().toISOString(),
  });
}
