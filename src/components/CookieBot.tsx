import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cookie, Settings, Check, X, Sliders, ExternalLink, Info } from "lucide-react";
import { safeStorage } from "../utils/storage";

export interface CookieConsents {
  necessary: boolean;
  functional: boolean;
  analytical: boolean;
  advertising: boolean;
}

export interface ConsentRecord {
  consentId: string;
  version: string;
  policyDate: string;
  timestamp: string;
  categories: CookieConsents;
  source: string;
}

interface CookieBotProps {
  onOpenPolicy?: () => void;
}

const DEFAULT_CONSENTS: CookieConsents = {
  necessary: true,
  functional: false,
  analytical: false,
  advertising: false,
};

const CONSENT_STORAGE_KEY = "slowskin_cookie_consent_v1";

export default function CookieBot({ onOpenPolicy }: CookieBotProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | null>(null);

  // Cookie categories state (all optional categories default to false as mandated by CMP rules)
  const [consents, setConsents] = useState<CookieConsents>(DEFAULT_CONSENTS);

  // Load existing consent on mount and listen to custom events
  useEffect(() => {
    const rawSaved = safeStorage.getItem(CONSENT_STORAGE_KEY);
    if (rawSaved) {
      setHasInteracted(true);
      try {
        const parsed = JSON.parse(rawSaved) as ConsentRecord;
        if (parsed && parsed.categories) {
          setConsents(parsed.categories);
          setConsentRecord(parsed);
        }
      } catch (e) {
        // fallback
      }
    } else {
      // First visit - display banner after short aesthetic delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1400);
      return () => clearTimeout(timer);
    }

    // Global event listeners for footer links and external buttons
    const handleOpenSettingsEvent = () => {
      setShowPreferences(true);
      setIsVisible(true);
    };

    const handleOpenPolicyEvent = () => {
      if (onOpenPolicy) {
        onOpenPolicy();
      }
    };

    window.addEventListener("openCookieSettings", handleOpenSettingsEvent);
    window.addEventListener("openCookiePolicy", handleOpenPolicyEvent);

    return () => {
      window.removeEventListener("openCookieSettings", handleOpenSettingsEvent);
      window.removeEventListener("openCookiePolicy", handleOpenPolicyEvent);
    };
  }, [onOpenPolicy]);

  const saveConsent = (updatedCategories: CookieConsents) => {
    const record: ConsentRecord = {
      consentId: `ssc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      version: "1.0",
      policyDate: "2026-09-03",
      timestamp: new Date().toISOString(),
      categories: updatedCategories,
      source: typeof window !== "undefined" ? window.location.hostname : "slow-skin.pl",
    };

    safeStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    setConsents(updatedCategories);
    setConsentRecord(record);
    setIsVisible(false);
    setShowPreferences(false);
    setHasInteracted(true);

    // Dispatch event so analytics or functional modules can react
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cookieConsentUpdated", { detail: record })
      );
    }
  };

  // 1. Akceptuję wszystkie
  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytical: true,
      advertising: true,
    });
  };

  // 2. Odrzucam opcjonalne
  const handleDeclineAll = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytical: false,
      advertising: false,
    });
  };

  // 3. Zapisz wybrane
  const handleSaveCustom = () => {
    saveConsent(consents);
  };

  const toggleConsent = (key: keyof Omit<CookieConsents, "necessary">) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleOpenCookieBubble = () => {
    setShowPreferences(true);
    setIsVisible(true);
  };

  const handleOpenPolicyFromBanner = () => {
    if (onOpenPolicy) {
      onOpenPolicy();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("openCookiePolicy"));
    }
  };

  return (
    <>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Tło przyciemniające przy manualnym otwarciu panelu ustawień */}
            {(hasInteracted || showPreferences) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVisible(false)}
                className="fixed inset-0 bg-black/60 z-[99998] wcag-no-speech backdrop-blur-xs"
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
              className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto sm:max-w-xl bg-[#faf8f5]/98 border-2 border-luxury-gold text-luxury-dark shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-5 sm:p-6 z-[99999] overflow-hidden rounded-none wcag-no-speech wcag-no-invert backdrop-blur-md max-h-[90vh] flex flex-col"
              id="cookie-bot-banner"
              role="dialog"
              aria-labelledby="cookie-title"
              aria-describedby="cookie-desc"
            >
              {/* Close Button when opened manually */}
              {hasInteracted && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="absolute top-4 right-4 p-1.5 text-luxury-dark/60 hover:text-luxury-dark hover:bg-luxury-gold/20 transition-colors cursor-pointer"
                  aria-label="Zamknij panel cookies"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Header */}
              <div className="flex items-start gap-3 mb-3 pr-6 shrink-0">
                <div className="p-2 bg-luxury-gold/15 text-luxury-gold shrink-0 border border-luxury-gold/30">
                  <Cookie className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-luxury-gold font-bold block">
                    Wersja 1.0 • RODO & PKE
                  </span>
                  <h3 id="cookie-title" className="font-serif text-base font-semibold tracking-wide text-luxury-dark uppercase leading-tight">
                    COOKIES W SLOW SKIN CONCEPT
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="overflow-y-auto pr-1 space-y-3">
                {!showPreferences ? (
                  /* Pierwsza warstwa banera — Treść dosłownie zgodna ze specyfikacją Części II (B) */
                  <div className="space-y-3">
                    <p id="cookie-desc" className="text-xs text-luxury-dark leading-relaxed font-sans">
                      Używamy technologii niezbędnych do bezpiecznego działania serwisu. Za Twoją zgodą możemy także używać technologii funkcjonalnych, analitycznych i reklamowych. Możesz zaakceptować wszystkie, odrzucić opcjonalne albo wybrać ustawienia. Zgodę możesz później zmienić w stopce. Więcej informacji znajdziesz w{" "}
                      <button
                        onClick={handleOpenPolicyFromBanner}
                        className="text-luxury-gold hover:underline font-semibold cursor-pointer inline-flex items-center gap-0.5"
                      >
                        Polityce cookies ↗
                      </button>
                      .
                    </p>

                    <div className="text-[10px] text-luxury-dark/70 font-mono bg-white/70 p-2.5 border border-luxury-sand/60 flex items-center justify-between">
                      <span>Domeny objęte polityką: <strong>slow-skin.pl</strong> oraz <strong>slow-skin.eu</strong></span>
                      <span className="text-luxury-gold font-bold">Art. 399 PKE</span>
                    </div>
                  </div>
                ) : (
                  /* Druga warstwa panelu — Teksty dosłownie zgodne ze specyfikacją Części II (C) */
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-mono font-semibold tracking-wider uppercase text-luxury-gold flex items-center gap-1.5">
                        <Sliders className="w-3 h-3 text-luxury-gold" />
                        <span>Dostosuj preferencje zgód na cookies:</span>
                      </div>
                      <button
                        onClick={handleOpenPolicyFromBanner}
                        className="text-[9.5px] font-mono text-luxury-gold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Polityka cookies ↗
                      </button>
                    </div>

                    {/* Kategoria 1: Niezbędne — zawsze aktywne */}
                    <div className="bg-white p-3 border border-luxury-sand/80 space-y-1 shadow-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-luxury-dark flex items-center gap-1.5">
                          <span>Niezbędne — zawsze aktywne</span>
                          <span className="text-[8px] bg-luxury-dark text-white px-1.5 py-0.5 font-mono uppercase font-bold">
                            Wymagane
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="accent-luxury-gold w-4 h-4 cursor-not-allowed"
                          aria-label="Niezbędne pliki cookies - zawsze aktywne"
                        />
                      </div>
                      <p className="text-[11px] text-luxury-dark/85 font-sans leading-relaxed">
                        Zapewniają transmisję, bezpieczeństwo, działanie funkcji, o którą prosisz, i zapamiętanie Twoich ustawień zgody. Nie służą do reklamy ani pomiaru zachowania.
                      </p>
                    </div>

                    {/* Kategoria 2: Funkcjonalne — domyślnie wyłączone */}
                    <div className="bg-white p-3 border border-luxury-sand/80 space-y-1 shadow-xs hover:border-luxury-gold/60 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="consent-functional" className="text-xs font-semibold text-luxury-dark cursor-pointer flex-1">
                          Funkcjonalne — domyślnie wyłączone
                        </label>
                        <input
                          id="consent-functional"
                          type="checkbox"
                          checked={consents.functional}
                          onChange={() => toggleConsent("functional")}
                          className="accent-luxury-gold w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-luxury-dark/85 font-sans leading-relaxed">
                        Umożliwiają dodatkowe funkcje, takie jak zewnętrzna mapa, odtwarzacz, czat lub rozszerzona personalizacja. Dostawca może otrzymać dane techniczne urządzenia.
                      </p>
                    </div>

                    {/* Kategoria 3: Analityczne — domyślnie wyłączone */}
                    <div className="bg-white p-3 border border-luxury-sand/80 space-y-1 shadow-xs hover:border-luxury-gold/60 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="consent-analytical" className="text-xs font-semibold text-luxury-dark cursor-pointer flex-1">
                          Analityczne — domyślnie wyłączone
                        </label>
                        <input
                          id="consent-analytical"
                          type="checkbox"
                          checked={consents.analytical}
                          onChange={() => toggleConsent("analytical")}
                          className="accent-luxury-gold w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-luxury-dark/85 font-sans leading-relaxed">
                        Pomagają mierzyć odwiedziny, źródła ruchu i sposób korzystania z serwisu. Uruchamiamy je dopiero po Twojej zgodzie.
                      </p>
                    </div>

                    {/* Kategoria 4: Reklamowe — domyślnie wyłączone */}
                    <div className="bg-white p-3 border border-luxury-sand/80 space-y-1 shadow-xs hover:border-luxury-gold/60 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="consent-advertising" className="text-xs font-semibold text-luxury-dark cursor-pointer flex-1">
                          Reklamowe — domyślnie wyłączone
                        </label>
                        <input
                          id="consent-advertising"
                          type="checkbox"
                          checked={consents.advertising}
                          onChange={() => toggleConsent("advertising")}
                          className="accent-luxury-gold w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-luxury-dark/85 font-sans leading-relaxed">
                        Pozwalają mierzyć kampanie, prowadzić remarketing lub dopasowywać reklamy, także pomiędzy serwisami. Uruchamiamy je dopiero po Twojej zgodzie.
                      </p>
                    </div>

                    {/* Dowód zgody w rejestrze CMP */}
                    {consentRecord && (
                      <div className="bg-luxury-sand/15 p-2.5 border border-luxury-sand/60 text-[9px] font-mono text-luxury-dark/80 space-y-0.5">
                        <div className="flex items-center gap-1 text-luxury-gold font-bold uppercase tracking-wider">
                          <Info className="w-3 h-3" />
                          <span>Zapisany dowód zgody CMP:</span>
                        </div>
                        <div>ID: <span className="text-luxury-dark font-semibold">{consentRecord.consentId}</span></div>
                        <div>Data decyzji: {new Date(consentRecord.timestamp).toLocaleString("pl-PL")}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons — Trzy równorzędne przyciski na pierwszej warstwie */}
              <div className="mt-4 pt-3 border-t border-luxury-sand/60 shrink-0 space-y-2">
                {!showPreferences ? (
                  <div className="space-y-2">
                    {/* Trzy równorzędne przyciski zgodnie ze specyfikacją */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={handleAcceptAll}
                        className="py-2.5 px-3 bg-luxury-dark text-white border-2 border-luxury-dark text-[10.5px] font-mono uppercase tracking-wider hover:bg-luxury-gold hover:border-luxury-gold transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Akceptuję wszystkie</span>
                      </button>

                      <button
                        onClick={handleDeclineAll}
                        className="py-2.5 px-3 bg-white text-luxury-dark border-2 border-luxury-dark text-[10.5px] font-mono uppercase tracking-wider hover:bg-luxury-sand/20 transition-all cursor-pointer font-bold flex items-center justify-center text-center"
                      >
                        Odrzucam opcjonalne
                      </button>

                      <button
                        onClick={() => setShowPreferences(true)}
                        className="py-2.5 px-3 bg-white text-luxury-dark border-2 border-luxury-gold text-[10.5px] font-mono uppercase tracking-wider hover:bg-luxury-gold/15 transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5"
                      >
                        <Settings className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Ustawienia</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowPreferences(false)}
                        className="py-2.5 border border-luxury-sand text-[10px] font-mono uppercase tracking-wider hover:border-luxury-gold transition-all cursor-pointer font-bold bg-white text-luxury-dark"
                      >
                        Wróć
                      </button>
                      <button
                        onClick={handleSaveCustom}
                        className="py-2.5 bg-luxury-dark text-white border border-luxury-dark text-[10px] font-mono uppercase tracking-wider hover:bg-luxury-gold hover:border-luxury-gold transition-all cursor-pointer font-bold shadow-sm"
                      >
                        Zapisz wybrane
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleDeclineAll}
                        className="py-2 border border-luxury-sand text-[9.5px] font-mono uppercase tracking-wider hover:bg-luxury-sand/15 transition-all cursor-pointer text-luxury-dark"
                      >
                        Odrzuć opcjonalne
                      </button>
                      <button
                        onClick={handleAcceptAll}
                        className="py-2 border border-luxury-gold text-[9.5px] font-mono uppercase tracking-wider hover:bg-luxury-gold/10 transition-all cursor-pointer text-luxury-dark font-medium"
                      >
                        Akceptuj wszystkie
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-footer Link and Version info */}
                <div className="flex items-center justify-between text-[8.5px] font-mono tracking-wider text-luxury-dark/70 uppercase pt-1">
                  <span>SLOW SKIN CONCEPT</span>
                  <button
                    onClick={handleOpenPolicyFromBanner}
                    className="hover:text-luxury-gold underline transition-colors cursor-pointer"
                  >
                    Polityka cookies
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Persistent Cookie Bubble positioned aesthetically alongside WCAG Bubble on the bottom-left */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-[68px] sm:left-[84px] bottom-4 sm:bottom-6 z-50 wcag-no-speech wcag-no-invert"
          >
            <button
              onClick={() => {
                setShowPreferences(true);
                setIsVisible(true);
              }}
              className="group w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 cursor-pointer bg-luxury-dark text-luxury-gold hover:bg-[#1a1715] hover:scale-105 active:scale-95 relative"
              aria-label="Ustawienia prywatności i plików cookies"
              id="cookie-trigger-bubble"
              title="Ustawienia plików cookies (RODO)"
            >
              <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-luxury-gold transition-transform group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-dark text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-white uppercase scale-90 group-hover:scale-100 transition-transform shadow-md">
                RODO
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 -top-9 bg-luxury-dark text-luxury-cream border border-luxury-sand/30 font-mono text-[9px] px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                Ustawienia Cookies
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
