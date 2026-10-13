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
    id: "gcal-1013-1",
    summary: "zab1",
    start: "2026-10-13T11:00:00+02:00",
    end: "2026-10-13T12:00:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "11:00",
    endTimeStr: "12:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1013-2",
    summary: "zab11",
    start: "2026-10-13T13:00:00+02:00",
    end: "2026-10-13T14:00:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "13:00",
    endTimeStr: "14:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1013-3",
    summary: "obiad",
    start: "2026-10-13T14:30:00+02:00",
    end: "2026-10-13T15:30:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1013-4",
    summary: "Wizyta w gabinecie",
    start: "2026-10-13T15:30:00+02:00",
    end: "2026-10-13T16:30:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "15:30",
    endTimeStr: "16:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
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
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1014-2",
    summary: "obiad",
    start: "2026-10-14T14:30:00+02:00",
    end: "2026-10-14T15:30:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1014-3",
    summary: "Konsultacja barierowa — stała klientka",
    start: "2026-10-14T16:00:00+02:00",
    end: "2026-10-14T18:30:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "16:00",
    endTimeStr: "18:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1015-1",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-15T07:00:00+02:00",
    end: "2026-10-15T23:00:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "07:00",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1015-2",
    summary: "obiad",
    start: "2026-10-15T14:30:00+02:00",
    end: "2026-10-15T15:30:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1016-1",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-16T07:30:00+02:00",
    end: "2026-10-16T23:00:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1016-2",
    summary: "obiad",
    start: "2026-10-16T14:30:00+02:00",
    end: "2026-10-16T15:30:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
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
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1019-2",
    summary: "obiad",
    start: "2026-10-19T14:30:00+02:00",
    end: "2026-10-19T15:30:00+02:00",
    dateStr: "2026-10-19",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
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
    updatedAt: "2026-10-13T21:20:00.000Z"
  },
  {
    id: "gcal-1020-2",
    summary: "obiad",
    start: "2026-10-20T14:30:00+02:00",
    end: "2026-10-20T15:30:00+02:00",
    dateStr: "2026-10-20",
    startTimeStr: "14:30",
    endTimeStr: "15:30",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:20:00.000Z"
  }
];

export function getWeekdayRecurringGoogleEvents(dayOfWeek: number, dateStr: string): GoogleCalendarStoredEvent[] {
  const recurring: Array<{ id: string; summary: string; startTimeStr: string; endTimeStr: string }> = [
    { id: `rec-${dateStr}-lunch`, summary: "obiad (przerwa gabinetowa)", startTimeStr: "14:30", endTimeStr: "15:30" }
  ];
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
      { id: `rec-${dateStr}-2`, summary: "Diagnoza Komputerowa i Konsultacja", startTimeStr: "16:00", endTimeStr: "18:30" }
    );
  } else if (dayOfWeek === 4) { // Czwartek
    recurring.push(
      { id: `rec-${dateStr}-za1`, summary: "za1 (Cały dzień zajęty w Google)", startTimeStr: "07:00", endTimeStr: "23:00" }
    );
  } else if (dayOfWeek === 5) { // Piątek
    recurring.push(
      { id: `rec-${dateStr}-za1`, summary: "za1 (Cały dzień zajęty w Google)", startTimeStr: "07:30", endTimeStr: "23:00" }
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
