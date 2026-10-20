import React, { useState } from "react";
import { 
  ShieldCheck, 
  FileText, 
  Cookie, 
  Scale, 
  ArrowLeft, 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sliders
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export type LegalDocType = "privacy" | "rodo" | "terms" | "cookies";

interface LegalPageProps {
  currentDoc: LegalDocType;
  onNavigate: (doc: LegalDocType) => void;
  onGoHome: () => void;
  onOpenBooking: () => void;
  onOpenCookieSettings?: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  currentDoc,
  onNavigate,
  onGoHome,
  onOpenBooking,
  onOpenCookieSettings,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const docPaths: Record<LegalDocType, string> = {
    privacy: "/polityka-prywatnosci",
    rodo: "/rodo",
    terms: "/regulamin",
    cookies: "/polityka-cookies",
  };

  const docTitles: Record<LegalDocType, string> = {
    privacy: "Polityka Prywatności i Ochrona Danych",
    rodo: "Klauzula Informacyjna RODO",
    terms: "Regulamin Gabinetu & Bezpieczeństwo",
    cookies: "Polityka Cookies & PKE",
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://slow-skin-concept.pl";
    const fullUrl = `${origin}${docPaths[currentDoc]}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-luxury-dark selection:bg-luxury-gold/20 selection:text-luxury-dark pb-24">
      {/* Top Utility Bar */}
      <div className="bg-white/80 border-b border-luxury-sand/50 backdrop-blur-md sticky top-0 z-30 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-luxury-dark hover:text-luxury-gold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Powrót do strony</span>
            </button>
            <span className="text-luxury-sand/70 select-none hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-luxury-dark/70">
              <span>Instytut</span>
              <ChevronRight className="w-3 h-3 text-luxury-sand" />
              <span>Dokumenty Prawne</span>
              <ChevronRight className="w-3 h-3 text-luxury-sand" />
              <span className="text-luxury-gold font-semibold">{docTitles[currentDoc]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Kopiuj bezpośredni adres URL dla Facebook / Meta Ads"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-luxury-sand text-[11px] font-mono tracking-wider text-luxury-dark bg-white hover:border-luxury-gold hover:text-luxury-gold transition-all shadow-2xs cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Skopiowano link do FB!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>Kopiuj link do FB</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              title="Drukuj lub zapisz jako PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-luxury-sand text-[11px] font-mono tracking-wider text-luxury-dark bg-white hover:border-luxury-gold hover:text-luxury-gold transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="hidden md:inline">Drukuj / PDF</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-luxury-gold text-white text-[11px] font-mono uppercase tracking-wider hover:bg-luxury-gold/90 transition-all shadow-xs cursor-pointer ml-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Umów wizytę</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-gradient-to-b from-white to-[#faf8f5] border-b border-luxury-sand/50 py-10 sm:py-14 print:py-4 print:border-none">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-block cursor-pointer" onClick={onGoHome}>
            <BrandLogo className="h-10 sm:h-12 w-auto mx-auto" />
          </div>
          
          <div className="space-y-2 pt-2">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-luxury-gold uppercase font-bold block">
              SLOW SKIN CONCEPT • DOKUMENTACJA PRAWNA & BEZPIECZEŃSTWO
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl text-luxury-dark font-light tracking-tight">
              {docTitles[currentDoc]}
            </h1>
            <p className="text-xs sm:text-sm text-luxury-dark/80 max-w-2xl mx-auto leading-relaxed font-light">
              Oficjalne zasady przetwarzania danych, klauzule informacyjne oraz standardy świadczenia usług Instytutu Zdrowej Skóry w Jelczu-Laskowicach.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[10px] font-mono uppercase tracking-wider text-luxury-dark/70">
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              Status: Obowiązujący
            </span>
            <span>Wersja: 2.4 (Aktualizacja: Październik 2026)</span>
            <span>•</span>
            <span>Zgodność: RODO, PKE & Meta Policies</span>
          </div>

          {/* Facebook Link Notice */}
          <div className="mt-4 p-3 bg-luxury-sand/20 border border-luxury-sand/60 max-w-xl mx-auto text-left text-xs leading-relaxed text-luxury-dark/90 flex items-start gap-2.5 print:hidden">
            <Share2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-luxury-dark">
                Dedykowany adres URL dla stron i reklam na Facebooku / Instagramie:
              </p>
              <div className="mt-1 flex items-center gap-2">
                <code className="bg-white px-2 py-0.5 border border-luxury-sand text-[11px] font-mono text-luxury-gold select-all break-all">
                  {typeof window !== "undefined" ? window.location.origin : "https://slow-skin-concept.pl"}{docPaths[currentDoc]}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="text-[10px] font-mono text-luxury-gold hover:underline uppercase shrink-0 font-semibold cursor-pointer"
                >
                  {copiedLink ? "✓ Skopiowano" : "Kopiuj"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Document Switcher Nav Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 print:hidden">
        <nav 
          aria-label="Wybór dokumentu prawnego"
          className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-1.5 border border-luxury-sand/60 shadow-xs"
        >
          <a
            href="/polityka-prywatnosci"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("privacy");
            }}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all text-center ${
              currentDoc === "privacy"
                ? "bg-luxury-dark text-white font-medium shadow-xs"
                : "text-luxury-dark/80 hover:text-luxury-gold hover:bg-luxury-sand/20"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span className="truncate">Prywatność</span>
          </a>

          <a
            href="/rodo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("rodo");
            }}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all text-center ${
              currentDoc === "rodo"
                ? "bg-luxury-dark text-white font-medium shadow-xs"
                : "text-luxury-dark/80 hover:text-luxury-gold hover:bg-luxury-sand/20"
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span className="truncate">Klauzula RODO</span>
          </a>

          <a
            href="/regulamin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("terms");
            }}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all text-center ${
              currentDoc === "terms"
                ? "bg-luxury-dark text-white font-medium shadow-xs"
                : "text-luxury-dark/80 hover:text-luxury-gold hover:bg-luxury-sand/20"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span className="truncate">Regulamin</span>
          </a>

          <a
            href="/polityka-cookies"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("cookies");
            }}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-all text-center ${
              currentDoc === "cookies"
                ? "bg-luxury-dark text-white font-medium shadow-xs"
                : "text-luxury-dark/80 hover:text-luxury-gold hover:bg-luxury-sand/20"
            }`}
          >
            <Cookie className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
            <span className="truncate">Cookies & PKE</span>
          </a>
        </nav>
      </div>

      {/* Main Content Article */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <article className="bg-white border border-luxury-sand/70 shadow-sm p-6 sm:p-10 md:p-12 space-y-8 print:p-0 print:border-none print:shadow-none">
          
          {/* 1. POLITYKA PRYWATNOŚCI */}
          {currentDoc === "privacy" && (
            <div className="space-y-8 text-left">
              {/* Header Box */}
              <div className="border-b border-luxury-sand/50 pb-6 space-y-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
                  DOKUMENT OFICJALNY • POLITYKA PRYWATNOŚCI
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-luxury-dark font-normal">
                  Polityka Prywatności i Ochrona Danych Osobowych
                </h2>
                <p className="text-xs text-luxury-dark/70 font-mono">
                  Zgodna z Rozporządzeniem (UE) 2016/679 (RODO) oraz wymaganiami Meta Platforms (Facebook Ads & Instagram)
                </p>
              </div>

              {/* Administrator Details Highlight Box */}
              <div className="bg-[#faf8f5] border border-luxury-sand p-5 sm:p-6 space-y-3">
                <h3 className="font-serif text-base font-semibold text-luxury-dark flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                  <span>1. Administrator Danych Osobowych</span>
                </h3>
                <p className="text-xs leading-relaxed text-luxury-dark">
                  Administratorem Twoich danych osobowych jest:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1 font-mono">
                  <div className="space-y-1 bg-white p-3 border border-luxury-sand/60">
                    <p className="text-[10px] text-luxury-gold uppercase font-bold">Podmiot i Siedziba</p>
                    <p className="font-medium text-luxury-dark">Katarzyna Brzezińska</p>
                    <p className="text-luxury-dark/80">Instytut Zdrowej Skóry SLOW SKIN CONCEPT</p>
                    <p className="text-luxury-dark/80">ul. Szkolna 5, 55-220 Jelcz-Laskowice</p>
                  </div>
                  <div className="space-y-1 bg-white p-3 border border-luxury-sand/60">
                    <p className="text-[10px] text-luxury-gold uppercase font-bold">Kontakt Bezpośredni</p>
                    <p className="flex items-center gap-1.5 text-luxury-dark">
                      <Mail className="w-3 h-3 text-luxury-gold shrink-0" />
                      <a href="mailto:baumann.jelcz@wp.pl" className="underline hover:text-luxury-gold">baumann.jelcz@wp.pl</a>
                    </p>
                    <p className="flex items-center gap-1.5 text-luxury-dark">
                      <Phone className="w-3 h-3 text-luxury-gold shrink-0" />
                      <a href="tel:+48607888880" className="hover:text-luxury-gold">+48 607 888 880</a>
                    </p>
                    <p className="text-[10px] text-luxury-dark/60">Kierownik Ochrony Danych w Gabinecie</p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <section className="space-y-3 text-xs leading-relaxed text-luxury-dark font-light">
                <h3 className="font-serif text-base font-semibold text-luxury-dark">
                  2. Cele i Podstawy Prawne Przetwarzania Danych
                </h3>
                <p>
                  W ramach funkcjonowania Instytutu oraz serwisu internetowego przetwarzamy Twoje dane osobowe w następujących, ściśle określonych celach:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Obsługa rezerwacji wizyt i konsultacji (gabinet oraz online):</strong> imię, nazwisko, numer telefonu, adres e-mail oraz wybrany zabieg/termin — na podstawie <em>art. 6 ust. 1 lit. b RODO</em> (niezbędność do wykonania umowy o świadczenie usług kosmetologicznych lub podjęcie działań przed jej zawarciem).
                  </li>
                  <li>
                    <strong>Prowadzenie karty zabiegowej i kwalifikacja kosmetologiczna:</strong> informacje o stanie skóry, ewentualnych alergiach, przeciwwskazaniach i pielęgnacji domowej — na podstawie Twojej dobrowolnej i wyraźnej zgody zgodnie z <em>art. 9 ust. 2 lit. a RODO</em> (dane dotyczące zdrowia i fizjologii skóry niezbędne do zagwarantowania bezpieczeństwa zabiegowego).
                  </li>
                  <li>
                    <strong>Formularze Lead Ads oraz kampanie Facebook / Meta:</strong> w przypadku nawiązania kontaktu za pośrednictwem reklam na platformach Meta (Facebook, Instagram) przetwarzamy przekazane dane kontaktowe w celu udzielenia odpowiedzi na zapytanie i przedstawienia propozycji terminu wizyty — na podstawie <em>art. 6 ust. 1 lit. a RODO</em> (Twoja zgoda) oraz <em>art. 6 ust. 1 lit. f RODO</em> (nasz prawnie uzasadniony interes polegający na obsłudze relacji z potencjalnymi pacjentami).
                  </li>
                  <li>
                    <strong>Kameralny Dziennik (Edukacyjny Newsletter):</strong> adres e-mail przetwarzamy na podstawie Twojej dobrowolnej zgody (<em>art. 6 ust. 1 lit. a RODO</em>) w celu wysyłania poradników o pielęgnacji bionomicznej oraz powiadomień o zwolnionych terminach.
                  </li>
                  <li>
                    <strong>Rozliczenia księgowe i podatkowe:</strong> wystawianie rachunków i faktur na podstawie przepisów podatkowych (<em>art. 6 ust. 1 lit. c RODO</em>).
                  </li>
                  <li>
                    <strong>Obrona przed ewentualnymi roszczeniami:</strong> prawnie uzasadniony interes Administratora (<em>art. 6 ust. 1 lit. f RODO</em>) przez okres przewidziany kodeksem cywilnym.
                  </li>
                </ul>
              </section>

              {/* Section 3: Meta / Facebook Compliance */}
              <section className="space-y-3 text-xs leading-relaxed text-luxury-dark font-light bg-luxury-sand/15 p-5 border border-luxury-sand/70">
                <h3 className="font-serif text-base font-semibold text-luxury-dark flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-luxury-gold" />
                  <span>3. Klauzula dotycząca Mediów Społecznościowych (Facebook / Meta / Instagram)</span>
                </h3>
                <p>
                  Prowadzimy oficjalny fanpage i profil w mediach społecznościowych należących do Meta Platforms Ireland Ltd. (4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irlandia):
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Współadministrowanie danymi statystycznymi:</strong> W zakresie danych zbieranych na potrzeby statystyk strony (Page Insights) Administrator oraz Meta Platforms Ireland Ltd. działają jako współadministratorzy na zasadach określonych w art. 26 RODO. Szczegóły dotyczące podziału odpowiedzialności dostępne są pod adresem: <a href="https://www.facebook.com/legal/terms/page_controller_addendum" target="_blank" rel="noopener noreferrer" className="underline text-luxury-gold hover:text-luxury-dark">facebook.com/legal/terms/page_controller_addendum</a>.
                  </li>
                  <li>
                    <strong>Piksel Meta i analityka konwersji:</strong> Jeśli wyrazisz na to zgodę w ustawieniach plików cookies, w serwisie może być stosowany Piksel Meta w celu analizy skuteczności kampanii reklamowych oraz optymalizacji przekazu kierowanego do odbiorców zainteresowanych regeneracją skóry.
                  </li>
                  <li>
                    <strong>Formularze Błyskawiczne (Lead Ads):</strong> Przesłanie formularza kontaktowego w serwisie Facebook jest całkowicie dobrowolne. Dane z formularza trafiają bezpośrednio do chronionej skrzynki pocztowej gabinetu i nie są udostępniane innym firmom.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="space-y-3 text-xs leading-relaxed text-luxury-dark font-light">
                <h3 className="font-serif text-base font-semibold text-luxury-dark">
                  4. Okres Przechowywania Danych (Retencja)
                </h3>
                <p>
                  Dane osobowe przechowujemy przez okres nie dłuższy niż jest to konieczne:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong>Dane rezerwacyjne i historia zabiegów:</strong> przez okres świadczenia usług oraz do 5 lat od ostatniej wizyty (w celach archiwizacji historii terapii oraz przedawnienia ewentualnych roszczeń).</li>
                  <li><strong>Zgody marketingowe i newsletter:</strong> do momentu cofnięcia zgody przez użytkownika.</li>
                  <li><strong>Dane księgowe:</strong> przez okres 5 lat licząc od końca roku kalendarzowego, w którym upłynął termin płatności podatku.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className="space-y-3 text-xs leading-relaxed text-luxury-dark font-light">
                <h3 className="font-serif text-base font-semibold text-luxury-dark">
                  5. Odbiorcy Danych i Przekazywanie Poza EOG
                </h3>
                <p>
                  Twoje dane osobowe mogą być przekazywane wyłącznie zaufanym partnerom technicznym wspierającym działanie gabinetu:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dostawcy bezpiecznego hostingu i infrastruktury chmurowej w Unii Europejskiej,</li>
                  <li>Dostawcy oprogramowania kalendarzowego i poczty elektronicznej (Google Workspace z gwarancją standardowych klauzul umownych UE),</li>
                  <li>Biuro rachunkowo-księgowe obsługujące gabinet,</li>
                  <li>Dostawcy bramek płatniczych (jeśli dotyczy zakupu w sklepie).</li>
                </ul>
                <p>
                  Nie sprzedajemy, nie wymieniamy i nie udostępniamy Twoich danych podmiotom trzecim na cele komercyjne ani brokerskie.
                </p>
              </section>

              {/* Section 6 */}
              <section className="space-y-3 text-xs leading-relaxed text-luxury-dark font-light bg-white border border-luxury-sand/80 p-5">
                <h3 className="font-serif text-base font-semibold text-luxury-dark">
                  6. Twoje Prawa Zgodnie z RODO
                </h3>
                <p>Każdej osobie, której dane dotyczą, przysługują następujące uprawnienia:</p>
                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[#faf8f5] border border-luxury-sand/50">
                    <p className="font-medium text-luxury-dark">Prawo dostępu i sprostowania</p>
                    <p className="text-[11px] text-luxury-dark/80">Wgląd w treść swoich danych oraz żądanie ich poprawienia, gdy są nieaktualne.</p>
                  </div>
                  <div className="p-3 bg-[#faf8f5] border border-luxury-sand/50">
                    <p className="font-medium text-luxury-dark">Prawo do usunięcia („bycia zapomnianym”)</p>
                    <p className="text-[11px] text-luxury-dark/80">Żądanie skasowania danych, o ile ich dalsze przechowywanie nie wynika z przepisów prawa.</p>
                  </div>
                  <div className="p-3 bg-[#faf8f5] border border-luxury-sand/50">
                    <p className="font-medium text-luxury-dark">Prawo do ograniczenia i sprzeciwu</p>
                    <p className="text-[11px] text-luxury-dark/80">Możliwość wstrzymania operacji na danych lub sprzeciwu wobec przetwarzania.</p>
                  </div>
                  <div className="p-3 bg-[#faf8f5] border border-luxury-sand/50">
                    <p className="font-medium text-luxury-dark">Prawo do cofnięcia zgody</p>
                    <p className="text-[11px] text-luxury-dark/80">Wycofanie zgody w dowolnym momencie bez wpływu na zgodność z prawem przed jej wycofaniem.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-luxury-sand/40 text-xs">
                  <p>
                    W celu realizacji powyższych praw wystarczy wysłać krótką wiadomość e-mail na adres:{" "}
                    <a href="mailto:baumann.jelcz@wp.pl" className="font-mono text-luxury-gold underline hover:text-luxury-dark font-semibold">
                      baumann.jelcz@wp.pl
                    </a>.
                  </p>
                  <p className="pt-1 text-luxury-dark/80">
                    Przysługuje Ci również prawo wniesienia skargi do organu nadzorczego: <strong>Prezes Urzędu Ochrony Danych Osobowych (PUODO)</strong>, ul. Stawki 2, 00-193 Warszawa.
                  </p>
                </div>
              </section>
            </div>
          )}

          {/* 2. KLAUZULA RODO */}
          {currentDoc === "rodo" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-luxury-sand/50 pb-6 space-y-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
                  DOKUMENT OFICJALNY • KLAUZULA INFORMACYJNA
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-luxury-dark font-normal">
                  Klauzula Informacyjna RODO dla Pacjentów Gabinetu
                </h2>
                <p className="text-xs text-luxury-dark/70 font-mono">
                  Zgodna z art. 13 i art. 14 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679
                </p>
              </div>

              <div className="p-4 bg-luxury-sand/20 border-l-2 border-luxury-gold text-xs leading-relaxed text-luxury-dark">
                Wypełniając obowiązek prawny nałożony przepisami RODO, poniżej przedstawiamy czytelną tabelę informującą, w jaki sposób, w jakich celach oraz jak długo Instytut Zdrowej Skóry SLOW SKIN CONCEPT przetwarza Twoje dane.
              </div>

              {/* RODO Summary Table */}
              <div className="overflow-x-auto border border-luxury-sand/70">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-luxury-sand/30 font-mono text-[10px] uppercase tracking-wider text-luxury-dark border-b border-luxury-sand">
                      <th className="p-3 border-r border-luxury-sand/50">Cel przetwarzania</th>
                      <th className="p-3 border-r border-luxury-sand/50">Podstawa prawna</th>
                      <th className="p-3 border-r border-luxury-sand/50">Okres przechowywania</th>
                      <th className="p-3">Dobrowolność podania</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-sand/40 font-light">
                    <tr className="hover:bg-luxury-sand/10">
                      <td className="p-3 border-r border-luxury-sand/50 font-medium text-luxury-dark">
                        Rezerwacja terminu, kontakt przedwizytowy i wykonanie zabiegu
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Art. 6 ust. 1 lit. b RODO (umowa/działania przedumowne)
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Okres realizacji usługi oraz przedawnienia roszczeń
                      </td>
                      <td className="p-3 text-luxury-gold font-medium">
                        Warunek konieczny do zapisu na zabieg
                      </td>
                    </tr>
                    <tr className="hover:bg-luxury-sand/10">
                      <td className="p-3 border-r border-luxury-sand/50 font-medium text-luxury-dark">
                        Wywiad kosmetologiczny, przeciwwskazania i karta zdrowia skóry
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Art. 9 ust. 2 lit. a RODO (wyraźna zgoda pacjenta)
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Do 5 lat od ostatniej wizyty lub wycofania zgody
                      </td>
                      <td className="p-3 text-luxury-gold font-medium">
                        Dobrowolne, ale niezbędne dla bezpieczeństwa zabiegu
                      </td>
                    </tr>
                    <tr className="hover:bg-luxury-sand/10">
                      <td className="p-3 border-r border-luxury-sand/50 font-medium text-luxury-dark">
                        Formularze reklamowe Meta / Facebook Lead Ads
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Art. 6 ust. 1 lit. a RODO (zgoda użytkownika)
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Do zakończenia kontaktu lub wycofania zgody
                      </td>
                      <td className="p-3">
                        Dobrowolne
                      </td>
                    </tr>
                    <tr className="hover:bg-luxury-sand/10">
                      <td className="p-3 border-r border-luxury-sand/50 font-medium text-luxury-dark">
                        Kameralny Dziennik (Edukacyjny Newsletter)
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Art. 6 ust. 1 lit. a RODO (zgoda na newsletter)
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Do momentu wypisania się (odwołania zgody)
                      </td>
                      <td className="p-3">
                        Całkowicie dobrowolne
                      </td>
                    </tr>
                    <tr className="hover:bg-luxury-sand/10">
                      <td className="p-3 border-r border-luxury-sand/50 font-medium text-luxury-dark">
                        Wystawianie faktur i rachunków fiskalnych
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        Art. 6 ust. 1 lit. c RODO (obowiązek prawny z ustaw podatkowych)
                      </td>
                      <td className="p-3 border-r border-luxury-sand/50">
                        5 lat licząc od końca roku podatkowego
                      </td>
                      <td className="p-3 text-luxury-gold font-medium">
                        Obowiązek ustawowy
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Patient Rights in RODO */}
              <div className="space-y-4 text-xs leading-relaxed text-luxury-dark font-light">
                <h3 className="font-serif text-base font-semibold text-luxury-dark">
                  Prawa Pacjenta w Związku z Przetwarzaniem Danych
                </h3>
                <p>
                  Przysługuje Ci prawo do:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li><strong>Dostępu do danych</strong> oraz otrzymania ich kopii;</li>
                  <li><strong>Sprostowania (poprawiania)</strong> nieprawidłowych lub niekompletnych danych;</li>
                  <li><strong>Usunięcia danych</strong> („prawo do bycia zapomnianym”) w przypadkach przewidzianych prawem;</li>
                  <li><strong>Ograniczenia przetwarzania</strong> w granicach art. 18 RODO;</li>
                  <li><strong>Wniesienia sprzeciwu</strong> wobec przetwarzania opartego na prawnie uzasadnionym interesie;</li>
                  <li><strong>Cofnięcia zgody</strong> w dowolnym momencie bez wpływu na legalność wcześniejszego przetwarzania;</li>
                  <li><strong>Wniesienia skargi do organu nadzorczego</strong> — Urzędu Ochrony Danych Osobowych (UODO).</li>
                </ol>

                <div className="p-4 bg-white border border-luxury-sand/70 space-y-1 text-xs">
                  <p className="font-medium text-luxury-dark">Adres korespondencyjny do realizacji praw:</p>
                  <p>SLOW SKIN CONCEPT Katarzyna Brzezińska, ul. Szkolna 5, 55-220 Jelcz-Laskowice</p>
                  <p>Adres e-mail: <a href="mailto:baumann.jelcz@wp.pl" className="text-luxury-gold underline">baumann.jelcz@wp.pl</a></p>
                </div>
              </div>
            </div>
          )}

          {/* 3. REGULAMIN */}
          {currentDoc === "terms" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-luxury-sand/50 pb-6 space-y-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
                  DOKUMENT OFICJALNY • REGULAMIN GABINETU
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-luxury-dark font-normal">
                  Regulamin Świadczenia Usług i Etyka Zabiegowa
                </h2>
                <p className="text-xs text-luxury-dark/70 font-mono">
                  Instytut Zdrowej Skóry SLOW SKIN CONCEPT w Jelczu-Laskowicach
                </p>
              </div>

              {/* Philosophy Callout */}
              <div className="bg-[#faf8f5] border border-luxury-sand p-5 space-y-2">
                <h3 className="font-serif text-sm font-semibold text-luxury-dark flex items-center gap-2">
                  <Scale className="w-4 h-4 text-luxury-gold" />
                  <span>Idea Slow Beauty & Gabinet na Wyłączność</span>
                </h3>
                <p className="text-xs leading-relaxed text-luxury-dark font-light">
                  Nasz Instytut powstał z szacunku do fizjologii skóry i intymności człowieka. Aby zapewnić Ci pełne bezpieczeństwo, dyskrecję i ciszę sensoryczną, w trakcie Twojej wizyty gabinet oraz poczekalnia są zarezerwowane wyłącznie dla Ciebie. Opiekę prowadzi osobiście Katarzyna Brzezińska.
                </p>
              </div>

              <div className="space-y-6 text-xs leading-relaxed text-luxury-dark font-light">
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                    § 1. Postanowienia Ogólne
                  </h4>
                  <p>
                    1. Niniejszy regulamin określa zasady rezerwacji terminów, kwalifikacji zabiegowej oraz świadczenia usług kosmetologicznych w Instytucie Zdrowej Skóry SLOW SKIN CONCEPT z siedzibą przy ul. Szkolnej 5, 55-220 Jelcz-Laskowice.
                  </p>
                  <p>
                    2. Każda osoba korzystająca z usług gabinetu oświadcza, że zapoznała się z niniejszym regulaminem i akceptuje jego postanowienia.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                    § 2. Rezerwacja Terminów i Polityka Odwoływania Wizyt
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <strong>Rezerwacja online:</strong> Wysłanie zgłoszenia za pośrednictwem strony lub formularza reklamowego stanowi rezerwację terminu. Gabinet potwierdza wizytę wiadomością SMS lub telefonicznie.
                    </li>
                    <li>
                      <strong>Punktualność:</strong> Z uwagi na rezerwację gabinetu na wyłączność i zachowanie buforu sterylizacji pomieszczeń, prosimy o przybycie na wyznaczoną godzinę. Spóźnienie powyżej 15 minut może skutkować koniecznością skrócenia zabiegu z zachowaniem pełnej odpłatności.
                    </li>
                    <li>
                      <strong>Odwoływanie wizyt:</strong> Ewentualną rezygnację lub zmianę terminu należy zgłosić najpóźniej na <strong>24 godziny przed planowaną wizytą</strong> pod numerem telefonu: +48 607 888 880. Szanujmy wzajemnie swój czas i terminy innych oczekujących pacjentów.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                    § 3. Kwalifikacja Zabiegowa i Bezpieczeństwo Zdrowotne
                  </h4>
                  <p>
                    1. Przed przystąpieniem do procedury zabiegowej przeprowadzana jest diagnoza oraz szczegółowy wywiad kosmetologiczny. Pacjent zobowiązany jest do poinformowania o wszelkich schorzeniach, przyjmowanych lekach, ciążach, alergiach oraz przebytych zabiegach estetycznych.
                  </p>
                  <p>
                    2. Specjalista ma prawo odmówić wykonania zabiegu lub zaproponować alternatywną procedurę terapeutyczną, jeżeli aktualny stan naskórka, uszkodzenie bariery hydrolipidowej lub stan zdrowia pacjenta stwarza ryzyko powikłań.
                  </p>
                  <p>
                    3. Zatajenie informacji o stanie zdrowia zwalnia gabinet z odpowiedzialności za ewentualne niepożądane reakcje skóry.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                    § 4. Standardy Bionomiczne i Higieniczne
                  </h4>
                  <p>
                    1. W Instytucie stosowane są wyłącznie certyfikowane preparaty o czystości bionomicznej (wolne od olejów mineralnych, parabenów, sztucznych barwników i agresywnych substancji zapachowych).
                  </p>
                  <p>
                    2. Wszelkie narzędzia wielorazowe podlegają procedurze dezynfekcji i sterylizacji w autoklawie medycznym klasy B, a materiały jednorazowe są utylizowane zgodnie z normami sanitarnymi.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                    § 5. Konsultacje Online i Diagnoza Cyfrowa
                  </h4>
                  <p>
                    1. Wideokonsultacje oraz internetowy Paszport Skóry mają charakter doradczy i edukacyjny z zakresu prawidłowej pielęgnacji bionomicznej i nie zastępują bezpośredniej konsultacji lekarskiej w przypadku ostrych dermatoz chorobowych.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                    § 6. Reklamacje i Postanowienia Końcowe
                  </h4>
                  <p>
                    1. Wszelkie uwagi i reklamacje można zgłaszać pisemnie lub drogą mailową na adres: <a href="mailto:baumann.jelcz@wp.pl" className="underline text-luxury-gold">baumann.jelcz@wp.pl</a>. Gabinet ustosunkuje się do zgłoszenia w terminie do 14 dni kalendarzowych.
                  </p>
                  <p>
                    2. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy Kodeksu Cywilnego.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. POLITYKA COOKIES */}
          {currentDoc === "cookies" && (
            <div className="space-y-8 text-left">
              <div className="border-b border-luxury-sand/50 pb-6 space-y-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
                  DOKUMENT OFICJALNY • POLITYKA PLIKÓW COOKIES
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-luxury-dark font-normal">
                  Polityka Plików Cookies i Podobnych Technologii
                </h2>
                <p className="text-xs text-luxury-dark/70 font-mono">
                  Sporządzona w standardzie art. 399 Prawa komunikacji elektronicznej (PKE) oraz RODO
                </p>
              </div>

              {/* Action Box to Open Cookie Settings */}
              <div className="bg-[#faf8f5] border border-luxury-sand p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-serif text-sm font-semibold text-luxury-dark">
                    Twoje Aktualne Ustawienia Zgód
                  </p>
                  <p className="text-xs text-luxury-dark/80 font-light">
                    W każdej chwili możesz zmienić lub wycofać wcześniej udzielone zgody na pliki cookies.
                  </p>
                </div>
                {onOpenCookieSettings && (
                  <button
                    onClick={onOpenCookieSettings}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-dark text-white font-mono text-[10.5px] uppercase tracking-wider hover:bg-luxury-gold transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Zmień zgody cookies</span>
                  </button>
                )}
              </div>

              <div className="space-y-6 text-xs leading-relaxed text-luxury-dark font-light">
                <div className="space-y-2">
                  <h3 className="font-serif text-base font-semibold text-luxury-dark">
                    1. Czym są pliki cookies i w jakim celu ich używamy?
                  </h3>
                  <p>
                    Pliki cookies (tzw. „ciasteczka”) to małe pliki tekstowe zapisywane na Twoim urządzeniu (komputerze, smartfonie, tablecie) podczas przeglądania naszej witryny. Wykorzystujemy je do zagwarantowania prawidłowego funkcjonowania witryny, zapamiętania wybranych opcji dostępności (WCAG) oraz — wyłącznie po uzyskaniu Twojej zgody — do analizy statystyk odwiedzin i dopasowania treści reklamowych.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif text-base font-semibold text-luxury-dark">
                    2. Kategorie Wykorzystywanych Plików Cookies
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-white border border-luxury-sand/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-luxury-dark font-serif text-sm">
                          Pliki Niezbędne (Techniczne) — Zawsze Aktywne
                        </span>
                        <span className="text-[9px] font-mono bg-luxury-dark text-white px-2 py-0.5 uppercase">
                          Wymagane
                        </span>
                      </div>
                      <p className="text-luxury-dark/80">
                        Niezbędne do bezpiecznego wyświetlania serwisu, obsługi sesji, zapamiętania wyborów zgody (mechanizm CMP) oraz ochrony przed atakami typu CSRF. Działają w oparciu o art. 399 ust. 3 Prawa komunikacji elektronicznej.
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-luxury-sand/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-luxury-dark font-serif text-sm">
                          Pliki Funkcjonalne & Dostępność
                        </span>
                        <span className="text-[9px] font-mono bg-luxury-sand/40 text-luxury-dark px-2 py-0.5 uppercase font-medium">
                          Opcjonalne (Zgoda)
                        </span>
                      </div>
                      <p className="text-luxury-dark/80">
                        Umożliwiają zapamiętanie preferencji użytkownika, takich jak tryb wysokiego kontrastu, rozmiar czcionki (WCAG) czy wybrany język tłumaczenia.
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-luxury-sand/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-luxury-dark font-serif text-sm">
                          Pliki Analityczne & Statystyczne
                        </span>
                        <span className="text-[9px] font-mono bg-luxury-sand/40 text-luxury-dark px-2 py-0.5 uppercase font-medium">
                          Opcjonalne (Zgoda)
                        </span>
                      </div>
                      <p className="text-luxury-dark/80">
                        Pozwalają badać ruch w serwisie (np. najczęściej czytane artykuły o barierze hydrolipidowej) w sposób zagregowany i zanonimizowany, ułatwiając rozwój platformy.
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-luxury-sand/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-luxury-dark font-serif text-sm">
                          Pliki Marketingowe & Piksel Meta / Facebook
                        </span>
                        <span className="text-[9px] font-mono bg-luxury-sand/40 text-luxury-dark px-2 py-0.5 uppercase font-medium">
                          Opcjonalne (Zgoda)
                        </span>
                      </div>
                      <p className="text-luxury-dark/80">
                        Umożliwiają mierzenie efektywności kampanii prowadzonych na Facebooku i Instagramie oraz kierowanie propozycji zabiegowych do osób, które odwiedziły naszą stronę.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-base font-semibold text-luxury-dark">
                    3. Zarządzanie Plikami Cookies w Przeglądarce
                  </h3>
                  <p>
                    Użytkownik może w każdej chwili zablokować lub usunąć pliki cookies bezpośrednio w ustawieniach swojej przeglądarki internetowej:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Google Chrome:</strong> Ustawienia → Prywatność i bezpieczeństwo → Pliki cookie</li>
                    <li><strong>Apple Safari:</strong> Preferencje → Prywatność → Blokuj wszystkie cookie</li>
                    <li><strong>Mozilla Firefox:</strong> Opcje → Prywatność i bezpieczeństwo → Ciasteczka</li>
                    <li><strong>Microsoft Edge:</strong> Ustawienia → Pliki cookie i uprawnienia witryny</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Footer of the Document Card */}
          <div className="pt-8 border-t border-luxury-sand/60 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="text-[11px] font-mono text-luxury-dark/70">
              Instytut Zdrowej Skóry SLOW SKIN CONCEPT • ul. Szkolna 5, Jelcz-Laskowice
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 border border-luxury-sand text-luxury-dark font-mono text-[10.5px] uppercase tracking-wider hover:border-luxury-gold hover:text-luxury-gold transition-all bg-white cursor-pointer shadow-2xs"
              >
                {copiedLink ? "✓ Skopiowano link" : "Kopiuj link do FB"}
              </button>
              <button
                onClick={onGoHome}
                className="px-5 py-2 bg-luxury-dark text-white font-mono text-[10.5px] uppercase tracking-wider hover:bg-luxury-gold transition-colors cursor-pointer shadow-2xs"
              >
                Powrót do strony
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default LegalPage;
