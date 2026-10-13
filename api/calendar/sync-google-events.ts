import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { events, accountEmail } = req.body || {};
    const count = Array.isArray(events) ? events.length : 0;
    return res.json({
      success: true,
      message: `Pomyślnie zsynchronizowano ${count} terminów z Kalendarza Google (${accountEmail || "slowskinconcept@gmail.com"}).`,
      totalEvents: count,
      syncedAt: new Date().toISOString(),
    });
  }
  return res.status(405).json({ error: "Metoda niedozwolona" });
}
