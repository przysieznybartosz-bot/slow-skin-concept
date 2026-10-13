import type { IncomingMessage, ServerResponse } from "node:http";
import {
  CalendarSlot,
  getLiveGoogleEvents,
  getWeekdayRecurringGoogleEvents,
  timeToMinutes,
  minutesToTime,
  sendJson
} from "./_shared";

export default async function handler(req: IncomingMessage | any, res: ServerResponse | any) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  try {
    const url = new URL(req.url || "", `http://${req.headers?.host || "localhost"}`);
    const dateStr = url.searchParams.get("date") || (req.query?.date as string) || "";
    const duration = parseInt(url.searchParams.get("duration") || (req.query?.duration as string) || "75", 10) || 75;
    const bufferMinutes = 15;

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return sendJson(res, 400, { error: "Nieprawidłowy format daty (wymagany YYYY-MM-DD)." });
    }

    const [year, month, day] = dateStr.split("-").map(Number);
    const reqDate = new Date(year, month - 1, day);
    const dayOfWeek = reqDate.getDay();

    if (dayOfWeek === 0) {
      return sendJson(res, 200, {
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
      return sendJson(res, 200, {
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

    // Fetch live Google events (synced online from Google Calendar & GitHub raw store)
    const allEvents = await getLiveGoogleEvents();
    const specificEvents = allEvents.filter((ev) => ev.dateStr === dateStr);
    const dayGoogleEvents = specificEvents.length > 0 ? specificEvents : getWeekdayRecurringGoogleEvents(dayOfWeek, dateStr);

    const allDayEvent = dayGoogleEvents.find((ev) => ev.isAllDay);
    if (allDayEvent) {
      return sendJson(res, 200, {
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

    return sendJson(res, 200, {
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
    return sendJson(res, 500, { error: err.message || "Błąd generowania slotów kalendarza." });
  }
}
