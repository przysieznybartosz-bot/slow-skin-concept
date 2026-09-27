import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Fingerprint, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Brain, 
  Heart, 
  Activity, 
  Feather, 
  Compass, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  FileText, 
  Search, 
  ChevronRight,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkle,
  Sparkles as SparklesIcon,
  Shield,
  HelpCircle,
  PhoneCall,
  UserCheck
} from "lucide-react";
import { DiscreetSection } from "./DiscreetSection";
import { VideoPlayerSection } from "./VideoPlayerSection";

interface MethodPageProps {
  onLinkClick: (url: string) => void;
  onOpenBooking?: (treatment?: any) => void;
}

export const MethodPage: React.FC<MethodPageProps> = ({ onLinkClick, onOpenBooking }) => {
  const [activeSpiralRing, setActiveSpiralRing] = useState<number>(1);
  const [activeServiceTab, setActiveServiceTab] = useState<string>("all");
  const [cabinetActiveVideoIdx, setCabinetActiveVideoIdx] = useState<number>(0);
  const [cabinetVideoPlaybackSpeed, setCabinetVideoPlaybackSpeed] = useState<number>(1.0);
  const [cabinetVideoMuted, setCabinetVideoMuted] = useState<boolean>(true);
  const cabinetVideoRef = useRef<HTMLVideoElement>(null);

  // 8 Rings of the Biological Skin Intelligence Spiral
  const spiralRings = [
    {
      num: "01",
      step: 1,
      title: "Diagnoza biologiczna skóry",
      shortTitle: "Diagnoza biologiczna",
      tagline: "Najpierw zrozumienie skóry. Dopiero później wybór zabiegu.",
      focus: "PUNKT WYJŚCIA I OCENA AKTUALNEJ GOTOWOŚCI SKÓRY",
      description: "Widoczny objaw jest początkiem analizy, a nie jej zakończeniem. Podobnie wyglądający problem może wynikać z różnych mechanizmów, dlatego sama jego nazwa nie wystarcza do zaplanowania właściwego postępowania. Diagnoza biologiczna pozwala spojrzeć na skórę szerzej, rozpoznać jej aktualne potrzeby i określić, czego wymaga w pierwszej kolejności oraz na jakie działania jest obecnie gotowa.",
      rule: "Diagnoza nie służy przypisaniu skóry do gotowego schematu. Pozwala określić jej indywidualny punkt wyjścia i właściwą kolejność dalszych działań.",
      scopeLabel: "ZAKRES ANALIZY",
      details: [
        "Ocena kondycji bariery naskórkowej, nawodnienia i tendencji do utraty wody",
        "Ocena reaktywności, sposobu rogowacenia, aktywności gruczołów łojowych i pigmentacji",
        "Analiza reakcji skóry na dotychczasową pielęgnację, składniki aktywne i wcześniejsze zabiegi",
        "Uwzględnienie wpływu stresu, snu, sposobu odżywiania, zmian hormonalnych i innych czynników związanych ze stylem życia"
      ],
      icon: Fingerprint
    },
    {
      num: "02",
      step: 2,
      title: "Reset biologiczny",
      shortTitle: "Reset biologiczny",
      tagline: "Reset to przywracanie naturalnego rytmu, nie intensywne złuszczanie.",
      focus: "UPORZĄDKOWANIE PIELĘGNACJI I RYTMU ODNOWY",
      description: "Reset biologiczny oznacza uporządkowanie codziennej pielęgnacji i ograniczenie działań, które mogą przesuszać, podrażniać lub nadmiernie obciążać skórę. Obejmuje łagodne, ale dokładne oczyszczanie, z poszanowaniem bariery naskórkowej i fizjologicznego pH. Na tym etapie wspierany jest również naturalny rytm odnowy naskórka — równowaga pomiędzy powstawaniem nowych komórek, ich dojrzewaniem i fizjologicznym złuszczaniem z powierzchni skóry. Celem nie jest przyspieszanie tych procesów, lecz stworzenie warunków sprzyjających ich prawidłowemu przebiegowi.",
      rule: "Najpierw porządkuje się warunki funkcjonowania skóry. Dopiero później wprowadza się bardziej ukierunkowane działania.",
      scopeLabel: "ZAKRES DZIAŁAŃ",
      details: [
        "Łagodne oczyszczanie z poszanowaniem bariery naskórkowej i fizjologicznego pH skóry",
        "Ograniczenie nadmiaru produktów oraz składników mogących przesuszać, podrażniać lub obciążać skórę",
        "Wspieranie prawidłowego procesu rogowacenia i fizjologicznego złuszczania",
        "Przygotowanie skóry do odbudowy bariery i kolejnych etapów terapii"
      ],
      icon: RotateCcw
    },
    {
      num: "03",
      step: 3,
      title: "Biomimetyczna odbudowa bariery i architektury lipidowej",
      shortTitle: "Odbudowa bariery",
      tagline: "Biologiczne bezpieczeństwo jest podstawą regeneracji.",
      focus: "WSPARCIE BARIERY, NAWODNIENIA I OCHRONY SKÓRY",
      description: "Bariera naskórkowa nie tylko ogranicza nadmierną utratę wody. Wpływa również na komfort skóry, jej reaktywność, odporność na czynniki zewnętrzne oraz tolerancję pielęgnacji i zabiegów. Na tym etapie wspierana jest odbudowa naturalnej warstwy ochronnej skóry, jej nawodnienie i uporządkowana architektura lipidowa. Wykorzystywane są składniki i struktury biomimetyczne, które naśladują lub wspierają elementy naturalnie obecne w naskórku.",
      rule: "Osłabiona bariera zmienia sposób reagowania skóry. Dlatego przed wprowadzeniem intensywniejszych działań należy stworzyć warunki sprzyjające jej odbudowie i prawidłowemu funkcjonowaniu.",
      scopeLabel: "ZAKRES DZIAŁAŃ",
      details: [
        "Uzupełnianie składników wspierających naturalną architekturę lipidową warstwy rogowej",
        "Wykorzystanie biomimetycznych i ciekłokrystalicznych struktur zgodnych z budową bariery naskórkowej",
        "Wspieranie nawodnienia i ograniczanie nadmiernej przeznaskórkowej utraty wody — TEWL",
        "Poprawa komfortu, odporności i tolerancji skóry na kolejne etapy pielęgnacji i terapii"
      ],
      icon: ShieldCheck
    },
    {
      num: "04",
      step: 4,
      title: "Mikrośrodowisko, mikrobiom i komunikacja biologiczna",
      shortTitle: "Mikrośrodowisko & Mikrobiom",
      tagline: "Równowaga nie oznacza braku reakcji. Oznacza reakcję właściwą do sytuacji.",
      focus: "pH • MIKROBIOM • KOMUNIKACJA NEUROIMMUNOLOGICZNA",
      description: "Komórki skóry nie funkcjonują w izolacji. Ich aktywność zależy od warunków panujących w najbliższym otoczeniu oraz nieustannej wymiany sygnałów pomiędzy komórkami, mikrobiomem, układem nerwowym i odpornościowym. Na tym etapie uwaga skupia się na tworzeniu mikrośrodowiska, które sprzyja prawidłowemu funkcjonowaniu skóry, adekwatnej odpowiedzi na bodźce oraz powrotowi do równowagi po ich ustaniu.",
      rule: "Samo dostarczenie składnika aktywnego nie wystarczy, jeżeli skóra nie ma odpowiednich warunków, aby właściwie na niego odpowiedzieć.",
      scopeLabel: "ZAKRES DZIAŁAŃ",
      details: [
        "Wspieranie fizjologicznego pH, nawodnienia i warunków sprzyjających równowadze mikrobiomu",
        "Dobór pielęgnacji uwzględniającej wzajemne zależności pomiędzy mikrobiomem, komórkami skóry oraz układem nerwowym i odpornościowym",
        "Ograniczenie czynników mogących nasilać reaktywność i przedłużać odpowiedź skóry na bodźce",
        "Obserwacja sposobu reagowania skóry oraz jej zdolności do wyciszenia reakcji i powrotu do równowagi"
      ],
      icon: Activity
    },
    {
      num: "05",
      step: 5,
      title: "Mikroodżywianie i personalizacja",
      shortTitle: "Mikroodżywianie",
      tagline: "Nie chodzi o zastępowanie skóry w jej funkcjach, lecz o wspieranie jej własnego potencjału biologicznego.",
      focus: "PREKURSORY • KOFAKTORY • INDYWIDUALNY DOBÓR KONCENTRATÓW",
      description: "Skóra samodzielnie wytwarza struktury potrzebne do jej prawidłowego funkcjonowania. Mikroodżywianie polega na dostarczaniu odpowiednio dobranych prekursorów, kofaktorów i składników sygnałowych, które wspierają jej naturalne procesy odnowy, w tym procesy związane z wytwarzaniem kolagenu, elastyny i kwasu hialuronowego. Podczas wizyty, bezpośrednio przy klientce, indywidualnie dobierane są baza i koncentraty aktywne dermaviduals®. Powstaje w ten sposób spersonalizowany koktajl zabiegowy odpowiadający aktualnej kondycji i potrzebom skóry. System umożliwia również indywidualne dopasowanie pielęgnacji domowej.",
      rule: "Więcej składników nie oznacza skuteczniejszego działania. Znaczenie ma ich biologiczne uzasadnienie, precyzyjny dobór i właściwy moment zastosowania.",
      scopeLabel: "ZAKRES DZIAŁAŃ",
      details: [
        "Określenie funkcji skóry wymagających ukierunkowanego wsparcia",
        "Dobór prekursorów, kofaktorów i składników sygnałowych",
        "Komponowanie przy klientce spersonalizowanych koktajli zabiegowych z wykorzystaniem baz i koncentratów aktywnych dermaviduals®",
        "Dopasowanie pielęgnacji domowej do aktualnej kondycji skóry"
      ],
      icon: Layers
    },
    {
      num: "06",
      step: 6,
      title: "Wielopoziomowa terapia zabiegowa",
      shortTitle: "Wielopoziomowa terapia",
      tagline: "To nie skóra ma dopasować się do procedury. To procedura ma być dopasowana do skóry.",
      focus: "GOTOWOŚĆ SKÓRY • DOBÓR I ŁĄCZENIE TECHNOLOGII",
      description: "Wielopoziomowa terapia nie opiera się na jednym, z góry ustalonym protokole. Rodzaj technologii, głębokość działania, intensywność oraz kolejność zabiegów dobierane są do aktualnej kondycji i biologicznej gotowości skóry. Szeroki wybór metod — od terapii manualnych, neuroliftingu i mezoterapii bezigłowej po mikronakłuwanie, mezoterapię igłową czy radiofrekwencję — pozwala tworzyć indywidualne sekwencje zabiegowe. W zależności od odpowiedzi skóry technologie mogą być łączone, rozdzielane na kolejne etapy lub czasowo odkładane.",
      rule: "O skuteczności nie decyduje liczba technologii ani siła działania, lecz ich właściwy dobór, kolejność i moment zastosowania.",
      scopeLabel: "ZAKRES DZIAŁAŃ",
      details: [
        "Ocena biologicznej gotowości skóry do określonego rodzaju technologii",
        "Indywidualny dobór metody, głębokości i intensywności działania",
        "Łączenie technologii w wieloetapowe sekwencje dopasowane do celu terapii",
        "Modyfikowanie kolejnych działań na podstawie odpowiedzi i regeneracji skóry"
      ],
      icon: Zap
    },
    {
      num: "07",
      step: 7,
      title: "Spersonalizowana pielęgnacja domowa",
      shortTitle: "Pielęgnacja domowa",
      tagline: "Zabieg inicjuje zmianę. Pielęgnacja nadaje jej ciągłość.",
      focus: "CIĄGŁOŚĆ • PROSTOTA • DOPASOWANIE",
      description: "Zabieg jest pojedynczym bodźcem, natomiast pielęgnacja towarzyszy skórze każdego dnia. Jej zadaniem jest podtrzymywanie kierunku rozpoczętego w gabinecie, wspieranie komfortu i bariery oraz przygotowywanie skóry do kolejnych etapów terapii. Plan pielęgnacyjny powinien być prosty, czytelny i dopasowany do aktualnej kondycji skóry. Nie jest ustalany raz na zawsze — zmienia się wraz z jej potrzebami i odpowiedzią na prowadzone działania. Skin Infuzion™ stanowi domowe przedłużenie idei pielęgnacyjnej Slow Skin Concept™. System dermaviduals® umożliwia dalszą personalizację poprzez dobór odpowiednich produktów, baz i koncentratów aktywnych.",
      rule: "Pielęgnacja domowa nie jest oddzielona od terapii gabinetowej. Stanowi jej codzienną, indywidualnie dopasowaną kontynuację.",
      scopeLabel: "ZAKRES DZIAŁAŃ",
      details: [
        "Opracowanie czytelnego planu stosowania produktów i kolejności pielęgnacji",
        "Dobór pielęgnacji wspierającej aktualny cel i przygotowanie skóry do kolejnego etapu",
        "Połączenie produktów Skin Infuzion™ z indywidualnie dobraną pielęgnacją dermaviduals®",
        "Obserwacja odpowiedzi skóry i modyfikowanie zaleceń wraz ze zmianą jej kondycji"
      ],
      icon: Feather
    },
    {
      num: "08",
      step: 8,
      title: "Neuroplastyczność skóry",
      shortTitle: "Neuroplastyczność skóry",
      tagline: "Siłę skóry poznaje się nie po braku reakcji, lecz po zdolności powrotu do równowagi.",
      focus: "ADAPTACJA • ODPOWIEDŹ • POWRÓT DO RÓWNOWAGI",
      description: "W Slow Skin Concept™ neuroplastyczność skóry jest autorską interpretacją jej zdolności do adaptacji, proporcjonalnego reagowania oraz powrotu do równowagi po ustaniu bodźca. Odnosi się do wzajemnych zależności pomiędzy skórą, układem nerwowym i odpornościowym. Nie oznacza jednak, że skóra „uczy się” w taki sam sposób jak mózg. Neuroplastyczność skóry nie jest ostatnim zabiegiem ani oddzielnym etapem następującym po siedmiu wcześniejszych kręgach. Jest nadrzędnym kierunkiem całej Spirali, realizowanym poprzez odpowiednią kolejność pielęgnacji, zabiegów i kolejnych bodźców.",
      rule: "Celem nie jest całkowity brak reakcji skóry, lecz odpowiedź adekwatna do bodźca i sprawny powrót do równowagi po jego ustaniu.",
      scopeLabel: "ZAKRES DZIAŁAŃ",
      details: [
        "Obserwacja sposobu reagowania skóry i czasu potrzebnego na odzyskanie równowagi",
        "Dopasowanie rodzaju, intensywności i częstotliwości kolejnych działań",
        "Wspieranie tolerancji pielęgnacji, zabiegów i zmieniających się warunków środowiska",
        "Ocena efektów i wyznaczenie kierunku kolejnego obrotu Biologicznej Spirali"
      ],
      icon: Brain
    }
  ];

  // Key Entry Services & Formats
  const entryServices = [
    {
      id: "konsultacja",
      badge: "KROK PIERWSZY • ZAWSZE",
      title: "Konsultacja Biological Skin Intelligence™",
      subtitle: "Punktem wyjścia jest pogłębiona konsultacja pozwalająca poznać aktualny sposób funkcjonowania skóry.",
      description: "Podczas konsultacji analizujemy aktualny stan skóry, dotychczasową pielęgnację, reakcje na kosmetyki i zabiegi, styl życia oraz aktualny poziom gotowości skóry do dalszej terapii. Efektem nie jest wybór przypadkowego zabiegu, ale spójny plan dalszego postępowania.",
      cta: "Umów konsultację",
      url: "/pierwsza-wizyta-diagnostyka-skory/",
      bullets: [
        "Ocena aktualnego sposobu funkcjonowania skóry",
        "Audyt dotychczasowej pielęgnacji i kosmetyków",
        "Analiza reaktywności, tolerancji i stylu życia",
        "Plan postępowania zamiast przypadkowego zabiegu"
      ]
    },
    {
      id: "analiza",
      badge: "BADANIE BIOFIZYCZNE",
      title: "Biologiczna Analiza Funkcjonalna Skóry",
      subtitle: "Rozszerzona ocena aktualnej kondycji skóry wspierająca projektowanie indywidualnej terapii.",
      description: "Analiza może obejmować m.in. stan bariery, nawilżenie, natłuszczenie, reaktywność, pigmentację oraz inne parametry biofizyczne istotne dla planowania bezpiecznej i skutecznej pielęgnacji kosmetologicznej.",
      cta: "Poznaj analizę skóry",
      url: "/pierwsza-wizyta-diagnostyka-skory/",
      bullets: [
        "Ocena bariery, TEWL, poziomu nawilżenia i lipidów",
        "Mapowanie reaktywności naczyniowej i przebarwień",
        "Obiektywne parametry funkcjonalne naskórka",
        "Fundament pod autorski Beauty Plan i Paszport Skóry"
      ]
    },
    {
      id: "autorska-terapia",
      badge: "FLAGOWA FORMA PRACY",
      title: "Autorska Terapia Slow Skin Concept™",
      subtitle: "Zabieg, który nie istnieje przed spotkaniem ze skórą.",
      description: "Indywidualnie projektowany, wielokierunkowy zabieg odpowiadający na aktualne biologiczne priorytety skóry. Nie korzystamy z jednego protokołu dla wszystkich. Łączy techniki manualne, odpowiednio dobrane składniki, preparaty zabiegowe i technologie wspierające.",
      cta: "Poznaj sposób pracy",
      url: "/zabiegi-na-twarz/",
      bullets: [
        "Projektowany w dniu wizyty na podstawie aktualnego stanu tkanki",
        "Autorskie koktajle terapeutyczne (np. resetujący, biomimetyczny, anti-aging)",
        "Bezpieczna synergia manualna i technologiczna",
        "Płynna adaptacja zakresu i intensywności do tolerancji skóry"
      ]
    },
    {
      id: "atelier",
      badge: "KAMERALNA OPIEKA",
      title: "Indywidualna Sesja Pielęgnacyjna Skóry",
      subtitle: "Najbardziej spersonalizowana forma opieki w Slow Skin Concept™.",
      description: "Sesja projektowana wyłącznie dla Twojej skóry – tak jak indywidualny plan tworzony jest dla konkretnej osoby. To nie pośpieszny zabieg z cennika, lecz spokojna, wieloetapowa pielęgnacja oparta na bieżących potrzebach Twojej cery.",
      cta: "Zarezerwuj czas na pielęgnację",
      url: "/zabiegi-na-twarz/",
      bullets: [
        "Kameralna, cicha przestrzeń i pełen komfort",
        "Wieloetapowa pielęgnacja dopasowana do Twojego nastroju i cery",
        "Kojące formuły wspierające naturalną elastyczność naskórka",
        "Maksymalne odprężenie i relaks w przyjaznej, ciepłej atmosferze"
      ]
    },
    {
      id: "program-odbudowy",
      badge: "TERAPIA RATUNKOWA & REGENERACJA",
      title: "Program Odbudowy Biologicznej Skóry",
      subtitle: "Dla skóry przeciążonej, reaktywnej, odwodnionej lub z uszkodzoną barierą.",
      description: "Kompleksowy program ukierunkowany na uproszczenie pielęgnacji, łagodne oczyszczanie, wsparcie bariery hydrolipidowej, przywracanie komfortu, indywidualnie dobrane zabiegi gabinetowe oraz bezpieczną pielęgnację domową.",
      cta: "Sprawdź, czy to program dla Ciebie",
      url: "/odbudowa-bariery-hydrolipidowej/",
      bullets: [
        "Wyciszenie pieczenia, ściągnięcia i nadwrażliwości",
        "Odbudowa uszkodzonego cementu międzykomórkowego",
        "Eliminacja błędów pielęgnacyjnych i przeciążeń",
        "Trwałe przywrócenie poczucia komfortu i nawilżenia"
      ]
    },
    {
      id: "strategia-domowa",
      badge: "EDUKACJA & BEAUTY PLAN",
      title: "Indywidualna Strategia Pielęgnacji Skóry",
      subtitle: "Nie jest to zwykły „dobór kosmetyków”.",
      description: "Analizujemy aktualną rutynę i precyzyjnie określamy: które produkty warto pozostawić, które mogą niepotrzebnie przeciążać skórę, czego obecnie potrzebuje, w jakiej kolejności stosować kosmetyki i jak bezpiecznie wprowadzać nowe formulacje.",
      cta: "Zbuduj swoją strategię pielęgnacji",
      url: "/pierwsza-wizyta-diagnostyka-skory/",
      bullets: [
        "Rzetelny audyt Twojej kosmetyczki",
        "Usunięcie ukrytych substancji drażniących i komedogennych",
        "Uporządkowanie kolejności i częstotliwości aplikacji",
        "Maksymalna efektywność przy minimalnej liczbie produktów"
      ]
    },
    {
      id: "neurolifting",
      badge: "TECHNOLOGIA WSPERAJĄCA",
      title: "Neurolifting",
      subtitle: "Technologia wspierająca procedurę, a nie uniwersalny szablon pielęgnacji skóry.",
      description: "Neurolifting w Slow Skin Concept™ jest jednym z narzędzi, które może zostać wykorzystane w indywidualnie projektowanej terapii. Nie jest uniwersalnym zabiegiem „na odmłodzenie” — jego zastosowanie i intensywność każdorazowo wynikają z aktualnego stanu skóry, celu terapii i kwalifikacji.",
      cta: "Zapytaj, czy Neurolifting jest odpowiedni dla Ciebie",
      url: "/neurolifting/",
      bullets: [
        "Praca manualno-neuromięśniowa i powięziowa",
        "Poprawa napięcia tkanek i modelowanie owalu twarzy",
        "Wyciszenie wzorców napięciowych w mięśniach mimicznych",
        "Aplikowany wyłącznie na skórze stabilnej biologicznie"
      ]
    }
  ];

  return (
    <div className="space-y-20 text-luxury-dark pb-16" id="method-page-root">
      
      {/* 1. HERO / INTRODUCTION SECTION */}
      <DiscreetSection className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
          <Fingerprint className="w-3.5 h-3.5 text-luxury-gold" />
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold">
            Kosmetologia Interdyscyplinarna • Filozofia Slow Aging
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-luxury-dark leading-[1.15]">
          Slow Skin Concept™
        </h1>

        <p className="font-serif text-xl sm:text-2xl italic text-luxury-gold font-normal max-w-2xl mx-auto">
          Pielęgnacja i terapia w rytmie biologii skóry
        </p>

        <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto my-2" />

        <div className="space-y-5 text-sm sm:text-base text-luxury-dark font-light leading-relaxed max-w-3xl mx-auto text-justify sm:text-center">
          <p>
            <strong>Slow Skin Concept™</strong> to holistyczny sposób pracy ze skórą, oparty na kosmetologii interdyscyplinarnej i filozofii <strong>Slow Aging</strong>.
          </p>
          <p>
            Nie rozpoczynam od wyboru zabiegu ani od walki z pojedynczym objawem. Najpierw staram się zrozumieć, <strong>dlaczego skóra reaguje w określony sposób, czego potrzebuje właśnie teraz i na jakie działania jest rzeczywiście gotowa</strong>.
          </p>
          <p className="text-xs sm:text-sm text-luxury-dark/95">
            Na kondycję skóry wpływają nie tylko kosmetyki i zabiegi, lecz także stan jej bariery ochronnej, mikrobiom, reaktywność, komunikacja z układem nerwowym i odpornościowym, gospodarka hormonalna, stres, styl życia oraz warunki potrzebne do prawidłowej odnowy i regeneracji.
          </p>
        </div>

        {/* Highlight Callout: Slow nie oznacza wolniej */}
        <div className="p-6 md:p-8 bg-[#FAF8F5] border border-luxury-sand/80 max-w-2xl mx-auto text-center space-y-3 shadow-sm rounded-xs my-8">
          <h2 className="font-serif text-xl sm:text-2xl font-light text-luxury-dark">
            „Slow nie oznacza wolniej. Oznacza we właściwym tempie dla konkretnej skóry.”
          </h2>
          <p className="text-xs sm:text-sm text-luxury-dark/95 font-light leading-relaxed">
            Nie przyspieszam procesów, do których skóra nie jest jeszcze przygotowana. Najpierw wspieram jej podstawowe warunki równowagi, a następnie dobieram pielęgnację i terapię zgodnie z jej aktualną kondycją oraz możliwościami.
          </p>
        </div>

        {/* Slow Aging Definition Box & Cel nadrzędny */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left pt-2">
          <div className="p-6 bg-white border border-luxury-sand/70 shadow-2xs space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-semibold flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-luxury-gold" /> Czym jest Slow Aging?
            </span>
            <h3 className="font-serif text-base font-normal text-luxury-dark">Świadome wspieranie biologii skóry</h3>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Slow Aging nie jest walką ze starzeniem. To świadome wspieranie procesów, które pomagają skórze jak najdłużej zachować dobrą kondycję, zdolności adaptacyjne i potencjał regeneracyjny.
            </p>
          </div>

          <div className="p-6 bg-white border border-luxury-sand/70 shadow-2xs space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-luxury-gold" /> Cel nadrzędny
            </span>
            <h3 className="font-serif text-base font-normal text-luxury-dark">Długofalowa zdolność powrotu do równowagi</h3>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Celem Slow Skin Concept™ jest wspieranie homeodynamiki skóry — jej zdolności do reagowania na zmieniające się warunki, adaptacji oraz powrotu do równowagi. Rodzaj, intensywność i kolejność działań dobieram do aktualnej kondycji skóry i jej gotowości na kolejny bodziec.
            </p>
          </div>
        </div>
      </DiscreetSection>

      {/* 2. BIOLOGICZNA SPIRALA INTELIGENCJI SKÓRY™ */}
      <DiscreetSection className="space-y-12" id="biologiczna-spirala-sekcja">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
            <RotateCcw className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
              Autorski Model Prowadzenia Skóry Ku Adaptacji i Regeneracji
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-luxury-dark">
            Biologiczna Spirala Inteligencji Skóry™
          </h2>
          <p className="text-xs sm:text-sm text-luxury-dark/95 font-light max-w-2xl mx-auto leading-relaxed">
            Sercem Slow Skin Concept™ jest <strong>Biologiczna Spirala Inteligencji Skóry™</strong> – autorski model, który pomaga uporządkować biologiczne priorytety skóry i zdecydować, czego potrzebuje ona w danym momencie.
          </p>
          <p className="font-serif text-sm italic text-luxury-gold">
            Nie jest to gotowy protokół wykonywany identycznie u każdej osoby. To dynamiczna mapa terapeutyczna.
          </p>
        </div>

        {/* What the Spiral map determines */}
        <div className="bg-[#FAF8F5] border border-luxury-sand p-6 md:p-8 max-w-4xl mx-auto">
          <h3 className="font-mono text-[10px] tracking-[0.2em] text-luxury-gold uppercase font-bold text-center mb-6">
            Dzięki Spirali precyzyjnie określamy:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {[
              { label: "Priorytet", text: "czego skóra potrzebuje w pierwszej kolejności" },
              { label: "Mechanizmy", text: "które procesy mogą podtrzymywać jej problem" },
              { label: "Wsparcie", text: "jakie działania mogą ją obecnie realnie wspierać" },
              { label: "Ochrona", text: "czego na tym etapie lepiej unikać, by nie przeciążyć tkanki" },
              { label: "Gotowość", text: "kiedy można bezpiecznie przejść do kolejnego etapu" },
              { label: "Ewaluacja", text: "jak skóra reaguje i jak dostosować kolejny obrót spirali" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white border border-luxury-sand/60 shadow-2xs space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-bold">
                  {item.label}
                </span>
                <p className="text-xs text-luxury-dark font-light leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive 8 Rings of the Spiral */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-luxury-gold font-bold">
              Architektura Modelu
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
              Osiem kręgów Spirali
            </h3>
            <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto">
              Wybierz krąg, aby zgłębić biologiczny sens i zasady postępowania na danym etapie.
            </p>
          </div>

          {/* Ring Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 border-b border-luxury-sand/50 pb-4">
            {spiralRings.map((ring) => (
              <button
                key={ring.step}
                onClick={() => setActiveSpiralRing(ring.step)}
                className={`px-3 py-2 text-[10px] sm:text-xs font-mono tracking-wider uppercase transition-all duration-300 rounded-xs flex items-center gap-1.5 cursor-pointer ${
                  activeSpiralRing === ring.step
                    ? "bg-luxury-dark text-white font-medium shadow-xs"
                    : "bg-[#FAF8F5] text-luxury-dark/95 hover:bg-luxury-gold/10 hover:text-luxury-gold border border-luxury-sand/40"
                }`}
              >
                <span className="font-bold opacity-80">{ring.num}.</span>
                <span className="hidden md:inline">{ring.shortTitle}</span>
                <span className="md:hidden">{ring.shortTitle.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Ring Detail Card */}
          {(() => {
            const currentRing = spiralRings.find(r => r.step === activeSpiralRing) || spiralRings[0];
            const IconComponent = currentRing.icon;
            return (
              <motion.div
                key={currentRing.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-white border-2 border-luxury-gold/40 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-lg"
              >
                {/* Giant Faded Serif Number in the background */}
                <div className="absolute right-4 bottom-2 font-serif text-[130px] sm:text-[180px] select-none font-bold text-luxury-gold/[0.06] leading-none pointer-events-none z-0">
                  {currentRing.num}
                </div>

                <div className="relative z-10 space-y-6 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-luxury-sand/40 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full text-luxury-gold">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold block">
                          Krąg {currentRing.num} / 08 • Biologiczna Spirala
                        </span>
                        <h4 className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-luxury-dark">
                          {currentRing.title}
                        </h4>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] px-3 py-1 bg-[#FAF8F5] border border-luxury-sand rounded-full text-luxury-dark/95 uppercase">
                      {currentRing.focus}
                    </span>
                  </div>

                  <div className="font-serif text-lg italic text-luxury-gold font-normal">
                    „{currentRing.tagline}”
                  </div>

                  <p className="text-sm sm:text-base text-luxury-dark font-light leading-relaxed">
                    {currentRing.description}
                  </p>

                  {/* Golden Rule */}
                  <div className="p-4 bg-[#FAF8F5] border-l-2 border-luxury-gold text-xs text-luxury-dark font-light leading-relaxed">
                    <span className="font-mono text-[8.5px] uppercase tracking-wider text-luxury-gold font-bold block mb-1">
                      Kluczowa Zasada Etapu
                    </span>
                    {currentRing.rule}
                  </div>

                  {/* Details Bullets */}
                  <div className="space-y-2 pt-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-luxury-gold font-bold block">
                      {currentRing.scopeLabel || "ZAKRES DZIAŁAŃ"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentRing.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-luxury-dark/95 font-light">
                          <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ring 8 Bottom Banner: KOLEJNY OBRÓT SPIRALI */}
                  {currentRing.step === 8 && (
                    <div className="pt-4 border-t border-luxury-gold/30 flex justify-end">
                      <button
                        onClick={() => {
                          setActiveSpiralRing(1);
                          const el = document.getElementById("biologiczna-spirala-sekcja");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-6 py-3 bg-luxury-gold hover:bg-luxury-dark text-white font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <span>KOLEJNY OBRÓT SPIRALI</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Navigation between steps */}
                  <div className="flex justify-between items-center pt-6 border-t border-luxury-sand/40">
                    <button
                      onClick={() => setActiveSpiralRing(prev => prev > 1 ? prev - 1 : 8)}
                      className="text-xs font-mono uppercase tracking-wider text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      ← Poprzedni krąg
                    </button>
                    <span className="font-mono text-[10px] text-luxury-gold font-semibold">
                      {currentRing.step} z 8
                    </span>
                    <button
                      onClick={() => {
                        if (currentRing.step === 8) {
                          setActiveSpiralRing(1);
                          const el = document.getElementById("biologiczna-spirala-sekcja");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        } else {
                          setActiveSpiralRing(prev => prev + 1);
                        }
                      }}
                      className="text-xs font-mono uppercase tracking-wider text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {currentRing.step === 8 ? "KOLEJNY OBRÓT SPIRALI →" : "Następny krąg →"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* Spirala, nie linia Highlight Box */}
        <div className="border border-luxury-sand bg-gradient-to-br from-[#FAF8F5] to-white p-8 md:p-12 max-w-4xl mx-auto text-left space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-luxury-gold font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
            <RotateCcw className="w-4 h-4" />
            <span>Nieliniowość Procesu Regeneracji</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
            Spirala, nie linia
          </h3>
          <div className="space-y-3 text-xs sm:text-sm text-luxury-dark font-light leading-relaxed">
            <p>
              Proces nie przebiega po prostej. Skóra to żywy, dynamicznie reagujący układ biologiczny, a nie mechaniczna powierzchnia.
            </p>
            <p>
              <strong>Każda odpowiedź skóry jest nową informacją.</strong> Na jej podstawie oceniamy następny krok, modyfikujemy proporcje koktajli terapeutycznych i decydujemy o kolejności procedur.
            </p>
            <p>
              Dlatego po przejściu kolejnych etapów <strong>Spirala może rozpocząć następny obrót</strong> – już z uwzględnieniem nowej, silniejszej kondycji naskórka i wyższego potencjału adaptacyjnego.
            </p>
          </div>
        </div>
      </DiscreetSection>

      {/* 3. O MNIE — KATARZYNA BRZEZIŃSKA */}
      <DiscreetSection className="space-y-12" id="o-mnie-katarzyna-brzezinska-metoda">
        <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F4F0E8] py-14 px-6 sm:px-10 md:px-14 border border-luxury-sand/80 shadow-[0_20px_50px_rgba(179,155,114,0.06)] relative overflow-hidden">
          {/* Luminous luxury subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ebdcb9]/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Subtelne narożniki */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-luxury-gold/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-luxury-gold/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-luxury-gold/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-luxury-gold/40 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
            {/* Left Column: Spotlight Narrative */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold bg-luxury-gold/10 px-3 py-1 border border-luxury-gold/30 rounded-full">
                  Twórczyni Koncepcji
                </span>
                <span className="font-mono text-[9px] tracking-wider text-luxury-dark/90 uppercase">
                  Ponad 17 lat pracy ze skórą
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-luxury-dark tracking-tight leading-[1.15]">
                  Katarzyna Brzezińska
                </h2>
                <p className="font-mono text-[10px] tracking-[0.18em] text-luxury-gold uppercase font-semibold">
                  Kosmetologia interdyscyplinarna • Jelcz-Laskowice
                </p>
              </div>

              <div className="w-16 h-[1px] bg-luxury-gold/60" />

              {/* Główny manifest / cytat wiodący */}
              <p className="font-serif text-lg sm:text-xl italic font-normal text-luxury-dark/90 leading-snug border-l-2 border-luxury-gold/60 pl-4 py-1">
                „Nie wierzę, że skóra zawsze potrzebuje silniejszego bodźca. Częściej potrzebuje właściwie odczytanych sygnałów i terapii dopasowanej do jej aktualnej gotowości.”
              </p>

              {/* Oficjalny autorski opis */}
              <div className="space-y-4 text-xs sm:text-sm text-luxury-dark font-light leading-relaxed">
                <p>
                  Nazywam się <strong>Katarzyna Brzezińska</strong>. Od ponad 17 lat pracuję ze skórą w nurcie kosmetologii interdyscyplinarnej.
                </p>
                <p>
                  Jestem twórczynią <strong>Slow Skin Concept™</strong> oraz autorką <strong>Biologicznej Spirali Inteligencji Skóry™</strong>.
                </p>
                <p>
                  W swojej pracy nie koncentruję się wyłącznie na tym, co widać na powierzchni. Patrzę na skórę w szerszym kontekście – jej bariery, reaktywności, mikrobiomu, stylu życia, stresu oraz kondycji całego organizmu.
                </p>
                <p>
                  Nie rozpoczynam terapii od wyboru gotowego zabiegu. Najpierw staram się zrozumieć, co skóra komunikuje, jakie procesy mogą podtrzymywać problem oraz do jakiego rodzaju działania jest aktualnie przygotowana.
                </p>
                <p>
                  Na tej podstawie projektuję indywidualne terapie, które mogą łączyć odpowiednio dobrane technologie, techniki manualne, preparaty zabiegowe i pielęgnację domową.
                </p>
              </div>

              {/* 3 Kluczowe Akcenty Filozofii */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-white/80 border border-luxury-sand/80 rounded-xs space-y-1 shadow-2xs">
                  <span className="font-mono text-[8.5px] uppercase tracking-wider text-luxury-gold font-bold block">01. Bez Schematów</span>
                  <p className="text-[11px] text-luxury-dark/95 leading-relaxed font-light">
                    Terapie projektowane przy pacjencie, na podstawie diagnozy z danego dnia.
                  </p>
                </div>
                <div className="p-3.5 bg-white/80 border border-luxury-sand/80 rounded-xs space-y-1 shadow-2xs">
                  <span className="font-mono text-[8.5px] uppercase tracking-wider text-luxury-gold font-bold block">02. Gotowość Biologiczna</span>
                  <p className="text-[11px] text-luxury-dark/95 leading-relaxed font-light">
                    Wspieranie procesów, do których skóra ma aktualne zasoby i energię.
                  </p>
                </div>
                <div className="p-3.5 bg-white/80 border border-luxury-sand/80 rounded-xs space-y-1 shadow-2xs">
                  <span className="font-mono text-[8.5px] uppercase tracking-wider text-luxury-gold font-bold block">03. Samoregulacja</span>
                  <p className="text-[11px] text-luxury-dark/95 leading-relaxed font-light">
                    Wspieranie funkcji obronnych i adaptacyjnych zamiast sztucznego wyręczania.
                  </p>
                </div>
              </div>

              {/* Podpis i CTA */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-luxury-sand/60">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-[1px] bg-luxury-gold" />
                  <div>
                    <div className="font-serif text-base tracking-wider text-luxury-dark font-medium">Katarzyna Brzezińska</div>
                    <div className="font-mono text-[8.5px] text-luxury-dark/90 tracking-widest uppercase">
                      Instytut Zdrowej Skóry • Jelcz-Laskowice
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onLinkClick("/pierwsza-wizyta-diagnostyka-skory/")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-luxury-dark hover:bg-luxury-gold text-white text-[10px] font-mono uppercase tracking-[0.18em] transition-all duration-300 shadow-xs cursor-pointer"
                >
                  <span>Umów Konsultację</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Expert Portrait & Credentials Card */}
            <div className="lg:col-span-5 space-y-4 max-w-sm mx-auto w-full">
              <div className="border border-luxury-sand/90 p-3 bg-white shadow-[0_16px_36px_rgba(179,155,114,0.08)] relative group">
                <div className="aspect-[4/5] bg-luxury-sand relative overflow-hidden">
                  <img 
                    src="https://slow-skin.pl/wp-content/uploads/2025/10/doktor_2.jpg"
                    alt="Katarzyna Brzezińska — Twórczyni Slow Skin Concept"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-luxury-gold font-semibold block">
                      Instytut Zdrowej Skóry
                    </span>
                    <h3 className="font-serif text-lg font-light text-white">
                      Katarzyna Brzezińska
                    </h3>
                    <p className="text-[10px] text-luxury-cream/80 font-light">
                      Kosmetologia interdyscyplinarna
                    </p>
                  </div>
                </div>
              </div>

              {/* Wizytówka Autorskich Metodologii */}
              <div className="p-4 bg-white/90 border border-luxury-sand/80 space-y-2 text-left shadow-2xs">
                <span className="font-mono text-[8.5px] uppercase tracking-widest text-luxury-gold font-bold block">
                  Autorskie Metodologie & Koncepcje
                </span>
                <ul className="space-y-1.5 text-[11px] text-luxury-dark font-light">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    <span><strong>Slow Skin Concept™</strong> — filozofia w rytmie biologii</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    <span><strong>Biologiczna Spirala Inteligencji Skóry™</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    <span><strong>Biological Skin Intelligence™</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    <span><strong>Atelier Biologicznej Terapii Skóry™</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DiscreetSection>

      {/* 4. OD CZEGO ZACZĄĆ? (KLUCZOWE FORMATY PRACY & USŁUGI) */}
      <DiscreetSection className="space-y-12" id="od-czego-zaczac-sekcja">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold block">
            Ścieżka Terapii i Współpracy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-luxury-dark">
            Od czego zacząć?
          </h2>
          <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto my-2" />
          <p className="text-xs sm:text-sm text-luxury-dark/95 font-light max-w-2xl mx-auto leading-relaxed">
            W Slow Skin Concept™ każda droga do zdrowej skóry ma uporządkowaną strukturę. Wybierz format odpowiadający Twoim aktualnym potrzebom.
          </p>
        </div>

        {/* Entry Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {entryServices.map((service, idx) => (
            <div
              key={service.id}
              className={`p-8 bg-white border transition-all duration-300 rounded-xs flex flex-col justify-between text-left space-y-6 shadow-sm hover:shadow-xl hover:border-luxury-gold/70 group relative overflow-hidden ${
                service.id === "konsultacja" || service.id === "autorska-terapia"
                  ? "border-luxury-gold/60 bg-gradient-to-br from-white via-white to-[#FAF8F5]"
                  : "border-luxury-sand/80"
              }`}
            >
              {/* Subtle top accent */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase font-bold px-2.5 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
                    {service.badge}
                  </span>
                  <span className="font-mono text-[9px] text-luxury-dark/90 font-semibold">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-light text-luxury-dark group-hover:text-luxury-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-serif text-xs italic text-luxury-gold font-normal">
                    {service.subtitle}
                  </p>
                </div>

                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                  {service.description}
                </p>

                {/* Bullets */}
                <div className="space-y-2 pt-2 border-t border-luxury-sand/40">
                  {service.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-[11px] text-luxury-dark/95 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold shrink-0 mt-1.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4 border-t border-luxury-sand/50">
                <button
                  onClick={() => onLinkClick(service.url)}
                  className="w-full py-3 px-4 bg-luxury-dark group-hover:bg-luxury-gold text-white font-mono text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{service.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DiscreetSection>

      {/* 5. VIDEO B-ROLL EXPERIENCE SECTION */}
      <DiscreetSection className="space-y-6">
        <VideoPlayerSection />
      </DiscreetSection>

      {/* 6. FINAL BOTTOM CTA BANNER */}
      <DiscreetSection className="border border-luxury-gold/50 bg-[#FAF8F5] p-10 md:p-14 text-center space-y-6 max-w-3xl mx-auto shadow-md rounded-xs">
        <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
          Instytut Zdrowej Skóry • Jelcz-Laskowice
        </span>
        <h3 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
          Poznaj Potencjał Swojej Skóry
        </h3>
        <p className="text-xs sm:text-sm text-luxury-dark/95 font-light max-w-lg mx-auto leading-relaxed">
          Zamiast przypadkowych zabiegów z cennika, rozpocznij świadomą terapię biologiczną dopasowaną do Twojej aktualnej gotowości komórkowej.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => onLinkClick("/pierwsza-wizyta-diagnostyka-skory/")}
            className="px-8 py-3.5 bg-luxury-dark text-white text-[10px] font-mono tracking-widest uppercase hover:bg-luxury-gold transition-all cursor-pointer shadow-sm"
          >
            Umów Konsultację Diagnostyczną
          </button>
          <button
            onClick={() => onLinkClick("/zabiegi-na-twarz/")}
            className="px-8 py-3.5 border border-luxury-gold text-luxury-gold text-[10px] font-mono tracking-widest uppercase hover:bg-luxury-gold hover:text-white transition-all cursor-pointer font-medium"
          >
            Katalog Terapii Twarzy
          </button>
        </div>
      </DiscreetSection>

    </div>
  );
};
