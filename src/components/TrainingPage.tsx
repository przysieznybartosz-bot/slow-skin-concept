import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  ArrowRight, 
  Users, 
  Building2, 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  PhoneCall, 
  Mail, 
  ChevronDown, 
  CheckCircle2, 
  Sparkle,
  Layers,
  Brain,
  Video,
  FileCheck,
  Compass
} from "lucide-react";

interface TrainingPageProps {
  onLinkClick?: (url: string) => void;
  onOpenBooking?: (treatment?: any) => void;
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ onLinkClick, onOpenBooking }) => {
  const [selectedModuleTab, setSelectedModuleTab] = useState<"all" | "partner" | "neuromodeling" | "diagnostics">("all");
  const [isApplicationSuccess, setIsApplicationSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState({
    ownerName: "",
    salonName: "",
    city: "",
    phone: "",
    email: "",
    program: "Akredytacja Gabinetu Partnerskiego Slow Skin Concept™",
    experienceYears: "3-5 lat",
    message: ""
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const trainingModules = [
    {
      id: "partner-accreditation",
      category: "partner",
      badge: "Licencja & Wyłączność",
      title: "Akredytacja Gabinetu Partnerskiego Slow Skin Concept™",
      subtitle: "Kompleksowe wdrożenie autorskiej filozofii Quiet Luxury & Bionomic Skin Care",
      duration: "4 Dni (Intensywny Transfer Know-How) + Wsparcie Roczne",
      mode: "Stacjonarnie w Instytucie + Dedykowana Platforma B2B",
      targetAudience: "Właściciele salonów kosmetologicznych, instytutów beauty i gabinetów estetycznych",
      lead: "Dołącz do elitarnej sieci partnerskiej Slow Skin Concept™. Oferujemy pełną wyłączność terytorialną w Twoim mieście/dzielnicy, autorskie protokoły zabiegowe oraz dostęp do preparatów bionomicznych.",
      pillars: [
        { title: "Wyłączność Terytorialna", desc: "Tylko jeden akredytowany gabinet partnerski w wyznaczonej strefie geograficznej." },
        { title: "Pełne Portfolio Protokołów", desc: "Wdrożenie Skin Readiness™, Rosacea Calm, Lift & Firm oraz autorskich procedur Nati V3." },
        { title: "Pakiet Startowy Preparatów", desc: "Zapas profesjonalnych produktów bionomicznych oraz próbek dla Twoich klientów." },
        { title: "Wsparcie Marketingowe & PR", desc: "Obecność na ogólnopolskiej mapie gabinetów, gotowe materiały graficzne, oprawa Quiet Luxury." }
      ],
      includes: [
        "Imienna certyfikacja dla personelu i certyfikat ścienny gabinetu",
        "Dostęp do Portalu Szkoleniowego B2B (baza wideo HD z procedurami krok po kroku)",
        "Preferencyjne warunki marżowe na sprzedaż kosmetyków domowych dla klientek",
        "Kwartalny audyt merytoryczny i superwizja mgr Katarzyny Brzezińskiej"
      ],
      portalLink: "https://szkolenia.slowskinconcept.pl/partnerstwo-akredytacja/"
    },
    {
      id: "neuromodeling-masterclass",
      category: "neuromodeling",
      badge: "Warsztat Praktyczny 1:1",
      title: "Masterclass: Neuro-Modeling Twarzy, Fale Nogiera & Akupunktura",
      subtitle: "Głęboka przebudowa mięśniowo-powięziowa i neurobiologiczny lifting manualny",
      duration: "2 Dni (16 Godzin Praktyki Warsztatowej)",
      mode: "Kameralna grupa (maksymalnie 4 osoby) lub szkolenie indywidualne 1:1",
      targetAudience: "Kosmetolodzy, terapeuci twarzy, masażyści i fizjoterapeuci estetyczni",
      lead: "Naucz się autorskiego masażu mioplastycznego połączonego z częstotliwościami rezonansowymi dr. Paula Nogiera i stymulacją biopunktów bez użycia inwazyjnych igieł.",
      pillars: [
        { title: "Biomechanika Twarzy i Powięzi", desc: "Uwalnianie napięć aparatu żwaczowego, dekompresja czepca ścięgnistego i szyi." },
        { title: "Fale Nogiera w Praktyce", desc: "Zastosowanie częstotliwości komórkowych w wyciszaniu układu współczulnego i redukcji obrzęków." },
        { title: "Akupunktura i Akupresura Kosmetyczna", desc: "Precyzyjna lokalizacja punktów bioaktywnych modelujących owal twarzy." },
        { title: "Ergonomia Pracy Terapeuty", desc: "Techniki pracy własnym ciałem chroniące stawy dłoni i kręgosłup kosmetologa." }
      ],
      includes: [
        "Praktyka na modelkach pod okiem głównego szkoleniowca",
        "Skrypt metodyczny (120 stron, schematy anatomiczne i układy punktów)",
        "Komplet materiałów wideo do powtórek w portalu e-learningowym",
        "Imienny Certyfikat Terapeuty Neuro-Modelingu Slow Skin™"
      ],
      portalLink: "https://szkolenia.slowskinconcept.pl/neuromodeling-masterclass/"
    },
    {
      id: "diagnostics-bionomics",
      category: "diagnostics",
      badge: "Dermatokosmetologia",
      title: "Warsztat: Zaawansowana Diagnostyka Nati V3 & Terapia Bariery",
      subtitle: "Jak prowadzić trudne dermatozy i układać skuteczne Beauty Plany bionomiczne",
      duration: "1 Dzień (8 Godzin Merytoryki & Praktyki)",
      mode: "Stacjonarnie lub w formie Hybrydowej (Masterclass Live)",
      targetAudience: "Kosmetolodzy chcący podnieść skuteczność pielęgnacji i prowadzenia skór problematycznych",
      lead: "Odkryj tajemnice interpretacji skanów aparaturowych Nati V3 i układania protokołów przy trądziku dorosłych, trądziku różowatym, uszkodzeniach posteroidowych i inflammagingu.",
      pillars: [
        { title: "Wielopłaszczyznowa Analiza Nati V3", desc: "Odczyt głębokości naczyń, struktury złuszczania i poziomu sebum bez błędów interpretacyjnych." },
        { title: "Biologia Kwasu Bursztynowego & Ektoiny", desc: "Dobór substancji wyciszających stany zapalne bez efektu jojo i podrażnień." },
        { title: "Konstruowanie Długofalowych Beauty Planów", desc: "Jak budować skuteczną ścieżkę zabiegową z 90% retencją klientek." },
        { title: "Psychokosmetologia i Komunikacja", desc: "Budowanie zaufania klienta w gabinecie Quiet Luxury bez nachalnej sprzedaży." }
      ],
      includes: [
        "Gotowe szablony kart diagnostycznych i zaleceń pozabiegowych",
        "Dostęp do zamkniętej grupy wymiany doświadczeń gabinetowych",
        "Imienny certyfikat Diagnosty Bionomicznego",
        "Materiały do wdrożenia w gabinecie od pierwszego dnia"
      ],
      portalLink: "https://szkolenia.slowskinconcept.pl/diagnostyka-bionomiczna/"
    }
  ];

  const filteredModules = selectedModuleTab === "all"
    ? trainingModules
    : trainingModules.filter(m => m.category === selectedModuleTab);

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplicationSuccess(true);
  };

  const trainingFaqs = [
    {
      q: "Gdzie znajduje się portal szkoleniowy i jak uzyskać do niego dostęp?",
      a: "Nasz dedykowany portal szkoleniowo-biznesowy działa pod adresem szkolenia.slowskinconcept.pl. Dostęp do platformy e-learningowej otrzymują wszyscy uczestnicy naszych szkoleń stacjonarnych oraz akredytowane gabinety partnerskie z całej Polski."
    },
    {
      q: "Na czym polega wyłączność terytorialna dla Gabinetu Partnerskiego?",
      a: "Dbamy o rentowność i prestiż naszych partnerów. Gwarantujemy, że w ustalonym promieniu (dla mniejszych miast całe miasto, dla metropolii dedykowana dzielnica) nie udzielimy licencji ani nie wdrożymy autorskiej metody Slow Skin Concept™ w innym gabinecie."
    },
    {
      q: "Czy szkolenia kończą się egzaminem i certyfikacją?",
      a: "Tak. Każde szkolenie kończy się walidacją praktyczną i wręczeniem imiennego Certyfikatu Jakości Slow Skin Concept™, uprawniającego do posługiwania się zastrzeżonymi znakami towarowymi i protokołami."
    },
    {
      q: "Czy istnieje możliwość dofinansowania szkolenia z BUR lub KFS?",
      a: "Tak, jako instytucja szkoleniowa pomagamy w formalnościach związanych z pozyskaniem dofinansowania z Krajowego Funduszu Szkoleniowego (KFS) oraz Bazy Usług Rozwojowych (BUR) do 80-100% wartości szkolenia."
    }
  ];

  return (
    <div className="bg-luxury-cream text-luxury-dark min-h-screen py-10 px-4 sm:px-6 md:px-12 max-w-[1536px] mx-auto text-left selection:bg-luxury-gold/20" id="slow-skin-training-page">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-luxury-sand text-xs font-mono text-luxury-dark/95">
        <div className="flex items-center gap-2">
          <span>INSTYTUT</span>
          <span>/</span>
          <span className="text-luxury-gold uppercase font-semibold">SZKOLENIA & WSPÓŁPRACA B2B</span>
          <span>/</span>
          <span className="text-luxury-dark/90">AKADEMIA SLOW SKIN</span>
        </div>
        <div className="flex items-center gap-2 text-luxury-gold bg-luxury-gold/10 px-3 py-1 border border-luxury-gold/30">
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">Dedykowany Portal Szkoleniowy</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mt-8 mb-12 space-y-4 max-w-4xl">
        <span className="font-mono text-[11px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">
          AKADEMIA DLA GABINETÓW Z CAŁEJ POLSKI • ROZWÓJ BIZNESOWY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-luxury-dark leading-tight">
          Szkolenia & Partnerstwo <span className="italic font-normal text-luxury-gold">Slow Skin Concept™</span>
        </h1>
        <p className="text-sm sm:text-base text-luxury-dark/95 leading-relaxed font-light">
          Wprowadź autorską metodologię biologicznej stymulacji skóry, neuro-modelingu i diagnostyki komórkowej do swojego gabinetu. 
          Oferujemy certyfikowane szkolenia praktyczne, wyłączność terytorialną i stałe wsparcie merytoryczne dla profesjonalistów.
        </p>
      </div>

      {/* External Training Portal Banner */}
      <div className="bg-gradient-to-r from-luxury-dark via-[#1d2621] to-luxury-dark text-luxury-cream p-6 sm:p-8 md:p-10 mb-14 border border-luxury-gold/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-luxury-gold font-mono text-[10px] tracking-widest uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Platforma Edukacyjna B2B • Baza Wiedzy HD & E-Learning</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-white">
              Przejdź do Portalu Szkoleniowego <span className="text-luxury-gold italic">szkolenia.slowskinconcept.pl</span>
            </h2>
            <p className="text-xs sm:text-sm text-luxury-cream/80 leading-relaxed max-w-2xl font-light">
              Nasz osobny portal szkoleniowy to dedykowane centrum wiedzy dla certyfikowanych kosmetologów i partnerów biznesowych. 
              Zawiera nagrania procedur zabiegowych w standardzie 4K, skrypty merytoryczne, karty konsultacyjne i zgody zabiegowe oraz materiały promocyjne.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <a
              href="https://szkolenia.slowskinconcept.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-luxury-gold text-luxury-dark hover:bg-white transition-all duration-300 px-6 py-3.5 text-center font-mono text-[11px] tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              id="cta-training-external-banner"
            >
              <span>Przejdź do Portalu Szkoleniowego</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                const el = document.getElementById("training-application-form");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-luxury-cream/40 hover:border-luxury-gold hover:text-luxury-gold text-luxury-cream px-6 py-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase transition-colors"
            >
              Zgłoś Swój Gabinet (Weryfikacja Rejonu)
            </button>
          </div>
        </div>
      </div>

      {/* Program Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-luxury-sand">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedModuleTab("all")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedModuleTab === "all"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            Wszystkie Programy ({trainingModules.length})
          </button>
          <button
            onClick={() => setSelectedModuleTab("partner")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedModuleTab === "partner"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            Akredytacja Gabinetu (Licencja)
          </button>
          <button
            onClick={() => setSelectedModuleTab("neuromodeling")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedModuleTab === "neuromodeling"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            Neuro-Modeling & Fale Nogiera
          </button>
          <button
            onClick={() => setSelectedModuleTab("diagnostics")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedModuleTab === "diagnostics"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            Diagnostyka & Terapia Bariery
          </button>
        </div>

        <div className="text-[11px] font-mono text-luxury-dark/95 flex items-center gap-3">
          <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-luxury-gold" /> Certyfikat Imienny</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-luxury-gold" /> Wyłączność Terytorialna</span>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {filteredModules.map((item) => (
          <div 
            key={item.id}
            className="bg-white border border-luxury-sand/60 hover:border-luxury-gold/80 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg relative group"
          >
            {/* Top Header */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/40 text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 font-semibold">
                  {item.badge}
                </span>
                <span className="text-[10px] font-mono text-luxury-dark/90 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-luxury-gold" /> {item.duration.split('(')[0]}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-light text-luxury-dark group-hover:text-luxury-gold transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="font-mono text-[10px] text-luxury-gold uppercase tracking-wider">
                  {item.subtitle}
                </p>
                <p className="text-xs text-luxury-dark/95 leading-relaxed font-light pt-1">
                  {item.lead}
                </p>
              </div>

              {/* Meta details */}
              <div className="space-y-2 py-3 border-y border-luxury-sand/40 text-xs text-luxury-dark">
                <div className="flex items-start gap-2">
                  <Users className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                  <span><strong>Dla kogo:</strong> {item.targetAudience}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Compass className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                  <span><strong>Format:</strong> {item.mode}</span>
                </div>
              </div>

              {/* Key Pillars */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] tracking-widest uppercase text-luxury-gold font-semibold block">
                  Filary Programowe:
                </span>
                <ul className="space-y-2 text-xs text-luxury-dark font-light">
                  {item.pillars.map((pillar, pIdx) => (
                    <li key={pIdx} className="bg-luxury-cream/40 p-2.5 border border-luxury-sand/30">
                      <span className="font-medium text-luxury-dark block mb-0.5">{pillar.title}</span>
                      <span className="text-[11px] text-luxury-dark/95">{pillar.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inclusions checklist */}
              <div className="space-y-1.5 pt-2 border-t border-luxury-sand/30 text-[11px] text-luxury-dark/95">
                <span className="font-mono text-[9px] tracking-widest uppercase text-luxury-dark/90 block mb-1">
                  W pakiecie szkoleniowym:
                </span>
                {item.includes.map((inc, iIdx) => (
                  <div key={iIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 sm:p-8 pt-0 space-y-2.5">
              <a
                href={item.portalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-luxury-dark hover:bg-luxury-gold hover:text-luxury-dark text-luxury-cream transition-all duration-300 py-3.5 text-center font-mono text-[10px] tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Zobacz w Portalu Szkoleniowym</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  setApplicationData(prev => ({ ...prev, program: item.title }));
                  const el = document.getElementById("training-application-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-white border border-luxury-sand hover:border-luxury-gold text-luxury-dark text-[10px] font-mono tracking-[0.15em] uppercase py-2.5 transition-colors text-center"
              >
                Zapytaj o Wolny Termin / Rejon
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Clinic Benefits Bento Grid */}
      <div className="bg-white border border-luxury-sand p-8 sm:p-12 mb-16 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-gold uppercase font-semibold block">
            WARTOŚĆ DLA TWOJEGO BIZNESU
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
            Dlaczego Warto Wdrożyć Metodę Slow Skin™ w Swoim Mieście?
          </h2>
          <p className="text-xs sm:text-sm text-luxury-dark/95 font-light">
            Odpowiedź na rosnące zmęczenie klientów agresywnymi i bolesnymi zabiegami. Wprowadź standard Quiet Luxury, który buduje lojalność na lata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-luxury-cream/40 border border-luxury-sand/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-mono text-sm font-semibold">
              01
            </div>
            <h4 className="font-serif text-lg font-medium text-luxury-dark">Ochrona Terytorialna & Brak Konkurencji</h4>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Zapewniamy formalną wyłączność geograficzną. Twój gabinet będzie jedynym certyfikowanym miejscem w rejonie oferującym autorskie rytuały i preparaty.
            </p>
          </div>

          <div className="p-6 bg-luxury-cream/40 border border-luxury-sand/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-mono text-sm font-semibold">
              02
            </div>
            <h4 className="font-serif text-lg font-medium text-luxury-dark">Wyższy Średni Paragon & Retencja 85%+</h4>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Holistyczne Beauty Plany łączące terapię manualną, diagnostykę i pielęgnację domową gwarantują powracalność klientów i wysokie marże na preparatach.
            </p>
          </div>

          <div className="p-6 bg-luxury-cream/40 border border-luxury-sand/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-mono text-sm font-semibold">
              03
            </div>
            <h4 className="font-serif text-lg font-medium text-luxury-dark">Ciągły Dostęp do E-Learningu B2B</h4>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Nielimitowany dostęp do platformy wideo dla Ciebie i Twoich pracowników. Wdrażaj nowych kosmetologów bez straty czasu i spadku jakości usług.
            </p>
          </div>
        </div>
      </div>

      {/* B2B Application Form */}
      <div id="training-application-form" className="bg-luxury-cream border border-luxury-sand p-8 sm:p-12 mb-16 shadow-md">
        <div className="max-w-3xl mx-auto text-left space-y-6">
          <div className="space-y-2 border-b border-luxury-sand pb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-gold uppercase font-semibold block">
              FORMULARZ ZGŁOSZENIOWY B2B
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
              Sprawdź Dostępność Swojego Miasta / Zgłoś Gabinet
            </h3>
            <p className="text-xs sm:text-sm text-luxury-dark/95 font-light">
              Wypełnij formularz, aby zweryfikować dostępność terytorium i otrzymać szczegółowy prospekt partnerski wraz z kalkulacją wdrożenia.
            </p>
          </div>

          {isApplicationSuccess ? (
            <div className="bg-white border border-emerald-300 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-2xl font-light text-luxury-dark">
                Dziękujemy za przesłanie zgłoszenia!
              </h4>
              <p className="text-xs text-luxury-dark/95 max-w-md mx-auto leading-relaxed font-light">
                Twoja aplikacja dla gabinetu <strong>{applicationData.salonName || "Partnerskiego"}</strong> w mieście <strong>{applicationData.city}</strong> została zarejestrowana. 
                Dział rozwoju sieci skontaktuje się z Tobą w ciągu 24 godzin w celu weryfikacji rejonu i przedstawienia szczegółów.
              </p>
              <button
                onClick={() => setIsApplicationSuccess(false)}
                className="bg-luxury-dark text-luxury-cream px-6 py-2.5 font-mono text-[10px] tracking-widest uppercase hover:bg-luxury-gold transition-colors"
              >
                Wyślij kolejne zapytanie
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Imię i Nazwisko Właściciela / Managera *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.ownerName}
                    onChange={(e) => setApplicationData({ ...applicationData, ownerName: e.target.value })}
                    placeholder="np. mgr Joanna Kowalska"
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Nazwa Gabinetu / Instytutu *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.salonName}
                    onChange={(e) => setApplicationData({ ...applicationData, salonName: e.target.value })}
                    placeholder="np. Instytut Piękna i Zdrowia"
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Miasto / Powiat *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.city}
                    onChange={(e) => setApplicationData({ ...applicationData, city: e.target.value })}
                    placeholder="np. Wrocław / Poznań / Kraków"
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Numer Telefonu *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({ ...applicationData, phone: e.target.value })}
                    placeholder="np. 500 000 000"
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Adres E-mail Firmowy *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({ ...applicationData, email: e.target.value })}
                    placeholder="np. kontakt@gabinet.pl"
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Interesujący Program / Szkolenie *
                  </label>
                  <select
                    value={applicationData.program}
                    onChange={(e) => setApplicationData({ ...applicationData, program: e.target.value })}
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="Akredytacja Gabinetu Partnerskiego Slow Skin Concept™">Akredytacja Gabinetu Partnerskiego Slow Skin Concept™ (Licencja & Wyłączność)</option>
                    <option value="Masterclass: Neuro-Modeling Twarzy, Fale Nogiera & Akupunktura">Masterclass: Neuro-Modeling Twarzy, Fale Nogiera & Akupunktura (2 dni)</option>
                    <option value="Warsztat: Zaawansowana Diagnostyka Nati V3 & Terapia Bariery">Warsztat: Zaawansowana Diagnostyka Nati V3 & Terapia Bariery (1 dzień)</option>
                    <option value="Dostęp do Portalu Szkoleniowego B2B (E-Learning)">Dostęp do Portalu Szkoleniowego B2B (E-Learning)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Staż Działalności Gabinetu
                  </label>
                  <select
                    value={applicationData.experienceYears}
                    onChange={(e) => setApplicationData({ ...applicationData, experienceYears: e.target.value })}
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="Nowo otwierany gabinet">Nowo otwierany gabinet (przed otwarciem)</option>
                    <option value="1-2 lata">1-2 lata</option>
                    <option value="3-5 lat">3-5 lat</option>
                    <option value="Powyżej 5 lat">Powyżej 5 lat</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                  Dodatkowe informacje / pytania o rejon (opcjonalnie)
                </label>
                <textarea
                  rows={3}
                  value={applicationData.message}
                  onChange={(e) => setApplicationData({ ...applicationData, message: e.target.value })}
                  placeholder="np. Chcemy wdrożyć procedury dla 3 kosmetologów od przyszłego miesiąca, interesuje nas wyłączność w Toruniu..."
                  className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-luxury-dark/95 font-mono">
                  * Zgłoszenie jest bezpłatne i nie zobowiązuje do podpisania umowy.
                </span>
                <button
                  type="submit"
                  className="bg-luxury-dark hover:bg-luxury-gold hover:text-luxury-dark text-luxury-cream px-8 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase font-semibold transition-all shadow-md w-full sm:w-auto"
                >
                  Zgłoś Gabinet i Sprawdź Rejon →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Training FAQ Section */}
      <div className="bg-white border border-luxury-sand p-8 sm:p-12 mb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 border-b border-luxury-sand pb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-gold uppercase font-semibold block">
              PYTANIA I ODPOWIEDZI B2B
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
              Najczęściej Zadawane Pytania o Szkolenia i Partnerstwo
            </h3>
          </div>

          <div className="space-y-3">
            {trainingFaqs.map((faq, idx) => (
              <div key={idx} className="border border-luxury-sand/50 bg-luxury-cream/20">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center gap-4 hover:text-luxury-gold transition-colors"
                >
                  <span className="font-serif text-sm sm:text-base text-luxury-dark font-medium">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-luxury-gold shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-luxury-dark/95 leading-relaxed font-light border-t border-luxury-sand/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direct link footer note */}
      <div className="text-center py-6 border-t border-luxury-sand/50 space-y-2">
        <p className="text-xs text-luxury-dark/95 font-mono">
          SLOW SKIN CONCEPT™ • AKADEMIA BIONOMII I NEURO-MODELINGU • JELCZ-LASKOWICE
        </p>
        <a 
          href="https://szkolenia.slowskinconcept.pl" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-luxury-gold hover:text-luxury-dark font-mono uppercase tracking-wider inline-flex items-center gap-1 font-medium"
        >
          Przejdź do portalu e-learningowego: szkolenia.slowskinconcept.pl <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
