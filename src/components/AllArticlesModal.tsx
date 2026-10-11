import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, X, ChevronRight, Clock, Sparkles, Filter, ArrowUpRight } from "lucide-react";
import { ARTICLES } from "../data";
import { MagazineArticle } from "../types";

interface AllArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: MagazineArticle) => void;
  onOpenFullJournal: (category?: string) => void;
}

const CATEGORIES = [
  { key: "ALL", label: "Wszystkie artykuły" },
  { key: "SUCHOŚĆ & BARIERA", label: "Suchość & Bariera" },
  { key: "SLOW AGING", label: "Slow Aging" },
  { key: "TRĄDZIK & MIKROBIOM", label: "Trądzik & Mikrobiom" },
  { key: "NACZYNKA & RUMIEŃ", label: "Naczynka & Rumień" },
  { key: "PRZEBARWIENIA", label: "Przebarwienia" },
  { key: "NEUROBIOLOGIA", label: "Neurobiologia" },
  { key: "FILOZOFIA", label: "Filozofia" },
  { key: "FIZJOLOGIA", label: "Fizjologia" },
];

export const AllArticlesModal: React.FC<AllArticlesModalProps> = ({
  isOpen,
  onClose,
  onSelectArticle,
  onOpenFullJournal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedCat("ALL");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      const matchesCategory =
        selectedCat === "ALL" || art.category === selectedCat;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.lead.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCat, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-luxury-dark/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-luxury-cream border border-luxury-sand shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-luxury-sand/50 bg-white/70 flex items-start justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-luxury-gold" />
                  Edukacja & Diagnoza • Centrum Publikacji
                </span>
                <span className="font-mono text-[9px] bg-luxury-gold/15 text-luxury-dark px-2 py-0.5 font-semibold">
                  {ARTICLES.length} Publikacji
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark tracking-tight">
                Kompletna Baza Wiedzy i Publikacje Naukowe
              </h2>
              <p className="text-xs text-luxury-dark/80 font-light leading-relaxed max-w-2xl">
                Dostęp do wszystkich artykułów z sekcji Edukacja & Diagnoza z jednego miejsca. Autorskie publikacje Katarzyny Brzezińskiej poświęcone fizjologii skóry, odbudowie bariery i regeneracji komórkowej.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-luxury-dark/60 hover:text-luxury-dark hover:bg-luxury-sand/20 transition-colors cursor-pointer shrink-0"
              aria-label="Zamknij okno artykułów"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="px-6 py-4 sm:px-8 border-b border-luxury-sand/30 bg-white/40 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-luxury-gold/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj publikacji: bariera, trądzik, slow-aging, naczynka, kortyzol..."
                className="w-full pl-10 pr-9 py-2 bg-white border border-luxury-sand/60 text-xs text-luxury-dark placeholder-luxury-dark/45 focus:outline-none focus:border-luxury-gold transition-colors font-light"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-dark/40 hover:text-luxury-dark text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] font-mono uppercase tracking-wider text-luxury-dark/50 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-luxury-gold" /> Filtruj:
              </span>
              {CATEGORIES.map((cat) => {
                const count =
                  cat.key === "ALL"
                    ? ARTICLES.length
                    : ARTICLES.filter((a) => a.category === cat.key).length;
                const isActive = selectedCat === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCat(cat.key)}
                    className={`text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 border transition-all cursor-pointer ${
                      isActive
                        ? "bg-luxury-dark text-white border-luxury-dark font-medium shadow-2xs"
                        : "bg-white/80 text-luxury-dark/80 border-luxury-sand/60 hover:border-luxury-gold hover:text-luxury-dark"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`ml-1 text-[8px] ${
                        isActive ? "text-luxury-gold" : "text-luxury-dark/50"
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Articles Grid / List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="py-16 text-center space-y-3 border border-dashed border-luxury-sand/60 bg-white/30">
                <p className="font-serif italic text-sm text-luxury-dark/80">
                  Nie znaleziono publikacji odpowiadających kryteriom wyszukiwania.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCat("ALL");
                  }}
                  className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold hover:underline border border-luxury-sand px-3 py-1 bg-white cursor-pointer"
                >
                  Wyczyść filtry i pokaż wszystkie 8 artykułów
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article)}
                    className="p-5 bg-white border border-luxury-sand/50 hover:border-luxury-gold transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between group text-left"
                  >
                    <div className="space-y-2.5">
                      {/* Meta: Category & Reading Time */}
                      <div className="flex items-center justify-between text-[9px] font-mono text-luxury-gold tracking-widest">
                        <span className="uppercase font-semibold px-1.5 py-0.5 bg-luxury-sand/20 border border-luxury-sand/40">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-luxury-dark/70">
                          <Clock className="w-3 h-3 text-luxury-gold" />
                          {article.readingTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg font-normal text-luxury-dark group-hover:text-luxury-gold transition-colors leading-snug">
                        {article.title}
                      </h3>

                      {/* Lead */}
                      <p className="text-xs text-luxury-dark/80 font-light leading-relaxed line-clamp-2">
                        {article.lead}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-3 mt-4 border-t border-luxury-sand/30 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-luxury-dark/60 italic">
                        {article.author}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold group-hover:text-luxury-dark font-semibold flex items-center gap-1 transition-colors">
                        Czytaj publikację
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 sm:px-8 border-t border-luxury-sand/50 bg-white/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-luxury-dark/70 font-light text-center sm:text-left">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
              <span>
                Wszystkie publikacje oparte są na fizjologii i autorskim podejściu Slow Skin Concept.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => onOpenFullJournal(selectedCat)}
                className="flex-1 sm:flex-none px-4 py-2 bg-luxury-dark text-white hover:bg-luxury-gold transition-colors text-[10px] font-mono uppercase tracking-widest font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Otwórz Pełny Magazyn Wiedzy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-luxury-sand hover:border-luxury-dark text-luxury-dark transition-colors text-[10px] font-mono uppercase tracking-widest cursor-pointer"
              >
                Zamknij
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
