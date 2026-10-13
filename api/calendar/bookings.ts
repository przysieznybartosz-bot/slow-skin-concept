import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const booking = req.body;
    if (!booking || !booking.treatmentName || !booking.dateStr || !booking.timeStr) {
      return res.status(400).json({ error: "Brak wymaganych danych rezerwacji." });
    }
    return res.status(201).json({
      success: true,
      message: `Rezerwacja na zabieg "${booking.treatmentName}" została przyjęta.`,
      booking: {
        id: `booking-${Date.now()}`,
        ...booking,
        createdAt: new Date().toISOString(),
      },
    });
  }
  return res.status(405).json({ error: "Metoda niedozwolona" });
}
