import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  X, 
  Sparkles, 
  BookOpen, 
  Activity, 
  ArrowRight, 
  Minimize2, 
  Maximize2, 
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight
} from "lucide-react";
import { TREATMENTS, ARTICLES } from "../data";
import { Treatment, MagazineArticle } from "../types";

export interface ClinicalProblem {
  name: string;
  description: string;
  keywords: string[];
  treatmentId: string;
}

export const CLINICAL_PROBLEMS: ClinicalProblem[] = [
  {
    name: "Suchość głęboka, odwodnienie i zaburzona bariera",
    description: "Uporczywe ściągnięcie, szorstkość, pieczenie po myciu, deficyt NMF i wysoka ucieczka wody (TEWL).",
    keywords: ["suchość", "suchości", "sucha", "suchej", "odwodnienie", "odwodniona", "przesuszenie", "ściągnięcie", "szorstkość", "łuszczenie", "bariera", "barierowa", "tewl", "pieczenie", "nawilżenie"],
    treatmentId: "amber-regeneration"
  },
  {
    name: "Przygotowanie skóry do regeneracji (Skin Readiness)",
    description: "Audyt barierowy, pomiar TEWL, odbudowa płaszcza lipidowego i przygotowanie do głębokich terapii.",
    keywords: ["przygotowanie", "regeneracja", "readiness", "diagnoza", "pierwsza wizyta", "bariera", "suchość", "suchości", "tewl", "konsultacja"],
    treatmentId: "skin-readiness"
  },
  {
    name: "Zmiany zapalne, grudki, zaskórniki",
    description: "Trądzik pospolity, nadprodukcja sebum, rozszerzone pory, wypryski i zaskórniki.",
    keywords: ["zapalne", "grudki", "zaskórniki", "trądzik", "trądziku", "trądzikowa", "sebum", "pory", "krostki", "wypryski", "łojotok", "acne"],
    treatmentId: "acne-balance-therapy"
  },
  {
    name: "Trądzik dorosłych, skóra stresowa",
    description: "Trądzik późny w strefie U (żuchwa, broda), zmiany pod wpływem kortyzolu i brak snu.",
    keywords: ["dorosłych", "stres", "stresowa", "kortyzol", "żuchwa", "tarda", "neuro", "hormonalny", "trądzik", "trądziku"],
    treatmentId: "adult-acne-therapy"
  },
  {
    name: "Rumień, pieczenie, nadreaktywność",
    description: "Trądzik różowaty (Rosacea), pieczenie, nadwrażliwość na wodę i kosmetyki, uczucie palenia.",
    keywords: ["rumień", "rumienia", "pieczenie", "nadreaktywność", "różowaty", "rosacea", "palenie", "kłucie", "wrażliwa", "reaktywna", "czerwona"],
    treatmentId: "rosacea-calm-therapy"
  },
  {
    name: "Naczynka, teleangiektazje",
    description: "Pęknięte naczynka, pajączki, kruchość naczyniowa i nawracająca gra naczyniowa.",
    keywords: ["naczynka", "naczynek", "naczyniowa", "teleangiektazje", "pajączki", "kruchość", "gra naczyniowa", "czerwona", "rumień"],
    treatmentId: "couperose-therapy"
  },
  {
    name: "Przebarwienia, melasma, nierówny koloryt",
    description: "Plamy posłoneczne, melasma hormonalna, przebarwienia pozapalne (PIH), szary i niejednolity ton.",
    keywords: ["przebarwienia", "przebarwień", "melasma", "koloryt", "plamy", "posłoneczne", "pigmentacja", "pih", "ostuda", "rozjaśnienie"],
    treatmentId: "pigment-balance-therapy"
  },
  {
    name: "Utrata jędrności, owal, gęstość",
    description: "Grawitacyjne opadanie owalu twarzy (chomiki), utrata gęstości, wiotkość i zmarszczki strukturalne.",
    keywords: ["jędrność", "owal", "gęstość", "wiotkość", "wiotkości", "chomiki", "lifting", "zmarszczki", "zmarszczek", "smas", "kolagen"],
    treatmentId: "lift-firm-therapy"
  },
  {
    name: "Skóra zmęczona, szara, odwodniona",
    description: "Skóra miejska (Blue Light, smog), utrata witalności, brak blasku i głębokie odwodnienie naskórka.",
    keywords: ["zmęczona", "szara", "odwodniona", "odwodnienie", "blask", "glow", "tlen", "bursztynowy", "miejska", "smog", "suchość"],
    treatmentId: "healthy-glow-therapy"
  }
];

export interface SkinSearchPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onSelectTreatment: (treatment: Treatment) => void;
  onSelectArticle: (article: MagazineArticle) => void;
  onStartDiagnostics?: () => void;
  onViewAllTreatments?: () => void;
}

export const getPolishQueryVariants = (rawQuery: string): string[] => {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return [];
  const variants = new Set<string>([q]);

  if (q.includes("such") || q.includes("odwodn") || q.includes("bariera") || q.includes("tewl") || q.includes("ściągn") || q.includes("łuszcz")) {
    ["sucho", "sucha", "suchość", "suchości", "suche", "suchej", "odwodn", "odwodnienie", "odwodniona", "przesusz", "przesuszenie", "przesuszona", "ściągnięc", "szorstk", "łuszczen", "tewl", "bariera", "barierow", "płaszcz"].forEach(w => variants.add(w));
  }
  if (q.includes("zmarszcz") || q.includes("wiotk") || q.includes("owal") || q.includes("lifting") || q.includes("chomik") || q.includes("kolagen")) {
    ["zmarszcz", "zmarszczk", "wiotk", "wiotkości", "zwiotcz", "owal", "chomik", "jędrno", "gęsto", "lifting", "smas", "kolagen", "elastyn", "slow aging", "bruzdy"].forEach(w => variants.add(w));
  }
  if (q.includes("trądz") || q.includes("acne") || q.includes("zaskór") || q.includes("krost") || q.includes("wyprysk") || q.includes("sebum")) {
    ["trądz", "trądzik", "trądziku", "trądzikowa", "acne", "zaskór", "krost", "wyprysk", "sebum", "por", "łojotok", "zapalne", "grudk", "strefa u"].forEach(w => variants.add(w));
  }
  if (q.includes("naczyn") || q.includes("rumien") || q.includes("rumień") || q.includes("rosacea") || q.includes("różow") || q.includes("pającz") || q.includes("teleang")) {
    ["naczyn", "naczynek", "naczyniowa", "teleang", "pającz", "krucho", "rumień", "rumien", "rosacea", "różow", "czerwon", "zaczerwien", "gra naczyniow", "pieczen"].forEach(w => variants.add(w));
  }
  if (q.includes("przebarw") || q.includes("melasm") || q.includes("plam") || q.includes("pigment") || q.includes("koloryt")) {
    ["przebarw", "przebarwień", "melasm", "plam", "pigment", "pih", "koloryt", "posłonecz", "rozjaśn", "ostuda", "hiperpigmentacj"].forEach(w => variants.add(w));
  }
  if (q.includes("wiotk")) {
    ["wiotk", "wiotkości", "zwiotcz", "owal", "chomiki", "jędrność", "gęstość", "lifting", "smas"].forEach(w => variants.add(w));
  }

  // General Polish word trimming
  if (q.length >= 4) {
    variants.add(q.slice(0, -1));
    if (q.endsWith("ość")) variants.add(q.slice(0, -3));
  }

  return Array.from(variants);
};

export const QUICK_TAGS = [
  "suchość",
  "zmarszczki",
  "trądzik",
  "naczynka",
  "wiotkość",
  "przebarwienia",
  "rumień"
];

export const SkinSearchPopupModal: React.FC<SkinSearchPopupModalProps> = ({
  isOpen,
  onClose,
  onMinimize,
  searchQuery,
  onSearchQueryChange,
  onSelectTreatment,
  onSelectArticle,
  onStartDiagnostics,
  onViewAllTreatments,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"treatments" | "problems" | "articles">("treatments");

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onMinimize();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onMinimize]);

  // Memoized Polish query variants
  const variants = useMemo(() => {
    return getPolishQueryVariants(searchQuery);
  }, [searchQuery]);

  // Calculate matched treatments with intelligent relevance weighting
  const matchedTreatments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    const scoreTreatment = (t: typeof TREATMENTS[0]): number => {
      let score = 0;
      const title = t.title.toLowerCase();
      const sub = t.subtitle.toLowerCase();
      const focus = (t.focus || "").toLowerCase();
      const ind = (t.indications || []).join(" ").toLowerCase();
      const desc = (t.description || "").toLowerCase();

      // Direct query match
      if (title.includes(query)) score += 60;
      if (sub.includes(query)) score += 40;
      if (focus.includes(query)) score += 30;
      if (ind.includes(query)) score += 25;
      if (desc.includes(query)) score += 10;

      // Concern-specific priority ranking
      if (query.includes("such") || query.includes("odwodn") || query.includes("bariera")) {
        if (t.id === "skin-readiness") score += 55;
        if (t.id === "amber-regeneration") score += 50;
        if (t.id === "healthy-glow-therapy") score += 45;
        if (t.id === "oksybrazja-infuzja-tlenowa" || t.id === "oxybrasion") score += 42;
        if (t.id === "epigenetic-aging") score += 40;
        if (t.id === "bespoke-ceremony") score += 38;
        if (t.id === "autumn-reset") score += 35;
      }
      if (query.includes("zmarszcz") || query.includes("wiotk") || query.includes("lifting")) {
        if (t.id === "epigenetic-aging") score += 55;
        if (t.id === "lift-firm-therapy") score += 50;
        if (t.id === "meso-remodeling" || t.id === "how_help_meso_remodeling") score += 45;
      }
      if (query.includes("trądz") || query.includes("acne") || query.includes("zaskór")) {
        if (t.id === "acne-balance-therapy") score += 55;
        if (t.id === "adult-acne-therapy") score += 50;
      }
      if (query.includes("naczyn") || query.includes("rumien") || query.includes("rosacea")) {
        if (t.id === "rosacea-calm-therapy") score += 55;
        if (t.id === "couperose-therapy") score += 50;
      }
      if (query.includes("przebarw") || query.includes("melasm") || query.includes("plam")) {
        if (t.id === "pigment-balance-therapy") score += 55;
      }

      for (const v of variants) {
        if (title.includes(v)) score += 20;
        if (sub.includes(v)) score += 14;
        if (focus.includes(v)) score += 10;
        if (ind.includes(v)) score += 8;
        if (desc.includes(v)) score += 3;
      }

      return score;
    };

    return TREATMENTS
      .map(t => ({ treatment: t, score: scoreTreatment(t) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.treatment)
      .slice(0, 12);
  }, [searchQuery, variants]);

  // Calculate matched clinical problems
  const matchedProblems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    return CLINICAL_PROBLEMS.filter((prob) => {
      const text = (prob.name + " " + prob.description + " " + prob.keywords.join(" ")).toLowerCase();
      return variants.some(v => text.includes(v));
    }).slice(0, 4);
  }, [searchQuery, variants]);

  // Calculate matched magazine articles (guaranteed rich editorial content)
  const matchedArticles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    const directMatches = ARTICLES.filter((art) => {
      const artText = (
        art.title + " " +
        art.category + " " +
        art.lead + " " +
        art.quote + " " +
        (art.content ? art.content.join(" ") : "") + " " +
        (art.sections ? art.sections.map(s => s.heading + " " + s.paragraphs.join(" ")).join(" ") : "")
      ).toLowerCase();

      return variants.some(v => artText.includes(v));
    });

    if (directMatches.length < 2) {
      const fallbackArticles = ARTICLES.filter(a => !directMatches.some(m => m.id === a.id));
      return [...directMatches, ...fallbackArticles].slice(0, 4);
    }
    return directMatches.slice(0, 6);
  }, [searchQuery, variants]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#04251F]/70 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fadeIn"
      id="skin-search-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Panel Rekomendacji Terapeutycznych Slow Skin Concept"
    >
      {/* Outer Click Backdrop */}
      <div 
        className="absolute inset-0 -z-10 cursor-pointer"
        onClick={onMinimize}
        title="Kliknij, aby zminimalizować panel"
      />

      {/* Main Popup Window */}
      <div 
        className={`bg-[#FAF8F5] border border-luxury-sand/80 shadow-[0_30px_90px_rgba(0,0,0,0.40)] flex flex-col overflow-hidden text-left relative transition-all duration-300 ${
          isMaximized 
            ? "fixed inset-0 w-full h-full max-w-none max-h-none rounded-none m-0" 
            : "w-full max-w-7xl h-[94vh] max-h-[960px] rounded-none m-auto"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-white/95 border-b border-luxury-sand/70 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-luxury-gold animate-pulse shrink-0"></span>
            <div className="min-w-0">
              <span className="font-serif tracking-[0.12em] text-xs sm:text-sm font-semibold uppercase text-luxury-dark truncate block">
                Slow Skin Concept<span className="text-[10px] text-luxury-gold ml-0.5">TM</span>
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-luxury-dark/60 uppercase tracking-widest block truncate">
                Rekomendacje Bionomiczne & Audyt Skóry
              </span>
            </div>
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Toggle Fullscreen / Window */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 sm:px-2.5 sm:py-1 text-luxury-dark/70 hover:text-luxury-gold hover:bg-luxury-sand/20 border border-luxury-sand/60 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              title={isMaximized ? "Przywróć okno modalne" : "Rozwiń na pełny ekran"}
            >
              {isMaximized ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline text-[10px] uppercase font-medium">Tryb okna</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline text-[10px] uppercase font-medium">Pełny ekran</span>
                </>
              )}
            </button>

            {/* Minimize button (returns to compact Hero state) */}
            <button
              onClick={onMinimize}
              className="p-1.5 sm:px-2.5 sm:py-1 text-luxury-dark/70 hover:text-luxury-gold hover:bg-luxury-sand/20 border border-luxury-sand/60 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              title="Zminimalizuj panel do paska na stronie"
            >
              <Minimize2 className="w-3.5 h-3.5 rotate-90" />
              <span className="hidden sm:inline text-[10px] uppercase font-medium">Minimalizuj</span>
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                onClose();
              }}
              className="p-1.5 sm:px-3 sm:py-1 bg-luxury-dark hover:bg-luxury-gold text-white transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-xs font-semibold"
              title="Zamknij panel (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Zamknij</span>
            </button>
          </div>
        </div>

        {/* Search Input & Quick Tags Row inside Popup */}
        <div className="bg-[#FAF8F5] border-b border-luxury-sand/70 px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 shrink-0 shadow-2xs">
          <div className="max-w-4xl mx-auto space-y-2.5">
            {/* Live Search Input */}
            <div className="relative rounded-none overflow-hidden bg-white border border-luxury-sand focus-within:border-luxury-gold focus-within:ring-1 focus-within:ring-luxury-gold/20 shadow-xs flex items-center px-3.5 py-2">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-luxury-gold shrink-0 mr-3" strokeWidth={1.75} />
              <input
                type="text"
                autoFocus
                placeholder="Wpisz problem lub potrzebę skóry (np. suchość, rumień, zmarszczki, bariera)..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full bg-transparent border-none text-sm sm:text-base text-luxury-dark placeholder:text-luxury-dark/50 font-serif italic focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchQueryChange("")}
                  className="text-luxury-dark/50 hover:text-luxury-gold p-1 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  title="Wyczyść zapytanie"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Wyczyść</span>
                </button>
              )}
            </div>

            {/* Quick Chips Row */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-mono uppercase tracking-wider text-luxury-dark/70">
              <span className="text-luxury-dark font-bold text-[10px]">Szybki wybór:</span>
              {QUICK_TAGS.map((tag) => {
                const isActive = searchQuery.toLowerCase().trim() === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => onSearchQueryChange(tag)}
                    className={`px-2 py-0.5 transition-all cursor-pointer font-medium text-[10px] ${
                      isActive
                        ? "bg-luxury-gold text-white font-bold shadow-2xs"
                        : "bg-white hover:bg-luxury-gold/15 text-[#7A571E] border border-luxury-sand/60"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Results Counters Summary */}
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-mono uppercase tracking-wider">
              <span className="text-luxury-dark/60 text-[11px]">Dopasowanie dla:</span>
              <span className="font-bold text-luxury-dark font-serif italic text-sm normal-case tracking-normal">
                „{searchQuery || "Wszystkie procedury"}”
              </span>
              <span className="text-luxury-sand">&bull;</span>
              <span className="text-[10px] bg-luxury-gold/15 text-luxury-gold px-2.5 py-0.5 font-bold border border-luxury-gold/20">
                {matchedTreatments.length} {matchedTreatments.length === 1 ? "Rytuał" : matchedTreatments.length < 5 ? "Rytuały" : "Rytuałów"}
              </span>
              <span className="text-[10px] bg-luxury-dark/10 text-luxury-dark px-2.5 py-0.5 border border-luxury-sand/80">
                {matchedArticles.length} {matchedArticles.length === 1 ? "Publikacja" : matchedArticles.length < 5 ? "Publikacje" : "Publikacji"}
              </span>
              {matchedProblems.length > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 border border-emerald-200 hidden sm:inline-block">
                  {matchedProblems.length} profile diagnozy
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile View Tab Selector (visible on small screens) */}
        <div className="lg:hidden flex border-b border-luxury-sand/70 bg-white shrink-0">
          <button
            onClick={() => setActiveMobileTab("treatments")}
            className={`flex-1 py-2.5 text-center font-mono text-[11px] uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMobileTab === "treatments"
                ? "border-luxury-gold text-luxury-gold bg-luxury-cream/40"
                : "border-transparent text-luxury-dark/60 hover:text-luxury-dark"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rytuały ({matchedTreatments.length})</span>
          </button>
          <button
            onClick={() => setActiveMobileTab("problems")}
            className={`flex-1 py-2.5 text-center font-mono text-[11px] uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMobileTab === "problems"
                ? "border-luxury-gold text-luxury-gold bg-luxury-cream/40"
                : "border-transparent text-luxury-dark/60 hover:text-luxury-dark"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diagnoza ({matchedProblems.length})</span>
          </button>
          <button
            onClick={() => setActiveMobileTab("articles")}
            className={`flex-1 py-2.5 text-center font-mono text-[11px] uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMobileTab === "articles"
                ? "border-luxury-gold text-luxury-gold bg-luxury-cream/40"
                : "border-transparent text-luxury-dark/60 hover:text-luxury-dark"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Magazyn ({matchedArticles.length})</span>
          </button>
        </div>

        {/* Main Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-luxury-sand/60">
            
            {/* COLUMN 1: Clinical Problems & Barrier Diagnosis */}
            <div className={`lg:col-span-3 pr-0 lg:pr-4 space-y-4 ${
              activeMobileTab !== "problems" ? "hidden lg:block" : "block"
            }`}>
              <div className="font-mono text-xs tracking-widest text-luxury-gold uppercase font-bold border-b border-luxury-sand/80 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-luxury-gold" />
                  <span>Rozpoznany Profil</span>
                </div>
                <span className="text-[10px] text-luxury-dark/60 font-sans normal-case">Diagnoza bionomiczna</span>
              </div>

              {matchedProblems.length > 0 ? (
                <div className="space-y-3">
                  {matchedProblems.map((prob, idx) => {
                    const treatment = TREATMENTS.find(t => t.id === prob.treatmentId);
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (treatment) {
                            onSelectTreatment(treatment);
                          }
                        }}
                        className="group cursor-pointer p-3.5 bg-white hover:bg-luxury-cream/40 border border-luxury-sand/70 hover:border-luxury-gold transition-all duration-200 shadow-2xs hover:shadow-sm"
                      >
                        <p className="text-xs sm:text-sm font-serif font-bold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                          <span>{prob.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-luxury-gold opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-1.5" />
                        </p>
                        <p className="text-[11px] text-luxury-dark/75 mt-1.5 leading-relaxed font-sans">
                          {prob.description}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-luxury-sand/40 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-luxury-gold font-bold uppercase tracking-wider">
                            Rekomendowany rytuał:
                          </span>
                          <span className="text-luxury-dark font-medium underline">
                            {treatment ? treatment.title.split("—")[0] : "Sprawdź"} &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-white/70 border border-luxury-sand/50 text-center space-y-2">
                  <p className="text-xs italic text-luxury-dark/70 font-serif">
                    Potrzebujesz precyzyjnej oceny kondycji swojej skóry?
                  </p>
                  {onStartDiagnostics && (
                    <button
                      onClick={onStartDiagnostics}
                      className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold font-bold hover:underline block mx-auto cursor-pointer"
                    >
                      Uruchom audyt barierowy online &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* Consultation Callout Box */}
              <div className="p-3.5 bg-[#F6F2EA] border border-luxury-gold/30 space-y-2 text-left">
                <div className="flex items-center gap-1.5 text-luxury-gold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Filozofia Slow Skin</span>
                </div>
                <p className="text-[11px] text-luxury-dark/80 leading-relaxed font-sans">
                  Nigdy nie stymulujemy skóry z uszkodzoną barierą. Najpierw odbudowujemy spójność naskórka i równowagę NMF, potem wprowadzamy głębokie procedury remodelujące.
                </p>
              </div>
            </div>

            {/* COLUMN 2: Matched Treatments (Star Exposition - Full Cards) */}
            <div className={`lg:col-span-5 px-0 lg:px-4 space-y-4 pt-4 lg:pt-0 ${
              activeMobileTab !== "treatments" ? "hidden lg:block" : "block"
            }`}>
              <div className="font-mono text-xs tracking-widest text-luxury-gold uppercase font-bold border-b border-luxury-sand/80 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-luxury-gold" />
                  <span>Dopasowane Rytuały ({matchedTreatments.length})</span>
                </div>
                <span className="text-[10px] text-luxury-gold font-semibold uppercase tracking-wider">
                  Pełna oferta gabinetowa
                </span>
              </div>

              {matchedTreatments.length > 0 ? (
                <div className="space-y-3.5">
                  {matchedTreatments.map((treatment) => (
                    <div
                      key={treatment.id}
                      onClick={() => onSelectTreatment(treatment)}
                      className="group cursor-pointer p-4 bg-white hover:bg-[#FAF8F5] border border-luxury-sand/70 hover:border-luxury-gold transition-all duration-200 shadow-xs hover:shadow-md flex flex-col sm:flex-row items-start gap-4"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-full sm:w-24 h-28 sm:h-24 shrink-0 bg-luxury-cream border border-luxury-sand/50 overflow-hidden relative">
                        {treatment.image ? (
                          <img 
                            src={treatment.image} 
                            alt={treatment.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-luxury-sand/20" />
                        )}
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-serif font-bold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                            {treatment.title}
                          </p>
                          <ArrowRight className="w-4 h-4 text-luxury-gold shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all hidden sm:block" />
                        </div>

                        <p className="text-[10px] text-luxury-gold uppercase font-mono tracking-wider font-semibold mt-0.5">
                          {treatment.subtitle}
                        </p>

                        {/* Badges for Duration & Price */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-mono bg-luxury-sand/25 px-2 py-0.5 text-luxury-dark/80 font-medium">
                            <Clock className="w-3 h-3 inline mr-1 text-luxury-gold" />
                            {treatment.duration}
                          </span>
                          <span className="text-[10px] font-mono bg-luxury-gold/15 text-luxury-gold px-2 py-0.5 font-bold border border-luxury-gold/25">
                            {treatment.price}
                          </span>
                          {treatment.focus && (
                            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200/60 hidden sm:inline-block">
                              {treatment.focus}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-luxury-dark/75 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                          {treatment.description}
                        </p>

                        {/* Indications Preview */}
                        {treatment.indications && treatment.indications.length > 0 && (
                          <p className="text-[10px] text-luxury-dark/60 line-clamp-1 mt-1 font-mono italic">
                            Wskazania: {treatment.indications.slice(0, 3).join(" · ")}
                          </p>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-luxury-sand/40 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-wider font-bold group-hover:underline flex items-center gap-1">
                            Poznaj szczegóły rytuału & Umów wizytę &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white/70 border border-luxury-sand/50 text-center space-y-3">
                  <p className="text-sm italic text-luxury-dark/70 font-serif">
                    Nie znaleziono bezpośrednich dopasowań dla tego hasła.
                  </p>
                  {onViewAllTreatments && (
                    <button
                      onClick={onViewAllTreatments}
                      className="px-4 py-2 bg-luxury-gold text-white text-[11px] font-mono uppercase tracking-widest font-bold hover:bg-luxury-dark transition-colors cursor-pointer"
                    >
                      Przejdź do pełnego Menu Rytuałów
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* COLUMN 3: Knowledge & Magazine Publications */}
            <div className={`lg:col-span-4 pl-0 lg:pl-4 space-y-4 pt-4 lg:pt-0 ${
              activeMobileTab !== "articles" ? "hidden lg:block" : "block"
            }`}>
              <div className="font-mono text-xs tracking-widest text-luxury-gold uppercase font-bold border-b border-luxury-sand/80 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-luxury-gold" />
                  <span>Wiedza & Magazyn ({matchedArticles.length})</span>
                </div>
                <span className="text-[10px] text-luxury-dark/60 font-sans normal-case">
                  Publikacje naukowe
                </span>
              </div>

              {matchedArticles.length > 0 ? (
                <div className="space-y-3.5">
                  {matchedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => onSelectArticle(art)}
                      className="group cursor-pointer p-4 bg-white hover:bg-[#FAF8F5] border border-luxury-sand/70 hover:border-luxury-gold transition-all duration-200 shadow-xs hover:shadow-md flex items-start gap-3.5"
                    >
                      {/* Thumbnail if available */}
                      {art.image && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-luxury-cream border border-luxury-sand/50 overflow-hidden relative">
                          <img 
                            src={art.image} 
                            alt={art.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[9px] font-mono text-luxury-gold uppercase tracking-widest font-bold">
                            {art.category}
                          </span>
                          <span className="text-[9px] font-mono text-luxury-dark/50">
                            {art.readingTime}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-serif italic text-luxury-dark group-hover:text-luxury-gold transition-colors line-clamp-2 leading-snug mt-1 font-medium">
                          „{art.title}”
                        </p>

                        <p className="text-[11px] text-luxury-dark/70 line-clamp-2 mt-1 leading-relaxed font-sans">
                          {art.lead}
                        </p>

                        <div className="mt-2 text-[10px] font-mono text-luxury-gold uppercase tracking-wider font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Czytaj publikację w Magazynie</span>
                          <span>&rarr;</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white/70 border border-luxury-sand/50 text-center">
                  <p className="text-xs italic text-luxury-dark/70 font-serif">
                    Odkryj wszystkie publikacje w Magazynie Slow Skin.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="bg-[#FAF8F5] border-t border-luxury-sand/70 px-4 sm:px-6 md:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wider text-luxury-dark/80 shrink-0">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
            <span className="text-[10px] sm:text-[11px]">
              Wszystkie procedury realizowane są w autorskim standardzie bionomicznym z audytem barierowym
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
            {onViewAllTreatments && (
              <button
                onClick={onViewAllTreatments}
                className="px-3 py-1.5 border border-luxury-sand bg-white hover:bg-luxury-gold/15 text-luxury-dark text-[10px] transition-colors cursor-pointer font-medium"
              >
                Pełne Menu Rytuałów &rarr;
              </button>
            )}
            {onStartDiagnostics && (
              <button
                onClick={onStartDiagnostics}
                className="px-3.5 py-1.5 bg-luxury-gold hover:bg-luxury-dark text-white text-[10px] transition-colors cursor-pointer font-bold shadow-xs tracking-wider"
              >
                Audyt Biorównowagi &rarr;
              </button>
            )}
            <button
              onClick={onMinimize}
              className="px-3 py-1.5 text-luxury-dark/70 hover:text-luxury-dark text-[10px] transition-colors cursor-pointer underline"
            >
              Zminimalizuj do strony
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
