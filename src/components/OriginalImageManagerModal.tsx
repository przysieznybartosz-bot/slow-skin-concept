import React, { useState, useMemo } from "react";
import { X, Upload, Check, Camera, Image as ImageIcon, Search, Filter, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { TREATMENTS } from "../data";

export interface OriginalImageSlot {
  key: string;
  name: string;
  category: "key_tech" | "facial" | "about";
  treatmentName: string;
  suggestedFilename: string;
  currentUrl: string;
  description: string;
}

interface OriginalImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpdated?: (key: string, newUrl: string) => void;
}

// Key curated slots for main sections and technologies
export const PRIMARY_SLOTS: OriginalImageSlot[] = [
  {
    key: "hero",
    name: "Zdjęcie Główne (Hero Baner)",
    category: "key_tech",
    treatmentName: "Strona Główna / Diagnoza pod lupą",
    suggestedFilename: "Profesjonalna ocena skóry pod lupą.png",
    currentUrl: "/hero-main.png",
    description: "Baner główny na samej górze strony — badanie skóry pod lupą-lampą z dłońmi kosmetologa."
  },
  {
    key: "cover_magazine",
    name: "Okładka Magazynu (Sekcja Okładka)",
    category: "key_tech",
    treatmentName: "Wydanie Specjalne No. I",
    suggestedFilename: "okladka_magazynu.png",
    currentUrl: "/cover_magazine.png",
    description: "Główne zdjęcie w zakładce Okładka (Wydanie Specjalne No. I) — widoczne pod nagłówkiem SLOW SKIN CONCEPT / OKŁADKA."
  },
  {
    key: "pst-couch",
    name: "Terapia PST — Łóżko / Leżanka",
    category: "key_tech",
    treatmentName: "PST H-300 (Kręgosłup, Biodra, Tułów)",
    suggestedFilename: "PST łózko.png",
    currentUrl: "/pst_couch.png",
    description: "Klientka leżąca w aplikatorze tunelowym na ergonomicznej leżance zabiegowej PST H-300."
  },
  {
    key: "pst-chair",
    name: "Terapia PST — Fotel",
    category: "key_tech",
    treatmentName: "PST H-200 (Stawy & Kończyny)",
    suggestedFilename: "PST Fotel.png",
    currentUrl: "/pst_chair.png",
    description: "Klientka siedząca w fotelu z aplikatorem pierścieniowym PST H-200 do stawów kolanowych/barkowych."
  },
  {
    key: "ceragem",
    name: "Masaż Termiczny Ceragem",
    category: "key_tech",
    treatmentName: "Ceragem VE (model CGM MB-1101)",
    suggestedFilename: "łózko Ceragem.png",
    currentUrl: "/ceragem_bed.png",
    description: "Automatyczne łóżko do masażu termicznego z jadeitowymi rolkami wzdłuż kręgosłupa."
  },
  {
    key: "sonaris-pro",
    name: "Sonaris Pro Therapy",
    category: "key_tech",
    treatmentName: "Sonaris Pro (Twarz & Okolica Oka)",
    suggestedFilename: "sonaris pro.png",
    currentUrl: "/sonaris_pro.png",
    description: "Komfortowa głowica Sonaris Pro aplikowana na twarz — poprawa napięcia i gładkości bez nakłuwania."
  },
  {
    key: "stymulatory",
    name: "Stymulatory Tkankowe",
    category: "key_tech",
    treatmentName: "Biostymulacja iniekcyjna",
    suggestedFilename: "stymulatory tkankowe.png",
    currentUrl: "/stymulatory_tkankowe.png",
    description: "Naturalna biostymulacja iniekcyjna — polinukleotydy, kwas hialuronowy, aminokwasy."
  },
  {
    key: "about_institute",
    name: "O Instytucie / Wnętrze Gabinetu",
    category: "about",
    treatmentName: "Sekcja O Nas / Przestrzeń",
    suggestedFilename: "wnetrze_gabinetu.png",
    currentUrl: "/src/assets/images/slow_skin_philosophy_1788718994361.jpg",
    description: "Główne zdjęcie sekcji O Instytucie — wnętrze, recepcja lub gabinet zabiegowy Slow Skin Concept."
  },
  {
    key: "how_help_meso_remodeling",
    name: "Jak możemy Ci pomóc: Meso Remodeling",
    category: "key_tech",
    treatmentName: "Kompleksowe Terapie Bionomiczne (Karta 1)",
    suggestedFilename: "meso_remodeling.png",
    currentUrl: "/src/assets/images/meso_remodeling_card_1786128520065.jpg",
    description: "Fotografia kafelka Meso Remodeling w sekcji 'Jak możemy Ci pomóc?' na stronie głównej."
  },
  {
    key: "how_help_first_visit",
    name: "Jak możemy Ci pomóc: Pierwsza wizyta i diagnostyka",
    category: "key_tech",
    treatmentName: "Kompleksowe Terapie Bionomiczne (Karta 2)",
    suggestedFilename: "pierwsza_wizyta_diagnostyka.png",
    currentUrl: "/src/assets/images/regenerated_image_1781694292285.jpg",
    description: "Fotografia kafelka Pierwsza wizyta i diagnostyka skóry w sekcji 'Jak możemy Ci pomóc?' na stronie głównej."
  },
  {
    key: "how_help_neurolifting",
    name: "Jak możemy Ci pomóc: Neurolifting",
    category: "key_tech",
    treatmentName: "Kompleksowe Terapie Bionomiczne (Karta 3)",
    suggestedFilename: "neurolifting.png",
    currentUrl: "/src/assets/images/facial_acupuncture_led_1785534009485.jpg",
    description: "Fotografia kafelka Neurolifting w sekcji 'Jak możemy Ci pomóc?' na stronie głównej."
  },
  {
    key: "how_help_sensitive_skin",
    name: "Jak możemy Ci pomóc: Terapia skóry wrażliwej",
    category: "key_tech",
    treatmentName: "Kompleksowe Terapie Bionomiczne (Karta 4)",
    suggestedFilename: "terapia_skory_wrazliwej.png",
    currentUrl: "/src/assets/images/regenerated_image_17816942749.jpg",
    description: "Fotografia kafelka Terapia skóry wrażliwej w sekcji 'Jak możemy Ci pomóc?' na stronie głównej."
  }
];

export const OriginalImageManagerModal: React.FC<OriginalImageManagerModalProps> = ({
  isOpen,
  onClose,
  onImageUpdated
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "key_tech" | "facial" | "about">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [successKeys, setSuccessKeys] = useState<Record<string, boolean>>({});

  // Merge primary slots with all clinical treatments
  const allSlots: OriginalImageSlot[] = useMemo(() => {
    const list = [...PRIMARY_SLOTS];

    TREATMENTS.forEach((treatment) => {
      // Avoid duplicate keys with primary slots
      if (["ceragem-thermal-massage", "pst-signal-therapy", "sonaris-pro-therapy", "stymulatory-tkankowe"].includes(treatment.id)) {
        return;
      }

      list.push({
        key: treatment.id,
        name: treatment.title,
        category: "facial",
        treatmentName: treatment.duration ? `Czas: ${treatment.duration}` : "Zabieg kosmetologiczny",
        suggestedFilename: `${treatment.id}.png`,
        currentUrl: treatment.image,
        description: treatment.subtitle || treatment.focus || treatment.description.slice(0, 110) + "..."
      });
    });

    return list;
  }, []);

  const [imagesCache, setImagesCache] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (typeof window !== "undefined") {
      try {
        // Read stored slots
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("custom_img_")) {
            const slotKey = k.replace("custom_img_", "");
            const val = localStorage.getItem(k);
            if (val) map[slotKey] = val;
          }
        }
        const heroVal = localStorage.getItem("custom_hero_image");
        if (heroVal) map["hero"] = heroVal;
      } catch {}
    }
    return map;
  });

  const filteredSlots = useMemo(() => {
    return allSlots.filter((slot) => {
      const matchesCategory = activeCategory === "all" || slot.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        slot.name.toLowerCase().includes(q) || 
        slot.treatmentName.toLowerCase().includes(q) ||
        slot.description.toLowerCase().includes(q) ||
        slot.suggestedFilename.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allSlots, activeCategory, searchQuery]);

  if (!isOpen) return null;

  const handleFileUpload = async (slotKey: string, file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Proszę wybrać plik graficzny (PNG, JPG, WEBP).");
      return;
    }

    try {
      setUploadingKey(slotKey);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const resp = await fetch("/api/upload-treatment-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataUrl: base64,
              treatmentKey: slotKey
            })
          });
          const data = await resp.json();
          const targetUrl = data.success && data.url ? data.url : base64;
          
          try {
            localStorage.setItem(`custom_img_${slotKey}`, targetUrl);
            if (slotKey === "hero") {
              localStorage.setItem("custom_hero_image", targetUrl);
            }
          } catch {}

          setImagesCache((prev) => ({ ...prev, [slotKey]: targetUrl }));
          setSuccessKeys((prev) => ({ ...prev, [slotKey]: true }));
          if (onImageUpdated) {
            onImageUpdated(slotKey, targetUrl);
          }

          setTimeout(() => {
            setSuccessKeys((prev) => ({ ...prev, [slotKey]: false }));
          }, 3500);
        } catch (err) {
          console.error(err);
          try {
            localStorage.setItem(`custom_img_${slotKey}`, base64);
            if (slotKey === "hero") {
              localStorage.setItem("custom_hero_image", base64);
            }
          } catch {}
          setImagesCache((prev) => ({ ...prev, [slotKey]: base64 }));
          if (onImageUpdated) {
            onImageUpdated(slotKey, base64);
          }
        } finally {
          setUploadingKey(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadingKey(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-luxury-gold/50 rounded-sm w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto text-left">
        
        {/* Header */}
        <div className="bg-white border-b border-luxury-sand/50 p-4 sm:p-6 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-luxury-gold/15 rounded-xs text-luxury-gold">
                  <Camera className="w-5 h-5" />
                </span>
                <span className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-bold">
                  Menedżer Fotografii Gabinetowych • 100% Oryginalne Pliki Bez AI
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-luxury-dark font-normal">
                Panel Wstawiania Własnych Zdjęć do Dowolnej Sekcji
              </h3>
              <p className="text-xs text-luxury-dark/80 font-light max-w-3xl">
                Wstawiaj swoje surowe pliki bez czekania na AI i bez marnowania tokenów. Każde przeciągnięte lub wybrane zdjęcie zapisuje się natychmiast na dysku serwera i pojawia się w serwisie w 100% oryginalnej rozdzielczości.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-luxury-sand/20 rounded-full transition-colors cursor-pointer text-luxury-dark/70 hover:text-luxury-dark shrink-0"
              title="Zamknij panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-luxury-sand/30">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${activeCategory === "all" ? "bg-luxury-gold text-white font-bold" : "bg-luxury-sand/20 text-luxury-dark hover:bg-luxury-sand/40"}`}
              >
                Wszystkie ({allSlots.length})
              </button>
              <button
                onClick={() => setActiveCategory("key_tech")}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${activeCategory === "key_tech" ? "bg-luxury-gold text-white font-bold" : "bg-luxury-sand/20 text-luxury-dark hover:bg-luxury-sand/40"}`}
              >
                Główne Technologie ({PRIMARY_SLOTS.filter(s => s.category === "key_tech").length})
              </button>
              <button
                onClick={() => setActiveCategory("facial")}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${activeCategory === "facial" ? "bg-luxury-gold text-white font-bold" : "bg-luxury-sand/20 text-luxury-dark hover:bg-luxury-sand/40"}`}
              >
                Zabiegi Twarzy ({allSlots.filter(s => s.category === "facial").length})
              </button>
              <button
                onClick={() => setActiveCategory("about")}
                className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${activeCategory === "about" ? "bg-luxury-gold text-white font-bold" : "bg-luxury-sand/20 text-luxury-dark hover:bg-luxury-sand/40"}`}
              >
                O Instytucie
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-luxury-dark/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj zabiegu lub pliku..."
                className="w-full bg-[#FAF8F5] border border-luxury-sand/80 pl-8 pr-3 py-1.5 text-xs text-luxury-dark placeholder-luxury-dark/40 focus:outline-none focus:border-luxury-gold font-sans rounded-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-luxury-dark/40 hover:text-luxury-dark text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[calc(94vh-210px)] bg-[#FAF8F5]">
          {filteredSlots.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-white border border-luxury-sand/60 rounded-xs p-6">
              <AlertCircle className="w-8 h-8 text-luxury-gold mx-auto" />
              <p className="font-serif text-lg text-luxury-dark">Nie znaleziono sekcji dla zapytania: &bdquo;{searchQuery}&rdquo;</p>
              <p className="text-xs text-luxury-dark/60 font-light">Wpisz inną frazę lub wyczyść wyszukiwarkę.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlots.map((slot) => {
                const currentSrc = imagesCache[slot.key] || slot.currentUrl;
                const isCustomUploaded = Boolean(imagesCache[slot.key]);
                const isUploading = uploadingKey === slot.key;
                const isSuccess = successKeys[slot.key];

                return (
                  <div
                    key={slot.key}
                    className="bg-white border border-luxury-sand/70 p-4 rounded-sm shadow-2xs space-y-3 flex flex-col justify-between hover:border-luxury-gold/70 transition-all hover:shadow-xs group/card"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-luxury-gold truncate">
                          {slot.treatmentName}
                        </span>
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1 text-[8.5px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                            <Check className="w-3 h-3" /> Wstawiono!
                          </span>
                        ) : isCustomUploaded ? (
                          <span className="inline-flex items-center gap-1 text-[8px] font-mono text-luxury-gold font-bold bg-luxury-gold/10 px-1.5 py-0.5 rounded-xs shrink-0">
                            Twój plik
                          </span>
                        ) : null}
                      </div>

                      <h4 className="font-serif text-sm sm:text-base text-luxury-dark font-medium leading-snug">
                        {slot.name}
                      </h4>

                      <p className="text-[11px] text-luxury-dark/75 leading-relaxed font-light line-clamp-2">
                        {slot.description}
                      </p>

                      <div className="text-[9.5px] font-mono text-luxury-dark/60 bg-[#FAF8F5] p-1.5 rounded-xs border border-luxury-sand/40 truncate">
                        Klucz: <strong className="text-luxury-dark">{slot.key}</strong>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-luxury-sand/30">
                      {/* Image Preview & Dropzone */}
                      <label
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload(slot.key, e.dataTransfer.files[0]);
                          }
                        }}
                        className="block relative aspect-video bg-luxury-sand/20 border border-dashed border-luxury-sand hover:border-luxury-gold rounded-xs overflow-hidden cursor-pointer group transition-all"
                        title="Kliknij lub przeciągnij plik, aby go natychmiast wstawić"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(slot.key, e.target.files[0]);
                            }
                          }}
                        />

                        {currentSrc ? (
                          <>
                            <img
                              src={currentSrc}
                              alt={slot.name}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono gap-1 text-center p-2">
                              <Upload className="w-4 h-4 text-luxury-gold" />
                              <span>Upuść lub kliknij plik</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-luxury-dark/60 p-4 text-center">
                            <ImageIcon className="w-5 h-5 text-luxury-gold" />
                            <span className="text-[10px] font-mono uppercase">Kliknij lub upuść plik</span>
                          </div>
                        )}

                        {isUploading && (
                          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[10px] font-mono text-luxury-gold gap-1.5">
                            <span className="w-3 h-3 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
                            <span>Zapisywanie na serwerze...</span>
                          </div>
                        )}
                      </label>

                      {/* Direct button */}
                      <label className="w-full py-1.5 bg-luxury-gold/15 hover:bg-luxury-gold hover:text-white text-luxury-dark font-mono text-[9px] uppercase tracking-wider font-bold transition-all text-center rounded-xs flex items-center justify-center gap-1.5 cursor-pointer border border-luxury-gold/40">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(slot.key, e.target.files[0]);
                            }
                          }}
                        />
                        <Upload className="w-3 h-3" />
                        <span>Wybierz ze swojego dysku</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-luxury-sand/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-luxury-dark/80 font-mono text-[10px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pełna rozdzielczość 1:1 • Zapis bezpośredni w <code>public/</code> • Bez kompresji i filtrów</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-luxury-dark text-white hover:bg-luxury-gold font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer text-center rounded-xs"
            >
              Gotowe — Zamknij panel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
