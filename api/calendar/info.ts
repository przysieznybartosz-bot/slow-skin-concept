import type { VercelRequest, VercelResponse } from "@vercel/node";
import DEFAULT_EVENTS from "../../google_calendar_events.json";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    googleAccount: "slowskinconcept@gmail.com",
    calendarId: "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com",
    salonHours: "10:00 — 19:30 (Pon–Pt)",
    salonLocation: "Jelcz-Laskowice, ul. Szkolna 5",
    activeGoogleBlocks: (DEFAULT_EVENTS as any[]).length,
    status: "synchronized",
  });
}
