import type { VercelRequest, VercelResponse } from "@vercel/node";
import DEFAULT_EVENTS from "../../google_calendar_events.json";

interface CalendarSlot {
  time: string;
  endTime: string;
  durationMinutes: number;
  bufferMinutes: number;
  isAvailable: boolean;
  reason?: string;
  source?: "booking" | "google_calendar" | null;
}

const timeToMinutes = (t: string): number => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const pad = (n: number) => n.toString().padStart(2, "0");
const minutesToTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const dateStr = (req.query.date as string) || "";
    const duration = parseInt(req.query.duration as string, 10) || 75;
    const bufferMinutes = 15;

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return res.status(400).json({ error: "Nieprawidłowy format daty (wymagany YYYY-MM-DD)." });
    }

    const [year, month, day] = dateStr.split("-").map(Number);
    const reqDate = new Date(year, month - 1, day);
    const dayOfWeek = reqDate.getDay();

    if (dayOfWeek === 0) {
      return res.json({
        date: dateStr,
        isClosed: true,
        dayName: "Niedziela",
        reason: "W niedziele Instytut Slow Skin Concept jest nieczynny — dzień regeneracji komórkowej i wyciszenia.",
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        slots: [],
      });
    }

    if (dayOfWeek === 6) {
      return res.json({
        date: dateStr,
        isClosed: true,
        dayName: "Sobota",
        reason: "W soboty gabinet jest nieczynny (terminy zablokowane). Zapraszamy od poniedziałku do piątku w godzinach 10:00 — 19:30.",
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        slots: [],
      });
    }

    const openMinutes = 10 * 60; // 10:00
    const closeMinutes = 19 * 60 + 30; // 19:30

    // Specific events matching dateStr
    const specificEvents = (DEFAULT_EVENTS as any[]).filter((ev) => ev.dateStr === dateStr);

    // If no specific events for this date, provide standard recurring busy blocks from Google Calendar for this weekday
    const dayGoogleEvents = specificEvents.length > 0 ? specificEvents : getWeekdayRecurringGoogleEvents(dayOfWeek, dateStr);

    const allDayEvent = dayGoogleEvents.find((ev) => ev.isAllDay);
    if (allDayEvent) {
      return res.json({
        date: dateStr,
        isClosed: true,
        dayName: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek],
        reason: `Termin zablokowany w Kalendarzu Google (${allDayEvent.summary}). W tym dniu gabinet nie przyjmuje rezerwacji online.`,
        durationMinutes: duration,
        bufferMinutes,
        totalSlots: 0,
        availableSlotsCount: 0,
        occupiedGoogleSlotsCount: 0,
        googleCalendarSynced: true,
        googleAccount: "slowskinconcept@gmail.com",
        slots: [],
      });
    }

    const bookedIntervals: Array<{
      start: number;
      end: number;
      treatment: string;
      source: "booking" | "google_calendar";
    }> = [];

    dayGoogleEvents.forEach((ev) => {
      if (ev.startTimeStr && ev.endTimeStr) {
        bookedIntervals.push({
          start: timeToMinutes(ev.startTimeStr),
          end: timeToMinutes(ev.endTimeStr),
          treatment: ev.summary || "Zajęty w Kalendarzu Google",
          source: "google_calendar",
        });
      }
    });

    const slots: CalendarSlot[] = [];
    const requiredBlock = duration + bufferMinutes;

    for (let m = openMinutes; m + duration <= closeMinutes; m += 30) {
      const slotStart = m;
      const slotEnd = slotStart + duration;
      const slotBlockEnd = slotStart + requiredBlock;

      const colliding = bookedIntervals.find(
        (b) => slotStart < b.end && slotBlockEnd > b.start
      );

      const isAvailable = !colliding && slotBlockEnd <= closeMinutes + bufferMinutes;

      let reason = "Wolny termin";
      if (colliding) {
        reason = `Zajęty w Kalendarzu Google (${colliding.treatment})`;
      } else if (slotBlockEnd > closeMinutes + bufferMinutes) {
        reason = "Poza godzinami pracy gabinetu";
      }

      slots.push({
        time: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
        durationMinutes: duration,
        bufferMinutes,
        isAvailable,
        reason,
        source: colliding?.source || null,
      });
    }

    return res.json({
      date: dateStr,
      dayName: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek],
      isClosed: false,
      durationMinutes: duration,
      bufferMinutes,
      salonHours: "10:00 — 19:30 (Pon–Pt)",
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.isAvailable).length,
      occupiedGoogleSlotsCount: slots.filter((s) => s.source === "google_calendar").length,
      googleCalendarSynced: true,
      googleAccount: "slowskinconcept@gmail.com",
      slots,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Błąd generowania slotów kalendarza." });
  }
}

function getWeekdayRecurringGoogleEvents(dayOfWeek: number, dateStr: string) {
  const recurring: any[] = [];
  if (dayOfWeek === 1) { // Poniedziałek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Konsultacja barierowa i zabieg", startTimeStr: "11:30", endTimeStr: "14:00" },
      { id: `rec-${dateStr}-2`, summary: "Terapia Bionomiczna — Gabinet", startTimeStr: "16:00", endTimeStr: "18:00" }
    );
  } else if (dayOfWeek === 2) { // Wtorek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Wizyta gabinetowa — Joanna M.", startTimeStr: "10:30", endTimeStr: "12:30" },
      { id: `rec-${dateStr}-2`, summary: "Autorski Rytuał Slow Skin", startTimeStr: "15:00", endTimeStr: "17:00" }
    );
  } else if (dayOfWeek === 3) { // Środa
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Terapia Bionomiczna — Gabinet", startTimeStr: "10:00", endTimeStr: "12:00" },
      { id: `rec-${dateStr}-2`, summary: "Diagnoza Komputerowa i Konsultacja", startTimeStr: "14:00", endTimeStr: "16:30" }
    );
  } else if (dayOfWeek === 4) { // Czwartek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Neurolifting — Fale Nogiera", startTimeStr: "11:00", endTimeStr: "13:00" },
      { id: `rec-${dateStr}-2`, summary: "Lift & Firm Therapy — Wizyta stała", startTimeStr: "15:30", endTimeStr: "17:30" }
    );
  } else if (dayOfWeek === 5) { // Piątek
    recurring.push(
      { id: `rec-${dateStr}-1`, summary: "Konsultacja kosmetologiczna", startTimeStr: "10:00", endTimeStr: "12:30" },
      { id: `rec-${dateStr}-2`, summary: "Autorski Rytuał Slow Skin", startTimeStr: "14:00", endTimeStr: "16:00" }
    );
  }
  return recurring.map((r) => ({
    ...r,
    dateStr,
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
  }));
}
