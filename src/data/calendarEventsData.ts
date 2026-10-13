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
    id: "gcal-1013-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-13T07:30:00+02:00",
    end: "2026-10-13T23:00:00+02:00",
    dateStr: "2026-10-13",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1014-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-14T07:30:00+02:00",
    end: "2026-10-14T23:00:00+02:00",
    dateStr: "2026-10-14",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1015-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-15T07:00:00+02:00",
    end: "2026-10-15T23:00:00+02:00",
    dateStr: "2026-10-15",
    startTimeStr: "07:00",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1016-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-16T07:30:00+02:00",
    end: "2026-10-16T23:00:00+02:00",
    dateStr: "2026-10-16",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1019-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-19T07:30:00+02:00",
    end: "2026-10-19T23:00:00+02:00",
    dateStr: "2026-10-19",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1020-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-20T07:30:00+02:00",
    end: "2026-10-20T23:00:00+02:00",
    dateStr: "2026-10-20",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1021-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-21T07:30:00+02:00",
    end: "2026-10-21T23:00:00+02:00",
    dateStr: "2026-10-21",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1022-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-22T07:00:00+02:00",
    end: "2026-10-22T23:00:00+02:00",
    dateStr: "2026-10-22",
    startTimeStr: "07:00",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1023-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-23T07:30:00+02:00",
    end: "2026-10-23T23:00:00+02:00",
    dateStr: "2026-10-23",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1026-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-26T07:30:00+02:00",
    end: "2026-10-26T23:00:00+02:00",
    dateStr: "2026-10-26",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1027-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-27T07:30:00+02:00",
    end: "2026-10-27T23:00:00+02:00",
    dateStr: "2026-10-27",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1028-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-28T07:30:00+02:00",
    end: "2026-10-28T23:00:00+02:00",
    dateStr: "2026-10-28",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1029-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-29T07:00:00+02:00",
    end: "2026-10-29T23:00:00+02:00",
    dateStr: "2026-10-29",
    startTimeStr: "07:00",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  },
  {
    id: "gcal-1030-all-day",
    summary: "za1 (Cały dzień zajęty w Google)",
    start: "2026-10-30T07:30:00+02:00",
    end: "2026-10-30T23:00:00+02:00",
    dateStr: "2026-10-30",
    startTimeStr: "07:30",
    endTimeStr: "23:00",
    isAllDay: false,
    calendarAccount: "slowskinconcept@gmail.com",
    updatedAt: "2026-10-13T21:40:00.000Z"
  }
];

export function getWeekdayRecurringGoogleEvents(dayOfWeek: number, dateStr: string): GoogleCalendarStoredEvent[] {
  // If no specific override, protect full working hours as occupied in Google Calendar
  const recurring: Array<{ id: string; summary: string; startTimeStr: string; endTimeStr: string }> = [
    { id: `rec-${dateStr}-za1`, summary: "Zajęty w Kalendarzu Google (slowskinconcept@gmail.com)", startTimeStr: "07:30", endTimeStr: "23:00" }
  ];

  return recurring.map((r) => ({
    ...r,
    start: `${dateStr}T${r.startTimeStr}:00+02:00`,
    end: `${dateStr}T${r.endTimeStr}:00+02:00`,
    dateStr,
    isAllDay: false,
    calendarAccount: SLOW_SKIN_GOOGLE_ACCOUNT,
  }));
}
