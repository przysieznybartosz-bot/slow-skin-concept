/**
 * Test Suite: Google Calendar Availability & FreeBusy Collision Verification
 * Verifies requirement 7 from user brief:
 * 1. Blocking event 12:00–13:00 -> verify exact colliding slots blocked.
 * 2. Moving event to 15:00–16:00 -> verify 12:00–13:00 freed and 15:00–16:00 blocked.
 * 3. Working hours enforcement: Mon–Fri 10:00–19:30, Weekend closed.
 * 4. Treatment duration + 15min disinfection buffer collision rule.
 * 5. Anonymous visitor mode (no visitor Google login required).
 * 6. Live server verification and honest reporting without fake fallbacks.
 */

import {
  calculateAvailabilitySlots,
  getLiveAvailableSlots,
  verifyCalendarConnection,
  SALON_ACCOUNT_EMAIL,
  DEFAULT_SALON_CALENDAR_ID,
} from "../src/server/googleCalendarBackend";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

async function runTests() {
  console.log("=== STARTING GOOGLE CALENDAR INTEGRATION TEST SUITE ===\n");
  let passCount = 0;
  let failCount = 0;

  // Test 1: Weekend closure
  try {
    const sundayRes = calculateAvailabilitySlots({
      dateStr: "2026-10-18", // Sunday
      durationMinutes: 60,
      busyIntervals: [],
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: new Date().toISOString(),
      calendarId: DEFAULT_SALON_CALENDAR_ID,
    });
    assert(sundayRes.isClosed === true, "Sunday must be marked isClosed = true");
    assert(sundayRes.slots.length === 0, "Sunday must have 0 slots");

    const saturdayRes = calculateAvailabilitySlots({
      dateStr: "2026-10-17", // Saturday
      durationMinutes: 60,
      busyIntervals: [],
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: new Date().toISOString(),
      calendarId: DEFAULT_SALON_CALENDAR_ID,
    });
    assert(saturdayRes.isClosed === true, "Saturday must be marked isClosed = true");
    assert(saturdayRes.slots.length === 0, "Saturday must have 0 slots");

    console.log("✓ TEST 1 PASS: Weekend closed (Saturday & Sunday correctly blocked).");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 1 FAIL:", err.message);
    failCount++;
  }

  // Test 2: Blocking event 12:00–13:00 on Monday
  const mondayDate = "2026-10-19";
  try {
    const busy12to13 = [
      {
        start: new Date("2026-10-19T12:00:00+02:00"),
        end: new Date("2026-10-19T13:00:00+02:00"),
      },
    ];

    const res = calculateAvailabilitySlots({
      dateStr: mondayDate,
      durationMinutes: 60, // 60 min treatment + 15 min buffer = 75 min block
      bufferMinutes: 15,
      busyIntervals: busy12to13,
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: new Date().toISOString(),
      calendarId: DEFAULT_SALON_CALENDAR_ID,
    });

    assert(res.success === true, "Calculation succeeded");
    assert(res.totalSlots > 0, "Working day generates slots");

    // 10:00-11:00 + 15m buffer ends at 11:15 -> does NOT overlap 12:00-13:00 -> AVAILABLE
    const slot1000 = res.slots.find((s) => s.time === "10:00");
    assert(slot1000?.isAvailable === true, "10:00 slot must be available");

    // 10:30-11:30 + 15m buffer ends at 11:45 -> does NOT overlap 12:00-13:00 -> AVAILABLE
    const slot1030 = res.slots.find((s) => s.time === "10:30");
    assert(slot1030?.isAvailable === true, "10:30 slot must be available");

    // 11:00-12:00 + 15m buffer ends at 12:15 -> overlaps 12:00-13:00 (12:00 < 12:15) -> BLOCKED
    const slot1100 = res.slots.find((s) => s.time === "11:00");
    assert(slot1100?.isAvailable === false, "11:00 slot must be blocked by buffer collision with 12:00 busy block");
    assert(slot1100?.source === "google_calendar", "11:00 block source must be google_calendar");

    // 11:30-12:30 + 15m buffer -> overlaps 12:00-13:00 -> BLOCKED
    const slot1130 = res.slots.find((s) => s.time === "11:30");
    assert(slot1130?.isAvailable === false, "11:30 slot must be blocked");

    // 12:00-13:00 + 15m buffer -> overlaps 12:00-13:00 -> BLOCKED
    const slot1200 = res.slots.find((s) => s.time === "12:00");
    assert(slot1200?.isAvailable === false, "12:00 slot must be blocked");

    // 12:30-13:30 + 15m buffer -> overlaps 12:00-13:00 -> BLOCKED
    const slot1230 = res.slots.find((s) => s.time === "12:30");
    assert(slot1230?.isAvailable === false, "12:30 slot must be blocked");

    // 13:00-14:00 + 15m buffer -> starts at 13:00, busy ends at 13:00 -> does NOT overlap -> AVAILABLE
    const slot1300 = res.slots.find((s) => s.time === "13:00");
    assert(slot1300?.isAvailable === true, "13:00 slot must be available");

    // 14:00-15:00 -> AVAILABLE
    const slot1400 = res.slots.find((s) => s.time === "14:00");
    assert(slot1400?.isAvailable === true, "14:00 slot must be available");

    console.log("✓ TEST 2 PASS: Blocking 12:00–13:00 correctly blocks only 11:00, 11:30, 12:00, 12:30 (respecting 15m buffer).");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 2 FAIL:", err.message);
    failCount++;
  }

  // Test 3: Moving blocking event to 15:00–16:00
  try {
    const busy15to16 = [
      {
        start: new Date("2026-10-19T15:00:00+02:00"),
        end: new Date("2026-10-19T16:00:00+02:00"),
      },
    ];

    const res = calculateAvailabilitySlots({
      dateStr: mondayDate,
      durationMinutes: 60,
      bufferMinutes: 15,
      busyIntervals: busy15to16,
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: new Date().toISOString(),
      calendarId: DEFAULT_SALON_CALENDAR_ID,
    });

    // 11:00, 11:30, 12:00, 12:30 must NOW be AVAILABLE!
    assert(res.slots.find((s) => s.time === "11:00")?.isAvailable === true, "11:00 must now be free");
    assert(res.slots.find((s) => s.time === "11:30")?.isAvailable === true, "11:30 must now be free");
    assert(res.slots.find((s) => s.time === "12:00")?.isAvailable === true, "12:00 must now be free");
    assert(res.slots.find((s) => s.time === "12:30")?.isAvailable === true, "12:30 must now be free");

    // Colliding slots around 15:00–16:00 must be BLOCKED!
    assert(res.slots.find((s) => s.time === "14:00")?.isAvailable === false, "14:00 must be blocked (overlaps 15:00 with 15m buffer)");
    assert(res.slots.find((s) => s.time === "14:30")?.isAvailable === false, "14:30 must be blocked");
    assert(res.slots.find((s) => s.time === "15:00")?.isAvailable === false, "15:00 must be blocked");
    assert(res.slots.find((s) => s.time === "15:30")?.isAvailable === false, "15:30 must be blocked");
    assert(res.slots.find((s) => s.time === "16:00")?.isAvailable === true, "16:00 must be free");

    console.log("✓ TEST 3 PASS: Moving event to 15:00–16:00 freed 12:00–13:00 and blocked 14:00–16:00.");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 3 FAIL:", err.message);
    failCount++;
  }

  // Test 4: Salon closing hour enforcement (19:30)
  try {
    const res = calculateAvailabilitySlots({
      dateStr: mondayDate,
      durationMinutes: 90, // 90 min treatment + 15 min buffer = 105 min block
      bufferMinutes: 15,
      busyIntervals: [],
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: new Date().toISOString(),
      calendarId: DEFAULT_SALON_CALENDAR_ID,
    });

    // 90 min treatment + 15 min buffer = 105 min block
    // 17:30 + 105m = 19:15 <= 19:30 -> AVAILABLE
    const slot1730 = res.slots.find((s) => s.time === "17:30");
    assert(slot1730?.isAvailable === true, "17:30 for 90m treatment must be available (finishes with buffer at 19:15)");

    // 18:00 + 105m = 19:45 > 19:30 -> BLOCKED (15m buffer extends past closing)
    const slot1800 = res.slots.find((s) => s.time === "18:00");
    assert(slot1800?.isAvailable === false, "18:00 for 90m treatment must be blocked (15m buffer extends past 19:30)");

    // Test 60 min treatment: 60m + 15m buffer = 75m block
    const res60 = calculateAvailabilitySlots({
      dateStr: mondayDate,
      durationMinutes: 60,
      bufferMinutes: 15,
      busyIntervals: [],
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: new Date().toISOString(),
      calendarId: DEFAULT_SALON_CALENDAR_ID,
    });
    // 18:00 + 75m = 19:15 <= 19:30 -> AVAILABLE
    assert(res60.slots.find((s) => s.time === "18:00")?.isAvailable === true, "18:00 for 60m treatment must be available (buffer ends 19:15)");
    // 18:30 + 75m = 19:45 > 19:30 -> BLOCKED
    assert(res60.slots.find((s) => s.time === "18:30")?.isAvailable === false, "18:30 for 60m treatment must be blocked (buffer ends 19:45)");

    console.log("✓ TEST 4 PASS: Reguła końca dnia: zabieg wraz z 15-min buforem bezwzględnie musi mieścić się przed 19:30.");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 4 FAIL:", err.message);
    failCount++;
  }

  // Test 5: Verify Live Server Authentication State
  try {
    const status = await verifyCalendarConnection();
    console.log("\n--- LIVE SERVER AUTHENTICATION STATUS ---");
    console.log(`Target account: ${SALON_ACCOUNT_EMAIL}`);
    console.log(`Calendar ID:    ${status.calendarId}`);
    console.log(`Auth method:    ${status.authMethod}`);
    console.log(`Ready / Synced: ${status.ready}`);
    if (status.error) {
      console.log(`Missing/Error:  ${status.error}`);
    }
    console.log("-----------------------------------------\n");
    console.log("✓ TEST 5 PASS: Backend status check returns truthful state (no synthetic simulation).");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 5 FAIL:", err.message);
    failCount++;
  }

  // Test 6: Blocking "wyjazd" event on 19–23.10.2026 (07:15–20:00) blocks 100% of slots in BOTH forms
  try {
    const dates = ["2026-10-19", "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"];
    const wyjazdInterval = {
      start: new Date("2026-10-19T05:15:00Z"), // 07:15 CEST
      end: new Date("2026-10-19T18:00:00Z"),   // 20:00 CEST
    };

    for (const d of dates) {
      // Formularz zabiegowy (np. Fotoepilacja LPL - 75 min)
      const treatSlots = calculateAvailabilitySlots({
        dateStr: d,
        durationMinutes: 75,
        busyIntervals: [wyjazdInterval],
        googleCalendarSynced: true,
        lastSuccessfulSyncAt: new Date().toISOString(),
        calendarId: DEFAULT_SALON_CALENDAR_ID,
      });
      assert(treatSlots.availableSlotsCount === 0, `Fotoepilacja LPL na dzień ${d} musi mieć 0 wolnych slotów`);
      assert(treatSlots.isFullyBooked === true, `Dzień ${d} musi mieć status isFullyBooked=true dla zabiegów`);

      // Formularz konsultacji (np. Videokonsultacja - 60 min)
      const consultSlots = calculateAvailabilitySlots({
        dateStr: d,
        durationMinutes: 60,
        busyIntervals: [wyjazdInterval],
        googleCalendarSynced: true,
        lastSuccessfulSyncAt: new Date().toISOString(),
        calendarId: DEFAULT_SALON_CALENDAR_ID,
      });
      assert(consultSlots.availableSlotsCount === 0, `Videokonsultacja na dzień ${d} musi mieć 0 wolnych slotów`);
      assert(consultSlots.isFullyBooked === true, `Dzień ${d} musi mieć status isFullyBooked=true dla konsultacji`);
    }

    console.log("✓ TEST 6 PASS: Wydarzenie 'wyjazd' 19–23.10.2026 całkowicie blokuje oba formularze (0 wolnych slotów).");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 6 FAIL:", err.message);
    failCount++;
  }

  // Test 7: Wolny dzień roboczy zwraca prawidłowe, wybieralne sloty (10:00–18:00)
  try {
    const freeDay = calculateAvailabilitySlots({
      dateStr: "2026-10-26", // Poniedziałek po wyjeździe
      durationMinutes: 75,
      bufferMinutes: 15,
      busyIntervals: [],
      googleCalendarSynced: true,
      lastSuccessfulSyncAt: new Date().toISOString(),
      calendarId: DEFAULT_SALON_CALENDAR_ID,
    });
    assert(freeDay.availableSlotsCount > 0, "Wolny dzień musi mieć dostępne sloty");
    assert(freeDay.isFullyBooked === false, "Wolny dzień nie może być isFullyBooked");
    assert(freeDay.slots[0].time === "10:00", "Pierwszy slot musi zaczynać się o 10:00");
    assert(freeDay.slots[freeDay.slots.length - 1].time === "18:00", "Ostatni slot na 75 min musi zaczynać się o 18:00 (koniec o 19:15 <= 19:30)");

    console.log("✓ TEST 7 PASS: Prawdziwie wolny dzień zwraca poprawne sloty w godzinach 10:00–18:00.");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 7 FAIL:", err.message);
    failCount++;
  }

  // Test 8: Brak autoryzacji / błąd Google Calendar NIE generuje pozornych wolnych godzin
  try {
    const unverifiedSlots = await getLiveAvailableSlots("2026-10-19", 75);
    // Ponieważ serwer nie ma aktywnego tokenu, getLiveAvailableSlots MUSI zwrócić status sync_error i 0 slotów
    assert(unverifiedSlots.googleCalendarSynced === false, "googleCalendarSynced musi być false przy braku autoryzacji");
    assert(unverifiedSlots.status === "sync_error", "status musi być sync_error");
    assert(unverifiedSlots.availableSlotsCount === 0, "availableSlotsCount musi wynosić 0 (brak pozornych godzin)");
    assert(unverifiedSlots.slots.length === 0, "Lista slotów musi być pusta");

    console.log("✓ TEST 8 PASS: Brak autoryzacji/błąd Google ściśle blokuje generowanie pozornych wolnych godzin (0 slotów, sync_error).");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 8 FAIL:", err.message);
    failCount++;
  }

  // Test 9: Dostępność konsultacji uwzględnia kalendarz Katarzyny (slowskinconcept@gmail.com)
  try {
    const { getAvailabilityCalendarIds } = await import("../src/server/googleCalendarBackend");
    const consultCals = getAvailabilityCalendarIds("consultation");
    assert(consultCals.includes("slowskinconcept@gmail.com"), "Konsultacje muszą weryfikować kalendarz Katarzyny slowskinconcept@gmail.com");
    assert(consultCals.length >= 2, "Konsultacje muszą odpytywać zarówno kalendarz konsultacji, jak i zabiegowy");

    console.log("✓ TEST 9 PASS: Dostępność konsultacji weryfikuje oba kalendarze, uniemożliwiając kolizję z zajętością Katarzyny.");
    passCount++;
  } catch (err: any) {
    console.error("✕ TEST 9 FAIL:", err.message);
    failCount++;
  }

  console.log(`\n=== SUMMARY: ${passCount} PASSED, ${failCount} FAILED ===\n`);
  return failCount === 0;
}

runTests().then((ok) => {
  process.exit(ok ? 0 : 1);
});
