/**
 * Google Calendar Backend Integration for Slow Skin Concept
 * 
 * Official Salon Account: slowskinconcept@gmail.com
 * Official Calendar ID: ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com
 * Working Hours: Monday - Friday, 10:00 - 19:30 Europe/Warsaw
 * 
 * Implements:
 * 1. Server-side authentication via Google OAuth2 Refresh Token or Service Account.
 * 2. Real Google Calendar freebusy.query for busy intervals.
 * 3. Dynamic available slots generation with treatment duration + disinfection buffer.
 * 4. Server-side event creation in the verified salon calendar (no fallback to client primary).
 * 5. Strict sync status indicators (googleCalendarSynced is true ONLY upon verified Google response).
 */

import { google } from "googleapis";
import fs from "node:fs";
import path from "node:path";
import firebaseConfig from "../../firebase-applet-config.json" with { type: "json" };

export const SALON_ACCOUNT_EMAIL = "slowskinconcept@gmail.com";
export const DEFAULT_SALON_CALENDAR_ID =
  process.env.GOOGLE_CALENDAR_ID ||
  "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com";

export const SALON_TIMEZONE = "Europe/Warsaw";
export const SALON_OPEN_HOUR = 10; // 10:00
export const SALON_OPEN_MINUTE = 0;
export const SALON_CLOSE_HOUR = 19; // 19:30
export const SALON_CLOSE_MINUTE = 30;
export const DEFAULT_BUFFER_MINUTES = 15;

const TOKEN_STORAGE_FILE = path.join(process.cwd(), ".calendar_token.json");

export interface StoredCalendarAuth {
  refreshToken?: string;
  accessToken?: string;
  expiryDate?: number;
  updatedAt?: string;
}

export interface BusyInterval {
  start: Date;
  end: Date;
}

export interface GeneratedSlot {
  time: string; // HH:MM
  endTime: string; // HH:MM
  durationMinutes: number;
  bufferMinutes: number;
  isAvailable: boolean;
  reason?: string;
  source?: "google_calendar" | "salon_booking" | null;
}

export interface SlotsCalculationResult {
  success: boolean;
  date: string;
  dayName: string;
  isClosed: boolean;
  isFullyBooked: boolean;
  status: "available" | "fully_booked" | "closed" | "sync_error";
  reason?: string;
  durationMinutes: number;
  bufferMinutes: number;
  salonHours: string;
  totalSlots: number;
  availableSlotsCount: number;
  occupiedGoogleSlotsCount: number;
  googleCalendarSynced: boolean;
  lastSuccessfulSyncAt: string | null;
  googleAccount: string;
  calendarId: string;
  slots: GeneratedSlot[];
  error?: string;
}

// In-memory record of last successful Google sync
let lastSuccessfulSyncTimestamp: string | null = null;

// Allow override for automated tests
let activeCalendarIdOverride: string | null = null;
export function setTestCalendarId(calId: string | null) {
  activeCalendarIdOverride = calId;
}

export function getActiveCalendarId(): string {
  return activeCalendarIdOverride || process.env.GOOGLE_CALENDAR_ID || DEFAULT_SALON_CALENDAR_ID;
}

/**
 * Loads stored OAuth refresh token from persistent file or env variables.
 */
export function getStoredRefreshToken(): string | null {
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    return process.env.GOOGLE_REFRESH_TOKEN.trim();
  }
  try {
    if (fs.existsSync(TOKEN_STORAGE_FILE)) {
      const data: StoredCalendarAuth = JSON.parse(fs.readFileSync(TOKEN_STORAGE_FILE, "utf-8"));
      if (data.refreshToken) {
        return data.refreshToken.trim();
      }
    }
  } catch (err) {
    console.warn("[GoogleCalendarBackend] Error reading token storage file:", err);
  }
  return null;
}

/**
 * Saves refresh token to persistent file.
 */
export function saveStoredRefreshToken(refreshToken: string) {
  try {
    const payload: StoredCalendarAuth = {
      refreshToken: refreshToken.trim(),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(TOKEN_STORAGE_FILE, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.error("[GoogleCalendarBackend] Error saving token to storage file:", err);
  }
}

/**
 * Gets an authenticated Google Calendar API client.
 * Returns null if no valid server-side credentials are configured.
 */
export async function getAuthenticatedCalendarClient(): Promise<{
  calendar: ReturnType<typeof google.calendar> | null;
  authMethod: "oauth_refresh_token" | "service_account" | "none";
  error?: string;
}> {
  // Strategy 1: OAuth2 with Refresh Token (preferred for salon owner slowskinconcept@gmail.com)
  const clientId = process.env.GOOGLE_CLIENT_ID || firebaseConfig.oAuthClientId;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = getStoredRefreshToken();

  if (clientId && clientSecret && refreshToken) {
    try {
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      return { calendar, authMethod: "oauth_refresh_token" };
    } catch (e: any) {
      return { calendar: null, authMethod: "none", error: `Błąd inicjalizacji OAuth2: ${e.message}` };
    }
  }

  // Strategy 2: Service Account (GOOGLE_SERVICE_ACCOUNT_KEY or private key in env)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      let keyData: any;
      if (fs.existsSync(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)) {
        keyData = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, "utf-8"));
      } else {
        keyData = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      }
      const jwtClient = new google.auth.JWT({
        email: keyData.client_email,
        key: keyData.private_key,
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });
      const calendar = google.calendar({ version: "v3", auth: jwtClient });
      return { calendar, authMethod: "service_account" };
    } catch (e: any) {
      return { calendar: null, authMethod: "none", error: `Błąd inicjalizacji Service Account: ${e.message}` };
    }
  }

  // Detailed description of what is missing
  const missing: string[] = [];
  if (!clientId) missing.push("GOOGLE_CLIENT_ID");
  if (!clientSecret) missing.push("GOOGLE_CLIENT_SECRET");
  if (!refreshToken) missing.push("GOOGLE_REFRESH_TOKEN");

  return {
    calendar: null,
    authMethod: "none",
    error: `Brak konfiguracji uwierzytelnienia serwerowego kalendarza gabinetu. Wymagane: ${missing.join(", ")} (lub GOOGLE_SERVICE_ACCOUNT_KEY).`,
  };
}

/**
 * Checks backend authentication and API readiness status.
 */
export async function verifyCalendarConnection(): Promise<{
  ready: boolean;
  authMethod: string;
  calendarId: string;
  accountEmail: string;
  error?: string;
  instructions?: string;
}> {
  const { calendar, authMethod, error } = await getAuthenticatedCalendarClient();
  const calendarId = getActiveCalendarId();

  if (!calendar) {
    return {
      ready: false,
      authMethod,
      calendarId,
      accountEmail: SALON_ACCOUNT_EMAIL,
      error,
      instructions:
        "Aby połączyć Kalendarz Google gabinetu na serwerze:\n" +
        "1. Ustaw w zmiennych środowiskowych GOOGLE_CLIENT_ID oraz GOOGLE_CLIENT_SECRET (z Google Cloud Console projektu gen-lang-client-0130882183).\n" +
        "2. Skonfiguruj GOOGLE_REFRESH_TOKEN autoryzowany przez właściciela slowskinconcept@gmail.com.\n" +
        "3. Upewnij się, że w Google Cloud Console włączona jest Google Calendar API dla projektu.\n" +
        "4. Alternatywnie użyj Service Account (GOOGLE_SERVICE_ACCOUNT_KEY) i dodaj jego e-mail do uprawnień kalendarza.",
    };
  }

  try {
    // Test freebusy query for today to confirm API enablement and permissions
    const now = new Date();
    const timeMin = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const timeMax = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

    const fbRes = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: SALON_TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    if (fbRes.status === 200) {
      lastSuccessfulSyncTimestamp = new Date().toISOString();
      return {
        ready: true,
        authMethod,
        calendarId,
        accountEmail: SALON_ACCOUNT_EMAIL,
      };
    }

    return {
      ready: false,
      authMethod,
      calendarId,
      accountEmail: SALON_ACCOUNT_EMAIL,
      error: `Nieoczekiwana odpowiedź Google FreeBusy: status ${fbRes.status}`,
    };
  } catch (apiErr: any) {
    return {
      ready: false,
      authMethod,
      calendarId,
      accountEmail: SALON_ACCOUNT_EMAIL,
      error: apiErr?.message || "Błąd odpytania Google Calendar API.",
    };
  }
}

/**
 * Queries Google Calendar freebusy.query for the specified date and calendarId.
 * Returns ONLY busy time ranges without private event details.
 */
export async function fetchGoogleBusyIntervals(
  dateStr: string,
  calendarId: string = getActiveCalendarId()
): Promise<{ busy: BusyInterval[]; syncedAt: string }> {
  const { calendar, error } = await getAuthenticatedCalendarClient();
  if (!calendar) {
    throw new Error(error || "Serwer nie jest uwierzytelniony w Google Calendar.");
  }

  // Define full day range in Europe/Warsaw
  // 00:00:00 to 23:59:59
  const timeMin = `${dateStr}T00:00:00+02:00`;
  const timeMax = `${dateStr}T23:59:59+02:00`;

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: SALON_TIMEZONE,
      items: [{ id: calendarId }],
    },
  });

  const calData = response.data.calendars?.[calendarId];
  if (calData?.errors && calData.errors.length > 0) {
    const errMsg = calData.errors.map((e) => e.reason).join(", ");
    throw new Error(`Błąd kalendarza ${calendarId}: ${errMsg}`);
  }

  const busyList = calData?.busy || [];
  const parsedBusy: BusyInterval[] = busyList
    .map((b) => ({
      start: new Date(b.start!),
      end: new Date(b.end!),
    }))
    .filter((b) => !isNaN(b.start.getTime()) && !isNaN(b.end.getTime()));

  const nowIso = new Date().toISOString();
  lastSuccessfulSyncTimestamp = nowIso;

  return { busy: parsedBusy, syncedAt: nowIso };
}

/**
 * Converts HH:MM string to minutes from midnight.
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Converts minutes from midnight to HH:MM string.
 */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Pure function: calculates available slots for a specific date given working hours,
 * treatment duration, buffer, and busy intervals from Google and local reservations.
 */
export function calculateAvailabilitySlots(params: {
  dateStr: string;
  durationMinutes: number;
  bufferMinutes?: number;
  busyIntervals: BusyInterval[];
  existingBookings?: Array<{ timeStr: string; durationMinutes: number }>;
  googleCalendarSynced: boolean;
  lastSuccessfulSyncAt: string | null;
  calendarId: string;
}): SlotsCalculationResult {
  const {
    dateStr,
    durationMinutes,
    bufferMinutes = DEFAULT_BUFFER_MINUTES,
    busyIntervals,
    existingBookings = [],
    googleCalendarSynced,
    lastSuccessfulSyncAt,
    calendarId,
  } = params;

  const [year, month, day] = dateStr.split("-").map(Number);
  const reqDate = new Date(year, month - 1, day, 12, 0, 0);
  const dayOfWeek = reqDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  const dayName = dayNames[dayOfWeek];

  // Saturday & Sunday are closed
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      success: true,
      date: dateStr,
      dayName,
      isClosed: true,
      isFullyBooked: false,
      status: "closed",
      reason:
        dayOfWeek === 6
          ? "W soboty gabinet jest nieczynny. Zapraszamy od poniedziałku do piątku w godzinach 10:00 — 19:30."
          : "W niedziele Instytut Slow Skin Concept jest nieczynny — dzień regeneracji komórkowej i wyciszenia.",
      durationMinutes,
      bufferMinutes,
      salonHours: "10:00 — 19:30 (Pon–Pt)",
      totalSlots: 0,
      availableSlotsCount: 0,
      occupiedGoogleSlotsCount: 0,
      googleCalendarSynced,
      lastSuccessfulSyncAt,
      googleAccount: SALON_ACCOUNT_EMAIL,
      calendarId,
      slots: [],
    };
  }

  const openMinutes = SALON_OPEN_HOUR * 60 + SALON_OPEN_MINUTE; // 600 (10:00)
  const closeMinutes = SALON_CLOSE_HOUR * 60 + SALON_CLOSE_MINUTE; // 1170 (19:30)

  // Convert busy intervals to minute ranges within the requested day in Europe/Warsaw
  const busyMinuteRanges: Array<{ start: number; end: number; source: "google_calendar" | "salon_booking" }> = [];

  // Helper to get minutes in Europe/Warsaw
  const getWarsawMinutes = (d: Date): number => {
    const formatter = new Intl.DateTimeFormat("pl-PL", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: SALON_TIMEZONE,
    });
    const parts = formatter.formatToParts(d);
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
    return hour * 60 + minute;
  };

  const getWarsawDateStr = (d: Date): string => {
    const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: SALON_TIMEZONE });
    return formatter.format(d);
  };

  busyIntervals.forEach((interval) => {
    const startStr = getWarsawDateStr(interval.start);
    const endStr = getWarsawDateStr(interval.end);

    // If starts before this day and ends after this day: blocks entire day
    if (startStr < dateStr && endStr > dateStr) {
      busyMinuteRanges.push({ start: 0, end: 1440, source: "google_calendar" });
      return;
    }

    let startMin = 0;
    let endMin = 1440;

    if (startStr === dateStr) {
      startMin = getWarsawMinutes(interval.start);
    }
    if (endStr === dateStr) {
      endMin = getWarsawMinutes(interval.end);
    }

    if (endMin > startMin) {
      busyMinuteRanges.push({ start: startMin, end: endMin, source: "google_calendar" });
    }
  });

  // Local salon confirmed bookings
  existingBookings.forEach((b) => {
    const start = timeToMinutes(b.timeStr);
    const end = start + (b.durationMinutes || durationMinutes) + bufferMinutes;
    busyMinuteRanges.push({ start, end, source: "salon_booking" });
  });

  // Check if entire day is blocked by an all-day busy block
  const fullDayBlock = busyMinuteRanges.find((b) => b.start <= openMinutes && b.end >= closeMinutes);
  if (fullDayBlock) {
    return {
      success: true,
      date: dateStr,
      dayName,
      isClosed: false,
      isFullyBooked: true,
      status: "fully_booked",
      reason: `W dniu ${dateStr} (${dayName}) wszystkie godziny są zajęte w Kalendarzu Google gabinetu. Brak wolnych terminów.`,
      durationMinutes,
      bufferMinutes,
      salonHours: "10:00 — 19:30 (Pon–Pt)",
      totalSlots: 0,
      availableSlotsCount: 0,
      occupiedGoogleSlotsCount: 0,
      googleCalendarSynced,
      lastSuccessfulSyncAt,
      googleAccount: SALON_ACCOUNT_EMAIL,
      calendarId,
      slots: [],
    };
  }

  // Generate slots every 30 minutes from open to close
  const slots: GeneratedSlot[] = [];
  const requiredBlock = durationMinutes + bufferMinutes;

  for (let m = openMinutes; m + durationMinutes <= closeMinutes; m += 30) {
    const slotStart = m;
    const slotEnd = slotStart + durationMinutes;
    const slotBlockEnd = slotStart + requiredBlock;

    // Collision check against busy intervals
    // A collision occurs if the slot + disinfection buffer overlaps a busy block:
    // slotStart < busyEnd && slotBlockEnd > busyStart
    const colliding = busyMinuteRanges.find((b) => slotStart < b.end && slotBlockEnd > b.start);

    // Operating hours closing rule: treatment + 15m buffer must finish at or before 19:30
    const finishesInWorkingHours = slotBlockEnd <= closeMinutes;
    const isAvailable = !colliding && finishesInWorkingHours;

    let reason = "Wolny termin";
    if (colliding) {
      reason = colliding.source === "google_calendar" ? "Termin zajęty w Kalendarzu Google" : "Termin zarezerwowany";
    } else if (!finishesInWorkingHours) {
      reason = "Zabieg wraz z 15-min buforem przekracza godziny pracy gabinetu (19:30)";
    }

    slots.push({
      time: minutesToTime(slotStart),
      endTime: minutesToTime(slotEnd),
      durationMinutes,
      bufferMinutes,
      isAvailable,
      reason,
      source: colliding?.source || null,
    });
  }

  const availableCount = slots.filter((s) => s.isAvailable).length;
  const occupiedGoogleCount = slots.filter((s) => s.source === "google_calendar").length;
  const isFullyBooked = slots.length > 0 && availableCount === 0;

  return {
    success: true,
    date: dateStr,
    dayName,
    isClosed: false,
    isFullyBooked,
    status: isFullyBooked ? "fully_booked" : "available",
    reason: isFullyBooked
      ? `W dniu ${dateStr} (${dayName}) wszystkie godziny są zajęte w Kalendarzu Google gabinetu (${SALON_ACCOUNT_EMAIL}). Prosimy o wybór innego dnia roboczego.`
      : undefined,
    durationMinutes,
    bufferMinutes,
    salonHours: "10:00 — 19:30 (Pon–Pt)",
    totalSlots: slots.length,
    availableSlotsCount: availableCount,
    occupiedGoogleSlotsCount: occupiedGoogleCount,
    googleCalendarSynced,
    lastSuccessfulSyncAt,
    googleAccount: SALON_ACCOUNT_EMAIL,
    calendarId,
    slots,
  };
}

/**
 * Top-level function for obtaining availability slots for a date.
 * Queries Google Calendar freebusy.query in real time.
 * If Google fails or is not authenticated, returns status: "sync_error", googleCalendarSynced: false.
 */
export async function getLiveAvailableSlots(
  dateStr: string,
  durationMinutes: number,
  existingBookings: Array<{ timeStr: string; durationMinutes: number }> = []
): Promise<SlotsCalculationResult> {
  const [year, month, day] = dateStr.split("-").map(Number);
  const reqDate = new Date(year, month - 1, day, 12, 0, 0);
  const dayOfWeek = reqDate.getDay();
  const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  const dayName = dayNames[dayOfWeek];
  const calendarId = getActiveCalendarId();

  // Weekend check: closed
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return calculateAvailabilitySlots({
      dateStr,
      durationMinutes,
      busyIntervals: [],
      existingBookings,
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: lastSuccessfulSyncTimestamp,
      calendarId,
    });
  }

  try {
    const { busy, syncedAt } = await fetchGoogleBusyIntervals(dateStr, calendarId);
    return calculateAvailabilitySlots({
      dateStr,
      durationMinutes,
      busyIntervals: busy,
      existingBookings,
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: syncedAt,
      calendarId,
    });
  } catch (err: any) {
    console.error(`[GoogleCalendarBackend] Failed to fetch freebusy for ${dateStr}:`, err.message);
    return {
      success: false,
      date: dateStr,
      dayName,
      isClosed: false,
      isFullyBooked: false,
      status: "sync_error",
      reason: "Nie możemy teraz sprawdzić dostępności w Kalendarzu Google. Kliknij, aby ponowić próbę.",
      durationMinutes,
      bufferMinutes: DEFAULT_BUFFER_MINUTES,
      salonHours: "10:00 — 19:30 (Pon–Pt)",
      totalSlots: 0,
      availableSlotsCount: 0,
      occupiedGoogleSlotsCount: 0,
      googleCalendarSynced: false,
      lastSuccessfulSyncAt: null,
      googleAccount: SALON_ACCOUNT_EMAIL,
      calendarId,
      slots: [],
      error: err.message || "Błąd pobierania dostępności z Kalendarza Google.",
    };
  }
}

/**
 * Inserts a booking into the verified salon Google Calendar server-side.
 * Strictly writes to the configured salon calendar ID.
 * NO fallback to client primary calendar.
 */
export async function insertBookingIntoSalonCalendar(booking: {
  treatmentName: string;
  durationMinutes: number;
  price: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  dateStr: string;
  timeStr: string;
  notes?: string;
  isOnlineConsultation?: boolean;
}): Promise<{
  success: boolean;
  eventId?: string;
  calendarId?: string;
  htmlLink?: string;
  error?: string;
}> {
  const { calendar, error } = await getAuthenticatedCalendarClient();
  const calendarId = getActiveCalendarId();

  if (!calendar) {
    return {
      success: false,
      error: error || "Brak uwierzytelnienia serwerowego do zapisu w Kalendarzu Google gabinetu.",
    };
  }

  try {
    const [year, month, day] = booking.dateStr.split("-").map(Number);
    const [hours, minutes] = (booking.timeStr || "10:00").split(":").map(Number);

    // Construct start and end Date
    const startDate = new Date(year, month - 1, day, hours, minutes, 0);
    const endDate = new Date(startDate.getTime() + booking.durationMinutes * 60 * 1000);

    const locationText = booking.isOnlineConsultation
      ? "Google Meet (Wideorozmowa Online 1:1) — Instytut Slow Skin Concept"
      : "Instytut Zdrowej Skóry Slow Skin Concept, ul. Szkolna 5, 55-220 Jelcz-Laskowice";

    const description = [
      `🌿 REZERWACJA WIZYTY W INSTYTUCIE SLOW SKIN CONCEPT`,
      `----------------------------------------------------`,
      `• Zabieg: ${booking.treatmentName}`,
      `• Czas trwania: ${booking.durationMinutes} minut`,
      `• Inwestycja: ${booking.price}`,
      `• Termin: ${booking.dateStr} godz. ${booking.timeStr}`,
      `• Rodzaj: ${booking.isOnlineConsultation ? "Konsultacja Online" : "Wizyta stacjonarna"}`,
      `\n👤 DANE KLIENTA:`,
      `• Imię i Nazwisko: ${booking.clientName}`,
      `• Telefon: ${booking.clientPhone}`,
      `• E-mail: ${booking.clientEmail}`,
      booking.notes ? `\n📝 Notatki / Stan skóry: ${booking.notes}` : "",
      `\n----------------------------------------------------`,
      `🏛️ Instytut Zdrowej Skóry Slow Skin Concept`,
      `Oficjalne konto: ${SALON_ACCOUNT_EMAIL}`,
      `Telefon kontaktowy: +48 793 088 854`,
    ].join("\n");

    const requestBody: any = {
      summary: `Rezerwacja: ${booking.treatmentName} — ${booking.clientName}`,
      location: locationText,
      description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: SALON_TIMEZONE,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: SALON_TIMEZONE,
      },
      attendees: [
        { email: SALON_ACCOUNT_EMAIL, displayName: "Slow Skin Concept", responseStatus: "accepted" },
        { email: booking.clientEmail, displayName: booking.clientName },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 1440 }, // 24h
          { method: "popup", minutes: 120 }, // 2h
          { method: "email", minutes: 1440 }, // 24h
        ],
      },
    };

    if (booking.isOnlineConsultation) {
      requestBody.conferenceData = {
        createRequest: {
          requestId: `slow-skin-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      };
    }

    const insertRes = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: booking.isOnlineConsultation ? 1 : 0,
      sendUpdates: "all",
      requestBody,
    });

    if (insertRes.status === 200 || insertRes.status === 201) {
      const created = insertRes.data;
      return {
        success: true,
        eventId: created.id || undefined,
        calendarId,
        htmlLink: created.htmlLink || undefined,
      };
    }

    return {
      success: false,
      error: `Nieoczekiwana odpowiedź zapisu w kalendarzu Google: status ${insertRes.status}`,
    };
  } catch (insertErr: any) {
    console.error("[GoogleCalendarBackend] Error inserting event into Google Calendar:", insertErr);
    return {
      success: false,
      error: insertErr?.message || "Błąd zapisu rezerwacji w kalendarzu Google.",
    };
  }
}
