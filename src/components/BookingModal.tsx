import React, { useState, useEffect } from "react";
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
  AlertCircle
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
  BookingEventData,
  GoogleUserProfile 
} from "../services/googleCalendar";

interface BookingModalProps {
  treatment: Treatment | null;
  onClose: () => void;
}

const AVAILABLE_HOURS = [
  "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:00"
];

export const BookingModal: React.FC<BookingModalProps> = ({ treatment, onClose }) => {
  const isVideoService = treatment ? (treatment.id === "videokonsultacja" || treatment.id.includes("video") || treatment.title.toLowerCase().includes("video") || treatment.title.toLowerCase().includes("online")) : false;
  
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("11:00");
  const [isOnline, setIsOnline] = useState(isVideoService);
  const [notes, setNotes] = useState("");

  const [googleUser, setGoogleUser] = useState<GoogleUserProfile | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);
  const [googleEventLink, setGoogleEventLink] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Set default minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(minDateStr);
    }
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

  if (!treatment) return null;

  const durationMin = parseInt(treatment.duration) || 75;

  const getEventData = (): BookingEventData => ({
    title: treatment.title,
    treatmentName: treatment.title,
    durationMinutes: durationMin,
    price: treatment.price,
    clientName: clientName || "Gość Slow Skin",
    clientPhone: clientPhone || "+48",
    clientEmail: clientEmail || "kontakt@slowskinconcept.pl",
    dateStr: selectedDate || minDateStr,
    timeStr: selectedTime,
    notes: notes,
    isOnlineConsultation: isOnline,
  });

  const handleGoogleSignInAndSync = async () => {
    setIsSyncingGoogle(true);
    setSyncError(null);

    try {
      let token = googleToken || getCachedGoogleToken();
      
      if (!token) {
        token = await requestGoogleCalendarAccess();
        setGoogleToken(token);
        const profile = await fetchGoogleUserProfile(token);
        if (profile) {
          setGoogleUser(profile);
          if (!clientName && profile.name) setClientName(profile.name);
          if (!clientEmail && profile.email) setClientEmail(profile.email);
        }
      }

      const eventData = getEventData();
      const result = await insertEventIntoGoogleCalendar(token, eventData);

      if (result.success) {
        setGoogleEventLink(result.eventLink || null);
        setIsConfirmed(true);
        saveToLocalHistory(eventData);
      } else {
        setSyncError(result.error || "Wystąpił problem z zapisem w Google Calendar. Skorzystaj z linku bezpośredniego.");
      }
    } catch (err: any) {
      setSyncError(err.message || "Błąd autoryzacji Google. Możesz dodać termin jednym kliknięciem poniżej.");
    } finally {
      setIsSyncingGoogle(false);
    }
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = getEventData();
    setIsConfirmed(true);
    saveToLocalHistory(eventData);
  };

  const saveToLocalHistory = (data: BookingEventData) => {
    try {
      const history = JSON.parse(safeStorage.getItem("slow_skin_bookings") || "[]");
      history.unshift({
        id: `book-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      });
      safeStorage.setItem("slow_skin_bookings", JSON.stringify(history.slice(0, 10)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-luxury-dark/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-luxury-cream border border-luxury-sand/80 max-w-xl w-full relative my-8 shadow-2xl overflow-hidden"
        id="slow-skin-booking-modal"
      >
        {/* Header Ribbon */}
        <div className="bg-luxury-dark text-white px-6 py-4 flex items-center justify-between border-b border-luxury-gold/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-luxury-gold">
              Autorski Kalendarz Wizyt • Google Calendar
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-luxury-sand hover:text-white transition-colors text-sm font-mono cursor-pointer"
            aria-label="Zamknij"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {!isConfirmed ? (
            <form onSubmit={handleSubmitManual} className="space-y-6">
              {/* Treatment Overview Card */}
              <div className="border border-luxury-sand/60 bg-white/70 p-4 space-y-2 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[8px] text-luxury-gold uppercase tracking-widest block font-medium">
                      Wybrana Terapia Biologiczna
                    </span>
                    <h3 className="font-serif text-lg text-luxury-dark font-medium leading-snug">
                      {treatment.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-serif text-base text-luxury-dark font-medium block">
                      {treatment.price}
                    </span>
                    <span className="font-mono text-[9px] text-luxury-dark/90 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-luxury-gold" /> {treatment.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Format selection: In-person vs Online */}
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
                        ? "border-luxury-gold bg-luxury-sand/20 shadow-xs" 
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
                        ? "border-emerald-700 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600/30" 
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

              {/* Dedykowana Bramka do Videokonsultacji Google Meet */}
              {isOnline && (
                <div className="border border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-4 space-y-3 rounded-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-900 font-bold">
                        Bramka Videokonsultacji • Google Meet
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-xs">
                      Cena: 250 PLN (60 min)
                    </span>
                  </div>

                  <p className="text-[11px] text-luxury-dark font-sans leading-relaxed">
                    Spotkanie wideo 1:1 z <strong>mgr Katarzyną Brzezińską</strong>. Po zatwierdzeniu terminu wydarzenie zostanie automatycznie zsynchronizowane z Twoim kalendarzem Google wraz z aktywnym pokojem <strong>Google Meet</strong>. W ciągu 48h od konsultacji otrzymasz spersonalizowany <strong>Beauty Plan™ (plik PDF)</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="bg-white/80 p-2.5 border border-emerald-100 space-y-1">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-800 font-semibold block">
                        📋 Przygotowanie:
                      </span>
                      <ul className="text-[9.5px] text-luxury-dark/95 space-y-0.5 list-disc list-inside">
                        <li>Światło dzienne wprost na twarz</li>
                        <li>Czysta skóra bez makijażu</li>
                        <li>Lista aktualnych kosmetyków</li>
                      </ul>
                    </div>

                    <div className="bg-white/80 p-2.5 border border-emerald-100 flex flex-col justify-between gap-1.5">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-800 font-semibold block">
                        🎥 Test połączenia:
                      </span>
                      <a
                        href="https://meet.google.com/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 text-[9.5px] font-mono text-emerald-900 font-medium hover:text-luxury-gold underline"
                      >
                        Przetestuj kamerę w Google Meet ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1.5 font-semibold">
                    Preferowana Data
                  </label>
                  <div className="relative">
                    <input 
                      type="date"
                      required
                      min={minDateStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white border border-luxury-sand/80 px-3.5 py-2.5 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1.5 font-semibold">
                    Preferowana Godzina
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-white border border-luxury-sand/80 px-3.5 py-2.5 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-mono"
                  >
                    {AVAILABLE_HOURS.map((hr) => (
                      <option key={hr} value={hr}>
                        {hr} (Sesja kameralna)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Google Profile Quick-Auth / Fill */}
              {googleUser ? (
                <div className="flex items-center justify-between p-3 bg-white border border-emerald-200/80">
                  <div className="flex items-center gap-2.5">
                    {googleUser.picture ? (
                      <img src={googleUser.picture} alt={googleUser.name} className="w-7 h-7 rounded-full border border-luxury-sand" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-luxury-dark text-luxury-gold flex items-center justify-center text-xs">
                        {googleUser.name?.charAt(0) || "G"}
                      </div>
                    )}
                    <div>
                      <p className="font-mono text-[10px] text-luxury-dark font-medium">{googleUser.name || googleUser.email}</p>
                      <p className="text-[9px] text-luxury-dark/90 font-mono">Konto Google połączone ✓</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { clearGoogleToken(); setGoogleUser(null); setGoogleToken(null); }}
                    className="text-[9px] font-mono text-luxury-dark/90 hover:text-luxury-gold uppercase"
                  >
                    Odłącz
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-white/60 border border-luxury-sand/40 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-wider block font-semibold">
                      Konto Google
                    </span>
                    <p className="text-[10px] text-luxury-dark/95">
                      Zaloguj się kontem Google, aby automatycznie uzupełnić dane i zsynchronizować kalendarz.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignInAndSync}
                    disabled={isSyncingGoogle}
                    className="shrink-0 px-3 py-2 border border-luxury-sand bg-white hover:border-luxury-gold font-mono text-[9px] tracking-wider uppercase text-luxury-dark flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
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

              {/* Personal Contact Inputs */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1">
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
                      className="w-full bg-white border border-luxury-sand/80 pl-9 pr-3 py-2 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1">
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
                        className="w-full bg-white border border-luxury-sand/80 pl-9 pr-3 py-2 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1">
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
                        className="w-full bg-white border border-luxury-sand/80 pl-9 pr-3 py-2 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-luxury-dark/95 uppercase tracking-widest block mb-1">
                    Uwagi / Historia Skóry (Opcjonalnie)
                  </label>
                  <textarea 
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Np. skóra naczyniowa, po zabiegach kwasowych, uczulenia..."
                    className="w-full bg-white border border-luxury-sand/80 p-2.5 text-xs outline-none focus:border-luxury-gold text-luxury-dark font-sans"
                  />
                </div>
              </div>

              {syncError && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-start gap-2">
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

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleGoogleSignInAndSync}
                  disabled={isSyncingGoogle || !clientName || !clientPhone}
                  className="w-full bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white p-3.5 text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncingGoogle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-luxury-gold" />
                      <span>Synchronizuję z Google Calendar...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-luxury-gold" />
                      <span>Zapisz w Google Calendar</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between gap-3 text-[9px] font-mono text-luxury-dark/90">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bezpieczna integracja Google
                  </span>
                  <button
                    type="submit"
                    className="hover:text-luxury-gold underline uppercase cursor-pointer"
                  >
                    Rezerwacja bez konta Google →
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Confirmation Screen */
            <div className="text-center space-y-6 py-4 font-serif">
              <div className="w-14 h-14 rounded-full border-2 border-luxury-gold bg-luxury-gold/10 flex items-center justify-center text-luxury-gold mx-auto">
                <Check className="w-7 h-7 stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block">
                  Rezerwacja Zgłoszona Pomyślnie
                </span>
                <h3 className="text-2xl font-light text-luxury-dark">
                  Dziękujemy, {clientName.split(" ")[0]}
                </h3>
                <p className="text-xs text-luxury-dark/95 max-w-md mx-auto leading-relaxed">
                  Twoja rezerwacja na <span className="font-semibold text-luxury-dark">{treatment.title}</span> została pomyślnie przyjęta na dzień <span className="font-mono font-medium text-luxury-dark">{selectedDate}</span> o godzinie <span className="font-mono font-medium text-luxury-dark">{selectedTime}</span>.
                </p>
              </div>

              {/* Google Calendar Link Badge */}
              {googleEventLink && (
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 max-w-md mx-auto text-left space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-mono text-[10px] uppercase font-semibold">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Wydarzenie dodane do Twojego Google Calendar</span>
                  </div>
                  <a 
                    href={googleEventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-950 font-medium underline hover:text-luxury-gold transition-colors"
                  >
                    Otwórz wydarzenie w kalendarzu Google <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Online Google Meet Room Card */}
              {isOnline && (
                <div className="p-4 bg-gradient-to-r from-emerald-900 to-luxury-dark text-white border border-emerald-500/40 max-w-md mx-auto text-left space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono text-[9.5px] uppercase tracking-widest text-emerald-300 font-bold">
                        Wirtualny Pokój Google Meet
                      </span>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-800/80 text-emerald-200 px-2 py-0.5 border border-emerald-600/40">
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
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all shadow-md text-center"
                  >
                    <Video className="w-4 h-4" />
                    <span>Otwórz / Przetestuj Google Meet ↗</span>
                  </a>
                </div>
              )}

              {/* Manual Export Cards */}
              <div className="border border-luxury-sand/80 bg-white/70 p-5 max-w-md mx-auto space-y-3 text-left">
                <span className="font-mono text-[8.5px] uppercase tracking-widest text-luxury-gold block font-semibold">
                  Dodatkowe Opcje Synchronizacji Kalendarza
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a 
                    href={generateGoogleCalendarDeepLink(getEventData())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-luxury-sand/70 bg-luxury-sand/10 hover:border-luxury-gold hover:bg-white text-[10px] font-mono text-luxury-dark uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <Calendar className="w-3.5 h-3.5 text-luxury-gold" /> Web Google Cal ↗
                  </a>

                  <button 
                    onClick={() => downloadIcsCalendarFile(getEventData())}
                    className="p-2.5 border border-luxury-sand/70 bg-luxury-sand/10 hover:border-luxury-gold hover:bg-white text-[10px] font-mono text-luxury-dark uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-luxury-gold" /> Pobierz .ICS
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-luxury-dark text-luxury-cream text-xs font-mono tracking-widest uppercase hover:bg-luxury-gold hover:text-white transition-all shadow-md cursor-pointer"
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
