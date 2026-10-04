import React from "react";
import { motion } from "motion/react";
import { X, ShieldCheck, Cookie, Sliders, ExternalLink, Printer } from "lucide-react";

interface CookiesPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export const CookiesPolicyModal: React.FC<CookiesPolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 bg-luxury-dark/80 backdrop-blur-md z-[100000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white"
      id="cookies-policy-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookies-policy-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-[#faf8f5] border-2 border-luxury-gold/50 shadow-2xl max-w-4xl w-full relative max-h-[92vh] flex flex-col my-auto rounded-none overflow-hidden print:border-none print:shadow-none print:max-h-none print:bg-white"
        id="cookies-policy-card"
      >
        {/* Sticky Header with Actions */}
        <div className="p-4 sm:p-6 border-b border-luxury-sand/60 bg-white/90 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-20 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30">
              <Cookie className="w-5 h-5 text-luxury-gold" />
            </div>
            <div>
              <span className="font-mono text-[8.5px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
                SLOW SKIN CONCEPT™ • POLITYKA PRYWATNOŚCI & COOKIES
              </span>
              <h2
                id="cookies-policy-title"
                className="font-serif text-lg sm:text-xl text-luxury-dark font-medium leading-tight"
              >
                Polityka cookies i podobnych technologii
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSettings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                title="Dostosuj preferencje zgód"
              >
                <Sliders className="w-3.5 h-3.5 text-luxury-gold" />
                <span>Zmień ustawienia cookies</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="p-2 text-luxury-dark/70 hover:text-luxury-dark hover:bg-luxury-sand/30 transition-colors cursor-pointer"
              title="Drukuj politykę"
              aria-label="Drukuj politykę cookies"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-luxury-dark/70 hover:text-luxury-dark hover:bg-luxury-sand/30 transition-colors cursor-pointer"
              title="Zamknij"
              aria-label="Zamknij okno"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 md:p-10 overflow-y-auto space-y-8 text-luxury-dark text-xs sm:text-[13px] leading-relaxed font-sans print:overflow-visible">
          {/* Subheader document metadata */}
          <div className="bg-white p-5 border border-luxury-sand/60 shadow-xs space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-luxury-sand/30 pb-3">
              <span className="font-serif text-base sm:text-lg text-luxury-dark font-medium">
                dla serwisów <span className="text-luxury-gold font-mono">slow-skin.pl</span> oraz <span className="text-luxury-gold font-mono">slow-skin.eu</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest bg-luxury-sand/20 text-luxury-dark px-2.5 py-1 font-bold border border-luxury-sand/40">
                Wersja 1.0 • Obowiązuje od 3 września 2026 r.
              </span>
            </div>
            <p className="text-[11px] text-luxury-dark/80 font-mono">
              Dokument sporządzony w standardzie zgodnym z art. 399 Prawa komunikacji elektronicznej oraz art. 6 i 13 RODO.
            </p>
          </div>

          {/* Quick jump banner to open Cookie Settings */}
          {onOpenSettings && (
            <div className="p-4 bg-luxury-sand/15 border border-luxury-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-luxury-gold shrink-0" />
                <span className="text-[11px] text-luxury-dark">
                  Chcesz natychmiast zmodyfikować swoje zgody lub sprawdzić stan aktywnych kategorii?
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="px-4 py-2 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                Zmień ustawienia cookies ↗
              </button>
            </div>
          )}

          {/* 1. Zakres i administrator */}
          <section className="space-y-3" id="sekcja-1">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">01.</span> Zakres i administrator
            </h3>
            <p>
              Niniejsza Polityka cookies wyjaśnia, w jaki sposób w serwisach internetowych{" "}
              <strong>https://slow-skin.pl/</strong> i <strong>https://slow-skin.eu/</strong> (łącznie „Serwisy”)
              używane są pliki cookies oraz podobne technologie, jakie informacje mogą być przy ich pomocy przetwarzane
              i jak użytkownik może zarządzać swoimi wyborami.
            </p>
            <div className="bg-white p-4 border border-luxury-sand/60 space-y-1 text-xs">
              <p className="font-semibold text-luxury-dark">
                Administratorem danych osobowych związanych z korzystaniem z Serwisów jest:
              </p>
              <p className="text-luxury-dark">
                <strong>SLOW SKIN CONCEPT KATARZYNA BRZEZIŃSKA</strong>
              </p>
              <p className="text-luxury-dark/90">ul. Szkolna 5, 55-220 Jelcz-Laskowice</p>
              <p className="text-luxury-dark/90 font-mono text-[11px]">NIP: 9121697542 („Administrator”)</p>
              <p className="text-luxury-dark/90 pt-1">
                <strong>Kontakt w sprawach prywatności:</strong> tel.{" "}
                <a href="tel:+48793088854" className="text-luxury-gold hover:underline font-mono">
                  793 088 854
                </a>
                , e-mail:{" "}
                <a href="mailto:kontakt@slowskinconcept.pl" className="text-luxury-gold hover:underline font-mono">
                  kontakt@slowskinconcept.pl
                </a>
              </p>
            </div>
            <p className="text-luxury-dark/90">
              Jeżeli określony dostawca samodzielnie ustala cele i sposoby przetwarzania danych — na przykład operator
              portalu społecznościowego po przejściu użytkownika na jego stronę — może działać jako odrębny administrator
              zgodnie z własną polityką prywatności.
            </p>
          </section>

          {/* 2. Czym są cookies i podobne technologie */}
          <section className="space-y-3" id="sekcja-2">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">02.</span> Czym są cookies i podobne technologie
            </h3>
            <p>
              Cookies to niewielkie informacje tekstowe zapisywane na urządzeniu użytkownika albo odczytywane z tego
              urządzenia podczas korzystania z serwisu. Mogą mieć charakter sesyjny — usuwany po zamknięciu przeglądarki —
              albo trwały, działający przez oznaczony czas lub do ich usunięcia.
            </p>
            <p>
              Podobne cele mogą realizować także pamięć <em>localStorage</em> lub <em>sessionStorage</em>, identyfikatory
              urządzenia, piksele, tagi, skrypty, identyfikatory reklamowe i inne mechanizmy pozwalające zapisać informację
              na urządzeniu albo odczytać informację już zapisaną. W tej Polityce określenie „cookies” obejmuje również te
              technologie, o ile z kontekstu nie wynika inaczej.
            </p>
            <p className="text-luxury-dark/90 italic bg-luxury-sand/10 p-3 border-l-2 border-luxury-gold">
              Nie każdy zewnętrzny zasób jest plikiem cookie. Przykładowo pobranie czcionki z zewnętrznego serwera może
              ujawnić temu serwerowi adres IP i dane techniczne połączenia, nawet jeżeli cookie nie zostanie zapisane.
            </p>
          </section>

          {/* 3. Zasady stosowania cookies */}
          <section className="space-y-3" id="sekcja-3">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">03.</span> Zasady stosowania cookies
            </h3>
            <p>
              <strong>Cookies niezbędne</strong> mogą działać bez zgody wyłącznie wtedy, gdy są konieczne do transmisji
              komunikatu elektronicznego albo do dostarczenia usługi świadczonej drogą elektroniczną, której użytkownik
              wyraźnie zażądał. Obejmują one w szczególności zabezpieczenie serwisu, utrzymanie sesji, zapamiętanie wyboru
              dotyczącego cookies lub wykonanie funkcji formularza niezbędnej do wysłania wiadomości.
            </p>
            <p>
              <strong>Wszystkie cookies opcjonalne</strong> — funkcjonalne, analityczne i reklamowe — są uruchamiane
              dopiero po uprzedniej zgodzie odpowiedniej kategorii. Zgoda jest dobrowolna, konkretna, świadoma i
              jednoznaczna. Odmowa cookies opcjonalnych nie ogranicza dostępu do podstawowej treści Serwisów.
            </p>
            <p>
              Użytkownik może w każdej chwili zmienić lub wycofać zgodę za pomocą stałego linku{" "}
              <strong>„Zmień ustawienia cookies”</strong> dostępnego w stopce Serwisów lub za pomocą dedykowanego dymka
              Cookies w lewym dolnym rogu ekranu. Wycofanie zgody nie wpływa na zgodność wcześniejszego przetwarzania z
              prawem. Po wycofaniu zgody Serwis zaprzestaje uruchamiania odpowiednich technologii; użytkownik może także
              usunąć wcześniej zapisane cookies w ustawieniach przeglądarki.
            </p>
          </section>

          {/* 4. Kategorie technologii */}
          <section className="space-y-3" id="sekcja-4">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">04.</span> Kategorie technologii
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-luxury-sand/60 bg-white">
                <thead>
                  <tr className="bg-luxury-sand/20 font-mono text-[10px] uppercase tracking-wider text-luxury-dark border-b border-luxury-sand/60">
                    <th className="p-3 border-r border-luxury-sand/60">Kategoria</th>
                    <th className="p-3 border-r border-luxury-sand/60">Cel</th>
                    <th className="p-3">Czy wymaga zgody</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-sand/40 text-xs">
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60 whitespace-nowrap">
                      Niezbędne
                    </td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      bezpieczeństwo, transmisja, działanie żądanej funkcji, zapamiętanie preferencji zgody
                    </td>
                    <td className="p-3 font-medium text-emerald-800">
                      nie — tylko w granicach technicznej konieczności
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60 whitespace-nowrap">
                      Funkcjonalne
                    </td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      dodatkowe funkcje, osadzone treści, mapy, odtwarzacze, czat, personalizacja
                    </td>
                    <td className="p-3 font-medium text-amber-900">
                      tak, jeżeli nie są konieczne do funkcji wyraźnie żądanej przez użytkownika
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60 whitespace-nowrap">
                      Analityczne
                    </td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      pomiar odwiedzin, źródeł ruchu, błędów i sposobu korzystania z serwisu
                    </td>
                    <td className="p-3 font-medium text-amber-900">tak</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60 whitespace-nowrap">
                      Reklamowe
                    </td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      profilowanie, remarketing, pomiar kampanii, łączenie aktywności pomiędzy serwisami
                    </td>
                    <td className="p-3 font-medium text-amber-900">tak</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-luxury-dark/80">
              Samo nazwanie cookie „funkcjonalnym” lub „analitycznym” nie decyduje o jego statusie. O konieczności zgody
              przesądza rzeczywisty cel i niezbędność dla usługi żądanej przez użytkownika.
            </p>
          </section>

          {/* 5. Aktualny wykaz dla slow-skin.pl */}
          <section className="space-y-3" id="sekcja-5">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">05.</span> Aktualny wykaz dla slow-skin.pl
            </h3>
            <p>
              Według audytu publicznej strony głównej wykonanego 3 września 2026 r. przed jakąkolwiek interakcją
              użytkownika nie wykryto cookies dostępnych z poziomu JavaScript, wpisów localStorage ani sessionStorage. Nie
              wykryto też uruchomionych tagów Google Analytics, Google Ads, Google Tag Manager ani piksela Meta. Wynik
              dotyczy badanego widoku, urządzenia i momentu; nie obejmuje panelu administracyjnego ani funkcji
              uruchamianych dopiero po działaniu użytkownika.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-luxury-sand/60 bg-white">
                <thead>
                  <tr className="bg-luxury-sand/20 font-mono text-[10px] uppercase tracking-wider text-luxury-dark border-b border-luxury-sand/60">
                    <th className="p-3 border-r border-luxury-sand/60">Technologia / dostawca</th>
                    <th className="p-3 border-r border-luxury-sand/60">Status i cel</th>
                    <th className="p-3">Dane / czas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-sand/40 text-xs">
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">WordPress 6.8.8</td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      system zarządzania treścią; w publicznym widoku nie wykryto cookie. Cookies logowania dotyczą
                      wyłącznie uprawnionych administratorów panelu.
                    </td>
                    <td className="p-3 text-luxury-dark/90">dane techniczne i logi serwera; okres ustala hosting</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Elementor 3.32.1</td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      budowa i prezentacja strony; w badanym widoku nie wykryto własnego cookie ani pamięci przeglądarki
                    </td>
                    <td className="p-3 text-luxury-dark/90">brak wykrytego identyfikatora po stronie urządzenia</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Contact Form 7 6.1.1</td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      obsługa formularzy kontaktowych; w badanym widoku nie wykryto własnego cookie
                    </td>
                    <td className="p-3 text-luxury-dark/90">dane podane w formularzu są opisane w Polityce prywatności</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Google Fonts — Google LLC</td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      zewnętrzne pobranie arkusza fontów z fonts.googleapis.com i plików z fonts.gstatic.com; nie
                      wykryto cookie
                    </td>
                    <td className="p-3 text-luxury-dark/90">
                      adres IP, nagłówki i dane techniczne połączenia; okres po stronie Google
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Facebook i Instagram</td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      na badanej stronie są zwykłe odnośniki. Sam link nie uruchamiał skryptów Meta; po kliknięciu
                      obowiązują zasady operatora platformy.
                    </td>
                    <td className="p-3 text-luxury-dark/90">
                      dane są przekazywane platformie dopiero po przejściu na jej stronę
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Materiały wideo</td>
                    <td className="p-3 border-r border-luxury-sand/60">
                      pliki multimedialne są dostarczane z domeny slow-skin.pl; nie wykryto zewnętrznego odtwarzacza
                      śledzącego
                    </td>
                    <td className="p-3 text-luxury-dark/90">logi serwera i dane transmisyjne</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-200 p-3 text-xs text-emerald-950 font-medium">
              <strong>Stan na dzień audytu:</strong> Nie są obecnie zadeklarowane jako aktywne żadne opcjonalne cookies
              analityczne lub reklamowe. Jeżeli zostaną wdrożone, tabela zostanie zaktualizowana przed ich uruchomieniem,
              a skrypty będą blokowane do czasu uzyskania zgody.
            </div>
          </section>

          {/* 6. Aktualny wykaz dla slow-skin.eu */}
          <section className="space-y-3" id="sekcja-6">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">06.</span> Aktualny wykaz dla slow-skin.eu
            </h3>
            <p>
              W czasie audytu 3 września 2026 r. domena <strong>slow-skin.eu</strong> zwracała odpowiedź „502 Bad Gateway”
              i nie udostępniała treści serwisu. Z tego powodu nie było możliwe ustalenie faktycznie używanych cookies i
              dostawców. Przed uruchomieniem domeny jej konfiguracja zostanie sprawdzona, a poniższy wykaz uzupełniony.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-luxury-sand/60 bg-white">
                <thead>
                  <tr className="bg-luxury-sand/20 font-mono text-[10px] uppercase tracking-wider text-luxury-dark border-b border-luxury-sand/60">
                    <th className="p-3 border-r border-luxury-sand/60">Kategoria</th>
                    <th className="p-3 border-r border-luxury-sand/60">Stan</th>
                    <th className="p-3">Warunek uruchomienia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-sand/40 text-xs">
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Niezbędne</td>
                    <td className="p-3 border-r border-luxury-sand/60 text-amber-800">do potwierdzenia po uruchomieniu</td>
                    <td className="p-3">wyłącznie technologie rzeczywiście konieczne do żądanej usługi</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Funkcjonalne</td>
                    <td className="p-3 border-r border-luxury-sand/60 text-amber-800">niepotwierdzone</td>
                    <td className="p-3">blokada do czasu zgody, chyba że funkcja spełnia wyjątek konieczności</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Analityczne</td>
                    <td className="p-3 border-r border-luxury-sand/60 text-amber-800">niepotwierdzone</td>
                    <td className="p-3">blokada do czasu zgody analitycznej</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold border-r border-luxury-sand/60">Reklamowe</td>
                    <td className="p-3 border-r border-luxury-sand/60 text-amber-800">niepotwierdzone</td>
                    <td className="p-3">blokada do czasu zgody reklamowej</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-luxury-dark/80">
              Do czasu wykonania audytu użytkownik nie powinien interpretować tej sekcji jako potwierdzenia, że slow-skin.eu
              nie używa żadnych cookies. Administrator opublikuje aktualny wykaz wraz z uruchomieniem serwisu.
            </p>
          </section>

          {/* 7. Dane osobowe i podstawy prawne */}
          <section className="space-y-3" id="sekcja-7">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">07.</span> Dane osobowe i podstawy prawne
            </h3>
            <p>
              Cookies i logi mogą wiązać się z adresem IP, identyfikatorem cookie lub urządzenia, datą i czasem wizyty,
              adresem odwiedzanej strony, stroną odsyłającą, typem przeglądarki i systemu, ustawieniami języka, przybliżoną
              lokalizacją wynikającą z IP oraz zdarzeniami wykonanymi w Serwisie. Zakres zależy od aktywnej technologii.
            </p>
            <p>
              W odniesieniu do dostępu do informacji na urządzeniu podstawą jest <strong>art. 399 ustawy — Prawo
              komunikacji elektronicznej</strong>: zgoda użytkownika albo wyjątek dla transmisji i usługi żądanej przez
              użytkownika. Jeżeli informacje stanowią dane osobowe, ich przetwarzanie odbywa się na podstawie:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-luxury-dark/95">
              <li>
                <strong>art. 6 ust. 1 lit. f RODO</strong> — prawnie uzasadniony interes Administratora polegający na
                bezpieczeństwie, zapobieganiu nadużyciom, zapewnieniu technicznego działania i obronie roszczeń, w zakresie
                danych technicznych niewymagających uprzedniej zgody na dostęp do urządzenia;
              </li>
              <li>
                <strong>art. 6 ust. 1 lit. a RODO</strong> — zgoda na opcjonalną analitykę, funkcjonalność lub reklamę;
              </li>
              <li>
                <strong>art. 6 ust. 1 lit. b RODO</strong> — podjęcie działań na żądanie użytkownika lub wykonanie umowy,
                jeżeli dana funkcja jest do tego rzeczywiście niezbędna;
              </li>
              <li>
                <strong>art. 6 ust. 1 lit. c RODO</strong> — wykonanie obowiązku prawnego, jeżeli taki obowiązek dotyczy
                konkretnego zapisu lub logu.
              </li>
            </ul>
            <p className="text-[11px] text-luxury-dark/90 font-mono bg-white p-3 border border-luxury-sand/60">
              Prawnie uzasadniony interes z art. 6 ust. 1 lit. f RODO nie zastępuje zgody wymaganej przez art. 399 Prawa
              komunikacji elektronicznej dla opcjonalnego zapisu lub odczytu informacji z urządzenia.
            </p>
          </section>

          {/* 8. Odbiorcy, dostawcy i transfery poza EOG */}
          <section className="space-y-3" id="sekcja-8">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">08.</span> Odbiorcy, dostawcy i transfery poza EOG
            </h3>
            <p>
              Dostęp do danych mogą mieć upoważnione osoby oraz dostawcy hostingu, utrzymania strony, cyberbezpieczeństwa,
              poczty, formularzy i narzędzia do zarządzania zgodami — wyłącznie w zakresie niezbędnym do świadczenia
              usług. Jeżeli zostaną włączone narzędzia analityczne, funkcjonalne lub reklamowe, ich dostawcy zostaną
              wskazani w panelu ustawień i w aktualnym wykazie cookies.
            </p>
            <p>
              Na slow-skin.pl wykryto pobieranie Google Fonts z serwerów Google LLC. Powoduje to połączenie urządzenia z
              infrastrukturą Google, które może wiązać się z przetwarzaniem adresu IP i danych technicznych. Google może
              przetwarzać dane również poza Europejskim Obszarem Gospodarczym na zasadach wskazanych w swoich dokumentach.
              Administrator weryfikuje podstawę transferu i odpowiednie zabezpieczenia, w szczególności decyzję
              stwierdzającą odpowiedni stopień ochrony albo standardowe klauzule umowne — zależnie od aktualnej konfiguracji
              i roli dostawcy.
            </p>
            <p>
              Po kliknięciu odnośnika do Facebooka lub Instagrama użytkownik opuszcza Serwis, a dalsze przetwarzanie
              podlega zasadom Meta Platforms i ustawieniom konta użytkownika.
            </p>
          </section>

          {/* 9. Okresy przechowywania */}
          <section className="space-y-3" id="sekcja-9">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">09.</span> Okresy przechowywania
            </h3>
            <p>
              <strong>Cookies sesyjne</strong> są co do zasady usuwane po zamknięciu przeglądarki. <strong>Cookies
              trwałe</strong> działają do upływu terminu wskazanego w panelu ustawień, do ich usunięcia przez użytkownika
              albo do wycofania zgody i usunięcia ich przez mechanizm zarządzania zgodami — zależnie od tego, co nastąpi
              wcześniej i od możliwości technicznych przeglądarki.
            </p>
            <p>
              Logi zgód i ich wycofania mogą być przechowywane przez okres potrzebny do wykazania zgodności, co do zasady
              nie dłużej niż 3 lata od ostatniego zdarzenia, chyba że trwa postępowanie lub roszczenie. Logi bezpieczeństwa
              i serwera są przechowywane przez okres ustalony z dostawcą hostingu i ograniczony do niezbędnego minimum.
            </p>
          </section>

          {/* 10. Zarządzanie zgodą i ustawieniami przeglądarki */}
          <section className="space-y-3" id="sekcja-10">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">10.</span> Zarządzanie zgodą i ustawieniami przeglądarki
            </h3>
            <p>
              Preferencje można zmienić w dowolnym momencie przez link <strong>„Zmień ustawienia cookies”</strong> w
              stopce Serwisów lub klikając dedykowany przycisk Cookies w lewym dolnym rogu ekranu. Panel umożliwia co
              najmniej zaakceptowanie wszystkich kategorii opcjonalnych, odrzucenie wszystkich kategorii opcjonalnych oraz
              osobny wybór cookies funkcjonalnych, analitycznych i reklamowych.
            </p>
            <p>
              Cookies można również blokować, usuwać albo ograniczać w ustawieniach przeglądarki. Szczegółowa ścieżka
              zależy od programu i urządzenia. Zablokowanie cookies niezbędnych może spowodować, że część funkcji — na
              przykład zapamiętanie preferencji lub wysłanie formularza — nie zadziała prawidłowo. Ustawienia przeglądarki
              nie zawsze wycofują zgody zapisane po stronie dostawcy, dlatego zalecane jest użycie panelu Serwisu.
            </p>
            <p>
              Ustawienia „Do Not Track” lub podobne sygnały mogą nie być obsługiwane jednolicie przez wszystkie
              przeglądarki i dostawców. Jeżeli Serwisy wdrożą uznawany mechanizm sygnalizowania preferencji prywatności,
              Polityka zostanie odpowiednio zaktualizowana.
            </p>
          </section>

          {/* 11. Prawa użytkownika */}
          <section className="space-y-3" id="sekcja-11">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">11.</span> Prawa użytkownika
            </h3>
            <p>
              Jeżeli informacje z cookies stanowią dane osobowe, użytkownik może — w granicach przewidzianych przez RODO —
              żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, wnieść
              sprzeciw wobec przetwarzania opartego na prawnie uzasadnionym interesie oraz wycofać zgodę w dowolnym momencie.
              Administrator może poprosić o informacje potrzebne do odnalezienia identyfikatora i proporcjonalnego
              potwierdzenia tożsamości.
            </p>
            <div className="bg-white p-3 border border-luxury-sand/60 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-xs text-luxury-dark">Prawo do skargi do organu nadzorczego:</p>
                <p className="text-[11px] text-luxury-dark/80">
                  Użytkownik może złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
                </p>
              </div>
              <a
                href="https://uodo.gov.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border border-luxury-dark text-[10px] font-mono uppercase tracking-wider hover:bg-luxury-dark hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <span>uodo.gov.pl</span>
                <ExternalLink className="w-3 h-3 text-luxury-gold" />
              </a>
            </div>
          </section>

          {/* 12. Zmiany Polityki */}
          <section className="space-y-3" id="sekcja-12">
            <h3 className="font-serif text-base sm:text-lg text-luxury-dark font-semibold border-b border-luxury-sand/60 pb-1.5 flex items-center gap-2">
              <span className="font-mono text-xs text-luxury-gold">12.</span> Zmiany Polityki
            </h3>
            <p>
              Polityka może być aktualizowana w razie zmiany prawa, technologii, dostawców, celów lub zakresu przetwarzania.
              Data i numer wersji są wskazane na początku dokumentu. Jeżeli zmiana wpływa na zakres zgody, użytkownik
              zostanie poproszony o ponowny wybór przed uruchomieniem nowych technologii opcjonalnych.
            </p>
          </section>
        </div>

        {/* Sticky Footer in Modal */}
        <div className="p-4 sm:p-5 border-t border-luxury-sand/60 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20 print:hidden">
          <div className="text-[10px] font-mono text-luxury-dark/70">
            Slow Skin Concept™ • Wersja 1.0 (3 września 2026 r.)
          </div>
          <div className="flex items-center gap-2">
            {onOpenSettings && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="px-4 py-2 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer"
              >
                Zmień ustawienia cookies
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-luxury-sand text-[10px] font-mono uppercase tracking-wider hover:border-luxury-dark transition-all cursor-pointer font-bold bg-white text-luxury-dark"
            >
              Zamknij
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default CookiesPolicyModal;
