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
import { safeStorage } from "../utils/storage";

export const SLOW_SKIN_GOOGLE_ACCOUNT = "slowskinconcept@gmail.com";
export const SLOW_SKIN_CALENDAR_ID = "ec7711f8f95afc5d0e88dd4a404e2b15d3503323b86963b41d25747356d8b0d7@group.calendar.google.com";

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
        scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
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
