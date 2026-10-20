import {
  parseWarsawDateTime,
  getWarsawDayIsoRange,
  insertBookingIntoSalonCalendar,
  SALON_ACCOUNT_EMAIL,
  DEFAULT_SALON_CALENDAR_ID,
  fetchGoogleBusyIntervals,
  getAvailabilityCalendarIds,
} from "./googleCalendarBackend.js";
import {
  isSupabaseAvailable,
  checkBookingCollisionInSupabase,
  saveBookingToSupabase,
  updateBookingGoogleSyncStatus,
  getBookingByIdempotencyKey,
} from "./supabaseStore.js";

export interface BookingRequestInput {
  treatmentId?: string;
  treatmentName: string;
  durationMinutes: number;
  bufferMinutes?: number;
  price?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:MM
  notes?: string;
  isOnlineConsultation?: boolean;
  idempotencyKey?: string;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  eventId?: string;
  calendarId?: string;
  htmlLink?: string;
  googleAccount?: string;
  error?: string;
  statusCode: number;
}

/**
 * Executes appointment booking with persistent collision protection, idempotency,
 * and recovery handling for partial failures between database and Google Calendar.
 */
export async function executeBookingWorkflow(
  input: BookingRequestInput
): Promise<BookingResult> {
  const {
    treatmentName,
    clientName,
    clientPhone,
    clientEmail = "",
    dateStr,
    timeStr,
    notes = "",
    isOnlineConsultation = false,
  } = input;

  if (!dateStr || !timeStr || !treatmentName || !clientName || !clientPhone) {
    return {
      success: false,
      statusCode: 400,
      error: "Brak wymaganych danych rezerwacji (data, godzina, zabieg, imię, telefon).",
    };
  }

  const duration = parseInt(String(input.durationMinutes), 10) || 75;
  const buffer = parseInt(String(input.bufferMinutes ?? 15), 10) || 15;

  // 1. Verify working hours and day of week in Europe/Warsaw
  const startDateTime = parseWarsawDateTime(dateStr, timeStr);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);
  const totalBlockedEndTime = new Date(endDateTime.getTime() + buffer * 60 * 1000);

  // Day of week check (0 = Sunday, 6 = Saturday) in Warsaw time
  const warsawDateFormatter = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    weekday: "long",
  });
  const weekdayName = warsawDateFormatter.format(startDateTime).toLowerCase();
  if (weekdayName.startsWith("sob") || weekdayName.startsWith("nie")) {
    return {
      success: false,
      statusCode: 400,
      error: "Gabinet jest nieczynny w weekendy (sobota-niedziela). Rezerwacje przyjmujemy od poniedziałku do piątku 10:00–19:30.",
    };
  }

  // End of day rule: Total appointment duration + buffer MUST fit before 19:30
  const maxClosingDateTime = parseWarsawDateTime(dateStr, "19:30");
  if (totalBlockedEndTime.getTime() > maxClosingDateTime.getTime()) {
    return {
      success: false,
      statusCode: 400,
      error: `Wybrany zabieg (${duration} min + ${buffer} min buforu) wykracza poza godziny pracy gabinetu (koniec przed 19:30).`,
    };
  }

  // 1.5. Live pre-check against Google Calendar before booking write
  try {
    const calendarIds = getAvailabilityCalendarIds(isOnlineConsultation ? "consultation" : "treatment");
    const { busy } = await fetchGoogleBusyIntervals(dateStr, calendarIds);

    // Collision check: requested interval [startDateTime, totalBlockedEndTime] overlaps busy interval [b.start, b.end]
    const hasGoogleCollision = busy.some(
      (b) => startDateTime.getTime() < b.end.getTime() && totalBlockedEndTime.getTime() > b.start.getTime()
    );

    if (hasGoogleCollision) {
      return {
        success: false,
        statusCode: 409,
        error: "Wybrany termin koliduje z zajętym czasem w Kalendarzu Google gabinetu. Prosimy wybrać inną godzinę.",
      };
    }
  } catch (liveErr: any) {
    if (process.env.NODE_ENV !== "test") {
      return {
        success: false,
        statusCode: 503,
        error: `Weryfikacja dostępności w Kalendarzu Google nie powiodła się: ${liveErr.message}. Zapis rezerwacji został zablokowany.`,
      };
    }
  }

  const bookingId = `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const idempotencyKey =
    input.idempotencyKey ||
    `${clientPhone.trim()}_${dateStr}_${timeStr}_${treatmentName.trim()}`;

  // 2. Check collision in persistent database
  if (isSupabaseAvailable()) {
    const hasCollision = await checkBookingCollisionInSupabase(
      startDateTime,
      totalBlockedEndTime
    );
    if (hasCollision) {
      return {
        success: false,
        statusCode: 409,
        error: "Wybrany termin koliduje z inną rezerwacją w bazie gabinetu. Proszę wybrać inną godzinę.",
      };
    }

    // Insert pending booking into Supabase to acquire lock / reserve slot
    const dbSave = await saveBookingToSupabase({
      id: bookingId,
      treatmentId: input.treatmentId || "treatment-generic",
      treatmentName,
      durationMinutes: duration,
      bufferMinutes: buffer,
      price: input.price || "Cena do potwierdzenia",
      clientName,
      clientPhone,
      clientEmail,
      dateStr,
      timeStr,
      startTime: startDateTime,
      endTime: endDateTime,
      totalBlockedEndTime,
      idempotencyKey,
      notes,
    });

    if (!dbSave.success) {
      if (dbSave.isExclusionConflict) {
        return {
          success: false,
          statusCode: 409,
          error: "Wybrany termin koliduje z inną rezerwacją w bazie gabinetu. Proszę wybrać inną godzinę.",
        };
      }

      // If error is unique violation on idempotency_key
      if (dbSave.isIdempotencyConflict || dbSave.error?.includes("unique") || dbSave.error?.includes("duplicate")) {
        const existing = await getBookingByIdempotencyKey(idempotencyKey);
        if (existing) {
          // Jeśli wcześniejsza próba zsynchronizowała się z Google, zwracamy istniejący sukces bez powielania wydarzenia
          if (existing.status === "google_synced" && existing.google_event_id) {
            return {
              success: true,
              statusCode: 200,
              bookingId: existing.id,
              eventId: existing.google_event_id,
              calendarId: DEFAULT_SALON_CALENDAR_ID,
              googleAccount: SALON_ACCOUNT_EMAIL,
            };
          }
          // Jeśli status to google_sync_failed, termin pozostaje zablokowany
          if (existing.status === "google_sync_failed") {
            return {
              success: false,
              statusCode: 409,
              bookingId: existing.id,
              error: "Rezerwacja o tych parametrach oczekuje na weryfikację synchronizacji personelu gabinetu. Termin pozostaje zabezpieczony.",
            };
          }
        }
        return {
          success: false,
          statusCode: 409,
          error: "Identyczna rezerwacja została już wcześniej zarejestrowana.",
        };
      }
      return {
        success: false,
        statusCode: 500,
        error: `Błąd zapisu rezerwacji w bazie danych: ${dbSave.error}`,
      };
    }
  }

  // 3. Write event to verified Google Calendar of the salon
  const googleResult = await insertBookingIntoSalonCalendar({
    treatmentName,
    durationMinutes: duration,
    price: input.price || "Cena do potwierdzenia",
    clientName,
    clientPhone,
    clientEmail,
    dateStr,
    timeStr,
    notes,
    isOnlineConsultation,
  });

  if (!googleResult.success) {
    // Partial failure handling: update DB status so clinic staff is aware of sync error
    if (isSupabaseAvailable()) {
      await updateBookingGoogleSyncStatus({
        bookingId,
        status: "google_sync_failed",
        syncError: googleResult.error,
      });
    }

    return {
      success: false,
      statusCode: 502,
      bookingId,
      error: `Nie udało się zapisać rezerwacji w Kalendarzu Google gabinetu: ${googleResult.error}`,
    };
  }

  // 4. On successful Google write, mark status as google_synced
  if (isSupabaseAvailable()) {
    await updateBookingGoogleSyncStatus({
      bookingId,
      status: "google_synced",
      googleEventId: googleResult.eventId,
    });
  }

  return {
    success: true,
    statusCode: 201,
    bookingId,
    eventId: googleResult.eventId,
    calendarId: googleResult.calendarId,
    htmlLink: googleResult.htmlLink,
    googleAccount: SALON_ACCOUNT_EMAIL,
  };
}
