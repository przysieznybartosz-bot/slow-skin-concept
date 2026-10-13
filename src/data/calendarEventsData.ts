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

/**
 * Production availability has ZERO static hardcoded events.
 * Availability is strictly queried from Google Calendar freebusy API.
 * An empty Google result indicates full availability (no busy intervals),
 * not an opportunity to inject fallback/placeholder data.
 */
export const DEFAULT_GOOGLE_EVENTS: GoogleCalendarStoredEvent[] = [];

export function getWeekdayRecurringGoogleEvents(_dayOfWeek: number, _dateStr: string): GoogleCalendarStoredEvent[] {
  return [];
}
