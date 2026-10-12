import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, BookOpen, Calendar, ChevronRight, Settings, Lock, Check, ArrowLeft, MapPin, ExternalLink } from "lucide-react";
import { TREATMENTS, ARTICLES } from "../data";
import { safeStorage } from "../utils/storage";

interface SkincareAssistantProps {
  onViewTreatment: (id: string) => void;
  onBookTreatment: (id: string) => void;
  onReadArticle: (id: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function SkincareAssistant({
  onViewTreatment,
  onBookTreatment,
  onReadArticle,
}: SkincareAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState<string>(() => safeStorage.getItem("openai_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const [clickCount, setClickCount] = useState(0);

  // Fetch OpenAI API Key from the server on mount to automatically prepopulate it across devices/browsers!
  useEffect(() => {
    fetch("/api/settings/openai")
      .then(res => res.json())
      .then(data => {
        if (data.key) {
          const fetchedKey = data.key.trim();
          setOpenaiKey(fetchedKey);
          safeStorage.setItem("openai_api_key", fetchedKey);
        }
      })
      .catch(err => console.error("Could not fetch server-side OpenAI API Key:", err));
  }, []);

  // Initialize tempKey when opening settings
  useEffect(() => {
    if (showSettings) {
      setTempKey(openaiKey);
    }
  }, [showSettings, openaiKey]);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Witaj w Slow Skin Concept. Jestem Twoim Wirtualnym Asystentem Skóry. Pomogę Ci odnaleźć idealne zabiegi dla Twojej cery, przedstawię wskazania, cennik i metody oraz ułatwię wygodną rezerwację wizyty w gabinecie w Jelczu-Laskowicach.\n\nO co chcesz mnie zapytać?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputVal("");
    setIsLoading(true);

    let userLocation: { latitude: number; longitude: number } | undefined = undefined;
    try {
      if (navigator.geolocation) {
        userLocation = await new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            (err) => reject(err),
            { timeout: 3000 }
          );
        }).catch(() => undefined);
      }
    } catch (err) {
      console.warn("Could not retrieve geolocation:", err);
    }

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (openaiKey) {
        headers["x-openai-api-key"] = openaiKey;
      }

      const response = await fetch("/api/assistant", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          messages: updatedMessages,
          location: userLocation
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd sieciowy");
      }

      // Add placeholder message for assistant streaming output
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let accumulatedText = "";

      if (reader) {
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            accumulatedText += chunk;
            setMessages((prev) => {
              const next = [...prev];
              if (next.length > 0 && next[next.length - 1].role === "assistant") {
                next[next.length - 1].content = accumulatedText;
              }
              return next;
            });
          }
        }
      }
    } catch (e) {
      console.error("Error standard API call:", e);
      setMessages((prev) => {
        // Remove empty placeholder if any
        const next = [...prev];
        if (next.length > 0 && next[next.length - 1].role === "assistant" && next[next.length - 1].content === "") {
          next.pop();
        }
        return [
          ...next,
          {
            role: "assistant",
            content:
              "Przepraszam Cię najmocniej. Wystąpiło drobne rozstrojenie połączenia w sieci komórkowej. Czy zechcesz spróbować opowiedzieć o swojej skórze jeszcze raz, bądź skontaktować się telefonicznie?",
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessageContent = (text: string) => {
    // Regex to match markdown links of form [label](action:id) or [label](http://...)
    const linkRegex = /\[([^[]+)\]\((treatment:|book:|article:|https?:\/\/)([^)]+)\)/g;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // We process line by line to keep formatting elegant
    const lines = text.split("\n");

    return lines.map((line, lineIdx) => {
      // 1. Check if it's a bullet list line
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      const displayLine = isBullet ? line.trim().substring(2) : line;

      // Reset regex index
      let matchIdx = 0;
      const lineParts: React.ReactNode[] = [];
      let tempIndex = 0;

      while ((match = linkRegex.exec(displayLine)) !== null) {
        // Append text before match
        if (match.index > tempIndex) {
          lineParts.push(renderStyledText(displayLine.substring(tempIndex, match.index), lineIdx + "_p_" + tempIndex));
        }

        const [_, label, prefix, value] = match;
        
        if (prefix.startsWith("http")) {
          // Standard web URL (e.g., Google Maps link from grounding)
          const fullUrl = prefix + value;
          lineParts.push(
            <a
              key={lineIdx + "_web_" + match.index}
              href={fullUrl}
              target="_blank"
              rel="referrer noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 my-1 mx-0.5 text-xs font-semibold tracking-wide text-luxury-gold hover:text-luxury-dark bg-luxury-gold/5 hover:bg-luxury-gold/20 border border-luxury-gold/20 transition-all duration-300 shadow-sm"
            >
              <MapPin className="w-3 h-3 text-luxury-gold" />
              <span>{label}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          );
        } else {
          // Action button (treatment / book / article)
          const action = prefix.replace(":", "");
          lineParts.push(
            <button
              key={lineIdx + "_btn_" + match.index}
              onClick={() => handleActionClick(action, value)}
              className="inline-flex items-center gap-1.5 px-3 py-1 my-1 mx-0.5 text-xs font-medium tracking-wide text-luxury-cream bg-luxury-dark hover:bg-luxury-gold transition-colors duration-300 shadow-sm border border-luxury-sand/25 group/btn"
            >
              {action === "treatment" && <Sparkles className="w-3 h-3 text-luxury-gold group-hover/btn:text-luxury-cream" />}
              {action === "book" && <Calendar className="w-3 h-3 text-luxury-gold group-hover/btn:text-luxury-cream" />}
              {action === "article" && <BookOpen className="w-3 h-3 text-luxury-gold group-hover/btn:text-luxury-cream" />}
              <span>{label}</span>
              <ChevronRight className="w-3 h-3 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          );
        }

        tempIndex = linkRegex.lastIndex;
      }

      if (tempIndex < displayLine.length) {
        lineParts.push(renderStyledText(displayLine.substring(tempIndex), lineIdx + "_p_end"));
      }

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-5 list-disc text-xs text-luxury-dark/95 leading-relaxed my-1">
            {lineParts}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="text-xs text-luxury-dark/95 leading-relaxed my-1.5">
          {lineParts}
        </p>
      );
    });
  };

  const renderStyledText = (text: string, key: string) => {
    // Basic helper to handle bolding: **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(text.substring(lastIdx, match.index));
      }
      parts.push(
        <strong key={key + "_b_" + match.index} className="font-semibold text-luxury-dark text-[12.5px]">
          {match[1]}
        </strong>
      );
      lastIdx = boldRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(text.substring(lastIdx));
    }

    return <span key={key}>{parts}</span>;
  };

  const handleActionClick = (action: string, id: string) => {
    if (action === "treatment") {
      onViewTreatment(id);
    } else if (action === "book") {
      onBookTreatment(id);
    } else if (action === "article") {
      onReadArticle(id);
    }
  };

  const SUGGESTS = [
    { label: "Konsultacja z badaniem NatiV3", query: "Jak wygląda pierwsza wizyta i badanie diagnostyczne Nati V3?" },
    { label: "Cennik zabiegów", query: "Podaj mi pełny cennik wszystkich zabiegów" },
    { label: "Czy HIFU boli?", query: "Czy lifting ultradźwiękowy HIFU boli i jakie są przeciwwskazania?" },
    { label: "Odbudowa bariery skóry", query: "Mam podrażnioną i piekącą skórę, jak odbudować barierę hydrolipidową?" }
  ];

  const [showPromoBanner, setShowPromoBanner] = useState(true);

  const dismissPromoBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPromoBanner(false);
  };

  return (
    <>
      {/* FLOATING PROMO BANNER */}
      <AnimatePresence>
        {showPromoBanner && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            id="ai-assistant-promo-banner"
            className="fixed bottom-[152px] right-6 z-40 max-w-[280px] sm:max-w-xs bg-white text-luxury-dark p-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border-2 border-luxury-gold rounded-none font-sans flex flex-col gap-2.5 cursor-pointer hover:shadow-luxury-gold/20 transition-shadow duration-300"
            onClick={() => setIsOpen(true)}
          >
            {/* Header / Status row */}
            <div className="flex items-center justify-between border-b border-luxury-sand/40 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="font-mono text-[9.5px] tracking-[0.15em] text-luxury-gold uppercase font-bold">Konsjerż AI 24H</span>
              </div>
              <button
                type="button"
                onClick={dismissPromoBanner}
                className="text-luxury-dark/90 hover:text-red-600 text-sm p-1 font-mono transition-colors leading-none"
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
            {/* Core message */}
            <div className="text-left">
              <p className="text-[11.5px] text-luxury-dark font-light leading-relaxed">
                Poznaj bionomiczne terapie, aktualny cennik lub zapytaj o wolne terminy bez oczekiwania na linii.
              </p>
            </div>
            {/* Dynamic CTA */}
            <div className="text-[9.5px] font-mono text-luxury-gold uppercase tracking-[0.15em] text-right font-bold hover:text-luxury-dark transition-colors flex items-center justify-end gap-1">
              <span>Zadaj pytanie</span>
              <span>&rarr;</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING LAUNCH ICON */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="ai-assistant-launch-btn"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-gradient-to-br from-[#ebdcb9] via-luxury-gold to-[#b39b72] text-luxury-dark flex items-center justify-center rounded-full shadow-[0_8px_32px_rgba(212,175,55,0.45)] border-2 border-white cursor-pointer relative group transition-shadow duration-300"
        >
          {/* Animated golden ripple effect */}
          <span className="absolute inset-0 rounded-full bg-luxury-gold/40 animate-ping opacity-85 group-hover:opacity-100 transition-opacity" />
          <MessageSquare className="w-6 h-6 relative z-10 stroke-[2.2]" />
          
          {/* Online badge dot */}
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center z-20 shadow-sm">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          </span>
          <span className="sr-only">Uruchom Asystenta AI</span>
        </motion.button>
      </div>

      {/* CHAT PANEL SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ x: "100%", opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-luxury-cream text-luxury-dark shadow-2xl z-50 border-l border-luxury-sand/30 flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-6 bg-luxury-dark text-luxury-cream border-b border-luxury-sand/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-luxury-gold/15 rounded-full border border-luxury-gold/40 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <h3 
                    onClick={() => {
                      const next = clickCount + 1;
                      if (next >= 5) {
                        setShowSettings(true);
                        setClickCount(0);
                      } else {
                        setClickCount(next);
                      }
                    }}
                    className="font-serif text-base tracking-wide text-luxury-gold cursor-pointer select-none"
                    title="Konsjerż Slow Skin"
                  >
                    {showSettings ? "Integracja OpenAI" : "Konsjerż Slow Skin"}
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider opacity-80 uppercase">
                    {showSettings ? "Panel Konfiguracji AI" : "Asystent AI Odbudowy Komórkowej"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full border border-luxury-sand/20 hover:border-luxury-gold flex items-center justify-center text-luxury-sand/80 hover:text-luxury-cream transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showSettings ? (
              /* Settings view to key-in OpenAI API Key */
              <div className="flex-1 overflow-y-auto p-6 bg-luxury-cream/95 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="bg-luxury-dark p-4 border border-luxury-gold/30 rounded-sm text-luxury-cream">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-luxury-gold" />
                      <span className="font-serif text-sm tracking-wide font-semibold text-luxury-gold">Zabezpieczenie Klucza API</span>
                    </div>
                    <p className="text-[11px] text-luxury-sand/90 leading-relaxed font-sans">
                      Wpisany klucz OpenAI API jest zachowywany **w przeglądarce (localStorage)**.
                      Podczas wysyłania pytań, klucz jest bezpiecznie przesyłany do zapytania API asystenta w celu natychmiastowego wywołania modelu **GPT-4o**, gwarantując genialny, głęboki i spersonalizowany kontekst medyczno-kosmetyczny.
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/10 space-y-1 text-left">
                      <span className="block text-[9.5px] uppercase font-mono tracking-wider text-luxury-gold font-semibold">★ Wskazówka dla stałego udostępniania:</span>
                      <p className="text-[10px] text-luxury-sand/80 leading-normal font-sans">
                        Serwery w chmurze (Cloud Run) są bezstanowe i kasują pliki lokalne przy każdym restarcie lub zmianie instancji. Aby asystent działał z kluczem OpenAI na każdym urządzeniu (np. po wysłaniu linku mailem pacjentom), <strong>dodaj klucz jako zmienną środowiskową o nazwie <code className="bg-black/40 px-1 py-0.5 rounded text-luxury-gold font-mono text-[9px]">OPENAI_API_KEY</code> w ustawieniach Secrets (ikona koła zębatego w panelu AI Studio Build)</strong>. Dzięki temu klucz będzie bezpiecznie wbudowany w serwer dla każdego odwiedzającego!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-luxury-dark/95">
                      Klucz OpenAI API Key (sk-...)
                    </label>
                    <input
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder="sk-proj-..."
                      className="w-full bg-white text-xs border border-luxury-sand/50 px-4 py-3 focus:outline-hidden focus:border-luxury-gold text-luxury-dark placeholder-luxury-dark/45 font-sans"
                    />
                    <p className="text-[10.5px] text-luxury-dark/95 leading-normal">
                      Podłączając własny klucz, w pełni uaktywniasz zaawansowany silnik konwersacyjny, który rozmawia niespotykanie naturalnie, pamiętając filozofię bionomiczną Katarzyny Brzezińskiej.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={async () => {
                        const cleaned = tempKey.trim();
                        safeStorage.setItem("openai_api_key", cleaned);
                        setOpenaiKey(cleaned);
                        setShowSettings(false);
                        try {
                          await fetch("/api/settings/openai", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ key: cleaned })
                          });
                        } catch (err) {
                          console.error("Failed to save key on server:", err);
                        }
                      }}
                      className="flex-1 bg-luxury-dark hover:bg-luxury-gold text-luxury-cream hover:text-luxury-dark transition-all duration-300 font-serif text-xs py-3 rounded-sm tracking-wide border border-luxury-sand/30 font-medium cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Zapisz i Aktywuj OpenAI</span>
                    </button>

                    {openaiKey && (
                      <button
                        onClick={async () => {
                          safeStorage.removeItem("openai_api_key");
                          setOpenaiKey("");
                          setTempKey("");
                          setShowSettings(false);
                          try {
                            await fetch("/api/settings/openai", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ key: "" })
                            });
                          } catch (err) {
                            console.error("Failed to clear key on server:", err);
                          }
                        }}
                        className="bg-transparent hover:bg-red-500/10 text-red-600 hover:text-red-700 transition-colors duration-300 font-serif text-xs py-3 px-4 rounded-sm border border-red-200 cursor-pointer"
                      >
                        Dezaktywuj
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-luxury-sand/30 flex items-center justify-between text-[11px] text-luxury-dark/95">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Działa w trybie bionomicznym</span>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="hover:underline font-medium cursor-pointer"
                  >
                    Anuluj i wróć
                  </button>
                </div>
              </div>
            ) : (
              /* Conversation Log Area */
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-luxury-cream/60">
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-sm shadow-sm ${
                          message.role === "user"
                            ? "bg-luxury-dark text-luxury-cream rounded-tr-none border border-luxury-sand/20"
                            : "bg-luxury-sand/15 text-luxury-dark rounded-tl-none border border-luxury-sand/25"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="text-[9px] font-mono text-luxury-gold/90 uppercase tracking-widest mb-1 flex items-center justify-between">
                            <span>Konsjerż Slow Skin Concept</span>
                          </div>
                        )}
                        <div className="whitespace-pre-line space-y-1">
                          {message.role === "assistant" 
                            ? parseMessageContent(message.content) 
                            : <p className="text-xs leading-relaxed font-sans">{message.content}</p>
                          }
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-luxury-sand/15 p-4 rounded-sm rounded-tl-none border border-luxury-sand/25 space-y-2 max-w-[50%] animate-pulse">
                        <div className="text-[9px] font-mono text-luxury-gold/90 uppercase tracking-widest">
                          Konsjerż myśli...
                        </div>
                        <div className="flex items-center gap-1.5 py-1">
                          <div className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce delay-75" />
                          <div className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce delay-150" />
                          <div className="w-2 h-2 rounded-full bg-luxury-gold animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* SUGGESTION PILLS */}
                {messages.length === 1 && (
                  <div className="px-6 py-2 bg-luxury-sand/5 border-t border-luxury-sand/20">
                    <p className="text-[10px] font-semibold text-luxury-dark/95 uppercase tracking-wider mb-2">Szybkie pytania:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTS.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(s.query)}
                          className="text-[11px] px-3 py-1.5 bg-luxury-cream hover:bg-luxury-dark text-luxury-dark hover:text-luxury-cream border border-luxury-sand/50 transition-all duration-300 rounded-full cursor-pointer hover:shadow-xs font-medium"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Bar */}
                <div className="p-4 bg-luxury-cream border-t border-luxury-sand/30 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(inputVal)}
                    placeholder="Napisz o swojej skórze..."
                    className="flex-1 bg-white text-xs border border-luxury-sand/50 px-4 py-3 focus:outline-hidden focus:border-luxury-gold text-luxury-dark placeholder-luxury-dark/45 font-sans"
                  />
                  <button
                    onClick={() => handleSend(inputVal)}
                    className="w-10 h-10 bg-luxury-dark text-luxury-gold flex items-center justify-center border border-luxury-gold/30 hover:bg-luxury-gold hover:text-luxury-dark transition-colors duration-300 cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
