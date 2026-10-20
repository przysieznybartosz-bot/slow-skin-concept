import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Check, 
  Video, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  RefreshCw,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  Lock,
  CalendarCheck2
} from "lucide-react";
import { Treatment } from "../types";
import { safeStorage } from "../utils/storage";
import { 
  requestGoogleCalendarAccess, 
  fetchGoogleUserProfile, 
  insertEventIntoGoogleCalendar, 
  generateGoogleCalendarDeepLink, 
  downloadIcsCalendarFile, 
  getCachedGoogleToken,
  clearGoogleToken,
  parseTreatmentDuration,
  fetchCalendarSlots,
  syncGoogleCalendarWithBackend,
  getSyncedGoogleEvents,
  getLocalGoogleEvents,
  getEventsForDate,
  SLOW_SKIN_GOOGLE_ACCOUNT,
  SLOW_SKIN_CALENDAR_ID,
  BookingEventData,
  GoogleUserProfile,
  CalendarSlotsResponse,
  CalendarSlot
} from "../services/googleCalendar";

interface BookingModalProps {
  treatment: Treatment | null;
  onClose: () => void;
}

// Exact date formatting without UTC midnight shift
export const formatDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateStr: string): { year: number; month: number; day: number; date: Date } => {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Noon (12:00) ensures no DST midnight rollover across timezones
  const date = new Date(year, month - 1, day, 12, 0, 0);
  return { year, month, day, date };
};

export const BookingModal: React.FC<BookingModalProps> = ({ treatment, onClose }) => {
  const isVideoService = treatment ? (treatment.id === "videokonsultacja" || treatment.id.includes("video") || treatment.title.toLowerCase().includes("video") || treatment.title.toLowerCase().includes("online")) : false;
  
  // Treatment realistic duration calculation
  const durationMin = treatment ? parseTreatmentDuration(treatment.duration) : 75;

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  
  // Default date: next available working day (skipping Saturday & Sunday)
  const getInitialDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1); // Jump to Monday
    }
    return formatDateKey(d);
  };

  const todayStr = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState("");
  const [isOnline, setIsOnline] = useState(isVideoService);
  const [notes, setNotes] = useState("");

  const [availabilityState, setAvailabilityState] = useState<"loading" | "ready" | "error">("loading");
  const [slotsData, setSlotsData] = useState<CalendarSlotsResponse | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const reqIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [googleEventLink, setGoogleEventLink] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Quick Days Generation (next 7 days, aligned local date with matching label)
  const quickDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i + 1));
    const iso = formatDateKey(d);
    const dayNames = ["Ndz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];
    const monthNames = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const dayEvts = getEventsForDate(iso);
    const isFullGoogle = !isWeekend && dayEvts.some(e => e.isAllDay || (e.startTimeStr && e.endTimeStr && e.startTimeStr <= "10:00" && e.endTimeStr >= "19:00"));
    return {
      iso,
      dayNum: d.getDate(),
      dayName: dayNames[d.getDay()],
      monthName: monthNames[d.getMonth()],
      isWeekend,
      isFullGoogle,
    };
  });

  // Load dynamic slots with strict 3-state management & race-condition prevention
  const loadSlots = async (dateStr: string, duration: number, isOnlineConsult: boolean = isOnline) => {
    // Abort previous in-flight request if user rapidly changed dates or formats
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentReqId = ++reqIdRef.current;
    setAvailabilityState("loading");
    setIsLoadingSlots(true);
    setSlotsError(null);
    setSelectedTime("");
    setSlotsData(null); // Clear previous results immediately to avoid stale state

    try {
      const data = await fetchCalendarSlots(dateStr, duration, isOnlineConsult, controller.signal);
      if (reqIdRef.current !== currentReqId) return;

      if (!data || !data.googleCalendarSynced || data.status === "sync_error") {
        setAvailabilityState("error");
        setSlotsError(data?.reason || data?.error || "Nie udało się zweryfikować dostępności w Kalendarzu Google gabinetu. Kliknij, aby ponowić próbę.");
        setSlotsData(null);
        setSelectedTime("");
        return;
      }

      setAvailabilityState("ready");
      setSlotsData(data);
      setSlotsError(null);

      // Auto-select first available slot if present and not fully booked
      if (data && !data.isClosed && !data.isFullyBooked && data.availableSlotsCount > 0 && data.slots.length > 0) {
        const firstAvailable = data.slots.find(s => s.isAvailable);
        if (firstAvailable) {
          setSelectedTime(firstAvailable.time);
        }
      }
    } catch (e: any) {
      if (reqIdRef.current !== currentReqId) return;
      if (e?.name === "AbortError") return; // Suppress cancelled requests
      setAvailabilityState("error");
      setSlotsError(e?.message || "Nie udało się zweryfikować dostępności w Kalendarzu Google. Kliknij ponów.");
      setSlotsData(null);
      setSelectedTime("");
    } finally {
      if (reqIdRef.current === currentReqId) {
        setIsLoadingSlots(false);
      }
    }
  };

  const handleGoToNextWorkingDay = () => {
    const { date: target } = parseDateKey(selectedDate);
    do {
      target.setDate(target.getDate() + 1);
    } while (target.getDay() === 0 || target.getDay() === 6);
    setSelectedDate(formatDateKey(target));
  };

  const handleManualSyncGoogle = async () => {
    setIsSyncingGoogle(true);
    setSyncError(null);
    setSyncSuccessMessage(null);
    try {
      await loadSlots(selectedDate, durationMin, isOnline);
      setSyncSuccessMessage(`Dostępność dla ${selectedDate} została odświeżona z Kalendarza Google.`);
    } catch (e: any) {
      setSyncError(e?.message || "Nie udało się zweryfikować Kalendarza Google.");
    } finally {
      setIsSyncingGoogle(false);
    }
  };

  useEffect(() => {
    if (isVideoService) {
      setIsOnline(true);
    }
    
    // Check for cached Google token & user profile
    const token = getCachedGoogleToken();
    if (token) {
      setGoogleToken(token);
      fetchGoogleUserProfile(token).then((profile) => {
        if (profile) {
          setGoogleUser(profile);
          if (profile.name && !clientName) setClientName(profile.name);
          if (profile.email && !clientEmail) setClientEmail(profile.email);
        }
      });
    }
  }, [treatment]);

  useEffect(() => {
    if (selectedDate && durationMin) {
      loadSlots(selectedDate, durationMin, isOnline);
    }
  }, [selectedDate, durationMin, isOnline]);

  if (!treatment) return null;

  const currentSelectedSlot = slotsData?.slots.find(s => s.time === selectedTime);
  const slotEndTime = currentSelectedSlot?.endTime || (() => {
    const [h, m] = selectedTime.split(":").map(Number);
    const endMinutes = h * 60 + m + durationMin;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    return `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
  })();

  const getEventData = (): BookingEventData => ({
    title: treatment.title,
    treatmentName: treatment.title,
    durationMinutes: durationMin,
    price: treatment.price,
    clientName: clientName || "Gość Slow Skin",
    clientPhone: clientPhone || "+48",
    clientEmail: clientEmail || "kontakt@slowskinconcept.pl",
    dateStr: selectedDate,
    timeStr: selectedTime,
    notes: notes,
    isOnlineConsultation: isOnline,
  });

  const recordBookingOnServer = async (data: BookingEventData): Promise<{
    success: boolean;
    eventId?: string;
    calendarId?: string;
    htmlLink?: string;
    error?: string;
  }> => {
    try {
      const res = await fetch("/api/calendar/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        return {
          success: false,
          error: json.error || `Błąd serwera (${res.status}): Nie udało się zapisać wizyty w kalendarzu gabinetu.`,
        };
      }
      return {
        success: true,
        eventId: json.eventId || json.booking?.eventId,
        calendarId: json.calendarId || json.booking?.calendarId,
        htmlLink: json.htmlLink || json.booking?.htmlLink,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Błąd sieci: Nie udało się połączyć z serwerem kalendarza gabinetu.",
      };
    }
  };

  const handleBookAppointment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clientName || !clientPhone) {
      setSyncError("Prosimy o podanie imienia, nazwiska oraz numeru telefonu.");
      return;
    }
    if (!selectedTime) {
      setSyncError("Prosimy o wybranie dogodnej godziny z listy dostępnych slotów.");
      return;
    }

    setIsSubmittingBooking(true);
    setSyncError(null);

    const eventData = getEventData();

    // Verify and record directly on server into verified salon Google Calendar
    const serverResult = await recordBookingOnServer(eventData);
    if (!serverResult.success) {
      setSyncError(serverResult.error || "Nie udało się zapisać rezerwacji w Kalendarzu Google gabinetu. Termin nie został zarezerwowany.");
      setIsSubmittingBooking(false);
      loadSlots(selectedDate, durationMin);
      return;
    }

    if (serverResult.htmlLink) {
      setGoogleEventLink(serverResult.htmlLink);
    } else if (serverResult.eventId) {
      setGoogleEventLink(`https://calendar.google.com/calendar/u/0/r/eventedit/${serverResult.eventId}`);
    }

    saveToLocalHistory(eventData);
    setIsConfirmed(true);
    setIsSubmittingBooking(false);
  };

  const handleGoogleSignInAndSync = async () => {
    setIsSyncingGoogle(true);
    setSyncError(null);
    try {
      const token = await requestGoogleCalendarAccess();
      setGoogleToken(token);
      const profile = await fetchGoogleUserProfile(token);
      if (profile) {
        setGoogleUser(profile);
        if (!clientName && profile.name) setClientName(profile.name);
        if (!clientEmail && profile.email) setClientEmail(profile.email);
      }
      const syncRes = await syncGoogleCalendarWithBackend(token);
      if (syncRes.success) {
        setSyncSuccessMessage(`✓ Zsynchronizowano ${syncRes.count} terminów z Kalendarzem Google (${SLOW_SKIN_GOOGLE_ACCOUNT}).`);
      }
      await loadSlots(selectedDate, durationMin);
    } catch (err: any) {
      setSyncError(err.message || "Logowanie Google anulowane.");
    } finally {
      setIsSyncingGoogle(false);
    }
  };

  const triggerMailtoNotification = () => {
    const subject = encodeURIComponent(`[Rezerwacja Wizyty] ${treatment?.title || "Zabieg"} — ${selectedDate} ${selectedTime} — ${clientName}`);
    const body = encodeURIComponent(
      `Dzień dobry!\n\n` +
      `Przesyłam potwierdzenie rezerwacji wizyty w Instytucie Zdrowej Skóry Slow Skin Concept:\n\n` +
      `• Zabieg: ${treatment?.title || "Zabieg autorski"}\n` +
      `• Termin: ${selectedDate} w godz. ${selectedTime} — ${slotEndTime} (${durationMin} min)\n` +
      `• Imię i Nazwisko: ${clientName}\n` +
      `• Numer telefonu: ${clientPhone}\n` +
      `• Adres e-mail: ${clientEmail}\n` +
      `• Rodzaj wizyty: ${isOnline ? "Konsultacja Online (Google Meet)" : "Wizyta w Gabinecie (Szkolna 5, Jelcz-Laskowice)"}\n` +
      `• Notatki / Stan skóry: ${notes || "Brak uwag"}\n\n` +
      `Wpis został zsynchronizowany z oficjalnym kalendarzem: ${SLOW_SKIN_GOOGLE_ACCOUNT}`
    );

    const mailtoLink = `mailto:${SLOW_SKIN_GOOGLE_ACCOUNT}?subject=${subject}&body=${body}`;
    try {
      window.location.href = mailtoLink;
    } catch (err) {
      console.warn("Mailto triggered", err);
    }
  };

  const saveToLocalHistory = (data: BookingEventData) => {
    try {
      const history = JSON.parse(safeStorage.getItem("slow_skin_bookings") || "[]");
      history.unshift({
        id: `book-${Date.now()}`,
        ...data,
        endTime: slotEndTime,
        createdAt: new Date().toISOString(),
      });
      safeStorage.setItem("slow_skin_bookings", JSON.stringify(history.slice(0, 10)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-luxury-dark/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-luxury-cream border border-luxury-sand/80 max-w-2xl w-full relative my-6 shadow-2xl overflow-hidden"
        id="slow-skin-booking-modal"
      >
        {/* Header Ribbon */}
        <div className="bg-luxury-dark text-white px-6 py-4 flex items-center justify-between border-b border-luxury-gold/30">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                slotsData?.googleCalendarSynced
                  ? "bg-emerald-500 animate-pulse"
                  : slotsError
                  ? "bg-red-500"
                  : isLoadingSlots
                  ? "bg-amber-400 animate-pulse"
                  : "bg-amber-500"
              }`}
            />
            <div>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-luxury-gold font-bold block">
                Kalendarz Rezerwacji Wizyt
              </span>
              <span className="font-mono text-[8.5px] text-luxury-sand/70 block">
                {slotsData?.googleCalendarSynced
                  ? `Zsynchronizowany z ${SLOW_SKIN_GOOGLE_ACCOUNT}`
                  : slotsError
                  ? "Błąd połączenia z Kalendarzem Google"
                  : isLoadingSlots
                  ? "Weryfikacja dostępności w toku..."
                  : "Kalendarz gabinetu"}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-luxury-sand hover:text-white transition-colors text-base font-mono cursor-pointer px-2 py-1"
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        <div className="p-5 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          {!isConfirmed ? (
            <div className="space-y-6">
              {/* Treatment Overview Card */}
              <div className="border border-luxury-sand/70 bg-white/80 p-4 space-y-2 relative shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[8.5px] text-luxury-gold uppercase tracking-widest block font-bold">
                      Wybrana Terapia Biologiczna
                    </span>
                    <h3 className="font-serif text-lg md:text-xl text-luxury-dark font-medium leading-snug">
                      {treatment.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-serif text-base text-luxury-dark font-semibold block text-luxury-gold">
                      {treatment.price}
                    </span>
                    <span className="font-mono text-[9px] text-luxury-dark/90 flex items-center gap-1 justify-end font-medium">
                      <Clock className="w-3.5 h-3.5 text-luxury-gold" /> {treatment.duration}
                    </span>
                  </div>
                </div>

                {/* Duration & Clean Room Buffer Indicator */}
                <div className="pt-2 border-t border-luxury-sand/30 flex items-center justify-between text-[9px] font-mono text-luxury-dark/80">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-luxury-gold" />
                    Czas zabiegu: <strong>{durationMin} min</strong> + 15 min sanityzacji stanowiska
                  </span>
                  {availabilityState === "ready" && slotsData?.googleCalendarSynced && (
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200/60 rounded-xs">
                      Rezerwacja bez kolizji
                    </span>
                  )}
                </div>
              </div>

              {/* Format Selection: In-person vs Online */}
              <div className="space-y-2">
                <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block font-semibold">
                  Format Spotkania
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOnline(false)}
                    className={`p-3 border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      !isOnline 
                        ? "border-luxury-gold bg-luxury-sand/25 shadow-xs ring-1 ring-luxury-gold/30" 
                        : "border-luxury-sand/40 bg-white/40 hover:border-luxury-sand"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide font-medium text-luxury-dark">
                      <MapPin className="w-3.5 h-3.5 text-luxury-gold" /> Gabinet Stacjonarny
                    </div>
                    <span className="text-[9px] text-luxury-dark/90 font-sans">
                      Jelcz-Laskowice, ul. Szkolna 5
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOnline(true)}
                    className={`p-3 border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isOnline 
                        ? "border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600/30" 
                        : "border-luxury-sand/40 bg-white/40 hover:border-luxury-sand"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide font-medium text-luxury-dark">
                      <Video className="w-3.5 h-3.5 text-emerald-700" /> Konsultacja Online
                    </div>
                    <span className="text-[9px] text-emerald-800 font-sans font-medium">
                      Google Meet (Wideorozmowa 1:1)
                    </span>
                  </button>
                </div>
              </div>

              {/* Online Consultation details if selected */}
              {isOnline && (
                <div className="border border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-4 space-y-2 rounded-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-900 font-bold">
                        Bramka Videokonsultacji Google Meet
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-xs">
                      Pokój Wideo 1:1
                    </span>
                  </div>
                  <p className="text-[11px] text-luxury-dark font-sans leading-relaxed">
                    Spotkanie wideo 1:1 z <strong>mgr Katarzyną Brzezińską</strong>. W dniu spotkania dołączysz jednym kliknięciem z kalendarza lub e-maila.
                  </p>
                </div>
              )}

              {/* ========================================================= */}
              {/* INTERACTIVE DATE & TIME SELECTION (BEFORE LOGGING IN)      */}
              {/* ========================================================= */}
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-mono text-[9.5px] text-luxury-dark uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                      1. Wybierz Dzień Wizyty
                    </label>
                    <span className="text-[8.5px] font-mono text-luxury-dark/70">
                      Godziny pracy: Pon–Pt 10:00–19:30 (Sobota i Niedziela nieczynne)
                    </span>
                  </div>

                  {/* Quick Day Chips */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-2.5">
                    {quickDays.map((qd) => {
                      const isSelected = selectedDate === qd.iso;
                      return (
                        <button
                          key={qd.iso}
                          type="button"
                          onClick={() => setSelectedDate(qd.iso)}
                          className={`p-2 border rounded-xs text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-luxury-gold bg-luxury-gold text-white shadow-sm ring-1 ring-luxury-gold"
                              : qd.isWeekend
                              ? "border-luxury-sand/30 bg-luxury-sand/15 text-luxury-dark/40 hover:border-luxury-sand"
                              : qd.isFullGoogle
                              ? "border-amber-200 bg-amber-50/70 text-amber-900 hover:border-amber-400"
                              : "border-luxury-sand/60 bg-white hover:border-luxury-gold/70 text-luxury-dark"
                          }`}
                        >
                          <div className="text-[8.5px] font-mono uppercase tracking-wider font-semibold opacity-90">
                            {qd.dayName}
                          </div>
                          <div className="text-xs font-serif font-bold my-0.5">
                            {qd.dayNum}
                          </div>
                          <div className="text-[7.5px] font-mono opacity-80">
                            {qd.isWeekend ? "Nieczynne" : qd.isFullGoogle ? "Zajęte w Google" : qd.monthName}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Date Input Picker */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[9px] font-mono text-luxury-dark/70 shrink-0">Inna data:</span>
                    <input 
                      type="date"
                      required
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white border border-luxury-sand/80 px-3 py-1.5 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-mono shadow-2xs"
                    />
                  </div>
                </div>

                {/* DYNAMIC TIME SLOTS SECTION */}
                <div className="space-y-2.5 pt-2 border-t border-luxury-sand/40">
                  {/* Google Calendar live correlation indicator */}
                  <div className="p-2.5 bg-luxury-sand/15 border border-luxury-gold/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${slotsData?.googleCalendarSynced ? "bg-emerald-600 animate-pulse" : "bg-amber-500"}`} />
                      <div className="text-[9px] font-mono leading-tight">
                        <span className="text-luxury-dark font-semibold">
                          {slotsData?.googleCalendarSynced ? "Kalendarz Google zsynchronizowany:" : "Kalendarz gabinetu:"}
                        </span>{" "}
                        <span className="text-luxury-gold font-bold">{SLOW_SKIN_GOOGLE_ACCOUNT}</span>
                        <span className="block text-luxury-dark/70 text-[8px]">
                          {slotsData?.googleCalendarSynced
                            ? "Zajęte godziny są zablokowane na podstawie bieżącego odczytu Google freebusy."
                            : "Weryfikacja dostępności w toku. Kliknij odśwież w razie potrzeby."}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleManualSyncGoogle}
                      disabled={isSyncingGoogle}
                      className="px-2.5 py-1 text-[8.5px] font-mono uppercase tracking-wider bg-white hover:bg-luxury-gold hover:text-white border border-luxury-gold/50 text-luxury-dark rounded-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isSyncingGoogle ? "animate-spin text-luxury-gold" : ""}`} />
                      {isSyncingGoogle ? "Sprawdzam..." : "Odśwież z Google"}
                    </button>
                  </div>

                  {syncSuccessMessage && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 text-[9px] font-mono flex items-center gap-1.5 rounded-xs">
                      <Check className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>{syncSuccessMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[9.5px] text-luxury-dark uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                      2. Wybierz Wolną Godzinę (Dopasowaną do {durationMin} min zabiegu)
                    </label>
                    <div className="flex items-center gap-2">
                      {slotsData?.occupiedGoogleSlotsCount ? (
                        <span className="text-[8.5px] font-mono text-amber-800 bg-amber-100/70 border border-amber-200 px-1.5 py-0.5 rounded-xs flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-700" />
                          {slotsData.occupiedGoogleSlotsCount} zajęte w Google
                        </span>
                      ) : null}
                      {isLoadingSlots && (
                        <span className="text-[9px] font-mono text-luxury-gold flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Sprawdzam kalendarz...
                        </span>
                      )}
                    </div>
                  </div>

                  {availabilityState === "loading" || isLoadingSlots ? (
                    <div className="p-6 bg-luxury-sand/10 border border-luxury-sand/40 text-luxury-dark rounded-xs text-xs font-sans space-y-2 text-center">
                      <RefreshCw className="w-5 h-5 text-luxury-gold animate-spin mx-auto" />
                      <div className="font-mono text-xs uppercase tracking-wider font-semibold text-luxury-dark">
                        Weryfikacja dostępności w Kalendarzu Google...
                      </div>
                      <p className="text-[11px] text-luxury-dark/70 font-light">
                        Pobieram potwierdzony grafik gabinetu dla {selectedDate}. Godziny są weryfikowane pod kątem braku kolizji.
                      </p>
                    </div>
                  ) : availabilityState === "error" || slotsError ? (
                    <div className="p-4 bg-red-50/90 border border-red-200 text-red-950 rounded-xs text-xs font-sans space-y-2">
                      <div className="flex items-center gap-2 font-mono font-semibold text-[10px] uppercase text-red-800">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Błąd weryfikacji kalendarza</span>
                      </div>
                      <p className="text-[11px] text-red-800/80 leading-relaxed">
                        {slotsError}
                      </p>
                      <button
                        type="button"
                        onClick={() => loadSlots(selectedDate, durationMin, isOnline)}
                        className="py-1 px-3 bg-red-700 hover:bg-red-800 text-white font-mono text-[9px] uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Spróbuj ponownie
                      </button>
                    </div>
                  ) : slotsData?.isClosed ? (
                    <div className="p-4 bg-stone-100 border border-stone-300 text-stone-800 text-xs font-sans space-y-2 rounded-xs">
                      <div className="flex items-center gap-2 font-mono font-semibold text-[10px] uppercase text-stone-700">
                        <AlertCircle className="w-4 h-4 text-stone-600" />
                        <span>{slotsData.dayName}: Gabinet Nieczynny</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-600">
                        {slotsData.reason || "W weekendy (sobota i niedziela) gabinet jest nieczynny. Zapraszamy od poniedziałku do piątku w godzinach 10:00 — 19:30."}
                      </p>
                      <button
                        type="button"
                        onClick={handleGoToNextWorkingDay}
                        className="py-1.5 px-3 bg-stone-800 hover:bg-stone-900 text-white font-mono text-[9px] uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        Przejdź do najbliższego dnia roboczego (Poniedziałek) →
                      </button>
                    </div>
                  ) : (
                    <div>
                      {slotsData && (slotsData.isFullyBooked || slotsData.availableSlotsCount === 0) && (
                        <div className="p-3.5 bg-amber-50/95 border border-amber-300 text-amber-950 rounded-xs mb-3 text-xs font-sans space-y-2 shadow-2xs">
                          <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                            <Lock className="w-4 h-4 text-amber-800 shrink-0" />
                            <span>Dzień roboczy w pełni zajęty ({slotsData.dayName})</span>
                          </div>
                          <p className="text-[11px] text-amber-900/80 leading-relaxed font-light">
                            {slotsData.reason || `W dniu ${slotsData.date} (${slotsData.dayName}) gabinet ma już w pełni zarezerwowany grafik w Kalendarzu Google. Żadna godzina na zabieg (${durationMin} min) nie jest dostępna — prosimy o wybranie innego dnia z kalendarza.`}
                          </p>
                          <div className="pt-1 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleGoToNextWorkingDay}
                              className="py-1 px-3 bg-amber-800 hover:bg-amber-900 text-white font-mono text-[9px] uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              Sprawdź kolejny dzień roboczy →
                            </button>
                            <button
                              type="button"
                              onClick={() => loadSlots(selectedDate, durationMin, isOnline)}
                              className="py-1 px-3 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[9px] uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              <RefreshCw className="w-2.5 h-2.5" /> Odśwież dostępność
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Slots Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {slotsData?.slots.map((slot: CalendarSlot) => {
                          const isSelected = selectedTime === slot.time;
                          const isGoogleBlocked = !slot.isAvailable && slot.source === "google_calendar";
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={!slot.isAvailable}
                              onClick={() => {
                                setSelectedTime(slot.time);
                                setSyncError(null);
                              }}
                              title={slot.reason}
                              className={`p-2.5 border rounded-xs text-center transition-all relative ${
                                isSelected
                                  ? "border-luxury-gold bg-luxury-gold text-white shadow-md ring-2 ring-luxury-gold/30"
                                  : slot.isAvailable
                                  ? "border-luxury-sand/70 bg-white hover:border-luxury-gold text-luxury-dark cursor-pointer shadow-2xs hover:bg-luxury-gold/5"
                                  : isGoogleBlocked
                                  ? "border-amber-200 bg-amber-50/60 text-amber-900/60 cursor-not-allowed line-through"
                                  : "border-luxury-sand/30 bg-luxury-sand/15 text-luxury-dark/40 cursor-not-allowed line-through"
                              }`}
                            >
                              <div className="font-mono text-xs font-bold tracking-tight">
                                {slot.time}
                              </div>
                              <div className="text-[8.5px] font-sans opacity-85">
                                do {slot.endTime}
                              </div>
                              <div className="text-[7.5px] font-mono mt-0.5 uppercase tracking-wider flex items-center justify-center gap-1">
                                {slot.isAvailable ? (
                                  isSelected ? (
                                    <span className="font-bold flex items-center gap-0.5">
                                      <Check className="w-2.5 h-2.5" /> Wybrany
                                    </span>
                                  ) : (
                                    <span className="text-emerald-700 font-medium">Wolny</span>
                                  )
                                ) : isGoogleBlocked ? (
                                  <span className="text-amber-800 font-medium flex items-center gap-0.5">
                                    <Lock className="w-2 h-2 text-amber-700" /> Zajęty w Google
                                  </span>
                                ) : (
                                  <span className="text-luxury-dark/40 flex items-center gap-0.5">
                                    <Lock className="w-2 h-2" /> Zajęty
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Slot Confirmation Summary: ONLY in ready state with confirmed sync */}
                      {selectedTime && availabilityState === "ready" && slotsData?.googleCalendarSynced && slotsData.availableSlotsCount > 0 && (
                        <div className="mt-3 p-3 bg-white border border-luxury-gold/40 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-bold block">
                              Zarezerwowany przedział czasowy:
                            </span>
                            <p className="font-serif text-sm font-medium text-luxury-dark">
                              {selectedDate} • godz. <strong className="text-luxury-gold">{selectedTime} — {slotEndTime}</strong>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xs font-semibold inline-flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Brak kolizji z innymi gośćmi
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================================= */}
              {/* GOOGLE ACCOUNT OPTIONAL SYNC (CAN BOOK BEFORE OR WITH GOOGLE) */}
              {/* ========================================================= */}
              <div className="space-y-3 pt-2 border-t border-luxury-sand/40">
                <label className="font-mono text-[9.5px] text-luxury-dark uppercase tracking-widest font-bold block">
                  3. Twoje Dane Kontaktowe
                </label>

                {/* Google Sign-In Status / Helper */}
                {googleUser ? (
                  <div className="flex items-center justify-between p-3 bg-white border border-emerald-200/80 rounded-xs">
                    <div className="flex items-center gap-2.5">
                      {googleUser.picture ? (
                        <img src={googleUser.picture} alt={googleUser.name} className="w-7 h-7 rounded-full border border-luxury-sand" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-luxury-dark text-luxury-gold flex items-center justify-center text-xs font-mono font-bold">
                          {googleUser.name?.charAt(0) || "G"}
                        </div>
                      )}
                      <div>
                        <p className="font-mono text-[10px] text-luxury-dark font-semibold">{googleUser.name || googleUser.email}</p>
                        <p className="text-[9px] text-emerald-700 font-mono">Zalogowano przez Google ✓</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { clearGoogleToken(); setGoogleUser(null); setGoogleToken(null); }}
                      className="text-[9px] font-mono text-luxury-dark/70 hover:text-luxury-gold uppercase underline cursor-pointer"
                    >
                      Wyloguj
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-white border border-luxury-sand/60 rounded-xs flex items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-wider block font-bold">
                        Opcjonalne Logowanie Google
                      </span>
                      <p className="text-[10px] text-luxury-dark/90 leading-tight">
                        Możesz zarezerwować termin bez logowania lub połączyć konto Google dla automatycznej synchronizacji.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleSignInAndSync}
                      disabled={isSyncingGoogle}
                      className="shrink-0 px-3 py-2 border border-luxury-sand bg-luxury-sand/10 hover:border-luxury-gold font-mono text-[9px] tracking-wider uppercase text-luxury-dark flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:bg-white"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Zaloguj Google</span>
                    </button>
                  </div>
                )}

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1 font-semibold">
                      Imię i Nazwisko *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-luxury-gold absolute left-3 top-3" />
                      <input 
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Imię i Nazwisko"
                        className="w-full bg-white border border-luxury-sand/80 pl-9 pr-3 py-2 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-sans shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1 font-semibold">
                        Adres E-mail *
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-luxury-gold absolute left-3 top-3" />
                        <input 
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="twoj-email@domena.pl"
                          className="w-full bg-white border border-luxury-sand/80 pl-9 pr-3 py-2 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-sans shadow-2xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1 font-semibold">
                        Telefon Kontaktowy *
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-luxury-gold absolute left-3 top-3" />
                        <input 
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+48 600 000 000"
                          className="w-full bg-white border border-luxury-sand/80 pl-9 pr-3 py-2 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-mono shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1 font-semibold">
                      Uwagi / Historia Skóry (Opcjonalnie)
                    </label>
                    <textarea 
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Np. skóra naczyniowa, po kuracjach kwasowych, uczulenia..."
                      className="w-full bg-white border border-luxury-sand/80 p-2.5 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-sans shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Sync Error / Collision Alert */}
              {syncError && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono flex items-start gap-2 rounded-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p>{syncError}</p>
                    <a 
                      href={generateGoogleCalendarDeepLink(getEventData())} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-luxury-dark underline font-bold block pt-1 hover:text-luxury-gold"
                    >
                      → Otwórz i dodaj bezpośrednio w Google Calendar
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons: Unified direct booking with real-time calendar sync */}
              <div className="space-y-3 pt-2 border-t border-luxury-sand/40">
                {availabilityState === "error" && (
                  <div className="p-2.5 bg-red-50 border border-red-300 text-red-900 text-[10px] font-mono text-center rounded-xs flex items-center justify-center gap-1.5 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-red-800 shrink-0" />
                    <span>Dostępność kalendarza nie została potwierdzona. Rezerwacja jest zablokowana do czasu pomyślnej weryfikacji.</span>
                  </div>
                )}
                {availabilityState === "ready" && slotsData && (slotsData.availableSlotsCount === 0 || slotsData.isClosed || slotsData.isFullyBooked) && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-mono text-center rounded-xs flex items-center justify-center gap-1.5 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                    <span>Dzień {slotsData.date} jest niedostępny do rezerwacji. Wybierz inną datę z kalendarza powyżej.</span>
                  </div>
                )}
                <div>
                  <button
                    type="button"
                    onClick={handleBookAppointment}
                    disabled={
                      availabilityState !== "ready" ||
                      isSubmittingBooking ||
                      !clientName ||
                      !clientPhone ||
                      !selectedTime ||
                      !slotsData?.googleCalendarSynced ||
                      slotsData?.isClosed ||
                      slotsData?.isFullyBooked ||
                      slotsData?.availableSlotsCount === 0
                    }
                    className="w-full bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white p-4 text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-xs font-bold"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-luxury-gold" />
                        <span>Rezerwuję termin w kalendarzu...</span>
                      </>
                    ) : (
                      <>
                        <CalendarCheck2 className="w-4 h-4 text-luxury-gold" />
                        <span>Potwierdź rezerwację wizyty {selectedTime ? `(${selectedTime} — ${slotEndTime})` : ""}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] font-mono text-luxury-dark/80 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bezpieczna integracja kalendarza gabinetu
                  </span>
                  <a
                    href={`https://wa.me/48793088854?text=${encodeURIComponent(
                      `Dzień dobry! Chciał(a)bym potwierdzić rezerwację zabiegu: ${treatment?.title || "zabieg"} w dniu ${selectedDate} w godz. ${selectedTime}—${slotEndTime}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-semibold uppercase flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" /> WhatsApp Recepcji (793 088 854)
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* CONFIRMATION SCREEN                                       */
            /* ========================================================= */
            <div className="text-center space-y-6 py-4 font-serif">
              <div className="w-14 h-14 rounded-full border-2 border-luxury-gold bg-luxury-gold/10 flex items-center justify-center text-luxury-gold mx-auto shadow-sm">
                <Check className="w-7 h-7 stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[9.5px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
                  Rezerwacja Zapisana Pomyślnie
                </span>
                <h3 className="text-2xl font-light text-luxury-dark">
                  Dziękujemy, {clientName.split(" ")[0]}
                </h3>
                <p className="text-xs text-luxury-dark/95 max-w-md mx-auto leading-relaxed font-sans">
                  Termin na <strong className="text-luxury-dark">{treatment.title}</strong> został zablokowany na dzień <span className="font-mono font-bold text-luxury-dark">{selectedDate}</span> w godzinach <span className="font-mono font-bold text-luxury-gold">{selectedTime} — {slotEndTime}</span> ({durationMin} min).
                </p>
              </div>

              {/* Status info box */}
              <div className="p-4 bg-emerald-50/90 border border-emerald-200/90 max-w-md mx-auto text-left space-y-2.5 rounded-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-mono text-[10px] uppercase font-bold">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Zgłoszenie skierowane do oficjalnego kalendarza: {SLOW_SKIN_GOOGLE_ACCOUNT}</span>
                </div>
                <p className="text-[11px] text-luxury-dark/95 leading-relaxed font-sans">
                  Twój slot został zablokowany w systemie i nie ulegnie kolizji z żadną inną wizytą. Możesz również wysłać szybką wiadomość do recepcji na WhatsApp lub zadzwonić:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={`https://wa.me/48793088854?text=${encodeURIComponent(
                      `Dzień dobry! Zgłaszam potwierdzoną rezerwację w Instytucie Slow Skin Concept:\n` +
                      `• Zabieg: ${treatment.title}\n` +
                      `• Termin: ${selectedDate} w godz. ${selectedTime} — ${slotEndTime} (${durationMin} min)\n` +
                      `• Klient: ${clientName}\n` +
                      `• Telefon: ${clientPhone}\n` +
                      `• E-mail: ${clientEmail}` +
                      (notes ? `\n• Notatki: ${notes}` : "")
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm rounded-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp (+48 793 088 854)
                  </a>
                  <a
                    href="tel:793088854"
                    className="py-2.5 px-3 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm rounded-xs"
                  >
                    <Phone className="w-3.5 h-3.5" /> Zadzwoń: 793 088 854
                  </a>
                </div>
              </div>

              {/* Google Calendar Link Badge */}
              {googleEventLink && (
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 max-w-md mx-auto text-left space-y-2 rounded-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-mono text-[10px] uppercase font-semibold">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Zsynchronizowano z Google Calendar ({SLOW_SKIN_GOOGLE_ACCOUNT})</span>
                  </div>
                  <a 
                    href={googleEventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-950 font-medium underline hover:text-luxury-gold transition-colors font-mono"
                  >
                    Otwórz wydarzenie w Google Calendar <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Online Google Meet Room Card */}
              {isOnline && (
                <div className="p-4 bg-gradient-to-r from-emerald-900 to-luxury-dark text-white border border-emerald-500/40 max-w-md mx-auto text-left space-y-3 shadow-lg rounded-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-[9.5px] uppercase tracking-widest text-emerald-300 font-bold">
                        Wirtualny Pokój Google Meet
                      </span>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-800/80 text-emerald-200 px-2 py-0.5 border border-emerald-600/40 rounded-xs">
                      Połączenie 1:1
                    </span>
                  </div>

                  <p className="text-[11px] text-luxury-cream/80 font-sans leading-relaxed">
                    Twój wirtualny pokój videokonsultacji został zarezerwowany. W dniu spotkania dołączysz jednym kliknięciem.
                  </p>

                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all shadow-md text-center rounded-xs"
                  >
                    <Video className="w-4 h-4" />
                    <span>Otwórz / Przetestuj Google Meet ↗</span>
                  </a>
                </div>
              )}

              {/* Manual Export Cards */}
              <div className="border border-luxury-sand/80 bg-white/70 p-5 max-w-md mx-auto space-y-3 text-left rounded-xs">
                <span className="font-mono text-[8.5px] uppercase tracking-widest text-luxury-gold block font-semibold">
                  Dodaj Do Swojego Kalendarza
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a 
                    href={generateGoogleCalendarDeepLink(getEventData())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-luxury-sand/70 bg-luxury-sand/10 hover:border-luxury-gold hover:bg-white text-[10px] font-mono text-luxury-dark uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center rounded-xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-luxury-gold" /> Web Google Cal ↗
                  </a>

                  <button 
                    onClick={() => downloadIcsCalendarFile(getEventData())}
                    className="p-2.5 border border-luxury-sand/70 bg-luxury-sand/10 hover:border-luxury-gold hover:bg-white text-[10px] font-mono text-luxury-dark uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer rounded-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-luxury-gold" /> Pobierz .ICS
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-luxury-dark text-luxury-cream text-xs font-mono tracking-widest uppercase hover:bg-luxury-gold hover:text-white transition-all shadow-md cursor-pointer rounded-xs"
                >
                  Powrót do Serwisu
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
