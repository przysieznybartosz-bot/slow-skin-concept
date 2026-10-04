import React from "react";
import { motion } from "motion/react";
import { EditableImage } from "./EditableImage";
import { 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Zap, 
  Brain, 
  Cpu, 
  Radio, 
  ArrowRight,
  Droplets,
  Search,
  Video,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  Compass,
  FileText,
  HelpCircle,
  Stethoscope,
  HeartHandshake
} from "lucide-react";
import { Treatment } from "../types";
import TreatmentCard from "./TreatmentCard";

interface FacialTreatmentsPageProps {
  treatments: Treatment[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTreatment: (treatment: Treatment | null) => void;
  onOpenBooking: (treatment: Treatment) => void;
  onLinkClick: (url: string) => void;
  getTreatmentCategory: (id: string) => string;
}

export const FacialTreatmentsPage: React.FC<FacialTreatmentsPageProps> = ({
  treatments,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSelectTreatment,
  onOpenBooking,
  onLinkClick,
  getTreatmentCategory
}) => {
  // 7 Terapii skóry według potrzeb
  const problemTherapies = [
    {
      id: "rosacea-calm-therapy",
      url: "/rosacea-calm-therapy/",
      title: "Rosacea Calm Therapy",
      subtitle: "Indywidualna pielęgnacja skóry z rumieniem, wrażliwej i reaktywnej",
      tag: "UKOJENIE • BARIERA • NAWODNIENIE",
      time: "75–90 minut",
      price: "380–480 zł",
      desc: "Indywidualnie komponowany zabieg dla skóry skłonnej do zaczerwienienia, pieczenia i uczucia gorąca. Poprawia komfort, zwiększa nawodnienie i wspiera architekturę lipidową.",
      image: "/src/assets/images/rosacea_calm_1790249310213.jpg"
    },
    {
      id: "skin-remodeling-therapy",
      aliasId: "lift-firm-therapy",
      url: "/skin-remodeling-therapy/",
      title: "Skin Remodeling Therapy (Lift & Firm)",
      subtitle: "Indywidualnie projektowana terapia jędrności, gęstości i owalu twarzy",
      tag: "JĘDRNOŚĆ • GĘSTOŚĆ • OWAL • REGENERACJA",
      time: "około 90 minut",
      price: "500–750 zł",
      desc: "Wielopoziomowa przebudowa dla skóry tracącej jędrność i wyraźny kontur. Dobór metod oddziałujących na różne poziomy tkanek ze stałą kontrolą regeneracji.",
      image: "/src/assets/images/remodeling_therapy_1790249327484.jpg"
    },
    {
      id: "healthy-glow-therapy",
      url: "/healthy-glow-therapy/",
      title: "Healthy Glow Therapy",
      subtitle: "Spersonalizowana terapia dla skóry zmęczonej, szarej i pozbawionej blasku",
      tag: "NAWODNIENIE • ROZŚWIETLENIE • ANTYOKSYDACJA",
      time: "75–90 minut",
      price: "400–500 zł",
      desc: "Delikatne odświeżenie powierzchni naskórka z intensywnym nawilżeniem i ochroną antyoksydacyjną. Przywraca autentyczny, świeży blask bez powierzchownego maskowania.",
      image: "/src/assets/images/healthy_glow_1790249342266.jpg"
    },
    {
      id: "acne-balance-therapy",
      url: "/acne-balance-therapy/",
      title: "Acne Balance Therapy",
      subtitle: "Spersonalizowana terapia dla skóry z niedoskonałościami, zaskórnikami i zaburzoną równowagą sebum",
      tag: "OCZYSZCZENIE • SEBUM • ROGOWACENIE • MIKROBIOM",
      time: "75–90 minut",
      price: "350–450 zł",
      desc: "Fizjologiczna regulacja pracy gruczołów łojowych i wsparcie mikrobiomu bez przesuszania naskórka i bez niszczenia spoiwa ceramidowego.",
      image: "/src/assets/images/acne_balance_1790249354155.jpg"
    },
    {
      id: "adult-acne-therapy",
      url: "/adult-acne-therapy/",
      title: "Acne Balance 25+ Therapy",
      subtitle: "Spersonalizowana terapia niedoskonałości skóry dorosłej",
      tag: "NIEDOSKONAŁOŚCI • BARIERA • SEBUM • PRZEBARWIENIA",
      time: "80–90 minut",
      price: "380–480 zł",
      desc: "Dedykowana skórze dorosłej (strefa U, żuchwa), w której niedoskonałości współistnieją z odwodnieniem, reaktywnością, plamami pozapalnymi i pierwszymi oznakami starzenia.",
      image: "/src/assets/images/acne_balance_1790249354155.jpg"
    },
    {
      id: "couperose-therapy",
      url: "/couperose-therapy/",
      title: "Couperose Therapy",
      subtitle: "Spersonalizowana terapia skóry naczyniowej, reaktywnej i skłonnej do zaczerwienienia",
      tag: "NACZYNKA • RUMIEŃ • BARIERA • KOMFORT",
      time: "60–75 minut",
      price: "350–500 zł",
      desc: "Pielęgnacja skóry z widocznymi teleangiektazjami i napadowym rumieniem. Ochrona antyoksydacyjna, wzmocnienie śródbłonka i ukojenie bez przegrzewania tkanek.",
      image: "/src/assets/images/rosacea_calm_1790249310213.jpg"
    },
    {
      id: "pigment-balance-therapy",
      url: "/pigment-balance-therapy/",
      title: "Pigment Balance Therapy",
      subtitle: "Indywidualna terapia skóry z przebarwieniami i nierównomiernym kolorytem",
      tag: "PRZEBARWIENIA • KOLORYT • ODNOWA • OCHRONA",
      time: "80–90 minut",
      price: "400–550 zł",
      desc: "Terapia plam posłonecznych, melasmy i przebarwień pozapalnych PIH. Działa enzymatycznie i antyoksydacyjnie, wyciszając stan zapalny będący motorem melanogenezy.",
      image: "/src/assets/images/pigment_balance_1790249364420.jpg"
    },
    {
      id: "neurolifting-nogier",
      url: "/neurolifting/",
      title: "Neurolifting — Rytuał Odprężający dla Twarzy",
      subtitle: "Masaż powięziowy, delikatne mikroprądy i biologiczne rozluźnienie napięć",
      tag: "RELAKSACJA • DRENAŻ • MIKROKRĄŻENIE",
      time: "40–75 minut",
      price: "250–350 zł",
      desc: "Nieinwazyjna stymulacja częstotliwościami Nogiera i technikami manualnymi uwalniająca spiętą powięź, wspomagająca drenaż chłonki i przynosząca głęboki relaks.",
      image: "/src/assets/images/neurolifting_ceremony_1786131495914.jpg"
    }
  ];

  // 11 Technologii i metod aparaturowych/manualnych
  const technologiesList = [
    {
      name: "Neurolifting",
      role: "Fale częstotliwościowe Nogiera i mikroprądy",
      desc: "Biologiczne wyciszenie receptorów czuciowych, drenaż limfatyczny i głębokie rozluźnienie spiętych struktur powięziowych."
    },
    {
      name: "Mezoterapia bezigłowa",
      role: "Elektroporacja błonowa",
      desc: "Bezinwazyjne wprowadzanie substancji czynnych w głąb naskórka za pomocą pola elektromagnetycznego bez przerwania ciągłości skóry."
    },
    {
      name: "Mezoterapia mikroigłowa",
      role: "Kontrolowana mikrostymulacja",
      desc: "Precyzyjny bodziec uruchamiający naturalną syntezę kolagenu — stosowany wyłącznie po uprzednim przygotowaniu i uszczelnieniu bariery."
    },
    {
      name: "Mezoterapia igłowa",
      role: "Śródskórny depozyt składników",
      desc: "Bezpośrednie podanie nieusieciowanego kwasu hialuronowego, aminokwasów i polinukleotydów do warstwy skóry właściwej."
    },
    {
      id: "stymulatory-tkankowe",
      url: "/tissue-stimulators/",
      name: "Stymulatory tkankowe",
      role: "Indywidualna biostymulacja iniekcyjna",
      desc: "Stopniowa przebudowa tkanek i poprawa jakości skóry bez dodawania objętości: polinukleotydy, kwas hialuronowy, kompleksy aminokwasowe lub induktory kolagenu, zawsze z fototerapią LED."
    },
    {
      name: "Radiofrekwencja mikroigłowa",
      role: "Mikronakłuwanie + energia fali RF",
      desc: "Dwuetapowa przebudowa struktury skóry: mechaniczne mikronakłucie i jednoczesne termiczne zagęszczenie włókien podporowych."
    },
    {
      name: "HIFU (Skoncentrowane ultradźwięki)",
      role: "Głębokie modelowanie SMAS",
      desc: "Punktowa koagulacja termiczna na ściśle określonej głębokości tkanek wspierająca poprawę owalu i napięcie bez okresu rekonwalescencji."
    },
    {
      name: "Nanobrazja",
      role: "Fizjologiczna nanodermabrazja",
      desc: "Bezinwazyjne, aksamitne mikrozłuszczanie zrogowaciałego naskórka za pomocą nano-dysków bez ryzyka wywołania stanu zapalnego."
    },
    {
      name: "Infuzja tlenowa",
      role: "Tlen hiperbaryczny",
      desc: "Aplikacja biologicznie aktywnych koncentratów w strumieniu czystego tlenu, zapewniająca natychmiastowe nawodnienie i ukojenie."
    },
    {
      name: "Oksybrazja",
      role: "Chłodzący peeling wodno-tlenowy",
      desc: "Fizjologiczne oczyszczanie solą fizjologiczną i tlenem — w pełni bezpieczne dla cer naczyniowych, z rumieniem i nadreaktywnością."
    },
    {
      id: "carboksyterapia-carboregen",
      url: "/carboksyterapia-carboregen/",
      name: "Carboksyterapia CARBOregen",
      role: "Iniekcyjna stymulacja CO₂ & Efekt Bohra",
      desc: "Kontrolowane podanie medycznego dwutlenku węgla wywołujące zjawisko efektu Bohra — gwałtowne rozszerzenie naczyń, dotlenienie tkanek, odżywienie komórkowe i syntezę kolagenu."
    },
    {
      id: "sonaris-pro-therapy",
      url: "/sonaris-pro/",
      name: "Sonaris Pro Therapy",
      role: "Impulsy elektromagnetyczne",
      desc: "Komfortowa, nieinwazyjna stymulacja poprawiająca napięcie, mikrokrążenie i elastyczność skóry twarzy oraz delikatnej okolicy oczu bez nakłuwania."
    },
    {
      name: "Metody manualne",
      role: "Terapia mięśniowo-powięziowa",
      desc: "Autorski masaż rozluźniający napięcia mimiczne, zrosty powięziowe i zastoje limfatyczne, przywracający naturalne proporcje twarzy."
    },
    {
      name: "Masaż termiczny Ceragem",
      role: "Ceragem VE CGM MB-1101",
      desc: "Automatyczny masaż termiczny pleców łączący ogrzewane elementy masujące, rozpoznawanie długości kręgosłupa i relaksującą aromaterapię dla rozluźnienia mięśni."
    },
    {
      name: "Terapia Sygnałem Pulsacyjnym PST",
      role: "PST H-200 & PST H-300",
      desc: "Nieinwazyjna terapia pulsującym polem elektromagnetycznym wspierająca regenerację stawów i kręgosłupa, redukcję bólu oraz odzyskanie swobody ruchu."
    }
  ];

  // 5 Programów prowadzenia skóry
  const skinPrograms = [
    {
      number: "01",
      title: "Program odbudowy bariery naskórkowej",
      recipient: "Dla skór uszkodzonych, chronicznie suchych, reagujących pieczeniem i ściągnięciem po agresywnych kuracjach.",
      focus: "Odbudowa cementu międzykomórkowego, wyciszenie kaskady zapalnej, przywrócenie szczelności i komfortu.",
      duration: "Proces 4–8 tygodni"
    },
    {
      number: "02",
      title: "Program terapii skóry reaktywnej i naczyniowej",
      recipient: "Dla skór z napadowym rumieniem, trądzikiem różowatym i tendencją do rozszerzania naczyń krwionośnych.",
      focus: "Wzmocnienie śródbłonka naczyń, obniżenie neuroreaktywności, ochrona przed wahaniami temperatury i stresem.",
      duration: "Proces 6–12 tygodni"
    },
    {
      number: "03",
      title: "Program Healthy Aging 40+",
      recipient: "Dla skór z widoczną utratą jędrności, spowolnionym metabolizmem komórkowym i zmianą proporcji owalu twarzy.",
      focus: "Stymulacja fibroblastów do produkcji nowego kolagenu, neurolifting, ochrona przed glikacją i utlenianiem.",
      duration: "Proces 8–16 tygodni"
    },
    {
      number: "04",
      title: "Program dla skóry menopauzalnej",
      recipient: "Dla kobiet doświadczających spadku poziomu estrogenów, atrofii skóry, nagłej wiotkości i suchości.",
      focus: "Kompensacja deficytów lipidowych, fitoestrogeny roślinne, ochrona macierzy zewnątrzkomórkowej i delikatna stymulacja.",
      duration: "Proces ciągły / sekwencje okresowe"
    },
    {
      number: "05",
      title: "Program przebudowy i regeneracji tkanek",
      recipient: "Dla skór z bliznami potrądzikowymi, nierówną teksturą, rozszerzonymi porami i głębokimi bruzdami.",
      focus: "Przygotowanie bariery, mikronakłuwanie lub fale RF, intensywna faza przebudowy i długofalowa regeneracja.",
      duration: "Proces 12–20 tygodni"
    }
  ];

  // Filtrowanie monografii do dolnego katalogu
  const filteredTreatments = treatments.filter((treatment) => {
    const matchesCategory = selectedCategory === "wszystkie" || getTreatmentCategory(treatment.id) === selectedCategory;
    if (!matchesCategory) return false;
    
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const matchTitle = treatment.title.toLowerCase().includes(query);
    const matchSubtitle = treatment.subtitle.toLowerCase().includes(query);
    const matchDescription = treatment.description?.toLowerCase().includes(query) || false;
    const matchFocus = treatment.focus?.toLowerCase().includes(query) || false;
    const matchIndications = treatment.indications?.some(ind => ind.toLowerCase().includes(query)) || false;
    
    return matchTitle || matchSubtitle || matchDescription || matchFocus || matchIndications;
  });

  const handleSelectById = (id: string, fallbackUrl?: string) => {
    const found = treatments.find(t => t.id === id);
    if (found) {
      onSelectTreatment(found);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (fallbackUrl) {
      onLinkClick(fallbackUrl);
    }
  };

  const skinReadinessTreatment = treatments.find(t => t.id === "skin-readiness") || treatments[0];

  return (
    <div className="space-y-20 text-left animate-fade-in" id="facial-treatments-hub">
      
      {/* GŁÓWNY KOMUNIKAT PORZĄDKUJĄCY CAŁĄ OFERTĘ */}
      <section className="border border-luxury-sand bg-white/80 p-8 md:p-14 relative overflow-hidden shadow-sm space-y-8">
        <div className="max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
              Oferta Zabiegowa & Programy Prowadzenia
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-luxury-dark leading-tight tracking-wide">
            Zabiegi i terapie dopasowane do biologicznej gotowości skóry
          </h1>

          <div className="w-20 h-[1.5px] bg-luxury-gold/70" />

          <p className="text-sm md:text-base font-serif italic text-luxury-dark/95 leading-relaxed">
            W Slow Skin Concept technologia nie jest punktem wyjścia. Każda terapia rozpoczyna się od zrozumienia aktualnej kondycji skóry, a jej przebieg powstaje poprzez indywidualny dobór metod, intensywności i kolejności działań.
          </p>

          <p className="text-xs md:text-sm text-luxury-dark font-light leading-relaxed">
            Nie narzucamy gotowych, masowych schematów. Skóra jest dynamicznym ekosystemem biologicznym, w którym bariera, mikrobiom, układ nerwowy i naczynia krwionośne stale na siebie oddziałują. Poniżej przedstawiamy cztery czytelne filary naszej pracy gabinetowej: od pierwszej wizyty diagnostycznej, przez celowane terapie problemowe, po zaawansowane narzędzia technologiczne i długofalowe programy prowadzenia cery.
          </p>
        </div>

        {/* 5-Pill Quick Navigation */}
        <div className="pt-4 border-t border-luxury-sand/50 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <a 
            href="#obszar-1-pierwsza-wizyta"
            className="p-2.5 bg-[#FAF8F5] border border-luxury-sand/70 hover:border-luxury-gold hover:bg-white transition-all rounded-sm flex items-center justify-between group"
          >
            <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-luxury-dark group-hover:text-luxury-gold font-medium">
              1. Pierwsza wizyta
            </span>
            <ArrowRight className="w-3 h-3 text-luxury-gold shrink-0 transition-transform group-hover:translate-x-1" />
          </a>

          <a 
            href="#obszar-2-terapie-skory"
            className="p-2.5 bg-[#FAF8F5] border border-luxury-sand/70 hover:border-luxury-gold hover:bg-white transition-all rounded-sm flex items-center justify-between group"
          >
            <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-luxury-dark group-hover:text-luxury-gold font-medium">
              2. Terapie skóry
            </span>
            <ArrowRight className="w-3 h-3 text-luxury-gold shrink-0 transition-transform group-hover:translate-x-1" />
          </a>

          <a 
            href="#obszar-3-technologie"
            className="p-2.5 bg-[#FAF8F5] border border-luxury-sand/70 hover:border-luxury-gold hover:bg-white transition-all rounded-sm flex items-center justify-between group"
          >
            <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-luxury-dark group-hover:text-luxury-gold font-medium">
              3. Technologie
            </span>
            <ArrowRight className="w-3 h-3 text-luxury-gold shrink-0 transition-transform group-hover:translate-x-1" />
          </a>

          <a 
            href="#obszar-4-programy"
            className="p-2.5 bg-[#FAF8F5] border border-luxury-sand/70 hover:border-luxury-gold hover:bg-white transition-all rounded-sm flex items-center justify-between group"
          >
            <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-luxury-dark group-hover:text-luxury-gold font-medium">
              4. Programy
            </span>
            <ArrowRight className="w-3 h-3 text-luxury-gold shrink-0 transition-transform group-hover:translate-x-1" />
          </a>

          <a 
            href="#ceragem-masaz"
            className="p-2.5 bg-luxury-gold/10 border border-luxury-gold/50 hover:border-luxury-gold hover:bg-luxury-gold/20 transition-all rounded-sm flex items-center justify-between group col-span-2 sm:col-span-1"
          >
            <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider text-luxury-gold group-hover:text-luxury-dark font-bold">
              5. Ceragem & PST ✨
            </span>
            <ArrowRight className="w-3 h-3 text-luxury-gold shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* OBSZAR 1: PIERWSZA WIZYTA I SKIN READINESS */}
      <section className="border-2 border-luxury-gold/40 bg-white p-8 md:p-14 space-y-10 rounded-sm shadow-md scroll-mt-32 md:scroll-mt-36" id="obszar-1-pierwsza-wizyta">
        
        {/* Header Sekcji */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
            <Compass className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
              Obszar 1 • Punkt Wyjścia Każdej Terapii
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-luxury-dark">
            SKIN READINESS — Pierwsza wizyta
          </h2>

          <p className="font-sans text-xs sm:text-sm text-luxury-dark/90 font-medium">
            Poznajemy potrzeby skóry i przygotowujemy ją do dalszej terapii
          </p>
        </div>

        {/* Zdjęcie i Wprowadzenie Merytoryczne */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 relative group overflow-hidden rounded-none border border-luxury-sand shadow-sm self-start">
            <img 
              src="/src/assets/images/skin_readiness_diag_1790249295522.jpg" 
              alt="Diagnoza biologiczna i konsultacja Skin Readiness"
              className="w-full h-auto max-h-[380px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5 pointer-events-none">
              <span className="font-mono text-[8px] uppercase tracking-widest text-luxury-gold bg-black/60 px-2 py-0.5">
                Konsultacja i diagnoza
              </span>
              <p className="text-[11px] font-sans text-luxury-cream">
                Poznanie potrzeb skóry i ocena stanu bariery naskórkowej
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-luxury-dark/95 font-light leading-relaxed font-sans">
            <p>
              Pierwsza wizyta zaczyna się od poznania Twojej skóry. Rozmawiamy o jej potrzebach, codziennej pielęgnacji i wcześniejszych zabiegach. Oceniam jej aktualną kondycję, nawilżenie, reaktywność oraz stan bariery naskórkowej.
            </p>
            <p>
              Na tej podstawie dobieram odpowiednie postępowanie gabinetowe. Jeśli kondycja skóry na to pozwala, wizyta obejmuje również delikatny zabieg oczyszczający i przygotowujący do dalszej pracy.
            </p>
            <p>
              Otrzymujesz indywidualne zalecenia pielęgnacyjne i plan kolejnych kroków, dopasowany do potrzeb oraz tolerancji Twojej skóry.
            </p>
          </div>
        </div>

        {/* 2 Kolumny: Dla kogo & Jak przebiega wizyta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Dla kogo przeznaczona jest pierwsza wizyta */}
          <div className="border border-luxury-sand/80 bg-[#FAF8F5] p-6 sm:p-8 rounded-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-luxury-sand/60 pb-3">
              <HeartHandshake className="w-4 h-4 text-luxury-gold" />
              <h3 className="font-serif text-lg font-medium text-luxury-dark">
                Dla kogo przeznaczona jest pierwsza wizyta?
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-luxury-dark font-light">
              {[
                "Dla osób, które rozpoczynają terapię w Slow Skin Concept",
                "Gdy nie wiesz, jakiego zabiegu aktualnie potrzebuje Twoja skóra",
                "Gdy stosujesz wiele kosmetyków, a stan skóry nie ulega poprawie",
                "Przy uczuciu suchości, ściągnięcia, pieczenia lub nadmiernej reaktywności",
                "Przy nierównej powierzchni, nadmiernym rogowaceniu albo skłonności do niedoskonałości",
                "Po przebytych intensywnych zabiegach lub pielęgnacji, które osłabiły komfort skóry",
                "Gdy zależy Ci na uporządkowanym, bezpiecznym planie dalszego postępowania"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Jak przebiega wizyta */}
          <div className="border border-luxury-sand/80 bg-white p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-luxury-sand/60 pb-3">
              <Activity className="w-4 h-4 text-luxury-gold" />
              <h3 className="font-serif text-lg font-medium text-luxury-dark">
                Jak przebiega wizyta?
              </h3>
            </div>
            <div className="space-y-3.5">
              {[
                {
                  num: "1",
                  title: "Rozmowa i wywiad",
                  desc: "Analizowane są dotychczasowa pielęgnacja, wcześniejsze zabiegi, reakcje skóry, styl życia oraz czynniki, które mogą wpływać na jej aktualną kondycję."
                },
                {
                  num: "2",
                  title: "Diagnoza biologiczna skóry",
                  desc: "Oceniane są najważniejsze parametry i widoczne cechy skóry. Określany jest jej aktualny priorytet oraz gotowość do kolejnych działań."
                },
                {
                  num: "3",
                  title: "Indywidualnie dobrany reset zabiegowy",
                  desc: "Sposób oczyszczania, intensywność działania i zastosowane metody dobierane są do kondycji skóry. Zabieg może obejmować łagodne oczyszczanie, fizjologiczne złuszczanie, wsparcie nawodnienia, ukojenie lub pielęgnację bariery."
                },
                {
                  num: "4",
                  title: "Kierunek dalszej terapii",
                  desc: "Na podstawie odpowiedzi skóry określany jest kolejny etap Biologicznej Spirali Inteligencji Skóry. Ustalane są również podstawowe zalecenia pielęgnacji domowej."
                }
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-luxury-gold px-2 py-0.5 bg-luxury-gold/10 border border-luxury-gold/30 rounded-xs">
                    {step.num}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-serif text-xs font-semibold text-luxury-dark">{step.title}</h4>
                    <p className="text-[11px] text-luxury-dark/90 font-light leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Co daje Biologiczny Reset Skóry */}
        <div className="border border-luxury-sand bg-white p-6 sm:p-8 rounded-sm space-y-4">
          <h3 className="font-serif text-lg font-medium text-luxury-dark">
            Co daje Biologiczny Reset Skóry?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1">
            {[
              "Rozpoznanie aktualnego stanu i potrzeb skóry",
              "Delikatne oczyszczenie i odświeżenie bez naruszania bariery",
              "Poprawę komfortu, nawodnienia i wyciszenie reaktywności",
              "Bezpieczne przygotowanie do kolejnych zabiegów",
              "Jasny, indywidualny plan dalszego postępowania"
            ].map((benefit, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAF8F5] border border-luxury-sand/60 rounded-xs space-y-1.5 text-left">
                <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase">Korzyść 0{idx + 1}</span>
                <p className="text-xs text-luxury-dark font-light leading-snug">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kluczowa zasada & Ważna informacja */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-luxury-dark">
          <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/30 rounded-sm space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-bold block">
              Kluczowa zasada:
            </span>
            <p className="leading-relaxed">
              Reset nie oznacza intensywnego złuszczania. Oznacza uporządkowanie skóry i przygotowanie jej do tego, czego rzeczywiście potrzebuje w kolejnym etapie.
            </p>
          </div>

          <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/60 rounded-sm space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-dark font-bold block">
              Ważna informacja:
            </span>
            <p className="leading-relaxed">
              Biologiczny Reset Skóry nie ma jednego, identycznego przebiegu. Zakres zabiegu jest ustalany podczas wizyty, ponieważ każda skóra może rozpoczynać terapię z innego biologicznego punktu wyjścia.
            </p>
          </div>
        </div>

        {/* Parametry Wizyty i Główny CTA */}
        <div className="pt-6 border-t border-luxury-sand/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#FAF8F5] p-6 rounded-sm">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-luxury-dark">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-luxury-gold" />
                Czas trwania: <strong>około 120 minut</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-luxury-gold" />
                Cena: <strong>400–600 zł</strong>
              </span>
            </div>
            <p className="text-[11px] text-luxury-dark/95 font-light">
              Pakiet Standard (400 PLN) • Pakiet Premium z diagnostyką aparaturową Nati V3/Iomet i Beauty Planem (600 PLN)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenBooking(skinReadinessTreatment)}
              className="px-8 py-3.5 bg-luxury-gold hover:bg-luxury-dark text-white font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer text-center flex-1 md:flex-initial"
            >
              UMÓW PIERWSZĄ WIZYTĘ
            </button>
            <button
              onClick={() => onSelectTreatment(skinReadinessTreatment)}
              className="px-5 py-3 border border-luxury-dark/30 hover:border-luxury-gold text-luxury-dark font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Zobacz monografię →
            </button>
          </div>
        </div>
      </section>

      {/* OBSZAR 2: TERAPIE SKÓRY */}
      <section className="space-y-8 scroll-mt-32 md:scroll-mt-36" id="obszar-2-terapie-skory">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
            <Layers className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
              Obszar 2 • Kierunki Terapii Według Potrzeb Skóry
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-luxury-dark">
            Terapie skóry
          </h2>

          <div className="w-16 h-[1px] bg-luxury-gold" />

          <p className="text-xs md:text-sm text-luxury-dark font-light leading-relaxed">
            Klientka najczęściej szuka rozwiązania swojego problemu, dlatego terapie uporządkowane są według potrzeb skóry. Nie przypisujemy każdej terapii jednej technologii, ponieważ jej przebieg ustalany jest indywidualnie:
          </p>
        </div>

        {/* Kafelki Terapii Skóry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problemTherapies.map((therapy) => (
            <div
              key={therapy.id}
              onClick={() => handleSelectById(therapy.id, therapy.url)}
              className="border border-luxury-sand bg-white p-5 rounded-sm space-y-4 flex flex-col justify-between hover:border-luxury-gold hover:shadow-lg transition-all duration-300 cursor-pointer group text-left relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="h-36 overflow-hidden rounded-xs relative">
                  <EditableImage
                    id={therapy.id}
                    slotName={therapy.title}
                    src={therapy.image}
                    alt={therapy.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    aspectRatioClass="h-full w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2 font-mono text-[8px] bg-luxury-dark/90 text-white px-2 py-0.5 uppercase tracking-wider font-semibold pointer-events-none">
                      {therapy.time} • {therapy.price}
                    </span>
                  </EditableImage>
                </div>

                <span className="font-mono text-[8px] uppercase tracking-widest text-luxury-gold font-bold block">
                  {therapy.tag}
                </span>

                <h3 className="font-serif text-base font-medium text-luxury-dark group-hover:text-luxury-gold transition-colors leading-snug">
                  {therapy.title}
                </h3>

                <p className="text-[11px] text-luxury-dark/90 font-light leading-relaxed">
                  {therapy.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-luxury-sand/40 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-luxury-gold group-hover:text-luxury-dark transition-colors">
                <span>Zobacz monografię</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OBSZAR 3: TECHNOLOGIE I METODY */}
      <section className="border border-luxury-sand bg-white p-8 md:p-14 space-y-8 rounded-sm shadow-sm scroll-mt-32 md:scroll-mt-36" id="obszar-3-technologie">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
            <Cpu className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
              Obszar 3 • Narzędzia Dobierane Do Gotowości Skóry
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-luxury-dark">
            Technologie i metody
          </h2>

          <div className="w-16 h-[1px] bg-luxury-gold" />

          <p className="text-xs md:text-sm text-luxury-dark font-serif italic leading-relaxed">
            Przy każdej technologii pamiętamy: <strong>Nie jest gotową terapią samą w sobie. Jest narzędziem dobieranym i łączonym z innymi metodami w zależności od potrzeb oraz gotowości skóry.</strong>
          </p>
        </div>

        {/* 12 Technologii i Metod Aparaturowych / Manualnych */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {technologiesList.map((tech: any, idx) => (
            <div 
              key={idx}
              onClick={() => {
                if (tech.id) handleSelectById(tech.id, tech.url);
                else if (tech.url) onLinkClick(tech.url);
              }}
              className={`border border-luxury-sand/70 p-5 bg-[#FAF8F5] hover:bg-white hover:border-luxury-gold/60 transition-all duration-300 rounded-sm space-y-2 text-left ${tech.id || tech.url ? "cursor-pointer group" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-luxury-gold font-bold">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} / {technologiesList.length}
                </span>
                <Radio className="w-3 h-3 text-luxury-gold/70 group-hover:text-luxury-gold transition-colors" />
              </div>
              <h3 className="font-serif text-sm font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                <span>{tech.name}</span>
                {(tech.id || tech.url) && (
                  <ArrowRight className="w-3.5 h-3.5 text-luxury-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                )}
              </h3>
              <p className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold">{tech.role}</p>
              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed pt-1">{tech.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border border-luxury-gold/30 bg-luxury-gold/5 rounded-sm text-xs text-luxury-dark font-light leading-relaxed">
          <p>
            <strong>Indywidualna kwalifikacja:</strong> Zastosowanie technologii aparaturowej (zwłaszcza mikronakłuwania, radiofrekwencji czy HIFU) jest zawsze poprzedzone oceną biologicznej gotowości naskórka. Jeśli skóra wymaga najpierw wyciszenia lub odbudowy bariery, technologia zostaje zaplanowana na kolejnym etapie.
          </p>
        </div>
      </section>

      {/* OBSZAR 4: PROGRAMY PROWADZENIA SKÓRY */}
      <section className="border border-luxury-sand bg-[#FAF8F5] p-8 md:p-14 space-y-8 rounded-sm shadow-sm scroll-mt-32 md:scroll-mt-36" id="obszar-4-programy">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full">
            <Activity className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
              Obszar 4 • Długofalowa Opieka Terapeutyczna
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-luxury-dark">
            Programy prowadzenia skóry
          </h2>

          <div className="w-16 h-[1px] bg-luxury-gold" />

          <p className="text-xs md:text-sm text-luxury-dark font-serif italic leading-relaxed">
            Dłuższe procesy obejmujące diagnozę, zabiegi gabinetowe, celowaną pielęgnację domową, bieżącą kontrolę reakcji skóry oraz modyfikowanie kolejnych etapów wraz ze zmianą jej kondycji.
          </p>
        </div>

        {/* 5 Programów Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skinPrograms.map((prog) => (
            <div 
              key={prog.number}
              className="border border-luxury-sand/80 bg-white p-5 rounded-sm space-y-3 flex flex-col justify-between hover:border-luxury-gold transition-all duration-300 shadow-xs"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-luxury-gold font-bold">
                  PROGRAM {prog.number}
                </span>
                <h3 className="font-serif text-sm font-medium text-luxury-dark leading-snug">
                  {prog.title}
                </h3>
                <div className="space-y-1.5 pt-1 text-[11px] font-light text-luxury-dark">
                  <p className="text-luxury-dark/80 italic">{prog.recipient}</p>
                  <p className="pt-1 text-luxury-dark/95 leading-relaxed">{prog.focus}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-luxury-sand/40">
                <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-semibold block">
                  {prog.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KATALOG MONOGRAFII, WYSZUKIWARKA & REZERWACJA VIDEOKONSULTACJI */}
      <section className="space-y-8 pt-6 border-t border-luxury-sand/60" id="monografie-zabiegowe">
        
        {/* Bramka Videokonsultacji Google Meet */}
        <div className="border-2 border-emerald-700/50 bg-gradient-to-br from-[#f2f7f5] via-white to-[#e8f1ee] p-6 sm:p-8 rounded-sm shadow-sm relative overflow-hidden max-w-5xl mx-auto">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-800 font-bold">
                  Dostępna z każdego miejsca • Konsultacja Kosmetologiczna Online
                </span>
                <span className="bg-emerald-800 text-white font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 font-semibold">
                  Google Meet
                </span>
              </div>

              <h3 className="font-serif text-2xl text-luxury-dark font-normal">
                Videokonsultacja Kosmetologiczna Skóry Online
              </h3>

              <p className="text-xs text-luxury-dark/95 leading-relaxed">
                Spotkanie wideo 1:1 z <strong>mgr Katarzyną Brzezińską</strong>. Pogłębiona diagnoza barierowa, analiza kosmetyków i stylu życia oraz autorski <strong>Beauty Plan (PDF)</strong> wysyłany po konsultacji. Połączenie przez bezpieczny pokój <strong>Google Meet</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-emerald-900 pt-1">
                <span>⏱️ Czas: <strong>60 minut</strong></span>
                <span>💎 Inwestycja: <strong>250 PLN</strong></span>
                <span>📹 Połączenie: <strong>Google Meet 1:1</strong></span>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5">
              <button
                onClick={() => {
                  const videoTgt = treatments.find(t => t.id === "videokonsultacja") || treatments[0];
                  onOpenBooking(videoTgt);
                }}
                className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Video className="w-4 h-4 text-emerald-300" />
                <span>Zarezerwuj (250 zł)</span>
              </button>
              
              <button
                onClick={() => handleSelectById("videokonsultacja")}
                className="px-6 py-2 border border-emerald-700/40 text-emerald-900 hover:bg-emerald-100/50 font-mono text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
              >
                Zobacz szczegóły →
              </button>
            </div>
          </div>
        </div>

        {/* Bramka Masażu Termicznego Ceragem */}
        <div id="ceragem-masaz" className="border border-luxury-gold/50 bg-gradient-to-br from-[#faf7f2] via-white to-[#f5eee3] p-6 sm:p-8 rounded-sm shadow-sm relative overflow-hidden max-w-5xl mx-auto scroll-mt-32 md:scroll-mt-36">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-luxury-gold font-bold">
                  Nowość w Gabinecie • Regeneracja i Rozluźnienie Pleców
                </span>
                <span className="bg-luxury-gold text-luxury-dark font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 font-bold">
                  Ceragem VE
                </span>
              </div>

              <h3 className="font-serif text-2xl text-luxury-dark font-normal">
                Masaż Termiczny Ceragem — Ciepło i masaż dopasowane do Twoich pleców
              </h3>

              <p className="text-xs text-luxury-dark/95 leading-relaxed">
                Łączy pracę ogrzewanych elementów masujących na łóżku <strong>Ceragem VE (model CGM MB-1101)</strong> ze spokojnym odpoczynkiem. Urządzenie rozpoznaje długość pleców, a temperaturę i intensywność dobieramy do Twoich odczuć. Sesji towarzyszą relaksująca muzyka i delikatna aromaterapia.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-luxury-dark pt-1">
                <span>⏱️ Czas: <strong>około 36 minut</strong></span>
                <span>💎 Inwestycja: <strong>50 PLN</strong></span>
                <span>🌿 Aromaterapia & kojące ciepło</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="w-full h-36 rounded-xs overflow-hidden border border-luxury-gold/40 shadow-xs relative">
                <img
                  src="/src/assets/images/ceragem_thermal_bed_therapy_1791108980537.jpg"
                  alt="Łóżko do masażu termicznego Ceragem VE"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-2xs">
                  Ceragem VE CGM MB-1101
                </div>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                <button
                  onClick={() => {
                    const ceragemTgt = treatments.find(t => t.id === "ceragem-thermal-massage") || treatments[0];
                    onOpenBooking(ceragemTgt);
                  }}
                  className="w-full py-3 bg-luxury-gold hover:bg-luxury-dark text-white font-mono text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <span>Zarezerwuj sesję (50 zł)</span>
                </button>
                <button
                  onClick={() => handleSelectById("ceragem-thermal-massage")}
                  className="w-full py-2 border border-luxury-gold/60 text-luxury-dark hover:bg-luxury-gold/10 font-mono text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
                >
                  Zobacz szczegóły →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bramka Terapii Sygnałem Pulsacyjnym PST */}
        <div className="border border-luxury-gold/50 bg-gradient-to-br from-[#f8f9fa] via-white to-[#f0f4f8] p-6 sm:p-8 rounded-sm shadow-sm relative overflow-hidden max-w-5xl mx-auto">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-luxury-gold font-bold">
                  Nowość w Gabinecie • Regeneracja Układu Ruchu
                </span>
                <span className="bg-luxury-dark text-luxury-cream font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 font-bold">
                  PST H-200 & H-300
                </span>
              </div>

              <h3 className="font-serif text-2xl text-luxury-dark font-normal">
                Terapia Sygnałem Pulsacyjnym PST — Więcej swobody w ruchu
              </h3>

              <p className="text-xs text-luxury-dark/95 leading-relaxed">
                Nieinwazyjna metoda wspierająca regenerację przy bólach i sztywności stawów oraz kręgosłupa. Wykorzystuje pulsujące pole elektromagnetyczne (PST H-200 do stawów obwodowych, PST H-300 do kręgosłupa i tułowia). Bez naruszania skóry, bez bólu i igieł — 60 minut głębokiego odpoczynku.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-luxury-dark pt-1">
                <span>⏱️ Czas sesji: <strong>około 60 minut</strong></span>
                <span>💎 Sesja: <strong>110 PLN</strong> (Seria 9: 990 zł / 12: 1320 zł)</span>
                <span>🩺 Konsultacja wstępna przed serią</span>
              </div>

              {/* Rzeczywiste aparaty PST H-300 i H-200 w gabinecie */}
              <div className="grid grid-cols-2 gap-3 pt-2 max-w-md">
                <div 
                  onClick={() => handleSelectById("pst-signal-therapy")}
                  className="p-2 bg-white/95 border border-luxury-sand/70 rounded-xs flex items-center gap-2.5 cursor-pointer hover:border-luxury-gold transition-colors group"
                >
                  <img 
                    src="/src/assets/images/pst_couch_bed_therapy_1791109628792.jpg" 
                    alt="PST H-300 w gabinecie — leżanka zabiegowa do kręgosłupa i bioder" 
                    className="w-12 h-10 object-cover rounded-xs shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[8.5px] uppercase font-bold text-luxury-dark group-hover:text-luxury-gold truncate">PST H-300</p>
                    <p className="text-[7.5px] font-mono text-luxury-gold/90 truncate">Kręgosłup & biodra</p>
                  </div>
                </div>

                <div 
                  onClick={() => handleSelectById("pst-signal-therapy")}
                  className="p-2 bg-white/95 border border-luxury-sand/70 rounded-xs flex items-center gap-2.5 cursor-pointer hover:border-luxury-gold transition-colors group"
                >
                  <img 
                    src="/src/assets/images/pst_chair_therapy_1791109644424.jpg" 
                    alt="PST H-200 w gabinecie — fotel zabiegowy do stawów i kolan" 
                    className="w-12 h-10 object-cover rounded-xs shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[8.5px] uppercase font-bold text-luxury-dark group-hover:text-luxury-gold truncate">PST H-200</p>
                    <p className="text-[7.5px] font-mono text-luxury-gold/90 truncate">Stawy & kolana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5">
              <button
                onClick={() => {
                  const pstTgt = treatments.find(t => t.id === "pst-signal-therapy") || treatments[0];
                  onOpenBooking(pstTgt);
                }}
                className="px-6 py-3.5 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Umów konsultację / PST</span>
              </button>
              
              <button
                onClick={() => handleSelectById("pst-signal-therapy")}
                className="px-6 py-2 border border-luxury-dark/40 text-luxury-dark hover:bg-luxury-dark/10 font-mono text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
              >
                Zobacz szczegóły →
              </button>
            </div>
          </div>
        </div>

        {/* Wyszukiwarka i Nagłówek Katalogu Monografii */}
        <div className="text-center max-w-xl mx-auto space-y-3 pt-4">
          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-semibold">
            Szczegółowe Monografie Zabiegowe
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-light text-luxury-dark">
            Katalog Zabiegów i Rytuałów
          </h2>
          <p className="text-xs text-luxury-dark/95 font-light">
            Filtruj zabiegi po wskazaniach i zapoznaj się z dokładnymi procedurami, czasem trwania i zakresem cenowym.
          </p>
        </div>

        {/* Filtry Kategorii */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 border-y border-luxury-sand/40 py-3 max-w-4xl mx-auto">
          {[
            { key: "wszystkie", label: "Wszystkie Terapie" },
            { key: "diagnostyka", label: "Pierwsza Wizyta & Diagnoza" },
            { key: "lifting", label: "Przebudowa & Stymulacja" },
            { key: "regeneracja", label: "Regeneracja & Bariera" },
            { key: "oczyszczanie", label: "Równowaga & Sebum" }
          ].map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-3 py-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 relative flex items-center gap-1 focus:outline-none cursor-pointer ${
                  isActive 
                    ? "text-luxury-gold font-medium" 
                    : "text-luxury-dark/95 hover:text-luxury-dark"
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeCategoryIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-luxury-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Pasek Wyszukiwania */}
        <div className="max-w-md mx-auto w-full relative px-4">
          <div className="relative border-b border-luxury-sand/60 focus-within:border-luxury-gold transition-colors duration-300 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-luxury-gold/70" />
            <input
              type="text"
              placeholder="Wyszukaj zabieg lub problem skóry... (np. rumień, lifting, trądzik)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent border-none text-xs text-luxury-dark placeholder-luxury-dark/40 font-serif focus:outline-none focus:ring-0 italic py-1"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="text-luxury-dark/90 hover:text-luxury-gold transition-colors text-[10px] uppercase font-mono tracking-wider cursor-pointer focus:outline-none"
              >
                Wyczyść
              </button>
            )}
          </div>
        </div>

        {/* Siatka Kart Monografii */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {filteredTreatments.map((treatment, idx) => (
            <TreatmentCard
              key={treatment.id}
              index={idx}
              treatment={treatment}
              onSelectTreatment={onSelectTreatment}
              onOpenBooking={onOpenBooking}
            />
          ))}
          {filteredTreatments.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-16 border border-dashed border-luxury-sand/60 p-8 space-y-4">
              <p className="font-serif italic text-sm text-luxury-dark/95">Brak zabiegów spełniających podane kryteria wyszukiwania.</p>
              <div className="flex justify-center gap-4">
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange("")} 
                    className="text-xs font-mono text-luxury-gold uppercase border-b border-luxury-gold pb-0.5 tracking-widest font-medium cursor-pointer"
                  >
                    Wyczyść wyszukiwanie
                  </button>
                )}
                {selectedCategory !== "wszystkie" && (
                  <button 
                    onClick={() => onSelectCategory("wszystkie")} 
                    className="text-xs font-mono text-luxury-gold uppercase border-b border-luxury-gold pb-0.5 tracking-widest font-medium cursor-pointer"
                  >
                    Pokaż wszystkie kategorie
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
