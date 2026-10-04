import React, { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Sparkles, Loader2, ExternalLink } from "lucide-react";

interface NewsletterSectionProps {
  variant?: "full" | "compact";
  className?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ 
  variant = "full",
  className = "" 
}) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "pending_shop" | "error">("idle");
  const [message, setMessage] = useState("");
  const [shopRedirectUrl, setShopRedirectUrl] = useState("https://slow-skin.shop/#newsletter");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Proszę podać prawidłowy adres e-mail.");
      return;
    }

    if (!consent) {
      setStatus("error");
      setMessage("Wymagane jest zaznaczenie zgody na otrzymywanie newslettera.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "subscribe",
          email: email.trim(),
          consent: true,
          version: "newsletter-2026-10-02-v1",
          website: honeypot
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "Jeśli adres wymaga potwierdzenia, wyślemy link. Sprawdź pocztę i spam. Link jest ważny 24 godziny. Po potwierdzeniu otrzymasz indywidualny kod rabatowy 10%.");
        setEmail("");
        setConsent(false);
      } else if (data.code === "ORIGIN_WHITELIST_PENDING") {
        // Direct domain integration pending Codex config on shop
        setStatus("pending_shop");
        setShopRedirectUrl(data.shopUrl || `https://slow-skin.shop/#newsletter?email=${encodeURIComponent(email.trim())}`);
        setMessage("Twój adres e-mail został przygotowany. Ze względów bezpieczeństwa centralnego systemu sklepu, dokończ zapis jednym kliknięciem na stronie sklepu:");
      } else {
        setStatus("error");
        setMessage(data.message || "Wystąpił błąd podczas rejestracji. Spróbuj ponownie lub przejdź bezpośrednio do sklepu.");
        if (data.shopUrl) {
          setShopRedirectUrl(data.shopUrl);
        }
      }
    } catch (err: any) {
      console.error("Newsletter submission error:", err);
      setStatus("error");
      setMessage("Nie udało się nawiązać połączenia. Kliknij poniższy przycisk, aby zapisać się bezpośrednio w sklepie.");
      setShopRedirectUrl(`https://slow-skin.shop/#newsletter?email=${encodeURIComponent(email.trim())}`);
    }
  };

  if (variant === "compact") {
    return (
      <div className={`space-y-4 text-left ${className}`} id="newsletter-compact-block">
        <div>
          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-1">
            Zostańmy w kontakcie
          </span>
          <h4 className="font-serif text-lg font-medium text-luxury-dark">
            Odbierz 10% na wybraną konsultację
          </h4>
          <p className="text-xs text-luxury-dark/90 leading-relaxed mt-1 font-light">
            Porady o świadomej pielęgnacji, nowości i zaproszenia od Slow Skin Concept. Potwierdź zapis i odbierz jednorazowy kod na konsultację online lub Mikroodżywczy Profil Zdrowia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Honeypot field for bot protection */}
          <input 
            type="text" 
            name="website" 
            value={honeypot} 
            onChange={(e) => setHoneypot(e.target.value)} 
            tabIndex={-1} 
            autoComplete="off" 
            style={{ display: "none" }} 
            aria-hidden="true" 
          />

          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 border-b border-luxury-dark pb-2">
              <input 
                type="email" 
                id="newsletter-compact-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Twój adres e-mail" 
                className="bg-transparent border-0 outline-none text-xs w-full placeholder:text-luxury-dark/60 font-serif focus:ring-0 py-1"
                disabled={status === "submitting" || status === "success"}
                aria-label="Adres e-mail do newslettera"
                required
              />
              <button 
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="bg-luxury-dark text-white hover:bg-luxury-gold hover:text-white font-mono uppercase text-[10px] tracking-widest px-4 py-2 transition-all duration-300 disabled:opacity-50 cursor-pointer shrink-0 font-bold flex items-center justify-center gap-1.5"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>ZAPISYWANIE...</span>
                  </>
                ) : (
                  <span>ZAPISZ SIĘ</span>
                )}
              </button>
            </div>

            {/* Checkbox Zgody */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer text-left group">
              <input 
                type="checkbox" 
                id="newsletter-compact-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded-xs border-luxury-sand text-luxury-gold focus:ring-luxury-gold cursor-pointer"
                disabled={status === "submitting" || status === "success"}
                required
              />
              <span className="text-[10px] text-luxury-dark/85 leading-snug font-light">
                Chcę otrzymywać od Slow Skin Concept newsletter z poradami i nowościami. Wiem, że mogę wycofać zgodę w każdej chwili. Akceptuję{" "}
                <a 
                  href="https://slow-skin.shop/newsletter/zasady" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-luxury-gold hover:text-luxury-dark transition-colors font-medium"
                >
                  Zasady Newslettera i rabatu
                </a>{" "}
                oraz{" "}
                <a 
                  href="https://slow-skin.shop/polityka-prywatnosci" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-luxury-gold hover:text-luxury-dark transition-colors font-medium"
                >
                  Politykę Prywatności
                </a>.
              </span>
            </label>
          </div>

          {/* Feedback states */}
          {status === "success" && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed rounded-xs flex items-start gap-2 animate-fade-in" role="alert">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Potwierdź swój adres e-mail</p>
                <p className="mt-0.5">{message}</p>
              </div>
            </div>
          )}

          {status === "pending_shop" && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed rounded-xs space-y-2 animate-fade-in" role="alert">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{message}</p>
              </div>
              <a 
                href={shopRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white text-[10px] font-mono uppercase tracking-wider font-bold transition-all shadow-xs"
              >
                <span>Dokończ zapis na slow-skin.shop</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 text-[11px] leading-relaxed rounded-xs space-y-2 animate-fade-in" role="alert">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>{message}</p>
              </div>
              <a 
                href="https://slow-skin.shop/#newsletter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-mono text-luxury-dark hover:text-luxury-gold underline uppercase tracking-wider font-semibold"
              >
                <span>Przejdź do formularza na slow-skin.shop →</span>
              </a>
            </div>
          )}
        </form>

        <div className="pt-1 flex items-center justify-between">
          <span className="text-[9px] font-mono text-luxury-dark/60 leading-tight">
            * Rabat 10% ważny 90 dni, dotyczy konsultacji online i profilu zdrowia w sklepie.
          </span>
          <a 
            href="https://slow-skin.shop/#newsletter" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9.5px] font-mono text-luxury-gold hover:text-luxury-dark underline tracking-wider uppercase inline-flex items-center gap-1 shrink-0 ml-2"
          >
            <span>Zapis w sklepie</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Full Rich Editorial Section (Quiet Luxury)
  return (
    <section className={`border border-luxury-gold/50 bg-[#FAF8F5] p-8 md:p-12 lg:p-16 rounded-sm shadow-sm relative overflow-hidden text-left ${className}`} id="newsletter-section">
      {/* Background aesthetic ornament */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-luxury-gold/5 rounded-full pointer-events-none blur-2xl" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-luxury-sand/20 rounded-full pointer-events-none blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/15 border border-luxury-gold/40 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold">
              Zostańmy w kontakcie
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-luxury-dark leading-tight tracking-wide">
            Odbierz 10% na wybraną konsultację
          </h2>

          <div className="w-16 h-[1.5px] bg-luxury-gold/80" />

          <p className="text-xs sm:text-sm text-luxury-dark/95 font-serif italic leading-relaxed">
            Porady o świadomej pielęgnacji, nowości i zaproszenia od Slow Skin Concept. Potwierdź zapis i odbierz jednorazowy kod na konsultację online lub Mikroodżywczy Profil Zdrowia.
          </p>
        </div>

        {/* Benefits Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="border border-luxury-sand/80 bg-white/90 p-4 rounded-xs space-y-1.5 shadow-xs">
            <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-bold block">01 • Wiedza Bionomiczna</span>
            <h4 className="font-serif text-xs font-semibold text-luxury-dark">Artykuły Eksperckie</h4>
            <p className="text-[11px] text-luxury-dark/80 font-light leading-relaxed">
              O neurobiologii, barierowości naskórka i fizjologii skóry bez komercyjnego marketingu.
            </p>
          </div>

          <div className="border border-luxury-sand/80 bg-white/90 p-4 rounded-xs space-y-1.5 shadow-xs">
            <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-bold block">02 • Powitanie</span>
            <h4 className="font-serif text-xs font-semibold text-luxury-dark">Indywidualny Kod 10%</h4>
            <p className="text-[11px] text-luxury-dark/80 font-light leading-relaxed">
              Ważny 90 dni na Videokonsultację Kosmetologiczną lub Mikroodżywczy Profil Zdrowia w sklepie.
            </p>
          </div>

          <div className="border border-luxury-sand/80 bg-white/90 p-4 rounded-xs space-y-1.5 shadow-xs">
            <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-bold block">03 • Kameralność</span>
            <h4 className="font-serif text-xs font-semibold text-luxury-dark">Pierwszeństwo Wizyt</h4>
            <p className="text-[11px] text-luxury-dark/80 font-light leading-relaxed">
              Wcześniejsza informacja o otwarciu nowych grafików i limitowanych edycjach terapii.
            </p>
          </div>
        </div>

        {/* Main Interactive Form Card */}
        <div className="border-2 border-luxury-gold/40 bg-white p-6 sm:p-8 rounded-sm shadow-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Honeypot field for anti-bot protection */}
            <input 
              type="text" 
              name="website" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              tabIndex={-1} 
              autoComplete="off" 
              style={{ display: "none" }} 
              aria-hidden="true" 
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <label htmlFor="newsletter-full-email" className="sr-only">
                  Twój adres e-mail
                </label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-luxury-gold">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  id="newsletter-full-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Wpisz swój adres e-mail (np. imie@domena.pl)"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-luxury-sand text-xs font-serif text-luxury-dark placeholder:text-luxury-dark/50 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all duration-300"
                  disabled={status === "submitting" || status === "success"}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="px-8 py-3.5 bg-luxury-dark text-white hover:bg-luxury-gold hover:text-white transition-all duration-300 font-mono text-xs tracking-widest uppercase font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-luxury-gold" />
                    <span>Przesyłanie...</span>
                  </>
                ) : (
                  <>
                    <span>Zapisz się i odbierz 10%</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Checkbox Zgody (Niezaznaczony domyślnie) */}
            <div className="pt-1 border-t border-luxury-sand/30">
              <label className="flex items-start gap-3 cursor-pointer text-left group">
                <input 
                  type="checkbox" 
                  id="newsletter-full-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-xs border-luxury-sand text-luxury-gold focus:ring-luxury-gold cursor-pointer"
                  disabled={status === "submitting" || status === "success"}
                  required
                />
                <span className="text-[11px] text-luxury-dark/85 leading-relaxed font-light select-none">
                  Chcę otrzymywać od Slow Skin Concept Katarzyna Brzezińska newsletter z poradami, nowościami i ofertami SKIN INFUZION oraz Slow Skin Concept na podany adres e-mail. Wiem, że mogę wycofać zgodę w każdej chwili. Każda wiadomość zawiera link do wypisania. Zapoznałam/em się z{" "}
                  <a 
                    href="https://slow-skin.shop/newsletter/zasady" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline text-luxury-gold hover:text-luxury-dark transition-colors font-medium"
                  >
                    Zasadami Newslettera i rabatu
                  </a>{" "}
                  oraz{" "}
                  <a 
                    href="https://slow-skin.shop/polityka-prywatnosci" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline text-luxury-gold hover:text-luxury-dark transition-colors font-medium"
                  >
                    Polityką Prywatności
                  </a>.
                </span>
              </label>
            </div>

            {/* Status Feedback Messages */}
            {status === "success" && (
              <div className="p-4 bg-emerald-50/90 border border-emerald-200 text-emerald-950 text-xs leading-relaxed rounded-xs flex items-start gap-3 animate-fade-in" role="alert">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-900 font-serif text-sm">Sprawdź swoją skrzynkę e-mail</p>
                  <p className="font-light">{message}</p>
                  <p className="text-[10px] font-mono text-emerald-800/80 pt-1">
                    Po kliknięciu linku aktywacyjnego w wiadomości, Twój indywidualny kod rabatowy 10% zostanie wygenerowany w sklepie slow-skin.shop.
                  </p>
                </div>
              </div>
            )}

            {status === "pending_shop" && (
              <div className="p-5 bg-amber-50/90 border border-amber-300 text-amber-950 text-xs leading-relaxed rounded-xs space-y-3 animate-fade-in" role="alert">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold font-serif text-sm text-amber-900">Zapis bezpośredni w sklepie</p>
                    <p className="mt-0.5 font-light">{message}</p>
                  </div>
                </div>
                <div className="pt-1">
                  <a 
                    href={shopRedirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-luxury-dark text-white hover:bg-luxury-gold hover:text-white text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-sm"
                  >
                    <span>Przejdź do formularza na slow-skin.shop (#newsletter)</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-950 text-xs leading-relaxed rounded-xs space-y-2 animate-fade-in" role="alert">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <p>{message}</p>
                </div>
                <div className="pt-1">
                  <a 
                    href="https://slow-skin.shop/#newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-luxury-dark hover:text-luxury-gold underline uppercase tracking-wider font-semibold"
                  >
                    <span>Skorzystaj z formularza w sklepie: slow-skin.shop/#newsletter →</span>
                  </a>
                </div>
              </div>
            )}
          </form>

          {/* Legal notes and fallback button */}
          <div className="pt-4 border-t border-luxury-sand/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10.5px] text-luxury-dark/80 font-light leading-relaxed">
            <div className="flex items-start gap-2 max-w-xl">
              <ShieldCheck className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <span>
                <strong>Zasady rabatu:</strong> Jednorazowy kod 10% jest przypisany do adresu e-mail i ważny przez 90 dni. Obejmuje wyłącznie Videokonsultację Kosmetologiczną online lub Mikroodżywczy Profil Zdrowia w sklepie slow-skin.shop (nie dotyczy zabiegów gabinetowych, kosmetyków ani e-booków).
              </span>
            </div>

            <a 
              href="https://slow-skin.shop/#newsletter" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-luxury-gold/50 text-luxury-dark hover:bg-luxury-gold/10 font-mono text-[10px] uppercase tracking-wider font-semibold shrink-0 transition-all rounded-xs"
            >
              <span>Zapis na slow-skin.shop</span>
              <ExternalLink className="w-3.5 h-3.5 text-luxury-gold" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default NewsletterSection;
