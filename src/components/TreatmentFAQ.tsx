import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle, Search, X, Link, Check, ArrowUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface TreatmentFAQProps {
  faqList: FAQItem[];
}

// Convert question text to an URL-safe anchor slug
const getQuestionId = (question: string) => {
  return "faq-" + question
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const TreatmentFAQ = React.memo(function TreatmentFAQ({ faqList }: TreatmentFAQProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("WSZYSTKIE");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [questionsRead, setQuestionsRead] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const filteredFaq = useMemo(() => {
    return faqList.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "WSZYSTKIE" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [faqList, searchQuery, selectedCategory]);

  const toggleAccordion = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // Scroll to active FAQ hash element on mount or path change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const questionId = hash.replace("#", "");
        const foundIndex = faqList.findIndex(
          (item) => getQuestionId(item.question) === questionId
        );
        if (foundIndex !== -1) {
          setActiveIndex(foundIndex);
          // Small delay to ensure render is completed and container expanded
          setTimeout(() => {
            const element = document.getElementById(questionId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 500);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [faqList]);

  // Handle window scroll behavior for showing "Back to top", calculating list progress and read questions counts with high-performance throttling and viewport optimization to prevent layout thrashing (which is critical during page translation)
  useEffect(() => {
    let lastScrollTime = 0;
    let scrollTimeout: any = null;

    const runScrollLogic = () => {
      if (typeof window === "undefined") return;

      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const sectionElement = document.getElementById("treatment-faq-section");
      if (sectionElement && filteredFaq.length > 0) {
        const rect = sectionElement.getBoundingClientRect();
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Skip calculations if the FAQ section is entirely out of view
        if (rect.bottom < 0 || rect.top > windowHeight) {
          return;
        }

        const totalScrollableDistance = sectionHeight - windowHeight;
        if (totalScrollableDistance > 0) {
          const scrolled = -rect.top;
          const progress = Math.min(Math.max((scrolled / totalScrollableDistance) * 100, 0), 100);
          setScrollProgress(progress);
        } else {
          if (rect.top < 0) {
            setScrollProgress(100);
          } else if (rect.top > windowHeight) {
            setScrollProgress(0);
          } else {
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            setScrollProgress(Math.min(Math.max((visibleHeight / sectionHeight) * 100, 0), 100));
          }
        }

        // Determine how many questions the user has scrolled past
        let readCount = 0;
        filteredFaq.forEach((item) => {
          const elementId = getQuestionId(item.question);
          const el = document.getElementById(elementId);
          if (el) {
            const qRect = el.getBoundingClientRect();
            // Count as read if the top of this item has crossed past 45% of viewport height
            if (qRect.top < windowHeight * 0.45) {
              readCount++;
            }
          }
        });
        setQuestionsRead(readCount);
      } else {
        setQuestionsRead(0);
        setScrollProgress(0);
      }
    };

    const handleScrollThrottled = () => {
      const now = Date.now();
      if (now - lastScrollTime >= 150) {
        lastScrollTime = now;
        runScrollLogic();
      } else {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          lastScrollTime = Date.now();
          runScrollLogic();
        }, 150);
      }
    };

    window.addEventListener("scroll", handleScrollThrottled, { passive: true });
    window.addEventListener("resize", handleScrollThrottled, { passive: true });
    
    // Initial and delayed trigger to ensure DOM is settled
    runScrollLogic();
    const delayTimer = setTimeout(runScrollLogic, 100);

    return () => {
      window.removeEventListener("scroll", handleScrollThrottled);
      window.removeEventListener("resize", handleScrollThrottled);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      clearTimeout(delayTimer);
    };
  }, [filteredFaq, activeIndex]);

  if (!faqList || faqList.length === 0) return null;

  const scrollToTop = () => {
    const element = document.getElementById("treatment-faq-section");
    if (element) {
      const rect = element.getBoundingClientRect();
      // Jeśli początek sekcji FAQ jest blisko góry lub poniżej, przewijamy całą stronę do góry.
      // W przeciwnym razie wracamy do początku sekcji FAQ.
      if (rect.top >= -100) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCopyLink = (question: string) => {
    const qId = getQuestionId(question);
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const shareUrl = `${origin}${pathname}${search}#${qId}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopiedQuestion(question);
        setTimeout(() => {
          setCopiedQuestion(null);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  // Extract unique categories dynamically
  const uniqueCategories = Array.from(
    new Set(faqList.map((item) => item.category).filter((c): c is string => !!c))
  );
  const categories = ["WSZYSTKIE", ...uniqueCategories];

  return (
    <div className="bg-white border border-luxury-sand p-8 md:p-12 space-y-8 relative" id="treatment-faq-section">
      {/* Sticky Quiet Luxury Reading Progress Bar */}
      {filteredFaq.length > 0 && (
        <div className="sticky top-[60px] sm:top-[68px] md:top-[72px] lg:top-[76px] z-20 bg-white/95 backdrop-blur-md py-3 px-4 md:px-6 border-b border-luxury-sand/35 -mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-medium">
              Postęp Czytania:
            </span>
            <span className="font-serif text-xs text-luxury-dark font-normal flex items-center gap-1 flex-wrap">
              <span>Przeczytano</span>
              <strong className="font-semibold text-luxury-dark notranslate">{questionsRead}</strong>
              <span>z</span>
              <strong className="font-semibold text-luxury-dark notranslate">{filteredFaq.length}</strong>
              <span>pytań</span>
            </span>
            {filteredFaq.length - questionsRead > 0 ? (
              <span className="font-mono text-[8px] tracking-wider text-luxury-dark/90 bg-luxury-sand/20 px-1.5 py-0.5 ml-1 flex items-center gap-1">
                <span>Zostało:</span>
                <span className="notranslate">{filteredFaq.length - questionsRead}</span>
              </span>
            ) : (
              <span className="font-mono text-[8px] tracking-wider text-green-700 bg-green-50 px-1.5 py-0.5 ml-1 font-semibold border border-green-200 uppercase tracking-[0.15em] animate-pulse">
                Ukończono! ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xs sm:justify-end w-full">
            <div className="w-full bg-luxury-sand/30 h-[3px] overflow-hidden relative">
              <motion.div 
                className="bg-luxury-gold h-full origin-left"
                initial={{ width: 0 }}
                animate={{ width: `${(questionsRead / filteredFaq.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                style={{ width: `${(questionsRead / filteredFaq.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-luxury-gold font-semibold select-none min-w-[32px] text-right notranslate">
              {Math.round((questionsRead / filteredFaq.length) * 100)}%
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-luxury-sand/40">
        <div className="space-y-2 text-left">
          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-luxury-gold" /> Najczęściej Zadawane Pytania (FAQ)
          </span>
          <h3 className="font-serif text-2xl font-light text-luxury-dark">Wątpliwości i Wyjaśnienia</h3>
          <p className="text-xs text-luxury-dark/90 font-light max-w-xl">
            Poznaj odpowiedzi na najczęstsze pytania naszych klientek dotyczące przebiegu, odczuć, rekonwalescencji oraz przygotowania do tego konkretnego rytuału.
          </p>
        </div>

        {/* Realtime Search Input Field in Quiet Luxury Style */}
        <div className="w-full md:w-80 relative" id="faq-search-container">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveIndex(null); // Reset open accordion on filter change
              }}
              placeholder="Szukaj pytań (np. ból, czas)..."
              className="w-full bg-luxury-cream/30 border border-luxury-sand/80 px-4 py-3 pl-10 pr-10 text-xs font-mono tracking-wider text-luxury-dark placeholder-luxury-dark/40 focus:outline-none focus:border-luxury-gold transition-all duration-300"
              id="faq-search-input"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-dark/90" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveIndex(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-luxury-dark/90 hover:text-luxury-gold transition-colors focus:outline-none"
                title="Wyczyść wyszukiwanie"
                id="faq-clear-search-btn"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="absolute -bottom-5 right-1 font-mono text-[8px] tracking-wider text-luxury-dark/90">
            Dopasowano: {filteredFaq.length} z {faqList.length}
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      {uniqueCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-b border-luxury-sand/10 pb-4" id="faq-category-filters">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveIndex(null); // Reset open accordion on category change
                }}
                className={`px-4 py-2 font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-luxury-gold text-white border-luxury-gold shadow-sm font-medium"
                    : "bg-transparent text-luxury-dark/95 border-luxury-sand hover:border-luxury-gold/60 hover:text-luxury-gold"
                }`}
                id={`faq-cat-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-4 max-w-4xl pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + "_" + (searchQuery ? "filtered" : "all")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-4"
          >
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item, index) => {
                const isOpen = activeIndex === index;
                return (
                  <motion.div 
                    layout="position"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ 
                      opacity: { duration: 0.25 },
                      y: { type: "spring", stiffness: 350, damping: 30 },
                      layout: { type: "spring", stiffness: 350, damping: 30 }
                    }}
                    key={getQuestionId(item.question)} 
                    id={getQuestionId(item.question)}
                    className={`border border-luxury-sand/60 transition-all duration-300 scroll-mt-28 ${
                      isOpen ? "bg-luxury-cream/10 border-luxury-gold shadow-sm" : "bg-white hover:border-luxury-gold/50"
                    }`}
                  >
                    <div
                      id={`faq-trigger-${index}`}
                      onClick={() => toggleAccordion(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleAccordion(index);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 cursor-pointer focus:outline-none select-none focus-visible:ring-1 focus-visible:ring-luxury-gold"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-2.5 flex-1">
                        {item.category && (
                          <span 
                            className="font-mono text-[8px] tracking-[0.2em] text-luxury-gold uppercase px-2 py-0.5 border border-luxury-gold/30 bg-luxury-cream/40 w-fit self-start md:self-auto rounded-none"
                            dangerouslySetInnerHTML={{ __html: item.category }}
                          />
                        )}
                        <span 
                          className="font-serif text-sm md:text-base font-normal text-luxury-dark tracking-tight transition-colors duration-200 hover:text-luxury-gold"
                          dangerouslySetInnerHTML={{ __html: item.question }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(item.question);
                          }}
                          onKeyDown={(e) => {
                            // Prevent triggering parent accordion keyboard handlers (Enter/Space)
                            e.stopPropagation();
                          }}
                          className={`flex items-center justify-center w-8 h-8 border transition-all duration-300 rounded-none cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-luxury-gold focus-visible:border-luxury-gold ${
                            copiedQuestion === item.question
                              ? "bg-green-50 text-green-700 border-green-200 animate-pulse"
                              : "bg-transparent text-luxury-dark/90 border-transparent hover:border-luxury-sand/80 hover:text-luxury-gold hover:bg-luxury-cream/10"
                          }`}
                          title={copiedQuestion === item.question ? "Skopiowano!" : "Kopiuj link do pytania"}
                          id={`faq-copy-btn-${index}`}
                        >
                          {copiedQuestion === item.question ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Link className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span 
                          className={`flex items-center justify-center w-6 h-6 rounded-full border border-luxury-sand text-luxury-gold transition-transform duration-300 select-none ${
                            isOpen ? "rotate-180 border-luxury-gold bg-luxury-gold text-white" : ""
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${index}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                          className="overflow-hidden"
                        >
                          <div 
                            className="px-6 pb-6 text-xs md:text-sm text-luxury-dark/95 font-light leading-relaxed border-t border-luxury-sand/30 pt-4"
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center border border-dashed border-luxury-sand text-luxury-dark/95 rounded-none bg-luxury-cream/15 font-mono text-xs tracking-wider"
                id="faq-no-results"
              >
                Brak wyników sprzyjających wybranym filtrom. Spróbuj zmienić kategorię lub wyczyścić szukaną frazę.
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-white/95 border border-luxury-gold px-4 py-3 font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase hover:bg-luxury-gold hover:text-white transition-all duration-300 shadow-lg cursor-pointer rounded-none backdrop-blur-sm"
            title="Powrót do góry sekcji FAQ"
            id="faq-back-to-top-btn"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Do góry</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

export default TreatmentFAQ;
