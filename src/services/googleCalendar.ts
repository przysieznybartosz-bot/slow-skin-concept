/**
 * Google Calendar Integration Service for Slow Skin Concept
 * Handles Google OAuth 2.0 Token Acquisition (GSI) and direct event creation in Google Calendar.
 */

import { safeStorage } from "../utils/storage";

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

const GOOGLE_CLIENT_ID = (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GOOGLE_CLIENT_ID : "") || "";
const SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

// In-memory token store
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

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

export function isGoogleAuthAvailable(): boolean {
  return typeof window !== "undefined" && typeof (window as any).google?.accounts?.oauth2 !== "undefined";
}

/**
 * Initiates Google OAuth popup to request Calendar permission
 */
export function requestGoogleCalendarAccess(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isGoogleAuthAvailable()) {
      reject(new Error("Biblioteka Google Identity Services nie jest jeszcze załadowana."));
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      // In dev or without client id, we reject gracefully so fallback works
      reject(new Error("Brak skonfigurowanego identyfikatora Google Client ID (VITE_GOOGLE_CLIENT_ID)."));
      return;
    }

    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
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
 * Adds an event directly into user's primary Google Calendar via REST API
 */
export async function insertEventIntoGoogleCalendar(
  token: string,
  event: BookingEventData
): Promise<{ success: boolean; eventLink?: string; error?: string }> {
  try {
    const [year, month, day] = event.dateStr.split("-").map(Number);
    const [hours, minutes] = (event.timeStr || "10:00").split(":").map(Number);
    
    // Create start and end Date objects in local Europe/Warsaw context
    const startDate = new Date(year, month - 1, day, hours, minutes, 0);
    const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

    const locationText = event.isOnlineConsultation
      ? "Konsultacja Online — Slow Skin Concept (Google Meet / Połączenie Wideo)"
      : "Instytut Zdrowej Skóry Slow Skin Concept, ul. Szkolna 5, 55-220 Jelcz-Laskowice (k. Wrocławia)";

    const description = [
      `🌿 Rezerwacja Wizyty: ${event.treatmentName}`,
      `⏱️ Czas trwania: ${event.durationMinutes} min`,
      `💎 Inwestycja: ${event.price}`,
      `👤 Klient: ${event.clientName}`,
      `📞 Telefon: ${event.clientPhone}`,
      `✉️ E-mail: ${event.clientEmail}`,
      event.notes ? `\n📝 Notatki / Uwagi: ${event.notes}` : "",
      "\n---------------------------------------------",
      "Instytut Zdrowej Skóry Slow Skin Concept",
      "ul. Szkolna 5, 55-220 Jelcz-Laskowice",
      "Tel: +48 793 088 854 | kontakt@slowskinconcept.pl | https://slowskinconcept.pl",
    ].join("\n");

    const payload: any = {
      summary: `Slow Skin Concept: ${event.treatmentName}`,
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

    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json();
      return { success: false, error: errorJson?.error?.message || "Błąd zapisu w kalendarzu Google." };
    }

    const data = await res.json();
    return {
      success: true,
      eventLink: data.htmlLink || `https://calendar.google.com/calendar/r/eventedit/${data.id}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Błąd połączenia z Google Calendar." };
  }
}

/**
 * Generates direct one-click Google Calendar Web template URL
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

  const title = encodeURIComponent(`Slow Skin Concept: ${event.treatmentName}`);

  const location = encodeURIComponent(
    event.isOnlineConsultation
      ? "Google Meet — Videokonsultacja Bionomiczna (Slow Skin Concept)"
      : "Instytut Zdrowej Skóry Slow Skin Concept, ul. Szkolna 5, 55-220 Jelcz-Laskowice"
  );

  const meetNote = event.isOnlineConsultation
    ? `\n🎥 POŁĄCZENIE WIDEO GOOGLE MEET:\nDołącz do spotkania wideo: https://meet.google.com/new\n(Lub skorzystaj z bezpośredniego linku w e-mailu / zaproszeniu kalendarza)\n`
    : "";

  const details = encodeURIComponent(
    `Rezerwacja w Instytucie Slow Skin Concept\n` +
    `Zabieg/Rytuał: ${event.treatmentName}\n` +
    `Czas trwania: ${event.durationMinutes} min\n` +
    `Cena: ${event.price}\n` +
    `Imię i nazwisko: ${event.clientName}\n` +
    `Telefon: ${event.clientPhone}\n` +
    `E-mail: ${event.clientEmail}\n` +
    meetNote +
    `\nLokalizacja: ${event.isOnlineConsultation ? "Google Meet (Online)" : "ul. Szkolna 5, 55-220 Jelcz-Laskowice"}\n` +
    `Kontakt: kontakt@slowskinconcept.pl | Tel: +48 793 088 854\n` +
    `https://slowskinconcept.pl`
  );

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedStart}/${formattedEnd}&details=${details}&location=${location}&sf=true&output=xml`;
}

/**
 * Generates standard .ICS file for Apple Calendar / Outlook
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
