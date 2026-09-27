import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Eye, 
  Type, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  MousePointer, 
  Underline, 
  Activity, 
  Sparkles, 
  User, 
  X,
  FileText,
  Accessibility,
  EyeOff,
  Compass
} from "lucide-react";
import { safeStorage } from "../utils/storage";

type FontSizeMode = "normal" | "md" | "lg" | "xl";
type ContrastMode = "normal" | "yellow" | "dark" | "light" | "grayscale" | "invert";

export default function WcagWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Load preferences from safeStorage
  const [fontSize, setFontSize] = useState<FontSizeMode>(() => {
    return (safeStorage.getItem("wcag_font_size") as FontSizeMode) || "normal";
  });
  const [contrast, setContrast] = useState<ContrastMode>(() => {
    return (safeStorage.getItem("wcag_contrast") as ContrastMode) || "normal";
  });
  const [underlineLinks, setUnderlineLinks] = useState<boolean>(() => {
    return safeStorage.getItem("wcag_underline_links") === "true";
  });
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(() => {
    return safeStorage.getItem("wcag_dyslexic_font") === "true";
  });
  const [pauseAnimations, setPauseAnimations] = useState<boolean>(() => {
    return safeStorage.getItem("wcag_pause_animations") === "true";
  });
  const [largeCursor, setLargeCursor] = useState<boolean>(() => {
    return safeStorage.getItem("wcag_large_cursor") === "true";
  });
  const [readingGuide, setReadingGuide] = useState<boolean>(() => {
    return safeStorage.getItem("wcag_reading_guide") === "true";
  });
  const [screenReaderActive, setScreenReaderActive] = useState<boolean>(() => {
    return safeStorage.getItem("wcag_screen_reader") === "true";
  });

  // Track cursor position for the Reading Guide
  const [mouseY, setMouseY] = useState(0);

  // Save changes to safeStorage and apply class list side-effects
  useEffect(() => {
    safeStorage.setItem("wcag_font_size", fontSize);
    safeStorage.setItem("wcag_contrast", contrast);
    safeStorage.setItem("wcag_underline_links", String(underlineLinks));
    safeStorage.setItem("wcag_dyslexic_font", String(dyslexicFont));
    safeStorage.setItem("wcag_pause_animations", String(pauseAnimations));
    safeStorage.setItem("wcag_large_cursor", String(largeCursor));
    safeStorage.setItem("wcag_reading_guide", String(readingGuide));
    safeStorage.setItem("wcag_screen_reader", String(screenReaderActive));

    const root = document.documentElement;
    
    // 1. Font Size
    root.classList.remove("wcag-zoom-md", "wcag-zoom-lg", "wcag-zoom-xl");
    if (fontSize === "md") root.classList.add("wcag-zoom-md");
    if (fontSize === "lg") root.classList.add("wcag-zoom-lg");
    if (fontSize === "xl") root.classList.add("wcag-zoom-xl");

    // 2. Contrast
    root.classList.remove(
      "wcag-contrast-yellow", 
      "wcag-contrast-dark", 
      "wcag-contrast-light", 
      "wcag-grayscale", 
      "wcag-invert"
    );
    if (contrast === "yellow") root.classList.add("wcag-contrast-yellow");
    if (contrast === "dark") root.classList.add("wcag-contrast-dark");
    if (contrast === "light") root.classList.add("wcag-contrast-light");
    if (contrast === "grayscale") root.classList.add("wcag-grayscale");
    if (contrast === "invert") root.classList.add("wcag-invert");

    // 3. Underline Links
    if (underlineLinks) {
      root.classList.add("wcag-underline-links");
    } else {
      root.classList.remove("wcag-underline-links");
    }

    // 4. Dyslexic Font
    if (dyslexicFont) {
      root.classList.add("wcag-dyslexic");
    } else {
      root.classList.remove("wcag-dyslexic");
    }

    // 5. Pause Animations
    if (pauseAnimations) {
      root.classList.add("wcag-pause-animations");
    } else {
      root.classList.remove("wcag-pause-animations");
    }

    // 6. Large Cursor
    if (largeCursor) {
      root.classList.add("wcag-large-cursor");
    } else {
      root.classList.remove("wcag-large-cursor");
    }
  }, [fontSize, contrast, underlineLinks, dyslexicFont, pauseAnimations, largeCursor, readingGuide, screenReaderActive]);

  // Handle Reading Guide mouse tracking
  useEffect(() => {
    if (!readingGuide) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [readingGuide]);

  // Handle Screen Reader Hover Speaking (Polish Speech Synthesis)
  useEffect(() => {
    if (!screenReaderActive) {
      window.speechSynthesis?.cancel();
      return;
    }

    const getPolishFemaleVoice = () => {
      if (!window.speechSynthesis) return null;
      const voices = window.speechSynthesis.getVoices();
      const plVoices = voices.filter(v => v.lang.toLowerCase().startsWith("pl"));
      if (plVoices.length === 0) return null;

      // Prefer common Polish female voices: Zosia (Apple), Paulina (Windows/Microsoft), Maja, Agnieszka, Ewa, Google Polski
      const preferredFemaleNames = ["zosia", "paulina", "ewa", "maja", "agnieszka", "zofia", "google polski"];
      for (const name of preferredFemaleNames) {
        const found = plVoices.find(v => v.name.toLowerCase().includes(name));
        if (found) return found;
      }
      return plVoices[0];
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tagsToRead = ["P", "H1", "H2", "H3", "H4", "H5", "H6", "A", "BUTTON", "LI", "SPAN", "STRONG", "EM"];
      if (tagsToRead.includes(target.tagName) && target.innerText) {
        const text = target.innerText.trim();
        // Skip reading the widget panel text or control items when active
        if (target.closest(".wcag-no-speech")) return;
        
        if (text.length > 0 && text.length < 350) {
          window.speechSynthesis?.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "pl-PL";
          
          // Apply pleasant Polish female voice
          const voice = getPolishFemaleVoice();
          if (voice) {
            utterance.voice = voice;
          }
          
          // Adjust parameters to sound like a calm, warm, mature 40+ female voice
          utterance.pitch = 0.94; // slightly deeper, warm, mature tone (down from default 1.0)
          utterance.rate = 0.92;  // slightly slower, calm, elegant and comforting speed
          
          window.speechSynthesis?.speak(utterance);
        }
      }
    };

    document.body.addEventListener("mouseover", handleHover);
    return () => {
      document.body.removeEventListener("mouseover", handleHover);
      window.speechSynthesis?.cancel();
    };
  }, [screenReaderActive]);

  // Reset all accessibility rules
  const handleReset = () => {
    setFontSize("normal");
    setContrast("normal");
    setUnderlineLinks(false);
    setDyslexicFont(false);
    setPauseAnimations(false);
    setLargeCursor(false);
    setReadingGuide(false);
    setScreenReaderActive(false);
    
    // Cancel any speech synthesis
    window.speechSynthesis?.cancel();
  };

  return (
    <>
      {/* 1. Interactive Reading Guide line Overlay */}
      {readingGuide && (
        <div 
          className="fixed left-0 right-0 h-10 bg-luxury-gold/20 pointer-events-none z-[999999] border-y-2 border-luxury-gold/50 -translate-y-1/2 mix-blend-difference transition-all duration-75"
          style={{ top: `${mouseY}px` }}
        />
      )}

      {/* 2. Main Trigger Accessibility floating button (WCAG icon) */}
      <div className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-50 wcag-no-speech wcag-no-invert">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group w-12 h-12 sm:w-13 sm:h-13 rounded-full border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 cursor-pointer bg-[#005A9C] text-white hover:bg-[#00427c] hover:scale-105 active:scale-95 relative"
          aria-label="Ułatwienia dostępu (WCAG 2.1)"
          aria-expanded={isOpen}
          id="wcag-trigger-button"
          title="Ułatwienia dostępu (WCAG 2.1)"
        >
          <Accessibility className="w-6 h-6 transition-transform group-hover:rotate-12 stroke-[2.3]" />
          <span className="absolute -top-1 -right-1 bg-[#F1C40F] text-black text-[7.5px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-white uppercase scale-90 group-hover:scale-100 transition-transform shadow-md">
            WCAG
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 -top-9 bg-luxury-dark text-white font-mono text-[9px] px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
            Dostępność WCAG
          </span>
        </button>
      </div>

      {/* 3. Sliding Accessibility Control Center Drawer/Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for accessibility panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50 wcag-no-speech"
            />

            {/* Panel Container */}
            <motion.div
              initial={{ opacity: 0, x: -100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed left-6 bottom-24 w-full max-w-sm bg-[#faf8f5] border border-luxury-gold text-luxury-dark shadow-2xl z-55 overflow-hidden flex flex-col p-6 rounded-none wcag-no-speech"
              id="wcag-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="wcag-panel-title"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-luxury-sand/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-luxury-gold" />
                  <h3 id="wcag-panel-title" className="font-serif text-base font-semibold tracking-wide text-luxury-dark">
                    Dostępność Cyfrowa (WCAG)
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full border border-luxury-sand flex items-center justify-center text-luxury-dark hover:border-luxury-gold hover:text-luxury-gold transition-colors cursor-pointer"
                  aria-label="Zamknij panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable controls */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                
                {/* 1. Font Size Control */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-luxury-gold uppercase tracking-wider">
                    <Type className="w-3.5 h-3.5" />
                    <span>Rozmiar Tekstu</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["normal", "md", "lg", "xl"] as FontSizeMode[]).map((size) => {
                      const labels: Record<FontSizeMode, string> = {
                        normal: "100%",
                        md: "115%",
                        lg: "130%",
                        xl: "145%"
                      };
                      return (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`py-2 px-1 text-center font-sans text-xs transition-all border cursor-pointer ${
                            fontSize === size
                              ? "bg-luxury-dark text-white border-luxury-dark font-semibold"
                              : "bg-white border-luxury-sand text-luxury-dark hover:border-luxury-gold"
                          }`}
                        >
                          {labels[size]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Contrast Controls */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-luxury-gold uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Kontrast i Kolorystyka</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { mode: "normal", label: "Domyślny" },
                      { mode: "yellow", label: "Żółty na czarnym" },
                      { mode: "dark", label: "Biały na czarnym" },
                      { mode: "light", label: "Czarny na białym" },
                      { mode: "grayscale", label: "Skala szarości" },
                      { mode: "invert", label: "Odwróć kolory" }
                    ].map((item) => (
                      <button
                        key={item.mode}
                        onClick={() => setContrast(item.mode as ContrastMode)}
                        className={`py-1.5 px-2 text-left font-sans text-[11px] transition-all border flex items-center justify-between cursor-pointer ${
                          contrast === item.mode
                            ? "bg-luxury-dark text-white border-luxury-dark font-semibold"
                            : "bg-white border-luxury-sand text-luxury-dark hover:border-luxury-gold"
                        }`}
                      >
                        <span>{item.label}</span>
                        {contrast === item.mode && <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Utility Toggles */}
                <div className="space-y-2 pt-2 border-t border-luxury-sand/50">
                  <div className="text-xs font-mono font-bold text-luxury-gold uppercase tracking-wider mb-2">
                    Narzędzia wspomagające
                  </div>

                  <div className="space-y-2">
                    {/* Read Aloud Text Speech */}
                    <button
                      onClick={() => setScreenReaderActive(!screenReaderActive)}
                      className={`w-full py-2 px-3 text-left font-sans text-xs transition-all border flex items-center justify-between cursor-pointer ${
                        screenReaderActive ? "bg-[#eef3ec] border-green-600/60" : "bg-white border-luxury-sand"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {screenReaderActive ? <Volume2 className="w-4 h-4 text-green-700" /> : <VolumeX className="w-4 h-4 text-luxury-dark/60" />}
                        <div className="text-left">
                          <span className="block font-medium">Czytaj na głos (Lektor)</span>
                          <span className="block text-[9px] text-luxury-dark/50">Najedź kursorem na tekst, aby usłyszeć polski głos</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={screenReaderActive}
                        readOnly
                        className="pointer-events-none accent-luxury-gold rounded"
                      />
                    </button>

                    {/* Reading Guide */}
                    <button
                      onClick={() => setReadingGuide(!readingGuide)}
                      className={`w-full py-2 px-3 text-left font-sans text-xs transition-all border flex items-center justify-between cursor-pointer ${
                        readingGuide ? "bg-[#eef3ec] border-green-600/60" : "bg-white border-luxury-sand"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-luxury-dark" />
                        <div className="text-left">
                          <span className="block font-medium">Linijka czytania (Koncentracja)</span>
                          <span className="block text-[9px] text-luxury-dark/50">Zapewnia poziomy pas ułatwiający skupienie wzroku</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={readingGuide}
                        readOnly
                        className="pointer-events-none accent-luxury-gold rounded"
                      />
                    </button>

                    {/* Underline Links */}
                    <button
                      onClick={() => setUnderlineLinks(!underlineLinks)}
                      className={`w-full py-2 px-3 text-left font-sans text-xs transition-all border flex items-center justify-between cursor-pointer ${
                        underlineLinks ? "bg-[#eef3ec] border-green-600/60" : "bg-white border-luxury-sand"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Underline className="w-4 h-4 text-luxury-dark" />
                        <div>
                          <span className="block font-medium">Podkreśl odnośniki</span>
                          <span className="block text-[9px] text-luxury-dark/50">Wyraźnie wyróżnia wszystkie klikalne linki</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={underlineLinks}
                        readOnly
                        className="pointer-events-none accent-luxury-gold rounded"
                      />
                    </button>

                    {/* Dyslexic Font */}
                    <button
                      onClick={() => setDyslexicFont(!dyslexicFont)}
                      className={`w-full py-2 px-3 text-left font-sans text-xs transition-all border flex items-center justify-between cursor-pointer ${
                        dyslexicFont ? "bg-[#eef3ec] border-green-600/60" : "bg-white border-luxury-sand"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-luxury-dark" />
                        <div>
                          <span className="block font-medium">Czcionka przyjazna dysleksji</span>
                          <span className="block text-[9px] text-luxury-dark/50">Zastępuje font szeryfowy czytelnym bezszeryfowym</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={dyslexicFont}
                        readOnly
                        className="pointer-events-none accent-luxury-gold rounded"
                      />
                    </button>

                    {/* Pause Animations */}
                    <button
                      onClick={() => setPauseAnimations(!pauseAnimations)}
                      className={`w-full py-2 px-3 text-left font-sans text-xs transition-all border flex items-center justify-between cursor-pointer ${
                        pauseAnimations ? "bg-[#eef3ec] border-green-600/60" : "bg-white border-luxury-sand"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-luxury-dark" />
                        <div>
                          <span className="block font-medium">Zatrzymaj animacje</span>
                          <span className="block text-[9px] text-luxury-dark/50">Redukuje ruch elementów i płynne przejścia</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pauseAnimations}
                        readOnly
                        className="pointer-events-none accent-luxury-gold rounded"
                      />
                    </button>

                    {/* Large Cursor */}
                    <button
                      onClick={() => setLargeCursor(!largeCursor)}
                      className={`w-full py-2 px-3 text-left font-sans text-xs transition-all border flex items-center justify-between cursor-pointer ${
                        largeCursor ? "bg-[#eef3ec] border-green-600/60" : "bg-white border-luxury-sand"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MousePointer className="w-4 h-4 text-luxury-dark" />
                        <div>
                          <span className="block font-medium">Duży kursor myszy</span>
                          <span className="block text-[9px] text-luxury-dark/50">Ułatwia śledzenie i pozycjonowanie wskaźnika</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={largeCursor}
                        readOnly
                        className="pointer-events-none accent-luxury-gold rounded"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset Controls Button */}
              <div className="mt-4 pt-3 border-t border-luxury-sand/80 flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-white border border-luxury-gold text-luxury-dark hover:bg-luxury-gold hover:text-white transition-colors text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resetuj Ustawienia</span>
                </button>
              </div>

              {/* Informative compliant footer badge */}
              <div className="mt-3 text-center">
                <span className="text-[8px] font-mono tracking-widest text-luxury-dark/50 uppercase block">
                  Zgodność z WCAG 2.1 AA • Slow Skin™
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
