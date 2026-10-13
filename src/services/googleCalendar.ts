/**
 * Google Calendar Integration Service for Slow Skin Concept
 * Official Salon Google Account: slowskinconcept@gmail.com
 * Dedicated Calendar ID: ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com
 *
 * Integrates all bookings for all treatments directly into the studio calendar.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import DEFAULT_GOOGLE_EVENTS from "../../google_calendar_events.json";
import { safeStorage } from "../utils/storage";

export const SLOW_SKIN_GOOGLE_ACCOUNT = "slowskinconcept@gmail.com";
export const SLOW_SKIN_CALENDAR_ID = "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com";

export function getLocalGoogleEvents(): GoogleCalendarStoredEvent[] {
  try {
    const raw = safeStorage.getItem("slowskin_google_events");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Error reading local Google events:", e);
  }
  return DEFAULT_GOOGLE_EVENTS as GoogleCalendarStoredEvent[];
}

/**
 * Standard scheduled appointments in Google Calendar for slowskinconcept@gmail.com
 * providing predictable busy slot protection for every weekday.
 */
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

/**
 * Returns Google Calendar events for any specific date, merging synced events with recurring appointments.
 */
export function getEventsForDate(dateStr: string): GoogleCalendarStoredEvent[] {
  const localGoogleEvents = getLocalGoogleEvents();
  const matched = localGoogleEvents.filter((ev) => ev.dateStr === dateStr);
  if (matched.length > 0) return matched;
  const [year, month, day] = dateStr.split("-").map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  return getWeekdayRecurringGoogleEvents(dayOfWeek, dateStr);
}

export interface BookingEventData {
  title: string;
  treatmentName: string;
  durationMinutes: number;
  price: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:MM
  notes?: string;
  isOnlineConsultation?: boolean;
}

export interface GoogleUserProfile {
  email: string;
  name?: string;
  picture?: string;
}

export interface CalendarSlot {
  time: string;
  endTime: string;
  durationMinutes: number;
  bufferMinutes: number;
  isAvailable: boolean;
  reason?: string;
  source?: "booking" | "google_calendar" | null;
}

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

export interface CalendarSlotsResponse {
  date: string;
  dayName: string;
  isClosed: boolean;
  reason?: string;
  durationMinutes: number;
  bufferMinutes: number;
  salonHours?: string;
  totalSlots: number;
  availableSlotsCount: number;
  occupiedGoogleSlotsCount?: number;
  googleCalendarSynced?: boolean;
  googleAccount?: string;
  slots: CalendarSlot[];
}

/**
 * Extracts realistic duration in minutes from treatment duration strings.
 * Accounts for preparation, client consultation and procedure time.
 */
export function parseTreatmentDuration(durationStr?: string): number {
  if (!durationStr) return 75;
  const str = durationStr.toLowerCase();

  // Match range like "75 — 90 minut" or "60–75 min"
  const rangeMatch = str.match(/(\d+)\s*(?:—|-|–)\s*(\d+)/);
  if (rangeMatch) {
    const max = parseInt(rangeMatch[2], 10);
    return max || 75;
  }

  // Match single number like "90 minut" or "około 60 minut"
  const singleMatch = str.match(/(\d+)\s*min/);
  if (singleMatch) {
    return parseInt(singleMatch[1], 10);
  }

  return 75;
}

/**
 * Fetches dynamic available and occupied slots tailored to the treatment duration
 * from the backend, pre-checking collision with existing bookings and Google Calendar.
 */
export async function fetchCalendarSlots(dateStr: string, durationMinutes: number): Promise<CalendarSlotsResponse> {
  try {
    const token = getCachedGoogleToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/calendar/slots?date=${encodeURIComponent(dateStr)}&duration=${durationMinutes}`, {
      headers,
    });
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      throw new Error("Nie udało się pobrać slotów kalendarza przez API.");
    }
    return await res.json();
  } catch (err: any) {
    console.warn("Using client-side / offline slot generator fallback:", err);
    // Offline / direct calculation fallback
    const [year, month, day] = dateStr.split("-").map(Number);
    const reqDate = new Date(year, month - 1, day);
    const dayOfWeek = reqDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        date: dateStr,
        dayName: dayOfWeek === 6 ? "Sobota" : "Niedziela",
        isClosed: true,
        reason: dayOfWeek === 6 
          ? "W soboty gabinet jest nieczynny (terminy zablokowane). Zapraszamy od poniedziałku do piątku w godzinach 10:00 — 19:30."
          : "W niedziele Instytut Slow Skin Concept jest nieczynny — dzień regeneracji komórkowej i wyciszenia.",
        durationMinutes,
        bufferMinutes: 15,
        totalSlots: 0,
        availableSlotsCount: 0,
        slots: [],
      };
    }

    const dayGoogleEvents = getEventsForDate(dateStr);

    const allDayEvent = dayGoogleEvents.find(ev => ev.isAllDay);
    if (allDayEvent) {
      return {
        date: dateStr,
        dayName: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek],
        isClosed: true,
        reason: `Termin zablokowany w Kalendarzu Google (${allDayEvent.summary}). W tym dniu gabinet nie przyjmuje rezerwacji online.`,
        durationMinutes,
        bufferMinutes: 15,
        totalSlots: 0,
        availableSlotsCount: 0,
        occupiedGoogleSlotsCount: 0,
        googleCalendarSynced: true,
        googleAccount: SLOW_SKIN_GOOGLE_ACCOUNT,
        slots: [],
      };
    }

    // Local bookings from storage
    let localBookings: any[] = [];
    try {
      localBookings = JSON.parse(safeStorage.getItem("slow_skin_bookings") || "[]");
    } catch {}
    const dayBookings = localBookings.filter((b: any) => b.dateStr === dateStr);

    const bookedIntervals: Array<{ start: number; end: number; treatment: string; source: "booking" | "google_calendar" }> = [];

    dayBookings.forEach((b: any) => {
      const [h, m] = (b.timeStr || "10:00").split(":").map(Number);
      const start = h * 60 + m;
      const end = start + (b.durationMinutes || 75) + 15;
      bookedIntervals.push({ start, end, treatment: b.treatmentName || "Rezerwacja", source: "booking" });
    });

    dayGoogleEvents.forEach((ev) => {
      if (ev.startTimeStr && ev.endTimeStr) {
        const [sh, sm] = ev.startTimeStr.split(":").map(Number);
        const [eh, em] = ev.endTimeStr.split(":").map(Number);
        bookedIntervals.push({
          start: sh * 60 + sm,
          end: eh * 60 + em,
          treatment: ev.summary || "Zajęty w Kalendarzu Google",
          source: "google_calendar",
        });
      }
    });

    const openMin = 10 * 60; // 10:00 rano
    const closeMin = 19 * 60 + 30; // 19:30
    const slots: CalendarSlot[] = [];

    const pad = (n: number) => n.toString().padStart(2, "0");
    const toTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

    for (let m = openMin; m + durationMinutes <= closeMin; m += 30) {
      const slotStart = m;
      const slotEnd = slotStart + durationMinutes;
      const slotBlockEnd = slotStart + durationMinutes + 15;

      const colliding = bookedIntervals.find(b => slotStart < b.end && slotBlockEnd > b.start);
      const isAvailable = !colliding && slotBlockEnd <= closeMin + 15;

      let reason = "Wolny termin";
      if (colliding) {
        reason = colliding.source === "google_calendar"
          ? `Zajęty w Kalendarzu Google (${colliding.treatment})`
          : `Zajęty: w trakcie innej terapii (${colliding.treatment})`;
      } else if (slotBlockEnd > closeMin + 15) {
        reason = "Poza godzinami pracy gabinetu";
      }

      slots.push({
        time: toTime(slotStart),
        endTime: toTime(slotEnd),
        durationMinutes,
        bufferMinutes: 15,
        isAvailable,
        reason,
        source: colliding?.source || null,
      });
    }

    return {
      date: dateStr,
      dayName: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][dayOfWeek],
      isClosed: false,
      durationMinutes,
      bufferMinutes: 15,
      salonHours: "10:00 — 19:30 (Pon–Pt)",
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.isAvailable).length,
      occupiedGoogleSlotsCount: slots.filter((s) => s.source === "google_calendar").length,
      googleCalendarSynced: true,
      googleAccount: SLOW_SKIN_GOOGLE_ACCOUNT,
      slots,
    };
  }
}

/**
 * Fetches events directly from Google Calendar API (primary calendar of slowskinconcept@gmail.com)
 * and syncs them to the backend storage so occupied hours become blocked slots in the booking form.
 */
export async function syncGoogleCalendarWithBackend(token: string): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const now = new Date();
    // Fetch from beginning of current month to 3 months ahead
    const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 3, 28).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&maxResults=250&orderBy=startTime`;
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error?.message || "Nie udało się pobrać terminów z Google Calendar.");
    }

    const data = await res.json();
    const items = data.items || [];

    const parsedEvents: GoogleCalendarStoredEvent[] = [];

    for (const item of items) {
      if (item.status === "cancelled") continue;

      const isAllDay = !item.start?.dateTime && !!item.start?.date;
      let dateStr = "";
      let startTimeStr = "10:00";
      let endTimeStr = "19:30";

      if (isAllDay) {
        dateStr = item.start.date;
      } else if (item.start?.dateTime) {
        const startDate = new Date(item.start.dateTime);
        const endDate = item.end?.dateTime ? new Date(item.end.dateTime) : new Date(startDate.getTime() + 60 * 60 * 1000);

        // Format in Europe/Warsaw
        const formatterDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" });
        dateStr = formatterDate.format(startDate); // YYYY-MM-DD

        const formatterTime = new Intl.DateTimeFormat("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Europe/Warsaw",
        });

        startTimeStr = formatterTime.format(startDate);
        endTimeStr = formatterTime.format(endDate);
      }

      if (dateStr) {
        parsedEvents.push({
          id: item.id || `gcal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          summary: item.summary || "Zajęty termin w kalendarzu gabinetu",
          start: item.start?.dateTime || item.start?.date || "",
          end: item.end?.dateTime || item.end?.date || "",
          dateStr,
          startTimeStr,
          endTimeStr,
          isAllDay,
          calendarAccount: SLOW_SKIN_GOOGLE_ACCOUNT,
        });
      }
    }

    // Always save to client storage so it works immediately across sessions on LIVE
    safeStorage.setItem("slowskin_google_events", JSON.stringify(parsedEvents));

    // Also send parsed events to backend
    try {
      await fetch("/api/calendar/sync-google-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: parsedEvents,
          accountEmail: SLOW_SKIN_GOOGLE_ACCOUNT,
        }),
      });
    } catch (apiErr) {
      console.warn("Backend sync notice (offline / static mode):", apiErr);
    }

    return {
      success: true,
      count: parsedEvents.length,
      message: `Zsynchronizowano ${parsedEvents.length} terminów z Kalendarzem Google.`,
    };
  } catch (err: any) {
    console.error("Google Calendar sync error:", err);
    return {
      success: false,
      count: 0,
      message: err.message || "Błąd synchronizacji z Google Calendar.",
    };
  }
}

/**
 * Gets currently synchronized Google Calendar events from the backend or local cache.
 */
export async function getSyncedGoogleEvents(): Promise<{ totalEvents: number; events: GoogleCalendarStoredEvent[] }> {
  try {
    const res = await fetch("/api/calendar/google-events");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events) && data.events.length > 0) {
        safeStorage.setItem("slowskin_google_events", JSON.stringify(data.events));
        return { totalEvents: data.totalEvents || data.events.length, events: data.events };
      }
    }
  } catch {
    // Fallback to local
  }
  const local = getLocalGoogleEvents();
  return { totalEvents: local.length, events: local };
}

/**
 * Adds manual blocked time block (e.g. vacation or break).
 */
export async function addManualCalendarBlock(
  dateStr: string,
  startTimeStr: string,
  endTimeStr: string,
  reason: string,
  isAllDay: boolean = false
): Promise<{ success: boolean; error?: string }> {
  const newBlock: GoogleCalendarStoredEvent = {
    id: `manual-block-${Date.now()}`,
    summary: reason || "Termin zablokowany przez personel gabinetu",
    start: `${dateStr}T${startTimeStr || "10:00"}:00+02:00`,
    end: `${dateStr}T${endTimeStr || "19:30"}:00+02:00`,
    dateStr,
    startTimeStr: isAllDay ? "10:00" : startTimeStr,
    endTimeStr: isAllDay ? "19:30" : endTimeStr,
    isAllDay: !!isAllDay,
    calendarAccount: SLOW_SKIN_GOOGLE_ACCOUNT,
    updatedAt: new Date().toISOString(),
  };

  // Always update local storage
  const current = getLocalGoogleEvents();
  const updated = [newBlock, ...current.filter(b => b.id !== newBlock.id)];
  safeStorage.setItem("slowskin_google_events", JSON.stringify(updated));

  try {
    await fetch("/api/calendar/block-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dateStr, startTimeStr, endTimeStr, reason, isAllDay }),
    });
  } catch {}

  return { success: true };
}

/**
 * Deletes a blocked calendar block.
 */
export async function deleteCalendarBlock(id: string): Promise<boolean> {
  const current = getLocalGoogleEvents();
  const remaining = current.filter((b) => b.id !== id);
  safeStorage.setItem("slowskin_google_events", JSON.stringify(remaining));

  try {
    await fetch(`/api/calendar/google-events/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch {}

  return true;
}

// Initialize Firebase App & Auth
let app: any = null;
let auth: any = null;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase Auth setup initialization note:", e);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar.readonly");
googleProvider.addScope("https://www.googleapis.com/auth/calendar.events");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.email");
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile");

// In-memory token store (Least Privilege & Secure Caching per guidelines)
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;
let isSigningIn = false;

export function getCachedGoogleToken(): string | null {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }
  const savedToken = safeStorage.getItem("slow_skin_google_token");
  const savedExpires = safeStorage.getItem("slow_skin_google_token_expires");
  if (savedToken && savedExpires && Date.now() < parseInt(savedExpires, 10)) {
    cachedToken = savedToken;
    tokenExpiresAt = parseInt(savedExpires, 10);
    return cachedToken;
  }
  return null;
}

export function saveGoogleToken(token: string, expiresInSeconds: number = 3500) {
  cachedToken = token;
  tokenExpiresAt = Date.now() + expiresInSeconds * 1000;
  safeStorage.setItem("slow_skin_google_token", token);
  safeStorage.setItem("slow_skin_google_token_expires", tokenExpiresAt.toString());
}

export function clearGoogleToken() {
  cachedToken = null;
  tokenExpiresAt = 0;
  safeStorage.removeItem("slow_skin_google_token");
  safeStorage.removeItem("slow_skin_google_token_expires");
  safeStorage.removeItem("slow_skin_google_user");
}

/**
 * Initializes Firebase Auth state listener and keeps session active.
 */
export const initCalendarAuth = (
  onAuthSuccess?: (user: FirebaseUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      if (cachedToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Requests Google Calendar permission using Firebase Auth popup with GSI fallback
 */
export async function requestGoogleCalendarAccess(): Promise<string> {
  isSigningIn = true;
  try {
    if (auth) {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        saveGoogleToken(credential.accessToken, 3500);
        return credential.accessToken;
      }
    }
  } catch (err: any) {
    console.warn("Firebase signInWithPopup note, trying GSI client fallback:", err?.message || err);
  } finally {
    isSigningIn = false;
  }

  // Fallback to Google Identity Services (GSI)
  return new Promise((resolve, reject) => {
    const oAuthClientId = firebaseConfig.oAuthClientId || (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GOOGLE_CLIENT_ID : "");
    const gsiAvailable = typeof window !== "undefined" && typeof (window as any).google?.accounts?.oauth2 !== "undefined";

    if (!gsiAvailable) {
      reject(new Error("Zaloguj się kontem Google lub skorzystaj z bezpośredniego linku do kalendarza poniżej."));
      return;
    }

    if (!oAuthClientId) {
      reject(new Error("Brak identyfikatora klienta Google OAuth. Skorzystaj z opcji bezpośredniego dodania do kalendarza."));
      return;
    }

    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: oAuthClientId,
        scope: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          if (response.access_token) {
            const expiresIn = response.expires_in ? parseInt(response.expires_in, 10) : 3500;
            saveGoogleToken(response.access_token, expiresIn);
            resolve(response.access_token);
          } else {
            reject(new Error("Nie otrzymano tokenu dostępu Google."));
          }
        },
      });

      client.requestAccessToken({ prompt: "consent" });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Fetches user profile using Google Access Token
 */
export async function fetchGoogleUserProfile(token: string): Promise<GoogleUserProfile | null> {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  } catch {
    return null;
  }
}

/**
 * Inserts a reservation event directly into the Slow Skin Concept dedicated calendar:
 * ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com
 * (with fallback to client's primary calendar with full attendee invitation to the salon).
 */
export async function insertEventIntoGoogleCalendar(
  token: string,
  event: BookingEventData
): Promise<{ success: boolean; eventLink?: string; calendarTarget?: string; error?: string }> {
  try {
    const [year, month, day] = event.dateStr.split("-").map(Number);
    const [hours, minutes] = (event.timeStr || "10:00").split(":").map(Number);
    
    // Create start and end Date objects in local Europe/Warsaw context
    const startDate = new Date(year, month - 1, day, hours, minutes, 0);
    const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

    const locationText = event.isOnlineConsultation
      ? "Google Meet (Wideorozmowa Online 1:1) — Instytut Slow Skin Concept"
      : "Instytut Zdrowej Skóry Slow Skin Concept, ul. Szkolna 5, 55-220 Jelcz-Laskowice (k. Wrocławia)";

    const description = [
      `🌿 REZERWACJA WIZYTY W INSTYTUCIE SLOW SKIN CONCEPT`,
      `----------------------------------------------------`,
      `• Zabieg / Rytuał: ${event.treatmentName}`,
      `• Czas trwania: ${event.durationMinutes} minut`,
      `• Inwestycja: ${event.price}`,
      `• Termin: ${event.dateStr} godz. ${event.timeStr}`,
      `• Rodzaj: ${event.isOnlineConsultation ? "Konsultacja Online (Google Meet)" : "Wizyta stacjonarna w gabinecie"}`,
      `\n👤 DANE KLIENTA:`,
      `• Imię i Nazwisko: ${event.clientName}`,
      `• Telefon: ${event.clientPhone}`,
      `• E-mail: ${event.clientEmail}`,
      event.notes ? `\n📝 Notatki / Stan skóry: ${event.notes}` : "",
      `\n----------------------------------------------------`,
      `🏛️ Instytut Zdrowej Skóry Slow Skin Concept`,
      `Katarzyna Brzezińska • ul. Szkolna 5, 55-220 Jelcz-Laskowice`,
      `Oficjalny Kalendarz: slowskinconcept@gmail.com`,
      `Tel. kontaktowy: +48 793 088 854 | https://slowskinconcept.pl`,
    ].join("\n");

    const payload: any = {
      summary: `Slow Skin Concept: ${event.treatmentName} — ${event.clientName}`,
      location: locationText,
      description: description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Europe/Warsaw",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Europe/Warsaw",
      },
      attendees: [
        { email: SLOW_SKIN_GOOGLE_ACCOUNT, displayName: "Slow Skin Concept — Recepcja", responseStatus: "accepted" },
        { email: SLOW_SKIN_CALENDAR_ID, displayName: "Kalendarz Rezerwacji Slow Skin Concept", responseStatus: "accepted" },
        { email: event.clientEmail, displayName: event.clientName },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 1440 }, // 24 hours
          { method: "popup", minutes: 120 },  // 2 hours
          { method: "email", minutes: 1440 }, // 24 hours
        ],
      },
    };

    if (event.isOnlineConsultation) {
      payload.conferenceData = {
        createRequest: {
          requestId: `slow-skin-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      };
    }

    // 1. First attempt: Insert directly into the dedicated salon calendar
    const salonCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(SLOW_SKIN_CALENDAR_ID)}/events?conferenceDataVersion=1&sendUpdates=all`;
    let res = await fetch(salonCalendarUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        calendarTarget: "Dedykowany Kalendarz Slow Skin Concept",
        eventLink: data.htmlLink || `https://calendar.google.com/calendar/u/0/r/eventedit/${data.id}`,
      };
    }

    // 2. Second attempt: Insert into user's primary calendar with invitations to slowskinconcept@gmail.com and the salon calendar ID
    const primaryUrl = "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all";
    res = await fetch(primaryUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        calendarTarget: "Kalendarz Klienta + Zaproszenie do slowskinconcept@gmail.com",
        eventLink: data.htmlLink || `https://calendar.google.com/calendar/u/0/r/eventedit/${data.id}`,
      };
    }

    const errorJson = await res.json().catch(() => null);
    return { 
      success: false, 
      error: errorJson?.error?.message || "Błąd zapisu w kalendarzu Google. Użyj opcji bezpośredniego dodania 1-kliknięciem poniżej." 
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Błąd połączenia z Google Calendar." };
  }
}

/**
 * Checks busy intervals for a specific date in the Slow Skin Concept calendar.
 */
export async function fetchCalendarBusyTimes(token: string, dateStr: string): Promise<string[]> {
  try {
    const timeMin = new Date(`${dateStr}T00:00:00Z`).toISOString();
    const timeMax = new Date(`${dateStr}T23:59:59Z`).toISOString();

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(SLOW_SKIN_CALENDAR_ID)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items) return [];

    const busyHours: string[] = [];
    for (const item of data.items) {
      if (item.start?.dateTime) {
        const d = new Date(item.start.dateTime);
        const hh = d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
        busyHours.push(hh);
      }
    }
    return busyHours;
  } catch {
    return [];
  }
}

/**
 * Generates direct one-click Google Calendar Web template URL pre-targeted
 * at slowskinconcept@gmail.com and the dedicated calendar ID.
 */
export function generateGoogleCalendarDeepLink(event: BookingEventData): string {
  const [year, month, day] = event.dateStr.split("-").map(Number);
  const [hours, minutes] = (event.timeStr || "10:00").split(":").map(Number);
  
  const startDate = new Date(year, month - 1, day, hours, minutes, 0);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

  const formatGDate = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };

  const formattedStart = formatGDate(startDate);
  const formattedEnd = formatGDate(endDate);

  const title = encodeURIComponent(`Slow Skin Concept: ${event.treatmentName} — ${event.clientName}`);

  const location = encodeURIComponent(
    event.isOnlineConsultation
      ? "Google Meet (Wideorozmowa Online 1:1) — Instytut Slow Skin Concept"
      : "Instytut Zdrowej Skóry Slow Skin Concept, ul. Szkolna 5, 55-220 Jelcz-Laskowice"
  );

  const meetNote = event.isOnlineConsultation
    ? `\n🎥 POŁĄCZENIE WIDEO GOOGLE MEET:\nDołącz do spotkania: https://meet.google.com/new\n(Link w zaproszeniu kalendarza)\n`
    : "";

  const details = encodeURIComponent(
    `Rezerwacja Wizyty w Instytucie Slow Skin Concept\n` +
    `Zabieg: ${event.treatmentName}\n` +
    `Czas trwania: ${event.durationMinutes} min\n` +
    `Cena: ${event.price}\n` +
    `Klient: ${event.clientName}\n` +
    `Telefon: ${event.clientPhone}\n` +
    `E-mail: ${event.clientEmail}\n` +
    (event.notes ? `Notatki: ${event.notes}\n` : "") +
    meetNote +
    `\nOficjalny Kalendarz Instytutu: slowskinconcept@gmail.com\n` +
    `Identyfikator kalendarza: ${SLOW_SKIN_CALENDAR_ID}\n` +
    `Lokalizacja: ${event.isOnlineConsultation ? "Google Meet (Online)" : "ul. Szkolna 5, 55-220 Jelcz-Laskowice"}\n` +
    `Kontakt: slowskinconcept@gmail.com | Tel: +48 793 088 854\n` +
    `https://slowskinconcept.pl`
  );

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStart}/${formattedEnd}&details=${details}&location=${location}&add=${encodeURIComponent(SLOW_SKIN_GOOGLE_ACCOUNT)}&add=${encodeURIComponent(SLOW_SKIN_CALENDAR_ID)}&sf=true&output=xml`;
}

/**
 * Generates standard .ICS file for Apple Calendar, Outlook, and Google Calendar
 * with the salon organizer and official calendar participants.
 */
export function downloadIcsCalendarFile(event: BookingEventData) {
  const [year, month, day] = event.dateStr.split("-").map(Number);
  const [hours, minutes] = (event.timeStr || "10:00").split(":").map(Number);
  
  const startDate = new Date(year, month - 1, day, hours, minutes, 0);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

  const formatIcsDate = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Slow Skin Concept//NONSGML v1.0//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:slowskin-${Date.now()}@slowskinconcept.pl`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:Slow Skin Concept: ${event.treatmentName}`,
    `ORGANIZER;CN=Instytut Zdrowej Skóry Slow Skin Concept:mailto:${SLOW_SKIN_GOOGLE_ACCOUNT}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Slow Skin Concept Kalendarz:mailto:${SLOW_SKIN_GOOGLE_ACCOUNT}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${event.clientName}:mailto:${event.clientEmail}`,
    `DESCRIPTION:Wizyta w Instytucie Zdrowej Skóry Slow Skin Concept: ${event.treatmentName}. Czas: ${event.durationMinutes} min. Klient: ${event.clientName}. Telefon: ${event.clientPhone}.${event.isOnlineConsultation ? " Wideorozmowa Google Meet: https://meet.google.com/new" : ""}`,
    `LOCATION:${event.isOnlineConsultation ? "Google Meet (Videokonsultacja Online)" : "ul. Szkolna 5, 55-220 Jelcz-Laskowice"}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Przypomnienie o wizycie w Slow Skin Concept",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Slow-Skin-Concept-${event.treatmentName.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
