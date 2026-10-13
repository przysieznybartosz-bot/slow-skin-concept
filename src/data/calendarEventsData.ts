export interface GoogleCalendarStoredEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  dateStr: string; // YYYY-MM-DD
  startTimeStr?: string; // HH:MM
  endTimeStr?: string; // HH:MM
  isAllDay?: boolean;
  calendarAccount?: string;
  updatedAt?: string;
}

export const SLOW_SKIN_GOOGLE_ACCOUNT = "slowskinconcept@gmail.com";
export const SLOW_SKIN_CALENDAR_ID = "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com";

export const DEFAULT_GOOGLE_EVENTS: GoogleCalendarStoredEvent[] = [
  {
    id: "gcal-1014-1",
    summary: "Terapia Bionomiczna — Gabinet",
    start: "2026-10-14T10:00:00+02:00",
    end: "2026-10-14T12:00:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "10:00",
    endTimeStr: "12:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1014-2",
    summary: "Diagnoza Komputerowa i Konsultacja",
    start: "2026-10-14T14:00:00+02:00",
    end: "2026-10-14T16:30:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "14:00",
    endTimeStr: "16:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1014-3",
    summary: "Konsultacja barierowa — stała klientka",
    start: "2026-10-14T17:00:00+02:00",
    end: "2026-10-14T19:00:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "17:00",
    endTimeStr: "19:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1015-1",
    summary: "Neurolifting — Fale Nogiera",
    start: "2026-10-15T11:00:00+02:00",
    end: "2026-10-15T13:00:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "11:00",
    endTimeStr: "13:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1015-2",
    summary: "Lift & Firm Therapy — Wizyta stała",
    start: "2026-10-15T15:30:00+02:00",
    end: "2026-10-15T17:30:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "15:30",
    endTimeStr: "17:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1016-1",
    summary: "Konsultacja kosmetologiczna",
    start: "2026-10-16T10:00:00+02:00",
    end: "2026-10-16T12:30:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "10:00",
    endTimeStr: "12:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1016-2",
    summary: "Autorski Rytuał Slow Skin",
    start: "2026-10-16T14:00:00+02:00",
    end: "2026-10-16T16:00:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "14:00",
    endTimeStr: "16:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1019-1",
    summary: "Konsultacja barierowa i zabieg",
    start: "2026-10-19T11:30:00+02:00",
    end: "2026-10-19T14:00:00+02:00",
    dateStr: "2026-10-19",
    startTimeStr: "11:30",
    endTimeStr: "14:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  },
  {
    id: "gcal-1020-1",
    summary: "Wizyta gabinetowa — Joanna M.",
    start: "2026-10-20T10:30:00+02:00",
    end: "2026-10-20T12:30:00+02:00",
    dateStr: "2026-10-20",
    startTimeStr: "10:30",
    endTimeStr: "12:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T12:40:00.000Z"
  }
];

export function getWeekdayRecurringGoogleEvents(dayOfWeek: number, dateStr: string): GoogleCalendarStoredEvent[] {
  const recurring: Array<{ id: string; summary: string; startTimeStr: string; endTimeStr: string }> = [];
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
    start: `${dateStr}T${r.startTimeStr}:00+02:00`,
    end: `${dateStr}T${r.endTimeStr}:00+02:00`,
    dateStr,
    isAllDay: false,
    calendarAccount: SLOW_SKIN_GOOGLE_ACCOUNT,
  }));
}
