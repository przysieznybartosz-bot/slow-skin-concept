import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  Fingerprint, 
  Compass, 
  Heart, 
  Activity, 
  Printer, 
  Download,
  FileText, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Globe,
  User, 
  Check, 
  AlertCircle,
  TrendingUp,
  Award,
  Menu,
  X,
  FlaskConical,
  Dna,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  MessageSquare,
  ClipboardList,
  Phone,
  Shield,
  ShieldCheck,
  HelpCircle,
  Sun, 
  Moon,
  Search,
  Bell,
  BellOff,
  Trash2,
  Edit3,
  Plus,
  Save,
  Zap,
  Wind,
  Droplets,
  Layers,
  ExternalLink,
  Camera
} from "lucide-react";
import { TREATMENTS, ARTICLES, REVIEWS } from "./data";
import { VideoPlayerSection } from "./components/VideoPlayerSection";
import TreatmentCard from "./components/TreatmentCard";
import PillarTooltip from "./components/PillarTooltip";
import TreatmentFAQ from "./components/TreatmentFAQ";
import SkincareAssistant from "./components/SkincareAssistant";
import WcagWidget from "./components/WcagWidget";
import CookieBot from "./components/CookieBot";
import { OriginalImageManagerModal } from "./components/OriginalImageManagerModal";
import { EditableImage } from "./components/EditableImage";
import CookiesPolicyModal from "./components/CookiesPolicyModal";
import { BeforeAfterSlider } from "./components/BeforeAfterSlider";
import { DiscreetSection, DiscreetDiv, DiscreetCard } from "./components/DiscreetSection";
import { FacialTreatmentsPage } from "./components/FacialTreatmentsPage";
import { MethodPage } from "./components/MethodPage";
import { BookingModal } from "./components/BookingModal";
import { BrandLogo } from "./components/BrandLogo";
import { ShopPage } from "./components/ShopPage";
import { TrainingPage } from "./components/TrainingPage";
import { NewsletterSection } from "./components/NewsletterSection";
import { DiagnosticAnswers, DiagnosticReport, Treatment, MagazineArticle, Review } from "./types";
import { safeStorage } from "./utils/storage";

const REVIEW_IMAGES: Record<string, string> = {
  "rev-1": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800",
  "rev-2": "/src/assets/images/mesoremodeling.jpg",
  "rev-3": "/src/assets/images/facial_acupuncture_led_1785534009485.jpg",
  "rev-4": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800",
  "rev-5": "/src/assets/images/mesoremodeling.jpg"
};

const circadianRoutines = [
  {
    title: "Suchość & Bariera",
    subtitle: "Zaburzona Bariera Hydrolipidowa",
    challenge: "Uporczywe ściągnięcie, suchość, pieczenie barierowe, brak okluzji mineralnej i lipidowej.",
    morning: {
      time: "07:30 - 08:30",
      title: "Wsparcie i Okluzja Barierowa",
      desc: "Skóra potrzebuje ochrony przed przeznaskórkową utratą wody (TEWL). Unikaj mocnych detergentów.",
      steps: [
        "Oczyszczanie: Delikatny demakijaż i mycie fizjologiczną emulsją bionomiczną (bez piany, pH 5.5).",
        "Tonizacja: Delikatna mgiełka z kwasem laktobionowym o działaniu silnie nawilżającym i kojącym.",
        "Kompres: Serum barierowe z ceramidami NP oraz ektoiną.",
        "Ochrona: Krem okluzyjny wzbogacony o fitosterole, zwieńczony mineralnym filtrem ochronnym SPF 50."
      ],
      tip: "Pomiń poranny peeling barierowy — pozwól warstwie rogowej naskórka na naturalną regenerację lipidową."
    },
    afternoon: {
      time: "12:00 - 13:00",
      title: "Ruch Komórkowy i Stabilizacja",
      desc: "Nawilżanie tkanki od środka i uciszenie sygnałów układu nerwowego skóry.",
      steps: [
        "Nawodnienie: Wypij szklankę ciepłej wody z dodatkiem krzemu organicznego oraz soli różowej kłodawskiej.",
        "Fizjologia: Krótki 2-minutowy odpoczynek z zamkniętymi oczami — wygaszenie uwalniania kortyzolu we krwi."
      ],
      tip: "Unikaj spryskiwania twarzy czystą wodą termalną w suchym klimatyzowanym biurze bez natychmiastowego nałożenia kremu — wywoła to odwrotny efekt ściągnięcia."
    },
    evening: {
      time: "21:00 - 22:30",
      title: "Głęboka Odbudowa Lipidowa",
      desc: "Najwyższy moment podziałów komórkowych i integracji ceramidów w płaszczu naskórkowym.",
      steps: [
        "Oczyszczanie II-etapowe: Bionomowy olejek hydrofilny (oczyszczenie sebum i filtrów), następnie barierowa emulsja.",
        "Odżywianie: Serum barierowe z ceramidami NP, AP, EOP, cholesterolem i kwasami lipidowymi Omega-3,6.",
        "Okluzja: Gruby kompres lipidowy z mądrym kremem na noc celem stworzenia sztucznej okluzji komórkowej."
      ],
      tip: "Śpij przy temperaturze sypialni 18-19°C z włączonym nawilżaczem powietrza, by zminimalizować TEWL nocny."
    }
  },
  {
    title: "Rumień & Wrażliwość",
    subtitle: "Reaktywność Neurosensoryczna",
    challenge: "Przewlekłe zaczerwienienie, reakcje naczyniowe, pieczenie i nadreaktywność.",
    morning: {
      time: "07:30 - 08:30",
      title: "Uciszenie Receptorów i Stabilizacja",
      desc: "Wyciszenie nadreaktywnych komórek naskórka i ochrona naczyń przed nagłym skurczem.",
      steps: [
        "Oczyszczanie: Przemywanie twarzy letnią (nigdy gorącą!) wodą z dodatkiem barierowej, kojącej emulsji.",
        "Ukojenie: Tonik na bazie hydrolatu z nieśmiertelnika (Helichrysum) redukujący naczyniowe obrzęki.",
        "Komórki: Serum z fitosfingozyną i niacynamidem (maksymalne stężenie 2-3%, wyższe stężenia mogą nasilić rumień).",
        "Ochrona: Krem bionomiczny z wyciągiem z Centella Asiatica i tlenkiem cynku łagodzącym mikrozapalenia."
      ],
      tip: "Unikaj naprzemiennego mycia twarzy lodowatą i gorącą wodą — gwałtowny skurcz nasion drastycznie niszczy ściany włosowate."
    },
    afternoon: {
      time: "12:00 - 13:00",
      title: "Reset Naczyniowy i Kojenie",
      desc: "Wzmocnienie odporności naczyniowej naskórka i redukcja napięcia neurologicznego.",
      steps: [
        "Dotlenienie: Napar z liści pokrzywy bogaty w witaminę K i flawonoidy wspierające elastyczność naczyń.",
        "Przemiana: Odrobina odpoczynku bez błękitnego światła (Blue Light), które stymuluje receptory komórkowe do reakcji zapalnej."
      ],
      tip: "Podczas pracy za biurkiem postaraj się mrugać częściej — zapobiegnie to suchości oczu i idącemu za tym napięciu powięzi twarzy."
    },
    evening: {
      time: "21:00 - 22:30",
      title: "Regeneracja Parasympatyczna",
      desc: "Faza regeneracji bariery naskórkowej bez obciążeń termicznych.",
      steps: [
        "Demakijaż: Delikatna bionomowa pianka oczyszczająca (fizjologiczna formuła) aplikowana dłońmi.",
        "Kompres: Neuro-kojący eliksir olejowy z nasion ogórecznika (bogaty w kwas GLA) wraz dawką liposomalnego pantenolu.",
        "Maska: Warstwa biocelulozowej maski wyciszającej lub bogatego kremu kojącego na bazie fito-lipidów."
      ],
      tip: "Zastosuj masaż chłodnymi kulami szklanymi lub jadeitem (od środka czoła ku skroniom) dla uśmierzenia nerwów czuciowych."
    }
  },
  {
    title: "Ziemistość & Zmęczenie",
    subtitle: "Deficyt Energii Mitochondrialnej",
    challenge: "Szary koloryt cery, toksyczność miejska (smog, Blue Light, dym), brak blasku i wolne starzenie.",
    morning: {
      time: "07:30 - 08:30",
      title: "Poranny Impuls Energetyczny",
      desc: "Pobudzenie mitochondriów i cyklu Krebsa, aby dostarczyć komórkom energii ATP i dotlenienia naczyniowego.",
      steps: [
        "Pobudzenie: Oczyszczanie żelem z kwasem bursztynowym lub niskim stężeniem enzymów roślinnych (papaina).",
        "Energia: Serum z witaminą C (stabilna, niepodrażniająca forma SAP) połączona z koenzymem Q10 i kwasem bursztynowym.",
        "Ochrona: Antyoksydacyjny fluid miejski z tarczą antipollution chroniący przed dymem i metalami ciężkimi."
      ],
      tip: "Wykonywany pod prysznicem 1-minutowy masaż uciskowy twarzy pobudza drenaż limfatyczny, niwelując szary koloryt."
    },
    afternoon: {
      time: "12:00 - 13:00",
      title: "Dotlenienie Przeciwutleniające",
      desc: "Przerwanie miejskiego stresu oksydacyjnego.",
      steps: [
        "Antyoksydacja: Zielona herbata Matcha bogata w potężne katechiny (EGCG) blokujące wolne rodniki.",
        "Ruch komórkowy: 5-minutowe przewietrzenie sypialni/gabinetu i rozciągnięcie karku uwalniające dopływ tlenu do głowy."
      ],
      tip: "Zastosowanie nawilżającej mgiełki z zieloną herbatą doskonale chroni komórki przed destrukcyjnym działaniem wolnych rodników."
    },
    evening: {
      time: "21:00 - 22:30",
      title: "Nocna Detoksykacja Komórkowa",
      desc: "Wykorzystanie snu jako głównego biologicznego katalizatora eliminacji uszkodzonych komórkowych białek.",
      steps: [
        "Oczyszczanie: Masaż sonicznym pędzelkiem z żelem bionomicznym, oczyszczający mikrocząsteczki PM2.5.",
        "Kuracja: Serum z kwasem bursztynowym oraz karnozyną (hamującą szkodliwy proces glikacji białek m.in. kolagenu).",
        "Regeneracja: Odżywczy krem z aktywnym resweratrolem i melatoniną kosmetyczną na noc."
      ],
      tip: "Unikaj korzystania z telefonu komórkowego przed snem — niebieska fala hamuje uwalnianie melatoniny, zakłócając detoksykację skóry."
    }
  },
  {
    title: "Wiotkość & Oznaki Wieku",
    subtitle: "Degradacja Matrycy Białkowej",
    challenge: "Utrata gęstości, opadanie owalu (chomiki), zmarszczki mimiczne, rozmyte kontury.",
    morning: {
      time: "07:30 - 08:30",
      title: "Modelowanie Owalu i Tarcza Peptydowa",
      desc: "Działanie biostymulujące i ochronne na istniejące helisy kolagenowe.",
      steps: [
        "Przygotowanie: Mycie bionomiczną emulsją odbudowującą kolagen, tonik esencjonalny z komórkami macierzystymi arganu.",
        "EFEKT BOTOX: Aktywne serum neuropeptydowe (Argirelina, Matrixyl) redukujące napięcie mikroskurczów mimicznych.",
        "Synteza: Krem rekonstruujący z krzemionką organiczną i fitosterolami nadający gęstości."
      ],
      tip: "Po nałożeniu kosmetyków wykonaj 3-minutowy masaż rzeźbiarski (głaskanie od obojczyków, poprzez żuchwę w kierunku uszu)."
    },
    afternoon: {
      time: "12:00 - 13:00",
      title: "Wsparcie Kolagenowe i Postawa",
      desc: "Wydajna synteza kolagenu wymaga bazy aminokwasowej i nienagannej postawy kręgosłupa.",
      steps: [
        "Budulec: Wypij szklankę wody z dawką kolagenu rybiego o niskiej masie cząsteczkowej (2000 Da) i witaminą C.",
        "Postawa: Skoryguj postawę — wyprostowanie pleców natychmiast unosi powięź szyjną i zapobiega wiotczeniu podbródka."
      ],
      tip: "Telefon trzymany na wysokości oczu to najlepsza profilaktyka zapobiegająca powstawaniu 'szyi technologicznej'."
    },
    evening: {
      time: "21:00 - 22:30",
      title: "Stymulacja Syntezy Kolagenu",
      desc: "Czas na głęboką przebudowę strukturalną na poziomie nowo tworzonych włókien.",
      steps: [
        "Przygotowanie: Dokładny, bionomowy demakijaż i tonizacja stabilizująca pH naskórka.",
        "Przebudowa: Retinol roślinny (kwas retinolowy z nasion dzikiej róży lub Bakuchiol 1%) wspierające odnowę komórkową.",
        "Kompres: Silny neopeptydowy krem z lipidami i koenzymem Q10 stymulującym neokolagenezę."
      ],
      tip: "Śpij na jedwabnej poszewce — jedwab nie chłonie lipidów z naskórka i redukuje nocne tarcie fizyczne twarzy o poduszkę."
    }
  }
];

export const getTreatmentCategory = (treatmentId: string): "lifting" | "oczyszczanie" | "regeneracja" | "diagnostyka" => {
  const id = treatmentId.toLowerCase();
  if (id.includes("video") || id.includes("online") || id.includes("konsultac") || id.includes("readiness") || id.includes("first") || id.includes("diagnoza") || id.includes("diagnostic")) {
    return "diagnostyka";
  }
  if (
    id.includes("lift") || 
    id.includes("firm") || 
    id.includes("modeling") || 
    id.includes("hifu") || 
    id.includes("rf") || 
    id.includes("stimulator") || 
    id.includes("stymulat") || 
    id.includes("aging") ||
    id.includes("sonaris") ||
    id.includes("nogier")
  ) {
    return "lifting";
  }
  if (
    (id.includes("carbon") && !id.includes("carboksy") && !id.includes("carboregen")) ||
    id.includes("acne") ||
    id.includes("purification") || 
    id.includes("purify") || 
    id.includes("oxybrasion") || 
    id.includes("oksybrazja") || 
    id.includes("wodorowe") ||
    id.includes("oczyszczanie") ||
    id.includes("nanobrasion") || 
    id.includes("nanobrazja") || 
    id.includes("clean") || 
    id.includes("peeling") ||
    id.includes("epilac") ||
    id.includes("fotoepilacja")
  ) {
    return "oczyszczanie";
  }
  return "regeneracja";
};

const LANGUAGE_SANCTUARY_DATA = {
  PL: {
    badge: "REZERWACJA DLA GOŚCI ZAGRANICZNYCH",
    title: "Wsparcie Językowe dla Gości",
    sub: "SLOW SKIN CONCEPT • PRZYJAZNY GABINET PIELĘGNACJI SKÓRY",
    text1: "Witamy w naszej przestrzeni spokojnej, uważnej pielęgnacji i biologicznego wsparcia skóry.",
    text2: "Z dbałością o najwyższy komfort wszystkich naszych gości oferujemy pełne wsparcie diagnostyczne i zabiegowe również w językach obcych. Nasz zespół (na czele z założycielką mgr Katarzyną Brzezińską) porozumiewa się w języku angielskim, niemieckim oraz ukraińskim, dbając o Twój spokój, bezpieczeństwo i przyjazną atmosferę.",
    featuresTitle: "Udogodnienia dla gości zagranicznych:",
    features: [
      "Konsultacje i diagnoza skóry w języku EN, DE lub UA.",
      "Osobiste, zindywidualizowane plany pielęgnacyjne sporządzone w wybranym języku.",
      "Możliwość wyboru cichej sesji (Silent Session) dla głębokiego relaksu i odpoczynku psychofizycznego.",
      "Wsparcie językowe na każdym etapie rezerwacji i wizyty w Jelczu-Laskowicach."
    ],
    cta: "Chcę zarezerwować wizytę (PL)",
    langStatus: "Polski"
  },
  EN: {
    badge: "INTERNATIONAL GUEST RESERVATION",
    title: "International Guest Care",
    sub: "SLOW SKIN CONCEPT • BESPOKE SKINCARE SANCTUARY",
    text1: "Welcome to our sanctuary of calm, conscious skincare and biological skin support.",
    text2: "Although our publication is primarily in Polish, we warmly welcome international guests and provide bespoke cosmetological treatments and expert consultations in fluent English at our clinic in Jelcz-Laskowice (near Wrocław). Our founder, Katarzyna Brzezińska, and the team ensure gentle care, clear communication, and customized guidance.",
    featuresTitle: "Bespoke International Guest Amenities:",
    features: [
      "Full skin diagnostics and personalized consultations in English.",
      "Custom-compiled professional Homecare & Skincare Plans in English.",
      "The signature 'Silent Session' option for sensory rest and relaxation.",
      "Multilingual administrative and booking support before and during your visit."
    ],
    cta: "Pre-book Session with Language Preference",
    langStatus: "English Service Selected"
  },
  DE: {
    badge: "INTERNATIONALE RESERVIERUNG",
    title: "Internationales Gäste-Refugium",
    sub: "SLOW SKIN CONCEPT • EXPERT TREATMENT SANCTUARY",
    text1: "Willkommen in unserer Oase für bewusste Pflege und biologische Hautregeneration.",
    text2: "Obwohl unsere Hauptpublikation auf Polnisch verfasst ist, bieten wir in unserem Institut in Jelcz-Laskowice maßgeschneiderte Behandlungen und professionelle kosmetologische Konsultationen auf Deutsch an. Unsere Gründerin und das Team garantieren Sicherheit, Herzlichkeit und individuelle Begleitung.",
    featuresTitle: "Annehmlichkeiten für internationale Gäste:",
    features: [
      "Zelluläre Hautdiagnose und schonende Behandlungen auf Deutsch.",
      "Individuell erstellte Beauty- und Heimpflegepläne in deutscher Sprache.",
      "Die Option 'Silent Session' (Stille Sitzung) für tiefe psychophysische Entspannung.",
      "Zweisprachige administrative Unterstützung vor und während Ihres Besuchs."
    ],
    cta: "Termin mit Sprachpräferenz anfragen",
    langStatus: "Deutscher Service ausgewählt"
  },
  UA: {
    badge: "МІЖНАРОДНЕ БРОНЮВАННЯ",
    title: "Підтримка Іноземних Гостей",
    sub: "SLOW SKIN CONCEPT • ТУРБОТА ТА ДОГЛЯД ЗА ШКІРОЮ",
    text1: "Ласкаво просимо до нашого простору тиші, релаксації та природного відновлення шкіри.",
    text2: "З турботою про комфорт усіх наших гостей ми пропонуємо повну консультаційну та процедурну підтримку іноземними мовами. Наша команда (на чолі з Катажиною Бжезінською) володіє українською мовою, надаючи турботливу підтримку та індивідуальні плани догляду.",
    featuresTitle: "Зручності для іноземних гостей:",
    features: [
      "Професійні консультації та діагностика шкіри українською мовою.",
      "Персональні плани домашнього догляду, складені зрозумілою мовою.",
      "Спеціальний режим тихої сесії (Silent Session) для глибокої релаксації та зняття втоми.",
      "Повний супровід та допомога під час вашого візиту в Єлч-Лясковіце."
    ],
    cta: "Замовити сесію з мовною перевагою",
    langStatus: "Обрано українську мову"
  },
  IT: {
    badge: "PRENOTAZIONE INTERNAZIONALE",
    title: "Accoglienza Ospiti Internazionali",
    sub: "SLOW SKIN CONCEPT • SPAZIO DI CURA E BENESSERE DELLA PELLE",
    text1: "Benvenuti nel nostro spazio di cura consapevole e rigenerazione biologica della pelle.",
    text2: "Con l'obiettivo di garantire il massimo comfort a tutti i nostri ospiti, offriamo un supporto diagnostico e di trattamento completo anche in lingue straniere. Il nostro team (guidato dalla fondatrice Katarzyna Brzezińska) parla correntemente inglese, tedesco, ucraino e italiano, garantendo sicurezza, accoglienza e un'atmosfera serena.",
    featuresTitle: "Servizi per ospiti internazionali:",
    features: [
      "Consulto e diagnosi della pelle in lingua EN, DE, UA o IT.",
      "Piani di cura domiciliare personalizzati e redatti nella lingua selezionata.",
      "Possibilità di scegliere una sessione silenziosa (Silent Session) per un profondo rilassamento psicofisico.",
      "Supporto linguistico in ogni fase della prenotazione e della visita a Jelcz-Laskowice."
    ],
    cta: "Desidero prenotare una visita (IT)",
    langStatus: "Servizio in lingua italiana selezionato"
  }
};

const COMMON_PROBLEMS = [
  {
    name: "Przygotowanie skóry do regeneracji",
    description: "Audyt barierowy, pomiar TEWL, odbudowa płaszcza lipidowego i przygotowanie do głębokich terapii.",
    keywords: ["przygotowanie", "regeneracja", "readiness", "diagnoza", "pierwsza wizyta", "bariera", "suchość", "tewl"],
    treatmentId: "skin-readiness"
  },
  {
    name: "Zmiany zapalne, grudki, zaskórniki",
    description: "Trądzik pospolity, nadprodukcja sebum, rozszerzone pory i zaskórniki.",
    keywords: ["zapalne", "grudki", "zaskórniki", "trądzik", "sebum", "pory", "krostki", "łojotok", "acne"],
    treatmentId: "acne-balance-therapy"
  },
  {
    name: "Trądzik dorosłych, skóra stresowa",
    description: "Trądzik późny w strefie U (żuchwa, broda), zmiany pod wpływem kortyzolu i brak snu.",
    keywords: ["dorosłych", "stres", "stresowa", "kortyzol", "żuchwa", "tarda", "neuro", "hormonalny"],
    treatmentId: "adult-acne-therapy"
  },
  {
    name: "Rumień, pieczenie, nadreaktywność",
    description: "Trądzik różowaty (Rosacea), pieczenie, nadwrażliwość na wodę i kosmetyki, uczucie palenia.",
    keywords: ["rumień", "pieczenie", "nadreaktywność", "różowaty", "rosacea", "palenie", "kłucie", "wrażliwa", "reaktywna"],
    treatmentId: "rosacea-calm-therapy"
  },
  {
    name: "Naczynka, teleangiektazje",
    description: "Pęknięte naczynka, pajączki, kruchość naczyniowa i nawracająca gra naczyniowa.",
    keywords: ["naczynka", "teleangiektazje", "pajączki", "kruchość", "gra naczyniowa", "naczyniowa", "czerwona"],
    treatmentId: "couperose-therapy"
  },
  {
    name: "Przebarwienia, melasma, nierówny koloryt",
    description: "Plamy posłoneczne, melasma hormonalna, przebarwienia pozapalne (PIH), szary i niejednolity ton.",
    keywords: ["przebarwienia", "melasma", "koloryt", "plamy", "posłoneczne", "pigmentacja", "pih", "ostuda"],
    treatmentId: "pigment-balance-therapy"
  },
  {
    name: "Utrata jędrności, owal, gęstość",
    description: "Grawitacyjne opadanie owalu twarzy (chomiki), utrata gęstości, wiotkość i zmarszczki strukturalne.",
    keywords: ["jędrność", "owal", "gęstość", "wiotkość", "chomiki", "lifting", "zmarszczki", "smas", "kolagen"],
    treatmentId: "lift-firm-therapy"
  },
  {
    name: "Skóra zmęczona, szara, odwodniona",
    description: "Skóra miejska (Blue Light, smog), utrata witalności, brak blasku i głębokie odwodnienie naskórka.",
    keywords: ["zmęczona", "szara", "odwodniona", "blask", "glow", "tlen", "bursztynowy", "miejska", "smog"],
    treatmentId: "healthy-glow-therapy"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"cover" | "journal" | "method" | "clinic" | "diagnose" | "account" | "shop" | "training">("cover");
  
  // Helper to set google translate cookie with proper secure iframe support (SameSite=None; Secure) and subdomains
  const setGoogleTranslateCookie = (lang: "PL" | "EN" | "DE" | "UA" | "IT") => {
    let cookieVal = "";
    if (lang === "EN") cookieVal = "/pl/en";
    else if (lang === "DE") cookieVal = "/pl/de";
    else if (lang === "UA") cookieVal = "/pl/uk";
    else if (lang === "IT") cookieVal = "/pl/it";

    const expires = cookieVal ? "; max-age=31536000" : "; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    const value = cookieVal ? `googtrans=${cookieVal}` : "googtrans=";

    try {
      // Set without invalid wildcard domains
      document.cookie = `${value}; path=/; ${expires} SameSite=Lax;`;
    } catch (e) {
      console.warn("Could not set translation cookie:", e);
    }
  };

  const [currentLanguage, setCurrentLanguage] = useState<"PL" | "EN" | "DE" | "UA" | "IT">(() => {
    // 1. Try reading from safeStorage
    try {
      const saved = safeStorage.getItem("selected_language");
      if (saved && ["PL", "EN", "DE", "UA", "IT"].includes(saved)) {
        return saved as "PL" | "EN" | "DE" | "UA" | "IT";
      }
    } catch (e) {}

    return "PL";
  });

  // Keep cookie in sync with state on load only when non-PL
  useEffect(() => {
    if (currentLanguage !== "PL") {
      setGoogleTranslateCookie(currentLanguage);
    }
  }, [currentLanguage]);

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);

  const handleLanguageChange = (lang: "PL" | "EN" | "DE" | "UA" | "IT") => {
    try {
      safeStorage.setItem("selected_language", lang);
    } catch (e) {}

    setGoogleTranslateCookie(lang);
    
    setIsLanguageLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const [heroCustomUrl, setHeroCustomUrl] = useState<string>(() => {
    return safeStorage.getItem("custom_hero_image") || "/hero-main.png";
  });
  const [isUploadingHero, setIsUploadingHero] = useState<boolean>(false);
  const [isHeroDragOver, setIsHeroDragOver] = useState<boolean>(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const handleHeroFileChange = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    try {
      setIsUploadingHero(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const resp = await fetch("/api/upload-hero-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataUrl: base64, filename: file.name }),
          });
          const data = await resp.json();
          if (data.success && data.url) {
            safeStorage.setItem("custom_hero_image", data.url);
            setHeroCustomUrl(data.url);
          } else {
            safeStorage.setItem("custom_hero_image", base64);
            setHeroCustomUrl(base64);
          }
        } catch {
          safeStorage.setItem("custom_hero_image", base64);
          setHeroCustomUrl(base64);
        } finally {
          setIsUploadingHero(false);
          setIsHeroDragOver(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingHero(false);
      setIsHeroDragOver(false);
    }
  };

  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [customTreatmentImages, setCustomTreatmentImages] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (typeof window !== "undefined") {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("custom_img_")) {
            const slotKey = k.replace("custom_img_", "");
            const val = safeStorage.getItem(k);
            if (val) map[slotKey] = val;
          }
        }
      } catch {}
      if (!map["how_help_sensitive_skin"]) {
        map["how_help_sensitive_skin"] = "/how_help_sensitive_skin.png";
      }
    }
    return map;
  });

  const getEffectiveTreatmentImage = useCallback((treatment: Treatment | null | undefined): string => {
    if (!treatment) return "";
    if (treatment.id === "ceragem-thermal-massage") {
      return customTreatmentImages["ceragem"] || "/ceragem_bed.png" || treatment.image;
    }
    if (treatment.id === "sonaris-pro-therapy") {
      return customTreatmentImages["sonaris-pro"] || "/sonaris_pro.png" || treatment.image;
    }
    if (treatment.id === "stymulatory-tkankowe") {
      return customTreatmentImages["stymulatory"] || "/stymulatory_tkankowe.png" || treatment.image;
    }
    if (treatment.id === "pst-signal-therapy") {
      return customTreatmentImages["pst-couch"] || "/pst_couch.png" || treatment.image;
    }
    return treatment.image;
  }, [customTreatmentImages]);
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTreatmentCategory, setSelectedTreatmentCategory] = useState<"wszystkie" | "diagnostyka" | "lifting" | "regeneracja" | "oczyszczanie">("wszystkie");
  const [treatmentSearchQuery, setTreatmentSearchQuery] = useState("");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [userSelectedIndications, setUserSelectedIndications] = useState<Record<string, boolean>>({});
  const [userCheckedContraindications, setUserCheckedContraindications] = useState<Record<string, boolean>>({});

  // States for loyalty program 'Slow Skin Pass' and 'Moje Konto'
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return safeStorage.getItem("slowskin_is_logged") === "true";
  });
  
  const [userProfile, setUserProfile] = useState(() => {
    const defaultProfile = {
      name: "Aleksandra Kamińska",
      email: "aleksandra.kaminska@quietluxury.pl",
      phone: "601 452 984",
      memberId: "SSP-2026-94812",
      joinDate: "12 Luty 2026",
      skinConcern: "Bariera hydrolipidowa (stres kortyzolowy, TEWL i odwodnienie)",
      sensitivityLevel: "Wysoka nadreaktywność neuro-naczyniowa",
      prefersSilence: true,
    };
    try {
      const stored = safeStorage.getItem("slowskin_profile");
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [pastVisits, setPastVisits] = useState(() => {
    const defaultPastVisits = [
      { id: "v1", date: "2026-03-14", treatmentTitle: "Slow Skin Concept™ — Pierwsza Wizyta", treatmentPrice: "600 PLN", duration: "120 minut", therapist: "mgr Katarzyna Brzezińska", status: "Zwalidowano" },
      { id: "v2", date: "2026-04-18", treatmentTitle: "Regeneracja Kwasem Bursztynowym", treatmentPrice: "350 PLN", duration: "75 minut", therapist: "Katarzyna Brzezińska", status: "Zwalidowano" },
      { id: "v3", date: "2026-05-15", treatmentTitle: "Slow Neuro-Modeling (Lifting Manualny)", treatmentPrice: "280 PLN", duration: "60 minut", therapist: "mgr Katarzyna Brzezińska", status: "Zwalidowano" }
    ];
    try {
      const stored = safeStorage.getItem("slowskin_visits");
      return stored ? JSON.parse(stored) : defaultPastVisits;
    } catch {
      return defaultPastVisits;
    }
  });

  const [accountSubTab, setAccountSubTab] = useState("beautyPlan");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const [beautyPlan, setBeautyPlan] = useState(() => {
    const defaultPlan = {
      morning: [
        { id: "m1", time: "08:00", title: "Bionomiczne oczyszczanie emulsją", desc: "Mycie twarzy fizjologiczną emulsją bionomiczną (pH 5.5) bez tarcia naskórka.", completed: false },
        { id: "m2", time: "08:15", title: "Esencja komórkowa z ektoiną", desc: "Aplikacja 3% ektoiny w celu uciszenia neuroreaktywności i stabilizacji flory.", completed: false },
        { id: "m3", time: "08:30", title: "Biomimetyczny krem ochronny & SPF", desc: "Domykanie okluzji lipidowej i mineralna fotoprotekcja SPF 50.", completed: false }
      ],
      evening: [
        { id: "e1", time: "21:00", title: "Lipidowe oczyszczenie (I etap)", desc: "Demakijaż fizjologicznym hydrofilnym olejem z nasion ogórecznika.", completed: false },
        { id: "e2", time: "21:10", title: "Oczyszczenie barierowe (II etap)", desc: "Delikatna pianka aminokwasowa chroniąca fizjologiczną faunę naskórka.", completed: false },
        { id: "e3", time: "21:20", title: "Serum regenerujące z beta-glukanem", desc: "Zmniejszenie procesów zapalnych i głęboka dekompresja komórkowa.", completed: false },
        { id: "e4", time: "21:35", title: "Krem rekonstruujący z ceramidami", desc: "Odbudowa cementu międzykomórkowego ceramidami NP/AP/EOP i cholesterolem.", completed: false }
      ],
      morningReminderTime: "08:00",
      eveningReminderTime: "21:00",
      isPushEnabled: false
    };
    try {
      const stored = safeStorage.getItem("slowskin_beauty_plan");
      return stored ? JSON.parse(stored) : defaultPlan;
    } catch {
      return defaultPlan;
    }
  });

  const [notificationPermission, setNotificationPermission] = useState(() => {
    try {
      if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.permission;
      }
    } catch (e) {}
    return "default";
  });

  const [lastNotified, setLastNotified] = useState<{ morningDate: string | null; eveningDate: string | null }>(() => {
    try {
      const stored = safeStorage.getItem("slowskin_last_notified");
      return stored ? JSON.parse(stored) : { morningDate: null, eveningDate: null };
    } catch {
      return { morningDate: null, eveningDate: null };
    }
  });

  // Sync beauty plan
  useEffect(() => {
    safeStorage.setItem("slowskin_beauty_plan", JSON.stringify(beautyPlan));
  }, [beautyPlan]);

  // Sync notifications log
  useEffect(() => {
    safeStorage.setItem("slowskin_last_notified", JSON.stringify(lastNotified));
  }, [lastNotified]);

  // Helper inside client to send standard Web Notifications
  const triggerBrowserNotification = (title: string, body: string) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico"
        });
        return true;
      } catch (err) {
        console.error("Browser notification failed:", err);
      }
    }
    return false;
  };

  // Real-time Cron Reminder Logic checking every 15 seconds
  useEffect(() => {
    if (!beautyPlan.isPushEnabled || typeof window === "undefined") return;

    const intervalId = setInterval(() => {
      const now = new Date();
      const currentHourMin = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const todayStr = now.toDateString();

      // Morning Push
      if (currentHourMin === beautyPlan.morningReminderTime && lastNotified.morningDate !== todayStr) {
        triggerBrowserNotification(
          "Poranny Rytuał • Slow Skin Concept",
          "Czas na poranną pielęgnację bionomiczną! Wspieraj swoją barierę hydrolipidową od rana."
        );
        setLastNotified(prev => ({ ...prev, morningDate: todayStr }));
        triggerToast("Poranne przypomnienie zostało wysłane na Twój pulpit.");
      }

      // Evening Push
      if (currentHourMin === beautyPlan.eveningReminderTime && lastNotified.eveningDate !== todayStr) {
        triggerBrowserNotification(
          "Wieczorny Rytuał • Slow Skin Concept",
          "Czas na wieczorną regenerację bionomiczną. Odbuduj cement międzykomórkowy przed snem."
        );
        setLastNotified(prev => ({ ...prev, eveningDate: todayStr }));
        triggerToast("Wieczorne przypomnienie zostało wysłane na Twój pulpit.");
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [beautyPlan.isPushEnabled, beautyPlan.morningReminderTime, beautyPlan.eveningReminderTime, lastNotified]);

  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const startEditing = (step: any) => {
    setEditingStepId(step.id);
    setEditTitle(step.title);
    setEditTime(step.time);
    setEditDesc(step.desc);
  };

  const saveStep = (section: "morning" | "evening", id: string) => {
    if (!editTitle.trim()) {
      triggerToast("Nazwa kosmetyku nie może być pusta.", "error");
      return;
    }
    setBeautyPlan((prev: any) => ({
      ...prev,
      [section]: prev[section].map((step: any) => 
        step.id === id ? { ...step, title: editTitle, time: editTime, desc: editDesc } : step
      )
    }));
    setEditingStepId(null);
    triggerToast("Krok został pomyślnie zmodyfikowany.");
  };

  const handleAddStep = (section: "morning" | "evening") => {
    const newStep = {
      id: "step_" + Date.now(),
      time: section === "morning" ? "08:00" : "21:00",
      title: "Nowy krok pielęgnacji",
      desc: "Przykładowy krótki opis nakładania preparatu bionomicznego.",
      completed: false
    };
    setBeautyPlan((prev: any) => ({
      ...prev,
      [section]: [...prev[section], newStep]
    }));
    triggerToast("Dodano pusty krok bionomiczny.");
    setEditingStepId(newStep.id);
    setEditTitle(newStep.title);
    setEditTime(newStep.time);
    setEditDesc(newStep.desc);
  };

  const handleDeleteStep = (section: "morning" | "evening", id: string) => {
    setBeautyPlan((prev: any) => ({
      ...prev,
      [section]: prev[section].filter((step: any) => step.id !== id)
    }));
    triggerToast("Krok został usunięty.");
  };

  const toggleStepCompleted = (section: "morning" | "evening", id: string) => {
    setBeautyPlan((prev: any) => ({
      ...prev,
      [section]: prev[section].map((step: any) => 
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    }));
  };

  const handleUpdateReminderTime = (type: "morning" | "evening", value: string) => {
    setBeautyPlan((prev: any) => ({
      ...prev,
      [`${type}ReminderTime`]: value
    }));
    triggerToast(`Główna godzina przypomnienia zmieniona na: ${value}`);
  };

  const handleSubmitSatisfactionSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingVisitId) return;

    const matchedVisit = pastVisits.find((v: any) => v.id === ratingVisitId);
    if (!matchedVisit) return;

    const newReview = {
      id: "rev_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      visitId: ratingVisitId,
      treatmentTitle: matchedVisit.treatmentTitle,
      rating: surveyRating,
      atmosphereRating: surveyAtmosphere,
      relaxationFeel: surveyRelaxation,
      feedback: surveyFeedback,
    };

    const updatedReviews = [newReview, ...reviewsList];
    setReviewsList(updatedReviews);
    try {
      safeStorage.setItem("reviews", JSON.stringify(updatedReviews));
    } catch (err) {
      console.warn("Could not save review to storage:", err);
    }

    // Simulate sending an email to the administrator
    console.log(
      `%c[SYSTEM EMAIL TO ADMIN]%c\n` +
      `Do: admin@slowskinconcept.pl\n` +
      `Temat: [NOWA ANKIETA SATYSFAKCJI] Klient ocenił wizytę: ${matchedVisit.treatmentTitle}\n\n` +
      `Szczegóły opinii klienta:\n` +
      `- Rytuał: ${matchedVisit.treatmentTitle} (${matchedVisit.date})\n` +
      `- Terapeutka: ${matchedVisit.therapist}\n` +
      `- Komórkowa ocena zabiegu: ${surveyRating}/5 gwiazdek\n` +
      `- Komfort i atmosfera: ${surveyAtmosphere}/5 gwiazdek\n` +
      `- Czy odczuwał(a) głębokie wyciszenie/relaks: ${surveyRelaxation === "tak" ? "TAK" : "NIE"}\n` +
      `- Treść opinii: "${surveyFeedback || "Brak komentarza"}"\n` +
      `--------------------------------------------------\n` +
      `Opinia została poprawnie utrwalona w bazie danych (localStorage).`,
      "color: #D4AF37; font-weight: bold; font-size: 12px;",
      "color: inherit;"
    );

    triggerToast("Dziękujemy za przesłanie opinii! Twój głos współtworzy nasz Quiet Luxury.", "success");
    setSurveySuccess(true);
    
    // Close the form after a delayed transition so the user can see the elegant completion card
    setTimeout(() => {
      setRatingVisitId(null);
      setSurveySuccess(false);
      setSurveyFeedback("");
      setSurveyRating(5);
      setSurveyAtmosphere(5);
      setSurveyRelaxation("tak");
    }, 4500);
  };

  const togglePushNotifications = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      triggerToast("Powiadomienia przeglądarkowe nie są obsługiwane przez urządzenie.", "error");
      return;
    }

    if (!beautyPlan.isPushEnabled) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          setBeautyPlan((prev: any) => ({ ...prev, isPushEnabled: true }));
          triggerToast("Powiadomienia push zostały pomyślnie włączone! ✨");
          triggerBrowserNotification(
            "Slow Skin Concept™",
            "Fizjologiczne powiadomienia push aktywowane! Twój Beauty Plan jest teraz zsynchronizowany."
          );
        } else if (permission === "denied") {
          triggerToast("Brak zgody. Odblokuj notyfikacje w ustawieniach swojej kłódki URL.", "error");
        } else {
          triggerToast("Odrzucono zgodę na powiadomienia push.", "error");
        }
      });
    } else {
      setBeautyPlan((prev: any) => ({ ...prev, isPushEnabled: false }));
      triggerToast("Powiadomienia push zostały wyłączone.");
    }
  };

  const handleTestNotification = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      triggerToast("Ta przeglądarka nie wspiera powiadomień systemowych.", "error");
      return;
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          triggerBrowserNotification(
            "Slow Skin Concept™",
            "System testowy push działa bez zarzutu! Zaplanowana pielęgnacja oczekuje na realizację. ✨"
          );
          triggerToast("Przesłano testową notyfikację push!");
        } else {
          triggerToast("Najpierw włącz powiadomienia w panelu i wyraź zgodę.", "error");
        }
      });
    } else {
      triggerBrowserNotification(
        "Slow Skin Concept™",
        "System testowy push działa bez zarzutu! Zaplanowana pielęgnacja oczekuje na realizację. ✨"
      );
      triggerToast("Przesłano testową notyfikację push!");
    }
  };

  const [loginEmail, setLoginEmail] = useState("aleksandra.kaminska@quietluxury.pl");
  const [loginPassword, setLoginPassword] = useState("1234");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Synchronize 'Slow Skin Pass' data to storage
  useEffect(() => {
    safeStorage.setItem("slowskin_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    safeStorage.setItem("slowskin_visits", JSON.stringify(pastVisits));
  }, [pastVisits]);

  useEffect(() => {
    safeStorage.setItem("slowskin_is_logged", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    setTimeout(() => {
      if (loginEmail === "aleksandra.kaminska@quietluxury.pl" && loginPassword === "1234") {
        setIsLoggedIn(true);
      } else {
        setLoginError("Nieprawidłowy adres e-mail lub hasło dostępu. Spróbuj użyć konta demonstracyjnego.");
      }
      setIsLoginLoading(false);
    }, 600);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleTogglePrefersSilence = () => {
    setUserProfile((prev: any) => ({
      ...prev,
      prefersSilence: !prev.prefersSilence
    }));
  };

  // Google Translate Client-side Integration for Full-Page Translation with Custom Design System
  useEffect(() => {
    if (currentLanguage === "PL") return;

    (window as any).googleTranslateElementInit = () => {
      try {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'pl',
            includedLanguages: 'en,de,uk,it',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google-translate-hidden-container'
        );
      } catch (e) {}
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.type = "text/javascript";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }
  }, [currentLanguage]);
  
  // Diagnostics State
  const [answers, setAnswers] = useState<DiagnosticAnswers>({
    ageGroup: "",
    skinConcerns: "",
    skinType: "",
    stressLevel: "",
    lifestyle: "",
    treatmentHistory: "",
    expectations: ""
  });
  
  const [diagnosticStep, setDiagnosticStep] = useState<number>(0);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);
  
  // Interactive Skin Barrier Map State
  const [diagnoseSubTab, setDiagnoseSubTab] = useState<"form" | "barrierMap">("form");
  const [activeBarrierLayer, setActiveBarrierLayer] = useState<"microbiome" | "corneum" | "junctions" | "deep">("microbiome");
  const [barrierHealthState, setBarrierHealthState] = useState<"healthy" | "damaged">("damaged");

  // Booking State
  const [bookingTreatment, setBookingTreatment] = useState<Treatment | null>(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Legal Policies State
  const [openPolicyModal, setOpenPolicyModal] = useState<"privacy" | "terms" | null>(null);
  const [isCookiesPolicyOpen, setIsCookiesPolicyOpen] = useState(false);

  // Reviews Slider State
  const [reviewsWidgetCode, setReviewsWidgetCode] = useState(() => {
    return safeStorage.getItem("slow_skin_reviews_widget") || "";
  });
  const [reviewViewMode, setReviewViewMode] = useState<"carousel" | "live-widget" | "widget-setup">(() => {
    const saved = safeStorage.getItem("slow_skin_reviews_widget");
    return saved ? "live-widget" : "carousel";
  });
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);
  const [reviewCategoryFilter, setReviewCategoryFilter] = useState<"all" | "stories" | "google">("all");
  const [selectedStoryModal, setSelectedStoryModal] = useState<Review | null>(null);

  // Satisfaction Survey Review State
  const [reviewsList, setReviewsList] = useState<any[]>(() => {
    try {
      const stored = safeStorage.getItem("reviews");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [ratingVisitId, setRatingVisitId] = useState<string | null>(null);
  const [surveyRating, setSurveyRating] = useState<number>(5);
  const [surveyAtmosphere, setSurveyAtmosphere] = useState<number>(5);
  const [surveyRelaxation, setSurveyRelaxation] = useState<"tak" | "nie">("tak");
  const [surveyFeedback, setSurveyFeedback] = useState<string>("");
  const [surveySuccess, setSurveySuccess] = useState<boolean>(false);

  // Cabinet Gallery Video States
  const [cabinetActiveVideoIdx, setCabinetActiveVideoIdx] = useState(0);
  const [cabinetVideoMuted, setCabinetVideoMuted] = useState(true);
  const [cabinetVideoPlaybackSpeed, setCabinetVideoPlaybackSpeed] = useState(1.0);
  const cabinetVideoRef = useRef<HTMLVideoElement>(null);

  // Video Player States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoShowControls, setVideoShowControls] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | "ALL">("ALL");
  const [journalSearch, setJournalSearch] = useState("");
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [activeConcernIdx, setActiveConcernIdx] = useState<number | null>(0);
  const [activeResultIdx, setActiveResultIdx] = useState(0);
  const [activePlanerCategoryIdx, setActivePlanerCategoryIdx] = useState(0);
  const [compareMode, setCompareMode] = useState<"before" | "after">("after");
  const [quizStep, setQuizStep] = useState(0); // 0: Start, 1: Concern, 2: Sensitivity, 3: Goal, 4: Recommendation
  const [quizConcern, setQuizConcern] = useState<string | null>(null);
  const [quizSensitivity, setQuizSensitivity] = useState<string | null>(null);
  const [quizGoal, setQuizGoal] = useState<string | null>(null);
  const [sharedNotification, setSharedNotification] = useState(false);

  // Mega Menu States
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isProblemsMenuOpen, setIsProblemsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isTrainingMenuOpen, setIsTrainingMenuOpen] = useState(false);
  
  // Expert Dilemma States
  const [isExpertDilemmaOpen, setIsExpertDilemmaOpen] = useState(false);
  const [expertDilemmaSearch, setExpertDilemmaSearch] = useState("");
  const [selectedExpertCategory, setSelectedExpertCategory] = useState<string>("Wszystkie");
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const problemsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shopMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trainingMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMegaMenuMouseEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
    setIsProblemsMenuOpen(false);
    setIsShopMenuOpen(false);
    setIsTrainingMenuOpen(false);
  };

  const handleMegaMenuMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  const handleProblemsMenuMouseEnter = () => {
    if (problemsMenuTimeoutRef.current) clearTimeout(problemsMenuTimeoutRef.current);
    setIsProblemsMenuOpen(true);
    setIsMegaMenuOpen(false);
    setIsShopMenuOpen(false);
    setIsTrainingMenuOpen(false);
  };

  const handleProblemsMenuMouseLeave = () => {
    problemsMenuTimeoutRef.current = setTimeout(() => {
      setIsProblemsMenuOpen(false);
    }, 200);
  };

  const handleShopMenuMouseEnter = () => {
    if (shopMenuTimeoutRef.current) clearTimeout(shopMenuTimeoutRef.current);
    setIsShopMenuOpen(true);
    setIsMegaMenuOpen(false);
    setIsProblemsMenuOpen(false);
    setIsTrainingMenuOpen(false);
  };

  const handleShopMenuMouseLeave = () => {
    shopMenuTimeoutRef.current = setTimeout(() => {
      setIsShopMenuOpen(false);
    }, 200);
  };

  const handleTrainingMenuMouseEnter = () => {
    if (trainingMenuTimeoutRef.current) clearTimeout(trainingMenuTimeoutRef.current);
    setIsTrainingMenuOpen(true);
    setIsMegaMenuOpen(false);
    setIsProblemsMenuOpen(false);
    setIsShopMenuOpen(false);
  };

  const handleTrainingMenuMouseLeave = () => {
    trainingMenuTimeoutRef.current = setTimeout(() => {
      setIsTrainingMenuOpen(false);
    }, 200);
  };

  // PST Images Gallery State (Authentic Classic Clinical Model)
  const PST_IMAGES = useMemo(() => [
    {
      url: customTreatmentImages["pst-couch"] || "/pst_couch.png",
      fallback: "/src/assets/images/pst_couch_bed_therapy_1791109628792.jpg",
      title: "Aparat PST H-300",
      subtitle: "Aplikator tunelowy do kręgosłupa i tułowia • Leżanka zabiegowa",
      tag: "PST H-300 • Kręgosłup & Biodra"
    },
    {
      url: customTreatmentImages["pst-chair"] || "/pst_chair.png",
      fallback: "/src/assets/images/pst_chair_therapy_1791109644424.jpg",
      title: "Aparat PST H-200",
      subtitle: "Aplikator pierścieniowy do stawów kończyn • Komfortowy fotel",
      tag: "PST H-200 • Stawy Kończyn & Kolana"
    }
  ], [customTreatmentImages]);
  const [selectedPstImageIndex, setSelectedPstImageIndex] = useState<number>(0);

  // Mobile Accordions States
  const [isMobileZabiegiOpen, setIsMobileZabiegiOpen] = useState(false);
  const [isMobileProblemyOpen, setIsMobileProblemyOpen] = useState(false);
  const [isMobileWiedzaOpen, setIsMobileWiedzaOpen] = useState(false);

  // Harvest all existing FAQs from all clinical treatments to create an interactive FAQ finder
  const harvestedFaqs = useMemo(() => {
    const list: { question: string; answer: string; category: string; treatmentName: string; treatmentId: string }[] = [];
    
    TREATMENTS.forEach((t) => {
      if (t.faq && Array.isArray(t.faq)) {
        t.faq.forEach((f) => {
          if (!list.some((existing) => existing.question.trim().toLowerCase() === f.question.trim().toLowerCase())) {
            let catName = "Pielęgnacja & Efekty";
            if (t.id.includes("first") || t.id.includes("diagn")) {
              catName = "Diagnoza & Pierwszy Krok";
            } else if (t.id.includes("lifting") || t.id.includes("modeling") || t.id.includes("nogier") || t.id.includes("hifu")) {
              catName = "Lifting & Neurologia";
            } else if (t.id.includes("amber") || t.id.includes("biological") || t.id.includes("epigenetic")) {
              catName = "Regeneracja Biologiczna";
            } else if (t.id.includes("purification") || t.id.includes("clean")) {
              catName = "Oczyszczanie Bionomiczne";
            }
            list.push({
              question: f.question,
              answer: f.answer,
              category: f.category || catName,
              treatmentName: t.title,
              treatmentId: t.id
            });
          }
        });
      }
    });

    // Provide luxury fallback FAQ list if none were harvested
    if (list.length === 0) {
      return [
        {
          question: "Co wyróżnia pielęgnację bionomiczną od standardowej kosmetyki?",
          answer: "Pielęgnacja bionomiczna wyklucza wszelkie parabeny, silikony, alkohole denaturowane, oleje mineralne oraz syntetyczne kompozycje zapachowe. Stosujemy wyłącznie składniki bio-zbieżne z naskórkiem (ceramidy, fitosfingozynę, ektoinę), aktywujące naturalne mechanizmy autonaprawy naskórka.",
          category: "Filozofia Slow Skin",
          treatmentName: "Pierwsza Wizyta Slow Skin",
          treatmentId: "slow-skin-first"
        },
        {
          question: "Czy komputerowa diagnostyka skóry Nati V3 wywołuje ból lub dyskomfort?",
          answer: "Nie, badanie komputerowe jest całkowicie nieinwazyjne. Przykładana do skóry głowica z podświetleniem polaryzacyjnym analizuje strukturę przestrzenną naskórka, stan naczyń krwionośnych oraz poziom nawilżenia warstwy rogowej w 100% bezboleśnie.",
          category: "Diagnoza & Pierwszy Krok",
          treatmentName: "Pierwsza Wizyta Slow Skin",
          treatmentId: "slow-skin-first"
        },
        {
          question: "Jak skóra reaguje bezpośrednio po rytuale z komórkami macierzystymi i kwasem bursztynowym?",
          answer: "Dzięki unikalnemu doborowi składników łagodzących inflammaging, skóra wychodzi niezwykle ukojenia, delikatnie rozświetlona i jedwabista w dotyku. Nie występuje nieestetyczny rumień ani intensywne łuszczenie potraktowanych komórek.",
          category: "Regeneracja Biologiczna",
          treatmentName: "Regeneracja Kwasem Bursztynowym",
          treatmentId: "amber-regeneration"
        }
      ];
    }
    return list;
  }, []);

  // Filtered FAQs for search in the sliding drawer
  const filteredExpertFaqs = useMemo(() => {
    return harvestedFaqs.filter((faq) => {
      const matchSearch =
        faq.question.toLowerCase().includes(expertDilemmaSearch.toLowerCase()) ||
        faq.answer.toLowerCase().includes(expertDilemmaSearch.toLowerCase()) ||
        faq.category.toLowerCase().includes(expertDilemmaSearch.toLowerCase()) ||
        faq.treatmentName.toLowerCase().includes(expertDilemmaSearch.toLowerCase());
      
      if (selectedExpertCategory === "Wszystkie") {
        return matchSearch;
      }
      return matchSearch && faq.category === selectedExpertCategory;
    });
  }, [harvestedFaqs, expertDilemmaSearch, selectedExpertCategory]);

  // Unique categories for the FAQ finder
  const expertCategories = useMemo(() => {
    const cats = new Set(harvestedFaqs.map((faq) => faq.category));
    return ["Wszystkie", ...Array.from(cats)];
  }, [harvestedFaqs]);

  // Link Router for Mega Menu Links
  const handleLinkClick = (url: string) => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsProblemsMenuOpen(false);
    setIsShopMenuOpen(false);
    setIsTrainingMenuOpen(false);

    if (url.includes("sklep") || url === "/sklep/" || url === "/sklep" || url === "sklep" || url === "/produkty/" || url === "/butik/") {
      setActiveTab("shop");
      setSelectedTreatment(null);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (url.includes("szkoleni") || url.includes("partner") || url === "/szkolenia/" || url === "/szkolenia" || url === "szkolenia" || url === "/wspolpraca/" || url === "/akademia/") {
      setActiveTab("training");
      setSelectedTreatment(null);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // CTA mappings
    if (url === "videokonsultacja" || url === "konsultacja-online" || url.includes("videokonsultac")) {
      const videoT = TREATMENTS.find(t => t.id === "videokonsultacja") || TREATMENTS[0];
      setBookingTreatment(videoT);
      return;
    }
    if (url === "cal-com" || url === "rezerwacja-online" || url.includes("cal.com") || url.includes("rezerwacja")) {
      // Find First Visit treatment to initiate booking
      const t = TREATMENTS[0];
      setBookingTreatment(t);
      return;
    }
    if (url === "ai-analiza") {
      setActiveTab("diagnose");
      setDiagnoseSubTab("form");
      setDiagnosticStep(0);
      setSelectedArticle(null);
      setSelectedTreatment(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "mapa-bariery") {
      setActiveTab("diagnose");
      setDiagnoseSubTab("barrierMap");
      setDiagnosticStep(0);
      setSelectedArticle(null);
      setSelectedTreatment(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/kontakt/") {
      const footer = document.getElementById("luxury-footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
      return;
    }

    // Method and Philosophy Mappings
    if (
      url === "/metoda/" || 
      url === "/metoda" || 
      url === "metoda" || 
      url === "/slow-skin-concept/" || 
      url === "/slow-skin-concept" || 
      url === "slow-skin-concept" ||
      url === "/filozofia/" || 
      url === "/filozofia" ||
      url === "/o-mnie/" || 
      url === "/o-mnie" || 
      url === "/katarzyna-brzezinska/" ||
      url === "/katarzyna-brzezinska"
    ) {
      setActiveTab("method");
      setSelectedTreatment(null);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Treatment Mappings - Standard List View (Zabiegi na twarz)
    if (url === "/zabiegi-na-twarz-jelcz-laskowice/" || url === "/zabiegi-na-twarz/" || url === "/zabiegi-na-twarz" || url === "zabiegi-na-twarz") {
      setActiveTab("clinic");
      setSelectedTreatment(null);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Ceragem & PST Direct Mappings
    if (
      url === "/ceragem/" || 
      url === "/ceragem" || 
      url === "ceragem" || 
      url === "/masaz-ceragem/" || 
      url === "/masaz-ceragem" || 
      url === "masaz-ceragem" || 
      url === "/ceragem-thermal-massage/" || 
      url === "/ceragem-thermal-massage" || 
      url === "ceragem-thermal-massage" || 
      url.includes("ceragem")
    ) {
      setActiveTab("clinic");
      const ceragemT = TREATMENTS.find(item => item.id === "ceragem-thermal-massage") || TREATMENTS[0];
      setSelectedTreatment(ceragemT);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (
      url === "/pst/" || 
      url === "/pst" || 
      url === "pst" || 
      url === "/terapia-pst/" || 
      url === "/terapia-pst" || 
      url === "terapia-pst" || 
      url === "/pst-signal-therapy/" || 
      url === "/pst-signal-therapy" || 
      url === "pst-signal-therapy" || 
      url.includes("pst-signal")
    ) {
      setActiveTab("clinic");
      const pstT = TREATMENTS.find(item => item.id === "pst-signal-therapy") || TREATMENTS[0];
      setSelectedTreatment(pstT);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Laser LPL, Światło LPL & Fotoepilacja Mappings
    if (
      url === "/laser-lpl/" || 
      url === "/laser-lpl" || 
      url === "laser-lpl" || 
      url === "/terapie-laserowe-lpl/" || 
      url === "/terapie-laserowe-lpl" || 
      url === "terapie-laserowe-lpl" || 
      url === "/terapie-swiatlem-lpl/" || 
      url === "/terapie-swiatlem-lpl" || 
      url === "terapie-swiatlem-lpl" || 
      url === "/lpl/" || 
      url === "/lpl" || 
      url === "lpl" || 
      url.includes("laser-lpl") || 
      url.includes("swiatlem-lpl") ||
      url.includes("terapie-laserowe-lpl")
    ) {
      setActiveTab("clinic");
      const lplT = TREATMENTS.find(item => item.id === "terapie-swiatlem-lpl") || TREATMENTS[0];
      setSelectedTreatment(lplT);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (
      url === "/fotoepilacja-lpl/" || 
      url === "/fotoepilacja-lpl" || 
      url === "fotoepilacja-lpl" || 
      url === "/fotoepilacja/" || 
      url === "/fotoepilacja" || 
      url === "fotoepilacja" ||
      url.includes("fotoepilac")
    ) {
      setActiveTab("clinic");
      const fotoT = TREATMENTS.find(item => item.id === "fotoepilacja-lpl") || TREATMENTS[0];
      setSelectedTreatment(fotoT);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (
      url === "/laser-carbon/" || 
      url === "/laser-carbon" || 
      url === "laser-carbon" || 
      url === "/peeling-laserowy-weglowy/" ||
      url.includes("laser-carbon")
    ) {
      setActiveTab("clinic");
      const carbonT = TREATMENTS.find(item => item.id === "laser-carbon") || TREATMENTS[0];
      setSelectedTreatment(carbonT);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Mezoterapia & Stymulatory Mappings
    if (url === "/meso-needleless/" || url === "/meso-needleless" || url.includes("meso-needleless") || url === "/mezoterapia-beziglowa/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "mezoterapia-beziglowa") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/meso-needle/" || url === "/meso-needle" || url.includes("meso-needle") || url === "/mezoterapia-mikroiglowa/" || url === "/mezoterapia-iglowa/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "mezoterapia-mikroiglowa") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/meso-gold-needle/" || url === "/meso-gold-needle" || url.includes("meso-gold-needle") || url.includes("mesoporo")) {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "mesoporacja-dwufazowa-mesoporo") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/tissue-stimulators/" || url === "/tissue-stimulators" || url.includes("tissue-stimulators") || url === "/stymulatory-tkankowe/" || url === "/stymulatory-tkankowe" || url.includes("stymulatory-tkankowe")) {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "stymulatory-tkankowe") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (
      url === "/carboksyterapia-carboregen/" || 
      url === "/carboksyterapia-carboregen" || 
      url === "/carboksyterapia/" || 
      url === "/carboksyterapia" || 
      url === "/carboregen/" || 
      url === "/carboregen" ||
      url.includes("carboksy") || 
      url.includes("carboregen")
    ) {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "carboksyterapia-carboregen") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (
      url === "/sonaris-pro/" || 
      url === "/sonaris-pro" || 
      url === "/sonaris-pro-therapy/" || 
      url === "/sonaris-pro-therapy" || 
      url.includes("sonaris")
    ) {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "sonaris-pro-therapy") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Dynamic Treatment URL Matcher
    // Strips slashes and directories like "zabiegi", "zabieg", "cennik" to find the treatment ID
    const pathSlug = url.replace(/^\/+|\/+$/g, "").replace("zabiegi/", "").replace("zabieg/", "").replace("cennik/", "");
    const foundTreatment = TREATMENTS.find(item => 
      item.id === pathSlug || 
      item.id.replace(/-/g, "") === pathSlug.replace(/-/g, "")
    );

    if (foundTreatment) {
      setActiveTab("clinic");
      setSelectedTreatment(foundTreatment);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Legacy Specific URL Mapping Fallbacks
    if (url === "/neurolifting/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "neurolifting-nogier") || TREATMENTS.find(item => item.id === "lift-firm-therapy") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/meso-remodeling/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "epigenetic-aging") || TREATMENTS.find(item => item.id === "healthy-glow-therapy") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (
      url === "/terapia-skory-wrazliwej-i-reaktywnej/" || 
      url === "/terapie-regeneracyjne/" || 
      url === "/odbudowa-bariery-hydrolipidowej/" ||
      url === "/cera-naczynkowa-rumien/"
    ) {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "rosacea-calm-therapy") || TREATMENTS.find(item => item.id === "couperose-therapy") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/terapia-led/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "healthy-glow-therapy") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/zabiegi-slow-aging/" || url === "/zabiegi-anti-aging/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "lift-firm-therapy") || TREATMENTS.find(item => item.id === "epigenetic-aging") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/pierwsza-wizyta-diagnostyka-skory/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "skin-readiness") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Knowledge Articles Mappings
    if (url === "/baza-wiedzy/jak-odbudowac-bariere-hydrolipidowa/") {
      setActiveTab("journal");
      const art = ARTICLES.find(item => item.id === "art-hydrolipid-barrier") || ARTICLES[2];
      setSelectedArticle(art);
      setSelectedTreatment(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/baza-wiedzy/skora-wrazliwa-reaktywna/") {
      setActiveTab("journal");
      const art = ARTICLES.find(item => item.id === "art-slow-skin-philosophy") || ARTICLES[0];
      setSelectedArticle(art);
      setSelectedTreatment(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/baza-wiedzy/neurolifting-dla-kogo/") {
      setActiveTab("journal");
      const art = ARTICLES.find(item => item.id === "art-neurobiology-skin") || ARTICLES[1];
      setSelectedArticle(art);
      setSelectedTreatment(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (url === "/baza-wiedzy/jak-przygotowac-sie-do-wizyty/") {
      setActiveTab("clinic");
      const t = TREATMENTS.find(item => item.id === "skin-readiness") || TREATMENTS[0];
      setSelectedTreatment(t);
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  // Video Player Event Handlers
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play().catch((err) => console.log("Video playback error:", err));
        setIsVideoPlaying(true);
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      const nextMute = !isVideoMuted;
      videoRef.current.muted = nextMute;
      setIsVideoMuted(nextMute);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 0;
      if (dur > 0) {
        setVideoProgress((current / dur) * 100);
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 0);
    }
  };

  const handleVideoProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const pct = parseFloat(e.target.value);
      const targetTime = (pct / 100) * (videoRef.current.duration || 0);
      videoRef.current.currentTime = targetTime;
      setVideoProgress(pct);
    }
  };

  const getFilteredReviews = () => {
    return REVIEWS.filter((rev) => {
      if (reviewCategoryFilter === "stories") return rev.platform === "slow-skin.pl";
      if (reviewCategoryFilter === "google") return rev.platform === "Google";
      return true;
    });
  };

  const getReviewAuthorTitle = (author: string, review?: Review) => {
    if (review?.platform === "slow-skin.pl") {
      return "Oficjalna Historia Pacjentki • slow-skin.pl";
    }
    const firstName = author.trim().split(" ")[0] || "";
    if (firstName.endsWith("a") || author.startsWith("Pani")) {
      return "Klientka Instytutu Slow Skin";
    }
    return "Klient Instytutu Slow Skin";
  };

  const nextReview = () => {
    setReviewProgress(0);
    const filtered = getFilteredReviews();
    if (filtered.length === 0) return;
    setActiveReviewIndex((prev) => (prev + 1) % filtered.length);
  };

  const prevReview = () => {
    setReviewProgress(0);
    const filtered = getFilteredReviews();
    if (filtered.length === 0) return;
    setActiveReviewIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  useEffect(() => {
    if (activeTab !== "cover" || isReviewsHovered) return;
    const interval = setInterval(() => {
      setReviewProgress((prev) => {
        const filtered = getFilteredReviews();
        if (filtered.length === 0) return 0;
        if (prev >= 100) {
          setActiveReviewIndex((current) => (current + 1) % filtered.length);
          return 0;
        }
        return prev + 5;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [activeTab, isReviewsHovered]);

  useEffect(() => {
    if (cabinetVideoRef.current) {
      cabinetVideoRef.current.playbackRate = cabinetVideoPlaybackSpeed;
    }
  }, [cabinetActiveVideoIdx, cabinetVideoPlaybackSpeed]);

  const getCleanWidgetHtml = (code: string) => {
    if (!code) return "";
    return code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  };

  const handleOpenBooking = useCallback((tgt: Treatment) => {
    setBookingTreatment(tgt);
  }, []);

  useEffect(() => {
    safeStorage.setItem("slow_skin_reviews_widget", reviewsWidgetCode);

    if (!reviewsWidgetCode) return;

    // Dynamically load scripts present in reviewsWidgetCode
    const doc = new DOMParser().parseFromString(reviewsWidgetCode, "text/html");
    const scripts = Array.from(doc.querySelectorAll("script"));
    const injectedScripts: HTMLScriptElement[] = [];

    scripts.forEach((script) => {
      const src = script.getAttribute("src");
      if (src) {
        // Prevent duplicate loading
        const existing = document.querySelector(`script[src="${src}"]`);
        if (!existing) {
          const newScript = document.createElement("script");
          newScript.src = src;
          newScript.async = true;
          newScript.defer = true;
          document.body.appendChild(newScript);
          injectedScripts.push(newScript);
        }
      } else if (script.textContent) {
        const inlineScript = document.createElement("script");
        inlineScript.textContent = script.textContent;
        document.body.appendChild(inlineScript);
        injectedScripts.push(inlineScript);
      }
    });

    // Handle Elfsight Platform Refresh if it's already loaded
    setTimeout(() => {
      try {
        // @ts-ignore
        if (window.ElfsightPlatform && typeof window.ElfsightPlatform.init === 'function') {
          // @ts-ignore
          window.ElfsightPlatform.init();
        }
      } catch (e) {
        console.warn("Could not re-init Elfsight platform automatically:", e);
      }
    }, 800);

    return () => {
      injectedScripts.forEach((script) => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [reviewsWidgetCode]);

  // Submit diagnostic questionnaire to the backend API
  const handleStartDiagnose = async () => {
    setIsDiagnosing(true);
    setDiagnosticError(null);
    setDiagnosticReport(null);
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers })
      });
      
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Nie udało się przeprowadzić diagnozy komórkowej.");
      }
      
      const data: DiagnosticReport = await response.json();
      setDiagnosticReport(data);
      setDiagnosticStep(7); // Jump to report screen
    } catch (err: any) {
      console.error(err);
      setDiagnosticError(err.message || "Wystąpił błąd komunikacji z serwerem diagnostycznym.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  const downloadTxtReport = () => {
    if (!diagnosticReport) return;

    const morningSteps = diagnosticReport.atHomePrescription.morning
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join("\n");

    const eveningSteps = diagnosticReport.atHomePrescription.evening
      .map((step, idx) => `${idx + 1}. ${step}`)
      .join("\n");

    const therapies = diagnosticReport.clinicalTherapies
      .map((therapy) => `${therapy.name}\nUzasadnienie: ${therapy.explanation}`)
      .join("\n\n");

    const docId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toLocaleDateString("pl-PL");

    const textContent = `======================================================================
                  SLOW SKIN CONCEPT - JELCZ-LASKOWICE
               SPERSONALIZOWANA RECEPTA ANATOMII SKÓRY
======================================================================

Data analizy: ${dateStr}
ID Dokumentu: #${docId}
Pacjentka: Klientka Slow Skin Concept

----------------------------------------------------------------------
1. AUTORSKA OCENA STANU BARIERY
----------------------------------------------------------------------
${diagnosticReport.skinTypeAssessment}

----------------------------------------------------------------------
2. UWARUNKOWANIA NEURO-BIOLOGICZNE (KORTYZOL & NEURO-STARZENIE)
----------------------------------------------------------------------
${diagnosticReport.biologicalCauses}

----------------------------------------------------------------------
3. DOBOWA ASYSTA PIELĘGNACYJNA (PROTKOŁY DOMOWYCH RECEPT)
----------------------------------------------------------------------
Rytuał Poranny: Ochrona & Hydratacja:
${morningSteps}

Rytuał Wieczorny: Rekonstrukcja Molekularna:
${eveningSteps}

----------------------------------------------------------------------
4. SUGEROWANE KOMÓRKOWE RYTUAŁY GABINETOWE
----------------------------------------------------------------------
${therapies}

----------------------------------------------------------------------
5. HOLISTYCZNY RYTUAŁ WYCISZENIA SENSORYCZNEGO
----------------------------------------------------------------------
"${diagnosticReport.holisticMindfulness}"

======================================================================
Katarzyna Brzezińska
Kosmetolog holistyczny, skinolog & founder
SLOW SKIN CONCEPT - JELCZ-LASKOWICE, UL. SZKOLNA 5
======================================================================`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Slow_Skin_Concept_Diagnoza_${docId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingPhone || !bookingDate) return;
    setBookingConfirmed(true);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div id="app-root" className="min-h-screen bg-luxury-cream text-luxury-dark font-sans flex flex-col selection:bg-luxury-sand selection:text-luxury-gold">
      
      {/* Invisible placeholder container to initiate official Google Translate element */}
      <div id="google-translate-hidden-container" className="hidden" style={{ display: 'none' }} />

      {/* Luxury Language Transition Screen Indicator */}
      <AnimatePresence>
        {isLanguageLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-luxury-cream z-[9999] flex flex-col items-center justify-center text-center p-6 select-none"
            id="luminous-language-loader"
          >
            <div className="space-y-6 max-w-md">
              {/* Spinning subtle bionomic light */}
              <div className="relative flex items-center justify-center mx-auto mb-4">
                <div className="w-16 h-16 rounded-full border border-luxury-sand flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border border-[#ebdcb9]/40 animate-pulse bg-luxury-gold/5" />
                </div>
                {/* Thin golden orbit line */}
                <div className="absolute inset-x-0 inset-y-0 border border-t-luxury-gold border-r-transparent border-l-transparent rounded-full animate-spin [animation-duration:1.5s]" />
              </div>
              
              <div className="space-y-2">
                <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-medium animate-pulse">
                  {currentLanguage === "EN" ? "TUNING CELLULAR LANGUAGE STRUCTURE" : 
                   currentLanguage === "DE" ? "HAUT-REFUGIUM SPRACHSTRUKTUR WIRD ANGEPASST" :
                   currentLanguage === "UA" ? "НАЛАШТУВАННЯ МОВНОЇ СТРУКТУРИ" :
                   currentLanguage === "IT" ? "SINTONIZZAZIONE STRUTTURA LINGUISTICA CELLULARE" :
                   "DOSTRAJANIE BIOKOMPATYBILNEJ STRUKTURY JĘZYKA"}
                </span>
                <p className="font-serif text-lg font-light text-luxury-dark tracking-wide">
                  {currentLanguage === "EN" ? "Aligning Quiet Luxury and skin biology details..." :
                   currentLanguage === "DE" ? "Quiet Luxury und Hautbiologie-Schnittstelle..." :
                   currentLanguage === "UA" ? "Гармонізація тиші та біологічних параметрів шкіри..." :
                   currentLanguage === "IT" ? "Allineamento del Quiet Luxury e dettagli della biologia cutanea..." :
                   "Synchronizacja poziomu komórkowego i estetyki quiet luxury..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Announcement Bar */}
      <div className="bg-luxury-dark text-luxury-cream/80 text-[9px] sm:text-[10px] tracking-[0.20em] sm:tracking-[0.25em] uppercase text-center py-2 sm:py-2.5 px-4 font-mono select-none">
        Biologiczna Terapia Skóry, Neurobiologia i Fizjologia — Jelcz-Laskowice
      </div>

      {/* Main Luxury Header */}
      <header className="border-b border-luxury-sand bg-luxury-cream/95 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 h-16 sm:h-18 lg:h-20 flex items-center justify-between gap-3 md:gap-6">
          
          {/* Brand Logo in Quiet Luxury Aesthetics */}
          <div 
            onClick={() => { setActiveTab("cover"); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
            className="cursor-pointer group flex items-center shrink-0"
            id="brand-logo"
          >
            <BrandLogo className="h-7 sm:h-8 md:h-8.5 lg:h-8.5 xl:h-9 max-w-[190px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[260px] xl:max-w-[310px] w-auto group-hover:opacity-90" variant="header" />
          </div>

          {/* Minimalist Editorial Navigation with Mega Menu Hover Triggers - Perfectly Centered & Spaced */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-9 2xl:gap-11 h-full mx-auto px-2">
            {/* 1. Problemy skóry */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={handleProblemsMenuMouseEnter}
              onMouseLeave={handleProblemsMenuMouseLeave}
            >
              <button 
                className={`text-[10.5px] xl:text-[11.5px] tracking-[0.12em] xl:tracking-[0.18em] uppercase font-mono transition-all py-2 border-b-2 flex items-center gap-1.5 cursor-pointer leading-none whitespace-nowrap ${isProblemsMenuOpen ? "border-luxury-gold text-luxury-gold font-medium" : "border-transparent text-luxury-dark/95 hover:text-luxury-dark"}`}
              >
                <span className="whitespace-nowrap">Problemy skóry</span>
                <span className={`text-[7px] xl:text-[8px] transition-transform duration-300 ${isProblemsMenuOpen ? "rotate-180 text-luxury-gold" : "text-luxury-dark/90"}`}>▼</span>
              </button>
            </div>

            {/* 2. Zabiegi & Diagnoza */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMegaMenuMouseLeave}
            >
              <button 
                className={`text-[10.5px] xl:text-[11.5px] tracking-[0.12em] xl:tracking-[0.18em] uppercase font-mono transition-all py-2 border-b-2 flex items-center gap-1.5 cursor-pointer leading-none whitespace-nowrap ${isMegaMenuOpen ? "border-luxury-gold text-luxury-gold font-medium" : "border-transparent text-luxury-dark/95 hover:text-luxury-dark"}`}
              >
                <span className="whitespace-nowrap">Zabiegi & Diagnoza</span>
                <span className={`text-[7px] xl:text-[8px] transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180 text-luxury-gold" : "text-luxury-dark/90"}`}>▼</span>
              </button>
            </div>

            {/* 3. Metoda Autorska */}
            <button 
              onClick={() => { setActiveTab("method"); setSelectedArticle(null); setSelectedTreatment(null); setIsMegaMenuOpen(false); setIsProblemsMenuOpen(false); setIsShopMenuOpen(false); setIsTrainingMenuOpen(false); }}
              className={`text-[10.5px] xl:text-[11.5px] tracking-[0.12em] xl:tracking-[0.18em] uppercase font-mono transition-all py-2 border-b-2 leading-none whitespace-nowrap ${activeTab === "method" && !isMegaMenuOpen && !isProblemsMenuOpen && !isShopMenuOpen && !isTrainingMenuOpen ? "border-luxury-gold text-luxury-gold font-medium" : "border-transparent text-luxury-dark/95 hover:text-luxury-dark"}`}
            >
              <span className="whitespace-nowrap">Metoda Autorska</span>
            </button>

            {/* 4. Sklep (Nowe Formulacje & Butik) */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={handleShopMenuMouseEnter}
              onMouseLeave={handleShopMenuMouseLeave}
            >
              <a 
                href="https://slow-skin.shop/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setIsMegaMenuOpen(false);
                  setIsProblemsMenuOpen(false);
                  setIsShopMenuOpen(false);
                  setIsTrainingMenuOpen(false);
                }}
                className={`text-[10.5px] xl:text-[11.5px] tracking-[0.12em] xl:tracking-[0.18em] uppercase font-mono transition-all py-2 border-b-2 flex items-center gap-1.5 cursor-pointer leading-none whitespace-nowrap ${activeTab === "shop" || isShopMenuOpen ? "border-luxury-gold text-luxury-gold font-medium" : "border-transparent text-luxury-dark/95 hover:text-luxury-dark"}`}
                id="nav-tab-shop"
                title="Sklep E-Commerce — slow-skin.shop"
              >
                <span className="whitespace-nowrap">Sklep</span>
                <span className={`text-[7px] xl:text-[8px] transition-transform duration-300 ${isShopMenuOpen ? "rotate-180 text-luxury-gold" : "text-luxury-dark/90"}`}>▼</span>
              </a>
            </div>

            {/* 5. Szkolenia */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={handleTrainingMenuMouseEnter}
              onMouseLeave={handleTrainingMenuMouseLeave}
            >
              <button 
                onClick={() => { setActiveTab("training"); setSelectedArticle(null); setSelectedTreatment(null); setIsMegaMenuOpen(false); setIsProblemsMenuOpen(false); setIsShopMenuOpen(false); setIsTrainingMenuOpen(false); }}
                className={`text-[10.5px] xl:text-[11.5px] tracking-[0.12em] xl:tracking-[0.18em] uppercase font-mono transition-all py-2 border-b-2 flex items-center gap-1.5 cursor-pointer leading-none whitespace-nowrap ${activeTab === "training" || isTrainingMenuOpen ? "border-luxury-gold text-luxury-gold font-medium" : "border-transparent text-luxury-dark/95 hover:text-luxury-dark"}`}
                id="nav-tab-training"
              >
                <span className="whitespace-nowrap">Szkolenia</span>
                <span className={`text-[7px] xl:text-[8px] transition-transform duration-300 ${isTrainingMenuOpen ? "rotate-180 text-luxury-gold" : "text-luxury-dark/90"}`}>▼</span>
              </button>
            </div>
          </nav>

          {/* Action & Hamburger Toggle for Tablet/Mobile - Perfectly Centered in Height */}
          <div className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0">
            {/* Moje Konto Button */}
            <button
              onClick={() => { setActiveTab("account"); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
              className={`w-9 h-9 sm:w-10 sm:h-10 border border-luxury-sand hover:border-luxury-gold transition-all duration-300 flex items-center justify-center font-medium shadow-2xs shrink-0 ${activeTab === "account" ? "bg-luxury-gold border-luxury-gold text-white" : "text-luxury-dark bg-transparent"}`}
              id="header-account-btn"
              title="Moje Konto — Slow Skin Pass™"
            >
              <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${activeTab === "account" ? "text-white" : "text-luxury-gold"}`} strokeWidth={1.5} />
            </button>

            {/* Active Phone Call Button - Exact Matching height and baseline alignment */}
            <a
              href="tel:793088854"
              className="hidden md:inline-flex px-3 xl:px-4 border border-luxury-sand text-[10px] xl:text-[11px] tracking-[0.08em] xl:tracking-[0.11em] font-mono text-luxury-dark hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300 items-center gap-1.5 xl:gap-2 font-medium h-9 sm:h-10 justify-center whitespace-nowrap leading-none shrink-0"
              id="header-phone-btn"
            >
              <Phone className="w-3.5 h-3.5 text-luxury-gold shrink-0 transition-transform duration-300" strokeWidth={1.3} />
              <span className="inline-block whitespace-nowrap leading-none">793 088 854</span>
            </a>

            <button
              onClick={() => { setActiveTab("diagnose"); setDiagnosticStep(0); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
              className={`hidden lg:inline-flex px-3.5 xl:px-5 border border-luxury-dark/80 text-[10px] xl:text-[11px] tracking-[0.12em] xl:tracking-[0.15em] uppercase font-mono transition-all rounded-none hover:bg-luxury-dark hover:text-luxury-cream h-9 sm:h-10 items-center justify-center whitespace-nowrap leading-none shrink-0 ${activeTab === "diagnose" ? "bg-luxury-gold border-luxury-gold text-white block" : ""}`}
              id="cta-diagnose-btn"
            >
              Konsultacja AI
            </button>

            {/* Elegant Hamburger Toggle for Tablet and Mobile - Exact Alignment */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-luxury-sand/60 text-luxury-dark hover:text-luxury-gold transition-colors focus:outline-none shrink-0"
              aria-label="Toggle menu"
              id="mobile-menu-toggle-btn"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Prouvé-Inspired Quiet Luxury Mega Menu Panel */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMegaMenuMouseLeave}
              className="absolute top-full left-0 w-full bg-luxury-cream border-b border-luxury-sand shadow-2xl z-50 hidden lg:block"
              style={{ minHeight: "380px" }}
              id="prouve-mega-menu"
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-8 text-left">
                {/* Kolumna 1: Rytuały Autorskie */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Rytuały Autorskie</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">01</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/zabiegi-na-twarz-jelcz-laskowice/")}
                        className="hover:text-luxury-gold text-luxury-dark/90 transition-colors duration-200 text-left block w-full uppercase tracking-wider font-mono text-[9px] font-semibold mb-2"
                      >
                        Wszystkie Zabiegi Twarzy
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/skin-readiness/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Skin Readiness™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 400 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/rosacea-calm-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Rosacea Calm Therapy™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">380 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/lift-firm-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Lift & Firm Therapy™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">500 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/healthy-glow-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Healthy Glow Therapy™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">400 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/acne-balance-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Acne Balance Therapy™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">350 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/adult-acne-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Adult Acne Therapy™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">380 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/couperose-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Couperose Therapy™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">350 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/pigment-balance-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Pigment Balance Therapy™</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">400 zł</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Kolumna 2: Lifting, Technologia & Laseroterapia */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Lifting & Laseroterapia</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">02</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="text-[9px] uppercase tracking-wider font-mono text-luxury-gold/55 border-b border-luxury-sand/20 pb-0.5 mt-1">Zabiegi liftingujące</li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/hifu-lifting/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>HIFU — Lifting Ultradźwiękowy</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 600 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/rf-microneedling/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>RF Mikroigłowa — Termolifting</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 500 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/neurolifting-nogier/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Neurolifting — Fale Nogiera</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">500 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/sonaris-pro-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark font-medium transition-colors duration-200 text-left block w-full flex justify-between items-center group"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                          <span>Sonaris Pro Therapy</span>
                        </span>
                        <span className="text-[9px] font-mono text-luxury-gold font-bold">od 180 zł</span>
                      </button>
                    </li>
                    <li className="text-[9px] uppercase tracking-wider font-mono text-luxury-gold/55 border-b border-luxury-sand/20 pb-0.5 mt-2">Światłoterapia i Lasery</li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/laser-lpl/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Terapie Laserowe LPL</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 150 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/laser-carbon/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Peeling Laserowy Węglowy</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">300 zł</span>
                      </button>
                    </li>
                    <li className="text-[9px] uppercase tracking-wider font-mono text-luxury-gold/70 border-b border-luxury-sand/20 pb-0.5 mt-2 flex justify-between items-center">
                      <span>Ciało, Plecy & Stawy</span>
                      <span className="text-[7.5px] bg-luxury-gold/20 text-luxury-gold font-bold px-1 rounded-xs uppercase">Nowość</span>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/ceragem-thermal-massage/")}
                        className="hover:text-luxury-gold text-luxury-dark font-medium transition-colors duration-200 text-left block w-full flex justify-between items-center group"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                          <span>Masaż Termiczny Ceragem</span>
                        </span>
                        <span className="text-[9px] font-mono text-luxury-gold font-bold">50 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/pst-signal-therapy/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center group"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-sand"></span>
                          <span>Terapia Sygnałem PST</span>
                        </span>
                        <span className="text-[9px] font-mono text-luxury-gold/50">od 110 zł</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Kolumna 3: Mezoterapia, Stymulatory & Oczyszczanie */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Mezoterapia & Stymulatory</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">03</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="text-[9px] uppercase tracking-wider font-mono text-luxury-gold/55 border-b border-luxury-sand/20 pb-0.5 mt-1">Mezo & Stymulacje</li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/meso-needleless/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Mezoterapia Bezigłowa</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 400 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/meso-needle/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Mezoterapia Igłowa</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 500 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/meso-gold-needle/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Mezoterapia Złotą Głowicą</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 500 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/tissue-stimulators/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Stymulatory Tkankowe</span>
                        <span className="text-[9px] font-mono text-luxury-gold/70 font-semibold">od 800 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/carboksyterapia-carboregen/")}
                        className="hover:text-luxury-gold text-luxury-dark font-medium transition-colors duration-200 text-left block w-full flex justify-between items-center group"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                          <span>Carboksyterapia CARBOregen</span>
                        </span>
                        <span className="text-[9px] font-mono text-luxury-gold font-bold">od 250 zł</span>
                      </button>
                    </li>
                    <li className="text-[9px] uppercase tracking-wider font-mono text-luxury-gold/55 border-b border-luxury-sand/20 pb-0.5 mt-2">Oczyszczanie & Dotlenianie</li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/hydrogen-purification/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Oczyszczanie Wodorowe</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">od 300 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/oxybrasion/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Oxybrazja Tlenowa</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">250 zł</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/nanobrasion/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full flex justify-between items-center"
                      >
                        <span>Nanobrazja Biorewitalizacja</span>
                        <span className="text-[9px] font-mono text-luxury-gold/40">300 zł</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Kolumna 4: Baza wiedzy & Diagnoza */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Edukacja & Diagnoza</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">04</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/baza-wiedzy/jak-odbudowac-bariere-hydrolipidowa/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full font-serif italic text-xs leading-relaxed"
                      >
                        „Jak odbudować barierę hydrolipidową i chronić mikrobiom” →
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/baza-wiedzy/skora-wrazliwa-reaktywna/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full font-serif italic text-xs leading-relaxed"
                      >
                        „Dlaczego skóra pragnie mądrej regeneracji bionomicznej” →
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/baza-wiedzy/neurolifting-dla-kogo/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full font-serif italic text-xs leading-relaxed"
                      >
                        „Neurobiologia skóry: Jak stres i kortyzol niszczą kolagen” →
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => handleLinkClick("/baza-wiedzy/jak-przygotowac-sie-do-wizyty/")}
                        className="hover:text-luxury-gold text-luxury-dark transition-colors duration-200 text-left block w-full font-serif italic text-xs leading-relaxed"
                      >
                        „Jak przygotować się do pierwszej wizyty konsultacyjnej” →
                      </button>
                    </li>

                    <li className="pt-2 border-t border-luxury-sand/30 space-y-2">
                      <button 
                        onClick={() => handleLinkClick("ai-analiza")}
                        className="bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white transition-all text-[10px] tracking-[0.1em] font-mono uppercase px-4 py-2.5 w-full block text-center"
                      >
                        Skrajny Test Skóry AI
                      </button>
                      <button 
                        onClick={() => handleLinkClick("mapa-bariery")}
                        className="bg-white border border-luxury-sand text-luxury-dark hover:bg-luxury-dark hover:text-white transition-all text-[10px] tracking-[0.1em] font-mono uppercase px-4 py-2.5 w-full block text-center font-medium"
                      >
                        Interaktywna Mapa Bariery
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Elegant Separator for row split */}
                <div className="col-span-12 border-t border-luxury-sand/30 my-2 pt-2"></div>

                {/* Bestsellery w poziomie */}
                <div className="col-span-9 space-y-4 pr-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Wyróżnione Rytuały & Nowości Gabinetu</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">05</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {([
                      TREATMENTS.find((t) => t.id === "sonaris-pro-therapy"),
                      TREATMENTS.find((t) => t.id === "ceragem-thermal-massage"),
                      TREATMENTS.find((t) => t.id === "pst-signal-therapy"),
                      TREATMENTS.find((t) => t.id === "stymulatory-tkankowe"),
                      TREATMENTS.find((t) => t.id === "skin-readiness")
                    ].filter(Boolean) as Treatment[]).map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 bg-white/70 p-2.5 border border-luxury-sand/20 hover:border-luxury-gold/50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md">
                        <button
                          onClick={() => handleLinkClick(`/${item.id}/`)}
                          className="w-full h-24 bg-luxury-cream overflow-hidden relative flex-shrink-0 cursor-pointer group/img focus:outline-none focus-visible:ring-1 focus-visible:ring-luxury-gold rounded-2xs"
                          title={`Zobacz opis zabiegu: ${item.title}`}
                        >
                          <img 
                            src={getEffectiveTreatmentImage(item)} 
                            onError={(e) => {
                              if (e.currentTarget.src !== item.image) {
                                e.currentTarget.src = item.image;
                              }
                            }}
                            alt={item.title} 
                            className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 opacity-90 transition-transform duration-550 hover:scale-105" 
                            referrerPolicy="no-referrer" 
                          />
                          {item.id === "sonaris-pro-therapy" && (
                            <span className="absolute top-0 left-0 bg-luxury-gold text-white text-[7px] px-1 py-0.5 font-mono tracking-widest uppercase font-semibold">SONARIS PRO</span>
                          )}
                          {item.id === "ceragem-thermal-massage" && (
                            <span className="absolute top-0 left-0 bg-luxury-dark text-luxury-gold border border-luxury-gold text-[7px] px-1 py-0.5 font-mono tracking-widest uppercase font-bold">CERAGEM</span>
                          )}
                          {item.id === "pst-signal-therapy" && (
                            <span className="absolute top-0 left-0 bg-luxury-dark text-luxury-gold border border-luxury-gold text-[7px] px-1 py-0.5 font-mono tracking-widest uppercase font-bold">PST</span>
                          )}
                          {item.id === "stymulatory-tkankowe" && (
                            <span className="absolute top-0 left-0 bg-luxury-gold text-white text-[7px] px-1 py-0.5 font-mono tracking-widest uppercase font-semibold">BIOSTYMULACJA</span>
                          )}
                          {item.id === "skin-readiness" && (
                            <span className="absolute top-0 left-0 bg-luxury-gold text-white text-[7px] px-1 py-0.5 font-mono tracking-widest uppercase font-semibold">DIAGNOZA</span>
                          )}
                        </button>
                        <div className="flex-1 flex flex-col justify-between text-left">
                          <div>
                            <button
                              onClick={() => handleLinkClick(`/${item.id}/`)}
                              className="font-serif text-xs leading-tight font-semibold text-luxury-dark hover:text-luxury-gold cursor-pointer text-left block w-full focus:outline-none truncate"
                            >
                              {item.title}
                            </button>
                            <p className="text-[9px] font-mono text-luxury-gold/90 mt-0.5">{item.duration} • {item.price.split("(")[0]}</p>
                          </div>
                          <button
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              setBookingTreatment(item);
                              setBookingConfirmed(false);
                              setBookingName("");
                              setBookingEmail("");
                              setBookingPhone("");
                              setBookingDate("");
                            }}
                            className="text-[8px] font-mono tracking-[0.15em] uppercase text-luxury-gold hover:text-luxury-dark transition-all flex items-center justify-between w-full mt-2 pt-1 border-t border-luxury-sand/30 font-medium"
                          >
                            <span>Zarezerwuj</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Szybkie linki (CTA) */}
                <div className="col-span-3 border-l border-luxury-sand/50 pl-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                      <span>Szybkie Akcje</span>
                      <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">06</span>
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      <button
                        onClick={() => handleLinkClick("rezerwacja-online")}
                        className="flex items-center justify-between w-full p-2 border border-luxury-sand/20 bg-white/55 hover:border-luxury-gold/40 hover:text-luxury-gold hover:bg-white transition-all text-left shadow-sm"
                      >
                        <span className="flex items-center gap-2 font-medium text-[11px] font-mono uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5 text-luxury-gold" /> Rezerwacja Wizyty
                        </span>
                        <span className="text-[8px] font-mono text-luxury-gold bg-luxury-sand/20 px-1 py-0.5">Google Cal 📅</span>
                      </button>
                      <button
                        onClick={() => handleLinkClick("ai-analiza")}
                        className="flex items-center justify-between w-full p-2 border border-luxury-sand/20 bg-white/55 hover:border-luxury-gold/40 hover:text-luxury-gold hover:bg-white transition-all text-left shadow-sm"
                      >
                        <span className="flex items-center gap-2 font-medium text-[11px] font-mono uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-luxury-gold animate-pulse" /> Konsultacja AI
                        </span>
                        <span className="text-[8px] font-mono text-luxury-gold bg-luxury-sand/20 px-1 py-0.5">Otwórz 🤖</span>
                      </button>
                      <button
                        onClick={() => handleLinkClick("mapa-bariery")}
                        className="flex items-center justify-between w-full p-2 border border-luxury-sand/20 bg-white/55 hover:border-luxury-gold/40 hover:text-luxury-gold hover:bg-white transition-all text-left shadow-sm"
                      >
                        <span className="flex items-center gap-2 font-medium text-[11px] font-mono uppercase tracking-wider">
                          <Activity className="w-3.5 h-3.5 text-luxury-gold animate-pulse" /> Mapa Bariery Skórnej
                        </span>
                        <span className="text-[8px] font-mono text-luxury-gold bg-luxury-sand/20 px-1 py-0.5">Mapa 🗺️</span>
                      </button>
                      <button
                        onClick={() => handleLinkClick("/kontakt/")}
                        className="flex items-center justify-between w-full p-2 border border-luxury-sand/20 bg-white/55 hover:border-luxury-gold/40 hover:text-luxury-gold hover:bg-white transition-all text-left shadow-sm"
                      >
                        <span className="flex items-center gap-2 font-medium text-[11px] font-mono uppercase tracking-wider">
                          <MapPin className="w-3.5 h-3.5 text-luxury-gold" /> Nasz Gabinet
                        </span>
                        <span className="text-[8px] font-mono text-luxury-gold bg-luxury-sand/20 px-1 py-0.5">Szkolna 5 📍</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-luxury-dark/90 font-mono italic text-left pt-2 border-t border-luxury-sand/20">
                    Opieka bionomiczna w harmonii z fizjologią skóry.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problemy Skóry Mega Menu Panel */}
        <AnimatePresence>
          {isProblemsMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleProblemsMenuMouseEnter}
              onMouseLeave={handleProblemsMenuMouseLeave}
              className="absolute top-full left-0 w-full bg-luxury-cream border-b border-luxury-sand shadow-2xl z-50 hidden lg:block"
              style={{ minHeight: "350px" }}
              id="problems-mega-menu"
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-8 text-left">
                {/* Column 1: Bariera i Nadwrażliwość */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Bariera & Nadwrażliwość</span>
                    </span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">01</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed text-luxury-dark/95 font-serif italic">
                    Rumień, pieczenie, nadreaktywność, naczynka i osłabiona bariera.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/rosacea-calm-therapy/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Rosacea Calm Therapy™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Rumień, pieczenie, nadreaktywność i trądzik różowaty</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/couperose-therapy/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Couperose Therapy™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Rozszerzone naczynka, teleangiektazje i gry naczyniowe</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/skin-readiness/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Skin Readiness™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Przygotowanie skóry do regeneracji i audyt bariery</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Owal i Zmarszczki */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Utrata Jędrności & Owal</span>
                    </span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">02</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed text-luxury-dark/95 font-serif italic">
                    Utrata gęstości, opadający owal twarzy, wiotkość tkanek i zmarszczki.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/lift-firm-therapy/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Lift & Firm Therapy™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Utrata jędrności, owal, gęstość i lifting powięziowy</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/neurolifting-nogier/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Neurolifting — Fale Nogiera</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Fotobiomodulacja neurokomórkowa i stymulacja powięzi</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/hifu-lifting/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>HIFU — Lifting SMAS</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Bezinwazyjny lifting głębokiej powięzi mięśniowej ultradźwiękami</p>
                    </div>
                    <div className="group cursor-pointer pt-1 border-t border-luxury-sand/20" onClick={() => handleLinkClick("/ceragem-thermal-massage/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                          <span>Napięcie pleców (Masaż Ceragem)</span>
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Ciepło i automatyczny masaż na łóżku Ceragem VE — 50 zł</p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Fotostarzenie i Blask */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Fotostarzenie & Koloryt</span>
                    </span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">03</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed text-luxury-dark/95 font-serif italic">
                    Skóra zmęczona, szara, nienatleniona, z melasmą i przebarwieniami.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/healthy-glow-therapy/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Healthy Glow Therapy™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Skóra zmęczona, szara, odwodniona — promienny blask</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/pigment-balance-therapy/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Pigment Balance Therapy™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Przebarwienia, melasma, plamy posłoneczne i nierówny koloryt</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/laser-carbon/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Peeling Laserowy Węglowy</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Oczyszczanie laserowe z maską węglową, dające natychmiastowy blask</p>
                    </div>
                    <div className="group cursor-pointer pt-1 border-t border-luxury-sand/20" onClick={() => handleLinkClick("/carboksyterapia-carboregen/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                          <span>Carboksyterapia CARBOregen</span>
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Dotlenienie CO₂, redukcja cieni pod oczami i efekt Bohra — od 250 zł</p>
                    </div>
                  </div>
                </div>

                {/* Column 4: Trądzik i Zanieczyszczenia */}
                <div className="col-span-3 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Trądzik & Zanieczyszczenia</span>
                    </span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">04</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed text-luxury-dark/95 font-serif italic">
                    Zmiany zapalne, grudki, zaskórniki, trądzik dorosłych i skóra stresowa.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/acne-balance-therapy/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Acne Balance Therapy™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Zmiany zapalne, grudki, zaskórniki i nadmiar sebum</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/adult-acne-therapy/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Adult Acne Therapy™</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Trądzik dorosłych, skóra stresowa i stany mikrozapalne</p>
                    </div>
                    <div className="group cursor-pointer" onClick={() => handleLinkClick("/hydrogen-purification/")}>
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                        <span>Oczyszczanie Wodorowe</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                      </p>
                      <p className="text-[10px] text-luxury-dark/90 mt-0.5 font-mono leading-tight">Aktywna terapia wodorem eliminującym wolne rodniki tlenowe</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MEGAMENU: SKLEP & AUTORSKIE PRODUKTY BIONOMICZNE */}
          {isShopMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleShopMenuMouseEnter}
              onMouseLeave={handleShopMenuMouseLeave}
              className="absolute top-full left-0 w-full bg-luxury-cream border-b border-luxury-sand shadow-2xl z-50 hidden lg:block"
              style={{ minHeight: "380px" }}
              id="shop-mega-menu"
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-8 text-left">
                {/* Column 1: Autorskie Formulacje */}
                <div className="col-span-4 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Autorskie Formulacje Bionomiczne</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">01</span>
                  </h4>
                  <div className="space-y-3.5 pt-1">
                    <div 
                      className="group cursor-pointer p-3 bg-white/70 hover:bg-white border border-luxury-sand/40 hover:border-luxury-gold transition-all"
                      onClick={() => {
                        setActiveTab("shop");
                        setIsShopMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                          SKIN INFUZION™ BALANCE CREAM
                        </p>
                        <span className="font-mono text-[10px] text-luxury-gold font-semibold">245 PLN</span>
                      </div>
                      <p className="text-[10px] text-luxury-dark/95 mt-1 font-mono leading-tight">
                        50 ml • Krem nawilżający na dzień i noc. Ektoina, skwalan, NAG, oleje roślinne. Badanie ORCIDEO.
                      </p>
                    </div>

                    <div 
                      className="group cursor-pointer p-3 bg-white/70 hover:bg-white border border-luxury-sand/40 hover:border-luxury-gold transition-all"
                      onClick={() => {
                        setActiveTab("shop");
                        setIsShopMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                          SKIN INFUZION™ RESET FOAM
                        </p>
                        <span className="font-mono text-[10px] text-luxury-gold font-semibold">160 PLN</span>
                      </div>
                      <p className="text-[10px] text-luxury-dark/95 mt-1 font-mono leading-tight">
                        150 ml • Pianka do mycia twarzy z NMF, gliceryną i fermentami. Czystość bez ściągnięcia.
                      </p>
                    </div>

                    <div 
                      className="group cursor-pointer p-3 bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/40 transition-all"
                      onClick={() => {
                        setActiveTab("shop");
                        setIsShopMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                          Zestaw RESET + BALANCE (Box Prezentowy)
                        </p>
                        <span className="font-mono text-[10px] text-luxury-gold font-bold">385 PLN</span>
                      </div>
                      <p className="text-[10px] text-luxury-dark/95 mt-1 font-mono leading-tight">
                        Dwa kroki. Jeden rytuał (150 ml + 50 ml) w projektowanym opakowaniu prezentowym.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Standard Czystej Bionomii */}
                <div className="col-span-4 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Filozofia Bionomiczna Formuł</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">02</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-luxury-dark font-light pt-1">
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>0% Emulgatorów Syntetycznych:</strong> Membrana lipidowa naśladuje naturalny cement międzykomórkowy.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>Bezpieczeństwo Po Zabiegach:</strong> Formuły kojące po laserach, RF mikroigłowej i peelingach chemicznych.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>Próżniowe Opakowania Airless:</strong> Zero kontaktu z powietrzem, maksymalna czystość mikrobiologiczna.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>Darmowa Dostawa od 250 PLN:</strong> Szybka wysyłka kurierska lub odbiór osobisty w Jelczu-Laskowicach.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveTab("shop");
                        setIsShopMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest hover:underline flex items-center gap-1 font-semibold"
                    >
                      Przejdź do pełnego opisu produktów w aplikacji →
                    </button>
                  </div>
                </div>

                {/* Column 3: Dedykowany Portal E-Commerce (Zewnętrzny Sklep) */}
                <div className="col-span-4 space-y-4 bg-white/80 p-6 border border-luxury-sand flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-semibold block">
                      OFICJALNY PORTAL E-COMMERCE
                    </span>
                    <h5 className="font-serif text-lg text-luxury-dark font-light leading-snug">
                      Dedykowana Platforma Zakupowa Online
                    </h5>
                    <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                      Nasz sklep internetowy działa pod adresem <strong className="text-luxury-dark">slow-skin.shop</strong> jako zintegrowany portal zakupowy z bezpiecznymi płatnościami online, fakturami B2B i szybką wysyłką.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href="https://slow-skin.shop/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-luxury-dark hover:bg-luxury-gold hover:text-luxury-dark text-luxury-cream transition-all duration-300 py-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Otwórz Sklep Online (slow-skin.shop)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-luxury-gold" />
                    </a>
                    <button
                      onClick={() => {
                        setActiveTab("shop");
                        setIsShopMenuOpen(false);
                        const el = document.getElementById("shop-preorder-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full bg-white border border-luxury-sand hover:border-luxury-gold text-luxury-dark text-[10px] font-mono tracking-[0.15em] uppercase py-2.5 transition-colors text-center"
                    >
                      Rezerwacja do Odbioru w Gabinecie
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MEGAMENU: SZKOLENIA I WSPÓŁPRACA B2B DLA GABINETÓW */}
          {isTrainingMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={handleTrainingMenuMouseEnter}
              onMouseLeave={handleTrainingMenuMouseLeave}
              className="absolute top-full left-0 w-full bg-luxury-cream border-b border-luxury-sand shadow-2xl z-50 hidden lg:block"
              style={{ minHeight: "380px" }}
              id="training-mega-menu"
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-8 text-left">
                {/* Column 1: Programy Edukacyjne */}
                <div className="col-span-4 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Programy Edukacyjne & Licencje</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">01</span>
                  </h4>
                  <div className="space-y-3 pt-1">
                    <div 
                      className="group cursor-pointer p-3 bg-white/70 hover:bg-white border border-luxury-sand/40 hover:border-luxury-gold transition-all"
                      onClick={() => {
                        setActiveTab("training");
                        setIsTrainingMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                        Akredytacja Gabinetu Partnerskiego
                      </p>
                      <p className="text-[10px] text-luxury-dark/95 mt-0.5 font-mono leading-tight">
                        Pełna licencja terytorialna, transfer know-how, procedury zabiegowe i opieka merytoryczna.
                      </p>
                    </div>

                    <div 
                      className="group cursor-pointer p-3 bg-white/70 hover:bg-white border border-luxury-sand/40 hover:border-luxury-gold transition-all"
                      onClick={() => {
                        setActiveTab("training");
                        setIsTrainingMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                        Masterclass: Neuro-Modeling & Fale Nogiera
                      </p>
                      <p className="text-[10px] text-luxury-dark/95 mt-0.5 font-mono leading-tight">
                        2-dniowe warsztaty praktyczne 1:1 z biologicznego liftingu manualnego i akupresury twarzy.
                      </p>
                    </div>

                    <div 
                      className="group cursor-pointer p-3 bg-white/70 hover:bg-white border border-luxury-sand/40 hover:border-luxury-gold transition-all"
                      onClick={() => {
                        setActiveTab("training");
                        setIsTrainingMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                        Warsztat: Diagnostyka Nati V3 & Terapia Bariery
                      </p>
                      <p className="text-[10px] text-luxury-dark/95 mt-0.5 font-mono leading-tight">
                        Prowadzenie trudnych dermatoz, trądziku różowatego i układanie Beauty Planów bionomicznych.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Korzyści Biznesowe dla Gabinetu */}
                <div className="col-span-4 space-y-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-2 flex justify-between items-center">
                    <span>Dlaczego Warto Dołączyć do Sieci?</span>
                    <span className="text-[8px] font-mono text-luxury-gold/50 font-normal">02</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-luxury-dark font-light pt-1">
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>Wyłączność Terytorialna:</strong> Gwarancja braku konkurencji metody Slow Skin w Twoim rejonie.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>Dofinansowania KFS i BUR:</strong> Pomagamy w formalnościach (nawet do 80-100% wartości szkolenia).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>Certyfikaty Jakości:</strong> Imienne dokumenty potwierdzające kwalifikacje i standard Quiet Luxury.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-luxury-gold font-mono font-bold">✓</span>
                      <span><strong>Wsparcie Marketingowe:</strong> Obecność na ogólnopolskiej mapie salonów i materiały graficzne.</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setActiveTab("training");
                        setIsTrainingMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest hover:underline flex items-center gap-1 font-semibold"
                    >
                      Sprawdź szczegóły oferty szkoleniowej w aplikacji →
                    </button>
                  </div>
                </div>

                {/* Column 3: Dedykowany Portal Szkoleniowy (Zewnętrzny Portal B2B) */}
                <div className="col-span-4 space-y-4 bg-white/80 p-6 border border-luxury-sand flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-semibold block">
                      PORTAL SZKOLENIOWY B2B
                    </span>
                    <h5 className="font-serif text-lg text-luxury-dark font-light leading-snug">
                      E-Learning & Platforma Wiedzy B2B
                    </h5>
                    <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                      Dedykowany portal szkoleniowy <strong className="text-luxury-dark">szkolenia.slowskinconcept.pl</strong> gromadzi instruktaże wideo 4K, protokoły krok po kroku oraz materiały edukacyjne dla personelu.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href="https://szkolenia.slowskinconcept.pl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-luxury-dark hover:bg-luxury-gold hover:text-luxury-dark text-luxury-cream transition-all duration-300 py-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Przejdź do Portalu Szkoleniowego</span>
                      <ArrowRight className="w-3.5 h-3.5 text-luxury-gold" />
                    </a>
                    <button
                      onClick={() => {
                        setActiveTab("training");
                        setIsTrainingMenuOpen(false);
                        const el = document.getElementById("training-application-form");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full bg-white border border-luxury-sand hover:border-luxury-gold text-luxury-dark text-[10px] font-mono tracking-[0.15em] uppercase py-2.5 transition-colors text-center"
                    >
                      Zgłoś Gabinet / Sprawdź Rejon
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile/Tablet Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-y-auto max-h-[calc(100vh-4rem)] border-b border-luxury-sand bg-luxury-cream sticky top-16 sm:top-18 lg:top-20 z-30 shadow-lg"
            id="mobile-menu-drawer"
          >
            <div className="px-6 md:px-12 py-6 space-y-6 flex flex-col text-left">
              
              {/* Brand Logo in Mobile Drawer */}
              <div 
                onClick={() => { setActiveTab("cover"); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
                className="cursor-pointer pb-2 border-b border-luxury-sand/30"
              >
                <BrandLogo className="h-7 sm:h-8 max-w-[200px] w-auto object-left" variant="drawer" />
              </div>

              <div className="space-y-4">
                <p className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase border-b border-luxury-dark/10 pb-2">Nawigacja i Menu</p>
                <div className="flex flex-col space-y-4">
                  {/* Basic Links */}
                  <button 
                    onClick={() => { setActiveTab("account"); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
                    className={`text-left font-serif text-lg tracking-tight transition-colors flex justify-between items-center border-b border-luxury-sand/20 pb-2 ${activeTab === "account" ? "text-luxury-gold font-medium" : "text-luxury-dark hover:text-luxury-gold"}`}
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5 text-luxury-gold" /> Moje Konto • Slow Skin Pass™
                    </span>
                    <span className="font-mono text-[8px] text-white bg-luxury-gold px-2 py-0.5 uppercase tracking-widest font-medium">Strefa Klientki</span>
                  </button>

                  {/* Menu "Problemy skóry" Accordion */}
                  <div className="border-b border-luxury-sand/30 pb-2 pt-1">
                    <button 
                      onClick={() => setIsMobileProblemyOpen(!isMobileProblemyOpen)}
                      className="w-full text-left font-serif text-lg tracking-wider text-luxury-dark flex justify-between items-center"
                    >
                      <span className={isMobileProblemyOpen ? "text-luxury-gold font-medium" : ""}>1. Problemy skóry</span>
                      <ChevronRight className={`w-4 h-4 text-luxury-gold transition-transform duration-300 ${isMobileProblemyOpen ? "rotate-90" : ""}`} />
                    </button>
                    {isMobileProblemyOpen && (
                      <div className="pl-4 py-2 mt-2 flex flex-col space-y-2.5 text-sm border-l border-luxury-sand/30">
                        <button onClick={() => handleLinkClick("/terapia-skory-wrazliwej-i-reaktywnej/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Skóra piecze i szczypie</button>
                        <button onClick={() => handleLinkClick("/cera-naczynkowa-rumien/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Rumień i zaczerwienienie</button>
                        <button onClick={() => handleLinkClick("/odbudowa-bariery-hydrolipidowej/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Suchość i ściągnięcie</button>
                        <button onClick={() => handleLinkClick("/neurolifting/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Utrata jędrności</button>
                        <button onClick={() => handleLinkClick("/neurolifting/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Zmarszczki mimiczne</button>
                        <button onClick={() => handleLinkClick("/meso-remodeling/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Skóra zmęczona i szara</button>
                        <button onClick={() => handleLinkClick("/carboksyterapia-carboregen/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold flex items-center justify-between">
                          <span>Cienie pod oczami & dotlenienie (CARBOregen)</span>
                          <span className="font-mono text-[9px] text-luxury-gold font-bold">od 250 zł</span>
                        </button>
                        <button onClick={() => handleLinkClick("/ceragem-thermal-massage/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold font-medium flex items-center justify-between">
                          <span>Napięcie i sztywność pleców (Ceragem)</span>
                          <span className="font-mono text-[9px] text-luxury-gold font-bold">50 zł</span>
                        </button>
                        <button onClick={() => handleLinkClick("/pst-signal-therapy/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Bóle i regeneracja stawów (PST)</button>
                        <button onClick={() => handleLinkClick("/pierwsza-wizyta-diagnostyka-skory/")} className="text-left text-luxury-gold hover:text-luxury-dark font-medium">Nie wiem, od czego zacząć →</button>
                      </div>
                    )}
                  </div>

                  {/* Menu "Zabiegi i Diagnoza" Accordion */}
                  <div className="border-b border-luxury-sand/30 pb-2">
                    <button 
                      onClick={() => setIsMobileZabiegiOpen(!isMobileZabiegiOpen)}
                      className="w-full text-left font-serif text-lg tracking-wider text-luxury-dark flex justify-between items-center"
                    >
                      <span className={isMobileZabiegiOpen ? "text-luxury-gold font-medium" : ""}>2. Zabiegi i diagnoza</span>
                      <ChevronRight className={`w-4 h-4 text-luxury-gold transition-transform duration-300 ${isMobileZabiegiOpen ? "rotate-90" : ""}`} />
                    </button>
                    {isMobileZabiegiOpen && (
                      <div className="pl-4 py-3 mt-2 flex flex-col space-y-3 text-xs border-l border-luxury-sand/30">
                        <button onClick={() => handleLinkClick("/zabiegi-na-twarz-jelcz-laskowice/")} className="text-left text-luxury-dark hover:text-luxury-gold font-mono text-[10px] uppercase tracking-wider font-semibold border-b border-luxury-sand/20 pb-1">Wszystkie Zabiegi Twarzy</button>
                        
                        <div className="space-y-1">
                          <p className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-semibold">01 Terapie Slow Skin Concept™</p>
                          <button onClick={() => handleLinkClick("/skin-readiness/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Skin Readiness™ (Przygotowanie)</button>
                          <button onClick={() => handleLinkClick("/rosacea-calm-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Rosacea Calm Therapy™ (Rumień)</button>
                          <button onClick={() => handleLinkClick("/lift-firm-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Lift & Firm Therapy™ (Jędrność)</button>
                          <button onClick={() => handleLinkClick("/healthy-glow-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Healthy Glow Therapy™ (Blask)</button>
                          <button onClick={() => handleLinkClick("/acne-balance-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Acne Balance Therapy™ (Zapalenia)</button>
                          <button onClick={() => handleLinkClick("/adult-acne-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Adult Acne Therapy™ (Trądzik dorosłych)</button>
                          <button onClick={() => handleLinkClick("/couperose-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Couperose Therapy™ (Naczynka)</button>
                          <button onClick={() => handleLinkClick("/pigment-balance-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Pigment Balance Therapy™ (Przebarwienia)</button>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-luxury-sand/10">
                          <p className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-semibold">02 Aparatura & Lifting</p>
                          <button onClick={() => handleLinkClick("/hifu-lifting/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">HIFU — Lifting Bez Skalpela</button>
                          <button onClick={() => handleLinkClick("/rf-microneedling/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">RF Mikroigłowa (Termolifting)</button>
                          <button onClick={() => handleLinkClick("/neurolifting-nogier/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Neurolifting — Fale Nogiera</button>
                          <button onClick={() => handleLinkClick("/sonaris-pro-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1 font-medium flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                              <span>Sonaris Pro Therapy</span>
                            </span>
                            <span className="font-mono text-[9px] text-luxury-gold font-bold">od 180 zł</span>
                          </button>
                          <button onClick={() => handleLinkClick("/laser-lpl/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Terapie Laserowe LPL</button>
                          <button onClick={() => handleLinkClick("/laser-carbon/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Peeling Laserowy Węglowy</button>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-luxury-sand/10">
                          <p className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-semibold">03 Mezoterapia & Oczyszczanie</p>
                          <button onClick={() => handleLinkClick("/meso-needleless/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Mezoterapia Bezigłowa</button>
                          <button onClick={() => handleLinkClick("/meso-needle/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Mezoterapia Igłowa</button>
                          <button onClick={() => handleLinkClick("/meso-gold-needle/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Mezoterapia Złotą Głowicą</button>
                          <button onClick={() => handleLinkClick("/tissue-stimulators/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Stymulatory Tkankowe</button>
                          <button onClick={() => handleLinkClick("/carboksyterapia-carboregen/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1 font-medium flex justify-between items-center">
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                              <span>Carboksyterapia CARBOregen</span>
                            </span>
                            <span className="font-mono text-[9px] text-luxury-gold font-bold">od 250 zł</span>
                          </button>
                          <button onClick={() => handleLinkClick("/hydrogen-purification/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Oczyszczanie Wodorowe</button>
                          <button onClick={() => handleLinkClick("/oxybrasion/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Oxybrazja Tlenowa</button>
                          <button onClick={() => handleLinkClick("/nanobrasion/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1">Nanobrazja Biorewitalizacja</button>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-luxury-sand/10">
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-[9px] text-luxury-gold uppercase tracking-widest font-semibold">04 Ciało, Plecy & Stawy</p>
                            <span className="text-[7px] font-mono uppercase bg-luxury-gold text-white px-1.5 py-0.2 rounded-xs font-bold">Nowość</span>
                          </div>
                          <button onClick={() => handleLinkClick("/ceragem-thermal-massage/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1 font-medium flex justify-between items-center">
                            <span>Masaż Termiczny Ceragem (Łóżko VE)</span>
                            <span className="font-mono text-[9px] text-luxury-gold font-bold">50 zł</span>
                          </button>
                          <button onClick={() => handleLinkClick("/pst-signal-therapy/")} className="text-left text-luxury-dark hover:text-luxury-gold block w-full pl-1 flex justify-between items-center">
                            <span>Terapia Sygnałem PST (Stawy & Kręgosłup)</span>
                            <span className="font-mono text-[9px] text-luxury-dark/60">od 110 zł</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-luxury-sand/20">
                          <button onClick={() => handleLinkClick("/slow-skin-first/")} className="text-left text-luxury-gold hover:text-luxury-dark font-medium block">Diagnostyka & Konsultacje o klinice →</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => { setActiveTab("diagnose"); setDiagnoseSubTab("barrierMap"); setDiagnosticStep(0); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
                    className={`text-left font-serif text-lg tracking-wider transition-colors flex justify-between items-center py-1 ${activeTab === "diagnose" && diagnoseSubTab === "barrierMap" ? "text-luxury-gold font-medium" : "text-luxury-dark hover:text-luxury-gold"}`}
                  >
                    <span>Mapa Bariery Skórnej</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab("method"); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
                    className={`text-left font-serif text-lg tracking-wider transition-colors flex justify-between items-center py-1 ${activeTab === "method" ? "text-luxury-gold font-medium" : "text-luxury-dark hover:text-luxury-gold"}`}
                  >
                    <span>3. Metoda Autorska</span>
                  </button>

                  {/* 4. Sklep */}
                  <div className="border-b border-luxury-sand/30 pb-2 pt-1">
                    <a 
                      href="https://slow-skin.shop/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left font-serif text-lg tracking-wider transition-colors flex justify-between items-center py-1 text-luxury-dark hover:text-luxury-gold"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>4. Sklep</span>
                        <ExternalLink className="w-3.5 h-3.5 text-luxury-gold inline" />
                      </span>
                      <span className="font-mono text-[8px] text-white bg-luxury-gold px-2 py-0.5 uppercase tracking-widest font-bold">slow-skin.shop ↗</span>
                    </a>
                    <div className="pl-4 py-1.5 flex flex-col space-y-1.5 text-xs border-l border-luxury-sand/30">
                      <a 
                        href="https://slow-skin.shop/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-left text-luxury-gold font-mono text-[10px] uppercase font-semibold flex items-center gap-1"
                      >
                        Przejdź do oficjalnego sklepu internetowego ↗
                      </a>
                      <button 
                        onClick={() => { setActiveTab("shop"); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }} 
                        className="text-left text-luxury-dark/95 hover:text-luxury-gold"
                      >
                        Katalog formulacji w aplikacji
                      </button>
                    </div>
                  </div>

                  {/* 5. Szkolenia i współpraca (Portal B2B) */}
                  <div className="border-b border-luxury-sand/30 pb-2 pt-1">
                    <button 
                      onClick={() => { setActiveTab("training"); setSelectedArticle(null); setSelectedTreatment(null); setIsMobileMenuOpen(false); }}
                      className={`w-full text-left font-serif text-lg tracking-wider transition-colors flex justify-between items-center ${activeTab === "training" ? "text-luxury-gold font-medium" : "text-luxury-dark hover:text-luxury-gold"}`}
                    >
                      <span>5. Szkolenia</span>
                      <span className="font-mono text-[8px] text-white bg-luxury-dark px-2 py-0.5 uppercase tracking-widest font-bold">Akademia</span>
                    </button>
                    <div className="pl-4 py-2 mt-1 flex flex-col space-y-2 text-xs border-l border-luxury-sand/30">
                      <button onClick={() => { setActiveTab("training"); setIsMobileMenuOpen(false); }} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Akredytacja Gabinetu (Licencja & Wyłączność)</button>
                      <button onClick={() => { setActiveTab("training"); setIsMobileMenuOpen(false); }} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Masterclass: Neuro-Modeling & Fale Nogiera</button>
                      <a href="https://szkolenia.slowskinconcept.pl" target="_blank" rel="noopener noreferrer" className="text-left text-luxury-gold font-mono text-[10px] uppercase font-semibold">Portal Szkoleniowy ↗</a>
                    </div>
                  </div>

                  {/* Menu "Wiedza" Accordion */}
                  <div className="border-b border-luxury-sand/30 pb-2 pt-1">
                    <button 
                      onClick={() => setIsMobileWiedzaOpen(!isMobileWiedzaOpen)}
                      className="w-full text-left font-serif text-lg tracking-wider text-luxury-dark flex justify-between items-center"
                    >
                      <span className={isMobileWiedzaOpen ? "text-luxury-gold font-medium" : ""}>Baza Wiedzy</span>
                      <ChevronRight className={`w-4 h-4 text-luxury-gold transition-transform duration-300 ${isMobileWiedzaOpen ? "rotate-90" : ""}`} />
                    </button>
                    {isMobileWiedzaOpen && (
                      <div className="pl-4 py-2 mt-2 flex flex-col space-y-2.5 text-sm border-l border-luxury-sand/30">
                        <button onClick={() => handleLinkClick("/baza-wiedzy/jak-odbudowac-bariere-hydrolipidowa/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Jak odbudować barierę hydrolipidową</button>
                        <button onClick={() => handleLinkClick("/baza-wiedzy/skora-wrazliwa-reaktywna/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Skóra wrażliwa — od czego zacząć</button>
                        <button onClick={() => handleLinkClick("/baza-wiedzy/neurolifting-dla-kogo/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Neurolifting — dla kogo</button>
                        <button onClick={() => handleLinkClick("/baza-wiedzy/jak-przygotowac-sie-do-wizyty/")} className="text-left text-luxury-dark/95 hover:text-luxury-gold">Jak przygotować się do pierwszej wizyty</button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Mobile CTA inside Drawer */}
              <div className="pt-6 border-t border-luxury-sand space-y-3">
                <p className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase">Szybkie Akcje & Kontakt</p>
                <div className="flex flex-col space-y-2">
                  <a
                    href="https://wa.me/48793088854?text=Dzie%C5%84%20dobry!%20Chcia%C5%82(a)bym%20zapyta%C4%87%20o%20zabiegi%20lub%20rezerwacj%C4%99%20w%20Instytucie%20Slow%20Skin%20Concept."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4 text-white" strokeWidth={1.5} /> WhatsApp: 793 088 854
                  </a>
                  <a
                    href="tel:793088854"
                    className="w-full text-center py-3 bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-luxury-gold" strokeWidth={1.5} /> Zadzwoń: 793 088 854
                  </a>
                  <button
                    onClick={() => handleLinkClick("rezerwacja-online")}
                    className="w-full text-center py-3 border border-luxury-dark text-luxury-dark hover:bg-luxury-dark hover:text-luxury-cream text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-luxury-gold" /> Umów wizytę (Google Calendar)
                  </button>
                  <button
                    onClick={() => handleLinkClick("ai-analiza")}
                    className="w-full text-center py-3 border border-luxury-dark text-luxury-dark hover:bg-luxury-dark hover:text-luxury-cream text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-luxury-gold animate-pulse" /> Analiza skóry AI (Test)
                  </button>
                  <button
                    onClick={() => handleLinkClick("mapa-bariery")}
                    className="w-full text-center py-3 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 font-medium shadow-xs"
                  >
                    <Activity className="w-4 h-4 text-luxury-gold animate-pulse" /> Interaktywna Mapa Bariery
                  </button>
                  <button
                    onClick={() => handleLinkClick("/kontakt/")}
                    className="w-full text-center py-3 bg-transparent text-luxury-dark hover:text-luxury-gold text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-luxury-gold" /> Kontakt & Gabinet
                  </button>
                </div>
                <div className="text-center pt-2 text-[10px] text-luxury-dark/90 font-mono">
                  Jelcz-Laskowice, ul. Szkolna 5
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frontpage Hero Fullscreen Image Section */}
      <AnimatePresence mode="wait">
        {activeTab === "cover" && (
          <motion.div
            key="home-hero-fullscreen"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative h-[75vh] md:h-[82vh] lg:h-[88vh] min-h-[500px] bg-[#FAF8F5] overflow-visible flex flex-col justify-end border-b border-luxury-sand/50 shadow-xs"
            id="home-hero-fullscreen-section"
          >
            {/* Background Image Container with high clarity and subtle contrast overlay */}
            <div 
              className="absolute inset-0 z-0 bg-[#F7F4EE] overflow-hidden"
              onDragOver={(e) => {
                e.preventDefault();
                setIsHeroDragOver(true);
              }}
              onDragLeave={() => setIsHeroDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsHeroDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleHeroFileChange(e.dataTransfer.files[0]);
                }
              }}
            >
              <input
                type="file"
                ref={heroFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleHeroFileChange(e.target.files[0]);
                  }
                }}
              />
              <img 
                src={heroCustomUrl}
                onError={() => {
                  if (heroCustomUrl !== "/src/assets/images/hero_skin_examination_lamp_1791109949357.jpg") {
                    setHeroCustomUrl("/src/assets/images/hero_skin_examination_lamp_1791109949357.jpg");
                  }
                }}
                alt="Profesjonalna ocena skóry pod lupą — Slow Skin Concept"
                loading="eager"
                onLoad={() => setIsHeroLoaded(true)}
                className="w-full h-full object-cover object-right md:object-center transition-all duration-[1500ms] ease-out hover:scale-[1.01]"
                style={{
                  filter: isHeroLoaded ? "blur(0px)" : "blur(16px)",
                  opacity: isHeroLoaded ? 0.94 : 0.1,
                  transform: isHeroLoaded ? "scale(1)" : "scale(1.02)",
                }}
                referrerPolicy="no-referrer"
                id="hero-img-element"
              />
              {/* Subtle directional gradients ensuring pristine contrast and high image clarity */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/90 via-[#FAF8F5]/55 via-45% to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/30 via-25% to-transparent pointer-events-none" />

              {/* Drag & drop overlay indicator */}
              {isHeroDragOver && (
                <div className="absolute inset-0 bg-luxury-dark/40 backdrop-blur-xs flex items-center justify-center z-20 border-4 border-dashed border-luxury-gold pointer-events-none">
                  <div className="bg-white p-6 shadow-xl text-center space-y-2">
                    <Camera className="w-10 h-10 text-luxury-gold mx-auto animate-bounce" />
                    <p className="font-serif text-lg text-luxury-dark font-medium">Upuść tutaj swoje oryginalne zdjęcie</p>
                    <p className="font-mono text-xs text-luxury-dark/70">Plik zostanie wstawiony bez żadnych zmian ani kompresji</p>
                  </div>
                </div>
              )}

              {/* Discreet button to select and upload original photo */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => heroFileInputRef.current?.click()}
                  title="Wstaw własny oryginalny plik zdjęcia (np. Profesjonalna ocena skóry pod lupą.png)"
                  className="bg-white/90 hover:bg-white text-luxury-dark hover:text-luxury-gold border border-luxury-sand/80 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all shadow-xs rounded-2xs flex items-center gap-1.5 cursor-pointer backdrop-blur-xs font-semibold"
                >
                  <Camera className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                  <span>{isUploadingHero ? "Wstawianie..." : "Wstaw oryginalny plik zdjęcia"}</span>
                </button>
              </div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-14 md:pb-22 text-left flex flex-col items-start gap-4 md:gap-5">
              
              {/* Elegant Subtitle / Categories with backdrop pills for crystal clear readability */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-mono text-[10px] md:text-[12px] tracking-[0.22em] text-[#846b41] uppercase font-bold select-none flex flex-wrap items-center gap-2"
              >
                <span className="bg-white/80 backdrop-blur-xs px-2.5 py-0.5 border border-luxury-sand/60 shadow-2xs">diagnostyka</span>
                <span className="text-luxury-dark/40">&middot;</span>
                <span className="bg-white/80 backdrop-blur-xs px-2.5 py-0.5 border border-luxury-sand/60 shadow-2xs">regeneracja</span>
                <span className="text-luxury-dark/40">&middot;</span>
                <span className="bg-white/80 backdrop-blur-xs px-2.5 py-0.5 border border-luxury-sand/60 shadow-2xs">naturalny slow-aging</span>
                <span className="text-luxury-dark/40">&middot;</span>
                <span className="bg-white/80 backdrop-blur-xs px-2.5 py-0.5 border border-luxury-sand/60 shadow-2xs">indywidualne zabiegi twarzy</span>
              </motion.div>

              {/* Classic Serif Title with enhanced contrast */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#1a1917] leading-tight tracking-[0.08em] uppercase select-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.85)]"
              >
                Slow Skin Concept<span className="text-xs md:text-sm lg:text-base align-super text-[#846b41] ml-1 font-sans font-bold">TM</span>
              </motion.h1>

              {/* Tagline Statement with crisp contrast */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg md:text-xl lg:text-2xl text-[#24221f] max-w-3xl font-medium tracking-wide leading-relaxed select-none font-serif italic drop-shadow-[0_1px_3px_rgba(255,255,255,0.85)]"
              >
                Biologiczna terapia skóry, która zaczyna się od jej zrozumienia
              </motion.p>

              {/* Global Glass Search Engine */}
              {(() => {
                const query = globalSearchQuery.toLowerCase().trim();
                const matchedTreatments = query ? TREATMENTS.filter((t) => {
                  return t.title.toLowerCase().includes(query) ||
                         t.subtitle.toLowerCase().includes(query) ||
                         (t.description && t.description.toLowerCase().includes(query)) ||
                         (t.focus && t.focus.toLowerCase().includes(query)) ||
                         (t.indications && t.indications.some(ind => ind.toLowerCase().includes(query)));
                }).slice(0, 4) : [];

                const matchedProblems = query ? COMMON_PROBLEMS.filter((prob) => {
                  return prob.name.toLowerCase().includes(query) ||
                         prob.description.toLowerCase().includes(query) ||
                         prob.keywords.some(keyword => query.includes(keyword) || keyword.includes(query));
                }).slice(0, 3) : [];

                const matchedArticles = query ? ARTICLES.filter((art) => {
                  return art.title.toLowerCase().includes(query) ||
                         art.category.toLowerCase().includes(query);
                }).slice(0, 3) : [];

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="w-full max-w-4xl relative mt-2 z-30"
                  >
                    <div className="relative rounded-none overflow-hidden backdrop-blur-md bg-white/95 hover:bg-white focus-within:bg-white border border-luxury-sand/80 focus-within:border-luxury-gold transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-4 md:p-5">
                      {/* Input row */}
                      <div className="flex items-center gap-3.5">
                        <Search className="w-5 h-5 text-luxury-gold shrink-0" strokeWidth={1.5} />
                        <input
                          type="text"
                          placeholder="Wyszukaj zabieg, opisz swój problem skóry lub wpisz objawy... (np. suchość, zmarszczki, trądzik)"
                          value={globalSearchQuery}
                          onChange={(e) => setGlobalSearchQuery(e.target.value)}
                          className="w-full bg-transparent border-none text-sm md:text-base text-luxury-dark placeholder:text-luxury-dark/50 font-serif focus:outline-none focus:ring-0 italic py-1.5"
                        />
                        {globalSearchQuery && (
                          <button
                            onClick={() => setGlobalSearchQuery("")}
                            className="text-luxury-dark/60 hover:text-luxury-gold transition-colors text-[10px] uppercase font-mono tracking-widest cursor-pointer focus:outline-none flex items-center gap-1 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Wyczyść</span>
                          </button>
                        )}
                      </div>

                      {/* Small elegant description below input */}
                      <div className="text-[10px] text-luxury-dark/75 font-mono tracking-wider mt-2.5 uppercase select-none flex flex-wrap gap-2 items-center">
                        <span className="text-luxury-dark font-semibold">Szybkie wyszukiwanie problemu:</span>
                        <button onClick={() => setGlobalSearchQuery("suchość")} className="text-luxury-gold hover:text-luxury-dark font-medium underline transition-colors cursor-pointer">suchość</button>
                        <span>&middot;</span>
                        <button onClick={() => setGlobalSearchQuery("zmarszczki")} className="text-luxury-gold hover:text-luxury-dark font-medium underline transition-colors cursor-pointer">zmarszczki</button>
                        <span>&middot;</span>
                        <button onClick={() => setGlobalSearchQuery("trądzik")} className="text-luxury-gold hover:text-luxury-dark font-medium underline transition-colors cursor-pointer">trądzik</button>
                        <span>&middot;</span>
                        <button onClick={() => setGlobalSearchQuery("naczynka")} className="text-luxury-gold hover:text-luxury-dark font-medium underline transition-colors cursor-pointer">naczynka</button>
                        <span>&middot;</span>
                        <button onClick={() => setGlobalSearchQuery("wiotkość")} className="text-luxury-gold hover:text-luxury-dark font-medium underline transition-colors cursor-pointer">wiotkość</button>
                      </div>
                    </div>

                    {/* Real-time floating search results overlay */}
                    <AnimatePresence>
                      {globalSearchQuery.trim() && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-full mt-2.5 bg-white/98 backdrop-blur-xl border border-luxury-sand shadow-2xl z-50 text-left overflow-hidden max-h-[480px] overflow-y-auto"
                          id="hero-search-results"
                        >
                          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                            
                            {/* Column 1: Predefined Skin Problems (Recognized issues) */}
                            <div className="md:col-span-4 space-y-4">
                              <div className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-1.5 flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-luxury-gold" />
                                <span>Rozpoznane Problemy</span>
                              </div>
                              {matchedProblems.length > 0 ? (
                                <div className="space-y-3">
                                  {matchedProblems.map((prob, idx) => (
                                    <div 
                                      key={idx}
                                      onClick={() => {
                                        const treatment = TREATMENTS.find(t => t.id === prob.treatmentId);
                                        if (treatment) {
                                          setSelectedTreatment(treatment);
                                          setActiveTab("clinic");
                                          setGlobalSearchQuery("");
                                        }
                                      }}
                                      className="group cursor-pointer p-2.5 hover:bg-luxury-sand/20 transition-all duration-200 border border-transparent hover:border-luxury-gold/30 rounded-xs"
                                    >
                                      <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors flex items-center justify-between">
                                        <span>{prob.name}</span>
                                        <ArrowRight className="w-3 h-3 text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </p>
                                      <p className="text-[10px] text-luxury-dark/70 mt-1 leading-normal font-sans">{prob.description}</p>
                                      <div className="text-[9px] font-mono text-luxury-gold uppercase tracking-widest mt-1.5 font-medium">
                                        Rekomendacja: Kliknij, aby zobaczyć rytuał
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs italic text-luxury-dark/40 font-serif">Brak bezpośrednich dopasowań klinicznych.</p>
                              )}
                            </div>

                            {/* Column 2: Treatments matching query */}
                            <div className="md:col-span-5 space-y-4">
                              <div className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-1.5 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                                <span>Dopasowane Rytuały ({matchedTreatments.length})</span>
                              </div>
                              {matchedTreatments.length > 0 ? (
                                <div className="space-y-2.5">
                                  {matchedTreatments.map((treatment) => (
                                    <div
                                      key={treatment.id}
                                      onClick={() => {
                                        setSelectedTreatment(treatment);
                                        setActiveTab("clinic");
                                        setGlobalSearchQuery("");
                                      }}
                                      className="group cursor-pointer p-2.5 hover:bg-luxury-sand/20 transition-all duration-200 border border-transparent hover:border-luxury-gold/30 rounded-xs flex items-start gap-3"
                                    >
                                      <div className="flex-1">
                                        <p className="text-xs font-serif font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">
                                          {treatment.title}
                                        </p>
                                        <p className="text-[9px] text-luxury-gold uppercase font-mono tracking-widest mt-0.5">{treatment.subtitle}</p>
                                        <p className="text-[10px] text-luxury-dark/70 line-clamp-1 mt-1 font-sans">{treatment.description}</p>
                                      </div>
                                      <ArrowRight className="w-3.5 h-3.5 text-luxury-gold self-center opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs italic text-luxury-dark/40 font-serif">Brak pasujących zabiegów w ofercie.</p>
                              )}
                            </div>

                            {/* Column 3: Magazine Articles matching query */}
                            <div className="md:col-span-3 space-y-4">
                              <div className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-semibold border-b border-luxury-sand pb-1.5 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-luxury-gold" />
                                <span>Wiedza & Magazyn</span>
                              </div>
                              {matchedArticles.length > 0 ? (
                                <div className="space-y-2.5">
                                  {matchedArticles.map((art) => (
                                    <div
                                      key={art.id}
                                      onClick={() => {
                                        setSelectedArticle(art);
                                        setActiveTab("journal");
                                        setGlobalSearchQuery("");
                                      }}
                                      className="group cursor-pointer p-2.5 hover:bg-luxury-sand/20 transition-all duration-200 border border-transparent hover:border-luxury-gold/30 rounded-xs"
                                    >
                                      <p className="text-xs font-serif italic text-luxury-dark group-hover:text-luxury-gold transition-colors line-clamp-2 leading-relaxed">
                                        „{art.title}”
                                      </p>
                                      <span className="inline-block text-[9px] font-mono text-luxury-gold uppercase tracking-widest mt-1 font-medium">
                                        Kategoria: {art.category}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs italic text-luxury-dark/40 font-serif">Brak pasujących publikacji w magazynie.</p>
                              )}
                            </div>

                          </div>

                          {/* Footer of Search Result overlay */}
                          <div className="bg-[#FAF8F5] border-t border-luxury-sand/60 px-5 py-3 text-center flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-luxury-dark/60">
                            <span>Wpisz więcej, aby sprecyzować diagnozę</span>
                            <button 
                              onClick={() => {
                                setActiveTab("diagnose");
                                setDiagnosticStep(0);
                                setGlobalSearchQuery("");
                              }}
                              className="text-luxury-gold hover:text-luxury-dark transition-colors cursor-pointer font-bold animate-pulse"
                            >
                              Uruchom Konsultację AI &rarr;
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })()}

              {/* Action Triggers */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <button
                  onClick={() => {
                    const el = document.getElementById("editorial-breadcrumbs");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-8 py-3.5 bg-luxury-gold hover:bg-luxury-dark text-white hover:text-white text-[10px] md:text-xs font-mono tracking-widest uppercase transition-all duration-300 border border-luxury-gold font-bold shadow-md cursor-pointer"
                >
                  Odkryj Rytuały &darr;
                </button>
                <button
                  onClick={() => {
                    setBookingTreatment(TREATMENTS[0]);
                    setBookingConfirmed(false);
                    setBookingName("");
                    setBookingEmail("");
                    setBookingPhone("");
                    setBookingDate("");
                  }}
                  className="px-8 py-3.5 border-2 border-luxury-dark hover:bg-luxury-dark text-luxury-dark hover:text-white text-[10px] md:text-xs font-mono tracking-widest uppercase bg-white/95 hover:bg-luxury-dark backdrop-blur-xs transition-all duration-300 font-bold shadow-md cursor-pointer"
                >
                  Umów konsultację
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Responsive Layout */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        {/* Elegancja i Nawigacja: Breadcrumbs w stylu Quiet Luxury */}
        <div className="mb-8 pb-4 border-b border-luxury-sand/50 flex items-center justify-between text-[11px] font-mono tracking-widest text-luxury-dark/90" id="editorial-breadcrumbs">
          <div className="flex items-center flex-wrap gap-2 text-left">
            <button 
              onClick={() => { setActiveTab("cover"); setSelectedArticle(null); setSelectedTreatment(null); setBookingTreatment(null); }}
              className="hover:text-luxury-gold transition-colors uppercase cursor-pointer"
            >
              Slow Skin Concept
            </button>
            
            <span className="text-luxury-gold/40 select-none font-light">/</span>
            
            {activeTab === "cover" && (
              <span className="text-luxury-dark select-none uppercase font-medium">Okładka</span>
            )}
            
            {activeTab === "journal" && (
              <>
                {selectedArticle ? (
                  <>
                    <button 
                      onClick={() => setSelectedArticle(null)}
                      className="hover:text-luxury-gold transition-colors uppercase cursor-pointer text-luxury-dark/95"
                    >
                      Magazyn
                    </button>
                    <span className="text-luxury-gold/40 select-none">/</span>
                    <span className="text-luxury-dark select-none italic font-serif tracking-normal text-xs font-medium">
                      {selectedArticle.title}
                    </span>
                  </>
                ) : (
                  <span className="text-luxury-dark select-none uppercase font-medium">Magazyn</span>
                )}
              </>
            )}
            
            {activeTab === "method" && (
              <span className="text-luxury-dark select-none uppercase font-medium">Metoda Autorska</span>
            )}
            
            {activeTab === "clinic" && (
              <>
                {selectedTreatment ? (
                  <>
                    <button 
                      onClick={() => setSelectedTreatment(null)}
                      className="hover:text-luxury-gold transition-colors uppercase cursor-pointer text-luxury-dark/95"
                    >
                      Gabinet & Terapie
                    </button>
                    <span className="text-luxury-gold/40 select-none">/</span>
                    <span className="text-luxury-dark select-none italic font-serif tracking-normal text-xs font-medium">
                      {selectedTreatment.title}
                    </span>
                  </>
                ) : (
                  <span className="text-luxury-dark select-none uppercase font-medium">Gabinet & Terapie</span>
                )}
              </>
            )}
            
            {activeTab === "diagnose" && (
              <>
                <button 
                  onClick={() => { setDiagnosticStep(0); setDiagnosticReport(null); }}
                  className={`${diagnosticStep > 0 ? "hover:text-luxury-gold cursor-pointer text-luxury-dark/95" : "text-luxury-dark cursor-default"} transition-colors uppercase`}
                >
                  Diagnoza Komórkowa AI
                </button>
                {diagnosticStep > 0 && (
                  <>
                    <span className="text-luxury-gold/40 select-none">/</span>
                    <span className="text-luxury-dark select-none uppercase font-medium">
                      {diagnosticStep === 7 ? "Twój Raport Skóry" : `Krok ${diagnosticStep + 1}`}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Subtle dynamic identifier of current view to enforce quiet luxury authority */}
          <div className="hidden sm:block text-[9px] text-luxury-gold/60 uppercase select-none tracking-[0.25em]">
            {activeTab === "cover" && "Okładka No. 1"}
            {activeTab === "journal" && (selectedArticle ? "Lektura Ekspercka" : "Artykuły i Publikacje")}
            {activeTab === "method" && "Metodologia Naukowa"}
            {activeTab === "clinic" && (selectedTreatment ? "Monografia Rytuału" : "Menu Zabiegowe")}
            {activeTab === "diagnose" && (diagnosticStep === 7 ? "Paszport Skóry™" : "Interaktywny Analizator")}
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: COVER SCREEN (Editorial Magazine Frontpage) */}
          {activeTab === "cover" && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-16"
              id="tab-cover"
            >
              {/* Premium Hero Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Visual Cover Piece */}
                <div className="lg:col-span-7 relative group overflow-hidden border border-luxury-sand p-3 bg-white">
                  <EditableImage
                    id="cover_magazine"
                    slotName="Okładka — Wydanie Specjalne No. I"
                    src={customTreatmentImages["cover_magazine"] || "/cover_magazine.png"}
                    fallbackSrc="/src/assets/images/regenerated_image_1781694292285.jpg"
                    alt="Slow Skin Concept Luminous Skin Cover"
                    aspectRatioClass="aspect-[16/10]"
                    className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
                    onImageChange={(id, newUrl) => {
                      setCustomTreatmentImages(prev => ({ ...prev, [id]: newUrl }));
                    }}
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-luxury-dark/40 to-transparent p-6 flex justify-between items-end pointer-events-none">
                      <span className="font-mono text-[9px] tracking-widest text-luxury-cream uppercase">Wydanie Specjalne No. I</span>
                      <span className="font-mono text-[9px] tracking-widest text-luxury-cream uppercase">© Slow Skin Concept</span>
                    </div>
                  </EditableImage>
                </div>

                {/* Editorial Copy Block */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-luxury-gold uppercase flex items-center gap-2">
                    <Fingerprint className="w-3 pb-0.5" /> Ekspercka Diagnoza Komórkowa
                  </div>
                  
                  <h1 className="font-serif text-5xl md:text-6xl font-light leading-[1.1] text-luxury-dark leading-tight tracking-tight">
                    Wolne starzenie.<br />
                    <span className="italic pl-4 text-luxury-gold font-normal">Sztuka wyciszania</span><br />
                    stanu zapalnego.
                  </h1>

                  <p className="text-sm text-luxury-dark/95 font-light leading-relaxed max-w-md">
                    Projektujemy spersonalizowaną architekturę Twojej skóry. Odrzucamy agresywne terapie i schematy na rzecz unikalnych biomolekularnych formuł, spokoju neurologicznego oraz autorskiej diagnostyki komórkowej. Twoja skóra zasługuje na ciche wsparcie, a nie ciągłą walkę.
                  </p>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setActiveTab("diagnose")}
                      className="px-8 py-4 bg-luxury-dark text-luxury-cream text-xs font-mono tracking-widest uppercase hover:bg-luxury-gold hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      Rozpocznij Diagnozę <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab("method")}
                      className="px-8 py-4 border border-luxury-dark/30 text-luxury-dark text-xs font-mono tracking-widest uppercase hover:border-luxury-dark transition-all text-center"
                    >
                      Nasza Metoda
                    </button>
                  </div>
                </div>
              </div>

              {/* Bento Grid: Storytelling Highlights */}
              <div className="border-t border-luxury-sand pt-16">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase">Filozofia Marki</span>
                  <h2 className="font-serif text-3xl font-light mt-2">Dla klientek, które pragną czegoś więcej niż standardowych zabiegów</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Card 1 */}
                  <div className="p-8 border border-luxury-sand bg-white/50 backdrop-blur-sm space-y-4 hover:border-luxury-gold/50 transition-colors">
                    <div className="font-serif text-2xl text-luxury-gold">01 / Jakość & Formuła</div>
                    <h3 className="font-mono text-xs tracking-wider uppercase font-medium">Starannie dobrane składniki</h3>
                    <p className="text-xs text-luxury-dark/95 leading-relaxed">
                      W gabinecie sięgamy po łagodne, bezpieczne formuły z ektoiną, peptydami i kwasem laktobionowym, które dbają o nawilżenie i ukojenie skóry bez podrażnień.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-8 border border-luxury-sand bg-white/50 backdrop-blur-sm space-y-4 hover:border-luxury-gold/50 transition-colors">
                    <div className="font-serif text-2xl text-luxury-gold">02 / Cisza & Komfort</div>
                    <h3 className="font-mono text-xs tracking-wider uppercase font-medium">Kojący odpoczynek</h3>
                    <p className="text-xs text-luxury-dark/95 leading-relaxed">
                      Pomiędzy samopoczuciem a stanem skóry istnieje silna więź. Nasze zabiegi i masaże pomagają rozluźnić spięte mięśnie twarzy, zredukować stres i przynoszą głęboki spokój.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-8 border border-luxury-sand bg-white/50 backdrop-blur-sm space-y-4 hover:border-luxury-gold/50 transition-colors">
                    <div className="font-serif text-2xl text-luxury-gold">03 / Zaufanie & Opieka</div>
                    <h3 className="font-mono text-xs tracking-wider uppercase font-medium">Doświadczenie i troska</h3>
                    <p className="text-xs text-luxury-dark/95 leading-relaxed">
                      Nasz gabinet to bezpieczna, spokojna przestrzeń odpoczynku. Trafiasz pod opiekę doświadczonego kosmetologa, dla którego najważniejszy jest Twój komfort i dobre samopoczucie.
                    </p>
                  </div>

                </div>
              </div>

              {/* Sekcja: Z czym najczęściej przychodzą nasze Klientki (Jasne, luksusowe tło o idealnym kontraście) */}
              <div className="border border-luxury-sand/80 bg-gradient-to-b from-[#FDFCF9] via-[#FAF6EE] to-[#F5EFE4] text-luxury-dark p-8 md:p-14 space-y-10 rounded-sm -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-12 relative overflow-hidden my-16 shadow-[0_12px_45px_rgba(7,56,47,0.06)]" id="najczestsze-problemy-skorne">
                {/* Visual subtle glowing background decoration */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-luxury-gold/10 blur-3xl rounded-full pointer-events-none select-none" />
                <div className="absolute left-0 bottom-0 w-96 h-96 bg-luxury-sand/50 blur-3xl rounded-full pointer-events-none select-none" />

                <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
                  <span className="font-mono text-[9.5px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">Dolegliwości & Fizjologia naskórka</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark mt-1 uppercase tracking-wide">
                    Z czym najczęściej przychodzą nasze Klientki?
                  </h2>
                  <div className="w-16 h-[1.5px] bg-luxury-gold mx-auto my-3" />
                  <p className="text-xs md:text-sm text-luxury-dark/95 font-serif italic leading-relaxed text-justify md:text-center px-4 max-w-xl mx-auto">
                    Skóra nie kłamie — komunikuje się poprzez objawy. W naszym gabinecie nie maskujemy jedynie symptomów, lecz odnajdujemy ich biologiczną przyczynę, aby przywrócić jej naturalny komfort i zdrowie.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
                  {/* Left Column: Interactive Problems Selector List */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    {/* Selector tab buttons */}
                    <div className="space-y-3">
                      {[
                        { title: "Zaburzona bariera ochronna (ściągnięcie, pieczenie, suchość)", tabTitle: "Suchość & Bariera", id: 0, icon: AlertCircle },
                        { title: "Trądzik różowaty i rumień naczyniowy (reaktywność)", tabTitle: "Rumień & Wrażliwość", id: 1, icon: Compass },
                        { title: "Szary koloryt, zmęczenie stresem komórkowym (brak blasku)", tabTitle: "Ziemistość & Zmęczenie", id: 2, icon: Sparkles },
                        { title: "Wiotkość owalu twarzy, zmarszczki (utrata gęstości)", tabTitle: "Wiotkość & Owal", id: 3, icon: TrendingUp },
                        { title: "Chaos pielęgnacyjny i brak satysfakcjonujących rezultatów", tabTitle: "Przypadkowa Pielęgnacja", id: 4, icon: Fingerprint }
                      ].map((prob, idx) => {
                        const IconComponent = prob.icon;
                        const isActive = activeProblemIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveProblemIdx(idx)}
                            className={`w-full text-left p-4 border transition-all duration-300 rounded-sm flex items-center gap-4 cursor-pointer group ${
                              isActive
                                ? "bg-white border-luxury-gold text-luxury-dark shadow-[0_4px_18px_rgba(185,160,111,0.22)] ring-1 ring-luxury-gold/40"
                                : "bg-white/80 border-luxury-sand/90 hover:bg-white hover:border-luxury-gold/50 text-luxury-dark/90 shadow-2xs"
                            }`}
                          >
                            <div className={`p-2.5 rounded-full transition-colors ${isActive ? "bg-luxury-gold text-white" : "bg-luxury-sand/60 text-luxury-gold group-hover:bg-luxury-gold/15"}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-grow">
                              <span className={`block font-mono text-[8.5px] tracking-wider uppercase ${isActive ? "text-luxury-gold font-bold" : "text-luxury-dark/50"}`}>
                                Wyzwanie biologiczne #0{idx + 1}
                              </span>
                              <h4 className="font-serif text-sm md:text-base font-medium text-luxury-dark mt-0.5 leading-snug tracking-wide">{prob.tabTitle}</h4>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "text-luxury-gold translate-x-1" : "text-luxury-dark/30 group-hover:translate-x-0.5 group-hover:text-luxury-gold"}`} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Detail Display Card */}
                    <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm space-y-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-opacity duration-300 text-left relative overflow-hidden">
                      {/* Leaf decorative element */}
                      <div className="absolute right-0 top-0 w-48 h-48 bg-luxury-gold/5 blur-2xl rounded-full pointer-events-none" />
                      {activeProblemIdx === 0 && (
                        <div className="space-y-4">
                          <div>
                            <span className="font-mono text-[8.5px] tracking-[0.2em] text-[#8C2828] bg-[#FDF2F2] border border-[#F8D7DA] px-2.5 py-1 rounded-xs uppercase font-semibold inline-block">Stan fizjologiczny: Zaburzona Bariera Hydrolipidowa</span>
                            <h4 className="font-serif text-lg md:text-xl text-luxury-dark font-medium mt-2">Upośledzenie spoiwa lipidowego i ucieczka wilgoci</h4>
                          </div>
                          <div className="space-y-3 leading-relaxed">
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-dark font-semibold">Biologiczna przyczyna:</strong> Niedobór cementu międzykomórkowego (ceramidów, kwasów tłuszczowych i cholesterolu), co osłabia naturalną okluzję, zwiększa przeznaskórkową utratę wody oraz uwrażliwia wolne zakończenia nerwowe, wywołując uczucie pieczenia i ściągnięcia.</p>
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-gold font-semibold">Nasze rozwiązanie:</strong> Rezygnujemy z agresywnych peelingów kwasowych i silnych detergentów. Wprowadzamy biomimetyczną pielęgnację z ektoiną i ceramidami, która odbudowuje naturalny płaszcz lipidowy i przynosi natychmiastowe ukojenie.</p>
                          </div>
                          <div className="pt-3.5 border-t border-luxury-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="font-mono text-[8.5px] text-luxury-dark/60 uppercase tracking-wider block">Rekomendowana terapia</span>
                              <span className="font-serif text-sm text-luxury-dark font-medium">Rosacea Calm Therapy™</span>
                            </div>
                            <button
                              onClick={() => {
                                const found = TREATMENTS.find(t => t.id === "rosacea-calm-therapy");
                                if (found) {
                                  setSelectedTreatment(found);
                                  setActiveTab("clinic");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              }}
                              className="px-5 py-2.5 bg-luxury-dark hover:bg-luxury-gold text-luxury-cream hover:text-white font-mono text-[9px] tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
                            >
                              Odkryj metodę <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {activeProblemIdx === 1 && (
                        <div className="space-y-4">
                          <div>
                            <span className="font-mono text-[8.5px] tracking-[0.2em] text-[#8C2828] bg-[#FDF2F2] border border-[#F8D7DA] px-2.5 py-1 rounded-xs uppercase font-semibold inline-block">Stan fizjologiczny: Reaktywność Neurosensoryczna</span>
                            <h4 className="font-serif text-lg md:text-xl text-luxury-dark font-medium mt-2">Nawracający rumień i nadwrażliwość naczynek</h4>
                          </div>
                          <div className="space-y-3 leading-relaxed">
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-dark font-semibold">Biologiczna przyczyna:</strong> Nadreaktywność receptorów czuciowych naskórka połączona z osłabieniem ścian naczyń krwionośnych pod wpływem stresu, zmian temperatur i emocji, co stymuluje gwałtowne zaczerwienienie i uczucie ciepła.</p>
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-gold font-semibold">Nasze rozwiązanie:</strong> Wygaszamy ogniska podrażnień bez inwazyjnego złuszczania. Zastosowanie rezonansowych mikroczęstotliwości dr. Nogiera ucisza nadreaktywność naskórka i wspiera naturalną regenerację naczynek.</p>
                          </div>
                          <div className="pt-3.5 border-t border-luxury-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="font-mono text-[8.5px] text-luxury-dark/60 uppercase tracking-wider block">Rekomendowana terapia</span>
                              <span className="font-serif text-sm text-luxury-dark font-medium">Neurolifting — Fale Nogiera</span>
                            </div>
                            <button
                              onClick={() => {
                                const found = TREATMENTS.find(t => t.id === "neurolifting-nogier");
                                if (found) {
                                  setSelectedTreatment(found);
                                  setActiveTab("clinic");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              }}
                              className="px-5 py-2.5 bg-luxury-dark hover:bg-luxury-gold text-luxury-cream hover:text-white font-mono text-[9px] tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
                            >
                              Odkryj metodę <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {activeProblemIdx === 2 && (
                        <div className="space-y-4">
                          <div>
                            <span className="font-mono text-[8.5px] tracking-[0.2em] text-[#8C2828] bg-[#FDF2F2] border border-[#F8D7DA] px-2.5 py-1 rounded-xs uppercase font-semibold inline-block">Stan fizjologiczny: Spadek Energii Komórkowej</span>
                            <h4 className="font-serif text-lg md:text-xl text-luxury-dark font-medium mt-2">Cera zmęczona, szara i pozbawiona blasku</h4>
                          </div>
                          <div className="space-y-3 leading-relaxed">
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-dark font-semibold">Biologiczna przyczyna:</strong> Spowolnienie metabolizmu komórek naskórka wskutek wpływu smogu, światła niebieskiego z ekranów, zmęczenia oraz niedoborów antyoksydantów. Wywołuje to ziemisty, matowy odcień skóry.</p>
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-gold font-semibold">Nasze rozwiązanie:</strong> Pobudzamy witalność komórek za pomocą kwasu bursztynowego – naturalnego, łagodnego stymulatora. Delikatne dotlenienie naskórka urządzeniem NanoPen przywraca promienny, świeży blask i jedwabistą gładkość.</p>
                          </div>
                          <div className="pt-3.5 border-t border-luxury-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="font-mono text-[8.5px] text-luxury-dark/60 uppercase tracking-wider block">Rekomendowana terapia</span>
                              <span className="font-serif text-sm text-luxury-dark font-medium">Regeneracja Kwasem Bursztynowym</span>
                            </div>
                            <button
                              onClick={() => {
                                const found = TREATMENTS.find(t => t.id === "amber-regeneration");
                                if (found) {
                                  setSelectedTreatment(found);
                                  setActiveTab("clinic");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              }}
                              className="px-5 py-2.5 bg-luxury-dark hover:bg-luxury-gold text-luxury-cream hover:text-white font-mono text-[9px] tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
                            >
                              Odkryj metodę <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {activeProblemIdx === 3 && (
                        <div className="space-y-4">
                          <div>
                            <span className="font-mono text-[8.5px] tracking-[0.2em] text-[#8C2828] bg-[#FDF2F2] border border-[#F8D7DA] px-2.5 py-1 rounded-xs uppercase font-semibold inline-block">Stan fizjologiczny: Utrata Gęstości i Elastyczności</span>
                            <h4 className="font-serif text-lg md:text-xl text-luxury-dark font-medium mt-2">Wiotkość tkanek, utrata owalu i drobne zmarszczki</h4>
                          </div>
                          <div className="space-y-3 leading-relaxed">
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-dark font-semibold">Biologiczna przyczyna:</strong> Naturalne spowolnienie produkcji kolagenu i elastyny w skórze wraz z wiekiem. Utrata jędrności tkanek powięziowych prowadzi do opadania konturów owalu twarzy.</p>
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-gold font-semibold">Nasze rozwiązanie:</strong> Zamiast sztucznych wypełniaczy pobudzamy tkanki precyzyjnym impulsem ultradźwiękowym HIFU. Działamy na poziomie powięziowym SMAS, stymulując komórki do produkcji nowego kolagenu i poprawy napięcia owalu bez rekonwalescencji.</p>
                          </div>
                          <div className="pt-3.5 border-t border-luxury-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="font-mono text-[8.5px] text-luxury-dark/60 uppercase tracking-wider block">Rekomendowana terapia</span>
                              <span className="font-serif text-sm text-luxury-dark font-medium">HIFU — Lifting Bez Skalpela</span>
                            </div>
                            <button
                              onClick={() => {
                                const found = TREATMENTS.find(t => t.id === "hifu-lifting");
                                if (found) {
                                  setSelectedTreatment(found);
                                  setActiveTab("clinic");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              }}
                              className="px-5 py-2.5 bg-luxury-dark hover:bg-luxury-gold text-luxury-cream hover:text-white font-mono text-[9px] tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
                            >
                              Odkryj metodę <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {activeProblemIdx === 4 && (
                        <div className="space-y-4">
                          <div>
                            <span className="font-mono text-[8.5px] tracking-[0.2em] text-[#8C2828] bg-[#FDF2F2] border border-[#F8D7DA] px-2.5 py-1 rounded-xs uppercase font-semibold inline-block">Stan fizjologiczny: Chaos Pielęgnacyjny</span>
                            <h4 className="font-serif text-lg md:text-xl text-luxury-dark font-medium mt-2">Brak rezultatów i przypadkowo dobierane kosmetyki</h4>
                          </div>
                          <div className="space-y-3 leading-relaxed">
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-dark font-semibold">Biologiczna przyczyna:</strong> Stosowanie wielu niedopasowanych kosmetyków lub zbyt agresywnych substancji aktywnych, które zamiast pomagać, przeciążają cerę i zaburzają jej barierę obronną.</p>
                            <p className="text-xs md:text-sm text-luxury-dark/95 font-light"><strong className="text-luxury-gold font-semibold">Nasze rozwiązanie:</strong> Zastępujemy domysły rzetelną diagnostyką. Mierzymy poziom nawilżenia, sebum i stan naczynek, a następnie tworzymy dla Ciebie prosty, czytelny Beauty Plan do stosowania w domu.</p>
                          </div>
                          <div className="pt-3.5 border-t border-luxury-sand flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <span className="font-mono text-[8.5px] text-luxury-dark/60 uppercase tracking-wider block">Rekomendowany krok</span>
                              <span className="font-serif text-sm text-luxury-dark font-medium">Skin Readiness™</span>
                            </div>
                            <button
                              onClick={() => {
                                const found = TREATMENTS.find(t => t.id === "skin-readiness");
                                if (found) {
                                  setSelectedTreatment(found);
                                  setActiveTab("clinic");
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              }}
                              className="px-5 py-2.5 bg-luxury-dark hover:bg-luxury-gold text-luxury-cream hover:text-white font-mono text-[9px] tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
                            >
                              Odkryj metodę <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Beautiful Editorial Visual Card with High Contrast in bright theme */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div className="relative h-full min-h-[300px] border border-luxury-sand p-4 sm:p-5 bg-white rounded-sm flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)] group">
                      <div className="h-[240px] md:h-auto md:flex-grow relative overflow-hidden rounded-sm mb-4 border border-luxury-sand/50">
                        <EditableImage
                          id="bionomic_diagnosis"
                          slotName="Diagnoza Bionomiczna (Sondaż Barierowy)"
                          src={customTreatmentImages["bionomic_diagnosis"] || "/src/assets/images/regenerated_image_1781694292749.jpg"}
                          fallbackSrc="/src/assets/images/regenerated_image_1781694292749.jpg"
                          alt="Bionomiczna diagnostyka potrzeb skóry w Slow Skin Concept"
                          className="w-full h-full object-cover grayscale opacity-95 transition-all duration-[6000ms] group-hover:scale-105 group-hover:opacity-100"
                          aspectRatioClass="h-full w-full"
                          onImageChange={(id, newUrl) => {
                            setCustomTreatmentImages(prev => ({ ...prev, [id]: newUrl }));
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 via-luxury-dark/15 to-transparent pointer-events-none" />
                          <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                            <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase block font-semibold">Zrozumienie Biologii</span>
                            <span className="font-serif text-sm text-white font-medium block mt-0.5">Sondaż gotowości barierowej</span>
                          </div>
                        </EditableImage>
                      </div>

                      <div className="bg-[#FAF6EE] border border-luxury-sand/90 p-5 rounded-sm text-left">
                        <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase block font-bold">Kluczowe przesłanie</span>
                        <p className="font-serif text-xs md:text-sm italic text-luxury-dark/95 mt-2 leading-relaxed">
                          „Sygnał wysyłany przez Twoją skórę — czy to pieczenie, ściągnięcie, czy nagłe zaczerwienienie — nie jest błędem biologicznym. To cenny komunikat, który w naszym gabinecie odczytujemy ze spokojem i empatią, tworząc bezpieczny plan regeneracji.”
                        </p>
                        <span className="font-mono text-[8.5px] text-luxury-gold uppercase tracking-widest mt-3.5 block text-right font-medium">— Zespół Slow Skin Concept</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sekcja: Początek strony - Filozofia Slow Skin Concept */}
              <div className="border border-luxury-sand p-8 md:p-12 bg-white/40 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase block">Kosmetologia Interdyscyplinarna & Filozofia Slow Aging</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark mt-1">
                    Slow Skin Concept<span className="text-xs align-super text-luxury-gold font-sans ml-0.5 font-medium">TM</span>
                  </h2>
                  <div className="w-12 h-[1px] bg-luxury-gold/50 mx-auto my-3" />
                  <p className="text-sm md:text-base text-luxury-dark font-serif italic leading-relaxed text-justify md:text-center px-4">
                    „Slow Skin Concept™ to holistyczny sposób pracy ze skórą, oparty na kosmetologii interdyscyplinarnej i filozofii Slow Aging.”
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                  {/* Left Column - Core Philosophy */}
                  <div className="space-y-8">
                    <div className="space-y-3 text-left">
                      <h3 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full inline-block"></span>
                        Holistyczny Sposób Pracy Ze Skórą
                      </h3>
                      <p className="text-xs md:text-sm font-light leading-relaxed text-luxury-dark/95 text-justify">
                        Nie rozpoczynam od wyboru zabiegu ani od walki z pojedynczym objawem. Najpierw staram się zrozumieć, dlaczego skóra reaguje w określony sposób, czego potrzebuje właśnie teraz i na jakie działania jest rzeczywiście gotowa.
                      </p>
                      <p className="text-xs md:text-sm font-light leading-relaxed text-luxury-dark/95 text-justify">
                        Na kondycję skóry wpływają nie tylko kosmetyki i zabiegi, lecz także stan jej bariery ochronnej, mikrobiom, reaktywność, komunikacja z układem nerwowym i odpornościowym, gospodarka hormonalna, stres, styl życia oraz warunki potrzebne do prawidłowej odnowy i regeneracji.
                      </p>
                    </div>

                    <div className="space-y-3 bg-[#FAF8F5] border border-luxury-sand/70 p-6 hover:bg-white hover:border-luxury-gold/50 transition-all duration-300 rounded-sm text-left">
                      <h3 className="font-serif text-lg font-light text-luxury-dark">
                        „Slow nie oznacza wolniej. Oznacza we właściwym tempie dla konkretnej skóry.”
                      </h3>
                      <p className="text-xs md:text-sm font-light leading-relaxed text-luxury-dark/95 text-justify">
                        Nie przyspieszam procesów, do których skóra nie jest jeszcze przygotowana. Najpierw wspieram jej podstawowe warunki równowagi, a następnie dobieram pielęgnację i terapię zgodnie z jej aktualną kondycją oraz możliwościami.
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Slow Aging & Cel Nadrzędny */}
                  <div className="space-y-8">
                    <div className="space-y-3 text-left">
                      <h3 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full inline-block"></span>
                        Czym jest Slow Aging?
                      </h3>
                      <h4 className="font-serif text-base font-normal text-luxury-dark">Świadome wspieranie biologii skóry</h4>
                      <p className="text-xs md:text-sm font-light leading-relaxed text-luxury-dark/95 text-justify">
                        Slow Aging nie jest walką ze starzeniem. To świadome wspieranie procesów, które pomagają skórze jak najdłużej zachować dobrą kondycję, zdolności adaptacyjne i potencjał regeneracyjny.
                      </p>
                    </div>

                    <div className="space-y-3 bg-[#FAF8F5] border border-luxury-sand/70 p-6 hover:bg-white hover:border-luxury-gold/50 transition-all duration-300 rounded-sm text-left">
                      <h3 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full inline-block"></span>
                        Cel nadrzędny
                      </h3>
                      <h4 className="font-serif text-base font-normal text-luxury-dark">Długofalowa zdolność powrotu do równowagi</h4>
                      <p className="text-xs md:text-sm font-light leading-relaxed text-luxury-dark/95 text-justify">
                        Celem Slow Skin Concept™ jest wspieranie homeodynamiki skóry — jej zdolności do reagowania na zmieniające się warunki, adaptacji oraz powrotu do równowagi. Rodzaj, intensywność i kolejność działań dobieram do aktualnej kondycji skóry i jej gotowości na kolejny bodziec.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nowy Komponent: Porównanie Metodologii (Zainspirowany grafiką użytkownika) */}
                <div className="pt-12 border-t border-luxury-sand/30 space-y-8">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="font-mono text-[9px] tracking-[0.22em] text-luxury-gold uppercase block">Zestawienie Podejść</span>
                    <h3 className="font-serif text-[36px] font-light text-luxury-dark leading-tight">Filozofia Wyboru: Czy Twoja skóra otrzymuje to, czego potrzebuje?</h3>
                    <p className="text-[11px] leading-relaxed text-luxury-dark/95 font-serif italic max-w-lg mx-auto">
                      Agresywna stymulacja bez przygotowania vs. cierpliwa, naukowa rekonstrukcja tkanki. Wybierz drogę pełnego bezpieczeństwa.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                    {/* Lewa i Prawa Karta (Zestawienie VS) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative items-stretch">
                      
                      {/* Ozdobny Badge VS na środku (widoczny tylko na szerszych ekranach, żeby nie nakładał się nieczytelnie) */}
                      <div className="hidden md:flex absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-[1px] bg-luxury-sand/30 z-0">
                        <div className="absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border border-luxury-sand flex items-center justify-center shadow-xs z-10 text-[29px]">
                          <span className="font-serif italic text-luxury-gold font-light tracking-widest leading-none">vs</span>
                        </div>
                      </div>

                      {/* Lewa Karta: Przypadkowy dobór zabiegów */}
                      <div className="border border-red-950/5 bg-[#fafafa]/85 p-6 md:p-8 rounded-sm space-y-6 text-left relative z-1 flex flex-col justify-between transition-all duration-300 opacity-75 hover:opacity-90">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 border-b border-red-950/5 pb-3">
                            <div className="p-1.5 rounded-full bg-red-100/30 text-red-700">
                              <X className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-mono text-[8px] tracking-wider text-red-600/70 uppercase block font-semibold">Konwencjonalna Kosmetyka</span>
                              <h4 className="font-serif text-base font-light text-luxury-dark">Przypadkowy Dobór Zabiegów</h4>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-[10px] text-red-600/80 mt-0.5">✕</span>
                                <h5 className="font-serif text-xs font-semibold text-luxury-dark">Działanie Bez Diagnozy</h5>
                              </div>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed pl-5">
                                Wykonywanie inwazyjnych lub silnie stymulujących procedur „z ulicy”, bez wejrzenia w stan naczyń głębokich, poziom TEWL i stopień neurosensoryczności naskórka.
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-[10px] text-red-600/80 mt-0.5">✕</span>
                                <h5 className="font-serif text-xs font-semibold text-luxury-dark">Ryzyko Przestymulowania</h5>
                              </div>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed pl-5">
                                Niekontrolowane bodźcowanie kwasami, silnym złuszczaniem czy mikroigłami na tkance o uszkodzonej okluzji lipidowej, co utrwala chroniczny stan zapalny (inflammaging).
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-[10px] text-red-600/80 mt-0.5">✕</span>
                                <h5 className="font-serif text-xs font-semibold text-luxury-dark">Chwilowy Efekt</h5>
                              </div>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed pl-5">
                                Uzyskanie krótkotrwałego złudzenia gładkości kosztem naruszenia naturalnego ekosystemu bakteryjnego naskórka i szybkiego nawrotu uciążliwych defektów.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-red-950/5 text-[9px] font-mono text-red-700/60 uppercase tracking-widest italic text-center">
                          Metoda obarczona ryzykiem dysfunkcji barierowych
                        </div>
                      </div>

                      {/* Prawa Karta: Biologiczna Terapia Skóry */}
                      <div className="border-2 border-luxury-gold bg-gradient-to-br from-[#fdfbf7] via-[#faf5e9] to-[#f4ecd8] p-6 md:p-8 rounded-none space-y-6 text-left relative z-10 flex flex-col justify-between transition-all duration-300 shadow-[0_20px_50px_rgba(179,155,114,0.22)] ring-1 ring-luxury-gold/20 scale-[1.02] md:scale-[1.03] lg:scale-[1.04]">
                        {/* Custom visual marker for the recommended methodology */}
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-luxury-gold text-luxury-dark font-mono text-[9px] tracking-[0.25em] font-extrabold px-5 py-1.5 uppercase shadow-md border-2 border-white whitespace-nowrap">
                          Rekomendowany Wybór Ekspercki
                        </div>

                        <div className="space-y-4 pt-1">
                          <div className="flex items-center gap-3 border-b border-luxury-gold/30 pb-3">
                            <div className="w-8 h-8 rounded-full bg-luxury-gold text-white flex items-center justify-center shadow-sm">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                            <div>
                              <span className="font-mono text-[8px] tracking-[0.18em] text-luxury-gold font-bold uppercase block">Slow Skin Concept™</span>
                              <h4 className="font-serif text-base font-bold text-luxury-dark">Biologiczna Terapia Skóry</h4>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-xs text-luxury-gold mt-0.5 font-bold">✓</span>
                                <h5 className="font-serif text-xs font-bold text-luxury-dark">Rozpoznanie Potrzeb Skóry</h5>
                              </div>
                              <p className="text-[11px] text-luxury-dark font-normal leading-relaxed pl-5">
                                Wnikliwy audyt dotychczasowej pielęgnacji połączony z komputerowym badaniem markerów głębokich za pomocą zaawansowanych systemów Nati V3 oraz Iomet.
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-xs text-luxury-gold mt-0.5 font-bold">✓</span>
                                <h5 className="font-serif text-xs font-bold text-luxury-dark">Ocena Gotowości Biologicznej</h5>
                              </div>
                              <p className="text-[11px] text-luxury-dark font-normal leading-relaxed pl-5">
                                Bezwzględna weryfikacja stopnia wrażliwości, uciszenie stanów zapalnych i dbałość o barierowość przed wprowadzaniem jakichkolwiek silnych procedur stymulacyjnych.
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-xs text-luxury-gold mt-0.5 font-bold">✓</span>
                                <h5 className="font-serif text-xs font-bold text-luxury-dark">Indywidualny Plan Terapii</h5>
                              </div>
                              <p className="text-[11px] text-luxury-dark font-normal leading-relaxed pl-5">
                                Opracowanie precyzyjnego Beauty Planu integrującego harmonogram zabiegów, recepturę kosmetyków biomimetycznych do domu oraz celowaną, zrównoważoną dietosuplementację.
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-start gap-2.5">
                                <span className="font-mono text-xs text-luxury-gold mt-0.5 font-bold">✓</span>
                                <h5 className="font-serif text-xs font-bold text-luxury-dark">Bezpieczne i Skuteczne Prowadzenie</h5>
                              </div>
                              <p className="text-[11px] text-luxury-dark font-normal leading-relaxed pl-5">
                                Długofalowa opieka dyplomowanego specjalisty i cykliczne komputerowe kontrole postępów naskórkowych dla uzyskania stabilnych, autentycznych efektów odmłodzenia.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-luxury-gold/30 text-[9px] font-mono text-luxury-gold uppercase tracking-[0.2em] text-center font-bold">
                          Fizjologiczny fundament zdrowego wyglądu
                        </div>
                      </div>

                    </div>

                    {/* Prawa Kolumna: Przepiękny Portret Epigenetyczny z Liściem/Motywem Ekologicznym */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                      <div className="relative border border-luxury-sand p-3.5 bg-white/40 rounded-sm overflow-hidden group h-full flex flex-col justify-between shadow-xs">
                        
                        {/* Wewnętrzny obrazek - powiększony pionowo, aby odsłonić twarz oraz dłonie z notatkami */}
                        <div className="relative overflow-hidden rounded-sm mb-3 flex-grow min-h-[480px] sm:min-h-[540px] md:min-h-[600px] lg:min-h-[640px] w-full bg-luxury-sand/10">
                          <EditableImage
                            id="method_biological"
                            slotName="Metoda Autorska (Stymulacja Biologiczna)"
                            src={customTreatmentImages["method_biological"] || "/src/assets/images/biological_skin_stimulation_1786128275438.jpg"}
                            fallbackSrc="/src/assets/images/biological_skin_stimulation_1786128275438.jpg"
                            alt="Indywidualny plan dla Twojej skóry - kosmetolog tworzący notatki i plan terapii"
                            className="w-full h-full object-cover object-top grayscale opacity-95 transition-transform duration-[6000ms] group-hover:scale-102 group-hover:opacity-100"
                            aspectRatioClass="h-full w-full min-h-[480px] sm:min-h-[540px] md:min-h-[600px] lg:min-h-[640px]"
                            onImageChange={(id, newUrl) => {
                              setCustomTreatmentImages(prev => ({ ...prev, [id]: newUrl }));
                            }}
                          >
                            {/* Subtelny, luksusowy wektorowy ornament botaniczny (leaf overlay) w lewym górnym rogu */}
                            <div className="absolute top-4 left-4 p-2 bg-white/70 backdrop-blur-xs rounded-full border border-luxury-sand/30 text-luxury-gold pointer-events-none">
                              <Heart className="w-4 h-4 fill-luxury-gold bg-transparent" />
                            </div>

                            {/* Subtelny, niski gradient bionomiczny na samym dole, aby nie zasłaniał dłoni zapisujących notatki */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-luxury-dark/90 via-luxury-dark/40 to-transparent pointer-events-none" />
                            
                            {/* Opis tekstowy na dole zdjęcia */}
                            <div className="absolute bottom-3 left-4 right-4 text-left space-y-0.5 pointer-events-none">
                              <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">Edukacja & Biologia</span>
                              <span className="font-serif text-xs text-white font-medium block leading-snug">
                                Indywidualny plan dla Twojej skóry.
                              </span>
                            </div>
                          </EditableImage>
                        </div>

                        {/* Mądry bionomiczny cytat dopełniający estetykę quiet luxury */}
                        <div className="p-3.5 border border-luxury-sand/20 bg-luxury-sand/5 rounded-sm text-left">
                          <p className="font-serif text-[11px] italic text-luxury-dark leading-relaxed">
                            „Odrzucenie przypadkowych impulsów na rzecz celowanej terapby bionomicznej to najlepsze, co możesz podarować swojej skórze, by zachowała młodość, jędrność i pełną integralność komórkową.”
                          </p>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* Nowa Sekcja: Jak możemy Ci pomóc? i Ścieżka Krok po Kroku (Zoptymalizowana pod SEO) */}
                <section className="pt-16 pb-8 border-t border-luxury-sand/30 space-y-12" id="how-we-can-help">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold text-center">Kompleksowe Terapie Bionomiczne</span>
                    <h2 className="font-serif text-[36px] md:text-[36px] font-light text-luxury-dark tracking-tight text-center">Jak możemy Ci pomóc?</h2>
                    <div className="w-12 h-[1px] bg-luxury-gold/50 mx-auto" />
                    <p className="text-xs text-luxury-dark/95 font-serif italic max-w-lg mx-auto leading-relaxed text-center">
                      Wybierz obszar, który najbardziej odpowiada potrzebom Twojej skóry. Każdy krok planujemy w pełnej harmonii z jej naturalną fizjologią.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
                    {[
                      {
                        id: "how_help_meso_remodeling",
                        title: "Meso Remodeling",
                        desc: "Komórkowa odbudowa mitochondrialna z ochroną telomerów i stymulacją głębokiej odnowy naskórka. Zaawansowana terapia bionomiczna.",
                        image: "/src/assets/images/meso_remodeling_card_1786128520065.jpg",
                        actionUrl: "/meso-remodeling/",
                        cta: "Dowiedz się więcej"
                      },
                      {
                        id: "how_help_first_visit",
                        title: "Pierwsza wizyta i diagnostyka skóry",
                        desc: "Szczegółowa konsultacja oraz zaawansowana analiza Thessia, dzięki której poznamy biologiczne potrzeby Twojej skóry i dobierzemy precyzyjny kierunek terapii.",
                        image: "/src/assets/images/regenerated_image_1781694292285.jpg",
                        video: "/src/assets/videos/pierwsza-wizyta-1.mp4",
                        actionUrl: "/pierwsza-wizyta-diagnostyka-skory/",
                        cta: "Dowiedz się więcej"
                      },
                      {
                        id: "how_help_neurolifting",
                        title: "Neurolifting",
                        desc: "Naturalny lifting i rozluźnienie głębokich napięć mięśniowych twarzy. Daje natychmiastową poprawę owalu, wygładzenie zmarszczek oraz młody, wypoczęty wygląd.",
                        image: "/src/assets/images/facial_acupuncture_led_1785534009485.jpg",
                        actionUrl: "/neurolifting/",
                        cta: "Dowiedz się więcej"
                      },
                      {
                        id: "how_help_sensitive_skin",
                        title: "Terapia skóry wrażliwej",
                        desc: "Kojenie, intensywna regeneracja bariery hydrolipidowej i odbudowa immunologicznego komfortu skóry. Działamy łagodnie, lecz z maksymalną skutecznością bionomiczną.",
                        image: "/how_help_sensitive_skin.png",
                        actionUrl: "/terapia-skory-wrazliwej-i-reaktywnej/",
                        cta: "Dowiedz się więcej"
                      }
                    ].map((card, index) => (
                      <div 
                        key={index} 
                        className="group bg-white/40 border border-luxury-sand p-4 rounded-sm flex flex-col justify-between space-y-4 hover:border-luxury-gold/50 hover:shadow-xs transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        <div className="space-y-4 text-center">
                          {/* Materiał wideo / Zdjęcie z aktywną podmianą */}
                          <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-luxury-dark/5 border border-luxury-sand/20">
                            <EditableImage
                              id={card.id}
                              slotName={`Jak możemy Ci pomóc: ${card.title}`}
                              src={customTreatmentImages[card.id] || card.image}
                              fallbackSrc={card.image}
                              alt={`${card.title} - Terapie i Zabiegi na twarz Jelcz-Laskowice`}
                              className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                              aspectRatioClass="h-full w-full"
                              onImageChange={(id, newUrl) => {
                                setCustomTreatmentImages(prev => ({ ...prev, [id]: newUrl }));
                              }}
                            >
                              {!customTreatmentImages[card.id] && 'video' in card && card.video && (
                                <video
                                  src={card.video as string}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  poster={card.image}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLVideoElement).style.display = 'none';
                                  }}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </EditableImage>
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-serif text-sm font-medium text-luxury-dark group-hover:text-luxury-gold transition-colors duration-300 min-h-[40px] flex items-center justify-center">
                              {card.title}
                            </h3>
                            <p className="text-[11px] leading-relaxed text-luxury-dark/95 font-light min-h-[72px]">
                              {card.desc}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button 
                            onClick={() => handleLinkClick(card.actionUrl)}
                            className="w-full py-2 border border-luxury-sand group-hover:border-luxury-gold text-[10px] font-mono uppercase tracking-[0.2em] text-luxury-dark hover:text-white hover:bg-luxury-gold/90 bg-transparent transition-all duration-300 rounded-sm cursor-pointer"
                          >
                            {card.cta}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sekcja: Jak prowadzimy Cię krok po kroku - WYRÓŻNIONA KROK PO KROKU DLA KLIENTA */}
                  <div className="my-20 p-8 md:p-14 bg-luxury-dark border-2 border-luxury-gold rounded-md max-w-5xl mx-auto px-6 md:px-12 text-center animate-fade-in shadow-[0_22px_60px_rgba(4,37,31,0.15)] relative overflow-hidden" id="timeline-highlighted">
                    {/* Floating gold aesthetic accents */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-luxury-gold/15 blur-2xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-luxury-gold/15 blur-2xl rounded-full pointer-events-none" />
                    <div className="absolute top-4 right-4 bg-luxury-gold/20 border border-luxury-gold/60 text-[8px] font-mono tracking-widest text-brand-gold-light uppercase px-2.5 py-1 rounded-full z-20">
                      Standard Opieki Slow Skin Concept
                    </div>

                    <div className="space-y-3 relative z-10">
                      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-brand-gold-light uppercase block font-semibold text-center h-4">
                        Ścieżka Terapii Slow Skin
                      </span>
                      <h3 className="font-serif text-[36px] font-light text-white text-center tracking-tight leading-none">
                        Jak prowadzimy Cię krok po kroku
                      </h3>
                      <div className="w-12 h-[1px] bg-luxury-gold/60 mx-auto mt-2" />
                    </div>

                    {/* Timeline Container */}
                    <div className="relative pt-6 z-10">
                      {/* Łącząca przerywana linia poziomowa na desktop */}
                      <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent z-0" />

                      {/* Łącząca przerywana linia pionowa na mobile */}
                      <div className="block md:hidden absolute left-[38px] top-6 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent z-0" />

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-6 relative z-10">
                        {[
                          {
                            step: 1,
                            title: "Rozmowa i analiza potrzeb",
                            icon: <MessageSquare className="w-5 h-5 text-luxury-gold" strokeWidth={1.2} />
                          },
                          {
                            step: 2,
                            title: "Diagnostyka skóry",
                            icon: <Activity className="w-5 h-5 text-luxury-gold" strokeWidth={1.2} />
                          },
                          {
                            step: 3,
                            title: "Dobór kierunku terapii",
                            icon: <ClipboardList className="w-5 h-5 text-luxury-gold" strokeWidth={1.2} />
                          },
                          {
                            step: 4,
                            title: "Zakupy i pielęgnacja domowa",
                            icon: <FlaskConical className="w-5 h-5 text-luxury-gold" strokeWidth={1.2} />
                          },
                          {
                            step: 5,
                            title: "Kontrola efektów i kolejne kroki",
                            icon: <TrendingUp className="w-5 h-5 text-luxury-gold" strokeWidth={1.2} />
                          }
                        ].map((stepItem, idx) => (
                          <div 
                            key={idx} 
                            className="flex flex-row md:flex-col items-center md:items-center space-x-6 md:space-x-0 md:space-y-4 group text-left md:text-center relative py-2 px-1 rounded-sm transition-all duration-300 pointer-events-auto"
                          >
                            {/* Duża konturowa cyfra szeryfowa w tle (Luxury Serif Outline Number with Overlay Effect) */}
                            <div className="absolute -top-6 md:-top-10 left-3 md:left-1/2 md:-translate-x-1/2 font-serif text-[72px] md:text-[88px] font-thin select-none pointer-events-none text-transparent leading-none z-0 transition-all duration-700 [WebkitTextStroke:1px_rgba(215,193,139,0.22)] group-hover:[WebkitTextStroke:1.5px_rgba(215,193,139,0.6)] group-hover:scale-110 group-hover:-translate-y-1">
                              0{stepItem.step}
                            </div>

                            {/* Koło z ikoną i dwiema luksusowymi ramkami nałożonymi na cyfrę */}
                            <div className="flex-shrink-0 relative flex items-center justify-center z-10">
                              <div className={`w-14 h-14 rounded-full border border-luxury-gold/50 flex items-center justify-center transition-all duration-500 shadow-md group-hover:border-white group-hover:shadow-lg ${
                                stepItem.step === 1 ? "bg-[#D8DDD3]" : 
                                stepItem.step === 2 ? "bg-[#EFE7D8]" : 
                                stepItem.step === 3 ? "bg-[#D8B7A3]" : 
                                stepItem.step === 4 ? "bg-[#D8DDD3]" : "bg-[#EFE7D8]"
                              }`}>
                                {/* Inner dashed micro-border for luxury accent */}
                                <div className="absolute inset-1 rounded-full border border-dashed border-luxury-dark/15 group-hover:border-luxury-dark/35 transition-colors duration-500" />
                                <div className="z-10 group-hover:scale-110 transition-transform duration-500 text-luxury-charcoal">
                                  {stepItem.icon}
                                </div>
                              </div>
                            </div>

                            {/* Kontener na tekst nałożony / wyrównany */}
                            <div className="flex flex-col space-y-1 relative z-10 flex-grow md:pt-2">
                              {/* Subtelna nadkafla */}
                              <span className="font-mono text-[10px] tracking-[0.2em] text-[#D7C18B] uppercase">KROK 0{stepItem.step}</span>
                              {/* Tytuł kroku */}
                              <h4 className="font-serif text-[13px] md:text-[14px] font-medium text-luxury-cream/90 group-hover:text-luxury-gold transition-colors duration-300 leading-snug md:max-w-[150px]">
                                {stepItem.title}
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* PROPOZYCJA 1: NOWA SEKCJA Rozwiewamy Obawy & Bezpieczeństwo (Safe-Space Concierge) */}
                <section className="pt-20 pb-16 border-t border-luxury-sand/30 bg-[#fbf9f5]/60 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0" id="trust-fears-reassurance">
                  <div className="max-w-5xl mx-auto space-y-12">
                    
                    {/* Header sekcji */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">
                        Gwarancja Spokoju &amp; Bezpieczeństwa
                      </span>
                      <h2 className="font-serif text-[36px] md:text-[36px] font-light text-luxury-dark tracking-tight leading-tight">
                        Wyciszamy obawy. Poznaj zasady Slow Skin
                      </h2>
                      <div className="w-12 h-[1px] bg-luxury-gold/40 mx-auto mt-2" />
                      <p className="text-xs md:text-sm text-luxury-dark/95 max-w-xl mx-auto leading-relaxed">
                        Oddanie swojej twarzy w nowe ręce budzi naturalną ostrożność. Poznaj zasady, którymi kierujemy się w naszym Instytucie, by zapewnić Ci 100% bezpieczeństwa i pełen komfort.
                      </p>
                    </div>

                    {/* Dwukolumnowa sekcja interaktywna */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                      
                      {/* Lewa kolumna: Lista Najczęstszych Obaw */}
                      <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
                        <div className="space-y-3 text-left">
                          <span className="font-mono text-[10px] tracking-wider text-luxury-gold/75 uppercase block mb-1">
                            Wybierz obawę, którą chciałabyś rozwiać:
                          </span>
                          {[
                            {
                              id: 0,
                              title: "Moja skóra jest bardzo wrażliwa. Czy zabieg jej nie podrażni?",
                              label: "Wrażliwość & Podrażnienia"
                            },
                            {
                              id: 1,
                              title: "Jak będę wyglądać od razu po wyjściu? Obawiam się 'czerwonej twarzy'.",
                              label: "Wygląd po zabiegu"
                            },
                            {
                              id: 2,
                              title: "Drogie i nieskuteczne kwaszenia. Skąd mam pewność, że to zadziała?",
                              label: "Skuteczność & Dobór"
                            },
                            {
                              id: 3,
                              title: "Zupełnie się nie znam. Czy otrzymam jasne instrukcje do domu?",
                              label: "Pielęgnacja po wizycie"
                            }
                          ].map((concern) => (
                            <button
                              key={concern.id}
                              onClick={() => setActiveConcernIdx(concern.id)}
                              className={`w-full text-left p-4 md:p-5 border transition-all duration-300 rounded-none flex items-start gap-4 cursor-pointer group relative overflow-hidden ${
                                activeConcernIdx === concern.id
                                  ? "bg-white border-luxury-gold shadow-[0_6px_22px_rgba(179,155,114,0.1)] text-luxury-dark pl-6 md:pl-7 border-l-4 border-l-luxury-gold"
                                  : "bg-white/45 border-luxury-sand/50 hover:bg-white/90 hover:border-luxury-gold/30 text-luxury-dark hover:pl-5"
                              }`}
                            >
                              {/* Element wizualny wykrzyknika/pytania spójny z motywem */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 ${
                                activeConcernIdx === concern.id
                                  ? "bg-luxury-gold/15 text-luxury-gold font-semibold"
                                  : "bg-luxury-sand/15 text-luxury-dark/90 group-hover:bg-luxury-gold/10"
                              }`}>
                                ?
                              </div>
                              <div className="space-y-1">
                                <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block">
                                  Obawa pacjenta #0{concern.id + 1}
                                </span>
                                <h4 className="font-serif text-[13px] md:text-sm font-light leading-snug">
                                  {concern.title}
                                </h4>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Prawa kolumna: Dynamiczna, luksusowo stylizowana odpowiedź eksperta */}
                      <div className="lg:col-span-6 flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeConcernIdx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-[#ebdcb9] p-6 md:p-8 flex flex-col justify-between h-full shadow-[0_12px_36px_rgba(179,155,114,0.06)] text-left relative overflow-hidden"
                          >
                            {/* Subtelny certyfikowany stempel kliniczny (Quiet Luxury Insignia Seal Watermark) */}
                            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full border border-dashed border-luxury-gold/15 flex items-center justify-center font-mono text-[6.5px] text-luxury-gold/25 uppercase select-none pointer-events-none tracking-[0.2em] leading-none rotate-12 z-0">
                              <span className="block text-center p-4 font-serif">SLOW<br/>SKIN<br/>TRUST</span>
                            </div>

                            <div className="space-y-5 relative z-10">
                              {/* Header Odpowiedzi */}
                              <div className="flex items-center gap-3 border-b border-luxury-sand/30 pb-4">
                                <div className="p-2 rounded-full bg-luxury-gold/10 text-luxury-gold shrink-0">
                                  <Shield className="w-4 h-4" strokeWidth={1.5} />
                                </div>
                                <div>
                                  <span className="font-mono text-[8px] tracking-widest text-[#a89060] uppercase block font-semibold">
                                    {activeConcernIdx === 0 ? "Uważna Opieka nad Skórą" : "Nasza Gwarancja Bezpieczeństwa"}
                                  </span>
                                  <h3 className="font-serif text-base font-light text-luxury-dark">
                                    {activeConcernIdx === 0 && "Moja skóra jest bardzo wrażliwa"}
                                    {activeConcernIdx === 1 && "Obawa przed nieestetyczną pompą"}
                                    {activeConcernIdx === 2 && "Trafna diagnoza zamiast loterii"}
                                    {activeConcernIdx === 3 && "Twoja nawigacja krok po kroku"}
                                  </h3>
                                </div>
                              </div>

                              {/* Główna odpowiedź bionomiczna */}
                              <div className="space-y-4 leading-relaxed">
                                {activeConcernIdx === 0 && (
                                  <>
                                    <p className="text-xs md:text-[13px] text-luxury-dark font-serif leading-relaxed italic">
                                      „Każda skóra ma swoją tolerancję. W Slow Skin Concept dobieram pielęgnację z uważnością na jej potrzeby, reakcje i aktualną kondycję.”
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Jeśli Twoja skóra piecze, jest ściągnięta, sucha lub łatwo się czerwieni, potrzebuje uważnego podejścia. Wizytę rozpoczynam od rozmowy i oceny jej kondycji. Uwzględniam dotychczasową pielęgnację oraz odczucia, które towarzyszą Ci na co dzień.
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Przebieg zabiegu i kompozycję składników dobieram indywidualnie, korzystając z szerokiej gamy formuł biomimetycznych. Gdy skóra jest podrażniona, zaczynam od pielęgnacji wspierającej ukojenie, nawilżenie i barierę naskórkową. Kolejne działania dopasowuję do jej tolerancji i reakcji.
                                    </p>
                                  </>
                                )}

                                {activeConcernIdx === 1 && (
                                  <>
                                    <p className="text-xs md:text-[13px] text-luxury-dark font-serif leading-relaxed italic">
                                      „Naszym celem jest naturalne, świetliste piękno. Koniec z chowaniem się w domu i czerwoną, łuszczącą się skórą i bólem.”
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Wielu pacjentów kojarzy wizytę u kosmetologa z bólem i koniecznością tygodniowej rekonwalescencji w domu. Metoda Slow Skin opiera się na terapiach bionomicznych o zerowej inwazyjności.
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Dzięki precyzyjnemu wsparciu barierowemu, bezpośrednio po wyjściu z gabinetu Twoja twarz zachwyci doskonałym, naturalnym blaskiem, aksamitną gładkością i pełnym ukojeniem. Śmiało możesz wrócić do swoich codziennych, prestiżowych planów czy spotkań biznesowych.
                                    </p>
                                  </>
                                )}

                                {activeConcernIdx === 2 && (
                                  <>
                                    <p className="text-xs md:text-[13px] text-luxury-dark font-serif leading-relaxed italic">
                                      „Zanim dobierzemy jakąkolwiek terapię, najpierw zajrzymy w głąb Twoich komórek. Badamy, nie zgadujemy.”
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Inwestowanie w przypadkowe, drogie zabiegi polecane w Internecie to najczęstszy błąd. Każda skóra to inny, unikalny ekosystem mineralno-lipidowy.
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Urządzenia komputerowej oceny głębokiej Nati V3 pozwalają nam precyzyjnie zbadać stopień mikrozapalenia, poziom nawilżenia, stan naczyń krwionośnych oraz barierowość lipidową twarzy. Masz absolutną gwarancję, że zaproponowany rytuał uderza precyzyjnie w przyczynę Twojej dolegliwości.
                                    </p>
                                  </>
                                )}

                                {activeConcernIdx === 3 && (
                                  <>
                                    <p className="text-xs md:text-[13px] text-luxury-dark font-serif leading-relaxed italic">
                                      „Wizyta gabinetowa to jedynie half-way do zdrowej skóry. O resztę zadbamy, dając Ci gotową, drukowaną mapę drogową.”
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Wychodzisz z gabinetu i czujesz chaos? Nie pamiętasz, czy dany preparat nakładać rano, wieczorem, czy może w ogóle odstawić? Z nami ten stres znika.
                                    </p>
                                    <p className="text-xs text-luxury-charcoal/95 font-light text-justify leading-relaxed">
                                      Po pierwszej diagnostyce nasz specjalista tworzy dla Ciebie w pełni spersonalizowany, czytelny Plan Pielęgnacyjny (Beauty Plan) w formie drukowanej i cyfrowej. Znajdziesz w nim prosty plan pielęgnacji porannej i wieczornej, wykaz łagodnych składników do wdrożenia oraz pomocne wskazówki wspierające zdrowie skóry.
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Podpis konsjerża & Bezpieczne Checki */}
                            <div className="pt-6 mt-6 border-t border-luxury-sand/30 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-luxury-sand/30 flex items-center justify-center font-serif text-sm text-luxury-gold font-semibold select-none">
                                  K
                                </div>
                                <div className="text-left">
                                  <span className="font-serif text-xs font-semibold text-luxury-dark block leading-none">Katarzyna Brzezińska</span>
                                  <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-wider block mt-1">
                                    {activeConcernIdx === 0 ? "SKINOLOG I ZAŁOŻYCIELKA" : "Skinolog & Założycielka"}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-luxury-dark/95 tracking-wide mt-2">
                                {activeConcernIdx === 0 ? (
                                  <>
                                    <span className="flex items-center gap-1.5">&#10003; Indywidualna pielęgnacja</span>
                                    <span className="flex items-center gap-1.5">&#10003; Ocena kondycji skóry</span>
                                    <span className="flex items-center gap-1.5">&#10003; Uważny dobór zabiegów</span>
                                    <span className="flex items-center gap-1.5">&#10003; Zalecenia domowe</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="flex items-center gap-1.5">&#10003; Formuły bio-zbieżne</span>
                                    <span className="flex items-center gap-1.5">&#10003; 100% bezpieczna stymulacja</span>
                                    <span className="flex items-center gap-1.5">&#10003; Bezbolesna diagnostyka</span>
                                    <span className="flex items-center gap-1.5">&#10003; Stała asysta po-zabiegowa</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                    </div>

                    {/* Quick Box dla niezdecydowanych prowadzący bezpośrednio do decyzji */}
                    <div className="bg-white border border-luxury-gold/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden max-w-5xl mx-auto rounded-sm mt-4">
                      {/* Subtelny złoty pylek jako tło dekoracyjne */}
                      <div className="absolute right-0 top-0 w-32 h-32 bg-luxury-gold/5 blur-2xl rounded-full z-0 pointer-events-none" />
                      
                      <div className="text-left space-y-2 relative z-10 max-w-xl flex-grow">
                        <span className="font-mono text-[8px] tracking-[0.2em] text-luxury-gold uppercase block font-bold leading-none">Masz dodatkowe obawy lub nietypowy przypadek?</span>
                        <h4 className="font-serif text-lg text-luxury-dark leading-snug">Zadzwoń do nas. Rozmowa do niczego nie zobowiązuje.</h4>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                          Nasz konsjerż cierpliwie wysłucha historii Twojej skóry, odpowie na każde pytanie o bezpieczeństwo i podpowie, który krok u nas będzie dla Ciebie najbardziej komfortowy.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0 w-full sm:w-auto">
                        <a
                          href="tel:793088854"
                          className="px-6 h-[46px] bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white transition-all text-[11px] tracking-[0.12em] font-mono uppercase flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-luxury-gold shrink-0" strokeWidth={1.5} />
                          Zadzwoń: 793 088 854
                        </a>
                        <button
                          onClick={() => {
                            setBookingTreatment(TREATMENTS[0]);
                            setBookingConfirmed(false);
                            setBookingName("");
                            setBookingEmail("");
                            setBookingPhone("");
                            setBookingDate("");
                          }}
                          className="px-6 h-[46px] border border-luxury-sand text-luxury-dark hover:bg-luxury-sand/20 transition-all text-[11px] tracking-[0.12em] font-mono uppercase flex items-center justify-center gap-1.5"
                        >
                          <Calendar className="w-4 h-4 text-luxury-gold shrink-0" strokeWidth={1.5} />
                          Konsultacja i diagnoza
                        </button>
                      </div>
                    </div>

                  </div>
                </section>
                {/* KONIEC PROPOZYCJI 1 */}

                {/* PROPOZYCJA 2: Portrety Przemian. Dowód Bionomiczny (Before & After Metamorfozy) (Ulepszenie 2 - High-Contrast Bionomic Study Layout) - WYRÓŻNIONA KROK PO KROKU DLA KLIENTA */}
                <section className="pt-20 pb-20 border-y-2 border-luxury-gold/35 bg-luxury-sand -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 shadow-[0_16px_50px_rgba(179,155,114,0.06)] relative overflow-hidden" id="metamorphosis-before-after">
                  <div className="max-w-5xl mx-auto space-y-12 px-4 sm:px-6">
                    
                    {/* Header sekcji */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">
                        Gabinety Slow Skin w Praktyce
                      </span>
                      <h2 className="font-serif text-[36px] md:text-[36px] font-light text-luxury-dark tracking-tight leading-tight uppercase">
                        Portrety Przemian. Efekty Terapii
                      </h2>
                      <div className="w-16 h-[1px] bg-luxury-gold/50 mx-auto mt-2" />
                      <p className="text-xs md:text-sm text-luxury-dark/95 max-w-xl mx-auto leading-relaxed">
                        Prawdziwa opieka nad skórą nie polega na maskowaniu problemów, lecz na zrozumieniu jej fizjologii i przywróceniu naturalnej równowagi. Poznaj rezultaty uważnej, indywidualnie dobranej pielęgnacji.
                      </p>
                    </div>

                    {/* Zakładki wyboru pacjenta */}
                    <div className="flex flex-wrap justify-center border-b border-luxury-sand/60 pb-1 gap-2 md:gap-8">
                      {[
                        { id: 0, title: "Skóra Reaktywna & Zaczerwieniona", name: "Potrzeby Skóry" },
                        { id: 1, title: "Wiotkość Grawitacyjna", name: "Małgorzata (45 l.)" },
                        { id: 2, title: "Trądzik Dorosłych & Odwodnienie", name: "Aleksandra (28 l.)" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveResultIdx(tab.id);
                            setCompareMode("after"); // Reset view to "after" on patient change
                          }}
                          className={`pb-4 text-xs tracking-wider transition-all relative font-mono cursor-pointer border-b-2 -mb-[1px] ${
                            activeResultIdx === tab.id
                              ? "text-luxury-gold border-luxury-gold font-bold"
                              : "text-luxury-dark/90 border-transparent hover:text-luxury-dark hover:border-luxury-sand/50"
                          }`}
                        >
                          <span className="block text-[8px] opacity-75 leading-none mb-1 font-sans">PRZYPADEK 0{tab.id+1}</span>
                          <span className="text-[11px] md:text-xs">{tab.title}</span>
                          <span className="block text-[10px] font-sans italic opacity-60 mt-0.5">{tab.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Panel szczegółów i interaktywnego porównania */}
                    {(() => {
                      const caseData = [
                        {
                          categoryLabel: "POTRZEBY SKÓRY",
                          name: "Skóra reaktywna i zaczerwieniona",
                          problem: "Pielęgnacja ukierunkowana na komfort skóry i wsparcie bariery naskórkowej.",
                          duration: "Efekt uważnej pielęgnacji",
                          imageBefore: "/src/assets/images/joanna_single_face_before_1786132708495.jpg",
                          imageAfter: "/src/assets/images/joanna_single_face_after_1786132724722.jpg",
                          anatomyLabel: "PUNKT WYJŚCIA",
                          anatomy: "Zaczerwienienie, pieczenie i nadmierna reakcja na kosmetyki wymagają uważnej oceny. Podczas konsultacji analizuję kondycję skóry, jej tolerancję oraz dotychczasową pielęgnację.",
                          remedyLabel: "PIELĘGNACJA W GABINECIE",
                          remedy: "Dobieram łagodne etapy zabiegu oraz indywidualną kompozycję składników wspierających nawilżenie, ukojenie i barierę naskórkową. Rodzaj zabiegu oraz ewentualne wykorzystanie urządzeń zależą od aktualnych potrzeb skóry.",
                          homeCareLabel: "PIELĘGNACJA DOMOWA",
                          homeCare: "Układam spójny plan oczyszczania, pielęgnacji i ochrony przeciwsłonecznej. Zalecenia dostosowuję do tolerancji skóry i jej reakcji na stosowane produkty.",
                          ctaSubtitle: "CHCESZ POZNAĆ POTRZEBY SWOJEJ SKÓRY?",
                          ctaTitle: "Zarezerwuj pierwszą konsultację",
                          buttonText: "Chcę poznać potrzeby swojej skóry →",
                          results: [
                            { label: "Rumień i nadwrażliwość", value: "Ukojenie" },
                            { label: "Nawilżenie i komfort", value: "Równowaga" },
                            { label: "Bariera naskórkowa", value: "Ochrona" }
                          ]
                        },
                        {
                          categoryLabel: "POTRZEBY SKÓRY",
                          name: "Małgorzata, lat 45",
                          problem: "Utrata napięcia tkanek, wiotkość grawitacyjna, spowolniony metabolizm komórkowy",
                          duration: "8 tygodni (3 seanse + terapia domowa)",
                          imageBefore: "/src/assets/images/malgorzata_before_1786129083321.jpg",
                          imageAfter: "/src/assets/images/regenerated_image_1781694290837.png",
                          anatomyLabel: "PUNKT WYJŚCIA",
                          anatomy: "Zaburzenia owalu twarzy, spadek gęstości kolagenu, zmęczony wyraz twarzy, obrzęki limfatyczne w obszarze jarzmowym.",
                          remedyLabel: "PIELĘGNACJA W GABINECIE",
                          remedy: "Masaż rzeźbiarski Myoplasty (manualne opracowanie punktów powięziowych) połączony z peptydowym koktajlem stymulacyjnym o wysokiej biodostępności.",
                          homeCareLabel: "PIELĘGNACJA DOMOWA",
                          homeCare: "Zaawansowany eliksir z peptydami sygnałowymi stymulującymi kolagen typu I i III, lipidowy krem okluzyjny z masłem shea bionomowym.",
                          ctaSubtitle: "INSPIRUJE CIĘ TEN REZULTAT?",
                          ctaTitle: "Zarezerwuj pierwszą konsultację",
                          buttonText: "Chcę zadbać o swoją skórę →",
                          results: [
                            { label: "Uniesienie linii żuchwy (lifting)", value: "Widoczne +4.2mm" },
                            { label: "Redukcja bruzd nosowo-wargowych", value: "o 47%" },
                            { label: "Jędrność i elastyczność skóry", value: "+68%" }
                          ]
                        },
                        {
                          categoryLabel: "POTRZEBY SKÓRY",
                          name: "Aleksandra, lat 28",
                          problem: "Trądzik dorosłych (acne tarda), nadprodukcja sebum przy odwodnieniu naskórka",
                          duration: "5 tygodni (3 seanse oczyszczająco-regulujące)",
                          imageBefore: "/src/assets/images/aleksandra_before_1786129097233.jpg",
                          imageAfter: "/src/assets/images/aleksandra_after_1786129109685.jpg",
                          anatomyLabel: "PUNKT WYJŚCIA",
                          anatomy: "Zablokowane ujścia mieszków włosowych, zmiany zapalne podskórne, skrajne odwodnienie spowodowane wysuszającymi żelami aptecznymi.",
                          remedyLabel: "PIELĘGNACJA W GABINECIE",
                          remedy: "Przywrócenie fizjologicznego pH. Łagodne uwalnianie zanieczyszczeń kwasem salicylowym w nośniku lipidowym, regulacja mikrobiomu i sebostaza komórkowa.",
                          homeCareLabel: "PIELĘGNACJA DOMOWA",
                          homeCare: "Żel bionomowy z olejkiem z drzewa herbacianego (stężenie farmaceutyczne), lekki hydrożel z niacynamidem 4% i kwasem hialuronowym.",
                          ctaSubtitle: "INSPIRUJE CIĘ TEN REZULTAT?",
                          ctaTitle: "Zarezerwuj pierwszą konsultację",
                          buttonText: "Chcę zadbać o swoją skórę →",
                          results: [
                            { label: "Redukcja zmian zapalnych", value: "-89%" },
                            { label: "Wydzielanie sebum (sebostaza)", value: "-52%" },
                            { label: "Gładkość i wyrównanie tekstury", value: "+74%" }
                          ]
                        }
                      ][activeResultIdx];

                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2 text-left bg-transparent">
                          
                          {/* Lewo: Interaktywny Widget Suwaka Przed / Po */}
                          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                            <BeforeAfterSlider
                              imageBefore={caseData.imageBefore}
                              imageAfter={caseData.imageAfter}
                              altBefore={`Stan przed terapią - ${caseData.name}`}
                              altAfter={`Stan po terapii - ${caseData.name}`}
                              duration={caseData.duration}
                            />

                            {/* Kluczowe wskaźniki pod obrazkiem dla wyjątkowej czytelności mierzalnej */}
                            <div className="grid grid-cols-3 gap-3">
                              {caseData.results.map((res, i) => (
                                <div key={i} className="bg-white border border-luxury-sand/65 p-4 text-center shadow-xs rounded-none transition-all duration-300 hover:border-luxury-gold hover:shadow-[0_4px_16px_rgba(179,155,114,0.08)] relative overflow-hidden group">
                                  {/* Hairline interactive indicator */}
                                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-luxury-gold transition-all duration-300 group-hover:w-full" />
                                  <span className="font-serif text-xl md:text-2xl font-light text-luxury-gold block leading-none tracking-tight">
                                    {res.value}
                                  </span>
                                  <span className="font-mono text-[8.5px] tracking-[0.1em] text-luxury-dark/95 uppercase block mt-2.5 leading-snug">
                                    {res.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Prawo: Analiza Kliniczna Przypadku & Przepis */}
                          <div className="lg:col-span-6 flex flex-col justify-between bg-white border border-[#ebdcb9] p-6 md:p-8 space-y-6 shadow-lg rounded-none relative overflow-hidden">
                            {/* Decorative luxury watermark */}
                            <div className="absolute top-4 right-4 text-luxury-gold/20 pointer-events-none select-none">
                              <Sparkles className="w-16 h-16 opacity-[0.08] stroke-[0.5]" />
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                              <div className="border-b border-luxury-sand pb-3">
                                <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block">
                                  {caseData.categoryLabel || "Analiza Pacjenta"}
                                </span>
                                <h3 className="font-serif text-xl font-light text-luxury-dark">{caseData.name}</h3>
                                <p className="text-xs font-serif text-luxury-gold italic mt-1">{caseData.problem}</p>
                              </div>

                              <div className="space-y-3 font-sans text-xs text-luxury-dark/95">
                                <div className="space-y-1">
                                  <span className="font-mono text-[9px] tracking-wider text-luxury-gold uppercase font-bold block">
                                    {caseData.anatomyLabel || "Punkt Wyjścia"}
                                  </span>
                                  <p className="font-light leading-relaxed text-justify">{caseData.anatomy}</p>
                                </div>

                                <div className="space-y-1 pt-1">
                                  <span className="font-mono text-[9px] tracking-wider text-luxury-gold uppercase font-bold block">
                                    {caseData.remedyLabel || "Pielęgnacja w Gabinecie"}
                                  </span>
                                  <p className="font-light leading-relaxed text-justify bg-luxury-sand/30 p-4 border-l-2 border-luxury-gold text-luxury-dark/95 text-xs italic">{caseData.remedy}</p>
                                </div>

                                <div className="space-y-1 pt-1">
                                  <span className="font-mono text-[9px] tracking-wider text-luxury-gold uppercase font-bold block">
                                    {caseData.homeCareLabel || "Pielęgnacja Domowa"}
                                  </span>
                                  <p className="font-light leading-relaxed text-justify">{caseData.homeCare}</p>
                                </div>
                              </div>
                            </div>

                            {/* Przycisk konwersji celowanej do danego przypadku */}
                            <div className="pt-6 border-t border-luxury-sand/40 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                              <div className="text-left">
                                <span className="font-mono text-[8.5px] tracking-wider text-luxury-dark/90 uppercase block">
                                  {caseData.ctaSubtitle || "Inspiruje Cię ten rezultat?"}
                                </span>
                                <span className="font-serif text-xs text-luxury-dark font-semibold block mt-1.5">
                                  {caseData.ctaTitle || "Zarezerwuj pierwszą wizytę z diagnozą"}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setBookingTreatment(TREATMENTS[0]); // Zawsze zaczynamy od diagnostyki jako klucza Slow Skin
                                  setBookingConfirmed(false);
                                  setBookingName("");
                                  setBookingEmail("");
                                  setBookingPhone("");
                                  setBookingDate("");
                                }}
                                className="px-5 py-3 bg-luxury-gold hover:bg-luxury-dark text-white hover:text-luxury-cream font-mono text-[10px] tracking-wider uppercase transition-all whitespace-nowrap leading-none shrink-0 cursor-pointer font-semibold rounded-none shadow-xs"
                              >
                                {caseData.buttonText || "Chcę zbadać swoją skórę →"}
                              </button>
                            </div>

                          </div>

                        </div>
                      );
                    })()}

                  </div>
                </section>
                {/* KONIEC PROPOZYCJI 2 */}
 
                {/* PROPOZYCJA 3: Interaktywny Szybki Test Doboru Rytuału (Wirtualny Doradca Komórkowy Slow Skin) - WYRÓŻNIONA KROK PO KROKU DLA KLIENTA */}
                <section className="pt-20 pb-20 border-y-2 border-luxury-gold/35 bg-luxury-cream -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 shadow-[0_16px_50px_rgba(179,155,114,0.06)] relative overflow-hidden" id="ritual-finder-quiz">
                  <div className="max-w-5xl mx-auto space-y-12">
                    
                    {/* Header sekcji */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">
                        Twoja Zindywidualizowana Ścieżka
                      </span>
                      <h2 className="font-serif text-[36px] md:text-[36px] font-light text-luxury-dark tracking-tight leading-tight">
                        Wirtualny Doradca Komórkowy. Dobierz swój Rytuał
                      </h2>
                      <div className="w-12 h-[1px] bg-luxury-gold/40 mx-auto mt-2" />
                      <p className="text-xs md:text-sm text-luxury-dark/95 max-w-xl mx-auto leading-relaxed">
                        Nie wiesz, od którego kroku zacząć i jaki zabieg będzie bezpieczny dla Twojej bariery lipidowej? Odpowiedz na 3 szybkie pytania fizjologiczne. Nasz algorytm wyselekcjonuje zabieg skrojony na miarę.
                      </p>
                    </div>

                    {/* Główny kontener kwestionariusza (Luxury Certified Diagnostics Mockup Layout) */}
                    <div className="bg-white border border-luxury-gold/30 p-6 md:p-12 shadow-[0_24px_54px_rgba(179,155,114,0.08),inset_0_1px_3px_rgba(255,255,255,0.9)] text-left max-w-4xl mx-auto relative overflow-hidden rounded-none">
                      {/* Płynne i rozświetlone tło holograficzne bionomiczne */}
                      <div className="absolute top-0 right-0 w-80 h-80 bg-luxury-gold/5 blur-[90px] rounded-full pointer-events-none select-none" />
                      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ebdcb9]/15 blur-[100px] rounded-full pointer-events-none select-none" />
                      
                      {/* Precyzyjne narożniki badawcze (Cell-Precise Hairline Diagnostics Corner Brackets) */}
                      <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-luxury-gold/40 pointer-events-none z-10" />
                      <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-luxury-gold/40 pointer-events-none z-10" />
                      <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-luxury-gold/40 pointer-events-none z-10" />
                      <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-luxury-gold/40 pointer-events-none z-10" />

                      {/* START SCREEN (KROK 0) */}
                      {quizStep === 0 && (
                        <div className="text-center py-6 md:py-10 max-w-xl mx-auto space-y-6 relative z-10 animate-fade-in animate-duration-300">
                          <div className="w-12 h-12 rounded-full border border-luxury-sand flex items-center justify-center mx-auto text-luxury-gold">
                            <HelpCircle className="w-5 h-5" strokeWidth={1.3} />
                          </div>
                          <div className="space-y-2">
                            <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block">Bezpieczeństwo &amp; Uważność</span>
                            <h3 className="font-serif text-xl md:text-2xl font-light text-luxury-dark">Dobór Zabiegu w 30 sekund</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Ten prosty kwestionariusz analizuje poziom wrażliwości receptorowej Twojej skóry, stopień odwodnienia i najważniejszy cel estetyczno-barierowy. Pomoże Ci to podjąć decyzję w 100% bezpieczną i biomimetyczną.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setQuizStep(1);
                              setQuizConcern(null);
                              setQuizSensitivity(null);
                              setQuizGoal(null);
                            }}
                            className="px-8 py-3.5 bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white transition-all text-xs font-mono tracking-widest uppercase cursor-pointer rounded-none mx-auto block"
                          >
                            Rozpocznij dobór rytuału &rarr;
                          </button>
                        </div>
                      )}

                      {/* KROK 1: CONCERN (OBJAW / NIEPOKÓJ) */}
                      {quizStep === 1 && (
                        <div className="space-y-6 relative z-10 animate-fade-in animate-duration-300">
                          <div className="flex justify-between items-center border-b border-luxury-sand/30 pb-4">
                            <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-wider">Pytanie 1 z 3</span>
                            <span className="font-mono text-[9px] text-luxury-dark/90 uppercase tracking-wider">KONDYCJA OGÓLNA</span>
                          </div>
                          <h3 className="font-serif text-lg md:text-xl font-light text-luxury-dark">
                            Co najbardziej niepokoi Twoją skórę na co dzień?
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {[
                              { id: "redness", title: "Zaczerwienienie, reaktywność i stałe uczucie ściągnięcia", desc: "Skóra łatwo reaguje rumieniem na czynniki zewnętrzne, bywa sucha i szorstka w dotyku." },
                              { id: "aging", title: "Utrata jędrności, wiotkość i spadek elastyczności owalu", desc: "Zauważasz opadające kąciki, zmęczony wyraz twarzy i spadek sprężystości struktur." },
                              { id: "congestion", title: "Zanieczyszczenia, nierówna struktura i nadmierne świecenie", desc: "Problem z zaskórnikami, rozszerzonymi porami lub drobnymi zmianami o charakterze zapalnym." },
                              { id: "dullness", title: "Szary, ziemisty koloryt i brak naturalnego blasku", desc: "Skóra wygląda na zmęczoną, matową, brakuje jej świeżości pod wpływem stresu lub braku snu." }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setQuizConcern(opt.id);
                                  setQuizStep(2);
                                }}
                                className="text-left p-5 border border-luxury-sand/50 hover:border-luxury-gold hover:bg-luxury-sand/5 transition-all cursor-pointer group flex flex-col justify-between h-full bg-white/50"
                              >
                                <div>
                                  <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block mb-1">Objaw A0{opt.id === "redness" ? 1 : opt.id === "aging" ? 2 : opt.id === "congestion" ? 3 : 4}</span>
                                  <h4 className="font-serif text-sm font-medium text-luxury-dark group-hover:text-luxury-gold transition-colors">{opt.title}</h4>
                                </div>
                                <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed mt-2">{opt.desc}</p>
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <button onClick={() => setQuizStep(0)} className="text-[10px] font-mono uppercase text-luxury-dark/90 hover:text-luxury-dark tracking-wider cursor-pointer">Anuluj</button>
                            <div className="h-1.5 w-24 bg-luxury-sand/30 rounded-full overflow-hidden">
                              <div className="h-full bg-luxury-gold w-1/3" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* KROK 2: SENSITIVITY (WRAŻLIWOŚĆ) */}
                      {quizStep === 2 && (
                        <div className="space-y-6 relative z-10 animate-fade-in animate-duration-300">
                          <div className="flex justify-between items-center border-b border-luxury-sand/30 pb-4">
                            <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-wider">Pytanie 2 z 3</span>
                            <span className="font-mono text-[9px] text-luxury-dark/90 uppercase tracking-wider">STOPIEŃ WRAŻLIWOŚCI RECEPTOROWEJ</span>
                          </div>
                          <h3 className="font-serif text-lg md:text-xl font-light text-luxury-dark">
                            Jak oceniasz stopień wrażliwości swojej twarzy?
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {[
                              { id: "high", title: "Skrajnie wrażliwa", desc: "Często piecze lub swędzi po nałożeniu przypadkowego kremu lub po kontakcie z wodą kranową." },
                              { id: "medium", title: "Przejściowo reaktywna", desc: "Reaguje rumieniem na stres, wiatr, zmianę temperatur czy alkohol, ale po chwili uspokaja się." },
                              { id: "low", title: "Odporna i stabilna", desc: "Bardzo rzadko ulega podrażnieniom, dobrze toleruje peelingi i lubi aktywne, manualne uciskanie." }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setQuizSensitivity(opt.id);
                                  setQuizStep(3);
                                }}
                                className="text-left p-5 border border-luxury-sand/50 hover:border-luxury-gold hover:bg-luxury-sand/5 transition-all cursor-pointer group flex flex-col justify-between h-full bg-white/50"
                              >
                                <div>
                                  <span className="font-mono text-[8px] tracking-widest text-[#a89060] uppercase block mb-1">Poziom {opt.id === "high" ? "Krytyczny" : opt.id === "medium" ? "Umiarkowany" : "Stabilny"}</span>
                                  <h4 className="font-serif text-sm font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">{opt.title}</h4>
                                </div>
                                <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed mt-3">{opt.desc}</p>
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <button onClick={() => setQuizStep(1)} className="text-[10px] font-mono uppercase text-luxury-dark/90 hover:text-luxury-dark tracking-wider cursor-pointer">&larr; Wstecz</button>
                            <div className="h-1.5 w-24 bg-luxury-sand/30 rounded-full overflow-hidden">
                              <div className="h-full bg-luxury-gold w-2/3" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* KROK 3: GOAL (OCZEKIWANIA / CEL) */}
                      {quizStep === 3 && (
                        <div className="space-y-6 relative z-10 animate-fade-in animate-duration-300">
                          <div className="flex justify-between items-center border-b border-luxury-sand/30 pb-4">
                            <span className="font-mono text-[9px] text-luxury-gold uppercase tracking-wider">Pytanie 3 z 3</span>
                            <span className="font-mono text-[9px] text-luxury-dark/90 uppercase tracking-wider">MAKSYMALNY PRIORYTET ESTETYCZNY</span>
                          </div>
                          <h3 className="font-serif text-lg md:text-xl font-light text-luxury-dark">
                            Jaki efekt z pierwszej wizyty dałby Ci największe poczucie ulgi i zadowolenia?
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {[
                              { id: "calm", title: "Natychmiastowe ukojenie i odbudowa bariery ochronnej", desc: "Chcę, by skóra przestała piec, zyskała gładkość i naturalne, zdrowe nawodnienie." },
                              { id: "lift", title: "Widoczne napięcie owalu, ujędrnienie i lifting tkanek", desc: "Marzę o uniesieniu policzków, spłyceniu bruzd i zredukowaniu widocznego zmęczenia twarzy." },
                              { id: "purify", title: "Głębokie oczyszczenie bez podrażnień i suchości", desc: "Chcę uwolnić skórę od zalegającego sebum, wygładzić rozszerzone pory i odzyskać lekkość." }
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setQuizGoal(opt.id);
                                  setQuizStep(4);
                                }}
                                className="text-left p-5 border border-luxury-sand/50 hover:border-luxury-gold hover:bg-luxury-sand/5 transition-all cursor-pointer group flex flex-col justify-between h-full bg-white/50"
                              >
                                <div>
                                  <span className="font-mono text-[8px] tracking-widest text-[#a89060] uppercase block mb-1">Priorytet {opt.id === "calm" ? "Kojący" : opt.id === "lift" ? "Strukturalny" : "Detoksykujący"}</span>
                                  <h4 className="font-serif text-sm font-semibold text-luxury-dark group-hover:text-luxury-gold transition-colors">{opt.title}</h4>
                                </div>
                                <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed mt-3">{opt.desc}</p>
                              </button>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <button onClick={() => setQuizStep(2)} className="text-[10px] font-mono uppercase text-luxury-dark/90 hover:text-luxury-dark tracking-wider cursor-pointer">&larr; Wstecz</button>
                            <div className="h-1.5 w-24 bg-luxury-sand/30 rounded-full overflow-hidden">
                              <div className="h-full bg-luxury-gold w-[100%]" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* WYNIK ANALIZY (KROK 4) */}
                      {quizStep === 4 && (
                        <div className="space-y-6 relative z-10 animate-fade-in animate-duration-300 text-left">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-luxury-sand/30 pb-4 gap-2">
                            <div>
                              <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block font-bold">ANALIZA UKOŃCZONA BEZBŁĘDNIE</span>
                              <h3 className="font-serif text-lg font-light text-luxury-dark">Twój bionomiczny paszport zalecen</h3>
                            </div>
                            <button
                              onClick={() => setQuizStep(0)}
                              className="font-mono text-[10px] uppercase text-luxury-gold hover:text-luxury-dark tracking-widest transition-colors cursor-pointer"
                            >
                              Rozpocznij od nowa
                            </button>
                          </div>

                          {(() => {
                            // Dynamic selector logic for Propozycja 3
                            const getRecommendation = () => {
                              if (quizConcern === "redness" || quizSensitivity === "high" || quizGoal === "calm") {
                                return {
                                  treatment: TREATMENTS[0], // Slow Skin Concept — Pierwsza Wizyta
                                  badge: "ZAWARTOŚĆ KOJĄCO-REGENERACYJNA",
                                  reason: "Z uwagi na zarejestrowaną skłonność do podrażnień i naruszoną stabilność barierową (pod wpływem czynników zewnętrznych), Twoja skóra bezwzględnie wymaga najpierw bezpiecznego wyciszenia stanu mikrozapalnego. Unikamy agresywnych pilingów. Najlepiej sprawdzi się nasza pełna diagnoza z rytuałem otwierającym, który przygotuje naskórek do precyzyjnej i bezbolesnej terapii."
                                };
                              }
                              if (quizConcern === "aging" || quizGoal === "lift") {
                                return {
                                  treatment: TREATMENTS.find(t => t.id === "neurolifting-nogier") || TREATMENTS[0],
                                  badge: "STYMULACJA STRUKTURALNA POWIĘZIOWA",
                                  reason: "Twoja skóra wykazuje stabilność barierową i jest idealnym pretendentem do głębokiej stymulacji kolagenu oraz liftingu powięziowego. Masaż Neuroliftingu Nogiera w unikalnej synergii manualnej pozwoli nam uwolnić blokady napięciowe karku i mięśni mimicznych, widocznie korygując owal twarzy i dając naturalny, młodzieńczy wygląd."
                                };
                              }
                              if (quizConcern === "congestion" || quizGoal === "purify") {
                                return {
                                  treatment: TREATMENTS.find(t => t.id === "hydrogen-purification") || TREATMENTS[0],
                                  badge: "FIZJOLOGICZNE OCZYSZCZANIE KOMÓRKOWE",
                                  reason: "Priorytetem dla Twojego naskórka jest usunięcie zanieczyszczeń, sebostaza i mikrobiologiczny reset. Fizjologiczne oczyszczanie wodorowe bez bolesnego ucisku doskonale wpisuje się w tę potrzebę – usunie wolne rodniki, wygładzi keratynizację oraz dogłębnie nawilży Twoją twarz okluzją biomimetyczną."
                                };
                              }
                              // Default to Amber Regeneration
                              return {
                                treatment: TREATMENTS.find(t => t.id === "amber-regeneration") || TREATMENTS[0],
                                badge: "REGENERUJĄCA TERAPIA ROZŚWIETLAJĄCA",
                                reason: "Twoja skóra potrzebuje dotlenienia, wygładzenia i naturalnego rozświetlenia. Bursztynowa Regeneracja dostarczy składników odżywczych (kwas bursztynowy, witamina C) oraz ceramidów, pomagając przywrócić cerze świeżość, zdrowy blask i miękkość."
                              };
                            };

                            const rec = getRecommendation();

                            return (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                                {/* Lewa kolumna: Szczegóły rekomendowanego zabiegu */}
                                <div className="lg:col-span-5 flex flex-col justify-between">
                                  <div className="relative aspect-[4/5] bg-luxury-dark overflow-hidden border border-luxury-sand group shadow-sm">
                                    <img
                                      src={rec.treatment.image}
                                      alt={rec.treatment.title}
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute top-4 left-4 z-10 bg-luxury-dark/85 text-luxury-cream text-[9px] font-mono tracking-widest uppercase px-3 py-1.5">
                                      {rec.badge}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 border border-luxury-sand p-4 text-left">
                                      <span className="font-mono text-[8px] tracking-wider text-luxury-gold uppercase block">ZALECANY CZAS I CENA</span>
                                      <div className="flex justify-between items-center mt-1">
                                        <span className="font-serif text-sm text-luxury-dark font-medium">{rec.treatment.duration}</span>
                                        <span className="font-mono text-xs text-luxury-gold font-semibold">{rec.treatment.price}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Prawa kolumna: Profesjonalne uzasadnienie i Direct Booking */}
                                <div className="lg:col-span-7 flex flex-col justify-between bg-[#fbf9f5] border border-luxury-sand p-6 md:p-8 space-y-6 animate-fade-in animate-duration-300">
                                  <div className="space-y-5">
                                    <div className="border-b border-luxury-sand/30 pb-3 text-left">
                                      <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block font-bold">Rytuał Skrojony Na Miarę</span>
                                      <h3 className="font-serif text-xl md:text-2xl font-light text-luxury-dark mt-0.5">{rec.treatment.title}</h3>
                                      <p className="text-xs text-luxury-dark/95 font-light mt-1">{rec.treatment.subtitle}</p>
                                    </div>

                                    <div className="space-y-4">
                                      <div className="space-y-1.5">
                                        <span className="font-mono text-[9px] tracking-wider text-[#a89060] uppercase block font-semibold">Dlaczego ta formuła bionomowa zadziała:</span>
                                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed text-justify bg-white p-4 border border-luxury-sand/35 rounded-sm shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                                          {rec.reason}
                                        </p>
                                      </div>

                                      <div className="space-y-1.5 pt-1">
                                        <span className="font-mono text-[9px] tracking-wider text-[#a89060] uppercase block font-semibold">Główny cel estetyczno-barierowy:</span>
                                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed text-justify">{rec.treatment.description}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-6 border-t border-luxury-sand/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-left w-full sm:w-auto">
                                      <span className="font-mono text-[8px] tracking-wider text-luxury-dark/90 uppercase block leading-none">PEWNOŚĆ, BEZPIECZEŃSTWO I KOMFORT</span>
                                      <span className="font-serif text-[13px] text-luxury-dark font-medium block mt-1">Zarezerwuj wizytę w gabinecie</span>
                                    </div>
                                    
                                    <button
                                      onClick={() => {
                                        setBookingTreatment(rec.treatment);
                                        setBookingConfirmed(false);
                                        setBookingName("");
                                        setBookingEmail("");
                                        setBookingPhone("");
                                        setBookingDate("");
                                        
                                        // Płynne przewinięcie na dół do formularza rezerwacji
                                        const formElem = document.getElementById("booking-card-element");
                                        if (formElem) {
                                          formElem.scrollIntoView({ behavior: "smooth", block: "center" });
                                        }
                                      }}
                                      className="w-full sm:w-auto px-6 py-4 bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white font-mono text-xs tracking-widest uppercase transition-all whitespace-nowrap leading-none shrink-0 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                      <Calendar className="w-4 h-4 text-luxury-gold animate-pulse" />
                                      Zarezerwuj wizytę w gabinecie &rarr;
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                        </div>
                      )}

                    </div>

                  </div>
                </section>
                {/* KONIEC PROPOZYCJI 3 */}

                {/* PROPOZYCJA 4: Interaktywny Dobowy Planer Rytmu Skóry */}
                <section 
                  className="mt-20 pt-16 pb-16 px-6 md:px-12 border border-[#ebdcb9]/30 bg-gradient-to-br from-[#fbf9f5] via-white to-[#FAF8F5] space-y-12 animate-fade-in relative overflow-hidden shadow-[0_20px_48px_rgba(179,155,114,0.04)]" 
                  id="circadian-ritual-planner"
                >
                  {/* Subtle bionomic decorative backlight */}
                  <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />
                  
                  {/* Fine technical hairline diagnostics corners */}
                  <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-luxury-gold/30 pointer-events-none" />
                  <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-[#ebdcb9]/35 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-[#ebdcb9]/35 pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-luxury-gold/30 pointer-events-none" />

                  <div className="max-w-5xl mx-auto space-y-12 relative z-10">
                    
                    {/* Header sekcji */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">
                        Dobowa Chronobiologia Naskórka
                      </span>
                      <h2 className="font-serif text-[36px] md:text-[36px] font-light text-luxury-dark tracking-tight leading-tight">
                        Bionomiczny Kalendarz Dobowego Rytmu Skóry
                      </h2>
                      <div className="w-12 h-[1px] bg-luxury-gold/40 mx-auto mt-2" />
                      <p className="text-xs md:text-sm text-luxury-dark/95 max-w-xl mx-auto leading-relaxed">
                        Nasze komórki pracują w ściśle zdefiniowanych cyklach dziennych i nocnych. Wybierz aktualny priorytet swojej skóry i poznaj swój usystematyzowany, bionomiczny harmonogram pielęgnacyjny.
                      </p>
                    </div>

                    {/* Zakładki wyboru problemu dobowego */}
                    <div className="flex flex-wrap justify-center border-b border-luxury-sand/30 pb-1 gap-2 md:gap-8">
                      {circadianRoutines.map((routine, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePlanerCategoryIdx(idx)}
                          className={`pb-4 text-xs tracking-wider transition-all relative font-mono cursor-pointer border-b-2 -mb-[1px] ${
                            activePlanerCategoryIdx === idx
                              ? "text-luxury-gold border-luxury-gold font-medium"
                              : "text-luxury-dark/90 border-transparent hover:text-luxury-dark hover:border-luxury-sand/50"
                          }`}
                        >
                          <span className="block text-[8px] opacity-75 leading-none mb-1 font-sans">PRIORYTET 0{idx+1}</span>
                          <span className="text-[11px] md:text-xs">{routine.title}</span>
                          <span className="block text-[10px] font-sans italic opacity-60 mt-0.5">{routine.subtitle}</span>
                        </button>
                      ))}
                    </div>

                    {/* Szczegóły dobowego rytmu komórkowego */}
                    {(() => {
                      const routine = circadianRoutines[activePlanerCategoryIdx];
                      return (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                          {/* Lewa kolumna: info ogólne o barierze i wyzwaniu */}
                          <div className="lg:col-span-4 bg-white border border-luxury-sand/40 p-6 md:p-8 flex flex-col justify-between space-y-8 rounded-sm text-left shadow-xs">
                            <div className="space-y-4">
                              <span className="font-mono text-[8px] tracking-[0.2em] text-luxury-gold uppercase block font-bold">Charakterystyka Stanu</span>
                              <h3 className="font-serif text-2xl font-light text-luxury-dark">{routine.subtitle}</h3>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                {routine.challenge}
                              </p>
                              
                              <div className="border-t border-luxury-sand/30 pt-4 space-y-3">
                                <span className="font-mono text-[8px] tracking-[0.2em] text-luxury-gold uppercase block font-bold">Główne cele chronokuracji</span>
                                <ul className="space-y-2 text-xs text-luxury-dark/95 font-light">
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold text-[10px] mt-0.5">•</span>
                                    <span>Synchronizacja fazy ochrony i regeneracji</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold text-[10px] mt-0.5">•</span>
                                    <span>Minimalizacja przeznaskórkowego ubytku wody</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold text-[10px] mt-0.5">•</span>
                                    <span>Regulacja fizjologicznego mikrośrodowiska</span>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-luxury-sand/30">
                              <div className="bg-luxury-sand/10 border border-luxury-sand/30 p-4 rounded-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <Activity className="w-3.5 h-3.5 text-luxury-gold" />
                                  <span className="font-mono text-[8px] tracking-[0.15em] text-luxury-dark font-bold uppercase">Chronorada Katarzyny (Skinolog &amp; Założycielka)</span>
                                </div>
                                <p className="text-[11px] text-luxury-dark/95 italic font-serif leading-relaxed">
                                  &bdquo;Prawidłowy biorytm to podstawa. Skóra pobudzona do działania za dnia, nocą potrzebuje ciszy barierowej, aby móc w pełni zsyntetyzować cenne lipidy i odbudować naskórek.&rdquo;
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  // Find appropriate treatment to book
                                  const treatment = TREATMENTS.find(t => t.id === "skin-readiness");
                                  if (treatment) {
                                    setBookingTreatment(treatment);
                                    setBookingConfirmed(false);
                                  }
                                }}
                                className="w-full py-3 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer font-medium text-center"
                              >
                                Umów Konsultację z Kosmetologiem
                              </button>
                            </div>
                          </div>

                          {/* Prawa kolumna: Linia czasu (Morning, Afternoon, Evening) */}
                          <div className="lg:col-span-8 flex flex-col gap-6">
                            
                            {/* PORANEK */}
                            <div className="bg-white border border-luxury-sand/40 p-6 rounded-sm text-left shadow-xs transition-all duration-300 hover:border-luxury-gold/30">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luxury-sand/20 pb-3 mb-4 gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-1.5 rounded-full bg-amber-50 text-luxury-gold">
                                    <Sun className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-mono text-[8px] tracking-[0.2em] text-luxury-gold uppercase block font-semibold">FAZA PORANNA</span>
                                    <h4 className="font-serif text-base font-light text-luxury-dark">{routine.morning.title}</h4>
                                  </div>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-luxury-sand/20 px-2.5 py-1 text-[10px] font-mono text-luxury-dark rounded-full w-fit">
                                  <Clock className="w-3.5 h-3.5 text-luxury-dark/90" />
                                  <span>{routine.morning.time}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-luxury-dark/95 mb-4 leading-relaxed font-serif italic text-justify">
                                {routine.morning.desc}
                              </p>
                              <div className="space-y-2.5 mb-4">
                                {routine.morning.steps.map((step, sIdx) => (
                                  <div key={sIdx} className="flex items-start gap-3">
                                    <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                                      <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-[11px] md:text-xs text-luxury-dark font-light leading-relaxed">{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-amber-50/20 border border-amber-200/20 p-3 text-[10px] rounded-sm text-luxury-dark/95 leading-relaxed font-sans italic">
                                <span className="font-bold text-luxury-gold font-mono text-[9px] uppercase tracking-wider block mb-0.5">Zalecenie bionomiczne:</span>
                                {routine.morning.tip}
                              </div>
                            </div>

                            {/* POŁUDNIE */}
                            <div className="bg-white border border-luxury-sand/40 p-6 rounded-sm text-left shadow-xs transition-all duration-300 hover:border-luxury-gold/30">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luxury-sand/20 pb-3 mb-4 gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-1.5 rounded-full bg-sky-50 text-sky-600">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="font-mono text-[8px] tracking-[0.2em] text-sky-600 uppercase block font-semibold">FAZA POŁUDNIOWA</span>
                                    <h4 className="font-serif text-base font-light text-luxury-dark">{routine.afternoon.title}</h4>
                                  </div>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-luxury-sand/20 px-2.5 py-1 text-[10px] font-mono text-luxury-dark rounded-full w-fit">
                                  <Clock className="w-3.5 h-3.5 text-luxury-dark/90" />
                                  <span>{routine.afternoon.time}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-luxury-dark/95 mb-4 leading-relaxed font-serif italic text-justify">
                                {routine.afternoon.desc}
                              </p>
                              <div className="space-y-2.5 mb-4">
                                {routine.afternoon.steps.map((step, sIdx) => (
                                  <div key={sIdx} className="flex items-start gap-3">
                                    <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                                      <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-[11px] md:text-xs text-luxury-dark font-light leading-relaxed">{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-sky-50/20 border border-sky-200/20 p-3 text-[10px] rounded-sm text-luxury-dark/95 leading-relaxed font-sans italic">
                                <span className="font-bold text-sky-600 font-mono text-[9px] uppercase tracking-wider block mb-0.5">Zalecenie bionomiczne:</span>
                                {routine.afternoon.tip}
                              </div>
                            </div>

                            {/* WIECZÓR */}
                            <div className="bg-white border border-luxury-sand/40 p-6 rounded-sm text-left shadow-xs transition-all duration-300 hover:border-luxury-gold/30">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luxury-sand/20 pb-3 mb-4 gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-1.5 rounded-full bg-indigo-50 text-indigo-700">
                                    <Moon className="w-4 h-4 animate-pulse" />
                                  </div>
                                  <div>
                                    <span className="font-mono text-[8px] tracking-[0.2em] text-indigo-700 uppercase block font-semibold">FAZA NOCNA (REGENERACJA RECEPTOROWA)</span>
                                    <h4 className="font-serif text-base font-light text-luxury-dark">{routine.evening.title}</h4>
                                  </div>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-luxury-sand/20 px-2.5 py-1 text-[10px] font-mono text-luxury-dark rounded-full w-fit">
                                  <Clock className="w-3.5 h-3.5 text-luxury-dark/90" />
                                  <span>{routine.evening.time}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-luxury-dark/95 mb-4 leading-relaxed font-serif italic text-justify">
                                {routine.evening.desc}
                              </p>
                              <div className="space-y-2.5 mb-4">
                                {routine.evening.steps.map((step, sIdx) => (
                                  <div key={sIdx} className="flex items-start gap-3">
                                    <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                                      <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-[11px] md:text-xs text-luxury-dark font-light leading-relaxed">{step}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-indigo-50/20 border border-indigo-200/20 p-3 text-[10px] rounded-sm text-luxury-dark/95 leading-relaxed font-sans italic">
                                <span className="font-bold text-indigo-700 font-mono text-[9px] uppercase tracking-wider block mb-0.5">Zalecenie bionomiczne:</span>
                                {routine.evening.tip}
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })()}

                  </div>
                </section>
                {/* KONIEC PROPOZYCJI 4 */}

                {/* Custom Quiet Luxury Video Section */}
                <VideoPlayerSection />

                {/* Separator / Callout detailing 'Jak pracujemy' */}
                <div className="bg-luxury-sand/20 border border-luxury-sand/50 p-6 md:p-8 text-left rounded-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-8 space-y-3">
                      <div className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-semibold">Zrównoważona Praktyka i Metodologia</div>
                      <h3 className="font-serif text-[32px] md:text-[36px] font-light text-luxury-dark">Jak pracuję w Instytucie?</h3>
                      <p className="text-xs md:text-sm text-luxury-dark/95 font-light leading-relaxed">
                        Pierwszą wizytę rozpoczynam od spokojnej rozmowy i oceny aktualnej kondycji skóry. Pytam o Twoją codzienną pielęgnację, reakcje na kosmetyki, wcześniejsze zabiegi oraz oczekiwania. Uwzględniam również styl życia, stres i sen, które mogą wpływać na jej wygląd i komfort.
                      </p>
                      <p className="text-xs md:text-sm text-luxury-dark/95 font-light leading-relaxed">
                        Podczas konsultacji skinologicznej oceniam potrzeby skóry, jej nawilżenie, widoczne zaczerwienienia i oznaki podrażnienia. W zależności od zakresu wizyty korzystam z analizy skóry NATI V3. Wyjaśniam Ci swoje obserwacje i proponuję plan obejmujący zabiegi oraz pielęgnację domową.
                      </p>
                      <p className="text-xs md:text-sm text-luxury-dark/95 font-light leading-relaxed">
                        W podejściu Slow Skin Concept ważna jest kolejność działań i gotowość skóry do kolejnych zabiegów. Jeśli potrzebuje ukojenia, nawilżenia i wsparcia bariery naskórkowej, od tego zaczynam. Dobieram składniki aktywne, kompozycje biomimetyczne i technologie do jej aktualnej kondycji, tolerancji oraz celu pielęgnacji. Podczas kolejnych wizyt obserwuję reakcje skóry i odpowiednio dostosowuję plan.
                      </p>
                      <p className="text-xs md:text-sm text-luxury-dark font-medium italic border-t border-luxury-sand/30 pt-3">
                        Zapraszam do Instytutu Zdrowej Skóry w Jelczu-Laskowicach. To miejsce, w którym masz czas na rozmowę, pytania i spokojne poznanie potrzeb swojej skóry. Zależy mi, abyś rozumiała proponowaną pielęgnację i wiedziała, jak dbać o skórę również między wizytami.
                      </p>
                    </div>
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-luxury-sand/40 gap-4">
                      <div className="text-center">
                        <p className="font-serif text-sm text-luxury-dark font-semibold">Terapia Concept™</p>
                        <p className="text-[8px] font-mono text-luxury-gold tracking-[0.2em] uppercase mt-1">Gabinet Jelcz-Laskowice</p>
                      </div>
                      <button
                        onClick={() => {
                          const firstVisit = TREATMENTS.find(t => t.id === "skin-readiness");
                          if (firstVisit) {
                            setIsMegaMenuOpen(false);
                            setIsProblemsMenuOpen(false);
                            setBookingTreatment(firstVisit);
                            setBookingConfirmed(false);
                            setBookingName("");
                            setBookingEmail("");
                            setBookingPhone("");
                            setBookingDate("");
                          } else {
                            setActiveTab("diagnose");
                          }
                        }}
                        className="px-6 py-3 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[9px] tracking-widest uppercase transition-all duration-300 block w-full text-center cursor-pointer font-medium"
                      >
                        Umów Pierwszą Wizytę
                      </button>
                      <button
                        onClick={() => {
                          setIsMegaMenuOpen(false);
                          setIsProblemsMenuOpen(false);
                          setActiveTab("diagnose");
                        }}
                        className="px-6 py-3 border border-luxury-dark/40 hover:border-luxury-gold text-luxury-dark hover:text-luxury-dark font-mono text-[9px] tracking-widest uppercase transition-all duration-300 block w-full text-center cursor-pointer bg-white/50 hover:bg-white"
                      >
                        Diagnoza Skóry Online
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sekcja: Baza Wiedzy / Edukacja & Diagnoza */}
              <div className="space-y-12 pt-12 pb-4 border-t border-luxury-sand/30" id="baza-wiedzy-edukacja-diagnoza">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase block">Edukacja & Wsparcie Decyzyjne</span>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark mt-1">
                    Baza Wiedzy, Edukacja & Diagnoza
                  </h2>
                  <div className="w-12 h-[1px] bg-luxury-gold/50 mx-auto my-3" />
                  <p className="text-xs md:text-sm text-luxury-dark/95 font-serif italic leading-relaxed text-justify md:text-center px-4 max-w-xl mx-auto">
                    Wierzymy, że skuteczna pielęgnacja rodzi się z głębokiego zrozumienia fizjologii skóry. Udostępniamy rzetelną wiedzę i zaawansowane narzędzia diagnostyczne, by pomóc Ci podejmować w pełni świadome decyzje terapeutyczne.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                  {/* Left Column: Magazyn Wiedzy (Edukacja) */}
                  <div className="border border-luxury-sand/50 p-8 bg-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col justify-between space-y-8 rounded-sm text-left">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-luxury-sand/40 pb-4">
                        <span className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-bold flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5" /> 01 / Edukacja Komórkowa
                        </span>
                        <span className="text-[9px] font-mono text-luxury-dark/90 uppercase tracking-widest">Tematy Naukowe</span>
                      </div>

                      <div className="space-y-6">
                        {[
                          {
                            id: "art-slow-skin-philosophy",
                            title: "Filozofia Slow Skin Concept™",
                            tagline: "Dlaczego skóra potrzebuje mądrej regeneracji zamiast agresywnej, ciągłej stymulacji.",
                            readTime: "8 min czytania",
                            category: "FILOZOFIA"
                          },
                          {
                            id: "art-neurobiology-skin",
                            title: "Neurobiologia i Psychosomatyka Skóry",
                            tagline: "Wpływ stresu komórkowego i kortyzolu na degradację kolagenu oraz barierę lipidową.",
                            readTime: "10 min czytania",
                            category: "NEUROBIOLOGIA"
                          },
                          {
                            id: "art-hydrolipid-barrier",
                            title: "Odbudowa Bariery Hydrolipidowej",
                            tagline: "Cztery filary ochrony bariery i fizjologicznej równowagi naskórka.",
                            readTime: "9 min czytania",
                            category: "FIZJOLOGIA"
                          }
                        ].map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              const article = ARTICLES.find(a => a.id === item.id);
                              if (article) {
                                setSelectedArticle(article);
                                setActiveTab("journal");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }}
                            className="perspective-1000 h-[175px] cursor-pointer group w-full"
                          >
                            <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
                              {/* FRONT SIDE */}
                              <div className="absolute inset-0 w-full h-full backface-hidden p-5 border border-luxury-sand/50 bg-white/70 hover:border-luxury-gold/30 rounded-md flex flex-col justify-between shadow-xs">
                                <div>
                                  <div className="flex justify-between items-center text-[9px] font-mono text-luxury-gold tracking-widest mb-2">
                                    <span className="uppercase font-semibold">{item.category}</span>
                                    <span className="text-luxury-dark/90">{item.readTime}</span>
                                  </div>
                                  <h4 className="font-serif text-base font-light text-luxury-dark leading-snug group-hover:text-luxury-gold transition-colors">{item.title}</h4>
                                </div>
                                <div className="text-[9px] font-mono text-luxury-gold/70 group-hover:text-luxury-gold flex items-center gap-1.5 transition-colors mt-auto">
                                  <span>Zobacz szczegóły artykułu</span>
                                  <span>➔</span>
                                </div>
                              </div>

                              {/* BACK SIDE */}
                              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-5 border border-luxury-gold/30 bg-luxury-cream/95 rounded-md flex flex-col justify-between shadow-xs">
                                <div>
                                  <div className="text-[8px] font-mono text-luxury-gold/80 tracking-widest uppercase mb-1.5">{item.category} • ZARYS</div>
                                  <p className="text-[12px] md:text-[13px] text-luxury-dark font-light leading-relaxed font-serif italic">{item.tagline}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-mono text-luxury-dark font-medium uppercase pt-2 border-t border-luxury-sand/40 mt-auto">
                                  Przejdź do pełnego artykułu 
                                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-luxury-gold" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedArticle(null);
                        setActiveTab("journal");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full py-3.5 border border-luxury-dark hover:bg-luxury-dark hover:text-white text-luxury-dark font-mono text-[10px] tracking-widest uppercase transition-all duration-300 text-center cursor-pointer font-medium bg-transparent"
                    >
                      Otwórz Magazyn Wiedzy i Artykuły
                    </button>
                  </div>

                  {/* Right Column: Ocena Kondycji Skóry */}
                  <div className="border border-luxury-sand/50 p-8 bg-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col justify-between space-y-8 rounded-sm text-left">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-luxury-sand/40 pb-4">
                        <span className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-bold flex items-center gap-2">
                          <Fingerprint className="w-3.5 h-3.5" /> 02 / OCENA KONDYCJI SKÓRY
                        </span>
                        <span className="text-[9px] font-mono text-luxury-dark/90 uppercase tracking-widest">OBSZARY OCENY</span>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                          Przy doborze pielęgnacji uwzględniam aktualny stan skóry i jej reakcje. Poniższe obszary pomagają określić, czego potrzebuje w pierwszej kolejności.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {[
                            {
                              title: "Nawilżenie skóry",
                              desc: "Ocena nawilżenia oraz oznak suchości i ściągnięcia, które wpływają na codzienny komfort skóry."
                            },
                            {
                              title: "Wrażliwość i reaktywność",
                              desc: "Uwzględnienie pieczenia, zaczerwienień i reakcji na kosmetyki, dotyk oraz czynniki zewnętrzne."
                            },
                            {
                              title: "Bariera naskórkowa",
                              desc: "Ocena oznak osłabienia funkcji ochronnej skóry, takich jak łuszczenie, podrażnienie i nadmierna suchość."
                            },
                            {
                              title: "Koloryt i struktura",
                              desc: "Obserwacja nierównomiernego kolorytu, niedoskonałości i zmian w strukturze skóry istotnych dla celu pielęgnacji."
                            }
                          ].map((item, index) => (
                            <div key={index} className="p-3.5 border border-luxury-sand/20 bg-white/30 rounded-sm">
                              <h5 className="font-serif text-xs font-semibold text-luxury-dark">{item.title}</h5>
                              <p className="text-[10px] text-luxury-dark/95 font-light leading-relaxed mt-1">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Custom callout for Online AI diagnosis tool */}
                      <div className="p-5 border border-luxury-gold/30 bg-luxury-sand/15 relative overflow-hidden rounded-sm space-y-2">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 rounded-full -translate-y-12 translate-x-12 blur-xl" />
                        <div className="flex items-center gap-2 text-luxury-gold">
                          <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-ping" />
                          <span className="font-mono text-[8px] tracking-[0.25em] font-bold uppercase">PIERWSZY KROK</span>
                        </div>
                        <h4 className="font-serif text-sm font-light text-luxury-dark">Poznaj możliwości pielęgnacji</h4>
                        <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                          Odpowiedz na trzy krótkie pytania o swoją skórę i oczekiwania. Formularz wskaże propozycję do omówienia podczas konsultacji. Dobór zabiegu wymaga indywidualnej oceny skóry.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDiagnosticStep(0);
                        setActiveTab("diagnose");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full py-3.5 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[10px] tracking-widest uppercase transition-all duration-300 text-center cursor-pointer font-medium"
                    >
                      Odpowiedz na 3 pytania i poznaj możliwości
                    </button>
                  </div>
                </div>
              </div>

              {/* HOME FAQ SECTION & DYLEMAT EKSPERTA INTEGRATION */}
              <div className="pt-16 pb-6 border-t border-luxury-sand/30 space-y-12" id="home-faq-and-navigator">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  {/* Left Column: Custom Interactive Callout for sliding drawer 'Dylemat Eksperta' */}
                  <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 bg-[#FAF8F5] border border-[#ebdcb9] p-8 rounded-none">
                    <div className="space-y-2">
                      <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-luxury-gold" /> DYLEMAT EKSPERTA
                      </span>
                      <h3 className="font-serif text-2xl font-light text-luxury-dark tracking-tight leading-snug">
                        Masz specyficzny dylemat skórny?
                      </h3>
                      <p className="text-xs text-luxury-dark/95 font-serif italic">
                        Ekspercki przewodnik kosmetologiczny na Twoje usługi.
                      </p>
                    </div>

                    <div className="w-full h-[1px] bg-[#ebdcb9]/60" />

                    <p className="text-xs text-luxury-dark/95 font-light leading-relaxed text-justify">
                      Stworzyliśmy wysuwany panel <strong className="font-normal font-sans">„Dylemat Eksperta”</strong> — innowacyjne, ekspresowe narzędzie wyszukiwania, które przeszukuje pełne repozytorium pytań i odpowiedzi zebranych we wszystkich 15+ specjalistycznych terapiach naszego Instytutu. Wpisz dowolny symptom (np. naczynka, zmarszczki, bariera, kwas bursztynowy), by natychmiast otrzymać autorytatywną odpowiedź kosmetologiczną.
                    </p>

                    <div className="p-4 bg-white border border-[#ebdcb9]/40 rounded-none space-y-3 shadow-xs">
                      <div className="flex gap-2 text-luxury-gold">
                        <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
                        <span className="font-mono text-[8.5px] tracking-widest uppercase">Zintegrowana baza: 15+ terapii klinicznych</span>
                      </div>
                      <p className="text-[10px] text-luxury-dark/90 leading-relaxed font-light">
                        Zamiast przekopywać się przez poszczególne podstrony zabiegów, znajdź natychmiastowe wyjaśnienie bez opuszczania strony głównej.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setExpertDilemmaSearch("");
                        setIsExpertDilemmaOpen(true);
                      }}
                      className="w-full py-4 bg-luxury-dark hover:bg-luxury-gold text-[#fcfbfa] hover:text-white font-mono text-[10px] tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" /> Otwórz Panel Dylemat Eksperta
                    </button>
                  </div>

                  {/* Right Column: Complete FAQ list right on the homepage */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2 text-left">
                      <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-semibold col-span-1">
                        Repozytorium Czystej Fizjologii Skóry
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl font-light text-luxury-dark tracking-tight leading-none">
                        Najczęściej Zadawane Pytania (FAQ)
                      </h3>
                      <p className="text-xs text-luxury-dark/95 font-light max-w-xl">
                        Poznaj rzetelne odpowiedzi na najpopularniejsze pytania o procedury, bezpieczeństwo naskórka i autorską pielęgnację domową Slow Skin Concept.
                      </p>
                    </div>

                    <div className="border border-luxury-sand p-4 md:p-6 bg-white/40 rounded-none shadow-xs text-left">
                      <TreatmentFAQ faqList={harvestedFaqs} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert Editorial Spotlight Section - Katarzyna Brzezińska */}
              <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F4F0E8] py-16 px-6 sm:px-10 md:px-14 border border-luxury-sand/80 shadow-[0_20px_50px_rgba(179,155,114,0.06)] relative overflow-hidden" id="o-mnie-katarzyna-brzezinska">
                {/* Luminous luxury subtle glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ebdcb9]/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Subtelne luksusowe narożniki */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-luxury-gold/40 pointer-events-none" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-luxury-gold/40 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-luxury-gold/40 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-luxury-gold/40 pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
                  
                  {/* Left Column: Spotlight Narrative */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold bg-luxury-gold/10 px-3 py-1 border border-luxury-gold/30 rounded-full">
                        O mnie • Kosmetologia Interdyscyplinarna
                      </span>
                      <span className="font-mono text-[9px] tracking-wider text-luxury-dark/90 uppercase">
                        17+ Lat Praktyki Klinicznej
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-luxury-dark tracking-tight leading-[1.15]">
                        Katarzyna Brzezińska
                      </h3>
                      <p className="font-mono text-[10px] tracking-[0.18em] text-luxury-gold uppercase font-semibold">
                        Kosmetologia interdyscyplinarna • Ponad 17 lat pracy ze skórą
                      </p>
                    </div>

                    <div className="w-16 h-[1px] bg-luxury-gold/60" />

                    {/* Główny manifest / cytat wiodący */}
                    <p className="font-serif text-lg sm:text-xl italic font-normal text-luxury-dark/90 leading-snug border-l-2 border-luxury-gold/60 pl-4 py-1">
                      „Nie wierzę, że skóra zawsze potrzebuje silniejszego bodźca. Częściej potrzebuje właściwie odczytanych sygnałów i terapii dopasowanej do jej aktualnej gotowości.”
                    </p>

                    {/* Skompilowany tekst biograficzno-filozoficzny */}
                    <div className="space-y-4 text-xs sm:text-sm text-luxury-dark font-light leading-relaxed">
                      <p>
                        Nazywam się <strong>Katarzyna Brzezińska</strong>. Od ponad 17 lat pracuję ze skórą w nurcie <em>kosmetologii interdyscyplinarnej</em>. Jestem twórczynią <strong>Slow Skin Concept™</strong> oraz autorką <strong>Biologicznej Spirali Inteligencji Skóry™</strong>.
                      </p>
                      <p>
                        W swojej pracy nie koncentruję się wyłącznie na tym, co widać na powierzchni. Patrzę na skórę w szerszym kontekście – jej bariery, reaktywności, mikrobiomu, stylu życia, stresu oraz kondycji całego organizmu.
                      </p>
                      <p>
                        Nie rozpoczynam terapii od wyboru gotowego zabiegu. Najpierw staram się zrozumieć, co skóra komunikuje, jakie procesy mogą podtrzymywać problem oraz do jakiego rodzaju działania jest aktualnie przygotowana.
                      </p>
                      <p>
                        Na tej podstawie projektuję indywidualne terapie w Instytucie w Jelczu-Laskowicach, które mogą łączyć odpowiednio dobrane technologie, techniki manualne, preparaty zabiegowe i pielęgnację domową.
                      </p>
                    </div>

                    {/* 3 Kluczowe Akcenty Filozofii */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 bg-white/80 border border-luxury-sand/80 rounded-xs space-y-1 shadow-2xs">
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-luxury-gold font-bold block">01. Bez Gotowych Schematów</span>
                        <p className="text-[11px] text-luxury-dark/95 leading-relaxed font-light">
                          Indywidualne, wielokierunkowe terapie projektowane przy pacjencie w dniu wizyty.
                        </p>
                      </div>
                      <div className="p-3.5 bg-white/80 border border-luxury-sand/80 rounded-xs space-y-1 shadow-2xs">
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-luxury-gold font-bold block">02. Gotowość Biologiczna</span>
                        <p className="text-[11px] text-luxury-dark/95 leading-relaxed font-light">
                          Wspieranie procesów, do których skóra jest rzeczywiście przygotowana fizjologicznie.
                        </p>
                      </div>
                      <div className="p-3.5 bg-white/80 border border-luxury-sand/80 rounded-xs space-y-1 shadow-2xs">
                        <span className="font-mono text-[8.5px] uppercase tracking-wider text-luxury-gold font-bold block">03. Samoregulacja & Odbudowa</span>
                        <p className="text-[11px] text-luxury-dark/95 leading-relaxed font-light">
                          Wspieranie funkcji obronnych i adaptacyjnych ku trwałej samowystarczalności komórkowej.
                        </p>
                      </div>
                    </div>

                    {/* Podpis i CTA */}
                    <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-luxury-sand/60">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-[1px] bg-luxury-gold" />
                        <div>
                          <div className="font-serif text-base tracking-wider text-luxury-dark font-medium">Katarzyna Brzezińska</div>
                          <div className="font-mono text-[8.5px] text-luxury-dark/90 tracking-widest uppercase">
                            Kosmetologia Interdyscyplinarna • Jelcz-Laskowice
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLinkClick("/pierwsza-wizyta-diagnostyka-skory/")}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-luxury-dark hover:bg-luxury-gold text-white text-[10px] font-mono uppercase tracking-[0.18em] transition-all duration-300 shadow-xs cursor-pointer"
                      >
                        <span>Umów Konsultację Diagnostyczną</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Expert Portrait & Credentials Card */}
                  <div className="lg:col-span-5 space-y-4 max-w-sm mx-auto w-full">
                    <div className="border border-luxury-sand/90 p-3 bg-white shadow-[0_16px_36px_rgba(179,155,114,0.08)] relative group">
                      <div className="aspect-[4/5] bg-luxury-sand relative overflow-hidden">
                        <EditableImage
                          id="about_expert"
                          slotName="Portret Eksperta / Założycielki"
                          src={customTreatmentImages["about_expert"] || "https://slow-skin.pl/wp-content/uploads/2025/10/doktor_2.jpg"}
                          fallbackSrc="https://slow-skin.pl/wp-content/uploads/2025/10/doktor_2.jpg"
                          alt="Katarzyna Brzezińska — Twórczyni Slow Skin Concept"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          aspectRatioClass="h-full w-full"
                          onImageChange={(id, newUrl) => {
                            setCustomTreatmentImages(prev => ({ ...prev, [id]: newUrl }));
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/70 via-transparent to-transparent opacity-80 pointer-events-none" />
                          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1 pointer-events-none">
                            <span className="font-mono text-[8.5px] tracking-[0.2em] uppercase text-luxury-gold font-semibold block">
                              Instytut Zdrowej Skóry
                            </span>
                            <h4 className="font-serif text-lg font-light text-white">
                              Katarzyna Brzezińska
                            </h4>
                            <p className="text-[10px] text-luxury-cream/80 font-light">
                              Kosmetolog interdyscyplinarny & skinolog
                            </p>
                          </div>
                        </EditableImage>
                      </div>
                    </div>

                    {/* Wizytówka Autorskich Metodologii */}
                    <div className="p-4 bg-white/90 border border-luxury-sand/80 space-y-2 text-left shadow-2xs">
                      <span className="font-mono text-[8.5px] uppercase tracking-widest text-luxury-gold font-bold block">
                        Autorskie Koncepcje & Znaki
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-luxury-dark font-light">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                          <span><strong>Slow Skin Concept™</strong> — filozofia komórkowego spokoju</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                          <span><strong>Biological Skin Intelligence™</strong> — model biologiczny</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                          <span><strong>Biologiczna Spirala Inteligencji Skóry™</strong></span>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>

              {/* Google Client Reviews Section (Quiet Luxury Theme) */}
              <div 
                className="mt-20 pt-16 pb-16 px-6 md:px-12 border border-[#ebdcb9]/40 bg-gradient-to-tr from-[#FAF8F5] via-white to-[#F6F4EF] space-y-12 animate-fade-in relative overflow-hidden shadow-[0_24px_54px_rgba(179,155,114,0.06),inset_0_1px_3px_rgba(255,255,255,0.9)]" 
                id="customer-reviews-section"
              >
                {/* Luminous luxury backlights (Subtelne rozświetlenie bionomiczne) */}
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-luxury-gold/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ebdcb9]/20 blur-[120px] rounded-full pointer-events-none" />
                
                {/* Luksusowe mikro-narożniki całej sekcji dla podbicia prestiżu */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-luxury-gold/30 pointer-events-none" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#ebdcb9]/40 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#ebdcb9]/40 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-luxury-gold/30 pointer-events-none" />

                <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10 animate-fade-in">
                  <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold" /> Głos Zaufania i Prawdziwe Historie
                  </span>
                  <h2 className="font-serif text-[34px] md:text-[40px] font-light text-luxury-dark tracking-tight leading-tight">
                    Autentyczne Historie & Opinie
                  </h2>
                  <p className="text-xs text-luxury-dark/95 font-light leading-relaxed max-w-xl mx-auto">
                    Poznaj prawdziwe relacje klientek z naszego instytutu w Jelczu-Laskowicach (z oficjalnego źródła <a href="https://slow-skin.pl/opinie/" target="_blank" rel="noopener noreferrer" className="text-luxury-gold underline hover:text-luxury-gold/80">slow-skin.pl/opinie</a>) oraz zweryfikowane opinie z Google Maps. Czysta biologia naskórka, bez filtrów i bez fikcji.
                  </p>

                  {/* Kategoria filtrowania opinii */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setReviewCategoryFilter("all");
                        setActiveReviewIndex(0);
                        setReviewProgress(0);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all duration-300 border rounded-xs cursor-pointer ${
                        reviewCategoryFilter === "all"
                          ? "bg-luxury-dark text-luxury-cream border-luxury-dark shadow-xs"
                          : "bg-white/80 text-luxury-dark/80 border-luxury-sand/70 hover:border-luxury-gold hover:text-luxury-dark"
                      }`}
                    >
                      Wszystkie ({REVIEWS.length})
                    </button>
                    <button
                      onClick={() => {
                        setReviewCategoryFilter("stories");
                        setActiveReviewIndex(0);
                        setReviewProgress(0);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all duration-300 border rounded-xs cursor-pointer flex items-center gap-1.5 ${
                        reviewCategoryFilter === "stories"
                          ? "bg-luxury-gold text-white border-luxury-gold shadow-xs"
                          : "bg-white/80 text-luxury-dark/80 border-luxury-sand/70 hover:border-luxury-gold hover:text-luxury-dark"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" /> Historie Transformacji (slow-skin.pl)
                    </button>
                    <button
                      onClick={() => {
                        setReviewCategoryFilter("google");
                        setActiveReviewIndex(0);
                        setReviewProgress(0);
                      }}
                      className={`px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all duration-300 border rounded-xs cursor-pointer ${
                        reviewCategoryFilter === "google"
                          ? "bg-luxury-dark text-luxury-cream border-luxury-dark shadow-xs"
                          : "bg-white/80 text-luxury-dark/80 border-luxury-sand/70 hover:border-luxury-gold hover:text-luxury-dark"
                      }`}
                    >
                      Opinie Google Maps
                    </button>
                  </div>
                </div>
                
                {/* Wykwintny Bionomiczny Karuzel Opinii */}
                <div 
                  className="bg-white/95 backdrop-blur-md border border-[#ebdcb9]/80 p-6 md:p-10 max-w-3xl mx-auto space-y-6 shadow-[0_12px_44px_rgba(179,155,114,0.04)] relative overflow-hidden transition-all duration-350 hover:border-luxury-gold/70 hover:shadow-[0_16px_56px_rgba(179,155,114,0.08)]"
                  onMouseEnter={() => setIsReviewsHovered(true)}
                  onMouseLeave={() => setIsReviewsHovered(false)}
                  id="reviews-automated-carousel-root"
                >
                  {/* Pasek postępu odtwarzania automatycznego */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-luxury-sand/20 z-20">
                    <div 
                      className="h-full bg-luxury-gold transition-all duration-[300ms] ease-linear"
                      style={{ width: `${reviewProgress}%` }}
                    />
                  </div>

                  {/* Nagłówek panelu opinii */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-luxury-sand/30 pb-4 gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-luxury-dark">
                        Zweryfikowany Głos Klientek
                      </span>
                      {(() => {
                        const filtered = getFilteredReviews();
                        const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                        return currentReview.platform === "slow-skin.pl" ? (
                          <span className="px-2 py-0.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 font-mono text-[8px] text-luxury-gold font-medium">
                            slow-skin.pl/opinie
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-luxury-sand/30 font-mono text-[8px] text-luxury-dark/70 font-medium">
                            Google Reviews
                          </span>
                        );
                      })()}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-luxury-sand/30 font-mono text-[8px] text-luxury-gold font-medium">
                      {isReviewsHovered ? "WSTRZYMANO (AUTO-PAUSE)" : "AUTOPLAY"}
                    </span>
                  </div>

                  {/* Bionomiczny układ zorientowany na autentyczną historię */}
                  <div className="flex flex-col justify-between items-center text-center space-y-6 font-sans py-2">
                    
                    {/* Gwiazdki i ocena */}
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="flex items-center justify-center gap-1">
                        {(() => {
                          const filtered = getFilteredReviews();
                          const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                          return [...Array(currentReview.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-luxury-gold fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ));
                        })()}
                      </div>
                      {(() => {
                        const filtered = getFilteredReviews();
                        const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                        return currentReview.service ? (
                          <span className="text-[9px] font-mono text-luxury-gold tracking-wider uppercase py-0.5 px-2.5 bg-luxury-sand/30 font-semibold rounded-xs">
                            Zabieg: {currentReview.service}
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-luxury-gold tracking-widest uppercase py-0.5 px-2.5 bg-luxury-sand/30 font-semibold rounded-xs">
                            Ocena fizjologiczna: 5.0 / 5.0
                          </span>
                        );
                      })()}
                    </div>

                    {/* Tytuł historii (jeśli istnieje) */}
                    {(() => {
                      const filtered = getFilteredReviews();
                      const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                      return currentReview.title ? (
                        <h3 className="font-serif text-lg md:text-xl font-medium text-luxury-dark max-w-xl">
                          &bdquo;{currentReview.title}&rdquo;
                        </h3>
                      ) : null;
                    })()}

                    {/* Problem vs Rezultat Badges (dla relacji pacjentek) */}
                    {(() => {
                      const filtered = getFilteredReviews();
                      const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                      if (currentReview.problem && currentReview.result) {
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left w-full max-w-xl text-[11px] bg-luxury-cream/30 p-3 border border-luxury-sand/50">
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-wider text-rose-800 font-semibold block mb-0.5">
                                Problem wyjściowy:
                              </span>
                              <span className="text-luxury-dark/90 font-light">{currentReview.problem}</span>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 font-semibold block mb-0.5">
                                Rezultat biologiczny:
                              </span>
                              <span className="text-luxury-dark/90 font-light">{currentReview.result}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Główny cytat */}
                    <div className="relative max-w-2xl px-4 flex flex-col justify-center min-h-[120px]">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-7xl font-serif text-luxury-gold/10 select-none leading-none">“</span>
                      
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={(() => {
                            const filtered = getFilteredReviews();
                            return (filtered[activeReviewIndex] || filtered[0] || REVIEWS[0]).id;
                          })()}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="font-serif text-sm md:text-base italic text-luxury-dark/95 leading-relaxed font-light text-center relative z-10"
                        >
                          &ldquo;{(() => {
                            const filtered = getFilteredReviews();
                            return (filtered[activeReviewIndex] || filtered[0] || REVIEWS[0]).text;
                          })()}&rdquo;
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {/* Informacje o autorze i nawigacja */}
                    <div className="pt-4 border-t border-luxury-sand/40 w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                      
                      {/* Sygnatura Klienta */}
                      <div className="text-center sm:text-left">
                        <AnimatePresence mode="wait">
                          <motion.h4
                            key={(() => {
                              const filtered = getFilteredReviews();
                              return (filtered[activeReviewIndex] || filtered[0] || REVIEWS[0]).id;
                            })()}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-serif text-sm font-medium text-luxury-dark"
                          >
                            {(() => {
                              const filtered = getFilteredReviews();
                              return (filtered[activeReviewIndex] || filtered[0] || REVIEWS[0]).author;
                            })()}
                          </motion.h4>
                        </AnimatePresence>
                        
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-[9px] font-mono text-luxury-dark/90 uppercase tracking-widest mt-0.5 flex-wrap">
                          <span>
                            {(() => {
                              const filtered = getFilteredReviews();
                              const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                              return getReviewAuthorTitle(currentReview.author, currentReview);
                            })()}
                          </span>
                          {(() => {
                            const filtered = getFilteredReviews();
                            const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                            if (currentReview.duration) {
                              return (
                                <>
                                  <span>•</span>
                                  <span className="text-luxury-dark/70 lowercase">{currentReview.duration}</span>
                                </>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>

                      {/* Kontrolki nawigacji & Link do źródła */}
                      <div className="flex items-center gap-4">
                        {(() => {
                          const filtered = getFilteredReviews();
                          const currentReview = filtered[activeReviewIndex] || filtered[0] || REVIEWS[0];
                          if (currentReview.sourceUrl) {
                            return (
                              <a
                                href={currentReview.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-luxury-gold hover:underline flex items-center gap-1"
                              >
                                slow-skin.pl/opinie ↗
                              </a>
                            );
                          }
                          return null;
                        })()}

                        <span className="font-mono text-[10px] text-luxury-dark/90 tracking-wider">
                          0{activeReviewIndex + 1} <span className="opacity-50">/</span> 0{getFilteredReviews().length}
                        </span>
                        
                        <div className="flex gap-1.5">
                          <button 
                            onClick={prevReview}
                            className="p-2 border border-luxury-sand/60 hover:border-luxury-dark text-luxury-dark transition-colors cursor-pointer bg-luxury-cream/10 hover:bg-white rounded-xs"
                            aria-label="Poprzednia opinia"
                            id="btn-prev-review-carousel"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={nextReview}
                            className="p-2 border border-luxury-sand/60 hover:border-luxury-dark text-luxury-dark transition-colors cursor-pointer bg-luxury-cream/10 hover:bg-white rounded-xs"
                            aria-label="Następna opinia"
                            id="btn-next-review-carousel"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Sekcja Case Studies: Historie Transformacji z slow-skin.pl */}
                <div className="max-w-4xl mx-auto pt-8 space-y-6">
                  <div className="text-center space-y-2">
                    <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase">
                      STUDIA PRZYPADKÓW Z GABINETU W JELCZU-LASKOWICACH
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-luxury-dark">
                      Prawdziwe Historie Klientek z Instytutu
                    </h3>
                    <p className="text-xs text-luxury-dark/85 font-light max-w-xl mx-auto">
                      Zobacz, jak dzięki cierpliwości, bionomicznej odbudowie naskórka i indywidualnym planom zabiegowym nasze klientki odzyskały spokój i zdrową skórę.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {REVIEWS.filter(r => r.platform === "slow-skin.pl").map((story) => (
                      <div
                        key={story.id}
                        className="bg-white/95 border border-luxury-sand/70 p-5 space-y-4 hover:border-luxury-gold/70 transition-all duration-300 shadow-xs flex flex-col justify-between text-left"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 border-b border-luxury-sand/40 pb-2">
                            <span className="font-serif text-sm font-medium text-luxury-dark">
                              {story.author}
                            </span>
                            <span className="text-[9px] font-mono text-luxury-gold uppercase px-2 py-0.5 bg-luxury-cream/60 border border-luxury-sand/40">
                              Zweryfikowana
                            </span>
                          </div>

                          <h4 className="font-serif text-sm font-medium text-luxury-dark leading-snug">
                            {story.title}
                          </h4>

                          {story.problem && (
                            <div className="text-xs space-y-1 bg-luxury-cream/20 p-2.5 border border-luxury-sand/40">
                              <div className="text-[9px] font-mono text-rose-800 uppercase font-medium">
                                Wyzwanie:
                              </div>
                              <p className="text-luxury-dark/85 font-light text-[11px] leading-relaxed">
                                {story.problem}
                              </p>
                            </div>
                          )}

                          {story.result && (
                            <div className="text-xs space-y-1 bg-emerald-50/40 p-2.5 border border-emerald-200/50">
                              <div className="text-[9px] font-mono text-emerald-800 uppercase font-medium">
                                Przełom i Efekt:
                              </div>
                              <p className="text-luxury-dark/90 font-light text-[11px] leading-relaxed">
                                {story.result}
                              </p>
                            </div>
                          )}

                          <p className="text-xs text-luxury-dark/85 italic font-light line-clamp-3 leading-relaxed">
                            &bdquo;{story.text}&rdquo;
                          </p>
                        </div>

                        <div className="pt-3 border-t border-luxury-sand/30 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedStoryModal(story)}
                            className="text-[10px] font-mono uppercase tracking-wider text-luxury-gold hover:text-luxury-dark font-medium transition-colors cursor-pointer"
                          >
                            Czytaj całą historię →
                          </button>
                          {story.sourceUrl && (
                            <a
                              href={story.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] font-mono text-luxury-dark/60 hover:text-luxury-gold"
                            >
                              slow-skin.pl ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Banner z linkiem do pełnej strony opinii */}
                  <div className="p-4 bg-luxury-cream/30 border border-luxury-sand/60 text-center space-y-2">
                    <p className="text-xs text-luxury-dark font-light">
                      Więcej historii, w tym nagrania i relacje audio naszych klientek, znajdziesz na oficjalnej stronie:
                    </p>
                    <a
                      href="https://slow-skin.pl/opinie/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-luxury-gold hover:text-luxury-dark font-semibold border-b border-luxury-gold/40 hover:border-luxury-gold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Przejdź do pełnej bazy opinii na slow-skin.pl/opinie/ ↗
                    </a>
                  </div>
                </div>

                {/* Modal pełnej historii pacjentki */}
                {selectedStoryModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white border border-luxury-gold/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative text-left">
                      <button
                        onClick={() => setSelectedStoryModal(null)}
                        className="absolute top-4 right-4 p-2 text-luxury-dark/70 hover:text-luxury-dark cursor-pointer"
                        aria-label="Zamknij"
                      >
                        ✕
                      </button>

                      <div className="space-y-2 border-b border-luxury-sand/50 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-luxury-gold"></span>
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-semibold">
                            Oficjalna Historia Pacjentki Instytutu Slow Skin
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl font-light text-luxury-dark">
                          {selectedStoryModal.author}: {selectedStoryModal.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-luxury-dark/70">
                          {selectedStoryModal.service && (
                            <span className="px-2 py-0.5 bg-luxury-cream border border-luxury-sand/50 text-luxury-gold">
                              {selectedStoryModal.service}
                            </span>
                          )}
                          {selectedStoryModal.duration && (
                            <span>Czas terapii: {selectedStoryModal.duration}</span>
                          )}
                        </div>
                      </div>

                      {/* Dwa filary: problem i efekt */}
                      {selectedStoryModal.problem && selectedStoryModal.result && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 bg-rose-50/40 border border-rose-200/50 space-y-1">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-rose-800 font-semibold block">
                              Stan wyjściowy i trudności:
                            </span>
                            <p className="text-luxury-dark/90 font-light leading-relaxed">
                              {selectedStoryModal.problem}
                            </p>
                          </div>
                          <div className="p-3 bg-emerald-50/40 border border-emerald-200/50 space-y-1">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 font-semibold block">
                              Efekt biologiczny po terapii:
                            </span>
                            <p className="text-luxury-dark/90 font-light leading-relaxed">
                              {selectedStoryModal.result}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Punkty milowe historii */}
                      {selectedStoryModal.storyDetails && selectedStoryModal.storyDetails.length > 0 && (
                        <div className="space-y-2 bg-luxury-cream/20 p-4 border border-luxury-sand/40">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-semibold block">
                            Kluczowe etapy procesu:
                          </span>
                          <ul className="space-y-1.5 text-xs text-luxury-dark/90 font-light">
                            {selectedStoryModal.storyDetails.map((detail, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pełna treść relacji */}
                      <div className="space-y-3">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-dark/60 font-semibold block">
                          Pełna wypowiedź klientki:
                        </span>
                        <blockquote className="text-sm font-serif italic text-luxury-dark leading-relaxed pl-4 border-l-2 border-luxury-gold bg-luxury-cream/10 py-2">
                          &bdquo;{selectedStoryModal.text}&rdquo;
                        </blockquote>
                      </div>

                      {/* Stopka modala */}
                      <div className="pt-4 border-t border-luxury-sand/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <a
                          href={selectedStoryModal.sourceUrl || "https://slow-skin.pl/opinie/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-luxury-gold hover:underline flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Zobacz relację na oficjalnej stronie slow-skin.pl/opinie ↗
                        </a>
                        <button
                          onClick={() => setSelectedStoryModal(null)}
                          className="px-4 py-2 bg-luxury-dark text-luxury-cream hover:bg-luxury-gold transition-colors text-[10px] font-mono uppercase tracking-wider cursor-pointer"
                        >
                          Zamknij
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* TAB 2: JOURNAL / MAGAZYN SÈNE */}
          {activeTab === "journal" && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
              id="tab-journal"
            >
              {/* Journal Header */}
              <div className="text-center max-w-xl mx-auto space-y-4">
                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center justify-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Biblioteka Wiedzy i Stylu
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-light">Ekspercki Magazyn Slow Skin</h1>
                <p className="text-sm text-luxury-dark/95 font-light leading-relaxed">
                  Ciekawe artykuły, wskazówki pielęgnacyjne i wiedza przybliżające naturalne funkcjonowanie zdrowej skóry.
                </p>
              </div>

              {/* Search Bar & Category Filter Selector Row */}
              <div className="max-w-xl mx-auto space-y-5">
                {/* Category Filter Selector (Quiet Luxury Style) */}
                <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 py-1 border-t border-luxury-sand/35">
                  {[
                    { key: "ALL", label: "Wszystkie artykuły" },
                    { key: "FILOZOFIA", label: "Filozofia" },
                    { key: "NEUROBIOLOGIA", label: "Neurobiologia" },
                    { key: "FIZJOLOGIA", label: "Fizjologia" }
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setSelectedCategory(cat.key);
                        const filteredCategory = cat.key === "ALL" 
                          ? ARTICLES 
                          : ARTICLES.filter(art => art.category === cat.key);
                        const filtered = filteredCategory.filter(art => 
                          art.title.toLowerCase().includes(journalSearch.toLowerCase())
                        );
                        if (filtered.length > 0) {
                          const isDocStillAvailable = filtered.some(art => art.id === selectedArticle?.id);
                          if (!isDocStillAvailable) {
                            setSelectedArticle(filtered[0]);
                          }
                        } else {
                          setSelectedArticle(null);
                        }
                      }}
                      className={`px-4 py-2 text-[9px] font-mono tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                        selectedCategory === cat.key
                          ? "bg-luxury-dark text-white border-luxury-dark font-medium shadow-xs"
                          : "bg-white/40 text-luxury-dark/95 border-luxury-sand/55 hover:border-luxury-gold/70 hover:text-luxury-dark"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Quiet Luxury Minimalist Real-time Search Input */}
                <div className="relative border-b border-luxury-sand/40 pb-5">
                  <span className="absolute left-3.5 top-2.5 text-luxury-gold/70">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={journalSearch}
                    onChange={(e) => {
                      const query = e.target.value;
                      setJournalSearch(query);
                      const filteredCategory = selectedCategory === "ALL" 
                        ? ARTICLES 
                        : ARTICLES.filter(art => art.category === selectedCategory);
                      const filtered = filteredCategory.filter(art => 
                        art.title.toLowerCase().includes(query.toLowerCase())
                      );
                      if (filtered.length > 0) {
                        const isDocStillAvailable = filtered.some(art => art.id === selectedArticle?.id);
                        if (!isDocStillAvailable) {
                          setSelectedArticle(filtered[0]);
                        }
                      } else {
                        setSelectedArticle(null);
                      }
                    }}
                    placeholder="Wyszukaj artykuł lub badanie po tytule..."
                    className="w-full pl-10 pr-9 py-2 bg-white/40 border border-luxury-sand/50 text-xs text-luxury-dark tracking-wide font-light placeholder-luxury-dark/45 focus:outline-none focus:border-luxury-gold/70 hover:border-luxury-gold/30 transition-colors duration-300 rounded-none shadow-xs"
                  />
                  {journalSearch && (
                    <button
                      onClick={() => {
                        setJournalSearch("");
                        const filteredCategory = selectedCategory === "ALL" 
                          ? ARTICLES 
                          : ARTICLES.filter(art => art.category === selectedCategory);
                        if (filteredCategory.length > 0) {
                          const isDocStillAvailable = filteredCategory.some(art => art.id === selectedArticle?.id);
                          if (!isDocStillAvailable) {
                            setSelectedArticle(filteredCategory[0]);
                          }
                        }
                      }}
                      className="absolute right-3.5 top-2 text-luxury-dark/90 hover:text-luxury-dark transition-colors font-sans text-sm font-semibold cursor-pointer py-1 px-1 leading-none"
                      title="Wyczyść szukanie"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Master-Detail Article View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Article List Left Pane */}
                <div className="lg:col-span-5 space-y-8">
                  {(() => {
                    const filtered = ARTICLES.filter(art => {
                      const matchesCategory = selectedCategory === "ALL" || art.category === selectedCategory;
                      const matchesSearch = art.title.toLowerCase().includes(journalSearch.toLowerCase());
                      return matchesCategory && matchesSearch;
                    });
                    
                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-12 px-6 border border-dashed border-luxury-sand/60 bg-white/40">
                          <p className="font-serif italic text-xs text-luxury-dark/95 leading-relaxed">Brak publikacji spełniających podane kryteria.</p>
                          <button 
                            onClick={() => {
                              setJournalSearch("");
                              const defaultCategoryList = selectedCategory === "ALL" 
                                ? ARTICLES 
                                : ARTICLES.filter(art => art.category === selectedCategory);
                              if (defaultCategoryList.length > 0) {
                                setSelectedArticle(defaultCategoryList[0]);
                              }
                            }}
                            className="mt-4 text-[9px] font-mono tracking-widest uppercase text-luxury-gold hover:text-luxury-dark transition-colors border border-luxury-sand/40 px-3 py-1.5 bg-white cursor-pointer"
                          >
                            Wyczyść wyszukiwanie
                          </button>
                        </div>
                      );
                    }
                    
                    return filtered.map((article) => (
                      <div 
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className={`p-6 border transition-all cursor-pointer text-left ${selectedArticle?.id === article.id ? "bg-white border-luxury-gold/50 shadow-sm" : "border-luxury-sand hover:bg-white/40"}`}
                      >
                        {article.image && (
                          <div className="aspect-[16/9] w-full overflow-hidden mb-4 border border-luxury-sand/50 bg-luxury-cream/40">
                            <img 
                              src={article.image} 
                              alt={article.title} 
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-center font-mono text-[9px] tracking-wider text-luxury-gold mb-3">
                          <span className="uppercase font-semibold">{article.category}</span>
                          <span>{article.readingTime}</span>
                        </div>
                        <h3 className="font-serif text-xl font-light mb-2 hover:text-luxury-gold transition-colors">{article.title}</h3>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed line-clamp-3 mb-4">{article.lead}</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-luxury-dark font-medium group">
                          Czytaj artykuł 
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-luxury-gold" />
                        </div>
                      </div>
                    ));
                  })()}
                  
                  {/* Decorative Botanicals Banner */}
                  <div className="border border-luxury-sand p-4 bg-white hidden lg:block">
                    <div className="aspect-[4/3] bg-luxury-sand overflow-hidden relative">
                      <img 
                        src="/src/assets/images/regenerated_image_1781694292285.jpg" 
                        alt="Restorative Apothecary Vials"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center p-6 text-center">
                        <div className="bg-luxury-cream/90 backdrop-blur-sm p-4 border border-luxury-sand">
                          <p className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold uppercase">Formuła Czystości</p>
                          <p className="font-serif text-xs italic mt-1">Stężona pielęgnacja dopasowana biologicznie.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Article Reader Right Pane */}
                <div className="lg:col-span-7 bg-white border border-luxury-sand p-8 md:p-12 min-h-[500px] flex flex-col justify-between">
                  {selectedArticle ? (
                    <div className="space-y-6">
                      <div className="border-b border-luxury-sand pb-4 flex flex-wrap justify-between items-center text-xs font-mono tracking-widest text-luxury-dark/90 uppercase gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>Autorka: {selectedArticle.author}</span>
                          <span className="text-[#DDD]">•</span>
                          <span className="text-luxury-gold flex items-center gap-1">
                            <Clock className="w-3 h-3 stroke-[1.5]" /> {selectedArticle.readingTime}
                          </span>
                        </div>
                        <span className="text-luxury-dark/95 font-medium">{selectedArticle.category}</span>
                      </div>
                      
                      <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug">{selectedArticle.title}</h2>

                      {/* Editorial Illustration / Photography */}
                      {selectedArticle.image && (
                        <div className="my-6 border border-luxury-sand/60 overflow-hidden bg-luxury-cream/30">
                          <div className="aspect-[16/9] md:aspect-[21/10] w-full overflow-hidden">
                            <img 
                              src={selectedArticle.image} 
                              alt={selectedArticle.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          {selectedArticle.imageCaption && (
                            <p className="p-3 text-[11px] font-mono text-luxury-dark/80 bg-luxury-cream/70 border-t border-luxury-sand/40 italic text-center">
                              {selectedArticle.imageCaption}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-sm font-medium italic text-luxury-dark border-l-2 border-luxury-gold pl-4 py-2 leading-relaxed bg-luxury-cream/20">
                        {selectedArticle.lead}
                      </p>

                      {/* Key Scientific Data Points & Metrics Grid */}
                      {selectedArticle.dataPoints && selectedArticle.dataPoints.length > 0 && (
                        <div className="my-8 p-6 bg-luxury-cream/30 border border-luxury-sand">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-semibold">
                              Kluczowe Parametry Biologiczne i Dane Badawcze
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedArticle.dataPoints.map((dp, i) => (
                              <div key={i} className="p-4 bg-white border border-luxury-sand/60 shadow-xs">
                                <div className="font-serif text-2xl font-light text-luxury-gold mb-1">{dp.metric}</div>
                                <div className="font-mono text-[10px] tracking-wider uppercase text-luxury-dark font-medium mb-1">{dp.label}</div>
                                <div className="text-xs text-luxury-dark/85 font-light leading-relaxed">{dp.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Introductory Body */}
                      <div 
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          const anchor = target.closest("a");
                          if (anchor) {
                            const href = anchor.getAttribute("href");
                            if (href) {
                              const cleanHref = href.trim();
                              if (cleanHref.startsWith("/") || cleanHref === "cal-com" || cleanHref === "rezerwacja-online" || cleanHref === "ai-analiza") {
                                e.preventDefault();
                                handleLinkClick(cleanHref);
                              }
                            }
                          }
                        }}
                        className="space-y-4 text-sm text-luxury-dark/95 font-light leading-relaxed"
                      >
                        {selectedArticle.content.map((paragraph, index) => (
                          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </div>

                      {/* In-Article Scientific Graphic & Clinical Comparison Chart */}
                      {selectedArticle.inArticleGraphic && (
                        <div className="my-8 border border-luxury-sand/80 bg-white/95 shadow-sm overflow-hidden text-left">
                          {/* Top Visual Graphic/Photo with Microscopic/Clinical Caption */}
                          {selectedArticle.inArticleGraphic.image && (
                            <div className="border-b border-luxury-sand/60 bg-luxury-cream/20">
                              <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                                <img
                                  src={selectedArticle.inArticleGraphic.image}
                                  alt={selectedArticle.inArticleGraphic.chartTitle}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              {selectedArticle.inArticleGraphic.imageCaption && (
                                <p className="p-3 text-[11px] font-mono text-luxury-dark/80 bg-luxury-cream/50 border-t border-luxury-sand/40 italic text-center">
                                  {selectedArticle.inArticleGraphic.imageCaption}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Scientific Comparison Chart Data */}
                          <div className="p-6 md:p-8 space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-luxury-gold"></span>
                                <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-semibold">
                                  Analiza Biologiczna i Pomiary Aparaturowe
                                </span>
                              </div>
                              <h4 className="font-serif text-xl md:text-2xl font-light text-luxury-dark">
                                {selectedArticle.inArticleGraphic.chartTitle}
                              </h4>
                              {selectedArticle.inArticleGraphic.chartSubtitle && (
                                <p className="text-xs text-luxury-dark/80 font-light mt-1">
                                  {selectedArticle.inArticleGraphic.chartSubtitle}
                                </p>
                              )}
                            </div>

                            {/* Metrics comparison grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {selectedArticle.inArticleGraphic.data.map((item, idx) => (
                                <div key={idx} className="p-4 bg-luxury-cream/25 border border-luxury-sand/60 space-y-3">
                                  <div className="text-xs font-serif font-medium text-luxury-dark">
                                    {item.label}
                                  </div>

                                  {/* Metric values comparison */}
                                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-luxury-sand/40">
                                    <div>
                                      <span className="font-serif text-xl font-light text-luxury-gold">
                                        {item.valuePrimary}
                                      </span>
                                      <div className="text-[10px] font-mono text-luxury-dark/85 uppercase tracking-wider">
                                        {item.sublabelPrimary}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-base font-light text-luxury-dark/60">
                                        {item.valueSecondary}
                                      </span>
                                      <div className="text-[10px] font-mono text-luxury-dark/60 uppercase tracking-wider">
                                        {item.sublabelSecondary}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Progress Visual Bar */}
                                  <div className="h-1.5 w-full bg-luxury-sand/30 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-luxury-gold rounded-full transition-all duration-500"
                                      style={{ width: `${Math.min(100, item.percentage || 60)}%` }}
                                    />
                                  </div>

                                  {item.note && (
                                    <p className="text-[11px] text-luxury-dark/90 font-light leading-relaxed pt-1">
                                      {item.note}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Clinical Conclusion Banner */}
                            {selectedArticle.inArticleGraphic.clinicalConclusion && (
                              <div className="p-4 bg-luxury-gold/10 border-l-2 border-luxury-gold text-xs text-luxury-dark font-light leading-relaxed italic">
                                {selectedArticle.inArticleGraphic.clinicalConclusion}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* In-Depth Thematic Sections */}
                      {selectedArticle.sections && selectedArticle.sections.length > 0 && (
                        <div className="space-y-8 pt-4">
                          {selectedArticle.sections.map((sec, secIdx) => (
                            <div key={secIdx} className="space-y-3 pt-6 border-t border-luxury-sand/40">
                              <h3 className="font-serif text-xl md:text-2xl font-normal text-luxury-dark text-left">
                                {sec.heading}
                              </h3>
                              <div 
                                onClick={(e) => {
                                  const target = e.target as HTMLElement;
                                  const anchor = target.closest("a");
                                  if (anchor) {
                                    const href = anchor.getAttribute("href");
                                    if (href) {
                                      const cleanHref = href.trim();
                                      if (cleanHref.startsWith("/") || cleanHref === "cal-com" || cleanHref === "rezerwacja-online" || cleanHref === "ai-analiza") {
                                        e.preventDefault();
                                        handleLinkClick(cleanHref);
                                      }
                                    }
                                  }
                                }}
                                className="space-y-3 text-sm text-luxury-dark/95 font-light leading-relaxed text-left"
                              >
                                {sec.paragraphs.map((p, pIdx) => (
                                  <p key={pIdx} dangerouslySetInnerHTML={{ __html: p }} />
                                ))}
                              </div>

                              {/* Section Table (e.g. Biomimetic Ingredients Research Table) */}
                              {sec.table && (
                                <div className="my-6 overflow-hidden border border-luxury-sand/70 bg-white/95 shadow-xs text-left">
                                  <div className="bg-luxury-cream/50 px-4 py-3 border-b border-luxury-sand/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                                      {sec.table.caption}
                                    </span>
                                    <span className="text-[9px] font-mono text-luxury-dark/60 uppercase">
                                      Biochemia Naskórka • Slow Skin
                                    </span>
                                  </div>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="border-b border-luxury-sand/50 bg-luxury-sand/15">
                                          {sec.table.headers.map((h, hIdx) => (
                                            <th key={hIdx} className="p-3 font-mono text-[10px] tracking-wider uppercase text-luxury-dark font-medium whitespace-nowrap">
                                              {h}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-luxury-sand/30">
                                        {sec.table.rows.map((r, rIdx) => (
                                          <tr key={rIdx} className="hover:bg-luxury-cream/20 transition-colors">
                                            <td className="p-3 font-serif font-medium text-luxury-dark whitespace-nowrap">
                                              {r.ingredient}
                                            </td>
                                            <td className="p-3 text-luxury-dark/85 font-light">
                                              {r.role}
                                            </td>
                                            <td className="p-3 text-luxury-gold font-medium whitespace-nowrap">
                                              {r.effect}
                                            </td>
                                            <td className="p-3 text-luxury-dark/95 font-light">
                                              {r.benefit}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Scientific Citations & Research Findings */}
                      {selectedArticle.studyNotes && selectedArticle.studyNotes.length > 0 && (
                        <div className="my-8 p-6 bg-white border border-luxury-gold/40 space-y-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-semibold">
                              Źródła Naukowe i Doniesienia Dermatologiczne
                            </span>
                          </div>
                          <div className="space-y-3">
                            {selectedArticle.studyNotes.map((note, nIdx) => (
                              <div key={nIdx} className="p-4 bg-luxury-cream/30 border border-luxury-sand/50 space-y-1.5">
                                <p className="font-mono text-[10px] text-luxury-gold font-medium uppercase tracking-wider">
                                  {note.citation}
                                </p>
                                <p className="text-xs text-luxury-dark/90 font-light leading-relaxed">
                                  {note.finding}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Practical Takeaways / Gabinetowe Rekomendacje */}
                      {selectedArticle.practicalTakeaways && selectedArticle.practicalTakeaways.length > 0 && (
                        <div className="my-8 p-6 bg-luxury-cream/40 border border-luxury-sand space-y-3 text-left">
                          <p className="font-mono text-[9px] tracking-[0.2em] text-luxury-dark uppercase font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                            Rekomendacje Gabinetowe do Pielęgnacji Domowej
                          </p>
                          <ul className="space-y-2.5 text-xs text-luxury-dark/95 font-light">
                            {selectedArticle.practicalTakeaways.map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <blockquote className="bg-luxury-cream/50 p-6 italic font-serif text-base text-luxury-dark border border-luxury-sand text-center my-8">
                        &ldquo;{selectedArticle.quote}&rdquo;
                      </blockquote>

                      {/* Active Social Share Panel */}
                      <div className="bg-luxury-cream/30 border border-luxury-sand/50 p-5 space-y-3.5 my-8">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-dark/90 uppercase">Udostępnij ten artykuł ekspercki</span>
                          <span className="text-[10px] font-mono text-luxury-gold">{selectedArticle.readingTime}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* FB button */}
                          <button
                            onClick={() => {
                              const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                              window.open(shareUrl, "_blank", "width=600,height=400");
                            }}
                            className="bg-white hover:bg-luxury-cream text-luxury-dark border border-luxury-sand/70 hover:border-luxury-gold px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-luxury-gold"
                            title="Udostępnij na Facebooku"
                          >
                            <Facebook className="w-3.5 h-3.5" /> FB
                          </button>

                          {/* X button */}
                          <button
                            onClick={() => {
                              const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedArticle.title)}&url=${encodeURIComponent(window.location.href)}`;
                              window.open(shareUrl, "_blank", "width=600,height=300");
                            }}
                            className="bg-white hover:bg-luxury-cream text-luxury-dark border border-luxury-sand/70 hover:border-luxury-gold px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-luxury-gold"
                            title="Udostępnij na platformie X"
                          >
                            <Twitter className="w-3.5 h-3.5" /> X
                          </button>

                          {/* Instagram button with copy-link feature for Instagram bio/share */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#/journal/${selectedArticle.id}`);
                              setSharedNotification(true);
                              setTimeout(() => setSharedNotification(false), 3000);
                            }}
                            className="bg-white hover:bg-luxury-cream text-luxury-dark border border-luxury-sand/70 hover:border-luxury-gold px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-luxury-gold"
                            title="Skopiuj link i przejdź do Instagrama"
                          >
                            <Instagram className="w-3.5 h-3.5" /> Instagram
                          </button>
                        </div>

                        {/* Clipboard feedback indicator */}
                        <AnimatePresence>
                          {sharedNotification && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-[10px] font-mono text-green-700 bg-green-50 border border-green-100 p-2.5 rounded-none text-left leading-relaxed mt-2"
                            >
                              ✦ Link do artykułu skopiowano do schowka! Możesz teraz wkleić go w bio lub wiadomości na Instagramie.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="pt-6 border-t border-luxury-sand flex items-center justify-between">
                        <span className="text-[10px] font-mono text-luxury-dark/90 uppercase">Slow Skin Concept</span>
                        <button
                          onClick={() => { setActiveTab("diagnose"); setDiagnosticStep(0); }}
                          className="text-xs font-mono tracking-wider text-luxury-gold hover:text-luxury-dark transition-colors flex items-center gap-1.5"
                        >
                          Dopasuj terapię diagnozą AI <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-12">
                      <div className="w-16 h-16 rounded-full border border-luxury-sand flex items-center justify-center text-luxury-gold">
                        <BookOpen className="w-6 h-6 stroke-[1.2]" />
                      </div>
                      <p className="font-serif text-xl tracking-wide max-w-sm">Wybierz jeden z artykułów po lewej stronie, aby rozpocząć lekturę</p>
                      <p className="text-xs font-mono text-luxury-dark/90 uppercase tracking-widest">Slow Skin Concept — Journal</p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "method" && (
            <motion.div
              key="method"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              id="tab-method"
            >
              <MethodPage 
                onLinkClick={handleLinkClick} 
                onOpenBooking={(treatment) => handleOpenBooking(treatment)} 
              />
            </motion.div>
          )}

              
          {/* TAB 4: CLINICAL MENU & BOOKINGS */}
          {activeTab === "clinic" && (
            <motion.div
              key={selectedTreatment ? `clinic-detail-${selectedTreatment.id}` : "clinic-list"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
              id="tab-clinic"
            >
              {selectedTreatment ? (
                /* EXPERT TREATMENT DEEP DETAILS SUBPAGE */
                <div className="space-y-12 text-left animate-fade-in" id="treatment-detail-subpage">
                  
                  {/* Return Header */}
                  <div className="flex items-center justify-between border-b border-luxury-sand/50 pb-4">
                    <button 
                      onClick={() => setSelectedTreatment(null)}
                      className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-luxury-dark/95 hover:text-luxury-gold transition-colors uppercase group"
                    >
                      <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Wróć do listy zabiegów
                    </button>
                    <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase hidden sm:block">Monografia Rytuału Kosmeceutycznego</span>
                  </div>

                  {/* Stałe oznaczenie na górze strony dla technologii liftingujących */}
                  {(selectedTreatment.id === "hifu-ultrasound" || selectedTreatment.id === "rf-microneedling" || selectedTreatment.id === "neurolifting-face") && (
                    <div className="bg-luxury-gold/10 border-l-4 border-luxury-gold p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-luxury-gold shrink-0" />
                        <span className="font-mono text-xs tracking-[0.25em] text-luxury-dark font-bold uppercase">
                          {selectedTreatment.id === "neurolifting-face" ? "LIFTING I PRACA Z NAPIĘCIEM MIĘŚNIOWYM" : "TECHNOLOGIE LIFTINGUJĄCE"}
                        </span>
                      </div>
                      <span className="font-mono text-[9.5px] tracking-widest text-luxury-gold uppercase">
                        Lifting i przebudowa skóry
                      </span>
                    </div>
                  )}

                  {/* Intro Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block font-bold">
                          {(selectedTreatment.id === "hifu-ultrasound" || selectedTreatment.id === "rf-microneedling")
                            ? "TECHNOLOGIE LIFTINGUJĄCE"
                            : selectedTreatment.id === "neurolifting-face"
                            ? "LIFTING I PRACA Z NAPIĘCIEM MIĘŚNIOWYM"
                            : "Autorski Rytuał Premium"}
                        </span>
                        <h1 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark leading-tight">{selectedTreatment.title}</h1>
                        <p className="text-xs font-mono text-luxury-gold tracking-widest uppercase italic">{selectedTreatment.subtitle}</p>
                        
                        <div className="pt-4 text-sm md:text-base font-light text-luxury-dark leading-relaxed font-serif">
                          &ldquo;{selectedTreatment.description}&rdquo;
                        </div>
                      </div>
                    </div>

                    {/* Gorgeous Editorial Treatment Photo on the details page */}
                    <div className="lg:col-span-4 border border-luxury-sand p-2 bg-white flex flex-col justify-between">
                      <div className="aspect-[4/3] w-full min-h-[220px] overflow-hidden bg-luxury-sand relative group">
                        <img 
                          src={selectedTreatment.id === "pst-signal-therapy" ? PST_IMAGES[selectedPstImageIndex].url : getEffectiveTreatmentImage(selectedTreatment)} 
                          onError={(e) => {
                            if (selectedTreatment.id === "pst-signal-therapy") {
                              e.currentTarget.src = PST_IMAGES[selectedPstImageIndex].fallback;
                            } else if (e.currentTarget.src !== selectedTreatment.image) {
                              e.currentTarget.src = selectedTreatment.image;
                            }
                          }}
                          alt={selectedTreatment.id === "pst-signal-therapy" ? PST_IMAGES[selectedPstImageIndex].title : selectedTreatment.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                        {selectedTreatment.id === "pst-signal-therapy" && (
                          <span className="absolute bottom-2 left-2 bg-luxury-dark/90 text-luxury-gold text-[8.5px] font-mono px-2 py-0.5 uppercase tracking-wider backdrop-blur-xs border border-luxury-gold/40">
                            {PST_IMAGES[selectedPstImageIndex].tag}
                          </span>
                        )}
                        {/* Quick Original Photo Uploader Button */}
                        <button
                          onClick={() => setIsImageManagerOpen(true)}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-luxury-dark hover:text-luxury-gold px-2 py-1 text-[8px] font-mono uppercase tracking-wider rounded-2xs border border-luxury-sand/80 shadow-xs flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                          title="Wstaw własne oryginalne zdjęcie dla tego zabiegu"
                        >
                          <Camera className="w-3 h-3 text-luxury-gold" />
                          <span>Zmień zdjęcie</span>
                        </button>
                      </div>
                      {selectedTreatment.id === "pst-signal-therapy" && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          {PST_IMAGES.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedPstImageIndex(idx)}
                              className={`p-1.5 border text-left flex items-center gap-2 transition-all cursor-pointer ${selectedPstImageIndex === idx ? "border-luxury-gold bg-luxury-gold/10" : "border-luxury-sand/60 hover:border-luxury-gold/50 bg-white"}`}
                            >
                              <img src={img.url} alt={img.title} className="w-9 h-7 object-cover rounded-xs shrink-0" referrerPolicy="no-referrer" />
                              <div className="overflow-hidden min-w-0">
                                <p className="font-mono text-[8px] uppercase font-bold text-luxury-dark truncate">{img.title}</p>
                                <p className="text-[7px] font-mono text-luxury-gold/90 truncate">{img.tag.split("•")[1] || img.tag}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`lg:col-span-3 p-6 flex flex-col justify-between font-mono text-[11px] gap-4 ${
                      (selectedTreatment.id === "skin-readiness" || selectedTreatment.id === "slow-skin-first")
                        ? "bg-gradient-to-b from-[#fdfbf7] to-[#faf5e9] border-2 border-luxury-gold shadow-md"
                        : "bg-white border border-luxury-sand"
                    }`}>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] text-luxury-dark/90 uppercase tracking-widest border-b border-luxury-sand pb-2 font-bold">Karta Parametrów Seansu</p>
                          <div className="flex justify-between items-center py-2 border-b border-luxury-sand/40">
                            <span className="text-luxury-dark/95 uppercase tracking-wider text-[10px]">Czas Trwania:</span>
                            <span className="text-luxury-dark font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-luxury-gold" /> {selectedTreatment.duration}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-luxury-sand/40">
                            <span className="text-luxury-dark/95 uppercase tracking-wider text-[10px]">Inwestycja:</span>
                            <span className="text-luxury-gold font-bold text-xs">{selectedTreatment.price}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-luxury-dark/95 uppercase tracking-wider text-[10px]">Podstawa:</span>
                            <span className="text-luxury-dark uppercase tracking-widest text-[9px] font-medium">
                              {selectedTreatment.id === "hifu-ultrasound" || selectedTreatment.id === "rf-microneedling"
                                ? "Kwalifikacja i dobór parametrów"
                                : selectedTreatment.id === "neurolifting-face"
                                ? "Analiza mięśniowo-powięziowa"
                                : selectedTreatment.id === "carboksyterapia-carboregen"
                                ? "Iniekcyjna stymulacja CO₂"
                                : selectedTreatment.id === "stymulatory-tkankowe"
                                ? "Indywidualna biostymulacja iniekcyjna"
                                : "Głęboka Bioregeneracja"}
                            </span>
                          </div>
                        </div>

                        {(selectedTreatment.id === "skin-readiness" || selectedTreatment.id === "slow-skin-first") && (
                          <div className="bg-white/80 border border-luxury-gold/50 p-3.5 text-[10.5px] leading-relaxed text-luxury-dark font-sans font-light space-y-1.5 rounded-none shadow-xs">
                            <span className="text-luxury-gold font-extrabold uppercase tracking-wider text-[8.5px] block">★ Rekomendacja Instytutu: Pakiet Premium (600 zł)</span>
                            <p className="m-0 text-luxury-dark">
                              Obejmuje pełną, wielowymiarową komputerową diagnostykę skóry systemami <strong>Nati V3</strong> i <strong>Iomet</strong>, szczegółowy audyt barierowości oraz autorski, cyfrowy <strong>Beauty Plan</strong>.
                            </p>
                            <span className="text-[9px] font-mono text-luxury-gold block font-semibold uppercase tracking-wider mt-1 text-right">Wybór 94% nowych pacjentek</span>
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => {
                          setBookingTreatment(selectedTreatment);
                          setBookingConfirmed(false);
                          setBookingName("");
                          setBookingEmail("");
                          setBookingPhone("");
                          setBookingDate("");
                        }}
                        className={`w-full py-3.5 text-center uppercase tracking-widest text-[10px] transition-colors cursor-pointer font-bold ${
                          selectedTreatment.id === "slow-skin-first"
                            ? "bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white"
                            : "bg-luxury-dark text-luxury-cream hover:bg-luxury-gold hover:text-white"
                        }`}
                      >
                        {selectedTreatment.id === "hifu-ultrasound"
                          ? "UMÓW KONSULTACJĘ DO ZABIEGU HIFU"
                          : selectedTreatment.id === "rf-microneedling"
                          ? "UMÓW KONSULTACJĘ DO RADIOFREKWENCJI MIKROIGŁOWEJ"
                          : selectedTreatment.id === "neurolifting-face"
                          ? "UMÓW KONSULTACJĘ DO NEUROLIFTINGU"
                          : selectedTreatment.id === "carboksyterapia-carboregen"
                          ? "UMÓW ZABIEG CARBOREGEN W KALENDARZU"
                          : selectedTreatment.id === "stymulatory-tkankowe"
                          ? "ZAREZERWUJ STYMULATORY TKANKOWE"
                          : "Zarezerwuj wizytę"}
                      </button>
                    </div>
                  </div>

                  {/* Main Editorial Body Layout: Split columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
                    
                    {/* Column 1: Indications & Contraindications */}
                    <div className="space-y-8">
                      {/* Indications */}
                      <div className="bg-gradient-to-br from-white to-luxury-cream/30 border-l-4 border-l-luxury-gold border-y border-r border-luxury-sand p-6 md:p-8 space-y-4 shadow-sm">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase flex items-center gap-2 font-semibold">
                          <Check className="w-4 h-4 text-luxury-gold stroke-[2.5]" /> Medyczne Wskazania do Terapii
                        </span>
                        <h3 className="font-serif text-xl font-light text-luxury-dark border-b border-luxury-sand/40 pb-2 leading-tight">Kiedy Twoja skóra potrzebuje tego zabiegu</h3>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                          Wybierz zjawiska, które obserwujesz na swojej skórze, aby zweryfikować dopasowanie zabiegu:
                        </p>
                        <div className="space-y-2.5 pt-2">
                          {selectedTreatment.indications.map((ind, i) => {
                            const isSelected = !!userSelectedIndications[`${selectedTreatment.id}-${i}`];
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  setUserSelectedIndications(prev => ({
                                    ...prev,
                                    [`${selectedTreatment.id}-${i}`]: !prev[`${selectedTreatment.id}-${i}`]
                                  }));
                                }}
                                className={`w-full text-left text-xs font-light flex items-center gap-3.5 p-4 transition-all duration-300 border focus:outline-none min-h-[48px] cursor-pointer ${
                                  isSelected 
                                    ? "bg-luxury-gold/[0.08] border-luxury-gold text-luxury-dark font-medium shadow-sm" 
                                    : "bg-white hover:bg-luxury-cream/20 border-luxury-sand/60 text-luxury-dark hover:text-luxury-dark"
                                }`}
                              >
                                <span className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                  isSelected 
                                    ? "bg-luxury-gold border-luxury-gold text-white scale-105" 
                                    : "border-luxury-sand/80 bg-white"
                                }`}>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </span>
                                <span className="leading-relaxed flex-1">{ind}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Contraindications */}
                      <div className="bg-gradient-to-br from-white to-red-50/[0.15] border-l-4 border-l-red-500/80 border-y border-r border-luxury-sand p-6 md:p-8 space-y-4 relative overflow-hidden shadow-sm">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-red-600/80 uppercase flex items-center gap-2 font-semibold">
                          <X className="w-4 h-4 text-red-600/80 stroke-[2.5]" /> Eksperckie Przeciwwskazania
                        </span>
                        <h3 className="font-serif text-xl font-light text-luxury-dark border-b border-luxury-sand/40 pb-2 leading-tight">Bezwzględne kryteria wykluczające</h3>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                          Sprawdź poniższe czynniki. Dotknięcie przeciwwskazania podświetli alert ostrzegawczy:
                        </p>
                        <div className="space-y-2.5 pt-2">
                          {selectedTreatment.contraindications.map((cnt, i) => {
                            const isSelected = !!userCheckedContraindications[`${selectedTreatment.id}-${i}`];
                            return (
                              <button
                                key={i}
                                onClick={() => {
                                  setUserCheckedContraindications(prev => ({
                                    ...prev,
                                    [`${selectedTreatment.id}-${i}`]: !prev[`${selectedTreatment.id}-${i}`]
                                  }));
                                }}
                                className={`w-full text-left text-xs font-light flex items-center gap-3.5 p-4 transition-all duration-300 border focus:outline-none min-h-[48px] cursor-pointer ${
                                  isSelected 
                                    ? "bg-red-50/50 border-red-400 text-red-950 font-medium shadow-sm" 
                                    : "bg-white hover:bg-red-50/[0.1] border-luxury-sand/60 text-luxury-dark hover:text-luxury-dark"
                                }`}
                              >
                                <span className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                  isSelected 
                                    ? "bg-red-500 border-red-500 text-white scale-105" 
                                    : "border-luxury-sand/80 bg-white"
                                }`}>
                                  {isSelected && <X className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </span>
                                <span className="leading-relaxed flex-1">{cnt}</span>
                              </button>
                            );
                          })}
                        </div>
                        {Object.keys(userCheckedContraindications).some(key => key.startsWith(selectedTreatment.id) && userCheckedContraindications[key]) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 p-4 mt-4 text-xs text-red-900 leading-relaxed font-serif flex items-start gap-3"
                          >
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-sans font-semibold uppercase text-[10px] tracking-wider text-red-800 mb-1">Uwaga / Warning:</strong>
                              Wykryto potencjalne przeciwwskazanie do przeprowadzenia seansu. Przed dokonaniem rezerwacji online zalecamy pilną, bezpłatną konsultację z naszym ekspertem dermatologicznym lub kontakt telefoniczny w celu doboru bezpiecznej terapii alternatywnej.
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Column 2: Active Substances & Post Care */}
                    <div className="space-y-8">
                      {/* Active Substances */}
                      <div className="bg-white border border-luxury-sand p-8 space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center gap-2">
                          <FlaskConical className="w-4 h-4 text-luxury-gold" /> Molekularne Substancje Aktywne i Kosmeceutyki
                        </span>
                        <h3 className="font-serif text-xl font-light text-luxury-dark border-b border-luxury-sand/40 pb-2">Kompozycja bioaktywnych eliksirów</h3>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                          Formuły stymulujące używane w kabinie są konfekcjonowane bezpośrednio przed sesją z najwyższej jakości surowców biomimetycznych o laboratoryjnej czystości działania:
                        </p>
                        <div className="space-y-4 pt-2">
                          {selectedTreatment.activeSubstances.map((sub, i) => {
                            const [title, ...descParts] = sub.split(" (");
                            const desc = descParts.join(" (").replace(/\)$/, "");
                            return (
                              <div key={i} className="space-y-1">
                                <h4 className="font-serif text-sm font-medium text-luxury-gold">{title}</h4>
                                {desc && <p className="text-xs text-luxury-dark/95 font-light leading-relaxed pl-3 border-l border-luxury-sand/60">{desc}</p>}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Post Treatment Care */}
                      <div className="bg-white border border-luxury-sand p-8 space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center gap-2">
                          <Compass className="w-4 h-4 text-luxury-gold" /> Zalecenia Pozabiegowe i Rekonwalescencja
                        </span>
                        <h3 className="font-serif text-xl font-light text-luxury-dark border-b border-luxury-sand/40 pb-2">Protokół domowej regeneracji naskórka</h3>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                          Odpowiedź immunologiczna skóry trwa równe 48 do 72 godzin od zakończenia rytuału. Aby zmaksymalizować syntezę komórkową, należy bezwzględnie przestrzegać poniższego protokołu:
                        </p>
                        <ul className="space-y-3 pt-2">
                          {selectedTreatment.postTreatmentCare.map((care, i) => (
                            <li key={i} className="text-xs text-luxury-dark font-light flex items-start gap-2.5 leading-relaxed">
                              <span className="text-luxury-gold text-[10px] font-mono mt-0.5">{`0${i + 1}`}</span>
                              <span>{care}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* Rozszerz opis terapii dla Slow Skin Concept - Pierwsza Wizyta / Skin Readiness */}
                  {(selectedTreatment.id === "skin-readiness" || selectedTreatment.id === "slow-skin-first") && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="slow-skin-first-detailed-ceremony">
                      {/* Jak wygląda pierwsza wizyta? */}
                      <div className="space-y-8">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block">Autorski Przewodnik Ceremonii</span>
                          <h2 className="font-serif text-3xl font-light text-luxury-dark">Jak wygląda pierwsza wizyta?</h2>
                          <div className="w-12 h-[1px] bg-luxury-gold/50 mx-auto" />
                          <p className="text-xs text-luxury-dark/95 font-serif italic max-w-lg mx-auto leading-relaxed">
                            Pierwsza wizyta to początek Twojej podróży do zdrowej i pięknej skóry. To nie jest zwykła konsultacja – to ceremonia otwierająca terapię, w której krok po kroku przywracam skórze równowagę, aby mogła odzyskać swój naturalny rytm i blask.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                            {
                              step: "Krok 1",
                              title: "Diagnoza skóry",
                              desc: "Krok, od którego wszystko się zaczyna. Badam Twoją skórę za pomocą zaawansowanego, nowoczesnego urządzenia – Thessia Skin Scanner. Diagnostyka opiera się na precyzyjnych pomiarach ośmiu kluczowych parametrów naskórka: struktury skóry (jej wieku biologicznego), natłuszczenia, poziomu złuszczania, głębokości zmarszczek, wielkości porów, widoczności naczynek, intensywności zmian barwnikowych i stopnia nawilżenia głębokiego."
                            },
                            {
                              step: "Krok 2",
                              title: "Konsultacja kosmetologiczna",
                              desc: "Diagnostyka aparaturowa jest niezwykle ważna, ale nie zastąpi eksperckiej wiedzy i wieloletniego doświadczenia, dzięki któremu potrafię w pełni rozpoznawać i rozumieć głębokie potrzeby skóry. Kolejnym krokiem spotkania jest wnikliwa rozmowa, podczas której poznaję Ciebie i Twoją skórę. Pytam o stosowaną pielęgnację domową, dietę, styl życia, oczekiwania i wcześniejsze doświadczenia zabiegowe. To moment, w którym wspólnie tworzymy obraz terapii – ma ona bowiem być nie tylko maksymalnie skuteczna, ale też niezwykle przyjazna i idealnie dopasowana do Twojego codziennego trybu życia."
                            },
                            {
                              step: "Krok 3",
                              title: "Indywidualny plan terapii biologicznej",
                              desc: "Na podstawie szczegółowej diagnozy i konsultacji tworzę spersonalizowany Beauty Plan – komplementarną mapę pielęgnacji Twojej skóry. To harmonijne połączenie zaawansowanych zabiegów gabinetowych i bionomicznej pielęgnacji domowej, zawierające konkretne zalecenia rozpisane krok po kroku. To Twój szczegółowy przewodnik, który prowadzi Cię bezpiecznie i pewnie przez całą terapię."
                            },
                            {
                              step: "Krok 4",
                              title: "Wielopoziomowy zabieg otwierający",
                              desc: "Pierwsza wizyta to nie tylko rozmowa i suchy plan – to także pierwszy fizjologiczny krok w stronę trwałego zdrowia skóry. Już podczas pierwszej wizyty wykonuję wielopoziomowy zabieg, dobrany ściśle i indywidualnie do aktualnych potrzeb Twojej skóry. Jego nadrzędnym celem jest przywrócenie fundamentów: właściwego pH, odbudowy mikrobiomu oraz wzmocnienia barier ochronnych naskórka. Dopiero gdy skóra odzyska pełną stabilność i biologiczny spokój, możemy bezpiecznie wprowadzać kolejne etapy terapii – wygładzanie, rozjaśnianie, regenerację czy ukierunkowane działania slow-aging."
                            }
                          ].map((item, idx) => (
                            <div key={idx} className="border border-luxury-sand p-6 bg-white/50 rounded-sm space-y-4 flex flex-col justify-between text-left hover:border-luxury-gold/40 hover:shadow-xs transition-all duration-300">
                              <div className="space-y-3">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">{item.step}</span>
                                <h4 className="font-serif text-base font-light text-luxury-dark">{item.title}</h4>
                                <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed text-left">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Terapia: Holistyczne zabiegi na twarz — biologiczna terapia skóry */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch pt-6">
                        
                        {/* Lewa strona: Filozofia i holistyczna biologia */}
                        <div className="lg:col-span-7 border border-luxury-sand p-8 bg-white/40 rounded-sm flex flex-col justify-between text-left space-y-6">
                          <div className="space-y-4">
                            <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold block">Biologiczna Doktryna</span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Holistyczne zabiegi na twarz – biologiczna terapia skóry</h3>
                            <div className="w-12 h-[1px] bg-luxury-gold/50" />
                            
                            <div className="space-y-4 text-xs text-luxury-dark/95 font-light leading-relaxed text-justify">
                              <p>
                                Klasyczna kosmetologia skupia się głównie na poprawie wyglądu skóry „tu i teraz”, niwelowaniu powierzchownych objawów i powtarzalnych procedurach dopasowanych mechanicznie do typu cery. To dlatego efekty często są widoczne wyłącznie tymczasowo, a silne pobudzanie skóry i wywoływanie w niej kontrolowanego stanu zapalnego (np. poprzez agresywne, częste złuszczenie, silny retinol czy drażniące kwasy) drastycznie zwiększa reaktywność i w efekcie pogarsza jej stan barierowy.
                              </p>
                              <p className="font-medium text-luxury-dark">
                                Slow Skin Concept™ działa całkowicie inaczej – traktuje skórę jako żywy, niezwykle inteligentnie adaptujący się organ, uwzględniając jej unikalną barierę chroniącą, delikatny mikrobiom, utajone stany zapalne oraz nienaruszoną komunikację komórkową.
                              </p>
                              <p>
                                Pracuję u podstaw – na przyczynach, a nie na samych objawach zmian skórnych, dzięki czemu efekty bionomiczne są stabilne i trwałe, a wykonywane zabiegi w pełni bezpieczne. Procedury i rytuały zawsze dobieram indywidualnie, na podstawie precyzyjnie diagnozowanej „gotowości biologicznej” skóry i jej aktualnej kondycji lipidowej.
                              </p>
                              <p className="italic font-serif text-luxury-dark/95 pl-4 border-l border-luxury-gold/40">
                                Moja autorska metoda zakłada, że najgłębsza regeneracja zachodzi tylko w warunkach pełnego spokoju biologicznego, a silniejsza stymulacja ma sens tylko wtedy, gdy skóra jest na nią odpowiednio przygotowana. Dlatego prowadzę skórę przez indywidualnie zaplanowany proces, a nie serię inwazyjnych, obciążających zabiegów.
                              </p>
                            </div>
                          </div>

                          {/* Trzy filary manifestu */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-luxury-sand/30">
                            {[
                              { label: "Brak Przymusu", val: "Nie odmładzam skóry na siłę." },
                              { label: "Pojednanie z Czasem", val: "Nie walczę z czasem." },
                              { label: "Głęboka harmonia", val: "Nie poprawiam defektów powierzchownie." }
                            ].map((item, idx) => (
                              <div key={idx} className="p-3 border border-luxury-sand/30 bg-luxury-sand/5 text-center rounded-sm">
                                <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase block font-semibold mb-1">{item.label}</span>
                                <p className="font-serif text-[11px] italic text-luxury-dark font-light leading-snug">{item.val}</p>
                              </div>
                            ))}
                          </div>

                          <div className="p-4 border border-luxury-gold/20 bg-luxury-gold/5 rounded-sm text-center">
                            <span className="font-serif text-xs font-light text-luxury-dark leading-relaxed">
                              Tworzę warunki, w których Twoja skóra przypomina sobie, jak się prawidłowo i naturalnie regenerować.
                            </span>
                          </div>
                        </div>

                        {/* Prawa strona: Manifest i Wyróżniki sposobu pracy */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                          {/* Karta Obietnicy */}
                          <div className="border border-luxury-gold/25 bg-luxury-sand/10 p-6 rounded-sm text-left relative overflow-hidden space-y-4">
                            <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold block">Nasza Bezwzględna Obietnica</span>
                            <h4 className="font-serif text-base font-light text-luxury-dark">Nie obiecuję natychmiastowego liftingu za wszelką cenę. Obiecuję coś trwalszego:</h4>
                            
                            <ul className="space-y-3 pt-1 text-xs text-luxury-dark font-light">
                              {[
                                "pełną stabilność naskórka i fizjologiczną równowagę,",
                                "przewidywalną, zdrową reakcję na czynniki zewnętrzne,",
                                "stopniową, widoczną poprawę jakości strukturalnej skóry,",
                                "oraz efekty terapeutyczne, które się trwale utrzymują."
                              ].map((text, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <span className="text-luxury-gold font-bold mt-0.5">✓</span>
                                  <span>{text}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-[10px] font-serif italic text-luxury-dark/95 pt-2 border-t border-luxury-sand/40">
                              Bo prawdziwe odmładzanie to proces biologiczny, nie jednorazowy zabieg.
                            </p>
                          </div>

                          {/* Karta Cech Unikalnych */}
                          <div className="border border-luxury-sand bg-white/70 p-6 rounded-sm text-left space-y-4">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Zasada Indywidualizacji</span>
                            <h4 className="font-serif text-base font-light text-luxury-dark">Terapie i procedury wyróżnia to, że:</h4>
                            
                            <ul className="space-y-2 text-[11px] text-luxury-dark font-light leading-relaxed">
                              {[
                                "nie używam szablonowych, gotowych protokołów,",
                                "nie wykonuję dwóch identycznych zabiegów u tej samej osoby,",
                                "nie pracuję powtarzalnymi, mechanicznymi schematami,",
                                "każdy kolejny krok zabiegu tworzę na bieżąco na podstawie obserwacji,",
                                "każdy produkt kosmetyczny dobieram uważnie śledząc reakcję skóry,",
                                "każdy koktajl przygotowuję indywidualnie bezpośrednio przy łóżku,",
                                "zabiegi wykazują głębokie, zsynchronizowane działanie wielopoziomowe,",
                                "mój model oparty jest na neuroplastyczności skóry i bionomicznej biomimetyce."
                              ].map((text, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-luxury-gold font-bold">•</span>
                                  <span>{text}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <div className="pt-3 border-t border-luxury-sand/40 text-center">
                              <span className="font-mono text-[8px] tracking-[0.2em] text-luxury-gold uppercase font-bold block">
                                Jest to najwyższy standard współczesnej kosmetologii.
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerz opis terapii dla Neurolifting — Kosmetologia Neurorehabilitacyjna */}
                  {selectedTreatment.id === "neurolifting-nogier" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="neurolifting-detailed-monograph">
                      
                      {/* Główny panel wprowadzający & Filozofia Neurorehabilitacji */}
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Kosmetologia Neurorehabilitacyjna & Bio-Inżynieria Tkankowa
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Czym Jest Neurolifting?
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Neurolifting to nowoczesna, wysoce zaawansowana metoda pracy z tkankami i powięzią twarzy w nurcie Kosmetologii Neurorehabilitacyjnej. Jej nadrzędnym celem jest stymulacja fizjologicznych mechanizmów samoregulacji i homeostazy – przywracając biologiczną równowagę na poziomie układu nerwowego, powięziowego i komórkowego.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Filozofia Slow Skin Concept™ • Praca u Źródła Przyczyny
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              Odmłodzenie Poprzez Fizjologiczną Samoregulację
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Zamiast maskować oznaki upływu czasu czy poddawać tkanki agresywnym bodźcom termicznym, zabieg aktywuje naturalne procesy naprawcze organizmu. Łączy precyzyjną neuromodulację mikroimpulsami z bionomicznymi czynnikami wzrostu, działając bezpośrednio na mięśnie mimiczne, powięź i macierz zewnątrzkomórkową.
                            </p>
                          </div>
                        </div>

                        {/* Jak to działa? - 3 Filary Fizjologiczne */}
                        <div className="space-y-4 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Fizjologiczne Mechanizmy Odnowy
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Jak Działa Neurolifting?</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 1 • Komunikacja Nerwowa
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Neuromodulacja Receptywna</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Subtelne mikroimpulsy elektryczne (transmitowane przez sterylne mikroigły lub naskórkowe elektrody TENS) oddziałują na receptory nerwowe, harmonizując napięcie mięśniowo-powięziowe. Rozluźniają chronicznie spięte żwacze i czoło, jednocześnie tonizując osłabione partie owalu.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 2 • Macierz Zewnątrzkomórkowa
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Hydratacja & Aparat Proteoglikanowy</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Pobudzenie syntezy glikozaminoglikanów (GAGs) i kwasu hialuronowego w macierzy zewnątrzkomórkowej przywraca prawidłowe uwodnienie powięzi powierzchownej. Umożliwia to swobodną dyfuzję składników odżywczych i przywraca sprężystość tkankom.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 3 • Drenaż & Dotlenienie
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Neurodrenaż & Cyrkulacja Płynów</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Uruchomienie fizjologicznego odpływu chłonki i usprawnienie mikrokrążenia poszerza przestrzenie międzykomórkowe. Likwiduje obrzęki, worki pod oczami oraz daje natychmiastowy efekt wypoczętej cery (Glow Face).
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Czym różni się od klasycznego liftingu */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
                          <div className="lg:col-span-7 bg-white/60 border border-luxury-sand p-8 rounded-sm space-y-4 text-left">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Paradygmat Przyczyny i Skutku
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">
                              Czym Neurolifting Różni się od Klasycznego Liftingu?
                            </h3>
                            <div className="space-y-3 text-xs text-luxury-dark font-light leading-relaxed">
                              <p>
                                Zamiast skupiać się wyłącznie na powierzchownym naciąganiu powłok skórnych lub wywoływaniu bolesnych mikrouszkodzeń, neurolifting pracuje w synergii z <strong>układem nerwowym, więzadłami twarzowymi i strukturą powięziową</strong>.
                              </p>
                              <p>
                                To podejście <strong>„od przyczyny do efektu”</strong>. Dzięki stymulacji biologicznych mechanizmów samonaprawczych rezultaty są w pełni naturalne, rysy twarzy zachowują pełną ekspresję i harmonię, a skóra odzyskuje głęboki, fizjologiczny turgor.
                              </p>
                            </div>
                          </div>

                          <div className="lg:col-span-5 flex flex-col justify-between border border-luxury-gold/30 bg-luxury-sand/15 p-6 rounded-sm text-left space-y-4">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Komfort i Przebieg Sesji
                            </span>
                            <div className="space-y-2 text-xs text-luxury-dark/95 font-light leading-relaxed">
                              <p>• Parametry i częstotliwości mikroprądów dobierane są indywidualnie do stopnia napięcia tkanek.</p>
                              <p>• Do wyboru: <strong>najcieńsze mikroigły akupunkturowe</strong> lub – dla osób o szczególnej wrażliwości – <strong>bezinwazyjne elektrody naskórkowe (TENS)</strong>.</p>
                              <p>• Odczucia to delikatne mrowienie, kojące ciepło i głęboki relaks parasympatyczny.</p>
                            </div>
                            <div className="p-3 bg-white/70 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-[11px] italic text-luxury-gold block">
                                „Świadoma praca z powięzią i nerwami uruchamia najgłębsze rezerwy regeneracyjne organizmu.”
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cztery filary zabiegowe w Świadomej Kosmetologii */}
                      <div className="space-y-6 pt-4">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center justify-center gap-1.5 font-bold">
                            <Activity className="w-4 h-4 text-luxury-gold" /> Paradygmat Świadomej Kosmetologii
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Cztery Filary Zabiegowe Rytuału
                          </h3>
                          <p className="text-xs text-luxury-dark/95 font-light">
                            Sprawdzony schemat zabiegowy dbający o skuteczność, komfort i bezpieczeństwo skóry:
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            {
                              num: "01",
                              title: "Krok Łagodzący",
                              desc: "Łagodzi zaczerwienienia, wycisza nadwrażliwość i przygotowuje skórę do regeneracji."
                            },
                            {
                              num: "02",
                              title: "Drenaż i Dotlenienie",
                              desc: "Usprawnia odpływ chłonki, pobudza mikrokrążenie i pomaga zmniejszyć zastoje oraz opuchnięcia."
                            },
                            {
                              num: "03",
                              title: "Modelowanie Owalu",
                              desc: "Modeluje owal twarzy, rozluźnia spięte mięśnie i wspiera naturalną sprężystość skóry."
                            },
                            {
                              num: "04",
                              title: "Pielęgnacja Okolicy Oka",
                              desc: "Subtelna, delikatna praca na cienkiej skórze wokół oczu pomagająca zmniejszyć cienie i oznaki zmęczenia."
                            }
                          ].map((filar, idx) => (
                            <div key={idx} className="border border-luxury-sand p-5 bg-white space-y-2 rounded-sm text-left shadow-xs hover:border-luxury-gold/50 transition-all">
                              <span className="font-mono text-xs text-luxury-gold font-bold block">{filar.num}</span>
                              <h4 className="font-serif text-xs font-semibold text-luxury-dark leading-snug">{filar.title}</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">{filar.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cennik i Warianty Zabiegu (Podstawowy vs Rozszerzony) */}
                      <div className="space-y-6 pt-4">
                        <div className="text-center max-w-xl mx-auto space-y-2">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                            Transparentny Wybór Terapii
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Warianty Zabiegu i Cennik
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          {/* Wariant Podstawowy */}
                          <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-sm hover:border-luxury-gold/50 transition-all">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold">
                                  Wariant Podstawowy
                                </span>
                                <span className="font-mono text-[10px] bg-luxury-sand/20 px-2 py-0.5 text-luxury-dark/95 rounded-xs">
                                  40–50 min
                                </span>
                              </div>
                              <h4 className="font-serif text-xl font-medium text-luxury-dark">
                                Neurolifting Elektroterapeutyczny
                              </h4>
                              <div className="text-2xl font-serif text-luxury-gold font-light">
                                600 PLN
                              </div>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Obejmuje pełną procedurę neuroliftingu z elektroakupunkturą lub bezinwazyjnymi elektrodami TENS, regulację napięć mięśniowo-powięziowych oraz neurodrenaż limfatyczny.
                              </p>
                            </div>
                            <ul className="space-y-1.5 text-[11px] text-luxury-dark/95 border-t border-luxury-sand/30 pt-4">
                              <li>✓ Indywidualna diagnostyka wektorów napięciowych</li>
                              <li>✓ Neuromodulacja częstotliwościami dr. Nogiera</li>
                              <li>✓ Natychmiastowe uniesienie owalu i efekt Glow Face</li>
                            </ul>
                          </div>

                          {/* Wariant Rozszerzony */}
                          <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-md relative">
                            <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                              Wariant Rozszerzony
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold">
                                  Wariant Pełny + Pielęgnacja Domowa
                                </span>
                                <span className="font-mono text-[10px] bg-luxury-gold/20 px-2 py-0.5 text-luxury-dark rounded-xs font-semibold">
                                  ok. 75 min
                                </span>
                              </div>
                              <h4 className="font-serif text-xl font-medium text-luxury-dark">
                                Neurolifting + Bionomiczna Bio-Inżynieria + Home Care
                              </h4>
                              <div className="text-2xl font-serif text-luxury-gold font-bold">
                                900 PLN
                              </div>
                              <p className="text-xs text-luxury-dark font-light leading-relaxed">
                                Rozszerzona ceremonia obejmująca pełny zabieg neuroliftingu, infuzję skoncentrowanych preparatów bionomicznej inżynierii tkankowej oraz okluzję kompresyjną.
                              </p>
                            </div>
                            <div className="bg-white/80 border border-luxury-gold/40 p-3 rounded-xs space-y-1">
                              <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase block">
                                W cenie wariantu rozszerzonego:
                              </span>
                              <p className="text-[11px] text-luxury-dark italic font-serif">
                                Dedykowany zestaw bionomicznych miniproduktów do pielęgnacji domowej (Home Care na 3–5 dni) utrwalający i potęgujący rezultaty przebudowy tkankowej.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Rozszerzona monografia dla Sonaris Pro Therapy */}
                  {selectedTreatment.id === "sonaris-pro-therapy" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="sonaris-pro-detailed-monograph">
                      
                      {/* Główny nagłówek wprowadzający */}
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Nieinwazyjna Technologia Impulsów Elektromagnetycznych
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Sonaris Pro Therapy
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Nieinwazyjna terapia poprawiająca napięcie, gładkość i witalność skóry. Komfortowa procedura wykorzystująca impulsy elektromagnetyczne aplikowane dedykowanymi głowicami – bez naruszania ciągłości naskórka i bez konieczności rekonwalescencji.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Zap className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Technologia Dobierana do Gotowości Skóry • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              Łagodny Bodziec Fizjologiczny Zamiast Sztywnych Schematów
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Głowice urządzenia emitują impulsy elektromagnetyczne, które oddziałują na opracowywany obszar bez uszkadzania powierzchni skóry. Technologia stanowi łagodny bodziec wspierający fizjologiczne procesy odpowiedzialne za kondycję, napięcie i regenerację tkanek. W Slow Skin Concept™ technologia nie jest wykorzystywana według jednego, gotowego protokołu – obszar pracy, rodzaj głowicy, intensywność oraz czas działania są dobierane indywidualnie do kondycji, wrażliwości i aktualnej gotowości biologicznej skóry.
                            </p>
                          </div>
                        </div>

                        {/* Jak działa Sonaris Pro? - 3 Filary Działania */}
                        <div className="space-y-4 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Mechanizm Działania
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Jak Działa Sonaris Pro?</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 1 • Napięcie & Elastyczność
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Fizjologiczna Sprężystość</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Impulsy elektromagnetyczne stymulują tkanki bez efektu termicznego uszkodzenia. Wspierają poprawę napięcia i elastyczności skóry, wygładzenie jej powierzchni oraz zmniejszenie widoczności drobnych zmarszczek.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 2 • Mikrokrążenie & Świeżość
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Dotlenienie i Koloryt</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Wspiera mikrokrążenie włośniczkowe, ułatwiając transport tlenu i substancji odżywczych. Przynosi wyrównanie i odświeżenie zmęczonego, poszarzałego kolorytu, dając bardziej wypoczęty wygląd twarzy.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 3 • Synergia Biomimetyczna
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Integracja z Pielęgnacją</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Technologia może zostać połączona z odpowiednio dobranym serum, maską biomimetyczną, masażem lub innymi metodami gabinetowymi, tworząc w pełni spersonalizowany protokół biologiczny.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Specjalna sekcja: Sonaris Pro na okolicę oka */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
                          <div className="lg:col-span-7 bg-white border border-luxury-sand p-8 rounded-sm space-y-4 text-left shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Precyzja Anatomiczna
                            </span>
                            <h3 className="font-serif text-xl md:text-2xl font-light text-luxury-dark">
                              Sonaris Pro na Okolicę Oka
                            </h3>
                            <div className="space-y-3 text-xs text-luxury-dark font-light leading-relaxed">
                              <p>
                                Skóra wokół oczu jest wyjątkowo cienka i najszybciej reaguje na zmęczenie, osłabienie mikrokrążenia oraz utratę elastyczności. Sonaris Pro umożliwia <strong>delikatne opracowanie tej okolicy bez nakłuwania skóry i bez wyłączenia z codziennych aktywności</strong>.
                              </p>
                              <div className="space-y-2 pt-2">
                                <span className="font-mono text-[9px] text-luxury-gold uppercase font-bold block">Zabieg w tej strefie wspiera:</span>
                                <ul className="space-y-1.5 text-[11px] text-luxury-dark/95">
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold font-bold">•</span>
                                    <span>Poprawę napięcia cienkiej i delikatnej skóry powiek i skroni</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold font-bold">•</span>
                                    <span>Wygładzenie drobnych zmarszczek i linii mimicznych</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold font-bold">•</span>
                                    <span>Zmniejszenie widoczności oznak zmęczenia i poprawę świeżości spojrzenia</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="p-3.5 bg-luxury-sand/15 border-l-2 border-luxury-gold text-[10.5px] text-luxury-dark/90 font-serif italic">
                              Ważna uwaga merytoryczna: Sonaris Pro nie usuwa przepuklin tłuszczowych ani nadmiaru skóry powiek. W przypadku cieni, obrzęków lub worków pod oczami najpierw oceniana jest przyczyna problemu, ponieważ nie każda zmiana tej okolicy kwalifikuje się do terapii kosmetologicznej.
                            </div>
                          </div>

                          <div className="lg:col-span-5 flex flex-col justify-between border border-luxury-gold/30 bg-luxury-sand/15 p-6 rounded-sm text-left space-y-4">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                                Komfort i Rekonwalescencja
                              </span>
                              <h4 className="font-serif text-lg font-medium text-luxury-dark mt-1 mb-3">
                                100% Bezpieczeństwa i Komfortu
                              </h4>
                              <div className="space-y-2 text-xs text-luxury-dark/95 font-light leading-relaxed">
                                <p>• <strong>Brak nakłuwania:</strong> nie wymaga żadnego znieczulenia ani naruszenia ciągłości naskórka.</p>
                                <p>• <strong>Przyjemne odczucia:</strong> podczas pracy głowicy odczuwalne jest delikatne ciepło, mrowienie lub łagodna stymulacja.</p>
                                <p>• <strong>Zero rekonwalescencji:</strong> bezpośrednio po zabiegu może pojawić się krótkotrwałe zaczerwienienie, z natychmiastowym powrotem do codziennych zajęć.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-white/80 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-[11px] italic text-luxury-gold block">
                                „Sonaris Pro nie zmienia rysów twarzy i nie daje efektu sztucznego wypełnienia – wydobywa naturalny, promienny blask i napięcie skóry.”
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rekomendowana Seria Zabiegowa */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm text-left space-y-4 shadow-xs">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Planowanie Terapii
                          </span>
                          <h3 className="font-serif text-xl font-light text-luxury-dark">
                            Zalecana Liczba Zabiegów i Częstotliwość
                          </h3>
                          <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                            Zabieg może zostać wykonany jednorazowo, kiedy skórze potrzebne jest natychmiastowe odświeżenie i poprawa napięcia. W celu uzyskania stopniowej i bardziej stabilnej poprawy jej kondycji zazwyczaj rekomendowana jest seria:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="border border-luxury-sand/60 bg-luxury-sand/10 p-4 text-center rounded-sm">
                              <span className="font-mono text-xl text-luxury-gold font-bold block mb-1">4 – 6</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium block">Zabiegów w Serii</span>
                              <span className="text-[10px] text-luxury-dark/80 font-light block mt-1">Dla stabilnej odbudowy gęstości</span>
                            </div>
                            <div className="border border-luxury-sand/60 bg-luxury-sand/10 p-4 text-center rounded-sm">
                              <span className="font-mono text-xl text-luxury-gold font-bold block mb-1">Co 7–14</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium block">Dni Odstępu</span>
                              <span className="text-[10px] text-luxury-dark/80 font-light block mt-1">Zgodnie z odpowiedzią skóry</span>
                            </div>
                            <div className="border border-luxury-sand/60 bg-luxury-sand/10 p-4 text-center rounded-sm">
                              <span className="font-mono text-xl text-luxury-gold font-bold block mb-1">Co 4–8</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium block">Tygodni Podtrzymująco</span>
                              <span className="text-[10px] text-luxury-dark/80 font-light block mt-1">Dla utrwalenia efektu witalności</span>
                            </div>
                          </div>
                        </div>

                        {/* Cennik Pojedynczych Zabiegów i Pakietów */}
                        <div className="space-y-6 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Transparentny Cennik
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Obszary Zabiegowe i Pakiety
                            </h3>
                            <p className="text-xs text-luxury-dark/90 font-light">
                              Wybierz pojedynczy zabieg lub pakiet 6 spotkań z preferencyjną stawką za procedurę:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Pojedyncze Zabiegi */}
                            <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-xs">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pojedyncze Sesje Gabinetowe
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Ceny Zabiegów Indywidualnych
                                </h4>
                                
                                <div className="space-y-3 divide-y divide-luxury-sand/40">
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark block">Sonaris Pro — Okolica Oczu</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Drenaż, napięcie i wygładzenie drobnych linii</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">180 PLN</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark block">Sonaris Pro — Twarz</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Poprawa owalu, sprężystość i świeżość kolorytu</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">250 PLN</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark block">Sonaris Pro — Twarz i Okolica Oczu</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Kompleksowe opracowanie całej twarzy i powiek</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">300 PLN</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark block">Sonaris Pro — Twarz, Szyja i Dekolt</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Pełna ceremonia biorewitalizująca na 3 strefy</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">350 PLN</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 bg-luxury-sand/10 border border-luxury-sand/40 rounded-xs text-[10.5px] text-luxury-dark/90 font-light">
                                Czas trwania procedury: od 45 do 75 minut w zależności od wybranego obszaru.
                              </div>
                            </div>

                            {/* Pakiety Zabiegowe (Seria 6) */}
                            <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-md relative">
                              <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                                Korzystniejsza Cena w Serii
                              </div>
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pakiety Serii Terapeutycznej (6 Zabiegów)
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Pakiety 6 Sesji Sonaris Pro
                                </h4>

                                <div className="space-y-3 divide-y divide-luxury-gold/30">
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Okolica Oczu (Pakiet 6)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">150 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">900 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1080 PLN</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz (Pakiet 6)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">ok. 208 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1250 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1500 PLN</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Okolica Oczu (Pakiet 6)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">250 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1500 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1800 PLN</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt (Pakiet 6)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">ok. 292 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1750 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">2100 PLN</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white/80 border border-luxury-gold/40 p-3 rounded-xs space-y-1">
                                <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase block">
                                  Dlaczego seria?
                                </span>
                                <p className="text-[11px] text-luxury-dark italic font-serif">
                                  Powtarzalny, łagodny bodziec elektromagnetyczny stymuluje długotrwałą homeostazę tkankową i utrwala gęstość naskórka bez żadnego ryzyka powikłań pozabiegowych.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Rozszerzona monografia dla Carboksyterapii CARBOregen */}
                  {selectedTreatment.id === "carboksyterapia-carboregen" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="carboregen-detailed-monograph">
                      
                      {/* Główny nagłówek wprowadzający */}
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Fizjologiczna Przebudowa Tkanek • Efekt Bohra
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Carboksyterapia Twarzy CARBOregen
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Iniekcyjna stymulacja mikrokrążenia i naturalnych procesów przebudowy skóry. Kontrolowane podanie medycznego dwutlenku węgla wywołujące zjawisko efektu Bohra – intensywne dotlenienie, odżywienie tkanek i pobudzenie fibroblastów.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Activity className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Precyzyjny Bodziec Zamiast Nadmiernej Intensywności • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              Naturalna Odpowiedź Naczyniowa i Zjawisko Efektu Bohra
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Karboksyterapia nie polega na bezpośrednim podawaniu tlenu. Po śródskórnym podaniu CO₂ uruchamiana jest kaskada fizjologiczna: naczynia krwionośne gwałtownie się rozszerzają, a tlen z hemoglobiny jest z wielokrotnie wyższą łatwością uwalniany do komórek (efekt Bohra). System CARBOregen umożliwia precyzyjne kontrolowanie przepływu, dawki oraz temperatury gazu, dostosowując bodziec ściśle do aktualnej gotowości biologicznej skóry.
                            </p>
                          </div>
                        </div>

                        {/* Jak działa karboksyterapia? - 3 Filary */}
                        <div className="space-y-4 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Kaskada Biochemiczna
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Jak Działa Karboksyterapia CARBOregen?</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 1 • Mikrokrążenie & Efekt Bohra
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Głębokie Dotlenienie Komórkowe</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Gaz indukuje natychmiastowe rozszerzenie naczyń włosowatych. Zwiększony przepływ krwi i zakwaszenie środowiska wymuszają na erytrocytach intensywny wyrzut tlenu do głębokich warstw skóry właściwej.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 2 • Fibroblasty & Kolagenogeneza
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Aktywacja Naturalnej Odbudowy</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Kontrolowany bodziec pobudza fibroblasty do syntezy nowego kolagenu i elastyny. Wpływa na przebudowę struktury skóry, poprawiając jędrność, zagęszczenie i spłycając blizny potrądzikowe.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Filar 3 • Kontrola CARBOregen
                              </span>
                              <h4 className="font-serif text-sm font-medium text-luxury-dark">Regulacja Dawki i Temperatury</h4>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Nowoczesny aparat CARBOregen podgrzewa gaz i precyzyjnie dozuje mikrodawki, co radykalnie redukuje odczucie dyskomfortu i pozwala na bezpieczne opracowywanie nawet najcieńszych okolic twarzy.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Karboksyterapia okolicy oczu & Odczucia */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
                          <div className="lg:col-span-7 bg-white border border-luxury-sand p-8 rounded-sm space-y-4 text-left shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Rewitalizacja Spojrzenia
                            </span>
                            <h3 className="font-serif text-xl md:text-2xl font-light text-luxury-dark">
                              Karboksyterapia Okolicy Oczu
                            </h3>
                            <div className="space-y-3 text-xs text-luxury-dark font-light leading-relaxed">
                              <p>
                                Skóra powiek jest czterokrotnie cieńsza niż na policzkach i szczególnie podatna na zastoje żylno-limfatyczne. Karboksyterapia w tej strefie to jedna z najbardziej cenionych metod poprawy mikrokrążenia i redukcji oznak zmęczenia.
                              </p>
                              <div className="space-y-2 pt-2">
                                <span className="font-mono text-[9px] text-luxury-gold uppercase font-bold block">Terapia okolicy oczu wspiera redukcję:</span>
                                <ul className="space-y-1.5 text-[11px] text-luxury-dark/95">
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold font-bold">•</span>
                                    <span>Cieni o podłożu naczyniowym i prześwitujących naczynek</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold font-bold">•</span>
                                    <span>Drobnych zmarszczek i utraty elastyczności skóry powiek</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-luxury-gold font-bold">•</span>
                                    <span>Wiotkości dolnej powieki i przewlekle zmęczonego spojrzenia</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="p-3.5 bg-luxury-sand/15 border-l-2 border-luxury-gold text-[10.5px] text-luxury-dark/90 font-serif italic">
                              Rzetelna kwalifikacja: W Slow Skin Concept™ najpierw oceniamy przyczynę cieni i obrzęków. Zmiany wynikające z budowy anatomicznej, przepuklin tłuszczowych powiek czy chorób ogólnych nie kwalifikują się do karboksyterapii.
                            </div>
                          </div>

                          <div className="lg:col-span-5 flex flex-col justify-between border border-luxury-gold/30 bg-luxury-sand/15 p-6 rounded-sm text-left space-y-4">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                                Odczucia i Reakcja Tkanek
                              </span>
                              <h4 className="font-serif text-lg font-medium text-luxury-dark mt-1 mb-3">
                                Czego Spodziewać Się Podczas i Po Zabiegu?
                              </h4>
                              <div className="space-y-2 text-xs text-luxury-dark/95 font-light leading-relaxed">
                                <p>• <strong>W trakcie:</strong> chwilowe uczucie rozpierania, ciepła, łagodnego ucisku lub przemieszczania się pęcherzyków gazu pod skórą.</p>
                                <p>• <strong>Wokół oczu:</strong> krótkotrwałe uniesienie tkanek (tzw. poduszeczka gazowa), która ulega całkowitemu wchłonięciu w kilkanaście minut.</p>
                                <p>• <strong>Po zabiegu:</strong> przejściowe zaczerwienienie, niewielki obrzęk lub drobne siniaki w miejscach wkłuć, znikające w naturalnym tempie.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-white/80 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-[11px] italic text-luxury-gold block">
                                „Karboksyterapia nie zmienia rysów twarzy i nie daje efektu sztucznego wypełnienia – przywraca skórze jej naturalną, komórkową zdolność samoodnowy.”
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Zalecana liczba zabiegów */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm text-left space-y-4 shadow-xs">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Harmonogram Terapii
                          </span>
                          <h3 className="font-serif text-xl font-light text-luxury-dark">
                            Rekomendowane Protokoły Serii CARBOregen
                          </h3>
                          <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                            Przebudowa kolagenu wymaga powtarzalnego, bezpiecznego bodźca. Liczba sesji i odstępy (zwykle 7–14 dni) są dobierane ściśle do gotowości biologicznej skóry:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="border border-luxury-sand/60 bg-luxury-sand/10 p-4 text-center rounded-sm">
                              <span className="font-mono text-xl text-luxury-gold font-bold block mb-1">4 – 6</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium block">Twarz, Szyja lub Dekolt</span>
                              <span className="text-[10px] text-luxury-dark/80 font-light block mt-1">Poprawa gęstości, dotlenienie i sprężystość</span>
                            </div>
                            <div className="border border-luxury-sand/60 bg-luxury-sand/10 p-4 text-center rounded-sm">
                              <span className="font-mono text-xl text-luxury-gold font-bold block mb-1">4 – 8</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium block">Okolica Oczu</span>
                              <span className="text-[10px] text-luxury-dark/80 font-light block mt-1">Rozjaśnienie cieni i ujędrnienie powieki</span>
                            </div>
                            <div className="border border-luxury-sand/60 bg-luxury-sand/10 p-4 text-center rounded-sm">
                              <span className="font-mono text-xl text-luxury-gold font-bold block mb-1">4 – 8</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium block">Blizny Potrądzikowe</span>
                              <span className="text-[10px] text-luxury-dark/80 font-light block mt-1">Stopniowa przebudowa i wygładzenie</span>
                            </div>
                          </div>
                        </div>

                        {/* Cennik Pojedynczych Zabiegów i Pakietów */}
                        <div className="space-y-6 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Transparentny Cennik
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Obszary Zabiegowe i Pakiety 5 Sesji
                            </h3>
                            <p className="text-xs text-luxury-dark/90 font-light">
                              Wybierz pojedynczą procedurę lub pakiet 5 spotkań gwarantujący optymalną serię terapeutyczną:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Pojedyncze Zabiegi */}
                            <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-xs">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pojedyncze Sesje Gabinetowe
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Ceny Zabiegów Indywidualnych
                                </h4>
                                
                                <div className="space-y-3 divide-y divide-luxury-sand/40">
                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Karboksyterapia — Okolica Oczu</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Dotlenienie, redukcja cieni naczyniowych</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0">
                                      <span className="font-serif text-base text-luxury-gold font-bold">250 PLN</span>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Carboksyterapia CARBOregen — Okolica Oczu",
                                            price: "250 PLN",
                                            duration: "40 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-dark text-white hover:bg-luxury-gold text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Rezerwuj
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Karboksyterapia — Twarz</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Pobudzenie mikrokrążenia i syntezy kolagenu</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0">
                                      <span className="font-serif text-base text-luxury-gold font-bold">300 PLN</span>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Carboksyterapia CARBOregen — Twarz",
                                            price: "300 PLN",
                                            duration: "50 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-dark text-white hover:bg-luxury-gold text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Rezerwuj
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Okolica Oczu</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Synergiczne dotlenienie całej twarzy i powiek</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0">
                                      <span className="font-serif text-base text-luxury-gold font-bold">380 PLN</span>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Carboksyterapia CARBOregen — Twarz i Okolica Oczu",
                                            price: "380 PLN",
                                            duration: "60 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-dark text-white hover:bg-luxury-gold text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Rezerwuj
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Kompleksowa biostymulacja 3 stref naskórka</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0">
                                      <span className="font-serif text-base text-luxury-gold font-bold">450 PLN</span>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Carboksyterapia CARBOregen — Twarz, Szyja i Dekolt",
                                            price: "450 PLN",
                                            duration: "60 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-dark text-white hover:bg-luxury-gold text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Rezerwuj
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 bg-luxury-sand/10 border border-luxury-sand/40 rounded-xs text-[10.5px] text-luxury-dark/90 font-light">
                                Czas trwania procedury: od 40 do 60 minut w zależności od obszaru zabiegowego.
                              </div>
                            </div>

                            {/* Pakiety Zabiegowe (Seria 5) */}
                            <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-md relative">
                              <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                                Pakiet Serii 5 Zabiegów
                              </div>
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pakiety Serii Terapeutycznej (5 Zabiegów)
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Pakiety 5 Sesji CARBOregen
                                </h4>

                                <div className="space-y-3 divide-y divide-luxury-gold/30">
                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Okolica Oczu (Pakiet 5)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">220 zł za jeden zabieg</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                                      <div>
                                        <span className="font-serif text-base text-luxury-dark font-bold block">1100 PLN</span>
                                        <span className="block text-[8.5px] line-through text-luxury-dark/50">1250 PLN</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Pakiet 5x: Carboksyterapia Okolicy Oczu",
                                            price: "1100 PLN (Pakiet 5x)",
                                            duration: "40 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-gold text-white hover:bg-luxury-dark text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Wybierz
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz (Pakiet 5)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">270 zł za jeden zabieg</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                                      <div>
                                        <span className="font-serif text-base text-luxury-dark font-bold block">1350 PLN</span>
                                        <span className="block text-[8.5px] line-through text-luxury-dark/50">1500 PLN</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Pakiet 5x: Carboksyterapia Twarzy",
                                            price: "1350 PLN (Pakiet 5x)",
                                            duration: "50 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-gold text-white hover:bg-luxury-dark text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Wybierz
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Okolica Oczu (Pakiet 5)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">340 zł za jeden zabieg</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                                      <div>
                                        <span className="font-serif text-base text-luxury-dark font-bold block">1700 PLN</span>
                                        <span className="block text-[8.5px] line-through text-luxury-dark/50">1900 PLN</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Pakiet 5x: Carboksyterapia Twarz i Oczy",
                                            price: "1700 PLN (Pakiet 5x)",
                                            duration: "60 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-gold text-white hover:bg-luxury-dark text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Wybierz
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 gap-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt (Pakiet 5)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">400 zł za jeden zabieg</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                                      <div>
                                        <span className="font-serif text-base text-luxury-dark font-bold block">2000 PLN</span>
                                        <span className="block text-[8.5px] line-through text-luxury-dark/50">2250 PLN</span>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setBookingTreatment({
                                            ...selectedTreatment,
                                            title: "Pakiet 5x: Carboksyterapia Twarz, Szyja, Dekolt",
                                            price: "2000 PLN (Pakiet 5x)",
                                            duration: "60 minut"
                                          });
                                          setBookingConfirmed(false);
                                        }}
                                        className="px-2.5 py-1 bg-luxury-gold text-white hover:bg-luxury-dark text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer rounded-xs font-semibold"
                                      >
                                        Wybierz
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white/80 border border-luxury-gold/40 p-3 rounded-xs space-y-1">
                                <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase block">
                                  Dlaczego pakiet 5 sesji?
                                </span>
                                <p className="text-[11px] text-luxury-dark italic font-serif">
                                  Przebudowa włókien elastynowych i kolagenu w skórze właściwej to proces biologiczny wymagający powtarzalnego bodźca mikrokrążeniowego, by przynieść trwały i widoczny rezultat.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Precyzyjny bodziec zamiast nadmiernej intensywności — Filozofia & Główny CTA */}
                        <div className="border border-luxury-gold/40 bg-gradient-to-br from-[#1A1A1A] via-[#242A27] to-[#1A1A1A] text-white p-8 md:p-12 rounded-sm shadow-xl text-center space-y-6 max-w-4xl mx-auto">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-luxury-gold/20 border border-luxury-gold/40 rounded-full">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold">
                              Filozofia Terapii CARBOregen • Slow Skin Concept™
                            </span>
                          </div>
                          
                          <h3 className="font-serif text-2xl md:text-3xl font-light text-luxury-cream tracking-wide">
                            Precyzyjny bodziec zamiast nadmiernej intensywności
                          </h3>

                          <div className="w-16 h-[1.5px] bg-luxury-gold/80 mx-auto" />

                          <p className="text-xs md:text-sm text-luxury-cream/90 font-serif italic max-w-2xl mx-auto leading-relaxed">
                            „W karboksyterapii najważniejsza nie jest największa ilość podanego gazu, lecz odpowiednio zaprojektowana reakcja tkanek. Parametry terapii są dobierane indywidualnie — zgodnie z potrzebami, kondycją oraz aktualną gotowością biologiczną skóry.”
                          </p>

                          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                              onClick={() => {
                                setBookingTreatment(selectedTreatment);
                                setBookingConfirmed(false);
                                setBookingName("");
                                setBookingEmail("");
                                setBookingPhone("");
                                setBookingDate("");
                              }}
                              className="w-full sm:w-auto px-8 py-4 bg-luxury-gold text-luxury-dark hover:bg-white transition-all duration-300 font-mono text-xs tracking-widest uppercase font-bold shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                              <Calendar className="w-4 h-4 text-luxury-dark" />
                              <span>Zarezerwuj Carboksyterapię CARBOregen</span>
                            </button>

                            <a
                              href="tel:+48713181818"
                              className="w-full sm:w-auto px-6 py-4 border border-luxury-gold/60 text-luxury-cream hover:bg-white/10 transition-all font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                            >
                              <span>Kontakt telefoniczny</span>
                            </a>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] font-mono text-luxury-gold/80 pt-2 border-t border-white/10">
                            <span>✓ Synchronizacja z Google Calendar</span>
                            <span>✓ Medyczny CO₂ i efekt Bohra</span>
                            <span>✓ Pn–Pt 10:00 – 19:30</span>
                            <span>✓ Bez efektu sztuczności</span>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Rozszerzona monografia dla Stymulatorów Tkankowych */}
                  {selectedTreatment.id === "stymulatory-tkankowe" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30 text-left" id="stimulators-detailed-monograph">
                      
                      {/* Główny nagłówek wprowadzający */}
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Indywidualna Biostymulacja Iniekcyjna
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-5xl font-light text-luxury-dark tracking-wide">
                            Stymulatory tkankowe
                          </h2>
                          <p className="font-mono text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                            Indywidualna biostymulacja iniekcyjna • poprawa jakości skóry • stopniowa przebudowa tkanek
                          </p>
                          <div className="w-16 h-[1.5px] bg-luxury-gold/70 mx-auto pt-1" />
                        </div>

                        {/* Wprowadzenie edytorialne */}
                        <div className="max-w-4xl mx-auto space-y-4 text-xs md:text-sm text-luxury-dark/95 leading-relaxed font-light bg-[#FAF8F5] border border-luxury-sand p-6 sm:p-8 rounded-sm shadow-xs">
                          <p>
                            <strong>Stymulatory tkankowe</strong> to preparaty podawane techniką iniekcyjną, których zadaniem jest wspieranie naturalnych procesów regeneracji i przebudowy skóry. W przeciwieństwie do klasycznych wypełniaczy ich głównym celem nie jest dodawanie objętości ani zmiana rysów twarzy.
                          </p>
                          <p>
                            Odpowiednio dobrany preparat może wspierać poprawę gęstości, jędrności, elastyczności i nawodnienia skóry. Efekt rozwija się stopniowo wraz z zachodzącymi w tkankach procesami regeneracyjnymi, dlatego rezultat wygląda naturalnie i nie pojawia się wyłącznie bezpośrednio po zabiegu.
                          </p>
                          <p className="italic font-serif text-luxury-dark border-l-2 border-luxury-gold pl-4 py-1">
                            Nie istnieje jeden stymulator odpowiedni dla każdej skóry. Rodzaj preparatu, technika podania i plan terapii dobierane są indywidualnie – na podstawie kondycji skóry, jej biologicznej gotowości, obszaru zabiegowego oraz oczekiwanego kierunku przebudowy.
                          </p>
                        </div>

                        {/* Najważniejsza zasada terapii */}
                        <div className="bg-luxury-gold/10 border-2 border-luxury-gold/50 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-sm">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Dna className="w-8 h-8" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Najważniejsza Zasada Terapii • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-lg md:text-xl font-medium text-luxury-dark">
                              „Nie dobiera się skóry do popularnego preparatu. Dobiera się preparat do biologicznych potrzeb skóry.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Najsilniejszy stymulator nie zawsze jest najlepszym wyborem. Skóra cienka, reaktywna lub skłonna do obrzęków może potrzebować innego rodzaju wsparcia niż skóra grubsza, wiotka i wymagająca bardziej intensywnej przebudowy.
                            </p>
                          </div>
                        </div>

                        {/* Kiedy warto rozważyć zabieg & Jak działają stymulatory */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                          {/* Kiedy warto rozważyć zabieg? */}
                          <div className="border border-luxury-sand bg-white p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
                            <div className="space-y-1">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Wskazania Tkankowe
                              </span>
                              <h3 className="font-serif text-xl font-medium text-luxury-dark">
                                Kiedy warto rozważyć zabieg?
                              </h3>
                              <p className="text-xs text-luxury-dark/80 font-light">
                                Stymulatory tkankowe mogą być odpowiednie w przypadku:
                              </p>
                            </div>
                            <ul className="space-y-2 text-xs text-luxury-dark/95 font-light">
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>utraty jędrności, elastyczności i napięcia,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>zmniejszenia gęstości skóry,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>drobnych zmarszczek,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>cienkiej i osłabionej skóry,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>pogorszenia struktury i ogólnej jakości skóry,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>odwodnienia i utraty naturalnej sprężystości,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>oznak fotostarzenia,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>skóry wymagającej stopniowej regeneracji,</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold shrink-0">•</span>
                                <span>delikatnej okolicy oczu wymagającej wzmocnienia.</span>
                              </li>
                            </ul>
                            <div className="pt-2 border-t border-luxury-sand/50 text-[11px] font-mono text-luxury-dark/90">
                              <strong>Obszary zabiegowe:</strong> twarz, okolice oczu, szyja, dekolt, dłonie lub inny zakwalifikowany obszar.
                            </div>
                          </div>

                          {/* Jak działają stymulatory tkankowe? */}
                          <div className="border border-luxury-sand bg-white p-6 sm:p-8 rounded-sm space-y-4 shadow-xs flex flex-col justify-between">
                            <div className="space-y-3">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Fizjologia & Biologia
                              </span>
                              <h3 className="font-serif text-xl font-medium text-luxury-dark">
                                Jak działają stymulatory tkankowe?
                              </h3>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Preparat podawany jest iniekcyjnie w odpowiednio dobrane miejsca i warstwy tkanek. W zależności od składu może wspierać aktywność fibroblastów, poprawę nawodnienia oraz procesy związane z produkcją kolagenu, elastyny i innych elementów macierzy zewnątrzkomórkowej.
                              </p>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Poszczególne stymulatory różnią się mechanizmem i intensywnością działania. Niektóre koncentrują się przede wszystkim na regeneracji i poprawie jakości skóry, inne na jej nawodnieniu, zagęszczeniu albo silniejszej indukcji kolagenu.
                              </p>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Dlatego wybór preparatu nie powinien wynikać z jego popularności, lecz z rzeczywistych potrzeb i możliwości regeneracyjnych skóry.
                              </p>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] border border-luxury-sand/60 text-[11px] text-luxury-dark/90 font-serif italic">
                              Efekt rozwija się stopniowo – skóra odzyskuje fizjologiczną równowagę i młodzieńczą architekturę bez zniekształceń.
                            </div>
                          </div>
                        </div>

                        {/* Preparat dobierany indywidualnie - kryteria oceny */}
                        <div className="max-w-4xl mx-auto bg-white border border-luxury-sand p-6 sm:p-8 rounded-sm space-y-5 shadow-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Diagnostyka Przedzabiegowa
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Preparat dobierany indywidualnie
                            </h3>
                            <p className="text-xs text-luxury-dark/85 font-light leading-relaxed">
                              Podczas konsultacji oceniane są między innymi następujące parametry biologiczne:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                            {[
                              "grubość i gęstość skóry",
                              "poziom nawodnienia",
                              "stopień utraty jędrności",
                              "obecność drobnych zmarszczek",
                              "kondycja okolicy oczu",
                              "skłonność do obrzęków",
                              "wcześniejsze zabiegi iniekcyjne",
                              "tempo regeneracji",
                              "oczekiwany kierunek terapii"
                            ].map((crit, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#FAF8F5] border border-luxury-sand/50 rounded-xs text-xs text-luxury-dark">
                                <Check className="w-3.5 h-3.5 text-luxury-gold shrink-0 stroke-[2.5]" />
                                <span>{crit}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-luxury-dark/80 font-mono pt-1">
                            Na tej podstawie wybierana jest odpowiednia grupa preparatu spośród 4 wiodących linii biostymulujących.
                          </p>
                        </div>

                        {/* Grupy Preparatów Biostymulujących */}
                        <div className="space-y-6 pt-4 max-w-4xl mx-auto">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Katalog Biologiczny
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Cztery Grupy Preparatów</h3>
                            <p className="text-xs text-luxury-dark/80 font-light">
                              Dopasowane precyzyjnie do mikrośrodowiska i potrzeb komórkowych:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                            {/* Grupa 1: Polinukleotydy */}
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                  Grupa I
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark">Polinukleotydy</h4>
                                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                  Mogą wspierać regenerację, poprawę jakości i elastyczności skóry oraz tworzenie korzystniejszych warunków w jej mikrośrodowisku. Często wybierane są do skóry cienkiej, osłabionej i wymagającej stopniowej odbudowy, również w okolicy oczu.
                                </p>
                              </div>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Cel: Regeneracja komórkowa & okolica oka
                              </span>
                            </div>

                            {/* Grupa 2: Preparaty na bazie kwasu hialuronowego */}
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                  Grupa II
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark">Preparaty na bazie kwasu hialuronowego</h4>
                                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                  Są ukierunkowane przede wszystkim na poprawę nawodnienia, sprężystości i jakości skóry. Nie działają jak klasyczny wypełniacz, jeżeli ich właściwości i sposób podania odpowiadają biorewitalizacji, a nie modelowaniu objętości.
                                </p>
                              </div>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Cel: Biorewitalizacja, nawodnienie & sprężystość
                              </span>
                            </div>

                            {/* Grupa 3: Kompleksy aminokwasowe i hybrydowe */}
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                  Grupa III
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark">Kompleksy aminokwasowe i hybrydowe</h4>
                                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                  Dostarczają składników uczestniczących w naturalnych procesach przebudowy skóry. Mogą łączyć działanie nawilżające ze wsparciem syntezy białek strukturalnych (kolagenu i elastyny).
                                </p>
                              </div>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Cel: Substraty syntezy białek macierzy
                              </span>
                            </div>

                            {/* Grupa 4: Induktory kolagenu */}
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                  Grupa IV
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark">Induktory kolagenu</h4>
                                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                  Silniejsze preparaty biostymulujące wybierane są w przypadku skóry wymagającej intensywniejszego zagęszczenia i przebudowy. Ich zastosowanie wymaga szczególnie dokładnej kwalifikacji oraz właściwego zaplanowania techniki podania.
                                </p>
                              </div>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Cel: Intensywne zagęszczenie & przebudowa
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Przebieg zabiegu (5 kroków) */}
                        <div className="max-w-4xl mx-auto bg-white border border-luxury-sand p-6 sm:p-8 rounded-sm space-y-6 shadow-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Protokół Gabinetowy
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Przebieg zabiegu
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {[
                              {
                                num: "1",
                                title: "Konsultacja i kwalifikacja",
                                desc: "Przeprowadzany jest szczegółowy wywiad dotyczący stanu zdrowia, przyjmowanych leków, wcześniejszych zabiegów i oczekiwań. Oceniana jest również kondycja i struktura skóry."
                              },
                              {
                                num: "2",
                                title: "Dobór preparatu i planu terapii",
                                desc: "Wybierany jest rodzaj stymulatora, obszar oraz technika podania. Ustalana jest także liczba zabiegów i przewidywane odstępy pomiędzy nimi."
                              },
                              {
                                num: "3",
                                title: "Przygotowanie skóry",
                                desc: "Obszar zabiegowy zostaje dokładnie oczyszczony i zdezynfekowany. Jeśli wymaga tego procedura, stosowane jest znieczulenie miejscowe."
                              },
                              {
                                num: "4",
                                title: "Podanie preparatu",
                                desc: "Preparat podawany jest techniką iniekcyjną. Liczba wkłuć, ich rozmieszczenie i głębokość zależą od właściwości produktu, anatomii obszaru oraz celu terapii."
                              },
                              {
                                num: "5",
                                title: "Fototerapia LED i wyciszenie",
                                desc: "Uzupełnieniem zabiegu jest fototerapia LED, która wspiera wyciszenie skóry po iniekcji. Następnie przekazywane są indywidualne zalecenia dotyczące pielęgnacji i obserwacji obszaru zabiegowego."
                              }
                            ].map((step) => (
                              <div key={step.num} className="flex gap-4 items-start p-4 bg-[#FAF8F5] border border-luxury-sand/60 rounded-xs">
                                <div className="w-8 h-8 rounded-full bg-luxury-gold text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                  {step.num}
                                </div>
                                <div className="space-y-1 flex-1">
                                  <h4 className="font-serif text-sm font-semibold text-luxury-dark">
                                    {step.title}
                                  </h4>
                                  <p className="text-xs text-luxury-dark/90 font-light leading-relaxed">
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Jakich efektów można oczekiwać? */}
                        <div className="max-w-4xl mx-auto border border-luxury-sand bg-white p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Rezultaty Terapii
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Jakich efektów można oczekiwać?
                          </h3>
                          <p className="text-xs text-luxury-dark/80 font-light">
                            W zależności od zastosowanego preparatu i kondycji skóry terapia może wspierać:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            {[
                              "poprawę jędrności i elastyczności",
                              "zwiększenie gęstości skóry",
                              "poprawę nawodnienia i sprężystości",
                              "wygładzenie drobnych zmarszczek",
                              "wzmocnienie cienkiej skóry",
                              "poprawę wyglądu okolicy oczu",
                              "bardziej jednolitą strukturę",
                              "stopniową poprawę ogólnej jakości skóry"
                            ].map((eff, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2.5 bg-luxury-gold/5 border border-luxury-gold/20 rounded-xs text-xs text-luxury-dark">
                                <Sparkles className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                                <span>{eff}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-luxury-dark/95 font-serif italic pt-2 leading-relaxed">
                            Efekt nie zawsze jest widoczny bezpośrednio po zabiegu. Proces przebudowy może rozwijać się przez kolejne tygodnie, a jego przebieg zależy od rodzaju preparatu oraz indywidualnej odpowiedzi tkanek.
                          </p>
                        </div>

                        {/* Liczba zabiegów */}
                        <div className="max-w-4xl mx-auto bg-white border border-luxury-sand p-6 sm:p-8 rounded-sm text-left space-y-4 shadow-xs">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Harmonogram Terapii
                          </span>
                          <h3 className="font-serif text-xl font-light text-luxury-dark">
                            Liczba zabiegów
                          </h3>
                          <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                            Plan terapii ustalany jest indywidualnie i zgodnie z protokołem wybranego preparatu. W zależności od jego rodzaju może obejmować jeden zabieg lub serię 2–4 spotkań wykonywanych w określonych odstępach.
                          </p>
                          <div className="p-3.5 bg-[#FAF8F5] border-l-2 border-luxury-gold text-xs text-luxury-dark/90 font-serif italic">
                            „Nie tworzę jednego pakietu dla wszystkich stymulatorów, ponieważ każdy preparat wymaga innego sposobu i częstotliwości stosowania.”
                          </div>
                        </div>

                        {/* Cena zabiegu & Interaktywny Moduł Rezerwacji */}
                        <div className="max-w-4xl mx-auto border-2 border-luxury-gold/50 bg-[#FAF8F5] p-6 sm:p-8 rounded-sm shadow-md space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-gold/30 pb-4">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-1">
                                Inwestycja w Jakość Skóry
                              </span>
                              <h3 className="font-serif text-2xl md:text-3xl font-light text-luxury-dark">
                                Cena zabiegu
                              </h3>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="font-serif text-2xl md:text-3xl font-bold text-luxury-gold block">
                                od 800 zł
                              </span>
                              <span className="font-mono text-[10px] text-luxury-dark/70">
                                Czas trwania: 60–75 minut
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="font-mono text-[10px] text-luxury-gold uppercase font-bold block">
                              Cena obejmuje kompletną procedurę:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-luxury-dark/95">
                              <div className="flex items-center gap-2">• konsultację i kwalifikację</div>
                              <div className="flex items-center gap-2">• indywidualny dobór preparatu</div>
                              <div className="flex items-center gap-2">• zabieg iniekcyjny</div>
                              <div className="flex items-center gap-2">• fototerapię LED</div>
                              <div className="flex items-center gap-2 sm:col-span-2">• zalecenia pozabiegowe</div>
                            </div>
                          </div>

                          <p className="text-[11px] text-luxury-dark/80 font-light leading-relaxed border-t border-luxury-sand/50 pt-3">
                            Ostateczna cena zależy od rodzaju i ilości zastosowanego preparatu, obszaru zabiegowego oraz zaplanowanej techniki podania. Jest potwierdzana przed rozpoczęciem zabiegu.
                          </p>

                          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                            <button
                              onClick={() => {
                                setBookingTreatment(selectedTreatment);
                                setBookingConfirmed(false);
                                setBookingName("");
                                setBookingEmail("");
                                setBookingPhone("");
                                setBookingDate("");
                              }}
                              className="w-full sm:w-auto px-8 py-3.5 bg-luxury-dark text-white hover:bg-luxury-gold hover:text-white transition-all font-mono text-xs tracking-widest uppercase font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>Zarezerwuj Stymulatory w Kalendarzu</span>
                              <Sparkles className="w-4 h-4 text-luxury-gold" />
                            </button>
                            <span className="text-[10px] font-mono text-luxury-dark/60">
                              Dostępne terminy synchronizowane z Google Calendar
                            </span>
                          </div>
                        </div>

                        {/* Zalecenia po zabiegu & Przeciwwskazania */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                          {/* Zalecenia po zabiegu */}
                          <div className="border border-luxury-sand bg-white p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Bezpieczeństwo & Regeneracja
                            </span>
                            <h3 className="font-serif text-xl font-medium text-luxury-dark">
                              Zalecenia po zabiegu
                            </h3>
                            <p className="text-xs text-luxury-dark/80 font-light">
                              Po zabiegu należy bezwzględnie przestrzegać następujących zasad:
                            </p>
                            <ul className="space-y-1.5 text-xs text-luxury-dark/95 font-light">
                              <li className="flex items-start gap-2">• nie dotykać i nie masować miejsc podania bez wyraźnego zalecenia,</li>
                              <li className="flex items-start gap-2">• zachować szczególną higienę obszaru zabiegowego,</li>
                              <li className="flex items-start gap-2">• przez wskazany czas zrezygnować z makijażu,</li>
                              <li className="flex items-start gap-2">• unikać sauny, basenu, solarium i intensywnego wysiłku,</li>
                              <li className="flex items-start gap-2">• nie wykonywać masażu twarzy ani innych zabiegów w tym obszarze,</li>
                              <li className="flex items-start gap-2">• stosować łagodną pielęgnację wspierającą barierę,</li>
                              <li className="flex items-start gap-2">• codziennie używać ochrony przeciwsłonecznej SPF 50,</li>
                              <li className="flex items-start gap-2">• przestrzegać zaleceń właściwych dla zastosowanego preparatu.</li>
                            </ul>
                            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xs text-[11px] text-amber-950 font-light leading-relaxed">
                              <strong>Objawy bezpośrednie:</strong> Bezpośrednio po iniekcji mogą wystąpić zaczerwienienie, tkliwość, niewielki obrzęk, siniaki lub widoczne depozyty preparatu. Czas ich utrzymywania zależy od techniki podania, rodzaju stymulatora i indywidualnej reakcji skóry.
                            </div>
                          </div>

                          {/* Przeciwwskazania */}
                          <div className="border border-luxury-sand bg-white p-6 sm:p-8 rounded-sm space-y-4 shadow-xs flex flex-col justify-between">
                            <div className="space-y-3">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Kwalifikacja Medyczna
                              </span>
                              <h3 className="font-serif text-xl font-medium text-luxury-dark">
                                Przeciwwskazania
                              </h3>
                              <p className="text-xs text-luxury-dark/80 font-light">
                                Zabiegu nie wykonuje się między innymi w przypadku:
                              </p>
                              <ul className="space-y-1.5 text-xs text-luxury-dark/95 font-light">
                                <li className="flex items-start gap-2">• ciąży i karmienia piersią,</li>
                                <li className="flex items-start gap-2">• aktywnych infekcji i stanów zapalnych skóry,</li>
                                <li className="flex items-start gap-2">• opryszczki,</li>
                                <li className="flex items-start gap-2">• alergii na składniki preparatu,</li>
                                <li className="flex items-start gap-2">• zaburzeń krzepnięcia,</li>
                                <li className="flex items-start gap-2">• przyjmowania niektórych leków wpływających na krzepnięcie,</li>
                                <li className="flex items-start gap-2">• aktywnej choroby nowotworowej,</li>
                                <li className="flex items-start gap-2">• nieuregulowanych chorób autoimmunologicznych,</li>
                                <li className="flex items-start gap-2">• skłonności do powstawania bliznowców,</li>
                                <li className="flex items-start gap-2">• świeżo wykonanych zabiegów w tym samym obszarze,</li>
                                <li className="flex items-start gap-2">• innych przeciwwskazań wskazanych przez producenta preparatu.</li>
                              </ul>
                            </div>
                            <div className="p-3 bg-[#FAF8F5] border border-luxury-sand/60 text-[11px] font-mono text-luxury-dark/90">
                              Ostateczna kwalifikacja odbywa się podczas konsultacji przed zabiegiem.
                            </div>
                          </div>
                        </div>

                        {/* Naturalna poprawa jakości skóry - podsumowanie filozofii */}
                        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FAF8F5] to-white border border-luxury-gold/50 p-8 rounded-sm text-center space-y-4 shadow-sm">
                          <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase font-bold block">
                            Filozofia Slow Skin Concept™
                          </span>
                          <h3 className="font-serif text-2xl md:text-3xl font-light text-luxury-dark">
                            Naturalna poprawa jakości skóry
                          </h3>
                          <p className="text-xs md:text-sm text-luxury-dark/95 font-light max-w-2xl mx-auto leading-relaxed">
                            Celem terapii nie jest zmiana rysów twarzy ani tworzenie sztucznej objętości. Stymulatory tkankowe mają wspierać biologiczne procesy zachodzące w skórze, aby stopniowo poprawiać jej gęstość, sprężystość i zdolność do regeneracji.
                          </p>
                          <p className="font-serif italic text-sm text-luxury-gold">
                            Rodzaj preparatu i plan terapii zostaną dobrane do aktualnej kondycji oraz rzeczywistych potrzeb Twojej skóry.
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Rozszerzona monografia dla Oksybrazji z Infuzją Tlenową */}
                  {selectedTreatment.id === "oksybrazja-infuzja-tlenowa" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="oxybrasion-detailed-monograph">
                      
                      {/* Główny nagłówek wprowadzający */}
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Wind className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Tlenowo-Solna Odnowa Naskórka • Pielęgnacja Bankietowa
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Oksybrazja Tlenowa z Infuzją Tlenową
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Połączenie delikatnego mikrozłuszczania chłodnym strumieniem tlenu i soli fizjologicznej z infuzją spersonalizowanych składników aktywnych pod ciśnieniem. Czysta, promienna i głęboko nawilżona skóra bez naruszania bariery naskórkowej i bez okresu rekonwalescencji.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Sparkles className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Najważniejsza Zasada Zabiegu • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Najpierw delikatnie przygotowujemy naskórek, a następnie dobieramy pielęgnację odpowiadającą aktualnym potrzebom skóry.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Celem zabiegu nie jest agresywne złuszczanie. Oksybrazja ma wygładzić powierzchnię skóry bez naruszania jej równowagi hydrolipidowej, a infuzja tlenowa pod kontrolowanym ciśnieniem uzupełnia procedurę o składniki dobrane po diagnozie w dniu zabiegu. Dzięki temu nawet cera naczyniowa i nadreaktywna zyskuje ukojenie, blask i pełen komfort.
                            </p>
                          </div>
                        </div>

                        {/* Dwa Dopełniające Się Etapy */}
                        <div className="space-y-4 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Architektura Zabiegu
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Dwa Uzupełniające Się Etapy</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* Etap 1: Oksybrazja */}
                            <div className="border border-luxury-sand p-6 md:p-8 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Etap I • Oczyszczenie & Dotlenienie
                              </span>
                              <h4 className="font-serif text-lg font-medium text-luxury-dark">Oksybrazja Tlenowo-Solna</h4>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Strumień tlenu i rozpylonego roztworu soli fizjologicznej bezdotykowo opracowuje powierzchnię skóry. Pomaga bezboleśnie usunąć nadmiar zrogowaciałych komórek, wygładzić naskórek i przygotować go do dalszej pielęgnacji. Chłodny powiew zapewnia przyjemne uczucie świeżości, dotlenienia i natychmiastowego obkurczenia naczyń.
                              </p>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Brak tarcia mechanicznego • Bezpieczne dla cer naczyniowych
                              </span>
                            </div>

                            {/* Etap 2: Infuzja tlenowa */}
                            <div className="border border-luxury-sand p-6 md:p-8 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Etap II • Transport & Odżywienie
                              </span>
                              <h4 className="font-serif text-lg font-medium text-luxury-dark">Infuzja Tlenowa pod Ciśnieniem</h4>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Po przygotowaniu naskórka aplikowany jest preparat dopasowany do jego aktualnych potrzeb. Tlen medyczny pod kontrolowanym ciśnieniem wspiera równomierne rozprowadzenie składników w przestrzeniach międzykomórkowych. Procedura nie narusza ciągłości naskórka – stanowi łagodny etap pielęgnacyjny wspierający nawilżenie i zdrowy blask.
                              </p>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Technika beziniekcyjna • Zwiększona biodostępność formuł
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 4 Kierunki Składników Dobieranych Indywidualnie */}
                        <div className="space-y-6 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Formuły Biozgodne
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Składniki Dobierane do Kondycji Skóry</h3>
                            <p className="text-xs text-luxury-dark/80 font-light">
                              Nie stosujemy jednego gotowego koktajlu – preparat dobieramy po diagnozie skóry w dniu wizyty:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
                            <div className="border border-luxury-sand p-5 bg-white space-y-2 rounded-sm text-left shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">01 • Nawodnienie</span>
                              <h5 className="font-serif text-sm font-medium text-luxury-dark">Kwas Hialuronowy & NMF</h5>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Cząsteczki HA, mocznik, mleczany i PCA wiążące wodę w naskórku. Przywracają natychmiastową miękkość, sprężystość i elastyczność.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-5 bg-white space-y-2 rounded-sm text-left shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">02 • Ukojenie & Bariera</span>
                              <h5 className="font-serif text-sm font-medium text-luxury-dark">Ektoina & Beta-Glukan</h5>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Ektoina, pantenol i biozgodne lipidy. Pielęgnują skórę suchą, naczyniową, wrażliwą i redukują przejściowe podrażnienia.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-5 bg-white space-y-2 rounded-sm text-left shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">03 • Koloryt & Blask</span>
                              <h5 className="font-serif text-sm font-medium text-luxury-dark">Niacynamid & NAG</h5>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                N-acetyloglukozamina i silne antyoksydanty redukujące stres oksydacyjny. Wyrównują ziemisty koloryt i dodają świeżości.
                              </p>
                            </div>

                            <div className="border border-luxury-sand p-5 bg-white space-y-2 rounded-sm text-left shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">04 • Regeneracja</span>
                              <h5 className="font-serif text-sm font-medium text-luxury-dark">Peptydy & Aminokwasy</h5>
                              <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                                Kompleksy peptydowe i kofaktory komórkowe dostarczające skórze substancji niezbędnych do jej naturalnej autoodnowy.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Cennik Pojedynczych Zabiegów i Pakietów 4 Zabiegów */}
                        <div className="space-y-6 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Transparentny Cennik
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Obszary Zabiegowe i Pakiety 4 Sesji
                            </h3>
                            <p className="text-xs text-luxury-dark/90 font-light">
                              Każda wizyta obejmuje ocenę skóry, oksybrazję, infuzję ze spersonalizowanym koktajlem oraz pielęgnację końcową:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Pojedyncze Zabiegi */}
                            <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-xs">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pojedyncze Sesje Gabinetowe
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Ceny Zabiegów Indywidualnych
                                </h4>
                                
                                <div className="space-y-3 divide-y divide-luxury-sand/40">
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark block">Twarz</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Oksybrazja tlenowo-solna + infuzja koktajlu</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">350 PLN</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark block">Twarz i Szyja</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Pełne opracowanie twarzy oraz linii szyi</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">400 PLN</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark block">Twarz, Szyja i Dekolt</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Kompleksowa ceremonia dotleniająca 3 strefy</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">450 PLN</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 bg-luxury-sand/10 border border-luxury-sand/40 rounded-xs text-[10.5px] text-luxury-dark/90 font-light">
                                Czas trwania procedury: 60–75 minut. Idealny zabieg bankietowy przed wielkim wyjściem.
                              </div>
                            </div>

                            {/* Pakiety Zabiegowe (Seria 4) */}
                            <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-md relative">
                              <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                                Pakiet Serii 4 Zabiegów
                              </div>
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pakiety Serii Terapeutycznej (4 Zabiegi)
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Pakiety 4 Sesji Oksybrazji z Infuzją
                                </h4>

                                <div className="space-y-3 divide-y divide-luxury-gold/30">
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz (Pakiet 4)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">315 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1260 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1400 PLN</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Szyja (Pakiet 4)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">360 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1440 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1600 PLN</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt (Pakiet 4)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">405 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1620 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1800 PLN</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white/80 border border-luxury-gold/40 p-3 rounded-xs space-y-1">
                                <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase block">
                                  Spersonalizowana seria
                                </span>
                                <p className="text-[11px] text-luxury-dark italic font-serif">
                                  Pakiet nie oznacza mechanicznego powtarzania tego samego schematu. Podczas każdej z 4 wizyt kierunek pielęgnacji i składniki infuzji są dobierane na nowo.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Rozszerzona monografia dla Oczyszczania Wodorowego */}
                  {selectedTreatment.id === "oczyszczanie-wodorowe" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="hydrogen-cleaning-detailed-monograph">
                      
                      {/* Główny nagłówek wprowadzający */}
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Droplets className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Hydropeeling Wodorowy • Wsparcie Antyoksydacyjne • Ochrona Bariery
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Oczyszczanie Wodorowe
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Połączenie aktywnej wody nasyconej wodorem z kontrolowanym podciśnieniem próżniowym. Skuteczne odciążenie porów z utlenionego sebum i zanieczyszczeń miejskich bez agresywnego odtłuszczania i bez naruszania równowagi płaszcza hydrolipidowego.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Droplets className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Najważniejsza Zasada Zabiegu • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Oczyszczanie ma odciążyć skórę, a nie pozbawić ją naturalnej ochrony.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Celem zabiegu nie jest całkowite, chemiczne usunięcie lipidów i sebum. Są one niezbędne do prawidłowego funkcjonowania bariery naskórkowej i mikrobiomu. Parametry urządzenia dobieramy tak, aby usunąć wyłącznie zanieczyszczenia i zrogowaciałe komórki, nie dopuszczając do wtórnego łojotoku ani reaktywnego przesuszenia.
                            </p>
                          </div>
                        </div>

                        {/* Trzy Filary Działania Hydropeelingu */}
                        <div className="space-y-4 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Mechanizm Fizjologiczny
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Jak Działa Oczyszczanie Wodorowe?</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Filar I</span>
                                <h4 className="font-serif text-base font-medium text-luxury-dark">Woda Nasycona Wodorem</h4>
                                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                  Aktywny wodór cząsteczkowy rozpuszczony w strumieniu wody. Cechuje się potencjałem antyoksydacyjnym, pomagając redukować stres oksydacyjny wywołany promieniami UV, smogiem i metalami ciężkimi.
                                </p>
                              </div>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Działanie antyoksydacyjne
                              </span>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Filar II</span>
                                <h4 className="font-serif text-base font-medium text-luxury-dark">Kontrolowane Podciśnienie</h4>
                                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                  Wirujący strumień cieczy w połączeniu z delikatną próżnią zasysa zrogowaciałe komórki i utlenione sebum z ujść gruczołów łojowych, jednocześnie stale nawilżając opracowywane tkanki.
                                </p>
                              </div>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Bezurazowe odblokowanie ujść
                              </span>
                            </div>

                            <div className="border border-luxury-sand p-6 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all flex flex-col justify-between">
                              <div className="space-y-2">
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Filar III</span>
                                <h4 className="font-serif text-base font-medium text-luxury-dark">Preparaty Pielęgnacyjne</h4>
                                <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                  Po oczyszczeniu skóra doskonale chłonie substancje aktywne. Wprowadzamy koncentrat nawilżający, regulujący lub kojący z użyciem głowicy ultradźwiękowej (sonoforezy).
                                </p>
                              </div>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Wprowadzenie sonoforezą
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Indywidualne Etapy Uzupełniające */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm text-left space-y-4 shadow-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Personalizacja Rytuału
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">
                              Możliwe Etapy Uzupełniające (Dobierane do Cery)
                            </h3>
                            <p className="text-xs text-luxury-dark/85 font-light">
                              Oczyszczanie wodorowe może stanowić samodzielny zabieg lub bazę dobranej terapii. W zależności od kondycji skóry możemy włączyć:
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">1. Łagodna eksfoliacja enzymatyczna</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Dla skór wymagających zmiękczenia warstwy rogowej</span>
                            </div>
                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">2. Sonoforeza / Ultradźwięki</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Głębsza penetracja ampułek nawilżających lub seboregulujących</span>
                            </div>
                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">3. Maska kojąca lub regulująca</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Kompres wyciszający zaczerwienienia i zwężający pory</span>
                            </div>
                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">4. Chłodzenie głowicą cryo</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Błyskawiczne obkurczenie naczyń krwionośnych i ukojenie</span>
                            </div>
                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">5. Emulsja barierowa z ceramidami</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Odbudowa naturalnego płaszcza lipidowego</span>
                            </div>
                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">6. Fotoprotekcja SPF 50+</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Zabezpieczenie przed promieniowaniem UVA/UVB i HEV</span>
                            </div>
                          </div>
                        </div>

                        {/* Cennik Zabiegu i Rekomendowana Częstotliwość */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                          {/* Cennik */}
                          <div className="lg:col-span-7 bg-white border border-luxury-sand p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-xs">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                Przejrzysty Cennik
                              </span>
                              <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                Obszary Zabiegowe Oczyszczania Wodorowego
                              </h4>

                              <div className="space-y-3.5 divide-y divide-luxury-sand/40">
                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz</span>
                                    <span className="text-[10px] text-luxury-dark/80 font-light">Hydropeeling wodorowy + sonoforeza + maska + pielęgnacja końcowa</span>
                                  </div>
                                  <span className="font-serif text-base text-luxury-gold font-bold">320 PLN</span>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Szyja</span>
                                    <span className="text-[10px] text-luxury-dark/80 font-light">Pełne opracowanie strefy twarzy oraz linii szyi</span>
                                  </div>
                                  <span className="font-serif text-base text-luxury-gold font-bold">370 PLN</span>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt</span>
                                    <span className="text-[10px] text-luxury-dark/80 font-light">Kompleksowy rytuał wodorowy dla 3 obszarów</span>
                                  </div>
                                  <span className="font-serif text-base text-luxury-gold font-bold">420 PLN</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-xs text-[10.5px] text-luxury-dark/90 font-light">
                              Czas trwania zabiegu: około 60 minut. Cena zawiera kompletną procedurę wraz z wyciszeniem i ochroną barierową.
                            </div>
                          </div>

                          {/* Częstotliwość i Czas Odnowy */}
                          <div className="lg:col-span-5 border border-luxury-gold/30 bg-luxury-sand/15 p-6 md:p-8 rounded-sm text-left flex flex-col justify-between space-y-4">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                                Fizjologiczny Cykl
                              </span>
                              <h4 className="font-serif text-lg font-medium text-luxury-dark mt-1 mb-3">
                                Rekomendowana Częstotliwość
                              </h4>
                              <div className="space-y-2.5 text-xs text-luxury-dark/95 font-light leading-relaxed">
                                <p>• <strong>Pojedynczy zabieg:</strong> idealny jako okresowe odświeżenie cery, przed makijażem lub po podróży i ekspozycji na zanieczyszczenia.</p>
                                <p>• <strong>W serii regularnej:</strong> zalecany odstęp to około <strong>3–4 tygodnie</strong>, co idealnie pokrywa się z 28-dniowym cyklem odnowy naskórka.</p>
                                <p>• <strong>Dla cery reaktywnej:</strong> częstotliwość oraz stopień podciśnienia dobieramy indywidualnie po ocenie gotowości bariery.</p>
                              </div>
                            </div>
                            <div className="p-3 bg-white/80 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-[11px] italic text-luxury-gold block">
                                „Czysta skóra bez podrażnień – zachowaj to, co chroni, usuń to, co zbędne.”
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Rozszerzona monografia dla Nanobrazji NanoPen */}
                  {selectedTreatment.id === "nanobrazja-nanopen" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="nanobrasion-detailed-monograph">
                      
                      {/* Główny nagłówek wprowadzający */}
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Layers className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Kontrolowana Odnowa Naskórka • Technologia Nanodyskowa
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Nanobrazja NanoPen
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Połączenie kontrolowanego mikrozłuszczania warstwy rogowej sterylnym nanodyskiem, masażu wibracyjnego oraz stemplowania wprowadzającego składniki odżywcze. Wygładzenie i rozświetlenie cery bez nakłuwania skóry właściwej, bez krwawienia i bez rekonwalescencji.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Layers className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Najważniejsza Zasada Zabiegu • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Najpierw porządkujemy powierzchnię naskórka, aby skóra mogła lepiej wykorzystać dalszą pielęgnację.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Celem zabiegu nie jest agresywne złuszczenie ani wywołanie ostrego stanu zapalnego. Nanobrazja w kontrolowany sposób wygładza warstwę rogową, wspomaga jej naturalną fizjologiczną odnowę i tworzy lepsze warunki do kontaktu komórek naskórka z biozgodnymi substancjami aktywnymi.
                            </p>
                          </div>
                        </div>

                        {/* Dwa Działania Nanodysku */}
                        <div className="space-y-4 pt-4">
                          <div className="text-center max-w-xl mx-auto space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Mechanizm Podwójny
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Dwa Uzupełniające Się Działania</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* Działanie 1: Kontrolowane frakcjonowanie */}
                            <div className="border border-luxury-sand p-6 md:p-8 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Faza I • Ruch Posuwisty
                              </span>
                              <h4 className="font-serif text-lg font-medium text-luxury-dark">Kontrolowane Frakcjonowanie</h4>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Jednorazowy kartridż z nanodyskiem prowadzony precyzyjnym ruchem posuwistym delikatnie opracowuje warstwę rogową. Pozwala bezpiecznie usunąć nagromadzony nadmiar zrogowaciałych korneocytów, wygładzić nierówności i odblokować ujścia gruczołów bez naruszania naczyń krwionośnych.
                              </p>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Jednorazowy, sterylny nanodysk • Zero krwawienia
                              </span>
                            </div>

                            {/* Działanie 2: Stemplowanie */}
                            <div className="border border-luxury-sand p-6 md:p-8 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Faza II • Ruch Wertykalny
                              </span>
                              <h4 className="font-serif text-lg font-medium text-luxury-dark">Stemplowanie i Aplikacja Preparatu</h4>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Praca stemplująca wspiera bezpośredni kontakt dobranych substancji odżywczych z opracowanym naskórkiem. Dzięki wcześniejszemu wygładzeniu warstwy rogowej skóra znacznie efektywniej wykorzystuje zaaplikowaną pielęgnację koncentratami bioaktywnymi.
                              </p>
                              <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                                Działanie naskórkowe • Zwiększona absorpcja biologiczna
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Kierunki Formuł Aktywnych */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm text-left space-y-4 shadow-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Dopasowanie Biologiczne
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">
                              Preparaty Dobierane do Aktualnej Kondycji Skóry
                            </h3>
                            <p className="text-xs text-luxury-dark/85 font-light">
                              W zależności od potrzeb ocenionych podczas wywiadu zabieg może zostać ukierunkowany na konkretny cel:
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Nawodnienie & Komfort</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Kwas hialuronowy o niskiej masie i NMF dla cer suchych i ściągniętych</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Ukojenie & Ochrona Bariery</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Ektoina, beta-glukan i pantenol wyciszające nadreaktywność</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Struktura & Sebum</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Regulacja nadmiernego rogowacenia i zwężenie rozszerzonych porów</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Koloryt & Antyoksydacja</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Niacynamid i bioflawonoidy przywracające świeżość i blask</span>
                            </div>
                          </div>
                        </div>

                        {/* Cennik Pojedynczych Zabiegów i Pakietów 3 Zabiegów */}
                        <div className="space-y-6 pt-2">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Transparentny Cennik
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Obszary Zabiegowe i Pakiety 3 Sesji
                            </h3>
                            <p className="text-xs text-luxury-dark/90 font-light">
                              Cena obejmuje ocenę skóry, frakcjonowanie nanodyskiem, stemplowanie z koncentratem oraz wyciszenie barierowe z SPF 50+:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Pojedyncze Wizyty */}
                            <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-xs">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pojedyncze Sesje Gabinetowe
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Ceny Zabiegów Indywidualnych
                                </h4>

                                <div className="space-y-3.5 divide-y divide-luxury-sand/40">
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Pełne opracowanie nanodyskowe z koncentratem</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">350 PLN</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Szyja</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Nanobrazja twarzy wraz z linią szyi</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">400 PLN</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt</span>
                                      <span className="text-[10px] text-luxury-dark/80 font-light">Kompleksowa ceremonia nanodyskowa 3 stref</span>
                                    </div>
                                    <span className="font-serif text-base text-luxury-gold font-bold">450 PLN</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-xs text-[10.5px] text-luxury-dark/90 font-light">
                                Czas trwania wizyty: 60–75 minut. Skóra natychmiast gładsza, bez konieczności rekonwalescencji domowej.
                              </div>
                            </div>

                            {/* Pakiety 3 Zabiegów */}
                            <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-md relative">
                              <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                                Pakiet Serii 3 Zabiegów
                              </div>
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pakiety Serii Terapeutycznej (3 Zabiegi)
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Pakiety 3 Sesji Nanobrazji
                                </h4>

                                <div className="space-y-3.5 divide-y divide-luxury-gold/30">
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz (Pakiet 3)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">315 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">945 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1050 PLN</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Szyja (Pakiet 3)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">360 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1080 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1200 PLN</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt (Pakiet 3)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">405 zł za jeden zabieg</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-serif text-lg text-luxury-dark font-bold">1215 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1350 PLN</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white/80 border border-luxury-gold/40 p-3 rounded-xs space-y-1">
                                <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase block">
                                  Harmonogram serii
                                </span>
                                <p className="text-[11px] text-luxury-dark italic font-serif">
                                  Zalecany odstęp między zabiegami: około 10–14 dni. Pakiet obejmuje ponowną ocenę gotowości skóry podczas każdej wizyty.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Rozszerzona monografia: Mezoterapia Bezigłowa */}
                  {selectedTreatment.id === "mezoterapia-beziglowa" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="needlefree-meso-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Zap className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Bez Nakłuwania • Koncentraty dermaviduals® • Wsparcie Kondycji
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Mezoterapia Bezigłowa
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Nieinwazyjna metoda wspomagająca przenikanie odpowiednio dobranych substancji aktywnych bez naruszania ciągłości naskórka. Wykorzystuje kontrolowane impulsy elektryczne, które czasowo zwiększają przepuszczalność powierzchownych struktur skóry i ułatwiają transport składników.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Sparkles className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Najważniejsza Zasada Zabiegu • Mikroodżywianie Skóry
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Celem terapii nie jest zastępowanie skóry w jej naturalnych funkcjach, lecz dostarczenie jej wsparcia potrzebnego do nawodnienia, ochrony i regeneracji.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Technologia pełni funkcję narzędzia wspomagającego aplikację składników. O kierunku działania zawsze decydują kondycja skóry, jej aktualne zasoby i gotowość na określony rodzaj stymulacji. Podczas wizyty kompozycja aktywna dermaviduals® powstaje na żywo przy klientce.
                            </p>
                          </div>
                        </div>

                        {/* Kierunki Formuł dermaviduals */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm text-left space-y-4 shadow-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Personalizacja Bionomiczna
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">
                              Indywidualny Dobór Koncentratów dermaviduals®
                            </h3>
                            <p className="text-xs text-luxury-dark/85 font-light">
                              Kompozycja bazy i czystych koncentratów dobierana bezpośrednio po analizie gotowości tkankowej:
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Intensywne Nawilżenie</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Kwas hialuronowy o niskiej masie i NMF – redukcja napięcia i suchości</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Odbudowa Bariery</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Ektoina, beta-glukan i ceramidy DMS – ukojenie nadreaktywności</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Gęstość & Regeneracja</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Bioaktywne peptydy i aminokwasy – poprawa elastyczności i sprężystości</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-serif text-xs font-medium text-luxury-dark block mb-1">Koloryt & Antyoksydacja</span>
                              <span className="text-[10.5px] text-luxury-dark/85 font-light block">Niacynamid i bioflawonoidy – przywrócenie promiennego blasku cery</span>
                            </div>
                          </div>
                        </div>

                        {/* Cennik Pojedynczych i Pakietu 3 Zabiegów */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-2">
                          <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-xs">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                Pojedyncze Wizyty
                              </span>
                              <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                Warianty Zabiegu
                              </h4>

                              <div className="space-y-3.5 divide-y divide-luxury-sand/40">
                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz</span>
                                    <span className="text-[10px] text-luxury-dark/80 font-light">Analiza + dobór bazy i koncentratów + bezigłowa infuzja • ok. 60 min</span>
                                  </div>
                                  <span className="font-serif text-base text-luxury-gold font-bold">400 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Szyja</span>
                                    <span className="text-[10px] text-luxury-dark/80 font-light">Rozszerzona terapia dwóch stref • 60–75 min</span>
                                  </div>
                                  <span className="font-serif text-base text-luxury-gold font-bold">450 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt</span>
                                    <span className="text-[10px] text-luxury-dark/80 font-light">Kompleksowa ceremonia trzech obszarów • 75–90 min</span>
                                  </div>
                                  <span className="font-serif text-base text-luxury-gold font-bold">500 PLN</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-xs text-[10.5px] text-luxury-dark/90 font-light">
                              Bezpieczna procedura bez igieł i bez konieczności rekonwalescencji domowej.
                            </div>
                          </div>

                          <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-md relative">
                            <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                              Pakiet 3 Zabiegów (-10%)
                            </div>
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                Pakiety Terapeutyczne
                              </span>
                              <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                Seria 3 Zabiegów
                              </h4>

                              <div className="space-y-3.5 divide-y divide-luxury-gold/30">
                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz (Pakiet 3)</span>
                                    <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">360 zł za zabieg</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-serif text-lg text-luxury-dark font-bold">1080 PLN</span>
                                    <span className="block text-[9px] line-through text-luxury-dark/50">1200 PLN</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Szyja (Pakiet 3)</span>
                                    <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">405 zł za zabieg</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-serif text-lg text-luxury-dark font-bold">1215 PLN</span>
                                    <span className="block text-[9px] line-through text-luxury-dark/50">1350 PLN</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <div>
                                    <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt (Pakiet 3)</span>
                                    <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">450 zł za zabieg</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-serif text-lg text-luxury-dark font-bold">1350 PLN</span>
                                    <span className="block text-[9px] line-through text-luxury-dark/50">1500 PLN</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white/80 border border-luxury-gold/40 p-3 rounded-xs space-y-1">
                              <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase block">Ewolucja składu</span>
                              <p className="text-[11px] text-luxury-dark italic font-serif">
                                Skład koncentratów oraz parametry urządzenia mogą być modyfikowane podczas kolejnych wizyt zgodnie z aktualną reakcją skóry.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Mezoterapia Mikroigłowa */}
                  {selectedTreatment.id === "mezoterapia-mikroiglowa" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="microneedling-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Activity className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Kontrolowana Stymulacja • Przebudowa Struktury • Jałowy Preparat
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Mezoterapia Mikroigłowa
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Zabieg precyzyjnego mikronakłuwania sterylnym kartridżem jednorazowym, uruchamiający naturalną kaskadę naprawczą i przebudowę kolagenu. Poprawa gęstości, redukcja rozszerzonych porów, spłycenie drobnych zmarszczek i blizn potrądzikowych.
                          </p>
                        </div>

                        {/* Zasada Rzetelnej Biologii */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Dna className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Mądra Biostymulacja • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Celem nie jest wykonanie jak największej liczby wkłuć, lecz wywołanie odpowiedniej odpowiedzi biologicznej bez przeciążania skóry.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Każdy zabieg poprzedza ocena gotowości bariery naskórkowej. Jeżeli skóra jest osłabiona lub reaktywna, najpierw przygotowujemy ją łagodniejszymi procedurami barierowymi. Parametry głębokości i sterylne ampułki dobieramy indywidualnie do obszaru i grubości tkanek.
                            </p>
                          </div>
                        </div>

                        {/* 4 Grupy Preparatów Jałowych */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                          <div className="p-4 bg-white border border-luxury-sand rounded-sm text-left space-y-1.5 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Kierunek I</span>
                            <h4 className="font-serif text-sm font-medium text-luxury-dark">Nawodnienie i Elastyczność</h4>
                            <p className="text-[11px] text-luxury-dark/90 font-light">Nieusieciowany kwas hialuronowy o czystości medycznej – głębokie nasycenie i sprężystość.</p>
                          </div>
                          <div className="p-4 bg-white border border-luxury-sand rounded-sm text-left space-y-1.5 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Kierunek II</span>
                            <h4 className="font-serif text-sm font-medium text-luxury-dark">Jędrność i Przebudowa</h4>
                            <p className="text-[11px] text-luxury-dark/90 font-light">Kompleksy aminokwasów i peptydów biomimetycznych stymulujące syntezę kolagenu I i III.</p>
                          </div>
                          <div className="p-4 bg-white border border-luxury-sand rounded-sm text-left space-y-1.5 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Kierunek III</span>
                            <h4 className="font-serif text-sm font-medium text-luxury-dark">Wyrównanie Kolorytu</h4>
                            <p className="text-[11px] text-luxury-dark/90 font-light">Składniki antyoksydacyjne i rozjaśniające redukujące powierzchowne plamy pigmentacyjne.</p>
                          </div>
                          <div className="p-4 bg-white border border-luxury-sand rounded-sm text-left space-y-1.5 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Kierunek IV</span>
                            <h4 className="font-serif text-sm font-medium text-luxury-dark">Regeneracja i Ukojenie</h4>
                            <p className="text-[11px] text-luxury-dark/90 font-light">Formuły o prostym, czystym składzie przyspieszające bezpieczną epitelizację naskórka.</p>
                          </div>
                        </div>

                        {/* Cennik Mikroigłowej */}
                        <div className="space-y-6 pt-2">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Transparentny Cennik Mikronakłuwania
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Zabiegi Indywidualne i Pakiety 3 Sesji
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-xs">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Pojedyncza Wizyta
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Ceny Zabiegów Indywidualnych
                                </h4>

                                <div className="space-y-3.5 divide-y divide-luxury-sand/40">
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-sm text-luxury-dark font-medium">Twarz</span>
                                    <span className="font-serif text-base text-luxury-gold font-bold">500 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-sm text-luxury-dark font-medium">Twarz i Szyja</span>
                                    <span className="font-serif text-base text-luxury-gold font-bold">600 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-sm text-luxury-dark font-medium">Twarz, Szyja i Dekolt</span>
                                    <span className="font-serif text-base text-luxury-gold font-bold">700 PLN</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 bg-luxury-sand/15 border border-luxury-sand/50 rounded-xs text-[10.5px] text-luxury-dark/90 font-light">
                                Czas trwania: 75–90 min. Cena zawiera sterylny kartridż jednorazowy, dedykowany preparat jałowy i wyciszenie.
                              </div>
                            </div>

                            <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-5 text-left flex flex-col justify-between shadow-md relative">
                              <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                                Pakiet Serii 3 Zabiegów (-10%)
                              </div>
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-2">
                                  Seria Przebudowy Kolagenowej
                                </span>
                                <h4 className="font-serif text-xl font-medium text-luxury-dark mb-4">
                                  Pakiety 3 Sesji Mikronakłuwania
                                </h4>

                                <div className="space-y-3.5 divide-y divide-luxury-gold/30">
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz (Pakiet 3)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">450 zł za zabieg</span>
                                    </div>
                                    <span className="font-serif text-lg text-luxury-dark font-bold">1350 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz i Szyja (Pakiet 3)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">540 zł za zabieg</span>
                                    </div>
                                    <span className="font-serif text-lg text-luxury-dark font-bold">1620 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <div>
                                      <span className="font-serif text-sm text-luxury-dark font-medium block">Twarz, Szyja i Dekolt (Pakiet 3)</span>
                                      <span className="text-[10.5px] text-luxury-gold font-semibold font-mono">630 zł za zabieg</span>
                                    </div>
                                    <span className="font-serif text-lg text-luxury-dark font-bold">1890 PLN</span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white/80 border border-luxury-gold/40 p-3 rounded-xs space-y-1">
                                <span className="font-mono text-[9px] text-luxury-gold font-bold uppercase block">Rekomendowany odstęp</span>
                                <p className="text-[11px] text-luxury-dark italic font-serif">
                                  Zabiegi wykonujemy co 4–6 tygodni, dostosowując głębokość wkłuć na podstawie postępów gojenia.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Mesoporacja Dwufazowa MESO PORO */}
                  {selectedTreatment.id === "mesoporacja-dwufazowa-mesoporo" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="mesoporo-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Złota Głowica ESM • Bezigłowa Aplikacja MESO PORO • Indywidualna Terapia
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Mesoporacja Dwufazowa MESO PORO
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Innowacyjna procedura dwufazowa łącząca przygotowanie skóry luksusową złotą głowicą rolkową ESM z bezigłową aplikacją składników aktywnych głowicą MESO PORO. Bez nakłuwania, bez bólu i bez rekonwalescencji.
                          </p>
                        </div>

                        {/* Zasada Dwóch Głowic */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Zap className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Najważniejsza Zasada Zabiegu • Slow Skin Concept™
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Technologia wspomaga aplikację składników, ale o kierunku terapii decyduje aktualna kondycja skóry.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Nie stosujemy jednego gotowego koktajlu ani identycznego schematu. Wybór składników oraz precyzyjnych parametrów obu głowic zawsze poprzedza rzetelna ocena skóry w dniu zabiegu.
                            </p>
                          </div>
                        </div>

                        {/* Dwie Współpracujące Głowice */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="border border-luxury-sand p-6 md:p-8 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Etap I • Złota Głowica ESM
                            </span>
                            <h4 className="font-serif text-lg font-medium text-luxury-dark">Stymulacja i Przygotowanie Tkanek</h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Luksusowa złota głowica rolkowa ESM przygotowuje skórę do dalszej pracy. Wspiera mikrokrążenie kapilarne, rozluźnia napięcia mięśni mimicznych, dotlenia tkanki i pomaga stworzyć idealne środowisko do przyjęcia substancji aktywnych.
                            </p>
                            <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                              Masaż mikrokrążeniowy • Poprawa napięcia owalu
                            </span>
                          </div>

                          <div className="border border-luxury-sand p-6 md:p-8 bg-white space-y-3 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Etap II • Głowica MESO PORO
                            </span>
                            <h4 className="font-serif text-lg font-medium text-luxury-dark">Bezigłowa Elektroporacja Transdermalna</h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Wykorzystuje bezpieczne, krótkie impulsy elektryczne, które czasowo zwiększają przepuszczalność naskórka. Umożliwia transport cząsteczek kwasu hialuronowego, peptydów i ektoiny bez igieł, bez śladów i bez bólu.
                            </p>
                            <span className="text-[10px] text-luxury-gold font-medium block pt-2 border-t border-luxury-sand/40">
                              Czasowe mikrokanały w błonach komórkowych • Zero krwi
                            </span>
                          </div>
                        </div>

                        {/* Cennik Pojedynczych, Pakietu 4 i Pakietu 6 */}
                        <div className="space-y-6 pt-2">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Kompletny Cennik Sesji i Pakietów
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Wizyty Indywidualne oraz Pakiety 4 i 6 Sesji
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {/* 1 Zabieg */}
                            <div className="border border-luxury-sand bg-white p-6 rounded-sm space-y-4 text-left flex flex-col justify-between shadow-xs">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-1">
                                  Pojedyncza Sesja
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark mb-3">
                                  Jeden Zabieg
                                </h4>
                                <div className="space-y-3 divide-y divide-luxury-sand/40">
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz</span>
                                    <span className="font-serif text-sm font-bold text-luxury-gold">450 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz i Szyja</span>
                                    <span className="font-serif text-sm font-bold text-luxury-gold">500 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz, Szyja, Dekolt</span>
                                    <span className="font-serif text-sm font-bold text-luxury-gold">550 PLN</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-[10px] text-luxury-dark/80 italic">Czas trwania: 60–75 minut</div>
                            </div>

                            {/* Pakiet 4 zabiegów */}
                            <div className="border border-luxury-gold/50 bg-luxury-sand/15 p-6 rounded-sm space-y-4 text-left flex flex-col justify-between shadow-xs">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-1">
                                  Seria Podstawowa (-10%)
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark mb-3">
                                  Pakiet 4 Zabiegów
                                </h4>
                                <div className="space-y-3 divide-y divide-luxury-sand/40">
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz (4x)</span>
                                    <span className="font-serif text-sm font-bold text-luxury-dark">1620 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz i Szyja (4x)</span>
                                    <span className="font-serif text-sm font-bold text-luxury-dark">1800 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz, Szyja, Dekolt (4x)</span>
                                    <span className="font-serif text-sm font-bold text-luxury-dark">1980 PLN</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-[10px] text-luxury-gold font-medium">Wykonywane co tydzień</div>
                            </div>

                            {/* Pakiet 6 zabiegów */}
                            <div className="border-2 border-luxury-gold bg-luxury-gold/10 p-6 rounded-sm space-y-4 text-left flex flex-col justify-between shadow-md">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-1">
                                  Seria Intensywna (-15%)
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark mb-3">
                                  Pakiet 6 Zabiegów
                                </h4>
                                <div className="space-y-3 divide-y divide-luxury-gold/30">
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz (6x)</span>
                                    <span className="font-serif text-sm font-bold text-luxury-gold">2295 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz i Szyja (6x)</span>
                                    <span className="font-serif text-sm font-bold text-luxury-gold">2550 PLN</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark">Twarz, Szyja, Dekolt (6x)</span>
                                    <span className="font-serif text-sm font-bold text-luxury-gold">2805 PLN</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-[10px] text-luxury-dark/90 font-light">Maksymalny rabat 15% dla pełnej rewitalizacji</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Laserowy Peeling Węglowy Black Doll */}
                  {selectedTreatment.id === "laser-carbon" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="black-doll-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Laser Q-Switch Nd:YAG • Emulsja Węglowa • Oczyszczenie i Wygładzenie
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Laserowy Peeling Węglowy Black Doll
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Połączenie specjalistycznej emulsji węglowej z ultrakrótkimi impulsami lasera Q-Switch Nd:YAG. Dokładne fotoakustyczne oczyszczenie ujść mieszków włosowych, ograniczenie łojotoku i natychmiastowe odświeżenie kolorytu.
                          </p>
                        </div>

                        {/* Rzetelne podejście medyczne */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Shield className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Rzetelne Działanie • Uczciwa Informacja
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Peeling węglowy nie zamyka trwale porów, lecz ogranicza ich widoczność poprzez usunięcie zalegającego sebum i martwych komórek.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Moc, częstotliwość i liczba przejść dobierane są indywidualnie do fototypu, reaktywności oraz stanu bariery naskórkowej. Zabieg nie jest przeznaczony do każdej postaci trądziku — w przypadku zaostrzonych zmian zapalnych pierwszym krokiem jest wyciszenie i regeneracja skóry.
                            </p>
                          </div>
                        </div>

                        {/* Zasada Fotoakustyczna */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                          <div className="p-6 bg-white border border-luxury-sand rounded-sm text-left space-y-2 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">1. Aplikacja Emulsji</span>
                            <h4 className="font-serif text-sm font-medium text-luxury-dark">Wnikanie w Ujścia Mieszków</h4>
                            <p className="text-xs text-luxury-dark/90 font-light">Drobinki węgla osadzają się na powierzchni naskórka i w zagłębieniach porów, pełniąc rolę zewnętrznego chromoforu.</p>
                          </div>
                          <div className="p-6 bg-white border border-luxury-sand rounded-sm text-left space-y-2 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">2. Impuls Q-Switch</span>
                            <h4 className="font-serif text-sm font-medium text-luxury-dark">Efekt Fotoakustyczny</h4>
                            <p className="text-xs text-luxury-dark/90 font-light">Pochłonięcie energii lasera wywołuje gwałtowne rozdrobnienie węgla i oderwanie zanieczyszczeń bez uszkadzania otaczających tkanek.</p>
                          </div>
                          <div className="p-6 bg-white border border-luxury-sand rounded-sm text-left space-y-2 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">3. Wyciszenie</span>
                            <h4 className="font-serif text-sm font-medium text-luxury-dark">Ochrona Barierowa</h4>
                            <p className="text-xs text-luxury-dark/90 font-light">Usunięcie resztek węgla i natychmiastowa aplikacja pielęgnacji wspierającej nawodnienie i równowagę hydrolipidową.</p>
                          </div>
                        </div>

                        {/* Karta Ceny i Parametrów */}
                        <div className="max-w-2xl mx-auto border border-luxury-sand bg-white p-6 md:p-8 rounded-sm text-center space-y-4 shadow-xs">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Procedura Zabiegowa
                          </span>
                          <h4 className="font-serif text-2xl font-light text-luxury-dark">
                            Laserowy Peeling Węglowy Black Doll
                          </h4>
                          <p className="text-xs text-luxury-dark/85 font-light">
                            Czas trwania: około 60 minut • Kwalifikacja, nałożenie emulsji węglowej, naświetlanie Q-Switch, wyciszenie barierowe.
                          </p>
                          <div className="text-3xl font-serif font-bold text-luxury-gold">
                            350 PLN
                          </div>
                          <div className="text-[11px] text-luxury-dark/80 italic">
                            Zalecenia domowe i fotoprotekcja dobierane indywidualnie do fototypu i parametrów lasera.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Terapie Skóry Twarzy Światłem LPL */}
                  {selectedTreatment.id === "terapie-swiatlem-lpl" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="lpl-therapies-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Zap className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Fotoodmładzanie • Naczynka • Przebarwienia • Skóra Trądzikowa
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Terapie Laserowe LPL — Światłoterapia Twarzy
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Zaawansowane terapie szerokopasmowym światłem pulsacyjnym LPL dobierane ściśle pod dominujący problem cery, fototyp i tolerancję tkanek. 4 wyspecjalizowane programy kliniczne.
                          </p>
                        </div>

                        {/* 4 Programy Kliniczne */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="border border-luxury-sand p-6 bg-white space-y-2 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold">Program I</span>
                              <span className="font-mono text-[9px] text-luxury-dark/60 uppercase">Koloryt & Struktura</span>
                            </div>
                            <h4 className="font-serif text-base font-medium text-luxury-dark">Fotoodmładzanie LPL</h4>
                            <p className="text-xs text-luxury-dark/90 font-light leading-relaxed">
                              Dla skóry z oznakami fotostarzenia, utratą świeżości, drobnymi zmianami pigmentacyjnymi i naczyniowymi. Poprawa gładkości, napięcia i przywrócenie naturalnego blasku cery.
                            </p>
                          </div>

                          <div className="border border-luxury-sand p-6 bg-white space-y-2 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold">Program II</span>
                              <span className="font-mono text-[9px] text-luxury-dark/60 uppercase">Rumień & Teleangiektazje</span>
                            </div>
                            <h4 className="font-serif text-base font-medium text-luxury-dark">Terapia Naczyniowa LPL</h4>
                            <p className="text-xs text-luxury-dark/90 font-light leading-relaxed">
                              Pochłanianie energii światła przez hemoglobinę. Ograniczenie widoczności pękniętych naczynek na nosie i policzkach oraz wyciszanie utrwalonego rumienia i zaczerwienienia.
                            </p>
                          </div>

                          <div className="border border-luxury-sand p-6 bg-white space-y-2 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold">Program III</span>
                              <span className="font-mono text-[9px] text-luxury-dark/60 uppercase">Plamy Posłoneczne & Piegi</span>
                            </div>
                            <h4 className="font-serif text-base font-medium text-luxury-dark">Terapia Przebarwień LPL</h4>
                            <p className="text-xs text-luxury-dark/90 font-light leading-relaxed">
                              Selektywne pochłanianie energii przez melaninę. Czasowe ściemnienie i mikrozłuszczenie plam posłonecznych oraz wyrównanie jednolitości pigmentacyjnej skóry.
                            </p>
                          </div>

                          <div className="border border-luxury-sand p-6 bg-white space-y-2 rounded-sm text-left shadow-xs hover:border-luxury-gold/60 transition-all">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold">Program IV</span>
                              <span className="font-mono text-[9px] text-luxury-dark/60 uppercase">Zmiany Zapalne & Sebum</span>
                            </div>
                            <h4 className="font-serif text-base font-medium text-luxury-dark">Terapia Skóry Trądzikowej LPL</h4>
                            <p className="text-xs text-luxury-dark/90 font-light leading-relaxed">
                              Wsparcie przy łagodnych i umiarkowanych zmianach trądzikowych, regulacja łojotoku oraz zmniejszenie zaczerwienienia pozapalnego naskórka.
                            </p>
                          </div>
                        </div>

                        {/* Tabela Cennika LPL */}
                        <div className="space-y-6 pt-2">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Kompletny Cennik Terapii Twarzy LPL
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Wizyty Indywidualne oraz Pakiety 3 Zabiegów
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Strefy */}
                            <div className="border border-luxury-sand bg-white p-6 md:p-8 rounded-sm space-y-4 text-left shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-1">
                                Cennik Obszarów Zabiegowych
                              </span>
                              <div className="space-y-2.5 divide-y divide-luxury-sand/40">
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-serif text-xs text-luxury-dark">Pojedyncza zmiana lub naczynko</span>
                                  <span className="font-serif text-sm font-bold text-luxury-gold">od 150 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-serif text-xs text-luxury-dark">Nos</span>
                                  <span className="font-serif text-sm font-bold text-luxury-gold">200 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-serif text-xs text-luxury-dark">Broda</span>
                                  <span className="font-serif text-sm font-bold text-luxury-gold">200 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-serif text-xs text-luxury-dark">Policzki</span>
                                  <span className="font-serif text-sm font-bold text-luxury-gold">300 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-serif text-xs text-luxury-dark font-medium">Cała twarz</span>
                                  <span className="font-serif text-sm font-bold text-luxury-gold">400 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-serif text-xs text-luxury-dark">Twarz i szyja</span>
                                  <span className="font-serif text-sm font-bold text-luxury-gold">550 PLN</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                  <span className="font-serif text-xs text-luxury-dark">Twarz, szyja i dekolt</span>
                                  <span className="font-serif text-sm font-bold text-luxury-gold">700 PLN</span>
                                </div>
                              </div>
                            </div>

                            {/* Pakiety 3 zabiegi */}
                            <div className="border-2 border-luxury-gold bg-luxury-gold/5 p-6 md:p-8 rounded-sm space-y-4 text-left flex flex-col justify-between shadow-md relative">
                              <div className="absolute top-0 right-0 bg-luxury-gold text-white font-mono text-[8px] tracking-widest uppercase px-3 py-1 font-bold">
                                Rabat Serii
                              </div>
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block mb-1">
                                  Pakiety Serii 3 Sesji
                                </span>
                                <h4 className="font-serif text-lg font-medium text-luxury-dark mb-4">
                                  Planowane po I zabiegu
                                </h4>
                                <div className="space-y-3 divide-y divide-luxury-gold/30">
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark font-medium">3 zabiegi — Cała twarz</span>
                                    <div className="text-right">
                                      <span className="font-serif text-sm font-bold text-luxury-dark">1080 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1200 PLN</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark font-medium">3 zabiegi — Twarz i szyja</span>
                                    <div className="text-right">
                                      <span className="font-serif text-sm font-bold text-luxury-dark">1485 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">1650 PLN</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-serif text-xs text-luxury-dark font-medium">3 zabiegi — Twarz, szyja i dekolt</span>
                                    <div className="text-right">
                                      <span className="font-serif text-sm font-bold text-luxury-dark">1890 PLN</span>
                                      <span className="block text-[9px] line-through text-luxury-dark/50">2100 PLN</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-3 bg-white/80 border border-luxury-gold/30 rounded-xs text-[10.5px] text-luxury-dark italic font-serif">
                                Pakiety najlepiej zaplanować po pierwszej wizycie i rzetelnej ocenie odpowiedzi biologicznej skóry na impulsy światła.
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Fotoepilacja LPL */}
                  {selectedTreatment.id === "fotoepilacja-lpl" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="lpl-photoepilation-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Długotrwała Redukcja • Komfort Skóry • Bez Wrastających Włosków
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Fotoepilacja LPL
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Stopniowa redukcja niechcianego owłosienia za pomocą kontrolowanych impulsów światła LPL. Bezpieczna, komfortowa alternatywa dla wosku i maszynki, likwidująca problem bolesnego wrastania włosków.
                          </p>
                        </div>

                        {/* Zasada Biologii Włosa */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <Activity className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Cykl Wzrostu Włosa • Transparentne Fakty
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              „Światło oddziałuje wyłącznie na włosy w aktywnej fazie wzrostu (anagenu). Dlatego trwała redukcja wymaga serii zabiegów.”
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Zawarta we włosie melanina pochłania energię i przekształca ją w ciepło oddziałujące na struktury mieszkowe. W kolejnych tygodniach część włosów wysuwa się z mieszków, a odrastające owłosienie staje się rzadsze i cieńsze.
                            </p>
                          </div>
                        </div>

                        {/* Kompletny Cennik Fotoepilacji LPL */}
                        <div className="space-y-6 pt-2">
                          <div className="text-center max-w-xl mx-auto space-y-2">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase block font-bold">
                              Cennik Stref i Pakietów Łączonych
                            </span>
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">
                              Cennik Fotoepilacji LPL
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {/* Twarz */}
                            <div className="p-5 bg-white border border-luxury-sand rounded-sm text-left space-y-3 shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Strefa: Twarz</span>
                              <div className="space-y-2 divide-y divide-luxury-sand/30 text-xs">
                                <div className="flex justify-between pt-1"><span>Wąsik</span><span className="font-bold text-luxury-gold">100 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Broda</span><span className="font-bold text-luxury-gold">120 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Baki</span><span className="font-bold text-luxury-gold">120 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Wąsik i broda</span><span className="font-bold text-luxury-gold">180 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Cała twarz</span><span className="font-bold text-luxury-gold">220 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Szyja lub kark</span><span className="font-bold text-luxury-gold">160 PLN</span></div>
                              </div>
                            </div>

                            {/* Ręce i Tułów */}
                            <div className="p-5 bg-white border border-luxury-sand rounded-sm text-left space-y-3 shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Ręce i Tułów</span>
                              <div className="space-y-2 divide-y divide-luxury-sand/30 text-xs">
                                <div className="flex justify-between pt-1"><span>Pachy</span><span className="font-bold text-luxury-gold">180 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Przedramiona</span><span className="font-bold text-luxury-gold">220 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Ramiona</span><span className="font-bold text-luxury-gold">220 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Całe ręce</span><span className="font-bold text-luxury-gold">350 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Linia brzucha</span><span className="font-bold text-luxury-gold">100 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Brzuch</span><span className="font-bold text-luxury-gold">250 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Klatka piersiowa</span><span className="font-bold text-luxury-gold">300 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Całe plecy</span><span className="font-bold text-luxury-gold">400 PLN</span></div>
                              </div>
                            </div>

                            {/* Nogi i Bikini */}
                            <div className="p-5 bg-white border border-luxury-sand rounded-sm text-left space-y-3 shadow-xs">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Nogi & Intymne</span>
                              <div className="space-y-2 divide-y divide-luxury-sand/30 text-xs">
                                <div className="flex justify-between pt-1"><span>Bikini płytkie</span><span className="font-bold text-luxury-gold">200 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Bikini głębokie</span><span className="font-bold text-luxury-gold">260 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Szpara międzypośladkowa</span><span className="font-bold text-luxury-gold">120 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Pośladki</span><span className="font-bold text-luxury-gold">250 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Łydki z kolanami</span><span className="font-bold text-luxury-gold">300 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Uda z kolanami</span><span className="font-bold text-luxury-gold">320 PLN</span></div>
                                <div className="flex justify-between pt-1"><span>Całe nogi</span><span className="font-bold text-luxury-gold">520 PLN</span></div>
                              </div>
                            </div>

                            {/* Pakiety Łączone */}
                            <div className="p-5 bg-luxury-gold/10 border-2 border-luxury-gold rounded-sm text-left space-y-3 shadow-md flex flex-col justify-between">
                              <div>
                                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">Pakiety Łączone</span>
                                <div className="space-y-2.5 divide-y divide-luxury-gold/30 text-xs pt-1">
                                  <div className="pt-1.5">
                                    <span className="font-serif block font-medium">Pachy + Bikini płytkie</span>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-luxury-dark">330 PLN</span>
                                      <span className="line-through text-[10px] text-luxury-dark/50">380 PLN</span>
                                    </div>
                                  </div>
                                  <div className="pt-1.5">
                                    <span className="font-serif block font-medium">Pachy + Bikini głębokie</span>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-luxury-dark">390 PLN</span>
                                      <span className="line-through text-[10px] text-luxury-dark/50">440 PLN</span>
                                    </div>
                                  </div>
                                  <div className="pt-1.5">
                                    <span className="font-serif block font-medium">Pachy + Bikini gł. + Łydki</span>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-luxury-dark">650 PLN</span>
                                      <span className="line-through text-[10px] text-luxury-dark/50">740 PLN</span>
                                    </div>
                                  </div>
                                  <div className="pt-1.5">
                                    <span className="font-serif block font-medium">Pachy + Bikini gł. + Całe nogi</span>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-luxury-dark">850 PLN</span>
                                      <span className="line-through text-[10px] text-luxury-dark/50">960 PLN</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-[10px] text-luxury-dark/80 italic pt-2">
                                Pakiety łączone obejmują obszary wykonywane podczas jednej wizyty.
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: HIFU — Lifting Ultradźwiękowy */}
                  {selectedTreatment.id === "hifu-ultrasound" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="hifu-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Technologie Liftingujące • Skoncentrowane Ultradźwięki
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            HIFU — Lifting Ultradźwiękowy
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            HIFU wykorzystuje skoncentrowane fale ultradźwiękowe, które dostarczają energię na określoną głębokość tkanek bez naruszania powierzchni skóry. Kontrolowane punkty termiczne uruchamiają procesy przebudowy, których rezultaty rozwijają się stopniowo w kolejnych tygodniach.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Kwalifikacja i Indywidualny Dobór Parametrów
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              Zabieg poprzedza rzetelna ocena anatomii i gotowości biologicznej
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Zabieg poprzedza kwalifikacja obejmująca ocenę kondycji skóry, grubości tkanki, anatomii obszaru oraz przeciwwskazań. Parametry i głębokość działania dobierane są indywidualnie — HIFU nie wykonuje się według jednego schematu u każdej osoby.
                            </p>
                          </div>
                        </div>

                        {/* Kiedy warto rozważyć HIFU vs Czego nie robi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          <div className="border border-luxury-sand bg-white p-6 rounded-sm text-left space-y-4 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Wskazania Anatomiczne
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Kiedy Warto Rozważyć HIFU?</h3>
                            <ul className="space-y-2.5 text-xs text-luxury-dark font-light">
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span>Przy utracie napięcia skóry twarzy i szyi</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span>Przy mniej wyraźnym owalu twarzy</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span>Przy opadaniu tkanek w okolicy policzków i linii żuchwy</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span>Przy wiotkości skóry szyi i dekoltu</span>
                              </li>
                              <li className="flex items-start gap-2.5">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span>Gdy oczekiwany jest stopniowy efekt bez zabiegu chirurgicznego</span>
                              </li>
                            </ul>
                          </div>

                          <div className="border border-luxury-gold/40 bg-luxury-cream/15 p-6 rounded-sm text-left space-y-4 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Uczciwe Granice Metody
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Zasada Przygotowania Skóry</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              HIFU nie jest zabiegiem przeznaczonym do poprawiania nawodnienia, kolorytu ani kondycji bariery naskórkowej. Jeżeli skóra wymaga najpierw przygotowania lub regeneracji, technologia może zostać włączona na późniejszym etapie indywidualnego planu.
                            </p>
                            <div className="p-3 bg-white border border-luxury-sand/50 rounded-xs text-[11px] text-luxury-dark/90 italic font-serif">
                              „Nie należy obiecywać «liftingu bez skalpela» jako odpowiednika operacji. Zakres rezultatu zależy od anatomii, stopnia wiotkości i wieku biologicznego tkanek.”
                            </div>
                          </div>
                        </div>

                        {/* Parametry i Cennik */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-4">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Warunki Procedury
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Czas Trwania i Inwestycja
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Czas trwania</span>
                              <span className="font-serif text-base text-luxury-dark font-medium">około 60–90 minut</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Cena procedury</span>
                              <span className="font-serif text-base text-luxury-gold font-bold">600–800 PLN</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Kwalifikacja</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium">Indywidualny dobór parametrów</span>
                            </div>
                          </div>
                        </div>

                        {/* Umów konsultację do zabiegu HIFU */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/50 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-center space-y-4 shadow-xs">
                          <h4 className="font-serif text-xl font-medium text-luxury-dark">Umów Konsultację do Zabiegu HIFU</h4>
                          <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto leading-relaxed">
                            Podczas konsultacji oceniane jest, czy HIFU będzie właściwą metodą dla Twojej skóry, czy korzystniejsze będzie zastosowanie innej technologii albo terapii łączonej.
                          </p>
                          <button 
                            onClick={() => {
                              setBookingTreatment(selectedTreatment);
                              setBookingConfirmed(false);
                              setBookingName("");
                              setBookingEmail("");
                              setBookingPhone("");
                              setBookingDate("");
                            }}
                            className="px-8 py-4 bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white text-xs font-mono tracking-widest uppercase transition-all font-bold cursor-pointer shadow-sm inline-block"
                          >
                            UMÓW KONSULTACJĘ DO ZABIEGU HIFU
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Radiofrekwencja mikroigłowa */}
                  {selectedTreatment.id === "rf-microneedling" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="rf-microneedling-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Technologie Liftingujące • Mikronakłuwanie • Energia RF
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Radiofrekwencja Mikroigłowa
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Radiofrekwencja mikroigłowa to zaawansowana technologia łącząca kontrolowane mikronakłuwanie z działaniem energii fali radiowej. Sterylne mikroigły docierają na indywidualnie dobraną głębokość, a następnie przekazują energię RF bezpośrednio do wybranej warstwy tkanki.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Mechanizm Podwójnego Bodźca
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              Mikronakłucia + Kontrolowane Ogrzanie Tkanki Falami Radiowymi
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Mikronakłucia inicjują naturalną odpowiedź naprawczą, natomiast energia radiowa powoduje kontrolowane ogrzanie tkanki. Połączenie tych dwóch bodźców wspiera procesy związane z produkcją kolagenu i elastyny oraz stopniową przebudowę skóry.
                            </p>
                          </div>
                        </div>

                        {/* Wskazania i Przygotowanie */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          <div className="border border-luxury-sand bg-white p-6 rounded-sm text-left space-y-4 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Wskazania do Procedury
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Kiedy Warto Rozważyć RF?</h3>
                            <ul className="space-y-2 text-xs text-luxury-dark font-light">
                              <li className="flex items-start gap-2.5"><span className="text-luxury-gold font-bold">•</span><span>Przy utracie jędrności i napięcia skóry</span></li>
                              <li className="flex items-start gap-2.5"><span className="text-luxury-gold font-bold">•</span><span>Przy drobnych zmarszczkach</span></li>
                              <li className="flex items-start gap-2.5"><span className="text-luxury-gold font-bold">•</span><span>Przy nierównej strukturze i rozszerzonych porach</span></li>
                              <li className="flex items-start gap-2.5"><span className="text-luxury-gold font-bold">•</span><span>Przy bliznach potrądzikowych</span></li>
                              <li className="flex items-start gap-2.5"><span className="text-luxury-gold font-bold">•</span><span>Przy wiotkości skóry twarzy, szyi lub dekoltu</span></li>
                              <li className="flex items-start gap-2.5"><span className="text-luxury-gold font-bold">•</span><span>Gdy celem jest poprawa gęstości i ogólnej jakości skóry</span></li>
                              <li className="flex items-start gap-2.5"><span className="text-luxury-gold font-bold">•</span><span>Przy rozstępach i bliznach w innych obszarach ciała</span></li>
                            </ul>
                          </div>

                          <div className="border border-luxury-gold/40 bg-luxury-cream/15 p-6 rounded-sm text-left space-y-4 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Przygotowanie Skóry
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Ocena Aktualnej Gotowości</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Skóra powinna być odpowiednio przygotowana do kontrolowanego mikronakłuwania i działania energii RF. Jeżeli jej bariera jest osłabiona, występuje aktywny stan zapalny, nadmierna reaktywność lub zaburzenia gojenia, pierwszym etapem może być przywrócenie jej podstawowych warunków równowagi.
                            </p>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Dopiero po ocenie aktualnej gotowości skóry podejmowana jest decyzja o wykonaniu zabiegu, dobraniu parametrów lub przesunięciu procedury na późniejszy etap.
                            </p>
                          </div>
                        </div>

                        {/* Parametry i Cennik */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-4">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Warunki Procedury
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Czas Trwania i Cennik
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Czas trwania</span>
                              <span className="font-serif text-base text-luxury-dark font-medium">około 90 minut</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Cena procedury</span>
                              <span className="font-serif text-base text-luxury-gold font-bold">500–700 PLN</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Podstawa zabiegu</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium">Kwalifikacja i indywidualny dobór parametrów</span>
                            </div>
                          </div>
                        </div>

                        {/* Umów konsultację do radiofrekwencji mikroigłowej */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/50 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-center space-y-4 shadow-xs">
                          <h4 className="font-serif text-xl font-medium text-luxury-dark">Umów Konsultację</h4>
                          <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto leading-relaxed">
                            Podczas konsultacji ocenione zostanie, czy radiofrekwencja mikroigłowa jest właściwą metodą dla Twojej skóry, jakie parametry można bezpiecznie zastosować oraz czy przed zabiegiem potrzebne jest jej wcześniejsze przygotowanie.
                          </p>
                          <button 
                            onClick={() => {
                              setBookingTreatment(selectedTreatment);
                              setBookingConfirmed(false);
                              setBookingName("");
                              setBookingEmail("");
                              setBookingPhone("");
                              setBookingDate("");
                            }}
                            className="px-8 py-4 bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white text-xs font-mono tracking-widest uppercase transition-all font-bold cursor-pointer shadow-sm inline-block"
                          >
                            UMÓW KONSULTACJĘ DO RADIOFREKWENCJI MIKROIGŁOWEJ
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Neurolifting — Elektrostymulacja Mięśniowo-Powięziowa Twarzy */}
                  {selectedTreatment.id === "neurolifting-face" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="neurolifting-face-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Lifting i Praca z Napięciem Mięśniowym • Częstotliwości Nogiera
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Neurolifting — Elektrostymulacja Mięśniowo-Powięziowa Twarzy
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Specjalistyczny zabieg kosmetologiczny łączący precyzyjną elektrostymulację za pomocą cienkich, jednorazowych igieł z pracą nad układem mięśniowo-powięziowym twarzy. Podczas zabiegu wykorzystywane są programy impulsowe oparte na częstotliwościach Nogiera.
                          </p>
                        </div>

                        {/* Zasada Działania u Źródła */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Praca z Układem Mięśniowo-Powięziowym
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              Poprawa równowagi pomiędzy obszarami osłabionymi i nadmiernie napiętymi
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Celem zabiegu nie jest jednakowe pobudzenie wszystkich mięśni, lecz poprawa równowagi pomiędzy obszarami osłabionymi i nadmiernie napiętymi. Pozwala to wspierać naturalne ułożenie tkanek, wyrazistość owalu oraz bardziej harmonijny i wypoczęty wygląd twarzy bez zamrażania mimiki.
                            </p>
                          </div>
                        </div>

                        {/* Częstotliwości Nogiera & Układ Mięśniowo-Powięziowy */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          <div className="border border-luxury-sand bg-white p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Podstawa Fizyczna
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Częstotliwości Nogiera</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              W neuroliftingu wykorzystywane są programy impulsowe oparte na częstotliwościach opisanych przez francuskiego lekarza Paula Nogiera. Pozwalają one różnicować charakter elektrostymulacji i dopasowywać ją do celu pracy w danym obszarze.
                            </p>
                            <p className="text-[11px] text-luxury-dark/80 italic font-serif">
                              Częstotliwość, intensywność i czas działania dobierane są indywidualnie. Nie oznacza to leczenia układu nerwowego ani regenerowania nerwów — częstotliwości Nogiera stanowią element technicznego sposobu prowadzenia elektrostymulacji.
                            </p>
                          </div>

                          <div className="border border-luxury-sand bg-white p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Architektura Napięć
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Układ Mięśniowo-Powięziowy</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Mięśnie twarzy nie działają oddzielnie. Współpracują z powięzią, więzadłami i tkanką podskórną, tworząc układ wzajemnie zależnych napięć. Nadmierne napięcie w jednej okolicy może wpływać na mimikę, symetrię oraz ułożenie tkanek w innych częściach twarzy.
                            </p>
                            <p className="text-[11px] text-luxury-dark/80 italic font-serif">
                              Zależnie od potrzeb elektrostymulacja może zostać uzupełniona odpowiednio dobranymi technikami manualnymi.
                            </p>
                          </div>
                        </div>

                        {/* Co wyróżnia neurolifting */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-4">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Wyróżniki Metody
                          </span>
                          <h3 className="font-serif text-xl font-light text-luxury-dark">Co Wyróżnia Neurolifting?</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-luxury-dark font-light">
                            <div className="flex items-center gap-2 p-2.5 bg-luxury-sand/15 rounded-xs">
                              <span className="text-luxury-gold font-bold">✓</span>
                              <span>Indywidualna analiza mimiki i napięcia tkanek</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-luxury-sand/15 rounded-xs">
                              <span className="text-luxury-gold font-bold">✓</span>
                              <span>Praca z twarzą jako układem mięśniowo-powięziowym</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-luxury-sand/15 rounded-xs">
                              <span className="text-luxury-gold font-bold">✓</span>
                              <span>Precyzyjne zastosowanie cienkich, jednorazowych igieł</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-luxury-sand/15 rounded-xs">
                              <span className="text-luxury-gold font-bold">✓</span>
                              <span>Wykorzystanie programów opartych na częstotliwościach Nogiera</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-luxury-sand/15 rounded-xs">
                              <span className="text-luxury-gold font-bold">✓</span>
                              <span>Różnicowanie pracy pomiędzy obszarami osłabionymi i spiętymi</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 bg-luxury-sand/15 rounded-xs">
                              <span className="text-luxury-gold font-bold">✓</span>
                              <span>Możliwość połączenia elektrostymulacji z technikami manualnymi</span>
                            </div>
                          </div>
                          <div className="pt-2 text-xs text-luxury-dark/90 font-mono">
                            Czas trwania: <strong>około 45–60 minut</strong> • Podstawa: <strong>analiza mięśniowo-powięziowa i indywidualny dobór parametrów</strong>
                          </div>
                        </div>

                        {/* Umów konsultację do neuroliftingu */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/50 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-center space-y-4 shadow-xs">
                          <h4 className="font-serif text-xl font-medium text-luxury-dark">Umów Konsultację</h4>
                          <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto leading-relaxed">
                            Podczas konsultacji ocenione zostaną mimika, symetria oraz układ napięć mięśniowo-powięziowych. Na tej podstawie ustalane są punkty pracy, rodzaj częstotliwości i intensywność elektrostymulacji.
                          </p>
                          <button 
                            onClick={() => {
                              setBookingTreatment(selectedTreatment);
                              setBookingConfirmed(false);
                              setBookingName("");
                              setBookingEmail("");
                              setBookingPhone("");
                              setBookingDate("");
                            }}
                            className="px-8 py-4 bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white text-xs font-mono tracking-widest uppercase transition-all font-bold cursor-pointer shadow-sm inline-block"
                          >
                            UMÓW KONSULTACJĘ DO NEUROLIFTINGU
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Masaż termiczny Ceragem */}
                  {selectedTreatment.id === "ceragem-thermal-massage" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="ceragem-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              Ceragem VE (model CGM MB-1101) • Termoterapia & Relaks Pleców
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Masaż Termiczny Ceragem
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Ciepło i masaż dopasowane do Twoich pleców. Plecy towarzyszą Ci przez cały dzień — podczas pracy, ruchu i odpoczynku. Kiedy pojawia się napięcie lub sztywność, warto dać im chwilę uwagi.
                          </p>
                        </div>

                        {/* Zasada działania & Urządzenie Ceragem VE */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/40 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-6">
                          <div className="w-full h-64 sm:h-80 md:h-96 rounded-xs overflow-hidden border border-luxury-gold/30 shadow-md relative">
                            <img
                              src="/src/assets/images/ceragem_thermal_bed_therapy_1791108980537.jpg"
                              alt="Terapia masażu termicznego na łóżku Ceragem VE z projekcją ciepła jadeitowego"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white font-mono text-[9px] px-2.5 py-1 rounded-xs border border-white/20">
                              Ceragem VE (model CGM MB-1101) • Termoterapia jadeitowa &amp; skanowanie krzywizny kręgosłupa
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-luxury-gold text-white flex items-center justify-center shrink-0 shadow-md">
                              <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Automatyczne Łóżko do Masażu Termicznego
                              </span>
                              <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                                Ceragem VE, model CGM MB-1101
                              </h4>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                Przed rozpoczęciem programu urządzenie rozpoznaje długość pleców, a następnie dopasowuje do niej ruch elementów masujących. Ich intensywność oraz temperaturę można regulować zgodnie z Twoimi odczuciami.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 2 Kolumny: Jak działa masaż termiczny? & Chwila dla ciała i zmysłów */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          <div className="border border-luxury-sand bg-white p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Mechanizm Działania
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Jak działa masaż termiczny?</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Podczas sesji leżysz wygodnie, a ogrzewane elementy przesuwają się wzdłuż pleców. Łagodne ciepło i rytmiczny nacisk pomagają rozluźnić spięte mięśnie, zmniejszyć uczucie sztywności i przynieść czasową ulgę przy łagodnych dolegliwościach mięśni oraz stawów. Tak producent opisuje przeznaczenie modelu CGM MB-1101.
                            </p>
                            <p className="text-[11px] text-luxury-dark/80 italic font-serif">
                              Masaż nie musi być za każdym razem taki sam. Urządzenie oferuje różne programy, a intensywność pracy można dobrać do Twoich potrzeb — od delikatniejszego masażu sprzyjającego odprężeniu po mocniej odczuwalny nacisk.
                            </p>
                          </div>

                          <div className="border border-luxury-gold/40 bg-luxury-cream/15 p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Atmosfera Gabinetu
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Chwila dla ciała i zmysłów</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              W moim gabinecie sesji towarzyszą spokojna muzyka i delikatna aromaterapia. Ciepło otula plecy, masaż pomaga uwolnić nagromadzone napięcie, a atmosfera pozwala na moment zwolnić. Możesz zamknąć oczy, odpocząć i skupić się wyłącznie na tym, jak się czujesz.
                            </p>
                            <div className="p-3 bg-white border border-luxury-sand/50 rounded-xs text-[11px] text-luxury-dark/90 italic font-serif">
                              Zapach oraz ustawienia masażu dobieramy do Twojego komfortu. Jeśli wolisz sesję bez aromaterapii, wystarczy mi o tym powiedzieć.
                            </div>
                          </div>
                        </div>

                        {/* Kiedy warto wybrać sesję Ceragem? */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-4">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Wskazania i Samopoczucie
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Kiedy warto wybrać sesję Ceragem?
                          </h3>
                          <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                            Masaż termiczny może być dobrym wyborem, gdy czujesz napięcie pleców po pracy, sztywność po długim siedzeniu albo zmęczenie mięśni po aktywnym dniu. Możesz też skorzystać z niego po prostu po to, by znaleźć regularny czas na odpoczynek.
                          </p>
                          <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm text-xs text-luxury-dark/95 font-light space-y-1">
                            <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Dbałość o Twoje bezpieczeństwo:</span>
                            <p>
                              Przed pierwszą sesją krótko porozmawiamy o Twoim samopoczuciu i dobierzemy ustawienia. Jeśli masz silny lub niewyjaśniony ból pleców, świeży uraz, zaburzenia czucia ciepła albo jesteś po operacji kręgosłupa, powiedz mi o tym przed rozpoczęciem masażu.
                            </p>
                          </div>
                        </div>

                        {/* Parametry i Cennik */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-4">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Warunki Sesji
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Czas Trwania i Cennik
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Czas trwania</span>
                              <span className="font-serif text-base text-luxury-dark font-medium">około 36 minut</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Cena sesji</span>
                              <span className="font-serif text-base text-luxury-gold font-bold">50 PLN</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Atmosfera</span>
                              <span className="font-serif text-xs text-luxury-dark font-medium">Aromaterapia i muzyka relaksacyjna</span>
                            </div>
                          </div>
                        </div>

                        {/* Przycisk rezerwacji Ceragem */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/50 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-center space-y-4 shadow-xs">
                          <h4 className="font-serif text-xl font-medium text-luxury-dark">Podaruj swoim plecom ciepło, ruch i chwilę wytchnienia</h4>
                          <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto leading-relaxed">
                            Zarezerwuj sesję masażu termicznego Ceragem VE (model CGM MB-1101) w gabinecie Slow Skin Concept™.
                          </p>
                          <button 
                            onClick={() => {
                              setBookingTreatment(selectedTreatment);
                              setBookingConfirmed(false);
                              setBookingName("");
                              setBookingEmail("");
                              setBookingPhone("");
                              setBookingDate("");
                            }}
                            className="px-8 py-4 bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white text-xs font-mono tracking-widest uppercase transition-all font-bold cursor-pointer shadow-sm inline-block"
                          >
                            UMÓW MASAŻ TERMICZNY CERAGEM (50 ZŁ)
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Rozszerzona monografia: Terapia Sygnałem Pulsacyjnym PST */}
                  {selectedTreatment.id === "pst-signal-therapy" && (
                    <div className="space-y-16 pt-8 pb-4 border-t border-luxury-sand/30" id="pst-detailed-monograph">
                      <div className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-luxury-gold uppercase font-bold">
                              PST H-200 & PST H-300 • Regeneracja Stawów i Kręgosłupa
                            </span>
                          </div>
                          <h2 className="font-serif text-3xl md:text-4xl font-light text-luxury-dark">
                            Terapia Sygnałem Pulsacyjnym PST
                          </h2>
                          <div className="w-16 h-[1px] bg-luxury-gold/60 mx-auto" />
                          <p className="text-xs md:text-sm text-luxury-dark font-serif italic max-w-2xl mx-auto leading-relaxed">
                            Więcej swobody w ruchu. Kiedy bolą stawy lub kręgosłup, zaczynasz zwracać uwagę na ruchy, które wcześniej były naturalne: wchodzenie po schodach, spacer, schylanie się czy powrót do ulubionej aktywności.
                          </p>
                        </div>

                        {/* Cel i sedno terapii */}
                        <div className="bg-luxury-sand/15 border border-luxury-sand/60 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left flex flex-col md:flex-row items-center gap-6 shadow-xs">
                          <div className="w-16 h-16 rounded-full bg-luxury-dark text-white flex items-center justify-center shrink-0 shadow-md">
                            <ShieldCheck className="w-8 h-8 text-luxury-gold" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Praktyczny Cel Współpracy
                            </span>
                            <h4 className="font-serif text-base md:text-lg font-medium text-luxury-dark">
                              Mniejszy ból, swobodniejszy ruch i większy komfort każdego dnia
                            </h4>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Terapia Sygnałem Pulsacyjnym PST jest nieinwazyjną metodą, którą można włączyć jako wsparcie przy wybranych dolegliwościach układu ruchu. Pracujemy z myślą o tym, co ma dla Ciebie praktyczne znaczenie: mniejszym bólu, swobodniejszym ruchu i większym komforcie w codziennym życiu.
                            </p>
                          </div>
                        </div>

                        {/* 2 Kolumny: Na czym polega terapia? & Dwa urządzenia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          <div className="border border-luxury-sand bg-white p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Mechanizm Biofizyczny
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Na czym polega terapia?</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              PST wykorzystuje pulsujące pole elektromagnetyczne. Sygnał jest przekazywany do wybranego obszaru ciała przez aplikator urządzenia. Zabieg nie narusza skóry i nie wymaga użycia igieł.
                            </p>
                            <p className="text-[11px] text-luxury-dark/85 leading-relaxed bg-[#fbf9f6] p-3 border border-luxury-sand/40 rounded-xs">
                              Podczas sesji odpoczywasz w wygodnej pozycji przez <strong>około 60 minut</strong>. Działanie urządzenia jest zwykle niewyczuwalne, więc ten czas możesz po prostu przeznaczyć na spokojny odpoczynek.
                            </p>
                          </div>

                          <div className="border border-luxury-sand bg-white p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Aparatura w Gabinecie
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Dwa urządzenia, różne obszary</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              W naszym gabinecie korzystam z oryginalnych, certyfikowanych aparatów medycznych <strong>PST H-200</strong> i <strong>PST H-300</strong>:
                            </p>
                            <ul className="text-xs text-luxury-dark/90 space-y-2 pt-1 font-light">
                              <li className="flex items-start gap-2">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span><strong>PST H-200</strong>: praca w obrębie stawów kończyn (dłonie, nadgarstki, łokcie, kolana, stawy skokowe, stopy) w komfortowej pozycji siedzącej.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-luxury-gold font-bold">•</span>
                                <span><strong>PST H-300</strong>: obejmowanie większych obszarów (okolice kręgosłupa, bioder i barków) na leżance zabiegowej z tunelem łukowym.</span>
                              </li>
                            </ul>
                            <p className="text-[11px] text-luxury-dark/80 italic font-serif pt-1">
                              Urządzenie dobieram po rozmowie o Twoich dolegliwościach i precyzyjnym ustaleniu obszaru, który ma zostać objęty terapią.
                            </p>
                          </div>
                        </div>

                        {/* Prezentacja zdjęć aparatury gabinetowej: PST H-300 i PST H-200 */}
                        <div className="space-y-4 max-w-4xl mx-auto text-left pt-2">
                          <div className="border-b border-luxury-sand pb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                                Rzeczywiste Urządzenia w Naszym Gabinecie
                              </span>
                              <h3 className="font-serif text-2xl font-light text-luxury-dark">
                                Autentyczne stanowiska zabiegowe PST
                              </h3>
                            </div>
                            <span className="font-mono text-[9px] text-luxury-gold font-semibold uppercase">
                              Klasyczny model medyczny PST
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                            {/* Karta PST H-300: Kręgosłup & Biodra */}
                            <div className="border border-luxury-sand bg-white p-4 rounded-sm shadow-xs space-y-3 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="aspect-[16/10] overflow-hidden bg-luxury-sand border border-luxury-sand/50 relative rounded-xs group">
                                  <img 
                                    src="/src/assets/images/pst_couch_bed_therapy_1791109628792.jpg"
                                    alt="Aparat PST H-300 — leżanka zabiegowa do regeneracji kręgosłupa i stawów biodrowych"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute top-2 left-2 bg-luxury-dark/90 text-luxury-gold font-mono text-[8px] px-2 py-0.5 uppercase tracking-wider font-bold border border-luxury-gold/40">
                                    PST H-300 • Kręgosłup & Biodra
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="font-serif text-lg text-luxury-dark font-medium">Aparat PST H-300 — Stanowisko leżące</h4>
                                  <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                    Szeroki aplikator tunelowy/łukowy obejmujący odcinek lędźwiowy, piersiowy, szyjny kręgosłupa, miednicę, biodra i barki. Klasyczna metalowa konsola sterująca umieszczona w leżance emituje impulsy PST, zapewniając pełen relaks.
                                  </p>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-luxury-sand/30 font-mono text-[10px] text-luxury-gold flex items-center justify-between">
                                <span>Obszar: kręgosłup, biodra, miednica, barki</span>
                                <span>Sesja: ok. 60 min</span>
                              </div>
                            </div>

                            {/* Karta PST H-200: Stawy Kończyn */}
                            <div className="border border-luxury-sand bg-white p-4 rounded-sm shadow-xs space-y-3 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="aspect-[16/10] overflow-hidden bg-luxury-sand border border-luxury-sand/50 relative rounded-xs group">
                                  <img 
                                    src="/src/assets/images/pst_chair_therapy_1791109644424.jpg"
                                    alt="Aparat PST H-200 — sesja w fotelu na stawy obwodowe (kolana, stopy, dłonie, łokcie)"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute top-2 left-2 bg-luxury-dark/90 text-luxury-gold font-mono text-[8px] px-2 py-0.5 uppercase tracking-wider font-bold border border-luxury-gold/40">
                                    PST H-200 • Stawy Kończyn & Kolana
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  <h4 className="font-serif text-lg text-luxury-dark font-medium">Aparat PST H-200 — Stanowisko w fotelu</h4>
                                  <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                                    Mobilny aplikator pierścieniowy na kółkach ze stolikową medyczną konsolą sterującą wyposażoną w analogowe wskaźniki i przyciski. Precyzyjnie obejmuje staw kolanowy, skokowy, łokieć, dłoń czy stopę.
                                  </p>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-luxury-sand/30 font-mono text-[10px] text-luxury-gold flex items-center justify-between">
                                <span>Obszar: kolana, stopy, dłonie, łokcie</span>
                                <span>Sesja: ok. 60 min</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Kiedy warto zapytać o PST? & Jak wygląda seria zabiegów */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                          <div className="bg-white border border-luxury-sand p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Wskazania do Terapii
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Kiedy warto zapytać o PST?</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              PST można rozważyć, gdy ból lub sztywność stawów ograniczają Twoją aktywność, ruch stał się mniej swobodny albo dolegliwości powracają przy codziennym obciążeniu.
                            </p>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Terapia bywa stosowana także jako uzupełnienie postępowania przy zmianach zwyrodnieniowych oraz wybranych przeciążeniach i stanach po urazach.
                            </p>
                            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xs text-[11px] text-amber-900 leading-relaxed font-light">
                              <strong>Ważne:</strong> Jeżeli dolegliwości pojawiły się nagle, są silne lub wynikają ze świeżego urazu, najpierw trzeba ustalić ich przyczynę u lekarza.
                            </div>
                          </div>

                          <div className="bg-white border border-luxury-sand p-6 rounded-sm text-left space-y-3 shadow-xs">
                            <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                              Planowanie Cyklu
                            </span>
                            <h3 className="font-serif text-xl font-light text-luxury-dark">Jak wygląda seria zabiegów?</h3>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Terapię planuje się zwykle jako <strong>serię 9 lub 12 sesji</strong>. Zabiegi odbywają się w bliskich odstępach, dlatego przed rozpoczęciem ustalamy terminy całego cyklu.
                            </p>
                            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                              Liczba sesji zależy od obszaru terapii i indywidualnej sytuacji; nie przypisuję jej automatycznie do nazwy stawu czy rozpoznania.
                            </p>
                            <p className="text-[11px] text-luxury-dark/80 italic font-serif">
                              W trakcie serii zwracamy uwagę na to, jak zmieniają się ból, sztywność i swoboda ruchu oraz czy łatwiej Ci wykonywać czynności, które skłoniły Cię do rozpoczęcia terapii.
                            </p>
                          </div>
                        </div>

                        {/* Konsultacja przed pierwszą sesją */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-4">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Bezpieczeństwo & Wywiad Medyczny
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Konsultacja przed pierwszą sesją
                          </h3>
                          <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                            Zanim rozpoczniemy zabiegi, rozmawiamy o Twoim stanie zdrowia, rozpoznaniu, przebytych urazach i operacjach, aktualnym leczeniu oraz implantach. Szczególnej oceny wymagają między innymi: ciąża, aktywna choroba nowotworowa, rozrusznik serca lub inny implant elektroniczny, infekcja, poważna choroba serca oraz świeży uraz.
                          </p>
                          <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm text-xs text-luxury-dark/95 font-light space-y-1.5">
                            <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold">Implanty i endoprotezy:</span>
                            <p>
                              Endoproteza lub metalowy implant nie musi automatycznie wykluczać PST. Trzeba jednak znać rodzaj i położenie implantu oraz sprawdzić zalecenia dotyczące urządzenia. W niektórych sytuacjach przed rozpoczęciem terapii poproszę Cię o konsultację z lekarzem lub fizjoterapeutą.
                            </p>
                          </div>
                        </div>

                        {/* Parametry i Cennik PST */}
                        <div className="bg-white border border-luxury-sand p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-left shadow-xs space-y-4">
                          <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-bold block">
                            Inwestycja w Zdrowie Narządu Ruchu
                          </span>
                          <h3 className="font-serif text-2xl font-light text-luxury-dark">
                            Cennik Terapii PST
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm text-center">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Pojedyncza sesja</span>
                              <span className="font-serif text-xl text-luxury-dark font-medium block">110 PLN</span>
                              <span className="text-[10px] text-luxury-dark/70 font-mono">około 60 minut</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-gold/50 rounded-sm text-center">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Seria 9 zabiegów</span>
                              <span className="font-serif text-xl text-luxury-gold font-bold block">990 PLN</span>
                              <span className="text-[10px] text-luxury-dark/70 font-mono">rekomendowany cykl</span>
                            </div>
                            <div className="p-4 bg-luxury-sand/15 border border-luxury-sand/50 rounded-sm text-center">
                              <span className="font-mono text-[10px] text-luxury-gold uppercase block font-bold mb-1">Seria 12 zabiegów</span>
                              <span className="font-serif text-xl text-luxury-dark font-bold block">1320 PLN</span>
                              <span className="text-[10px] text-luxury-dark/70 font-mono">kompleksowy cykl</span>
                            </div>
                          </div>
                          <p className="text-xs text-luxury-dark/85 font-light pt-2 italic">
                            Przed wyborem serii spotykamy się na konsultacji, aby omówić Twoje dolegliwości, ustalić obszar terapii i sprawdzić, czy PST będzie odpowiednia dla Ciebie.
                          </p>
                        </div>

                        {/* Przycisk rezerwacji PST */}
                        <div className="bg-luxury-gold/10 border border-luxury-gold/50 p-6 md:p-8 rounded-sm max-w-4xl mx-auto text-center space-y-4 shadow-xs">
                          <h4 className="font-serif text-xl font-medium text-luxury-dark">Chcesz poruszać się z większą swobodą?</h4>
                          <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto leading-relaxed">
                            Skontaktuj się ze mną i umów konsultację kwalifikacyjną przed rozpoczęciem Terapii Sygnałem Pulsacyjnym PST.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                            <button 
                              onClick={() => {
                                setBookingTreatment(selectedTreatment);
                                setBookingConfirmed(false);
                                setBookingName("");
                                setBookingEmail("");
                                setBookingPhone("");
                                setBookingDate("");
                              }}
                              className="px-8 py-4 bg-luxury-dark text-white hover:bg-luxury-gold hover:text-white text-xs font-mono tracking-widest uppercase transition-all font-bold cursor-pointer shadow-sm"
                            >
                              UMÓW KONSULTACJĘ PRZED ROZPOCZĘCIEM TERAPII PST
                            </button>
                          </div>
                          <div className="text-[10px] font-mono text-luxury-dark/70 pt-2">
                            Materiały i standardy źródłowe: PST Polska (pst-polska.pl) • Active Spine • A-Med Klinika
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Chamber Protocol Steps: Timeline */}
                  <div className="bg-white border border-luxury-sand p-8 md:p-12 space-y-8">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                      <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center justify-center gap-2">
                        <Dna className="w-4 h-4 text-luxury-gold" /> Autorskie Fazy Zabiegu Slow Skin Concept™
                      </span>
                      <h3 className="font-serif text-2xl font-light text-luxury-dark font-normal">Przebieg Rytuału w Gabinecie</h3>
                      <p className="text-xs text-luxury-dark/90 font-light">
                        Przekonaj się, jak krok po kroku prowadzona jest precyzyjna stymulacja neuronów i odnowa biochemiczna Twojej skóry podczas sesji:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                      {selectedTreatment.protocolSteps.map((step, idx) => (
                        <div key={idx} className="border border-luxury-sand p-5 space-y-3 bg-luxury-cream/10 relative" id={`subpage-step-${idx}`}>
                          <span className="font-mono text-[9px] text-luxury-gold/75 uppercase tracking-widest block">{step.phase}</span>
                          <p className="text-xs text-luxury-dark font-light leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment FAQ Accordion Section */}
                  <TreatmentFAQ faqList={selectedTreatment.faq || []} />

                  {/* Bottom booking CTA board */}
                  <div className="border-2 border-luxury-gold p-8 md:p-12 text-center bg-white space-y-6 max-w-2xl mx-auto">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-luxury-gold uppercase block animate-pulse">Kameralne Doświadczenie</span>
                    <h3 className="font-serif text-3xl font-light text-luxury-dark uppercase">Przejdź Odnowę Komórkową SLOW SKIN CONCEPT</h3>
                    <p className="text-xs text-luxury-dark/95 font-light max-w-md mx-auto leading-relaxed">
                      Zarezerwuj swój termin na rytuał <span className="font-serif italic font-semibold text-luxury-gold">{selectedTreatment.title}</span>. Nasza diagnostka skontaktuje się z Tobą w celu uzgodnienia intymnej, spersonalizowanej godziny wizyty.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-mono text-[11px] text-luxury-dark/95 pb-2">
                      <span>Cena rytuału: <strong className="text-luxury-gold text-xs font-bold">{selectedTreatment.price}</strong></span>
                      <span className="hidden sm:inline-block text-luxury-sand">•</span>
                      <span>Seans gabinetowy: {selectedTreatment.duration}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setBookingTreatment(selectedTreatment);
                        setBookingConfirmed(false);
                        setBookingName("");
                        setBookingEmail("");
                        setBookingPhone("");
                        setBookingDate("");
                      }}
                      className="px-8 py-4 bg-luxury-dark text-white hover:bg-luxury-gold hover:text-white text-xs font-mono tracking-widest uppercase transition-all font-bold cursor-pointer"
                    >
                      {selectedTreatment.id === "hifu-ultrasound"
                        ? "UMÓW KONSULTACJĘ DO ZABIEGU HIFU"
                        : selectedTreatment.id === "rf-microneedling"
                        ? "UMÓW KONSULTACJĘ DO RADIOFREKWENCJI MIKROIGŁOWEJ"
                        : selectedTreatment.id === "neurolifting-face"
                        ? "UMÓW KONSULTACJĘ DO NEUROLIFTINGU"
                        : selectedTreatment.id === "ceragem-thermal-massage"
                        ? "UMÓW MASAŻ TERMICZNY CERAGEM"
                        : selectedTreatment.id === "pst-signal-therapy"
                        ? "UMÓW KONSULTACJĘ / TERAPIĘ PST"
                        : selectedTreatment.id === "carboksyterapia-carboregen"
                        ? "UMÓW ZABIEG CARBOREGEN W KALENDARZU"
                        : "Wybierz termin i zarezerwuj wizytę"}
                    </button>
                  </div>

                </div>
              ) : (
                /* MAIN CLINICAL TREATMENTS LIST PAGE (LIST OF ALL THERAPIES) */
                <FacialTreatmentsPage
                  treatments={TREATMENTS}
                  selectedCategory={selectedTreatmentCategory}
                  onSelectCategory={(cat) => setSelectedTreatmentCategory(cat as any)}
                  searchQuery={treatmentSearchQuery}
                  onSearchChange={setTreatmentSearchQuery}
                  onSelectTreatment={setSelectedTreatment}
                  onOpenBooking={handleOpenBooking}
                  onLinkClick={handleLinkClick}
                  getTreatmentCategory={getTreatmentCategory}
                />
              )}
              </motion.div>
            )}

            {/* TAB 5: BESPOKE AI DIAGNOSTIC PANEL & PRESTIGIOUS PRESCRIPTION CARD */}
            {activeTab === "diagnose" && (
              <motion.div
                key="diagnose"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-8"
                id="tab-diagnose"
              >
                
                {/* Dynamic Header */}
                {diagnosticStep < 7 && (
                  <div className="text-center space-y-4">
                    <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center justify-center gap-2">
                      <Fingerprint className="w-3.5 h-3.5 stroke-[1.5]" /> Konsultacja Molekularna Online
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl font-light">Gabinet Diagnozy Skóry</h1>
                    <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto leading-relaxed">
                      Sercem właściwej pielęgnacji jest zrozumienie procesów zachodzących w naskórku. Skorzystaj z naszego inteligentnego audytu komórkowego lub zbadaj naszą interaktywną mapę barierową.
                    </p>
                  </div>
                )}

                {/* SUB TAB SELECTOR OR TOGGLER */}
                {diagnosticStep < 7 && (
                  <div className="flex justify-center border border-luxury-sand bg-luxury-sand/10 p-1 divide-x divide-luxury-sand max-w-md mx-auto print:hidden">
                    <button
                      onClick={() => setDiagnoseSubTab("form")}
                      className={`flex-1 py-2 text-center font-mono text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer ${diagnoseSubTab === "form" ? "bg-luxury-dark text-white font-medium" : "text-luxury-dark/95 hover:text-luxury-dark hover:bg-white/40"}`}
                    >
                      1. AUDYT KOMÓRKOWY (TEST)
                    </button>
                    <button
                      onClick={() => setDiagnoseSubTab("barrierMap")}
                      className={`flex-1 py-2 text-center font-mono text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer ${diagnoseSubTab === "barrierMap" ? "bg-luxury-dark text-white font-medium" : "text-luxury-dark/95 hover:text-luxury-dark hover:bg-white/40"}`}
                    >
                      2. MAPA BARIERY SKÓRNEJ
                    </button>
                  </div>
                )}

              {/* Multistep Form Panel */}
              {diagnosticStep < 7 && diagnoseSubTab === "form" && (
                <div className="bg-white border border-luxury-sand p-8 md:p-12 shadow-sm relative overflow-hidden">
                  
                  {/* Backdrop Subtle Pattern */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none bg-repeat bg-[radial-gradient(#b39b72_1px,transparent_1px)] bg-[size:16px_16px]" />

                  {/* Step Tracker Header */}
                  <div className="flex items-center justify-between border-b border-luxury-sand pb-4 mb-8 font-mono text-[10px] text-luxury-dark/90 tracking-wider">
                    <span>Etap {diagnosticStep + 1} z 7</span>
                    <span className="uppercase text-luxury-gold">Diagnoza neuroanatomii naskórka</span>
                  </div>

                  {/* Diagnostic Questions Switcher */}
                  {diagnosticStep === 0 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
                      <h3 className="font-serif text-2xl font-light text-luxury-dark">1. Wiek biologiczny i horyzont regeneracji</h3>
                      <p className="text-xs text-luxury-dark/95 font-light">Wiek wpływa na podział macierzysty i czas potrzebny na pełną keratynizację oraz keratoplastykę naskórka.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[
                          "20-30 lat (prewencja antyoksydacyjna, wysokie tempo odnowy)",
                          "31-45 lat (pierwsze sygnały zwolnienia syntezy elastyny i kolagenu)",
                          "46-60 lat (odbudowa strukturalna owalu, regulacja lipidowa)",
                          "ponad 60 lat (głębokie odżywienie epigenetyczne i ochrona telomerów)"
                        ].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAnswers({ ...answers, ageGroup: opt });
                              setDiagnosticStep(1);
                            }}
                            className={`p-5 text-left border text-xs font-mono tracking-wide transition-all ${answers.ageGroup === opt ? "border-luxury-gold bg-luxury-cream text-luxury-gold" : "border-luxury-sand hover:border-luxury-dark hover:bg-luxury-cream/30"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {diagnosticStep === 1 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
                      <h3 className="font-serif text-2xl font-light text-luxury-dark">2. Główny dyskomfort pielęgnacyjny</h3>
                      <p className="text-xs text-luxury-dark/95 font-light">Wybierz sformułowanie, które najlepiej oddaje to, co aktualnie odczuwa Twoja skóra.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[
                          "Rumień, chroniczne rozszerzenie naczyń, reaktywność na temperaturę",
                          "Wiotkość, uczucie ciężkości u dołu twarzy, opadanie konturu",
                          "Szarawy koloryt, szorstka faktura, widoczne mikrouszkodzenia",
                          "Ściągnięcie głębokie, łuszczenie pod makijażem, brak elastyczności"
                        ].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAnswers({ ...answers, skinConcerns: opt });
                              setDiagnosticStep(2);
                            }}
                            className={`p-5 text-left border text-xs font-mono tracking-wide transition-all ${answers.skinConcerns === opt ? "border-luxury-gold bg-luxury-cream text-luxury-gold" : "border-luxury-sand hover:border-luxury-dark"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {diagnosticStep === 2 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
                      <h3 className="font-serif text-2xl font-light text-luxury-dark">3. Aktualny typ i zachowanie skóry</h3>
                      <p className="text-xs text-luxury-dark/95 font-light">W jaki sposób Twoja skóra reaguje na codzienne oczyszczanie wodą?</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[
                          "Reaguje mocnym pieczeniem, zaczerwienieniem, potrzebuje natychmiastowej okluzji",
                          "Przetłuszcza się w strefie T, wykazuje skłonność do zapchanych ujść mieszków",
                          "Wydaje się szorstka w dotyku, gromadzi suchy naskórek",
                          "Umiarkowana, czasem sucha, dobrze toleruje większość zabiegów"
                        ].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAnswers({ ...answers, skinType: opt });
                              setDiagnosticStep(3);
                            }}
                            className={`p-5 text-left border text-xs font-mono tracking-wide transition-all ${answers.skinType === opt ? "border-luxury-gold bg-luxury-cream text-luxury-gold" : "border-luxury-sand hover:border-luxury-dark"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {diagnosticStep === 3 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
                      <h3 className="font-serif text-2xl font-light text-luxury-dark">4. Obciążenie układu nerwowego (kortyzol)</h3>
                      <p className="text-xs text-luxury-dark/95 font-light">Stres powoduje skurcz naczyń włosowatych, co ogranicza transport tlenu do fibroblastów.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[
                          "Wysoki stres uogólniony (chroniczny brak snu, gonitwa myśli, napięcie)",
                          "Umiarkowany (tempo zawodowe wysokie, ale mam czas na weekendowy detoks)",
                          "Niski stres (spokojna organizacja, dbałość o sen, uregulowany czas wolny)"
                        ].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAnswers({ ...answers, stressLevel: opt });
                              setDiagnosticStep(4);
                            }}
                            className={`p-5 text-left border text-xs font-mono tracking-wide transition-all ${answers.stressLevel === opt ? "border-luxury-gold bg-luxury-cream text-luxury-gold" : "border-luxury-sand hover:border-luxury-dark"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {diagnosticStep === 4 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
                      <h3 className="font-serif text-2xl font-light text-luxury-dark">5. Eksperyzacja środowiska & Styl życia</h3>
                      <p className="text-xs text-luxury-dark/95 font-light">Czy Twoja skóra jest narażona na sztuczne oświetlenie Blue Light lub toksyny miejskie?</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[
                          "Praca biurowa przed monitorem komputerowym, klimatyzowane filtry miejskie",
                          "Skrajne warunki atmosferyczne (suchość w samolocie, częste wyjazdy)",
                          "Śniadania naturalne, bliskość natury, zrównoważony tryb życia, czyste powietrze"
                        ].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAnswers({ ...answers, lifestyle: opt });
                              setDiagnosticStep(5);
                            }}
                            className={`p-5 text-left border text-xs font-mono tracking-wide transition-all ${answers.lifestyle === opt ? "border-luxury-gold bg-luxury-cream text-luxury-gold" : "border-luxury-sand hover:border-luxury-dark"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {diagnosticStep === 5 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6">
                      <h3 className="font-serif text-2xl font-light text-luxury-dark">6. Historia agresywności zabiegowej</h3>
                      <p className="text-xs text-luxury-dark/95 font-light">Dotychczasowy stopień ingerencji w fizjologiczną faunę naskórkową.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[
                          "Częste, silne peelingi, mocne kwasy bez odbudowy lipidów (bariera upośledzona)",
                          "Regularne nawilżanie u kosmetyczki bez zaawansowanej medycyny komórkowej",
                          "Prosta, ostrożna pielęgnacja domowa, brak zabiegów gabinetowych"
                        ].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAnswers({ ...answers, treatmentHistory: opt });
                              setDiagnosticStep(6);
                            }}
                            className={`p-5 text-left border text-xs font-mono tracking-wide transition-all ${answers.treatmentHistory === opt ? "border-luxury-gold bg-luxury-cream text-luxury-gold" : "border-luxury-sand hover:border-luxury-dark"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {diagnosticStep === 6 && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6 text-center py-4">
                      <h3 className="font-serif text-2xl font-light text-luxury-dark">7. Oczekiwania wobec planowanej terapii</h3>
                      <p className="text-xs text-luxury-dark/95 font-light max-w-md mx-auto">
                        Wybierz swój najważniejszy cel estetyczno-barierowy, który stanowi dla Ciebie absolutny priorytet dekompresji i odnowy.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2 text-left">
                        {[
                          "Odbudowa bariery hydrolipidowej, wyciszenie stanów zapalnych i rumienia",
                          "Naturalny lifting, wymodelowanie owalu twarzy i redukcja napięć mięśniowych",
                          "Spowolnienie procesów starzenia, poprawa gęstości, jędrności i elastyczności",
                          "Głębokie nawilżenie, odżywienie naskórka, blask i wyrównanie kolorytu"
                        ].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => {
                              setAnswers({ ...answers, expectations: opt });
                            }}
                            className={`p-4 border text-[11px] font-mono tracking-wide transition-all rounded-xs cursor-pointer flex flex-col justify-between ${answers.expectations === opt ? "border-luxury-gold bg-luxury-cream text-luxury-gold font-semibold" : "border-luxury-sand text-luxury-dark/95 bg-white/40 hover:border-luxury-dark hover:bg-white"}`}
                          >
                            <span>{opt}</span>
                          </button>
                        ))}
                      </div>

                      {/* Diagnostic Error Message */}
                      {diagnosticError && (
                        <div className="bg-red-50 text-red-700 text-xs p-4 border border-red-200/50 flex items-center justify-center gap-2 max-w-md mx-auto my-4">
                          <AlertCircle className="w-5 h-5 stroke-[1.5]" />
                          <span>{diagnosticError}</span>
                        </div>
                      )}

                      <div className="mt-8 flex justify-center gap-4 border-t border-luxury-sand/30 pt-6">
                        <button
                          onClick={() => setDiagnosticStep(5)}
                          className="px-6 py-3 border border-luxury-sand text-xs font-mono tracking-widest uppercase hover:border-luxury-dark transition-all rounded-none cursor-pointer"
                        >
                          Cofnij
                        </button>
                        <button
                          onClick={handleStartDiagnose}
                          disabled={isDiagnosing || !answers.expectations}
                          className="px-8 py-3 bg-luxury-dark text-luxury-cream text-xs font-mono tracking-widest uppercase hover:bg-luxury-gold hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 rounded-none cursor-pointer font-bold"
                        >
                          {isDiagnosing ? "Analiza molekularna w toku..." : "GENERUJ AUTORSKĄ DIAGNOZĘ"} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Back Buttons inside Dialog */}
                  {diagnosticStep > 0 && diagnosticStep < 6 && (
                    <div className="mt-8 border-t border-luxury-sand pt-4 flex justify-between">
                      <button
                        onClick={() => setDiagnosticStep(diagnosticStep - 1)}
                        className="text-xs font-mono text-luxury-dark hover:text-luxury-gold transition-colors flex items-center gap-1"
                      >
                        ← Powrót do poprzedniego pytania
                      </button>
                      <span className="font-mono text-[9px] text-luxury-dark/90 uppercase font-medium">Slow Skin Concept</span>
                    </div>
                  )}

                  {isDiagnosing && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-6">
                      <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
                      <div className="text-center space-y-2">
                        <p className="font-serif text-xl italic tracking-wide text-luxury-gold">Słyszenie Twojej skóry...</p>
                        <p className="font-mono text-[9px] text-luxury-dark/90 tracking-[0.2em] uppercase">Porównywanie map kortyzolowych i barierowych</p>
                      </div>
                      <p className="text-[10px] text-luxury-dark/90 max-w-xs text-center leading-relaxed">
                        Nasze algorytmy komórkowe analizują poziomy stanów zapalnych naskórka i dopasowują precyzyjne neuro-formuły.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* INTERACTIVE SKIN BARRIER MAP DASHBOARD */}
              {diagnosticStep < 7 && diagnoseSubTab === "barrierMap" && (
                <motion.div
                  key="barrier-map-interactive"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border border-luxury-sand p-6 md:p-10 shadow-sm relative overflow-hidden space-y-8"
                  id="skin-barrier-map-card"
                >
                  <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none bg-repeat bg-[radial-gradient(#b39b72_1px,transparent_1px)] bg-[size:16px_16px]" />
                  
                  {/* Header */}
                  <div className="text-center max-w-xl mx-auto space-y-2 border-b border-luxury-sand/30 pb-6">
                    <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">Anatomia Edukacyjna Slow Skin™</span>
                    <h2 className="font-serif text-3xl font-light text-luxury-dark">Interaktywna Mapa Bariery Skórnej</h2>
                    <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
                      Klikaj w poszczególne warstwy, aby zobaczyć, jak reaguje naskórek w stanie uszkodzonym (stres barierowy) vs. prawidłowo odbudowanym bionomicznie (homeostaza).
                    </p>
                  </div>

                  {/* Mode Toggle Button */}
                  <div className="flex justify-center items-center gap-4 flex-wrap">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-luxury-dark/90 font-bold">USTAW STAN BARIERY:</span>
                    <div className="inline-flex border border-luxury-sand p-1 bg-luxury-sand/10 rounded-sm">
                      <button
                        onClick={() => setBarrierHealthState("damaged")}
                        className={`px-4 py-1.5 font-mono text-[9px] tracking-widest uppercase transition-all duration-300 rounded-xs cursor-pointer ${barrierHealthState === "damaged" ? "bg-red-950/20 text-red-800 border-red-300/30 shadow-xs border font-semibold" : "text-luxury-dark/90 hover:text-luxury-dark"}`}
                      >
                        ✕ USZKODZONA BARIERA
                      </button>
                      <button
                        onClick={() => setBarrierHealthState("healthy")}
                        className={`px-4 py-1.5 font-mono text-[9px] tracking-widest uppercase transition-all duration-300 rounded-xs cursor-pointer ${barrierHealthState === "healthy" ? "bg-emerald-950/10 text-emerald-800 border-emerald-300/30 shadow-xs border font-semibold" : "text-luxury-dark/90 hover:text-luxury-dark"}`}
                      >
                        ✓ ZDROWA CHROMO-BARIERA
                      </button>
                    </div>
                  </div>

                  {/* Grid containing graphic schematic (left) and diagnostic description (right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Interactive graphic representation */}
                    <div className="lg:col-span-5 space-y-3">
                      <p className="font-mono text-[9px] text-left text-luxury-dark/90 uppercase tracking-widest font-semibold border-b border-luxury-sand pb-1">
                        Przekrój Histologiczny Naskórka
                      </p>
                      
                      <div className="space-y-2.5 pt-2">
                        {[
                          {
                            id: "microbiome",
                            name: "1. Mikrobiom & Hydra-Płaszcz",
                            depth: "Zewnętrzna tarcza kwasowa",
                            color: barrierHealthState === "healthy" ? "border-emerald-500/45 bg-emerald-500/[0.04]" : "border-red-400/45 bg-red-400/[0.04]",
                            icon: Shield
                          },
                          {
                            id: "corneum",
                            name: "2. Stratum Corneum",
                            depth: "Warstwa rogowa & Cement lipidowy",
                            color: barrierHealthState === "healthy" ? "border-emerald-500/45 bg-emerald-500/[0.03]" : "border-red-400/45 bg-red-400/[0.03]",
                            icon: Dna
                          },
                          {
                            id: "junctions",
                            name: "3. Połączenia Ścisłe",
                            depth: "Ekran okluzji wewnątrzkomórkowej",
                            color: barrierHealthState === "healthy" ? "border-emerald-500/45 bg-emerald-500/[0.02]" : "border-red-400/45 bg-red-400/[0.02]",
                            icon: Activity
                          },
                          {
                            id: "deep",
                            name: "4. Melanocyty & Dermobaza",
                            depth: "Komórki Langerhansa & barwnik",
                            color: barrierHealthState === "healthy" ? "border-emerald-500/45 bg-emerald-500/[0.01]" : "border-red-400/45 bg-red-400/[0.01]",
                            icon: Sparkles
                          }
                        ].map((layer) => {
                          const isActive = activeBarrierLayer === layer.id;
                          const LayerIcon = layer.icon;
                          return (
                            <button
                              key={layer.id}
                              onClick={() => setActiveBarrierLayer(layer.id as any)}
                              className={`w-full p-4 border text-left transition-all duration-300 relative group cursor-pointer ${isActive ? "ring-2 ring-luxury-gold/50 border-luxury-gold shadow-sm" : "hover:border-luxury-dark/45"} ${layer.color} rounded-none`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 border ${isActive ? "bg-luxury-gold text-white border-luxury-gold" : "bg-white text-luxury-dark/95 border-luxury-sand"} transition-colors rounded-none`}>
                                    <LayerIcon className="w-4 h-4 stroke-[1.2]" />
                                  </div>
                                  <div>
                                    <h4 className="font-serif text-sm font-light text-luxury-dark tracking-wide">{layer.name}</h4>
                                    <p className="font-mono text-[9px] text-luxury-dark/90 uppercase">{layer.depth}</p>
                                  </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-luxury-gold/60 transition-transform ${isActive ? "translate-x-1" : "group-hover:translate-x-0.5"}`} />
                              </div>
                              
                              {/* Status micro dot */}
                              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${barrierHealthState === "healthy" ? "bg-emerald-500" : "bg-red-500"}`} />
                                <span className="text-[7.5px] font-mono font-bold tracking-wider text-luxury-dark/90">
                                  {barrierHealthState === "healthy" ? "ZDROWA" : "ALERT"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Dynamic status card */}
                      <div className={`p-4 border text-left space-y-2 mt-4 transition-colors duration-300 rounded-none ${barrierHealthState === "healthy" ? "bg-emerald-500/[0.04] border-emerald-500/20" : "bg-red-500/[0.04] border-red-500/20"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${barrierHealthState === "healthy" ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-pulse"}`} />
                          <h5 className={`font-mono text-[9px] uppercase tracking-widest font-bold ${barrierHealthState === "healthy" ? "text-emerald-800" : "text-emerald-800"}`}>
                            {barrierHealthState === "healthy" ? "Stan skóry: Prawidłowa Równowaga Bariery" : "Stan skóry: Bariera Ochronna Osłabiona"}
                          </h5>
                        </div>
                        <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">
                          {barrierHealthState === "healthy" 
                            ? "Czynnik TEWL (ucieczka wody) jest w klinicznej normie. Cement lipidowy chroni hydrofilne struktury, a odpowiedź cytokin jest zbalansowana."
                            : "Transnaskórkowa utrata wody drastycznie rośnie. Agresywne pH nasila świąd i uogólnioną tkliwość. Naskórek przechodzi stan obrony metabolicznej."}
                        </p>
                      </div>
                    </div>

                    {/* Right: Detailed interactive description block based on selected layer and state */}
                    <div className="lg:col-span-7 bg-luxury-cream/10 border border-luxury-sand p-6 md:p-8 text-left space-y-6 rounded-none">
                      
                      {/* Title of selected layer */}
                      {(() => {
                        const layerData = {
                          microbiome: {
                            title: "Bariera Biologiczna: Mikrobiom i Hydro-Płaszcz Kwaśny",
                            healthy: {
                              desc: "Prawidłowy, przyjazny mikrobiom współtworzy twardy, chemiczny hydro-płaszcz o lekko kwaśnym pH (ok. 5.5). Działa jak biologiczny tarcza obronna hamująca rozwój bakterii Staphylococcus aureus czy grzybów Malassezia.",
                              symptoms: "Gładka faktura, brak nagłych podrażnień przy myciu, odporność na miejski smog, naturalny, zdrowy bioluminiscencyjny blask (natural glow).",
                              ingredients: "Prebiotyki, biosacharydy, bionomiczne oleje bogate w kwas gamma-linolenowy (GLA), kwas hialuronowy o zróżnicowanej masie.",
                              recommendation: "Rytuał bionomiczny Slow Skin Concept™ opierający się na pielęgnacji przywracającej prawidłowy ekosystem naskórka."
                            },
                            damaged: {
                              desc: "Agresywne substancje pianotwórcze (SLS/SLES) i zasadowe kosmetyki naruszają mikroflorę. Patogeny kolonizują naskórek, uszkadzając lipidowy płaszcz i indukując uwalnianie zapalnych cytokin przez keratynocyty.",
                              symptoms: "Uporczywy świąd, pieczenie pod wpływem najprostszych kremów, przewlekły delikatny rumień, drobne stany zapalne bez wyraźnej przyczyny.",
                              ingredients: "Unikaj zasadowych mydeł, konserwantów dezorganizujących mikrobiom, agresywnych alkoholi suszących.",
                              recommendation: "Natychmiastowy zabieg wyciszający bariery i wdrożenie bionomicznych żeli oczyszczających bez detergentów."
                            }
                          },
                          corneum: {
                            title: "Bariera Fizyczna: Stratum Corneum & Cement Lipidowy",
                            healthy: {
                              desc: "Konstrukcja cegiełek (korneocytów) i zaprawy (cementu lipidowego złożonego z ceramidów, wolnych kwasów tłuszczowych oraz cholesterolu 1:1:1) jest zwarta. Woda jest trwale zatrzymana w tkance (stabilne TEWL).",
                              symptoms: "Skóra sprężysta, elastyczna, jędrna, niewrażliwa na wiatr czy umiarkowany chłód. Brak widocznego łuszczenia pod makijażem.",
                              ingredients: "Ceramidy NP/AP/EOP, fitosfingozyna, biokompatybilne lipidy roślinne (Masło Shea, skwalan, olej jojoba).",
                              recommendation: "Rytuały silnie lipidowe i odbudowujące, wsparte neurokonsultacją bionomiczną."
                            },
                            damaged: {
                              desc: "Niedobór ceramidów i kwasów tłuszczowych rozluźnia strukturę cementu. Pomiędzy komórkami powstają mikroszczeliny, przez które woda swobodnie odparowuje, a alergeny środowiskowe wnikają głęboko do skóry właściwej.",
                              symptoms: "Szorstki i matowy naskórek, łuszczenie się strefowe (zwłaszcza nos, czoło, policzki), natychmiastowe uczucie silnego ściągnięcia po umyciu wodą.",
                              ingredients: "Unikaj fizycznych peelingów ziarnistych, mocnego retinolu bez aktywnej okluzji, szczoteczek sonicznych.",
                              recommendation: "Skoncentrowana terapia biomimetyczna w naszym gabinecie omija kwasy i stymuluje lipogenezę naskórkową."
                            }
                          },
                          junctions: {
                            title: "Bariera Chemiczna: Połączenia Ścisłe i NMF (Tight Junctions)",
                            healthy: {
                              desc: "Białka okludyny i klaudyny tworzą szczelny pas w warstwie ziarnistej, regulując prąd wody i jonów. Towarzyszy im bogaty Natural Moisturizing Factor (NMF) złożony z mocznika, kwasu glutaminowego, kwasu mlekowego i aminokwasów.",
                              symptoms: "Pełne nawodnienie strukturalne, wysoka plastyczność naskórka, zdrowy, równomierny koloryt i pełna regeneracja owalu twarzy.",
                              ingredients: "Mocznik, kwas mlekowy, seryna, alanina, glicyna, naturalna betaina, fitosterole wzmacniające membrany komórkowe.",
                              recommendation: "Biomimetyczne nasycenie komórkowe o wysokim stopniu wchłanialności."
                            },
                            damaged: {
                              desc: "Stres oksydacyjny, promienie UV i podwyższony kortyzol uszkadzają białka połączeń ścisłych. NMF ulega wymyciu, przez co skóra traci pierwotną zdolność wiązania wody w naczyniach bionomowych.",
                              symptoms: "Odwodnienie głębokie (wiotkość), powstawanie drobnych zmarszczek dehydratacyjnych, skóra wygląda na 'papierową' i cienką.",
                              ingredients: "Unikaj wielogodzinnej ekspozycji na słońce bez filtrów fizycznych, klimatyzacji wysuszającej naskórek.",
                              recommendation: "Mezoterapia bezigłowa i tlenoterapia biomimetyczna wspierające szczelność komórkową naskórka."
                            }
                          },
                          deep: {
                            title: "Bariera Immunologiczna: Melanocyty i komórki Langerhansa",
                            healthy: {
                              desc: "Melanocyty produkują melaninę w idealnym tempie chroniącym jądra komórkowe przed UV, a komórki Langerhansa sprawnie patrolują naskórek, wyciszając nepotrzebne stany zapalne przed ich eskalacją.",
                              symptoms: "Równomierny koloryt bez przebarwień zapalnych, szybkie gojenie się ewentualnych mikrouszkodzeń, brak plam pigmentacyjnych.",
                              ingredients: "Niacynamid (reguluje barwnik), kwas ferulowy, witamina C stymulująca fibroblasty, ektoina chroniąca komórki Langerhansa.",
                              recommendation: "Neurolifting Nogiera i chromoterapia LED wyciszająca neuroreceptory i melanocyty."
                            },
                            damaged: {
                              desc: "Uszkodzenie wyższych barier aktywuje stany obronne. Melanocyty, podrażniane przez cytokiny, nadpobudliwie i nierównomiernie dystrybuują barwnik, tworząc plamy pozapalne (PIH), a komórki odpornościowe ulegają wyczerpaniu.",
                              symptoms: "Przebarwienia słoneczne i pozabiegowe, ciemniejsze plamy na czole i policzkach, bardzo wolne gojenie się drobnych uszkodzeń naskórka.",
                              ingredients: "Unikaj bezpośredniego opalania, agresywnych laseroterapii ablacyjnych niszczących melanocyty.",
                              recommendation: "Bezpieczna terapia rozjaśniająco-bioregenerująca LED sparowana z bionomiczną ochroną epigenetyczną."
                            }
                          }
                        }[activeBarrierLayer];

                        const activeStateData = barrierHealthState === "healthy" ? layerData.healthy : layerData.damaged;

                        return (
                          <div className="space-y-6 animate-fade-in" key={`${activeBarrierLayer}-${barrierHealthState}`}>
                            <div className="space-y-2">
                              <span className={`font-mono text-[9px] uppercase tracking-widest font-bold py-1 px-2.5 inline-block ${barrierHealthState === "healthy" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                {barrierHealthState === "healthy" ? "✓ KANAŁ BIOPOMOCY" : "✕ SYGNAŁ STRESU"}
                              </span>
                              <h3 className="font-serif text-xl font-light text-luxury-dark tracking-wide">{layerData.title}</h3>
                            </div>

                            <div className="space-y-4 text-xs leading-relaxed text-luxury-dark font-light">
                              <p className="text-justify font-normal text-luxury-dark/95">
                                {activeStateData.desc}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="bg-white p-4 border border-luxury-sand/65">
                                  <h5 className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-bold mb-1.5">Widoczne Objawy:</h5>
                                  <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">{activeStateData.symptoms}</p>
                                </div>
                                <div className="bg-white p-4 border border-luxury-sand/65">
                                  <h5 className="font-mono text-[9px] uppercase tracking-wider text-luxury-gold font-bold mb-1.5">
                                    {barrierHealthState === "healthy" ? "Kluczowe Składniki:" : "Czego Unikać:"}
                                  </h5>
                                  <p className="text-[11px] text-luxury-dark/95 font-light leading-relaxed">{activeStateData.ingredients}</p>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-luxury-sand/40 space-y-2">
                                <h5 className="font-mono text-[9px] uppercase tracking-widest text-luxury-dark/90 font-bold">Rekomendacja Slow Skin Concept™:</h5>
                                <p className="font-serif italic text-luxury-gold text-xs leading-relaxed">
                                  {activeStateData.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                    </div>
                  </div>

                  {/* Bottom CTA to start form diagnostic */}
                  <div className="border-t border-luxury-sand/45 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
                    <div className="space-y-0.5">
                      <p className="font-mono text-[10px] text-luxury-gold uppercase tracking-widest font-bold">Chcesz poznać swój unikalny profil?</p>
                      <p className="text-xs text-luxury-dark/95 font-light">Przejdź do naszego spersonalizowanego audytu skóry online, aby otrzymać autorski Paszport Skóry™.</p>
                    </div>
                    <button
                      onClick={() => setDiagnoseSubTab("form")}
                      className="px-6 py-3 bg-luxury-dark hover:bg-luxury-gold text-luxury-cream hover:text-white text-xs font-mono tracking-widest uppercase transition-colors cursor-pointer rounded-none border border-luxury-dark"
                    >
                      Uruchom Audyt Komórkowy AI →
                    </button>
                  </div>

                </motion.div>
              )}

              {/* REPORT SCREEN (Printable PDF-styled Luxury Folder) */}
              {diagnosticStep === 7 && diagnosticReport && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                  id="diagnostic-report-card"
                >
                  <div className="bg-white border-2 border-luxury-sand p-8 md:p-16 relative shadow-lg max-w-3xl mx-auto print:border-0 print:p-0">
                    
                    {/* Prestigious Seal Design */}
                    <div className="absolute top-10 right-10 w-24 h-24 border border-luxury-gold/30 rounded-full flex flex-col items-center justify-center text-center select-none opacity-60">
                      <span className="text-[8px] font-mono tracking-widest text-luxury-gold uppercase leading-none">Slow Skin</span>
                      <span className="font-serif text-[11px] text-luxury-gold my-0.5">CONCEPT</span>
                      <span className="text-[8px] font-mono tracking-[0.2em] text-luxury-gold/50 uppercase leading-none">A.D. 2026</span>
                    </div>

                    {/* Logo Section inside Letterhead */}
                    <div className="text-center space-y-2 border-b border-luxury-sand pb-10 mb-10">
                      <h2 className="font-serif text-2xl font-light tracking-[0.25em] uppercase">SLOW SKIN</h2>
                      <p className="font-mono text-[8px] tracking-[0.3em] text-luxury-dark/90 uppercase">SPERSONALIZOWANA RECEPTA ANATOMII SKÓRY</p>
                      <div className="text-[10px] font-mono text-luxury-dark/90 flex justify-center gap-12 pt-4">
                        <span>Pacjentka: Klientka Slow Skin Concept</span>
                        <span>Data analizy: {new Date().toLocaleDateString("pl-PL")}</span>
                        <span>ID Dok: #SS-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-10">
                      
                      {/* Section 1: Deep Assessment */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-luxury-gold uppercase tracking-wider pb-1 border-b border-luxury-sand/40">
                          <Fingerprint className="w-4 h-4 stroke-[1.2]" /> 1. Autorska Ocena Stanu Bariery
                        </div>
                        <p className="text-sm text-luxury-dark font-serif italic leading-relaxed text-justify">
                          {diagnosticReport.skinTypeAssessment}
                        </p>
                      </div>

                      {/* Section 2: Neuro-biological causes */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-luxury-gold uppercase tracking-wider pb-1 border-b border-luxury-sand/40">
                          <Activity className="w-4 h-4 stroke-[1.2]" /> 2. Uwarunkowania Neuro-Biologiczne
                        </div>
                        <p className="text-sm text-luxury-dark/95 font-light leading-relaxed text-justify">
                          {diagnosticReport.biologicalCauses}
                        </p>
                      </div>

                      {/* Section 3: Personalized At-Home Routine */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-luxury-gold uppercase tracking-wider pb-1 border-b border-luxury-sand/40">
                          <FileText className="w-4 h-4 stroke-[1.2]" /> 3. Dobowa Asysta Pielęgnacyjna (Domowa)
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="bg-luxury-cream/40 p-5 border border-luxury-sand/50 space-y-3">
                            <h4 className="font-serif text-sm text-luxury-gold uppercase tracking-wider">Rytuał Poranny: Ochrona & Hydratacja</h4>
                            <ul className="space-y-2">
                              {diagnosticReport.atHomePrescription.morning.map((step, idx) => (
                                <li key={idx} className="text-xs text-luxury-dark/95 font-light flex items-start gap-2">
                                  <span className="font-mono text-luxury-gold font-medium">{idx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-luxury-cream/40 p-5 border border-luxury-sand/50 space-y-3">
                            <h4 className="font-serif text-sm text-luxury-gold uppercase tracking-wider">Rytuał Wieczorny: Rekonstrukcja Molekularna</h4>
                            <ul className="space-y-2">
                              {diagnosticReport.atHomePrescription.evening.map((step, idx) => (
                                <li key={idx} className="text-xs text-luxury-dark/95 font-light flex items-start gap-2">
                                  <span className="font-mono text-luxury-gold font-medium">{idx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Recommended Cabin Therapies */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-luxury-gold uppercase tracking-wider pb-1 border-b border-luxury-sand/40">
                          <Award className="w-4 h-4 stroke-[1.2]" /> 4. Sugerowane Rytuały w Gabinecie Slow Skin Concept
                        </div>
                        <div className="space-y-3 pt-1">
                          {diagnosticReport.clinicalTherapies.map((therapy, i) => (
                            <div key={i} className="p-4 border-l border-luxury-gold bg-luxury-cream/20 space-y-1">
                              <h5 className="font-serif text-sm font-medium text-luxury-dark">{therapy.name}</h5>
                              <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">{therapy.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 5: Mindfulness advice */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-[10px] text-luxury-gold uppercase tracking-wider pb-1 border-b border-luxury-sand/40">
                          <Heart className="w-4 h-4 stroke-[1.2]" /> 5. Rytuał Wyciszenia Sensorycznego (Wewnętrzny)
                        </div>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed text-justify bg-luxury-sand/15 p-4 italic">
                          &ldquo;{diagnosticReport.holisticMindfulness}&rdquo;
                        </p>
                      </div>

                      {/* Signature block */}
                      <div className="pt-10 flex justify-between items-end">
                        <div className="font-mono text-[9px] text-luxury-dark/90 max-w-xs leading-relaxed">
                          Wygenerowano przy wsparciu silnika dermatologii precyzyjnej Slow Skin Concept™ Jelcz-Laskowice.
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-serif italic text-base font-light text-luxury-gold pr-2">Katarzyna Brzezińska</div>
                          <div className="font-mono text-[8px] text-luxury-dark/95 uppercase tracking-widest border-t border-luxury-sand pt-1.5">
                            KOSMETOLOG HOLISTYCZNY, SKINOLOG & FOUNDER
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Print and interaction secondary actions */}
                  <div className="flex justify-between items-center max-w-3xl mx-auto border-t border-luxury-sand pt-6 px-4 print:hidden">
                    <button
                      onClick={() => {
                        setDiagnosticStep(0);
                        setDiagnosticReport(null);
                      }}
                      className="text-xs font-mono text-luxury-dark/95 hover:text-luxury-dark transition-colors cursor-pointer"
                    >
                      ← Przeprowadź diagnozę ponownie
                    </button>

                    <div className="flex gap-4">
                      <button
                        onClick={downloadTxtReport}
                        className="px-6 py-2.5 border border-luxury-dark/60 text-xs font-mono tracking-widest uppercase hover:bg-luxury-dark hover:text-luxury-cream transition-all flex items-center gap-2 cursor-pointer"
                        title="Pobierz diagnozę jako plik tekstowy (.txt)"
                      >
                        <Download className="w-4 h-4 text-luxury-gold" /> Pobierz .txt
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-6 py-2.5 border border-luxury-dark/60 text-xs font-mono tracking-widest uppercase hover:bg-luxury-dark hover:text-luxury-cream transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" /> Drukuj receptę
                      </button>
                      <button
                        onClick={() => setActiveTab("clinic")}
                        className="px-6 py-2.5 bg-luxury-dark text-white text-xs font-mono tracking-widest uppercase hover:bg-luxury-gold transition-all cursor-pointer"
                      >
                        Rezerwuj zabieg w gabinecie
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* TAB 6: MOJE KONTO & SLOW SKIN PASS™ */}
          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="notranslate max-w-4xl mx-auto space-y-8"
              id="tab-account"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <span className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase flex items-center justify-center gap-2">
                  <User className="w-3.5 h-3.5 stroke-[1.5]" /> Prywatny Azyl Pacjenta
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-light">Slow Skin Pass™ Portal</h1>
                <p className="text-xs text-luxury-dark/95 font-light max-w-xl mx-auto leading-relaxed">
                  Miejsce dedykowane stałym gościom gabinetu w Jelczu-Laskowicach. Monitoruj historię swoich terapii bionomicznych oraz spersonalizowane Beauty Plany.
                </p>
              </div>

              {!isLoggedIn ? (
                /* LOGIN BOX */
                <div className="bg-white border border-luxury-sand p-8 md:p-12 shadow-sm max-w-md mx-auto space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-luxury-gold" />
                  <div className="text-center space-y-2">
                    <h2 className="font-serif text-2xl font-light text-luxury-dark">Zaloguj się do Strefy Klientki</h2>
                    <p className="text-xs text-luxury-dark/90 leading-relaxed font-light">
                      Podaj swoje osobiste hasło deponowane przy pierwszej wizycie, aby uzyskać pełny wgląd w swoją kartę komórkową.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 pt-2">
                    {loginError && (
                      <div className="text-[11px] font-mono text-amber-800 bg-amber-50 p-2.5 border border-amber-200 animate-fade-in text-center">
                        ✕ {loginError}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-luxury-dark/90 uppercase block text-left">Adres e-mail</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="aleksandra.kaminska@quietluxury.pl"
                        className="w-full bg-white border border-luxury-sand p-3 text-xs outline-0 text-luxury-dark focus:border-luxury-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-luxury-dark/90 uppercase block text-left">Hasło dostępu</label>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Wprowadź hasło"
                        className="w-full bg-white border border-luxury-sand p-3 text-xs outline-0 text-luxury-dark focus:border-luxury-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full py-3.5 bg-luxury-dark hover:bg-luxury-gold text-white text-xs font-mono tracking-widest uppercase transition-all duration-300 font-semibold cursor-pointer disabled:opacity-55"
                    >
                      {isLoginLoading ? "WERYFIKACJA KLUCZA..." : "AUTORYZUJ DOSTĘP"}
                    </button>
                  </form>

                  <div className="border-t border-luxury-sand/30 pt-4 text-center">
                    <span className="font-mono text-[8px] tracking-widest text-luxury-gold font-bold uppercase block mb-1">Dostęp demonstracyjny do panelu:</span>
                    <p className="text-[10px] text-luxury-dark/90 leading-normal">
                      E-mail: <code className="bg-luxury-sand/15 px-1 py-0.5 select-all">aleksandra.kaminska@quietluxury.pl</code><br/>
                      Hasło: <code className="bg-luxury-sand/15 px-1 py-0.5 select-all">1234</code>
                    </p>
                  </div>
                </div>
              ) : (
                /* LOGGED IN USER INTERFACE */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left side: Premium Card & Info */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Slow Skin Pass Card */}
                    <div className="bg-luxury-dark text-luxury-cream p-6 border border-luxury-gold relative overflow-hidden flex flex-col justify-between h-[230px] shadow-sm">
                      {/* Shimmer light watermark */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/15 rotate-45 translate-x-12 -translate-y-12 blur-2xl pointer-events-none" />
                      
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold font-bold block">SLOW SKIN PASS™</span>
                        <span className="text-2xl font-serif tracking-[0.1em] block">{userProfile.name}</span>
                      </div>

                      <div className="space-y-1 pt-6 text-[10px] font-mono opacity-80">
                        <p className="flex justify-between border-b border-white/10 pb-1">
                          <span>ID CZŁONKA:</span>
                          <span className="text-luxury-gold">{userProfile.memberId}</span>
                        </p>
                        <p className="flex justify-between pt-1">
                          <span>KLUBOWICZ OD:</span>
                          <span>{userProfile.joinDate}</span>
                        </p>
                      </div>

                      <div className="flex justify-between items-end pt-4">
                        <span className="font-serif italic text-[11px] text-luxury-gold font-light">Quiet Luxury Guest Code</span>
                        <span className="font-mono text-[8px] text-luxury-cream/50 bg-white/5 px-2 py-0.5 text-[8px] uppercase tracking-widest border border-white/10">ZWALIDOWANA</span>
                      </div>
                    </div>

                    {/* Skin Bio Information card */}
                    <div className="bg-white border border-luxury-sand p-6 text-left space-y-4">
                      <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase block font-bold border-b border-luxury-sand pb-1">
                        Ekspercka Charakterystyka Skóry
                      </span>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <span className="font-mono text-[8px] text-luxury-dark/90 uppercase block mb-0.5">Główny problem komórkowy:</span>
                          <p className="text-luxury-dark font-serif font-medium leading-normal">{userProfile.skinConcern}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[8px] text-luxury-dark/90 uppercase block mb-0.5">Poziom neuroreaktywności:</span>
                          <p className="text-luxury-dark font-light leading-normal">{userProfile.sensitivityLevel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Silence Pref Checkbox */}
                    <div className="bg-luxury-sand/10 border border-luxury-sand/40 p-5 text-left space-y-3">
                      <h4 className="font-mono text-[8.5px] tracking-wider text-luxury-gold uppercase font-bold">Instrukcje Specjalne (Ceremonia)</h4>
                      
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={userProfile.prefersSilence}
                          onChange={handleTogglePrefersSilence}
                          className="mt-0.5 border-luxury-sand text-luxury-gold focus:ring-luxury-gold cursor-pointer"
                        />
                        <div className="text-[11px] text-luxury-dark font-light leading-tight">
                          <span className="font-semibold block text-luxury-dark">Silent Ceremony Preference</span>
                          Podczas zabiegu preferuję głębokie milczenie (kosmetolog komentuje wyłącznie kluczowe przejścia bionomiczne).
                        </div>
                      </label>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full py-3 border border-luxury-dark/35 hover:bg-luxury-dark hover:text-white transition-all duration-300 font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                    >
                      Wyloguj ze Strefy Klientki &rarr;
                    </button>

                  </div>

                  {/* Right side: Visits list or Beauty Plan depending on subtab */}
                  <div className="lg:col-span-8 bg-white border border-luxury-sand p-6 md:p-8 text-left space-y-6">
                    
                    {/* Quiet Luxury Sub-tab Navigation */}
                    <div className="flex border-b border-luxury-sand/40 gap-6">
                      <button 
                        onClick={() => setAccountSubTab("beautyPlan")}
                        className={`font-mono text-[11px] uppercase tracking-[0.15em] pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${accountSubTab === "beautyPlan" ? "border-luxury-gold text-luxury-gold font-bold" : "border-transparent text-luxury-dark/90 hover:text-luxury-dark"}`}
                        id="tab-btn-beautyplan"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-luxury-gold animate-pulse" /> Mój Beauty Plan
                      </button>
                      <button 
                        onClick={() => setAccountSubTab("visits")}
                        className={`font-mono text-[11px] uppercase tracking-[0.15em] pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${accountSubTab === "visits" ? "border-luxury-gold text-luxury-gold font-bold" : "border-transparent text-luxury-dark/90 hover:text-luxury-dark"}`}
                        id="tab-btn-visits"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Dziennik Rytuałów ({pastVisits.length})
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {accountSubTab === "visits" ? (
                        <motion.div
                          key="visits-list"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="border-b border-luxury-sand/40 pb-4">
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Dziennik Rytuałów & Histologia Wizyt</h3>
                            <p className="text-xs text-luxury-dark/90 font-light mt-1">Precyzyjny spis wszystkich sesji gabinetowych zrealizowanych w Jelczu-Laskowicach.</p>
                          </div>

                           <div className="space-y-4">
                            {pastVisits.map((visit: any) => {
                              const existingReview = reviewsList.find((r) => r.visitId === visit.id);
                              return (
                                <div key={visit.id} className="p-4 border border-luxury-sand hover:border-luxury-gold/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-luxury-sand/5">
                                  <div className="space-y-1 text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[8px] text-luxury-dark/90 block">{visit.date} • {visit.duration}</span>
                                      <span className="text-[7.5px] font-mono text-luxury-gold tracking-widest uppercase bg-luxury-gold/10 px-1.5 py-0.5">Zrealizowano</span>
                                    </div>
                                    <h4 className="font-serif text-[15px] font-medium text-luxury-dark leading-tight">{visit.treatmentTitle}</h4>
                                    <p className="text-xs text-luxury-dark/95 font-light font-mono text-[10px] pb-1">Terapeutka: {visit.therapist}</p>
                                    
                                    {existingReview ? (
                                      <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-luxury-gold">
                                        <div className="flex text-luxury-gold leading-none gap-0.5">
                                          {Array.from({ length: existingReview.rating }).map((_, i) => (
                                            <span key={i}>★</span>
                                          ))}
                                          {Array.from({ length: 5 - existingReview.rating }).map((_, i) => (
                                            <span key={i} className="text-luxury-sand/30">★</span>
                                          ))}
                                        </div>
                                        <span className="font-mono text-[8.5px] text-emerald-700 font-semibold uppercase bg-emerald-50 px-1 py-0.5 border border-emerald-100 rounded-none tracking-wider">✓ PRZESŁANO OCENĘ</span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setRatingVisitId(visit.id);
                                          setSurveySuccess(false);
                                          setSurveyRating(5);
                                          setSurveyAtmosphere(5);
                                          setSurveyRelaxation("tak");
                                          setSurveyFeedback("");
                                        }}
                                        className="text-[9.5px] font-mono tracking-widest text-luxury-gold uppercase hover:text-luxury-dark transition-all duration-300 mt-2 text-left flex items-center gap-1 border-b border-dashed border-luxury-gold/40 pb-0.5 cursor-pointer hover:border-luxury-dark select-none"
                                      >
                                        Napisz opinię (Ankieta Satysfakcji) &rarr;
                                      </button>
                                    )}
                                  </div>
                                  
                                  <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-luxury-sand/40">
                                    <span className="font-mono text-xs font-semibold text-luxury-dark block sm:text-right">{visit.treatmentPrice}</span>
                                    <span className="text-[8px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-none inline-flex items-center gap-1 uppercase tracking-widest mt-1">
                                      ✓ Verified
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Satisfaction Survey Interactive Card */}
                          {ratingVisitId && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35 }}
                              className="border border-luxury-gold bg-luxury-cream/40 p-5 md:p-6 space-y-4 shadow-xs"
                              id="satisfaction-survey-form-block"
                            >
                              <div className="flex justify-between items-start border-b border-luxury-sand/40 pb-3">
                                <div className="text-left">
                                  <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase block font-bold">ANKIETA SATYSFAKCJI PO WIZYCIE</span>
                                  <h4 className="font-serif text-base text-luxury-dark font-medium mt-1">
                                    Jak oceniasz seans: <span className="italic">"{pastVisits.find((v: any) => v.id === ratingVisitId)?.treatmentTitle}"</span>?
                                  </h4>
                                  <p className="text-[10px] text-luxury-dark/95 font-light mt-0.5">Twoja bionomiczna szczerość jest motorem bionomicznej rewolucji.</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setRatingVisitId(null)}
                                  className="text-luxury-dark/90 hover:text-luxury-dark font-mono text-[10px] uppercase hover:underline cursor-pointer tracking-wider"
                                >
                                  Zamknij ×
                                </button>
                              </div>

                              {surveySuccess ? (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.98 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="py-6 text-center space-y-3"
                                >
                                  <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto text-luxury-gold text-lg">
                                    ★
                                  </div>
                                  <h5 className="font-serif text-base text-luxury-dark font-medium">Dziękujemy za podzielenie się opinią</h5>
                                  <p className="text-[11px] text-luxury-dark/95 font-light max-w-sm mx-auto leading-normal">
                                    Twoja opinia została pomyślnie zapisana. Twoje zadowolenie i komfort są dla nas zawsze na pierwszym miejscu.
                                  </p>
                                </motion.div>
                              ) : (
                                <form onSubmit={handleSubmitSatisfactionSurvey} className="space-y-4 text-left">
                                  {/* Star Rating for Treatment */}
                                  <div className="space-y-1">
                                    <label className="block font-serif text-[12.5px] text-luxury-dark font-medium">
                                      1. Jak oceniasz poziom zaawansowania oraz terapeutyczną skuteczność rytuału?
                                    </label>
                                    <div className="flex gap-2.5 mt-1 items-center">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => setSurveyRating(star)}
                                          className="text-xl transition-all duration-200 hover:scale-115 focus:outline-hidden cursor-pointer"
                                        >
                                          <span className={star <= surveyRating ? "text-luxury-gold" : "text-luxury-sand/30"}>
                                            ★
                                          </span>
                                        </button>
                                      ))}
                                      <span className="font-mono text-[10px] text-luxury-dark/90 ml-2">
                                        ({surveyRating}/5)
                                      </span>
                                    </div>
                                  </div>

                                  {/* Star Rating for Comfort & Atmosphere */}
                                  <div className="space-y-1">
                                    <label className="block font-serif text-[12.5px] text-luxury-dark font-medium">
                                      2. Jak oceniasz standard wyciszenia, dbałość o detale i atmosferę Instytutu?
                                    </label>
                                    <div className="flex gap-2.5 mt-1 items-center">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => setSurveyAtmosphere(star)}
                                          className="text-xl transition-all duration-200 hover:scale-115 focus:outline-hidden cursor-pointer"
                                        >
                                          <span className={star <= surveyAtmosphere ? "text-luxury-gold" : "text-luxury-sand/30"}>
                                            ★
                                          </span>
                                        </button>
                                      ))}
                                      <span className="font-mono text-[10px] text-luxury-dark/90 ml-2">
                                        ({surveyAtmosphere}/5)
                                      </span>
                                    </div>
                                  </div>

                                  {/* Relaxation state check */}
                                  <div className="space-y-1">
                                    <label className="block font-serif text-[12.5px] text-luxury-dark font-medium">
                                      3. Czy podczas wizyty odczuwałeś/aś stan bionomicznego resetu neurologicznego?
                                    </label>
                                    <div className="flex flex-wrap gap-2.5 mt-1.5 font-mono text-[9px] tracking-wider uppercase font-medium">
                                      <button
                                        type="button"
                                        onClick={() => setSurveyRelaxation("tak")}
                                        className={`px-4 py-2 border transition-all cursor-pointer ${
                                          surveyRelaxation === "tak"
                                            ? "bg-luxury-dark text-white border-luxury-dark shadow-xs"
                                            : "bg-white text-luxury-dark/95 border-luxury-sand hover:border-luxury-dark"
                                        }`}
                                      >
                                        TAK, PEŁNE WYCISZENIE STRESU
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSurveyRelaxation("nie")}
                                        className={`px-4 py-2 border transition-all cursor-pointer ${
                                          surveyRelaxation === "nie"
                                            ? "bg-luxury-dark text-white border-luxury-dark shadow-xs"
                                            : "bg-white text-luxury-dark/95 border-luxury-sand hover:border-luxury-dark"
                                        }`}
                                      >
                                        NIE, ODCZUWAŁEM/AM PRZEŚWITY NAPIĘCIA
                                      </button>
                                    </div>
                                  </div>

                                  {/* Written Feedback */}
                                  <div className="space-y-1">
                                    <label className="block font-serif text-[12.5px] text-luxury-dark font-medium">
                                      4. Własne sugestie, uwagi po rytuale lub wrażenia kosmetyczne:
                                    </label>
                                    <textarea
                                      value={surveyFeedback}
                                      onChange={(e) => setSurveyFeedback(e.target.value)}
                                      placeholder="Napisz, co skradło Twoją uwagę, a nad czym możemy wspólnie czuwać przy kolejnym rytuale pielęgnacyjnym..."
                                      className="w-full h-24 bg-white border border-luxury-sand/80 px-3 py-2 text-xs focus:outline-hidden focus:border-luxury-gold text-luxury-dark font-sans placeholder-luxury-dark/30 mt-1"
                                    />
                                  </div>

                                  <button
                                    type="submit"
                                    className="w-full py-3 bg-luxury-dark hover:bg-black text-luxury-gold text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer border border-luxury-gold/15"
                                  >
                                    Wyślij ankietę do administratora &rarr;
                                  </button>
                                </form>
                              )}
                            </motion.div>
                          )}

                          {/* Historical user submissions list */}
                          {reviewsList.length > 0 && (
                            <div className="border-t border-luxury-sand/40 pt-5 space-y-3">
                              <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase block font-bold">Twoja Poczta Opinii Satysfakcji ({reviewsList.length})</span>
                              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                                {reviewsList.map((rev) => (
                                  <div key={rev.id} className="p-3 bg-luxury-sand/5 border border-luxury-sand/30 text-left text-xs space-y-1">
                                    <div className="flex justify-between items-center">
                                      <span className="font-serif font-medium text-luxury-dark text-[13px]">{rev.treatmentTitle}</span>
                                      <span className="text-[8.5px] font-mono text-luxury-dark/90">{rev.date}</span>
                                    </div>
                                    <div className="flex gap-2 items-center text-[11px]">
                                      <span className="text-luxury-gold leading-none gap-0.5">
                                        {"★".repeat(rev.rating)}
                                        {"☆".repeat(5 - rev.rating)}
                                      </span>
                                      <span className="text-[9.5px] text-luxury-dark/90 font-mono">
                                        | Standard: {rev.rating}/5 | Otoczenie: {rev.atmosphereRating}/5 | Reset: {rev.relaxationFeel.toUpperCase()}
                                      </span>
                                    </div>
                                    {rev.feedback && (
                                      <p className="text-[11px] text-luxury-dark/95 font-light italic mt-1.5 bg-white/70 p-2.5 border-l border-luxury-gold/60 leading-normal">
                                        "{rev.feedback}"
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Membership benefits */}
                          <div className="bg-luxury-sand/15 p-6 space-y-4 border border-dashed border-luxury-sand">
                            <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase block font-bold">Dedykowane Korzyści Slow Skin Pass</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-luxury-dark">
                              <div className="space-y-1 block">
                                <span className="font-serif font-semibold text-luxury-dark">1. Stałe wsparcie komórkowe</span>
                                <p className="text-[11px] text-luxury-dark/95 leading-normal">Całodobowy kontakt z mgr Katarzyną Brzezińską drogą mailową w razie nagłej nadwrażliwości skóry.</p>
                              </div>
                              <div className="space-y-1 block">
                                <span className="font-serif font-semibold text-luxury-dark">2. Wygodny dostęp do kalendarza</span>
                                <p className="text-[11px] text-luxury-dark/95 leading-normal">Dostęp do kalendarza na 30 dni przed oficjalnym otwarciem zapisów dla nowych klientów.</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="beauty-plan-content"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="border-b border-luxury-sand/40 pb-4">
                            <h3 className="font-serif text-2xl font-light text-luxury-dark">Mój Beauty Plan</h3>
                            <p className="text-xs text-luxury-dark/90 font-light mt-1">Twój codzienny bionomiczny kalendarz pielęgnacyjny z przypomnieniami push w przeglądarce.</p>
                          </div>

                          {/* Notifications Settings Cards */}
                          <div className="bg-luxury-cream border border-luxury-sand/60 p-5 space-y-4 relative overflow-hidden" id="notif-settings-panel">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="space-y-1 text-left">
                                <span className="font-mono text-[8.5px] tracking-widest text-luxury-gold uppercase font-bold block">Ustawienia Powiadomień Push</span>
                                <h4 className="font-serif text-base text-luxury-dark leading-tight">Przypomnienia w przeglądarce</h4>
                                <p className="text-[11px] text-luxury-dark/95 font-light">System wyśle natychmiastowe przypomnienie push na Twój pulpit o ustawionych godzinach.</p>
                              </div>

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                                {/* Status badge */}
                                <div className="text-center font-mono text-[9px] tracking-widest uppercase py-1.5 px-3 border border-luxury-sand bg-white flex items-center justify-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${beautyPlan.isPushEnabled ? "bg-emerald-600 animate-pulse" : "bg-luxury-dark/30"}`} />
                                  <span>PERMISJA: </span>
                                  <span className={notificationPermission === "granted" ? "text-emerald-700 font-bold" : notificationPermission === "denied" ? "text-amber-800 font-bold" : "text-luxury-dark/90"}>
                                    {notificationPermission === "granted" ? "ZEZWOLONO" : notificationPermission === "denied" ? "ZABLOKOWANO" : "ZAPYTAJ"}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={togglePushNotifications}
                                  className={`px-5 py-2.5 font-mono text-[10px] tracking-wider uppercase transition-all duration-300 font-medium cursor-pointer flex items-center justify-center gap-2 ${beautyPlan.isPushEnabled ? "bg-luxury-dark text-white hover:bg-black" : "bg-luxury-gold text-white hover:bg-luxury-dark"}`}
                                >
                                  {beautyPlan.isPushEnabled ? (
                                    <>
                                      <BellOff className="w-3.5 h-3.5" /> Wyłącz Powiadomienia
                                    </>
                                  ) : (
                                    <>
                                      <Bell className="w-3.5 h-3.5" /> Włącz Przypomnienia
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Configurations times */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-luxury-sand/30 pt-4 font-mono text-[11px]">
                              <div className="flex items-center justify-between bg-white border border-luxury-sand p-3">
                                <span className="flex items-center gap-2 text-luxury-dark/95 uppercase text-[9px] tracking-wider font-bold">
                                  <Sun className="w-3.5 h-3.5 text-luxury-gold" /> Rytuał Poranny:
                                </span>
                                <input
                                  type="time"
                                  value={beautyPlan.morningReminderTime}
                                  onChange={(e) => handleUpdateReminderTime("morning", e.target.value)}
                                  className="border-0 outline-none p-0 text-right text-xs bg-transparent text-luxury-dark font-medium cursor-pointer max-w-[70px] select-all focus:ring-0 focus:border-0"
                                />
                              </div>

                              <div className="flex items-center justify-between bg-white border border-luxury-sand p-3">
                                <span className="flex items-center gap-2 text-luxury-dark/95 uppercase text-[9px] tracking-wider font-bold">
                                  <Moon className="w-3.5 h-3.5 text-indigo-900" /> Rytuał Wieczorny:
                                </span>
                                <input
                                  type="time"
                                  value={beautyPlan.eveningReminderTime}
                                  onChange={(e) => handleUpdateReminderTime("evening", e.target.value)}
                                  className="border-0 outline-none p-0 text-right text-xs bg-transparent text-luxury-dark font-medium cursor-pointer max-w-[70px] select-all focus:ring-0 focus:border-0"
                                />
                              </div>
                            </div>

                            {/* Manual Notification Spurt Test */}
                            <div className="flex items-center justify-between bg-luxury-sand/15 border border-dashed border-luxury-sand p-3.5 text-[11px] text-luxury-dark/95 font-light rounded-none">
                              <span>Przetestuj działanie autentycznych powiadomień w swojej przeglądarce:</span>
                              <button
                                type="button"
                                onClick={handleTestNotification}
                                className="px-3.5 py-1.5 border border-luxury-dark text-luxury-dark font-mono text-[9px] uppercase tracking-wider hover:bg-luxury-dark hover:text-white transition-all cursor-pointer inline-flex items-center gap-1 shrink-0 ml-2"
                                id="btn-test-push"
                              >
                                Wyślij Test Push &rarr;
                              </button>
                            </div>
                          </div>

                          {/* Beauty Plan Morning vs Evening Sections */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            
                            {/* MORNING ROUTINE */}
                            <div className="space-y-4" id="morning-routine-section">
                              <div className="flex justify-between items-center border-b border-luxury-sand pb-2">
                                <h4 className="font-serif text-lg font-light text-luxury-dark flex items-center gap-2">
                                  <Sun className="w-4 h-4 text-luxury-gold" /> Pielęgnacja Poranna
                                </h4>
                                <span className="font-mono text-[9px] tracking-widest uppercase bg-luxury-sand/25 px-2 py-0.5 text-luxury-dark/95 font-semibold">RANO</span>
                              </div>

                              <div className="space-y-3.5">
                                {beautyPlan.morning.map((step: any) => {
                                  const isEditing = editingStepId === step.id;
                                  return (
                                    <div 
                                      key={step.id} 
                                      className={`p-4 border transition-all duration-300 relative group text-left ${step.completed ? "border-luxury-sand/40 bg-luxury-sand/5 opacity-70" : "border-luxury-sand hover:border-luxury-gold/50 bg-white"}`}
                                    >
                                      {isEditing ? (
                                        /* Editing routine step */
                                        <div className="space-y-3">
                                          <div className="flex gap-2">
                                            <input 
                                              type="text" 
                                              value={editTitle}
                                              onChange={(e) => setEditTitle(e.target.value)}
                                              placeholder="Nazwa preparatu / krok"
                                              className="w-full bg-white border border-luxury-sand p-2 text-xs outline-0 text-luxury-dark focus:border-luxury-gold"
                                            />
                                            <input 
                                              type="time" 
                                              value={editTime}
                                              onChange={(e) => setEditTime(e.target.value)}
                                              className="bg-white border border-luxury-sand p-2 text-xs outline-0 text-luxury-dark focus:border-luxury-gold max-w-[85px] cursor-pointer"
                                            />
                                          </div>
                                          <textarea 
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                            placeholder="Sposób bionomicznego nakładania..."
                                            rows={2}
                                            className="w-full bg-white border border-luxury-sand p-2 text-xs outline-0 text-luxury-dark focus:border-luxury-gold resize-none"
                                          />
                                          <div className="flex justify-end gap-2 text-xs">
                                            <button 
                                              onClick={() => setEditingStepId(null)}
                                              className="px-2.5 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors uppercase font-mono text-[9px] tracking-wider cursor-pointer"
                                            >
                                              Anuluj
                                            </button>
                                            <button 
                                              onClick={() => saveStep("morning", step.id)}
                                              className="px-2.5 py-1 bg-luxury-dark text-white hover:bg-luxury-gold transition-colors uppercase font-mono text-[9px] tracking-wider font-semibold cursor-pointer inline-flex items-center gap-1"
                                            >
                                              <Save className="w-3 h-3" /> Zapisz
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* Display routine step */
                                        <div className="flex items-start gap-3">
                                          <input 
                                            type="checkbox"
                                            checked={step.completed}
                                            onChange={() => toggleStepCompleted("morning", step.id)}
                                            className="mt-1 border-luxury-sand text-luxury-gold focus:ring-luxury-gold cursor-pointer w-4 h-4 rounded-none"
                                            title="Zaznacz jako wykonany"
                                          />
                                          <div className="space-y-1 fill-inherit flex-1">
                                            <div className="flex gap-2 items-baseline">
                                              <span className="font-mono text-[10px] text-luxury-gold font-bold px-1.5 py-0.5 bg-luxury-cream border border-luxury-sand/30 leading-none shrink-0">{step.time}</span>
                                              <h5 className={`font-serif text-[13.5px] font-medium leading-none ${step.completed ? "line-through text-luxury-dark/90" : "text-luxury-dark"}`}>{step.title}</h5>
                                            </div>
                                            <p className="text-[11px] text-luxury-dark/95 font-light leading-normal">{step.desc}</p>
                                          </div>

                                          {/* Options float */}
                                          <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0 self-center">
                                            <button
                                              onClick={() => startEditing(step)}
                                              className="p-1 text-luxury-dark/90 hover:text-luxury-gold transition-colors cursor-pointer"
                                              title="Edytuj krok"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteStep("morning", step.id)}
                                              className="p-1 text-luxury-dark/90 hover:text-red-700 transition-colors cursor-pointer"
                                              title="Usuń krok"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              <button
                                onClick={() => handleAddStep("morning")}
                                className="w-full py-2.5 border border-dashed border-luxury-sand text-luxury-gold text-xs font-mono tracking-widest uppercase hover:bg-luxury-cream transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                              >
                                <Plus className="w-4 h-4" /> Dodaj krok poranny
                              </button>
                            </div>

                            {/* EVENING ROUTINE */}
                            <div className="space-y-4" id="evening-routine-section">
                              <div className="flex justify-between items-center border-b border-luxury-sand pb-2 font-serif">
                                <h4 className="font-serif text-lg font-light text-luxury-dark flex items-center gap-2">
                                  <Moon className="w-4 h-4 text-indigo-900" /> Pielęgnacja Wieczorna
                                </h4>
                                <span className="font-mono text-[9px] tracking-widest uppercase bg-luxury-sand/25 px-2 py-0.5 text-luxury-dark/95 font-semibold">WIECZÓR</span>
                              </div>

                              <div className="space-y-3.5">
                                {beautyPlan.evening.map((step: any) => {
                                  const isEditing = editingStepId === step.id;
                                  return (
                                    <div 
                                      key={step.id} 
                                      className={`p-4 border transition-all duration-300 relative group text-left ${step.completed ? "border-luxury-sand/40 bg-luxury-sand/5 opacity-70" : "border-luxury-sand hover:border-luxury-gold/50 bg-white"}`}
                                    >
                                      {isEditing ? (
                                        /* Editing routine step */
                                        <div className="space-y-3">
                                          <div className="flex gap-2">
                                            <input 
                                              type="text" 
                                              value={editTitle}
                                              onChange={(e) => setEditTitle(e.target.value)}
                                              placeholder="Nazwa preparatu / krok"
                                              className="w-full bg-white border border-luxury-sand p-2 text-xs outline-0 text-luxury-dark focus:border-luxury-gold"
                                            />
                                            <input 
                                              type="time" 
                                              value={editTime}
                                              onChange={(e) => setEditTime(e.target.value)}
                                              className="bg-white border border-luxury-sand p-2 text-xs outline-0 text-luxury-dark focus:border-luxury-gold max-w-[85px] cursor-pointer"
                                            />
                                          </div>
                                          <textarea 
                                            value={editDesc}
                                            onChange={(e) => setEditDesc(e.target.value)}
                                            placeholder="Sposób bionomicznego nakładania..."
                                            rows={2}
                                            className="w-full bg-white border border-luxury-sand p-2 text-xs outline-0 text-luxury-dark focus:border-luxury-gold resize-none"
                                          />
                                          <div className="flex justify-end gap-2 text-xs">
                                            <button 
                                              onClick={() => setEditingStepId(null)}
                                              className="px-2.5 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors uppercase font-mono text-[9px] tracking-wider cursor-pointer"
                                            >
                                              Anuluj
                                            </button>
                                            <button 
                                              onClick={() => saveStep("evening", step.id)}
                                              className="px-2.5 py-1 bg-luxury-dark text-white hover:bg-luxury-gold transition-colors uppercase font-mono text-[9px] tracking-wider font-semibold cursor-pointer inline-flex items-center gap-1"
                                            >
                                              <Save className="w-3 h-3" /> Zapisz
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        /* Display routine step */
                                        <div className="flex items-start gap-3">
                                          <input 
                                            type="checkbox"
                                            checked={step.completed}
                                            onChange={() => toggleStepCompleted("evening", step.id)}
                                            className="mt-1 border-luxury-sand text-luxury-gold focus:ring-luxury-gold cursor-pointer w-4 h-4 rounded-none"
                                            title="Zaznacz jako wykonany"
                                          />
                                          <div className="space-y-1 fill-inherit flex-1 text-left">
                                            <div className="flex gap-2 items-baseline text-left">
                                              <span className="font-mono text-[10px] text-luxury-gold font-bold px-1.5 py-0.5 bg-luxury-cream border border-luxury-sand/30 leading-none shrink-0">{step.time}</span>
                                              <h5 className={`font-serif text-[13.5px] font-medium leading-none ${step.completed ? "line-through text-luxury-dark/90" : "text-luxury-dark"}`}>{step.title}</h5>
                                            </div>
                                            <p className="text-[11px] text-luxury-dark/95 font-light leading-normal text-left">{step.desc}</p>
                                          </div>

                                          {/* Options float */}
                                          <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0 self-center">
                                            <button
                                              onClick={() => startEditing(step)}
                                              className="p-1 text-luxury-dark/90 hover:text-luxury-gold transition-colors cursor-pointer"
                                              title="Edytuj krok"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteStep("evening", step.id)}
                                              className="p-1 text-luxury-dark/90 hover:text-red-700 transition-colors cursor-pointer"
                                              title="Usuń krok"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              <button
                                onClick={() => handleAddStep("evening")}
                                className="w-full py-2.5 border border-dashed border-luxury-sand text-luxury-gold text-xs font-mono tracking-widest uppercase hover:bg-luxury-cream transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                              >
                                <Plus className="w-4 h-4" /> Dodaj krok wieczorny
                              </button>
                            </div>

                          </div>

                          {/* Quick resets helper */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-luxury-sand/30 justify-between items-center text-xs text-luxury-dark/95 font-light text-left">
                            <span>Zauważyłaś niepożądaną reakcję skóry? Skonsultuj się ze swoim kosmetologiem przed modyfikacją kroków bionomicznych.</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Ta operacja przywróci wyjściowy bionomiczny harmonogram i wyczyści dotychczas dodane kroki niefizjologiczne. Czy kontynuować?")) {
                                  safeStorage.removeItem("slowskin_beauty_plan");
                                  window.location.reload();
                                }
                              }}
                              className="text-luxury-gold hover:underline font-mono text-[9px] tracking-wider uppercase inline-flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              ✕ Przywróć bionomiczny baseline
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* TAB 7: SKLEP AUTORSKI & BUTIK BIONOMICZNY */}
          {activeTab === "shop" && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="notranslate"
              id="tab-shop"
            >
              <ShopPage 
                onLinkClick={handleLinkClick}
                onOpenBooking={(t) => {
                  if (t) setBookingTreatment(t);
                  else setBookingTreatment(TREATMENTS[0]);
                }}
              />
            </motion.div>
          )}

          {/* TAB 8: SZKOLENIA I WSPÓŁPRACA B2B DLA GABINETÓW */}
          {activeTab === "training" && (
            <motion.div
              key="training"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="notranslate"
              id="tab-training"
            >
              <TrainingPage 
                onLinkClick={handleLinkClick}
                onOpenBooking={(t) => {
                  if (t) setBookingTreatment(t);
                  else setBookingTreatment(TREATMENTS[0]);
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ELEGANCKA SEKCJA NEWSLETTERA: ZOSTAŃMY W KONTAKCIE (10% NA KONSULTACJĘ) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 mb-4">
        <NewsletterSection variant="full" />
      </div>

      {/* FOOTER */}
      <footer className="border-t border-luxury-sand bg-white py-16 px-6 mt-16 text-xs text-luxury-dark/95 font-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Col 1: Brand philosophy */}
          <div className="lg:col-span-3 space-y-4">
            <div 
              onClick={() => { setActiveTab("cover"); setSelectedArticle(null); setSelectedTreatment(null); }}
              className="cursor-pointer inline-block"
            >
              <BrandLogo className="h-9 sm:h-11 w-auto object-left" variant="footer" />
            </div>
            <p className="text-xs leading-relaxed text-luxury-dark/90">
              Kameralny gabinet pielęgnacji skóry w Jelczu-Laskowicach. Tworzymy przyjazną, spokojną przestrzeń, w której wspieramy naturalną regenerację i zdrowie Twojej skóry.
            </p>
            
            {/* Social Media icons in Quiet Luxury style */}
            <div className="pt-2 flex items-center gap-4 text-luxury-dark/90">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors duration-300" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors duration-300" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors duration-300 flex items-center justify-center" aria-label="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.59-.67-.02 2.87-.01 5.73-.02 8.59-.11 1.78-.81 3.53-2.11 4.75-1.57 1.48-3.83 2.15-5.96 1.83-2.3-.35-4.38-2.02-5-4.27-.81-2.91.43-6.19 3.09-7.44.82-.39 1.73-.59 2.65-.59.01 1.47 0 2.94.01 4.41-.69.04-1.41.25-1.95.7-1.13.92-1.25 2.76-.23 3.82.78.81 2.05.99 3.02.43.7-.4 1.13-1.15 1.15-1.96.02-3.41.01-6.82.02-10.23-.02-1.17-.01-2.35-.02-3.52z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors duration-300" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            <p className="font-mono text-[9px] text-luxury-gold tracking-[0.1em] uppercase pt-1">© {currentYear} Slow Skin Concept. Wszelkie prawa zastrzeżone.</p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-3 font-mono text-[8.5px] tracking-wider text-luxury-dark/95 uppercase">
              <button 
                onClick={() => setOpenPolicyModal("privacy")} 
                className="hover:text-luxury-gold transition-colors hover:underline cursor-pointer"
              >
                Prywatność (RODO)
              </button>
              <span className="text-luxury-sand/60 select-none">•</span>
              <button 
                onClick={() => setIsCookiesPolicyOpen(true)} 
                className="hover:text-luxury-gold transition-colors hover:underline cursor-pointer font-medium text-luxury-dark"
                id="footer-cookies-policy-link"
              >
                Polityka cookies
              </button>
              <span className="text-luxury-sand/60 select-none">•</span>
              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("openCookieSettings"));
                }} 
                className="text-luxury-gold hover:underline cursor-pointer font-semibold transition-colors flex items-center gap-1"
                id="footer-change-cookie-settings-btn"
                title="Dostosuj preferencje plików cookies i wycofaj zgody"
              >
                <span>Zmień ustawienia cookies</span>
              </button>
              <span className="text-luxury-sand/60 select-none">•</span>
              <button 
                onClick={() => setOpenPolicyModal("terms")} 
                className="hover:text-luxury-gold transition-colors hover:underline cursor-pointer"
              >
                Regulamin i Bezpieczeństwo
              </button>
            </div>
          </div>

          {/* Col 2: Locations */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-medium">Lokalizacja & Azyl</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Slow+Skin+Concept+Szkolna+5+55-220+Jelcz-Laskowice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-luxury-gold transition-colors block text-left group"
                >
                  <p className="font-medium text-luxury-dark font-mono text-[10px] uppercase tracking-wide group-hover:text-luxury-gold transition-colors leading-relaxed">
                    Instytut Zdrowej Skóry SLOW SKIN CONCEPT
                  </p>
                  <p className="text-xs text-luxury-dark/90 group-hover:text-luxury-dark/95 transition-colors">ul. Szkolna 5</p>
                  <p className="text-xs text-luxury-dark/90 group-hover:text-luxury-dark/95 transition-colors">55-220 Jelcz-Laskowice (k. Wrocławia)</p>
                </a>
              </div>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] text-luxury-dark/90 pt-1 pb-1">
              <p>Poniedziałek - Piątek: 10:00 - 19:30</p>
              <p>Sobota i Niedziela: Nieczynne</p>
              <p className="pt-0.5">
                E-mail recepcji:{" "}
                <a href="mailto:slowskinconcept@gmail.com" className="text-luxury-gold underline hover:text-luxury-dark font-medium">
                  slowskinconcept@gmail.com
                </a>
              </p>
              <p>
                WhatsApp recepcji:{" "}
                <a 
                  href="https://wa.me/48793088854?text=Dzie%C5%84%20dobry!%20Chc%C4%99%20zapyta%C4%87%20o%20wizyt%C4%99%20w%20Instytucie%20Slow%20Skin%20Concept."
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  +48 793 088 854 ↗
                </a>
              </p>
            </div>
            
            {/* Elegant Pulsing Pin Navigation & Language Selector Widget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" id="pulsing-pin-section">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Slow+Skin+Concept,+Szkolna+5,+55-220+Jelcz-Laskowice"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-4 border border-luxury-sand bg-luxury-sand/5 hover:border-luxury-gold hover:bg-luxury-sand/15 transition-all duration-500 relative overflow-hidden text-center cursor-pointer h-full"
                title="Rozpocznij nawigację i dojazd"
                id="footer-navigation-link"
              >
                {/* Pulsing dot & Ring effect */}
                <div className="relative flex items-center justify-center mb-2.5">
                  {/* Outer waves */}
                  <span className="absolute inline-flex h-10 w-10 rounded-full bg-luxury-gold/15 animate-ping" />
                  <span className="absolute inline-flex h-7 w-7 rounded-full bg-luxury-gold/25 animate-pulse" />
                  {/* Core Pin */}
                  <div className="relative bg-luxury-dark text-white border border-luxury-gold w-8 h-8 rounded-full flex items-center justify-center shadow-md group-hover:bg-luxury-gold group-hover:border-white transition-colors duration-500">
                    <MapPin className="w-4 h-4 text-luxury-gold group-hover:text-white transition-all duration-500" />
                  </div>
                </div>
                
                <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-luxury-gold font-semibold duration-300 inline-flex items-center gap-1 transition-all">
                  Nawigacja (Dojazd) ↗
                </span>
                <span className="text-[9px] text-luxury-dark/90 font-mono mt-0.5 group-hover:text-luxury-dark/95 transition-colors">
                  ul. Szkolna 5
                </span>
              </a>

              {/* Bionomic Language Selector */}
              <div 
                className="group/lang flex flex-col justify-between p-4 border border-luxury-sand/80 bg-luxury-sand/5 hover:border-luxury-gold transition-all duration-500 relative text-center h-full min-h-[110px]"
                id="footer-language-sanctuary"
              >
                <div className="space-y-1 mb-1">
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-luxury-gold font-semibold block">
                    GUEST SANCTUARY
                  </span>
                  <span className="text-[9px] text-luxury-dark/90 font-sans block leading-tight">
                    Wybierz wersję językową:
                  </span>
                </div>

                {/* Elegant Hover-triggered Dropdown */}
                <div className="relative mt-2 z-30">
                  {/* Current Active Option/Trigger */}
                  <div className="outline-none w-full bg-white border border-luxury-sand/65 px-3 py-2 flex items-center justify-between text-[11px] font-mono text-luxury-dark cursor-pointer hover:border-luxury-gold transition-all duration-300">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>
                        {
                          {
                            PL: "PL (POLSKI)",
                            EN: "EN (ENGLISH)",
                            DE: "DE (DEUTSCH)",
                            UA: "UA (УКРАЇНСЬКА)",
                            IT: "IT (ITALIANO)"
                          }[currentLanguage] || currentLanguage
                        }
                      </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-luxury-gold transition-transform duration-300 group-hover/lang:rotate-180" />
                  </div>

                  {/* Absolute Dropdown Items (Renders above on hover) */}
                  <div 
                    className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-luxury-sand/70 shadow-xl opacity-0 translate-y-1 invisible pointer-events-none group-hover/lang:opacity-100 group-hover/lang:translate-y-0 group-hover/lang:visible group-hover/lang:pointer-events-auto transition-all duration-300 flex flex-col py-1 text-left"
                  >
                    {[
                      { code: "PL", name: "Polski" },
                      { code: "EN", name: "English" },
                      { code: "DE", name: "Deutsch" },
                      { code: "UA", name: "Українська" },
                      { code: "IT", name: "Italiano" }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code as any)}
                        className={`w-full px-4 py-2 text-left font-mono text-[10px] tracking-wide transition-all cursor-pointer flex items-center justify-between hover:bg-luxury-sand/15 ${
                          currentLanguage === lang.code
                            ? "bg-luxury-sand/10 text-luxury-gold font-semibold"
                            : "text-luxury-dark/95 hover:text-luxury-gold"
                        }`}
                      >
                        <span>{lang.code} — {lang.name}</span>
                        {currentLanguage === lang.code && <Check className="w-3 h-3 text-luxury-gold" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Bestsellers & Portale */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] tracking-widest text-luxury-gold uppercase font-medium">Bestsellery & Portale</h4>
            <ul className="space-y-2.5 text-xs">
              {TREATMENTS.slice(0, 2).map((treatment) => (
                <li key={treatment.id}>
                  <button
                    onClick={() => {
                      setActiveTab("clinic");
                      setSelectedTreatment(treatment);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group flex flex-col text-left cursor-pointer transition-all duration-300 w-full"
                  >
                    <span className="font-serif text-luxury-dark group-hover:text-luxury-gold transition-colors duration-300 flex items-center gap-1 leading-snug">
                      {treatment.title.replace("Slow Skin Concept™ — ", "")}
                      <span className="text-[9px] text-luxury-gold font-mono tracking-normal opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                    </span>
                    <span className="font-mono text-[9px] text-luxury-dark/90 uppercase group-hover:text-luxury-gold/60 transition-colors duration-300">
                      {treatment.duration} • {treatment.price}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-luxury-sand/30 space-y-1.5">
              <h5 className="font-mono text-[9px] tracking-widest text-luxury-gold uppercase font-semibold">Nowości & Portale</h5>
              <div className="flex flex-col space-y-1 text-xs">
                <button 
                  onClick={() => handleLinkClick("/ceragem-thermal-massage/")}
                  className="text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center justify-between font-mono text-[10px] uppercase text-left"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                    <span>Masaż Termiczny Ceragem (50 zł)</span>
                  </span>
                  <span className="text-luxury-gold">→</span>
                </button>
                <button 
                  onClick={() => handleLinkClick("/sonaris-pro-therapy/")}
                  className="text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center justify-between font-mono text-[10px] uppercase text-left"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                    <span>Sonaris Pro Therapy (od 180 zł)</span>
                  </span>
                  <span className="text-luxury-gold">→</span>
                </button>
                <button 
                  onClick={() => handleLinkClick("/tissue-stimulators/")}
                  className="text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center justify-between font-mono text-[10px] uppercase text-left"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                    <span>Stymulatory Tkankowe (od 800 zł)</span>
                  </span>
                  <span className="text-luxury-gold">→</span>
                </button>
                <button 
                  onClick={() => handleLinkClick("/pst-signal-therapy/")}
                  className="text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center justify-between font-mono text-[10px] uppercase text-left"
                >
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-sand"></span>
                    <span>Terapia Sygnałem PST (od 110 zł)</span>
                  </span>
                  <span className="text-luxury-gold">→</span>
                </button>
                <a 
                  href="https://slow-skin.shop/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center justify-between font-mono text-[10px] uppercase pt-1 border-t border-luxury-sand/20"
                >
                  <span>Sklep Online (slow-skin.shop)</span>
                  <span className="text-luxury-gold">↗</span>
                </a>
                <a 
                  href="https://szkolenia.slowskinconcept.pl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-luxury-dark/95 hover:text-luxury-gold transition-colors flex items-center justify-between font-mono text-[10px] uppercase"
                >
                  <span>Portal Szkoleniowy B2B</span>
                  <span className="text-luxury-gold">↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter Section (Wspólny newsletter ze sklepem slow-skin.shop, 10% rabat na konsultację) */}
          <div className="lg:col-span-3">
            <NewsletterSection variant="compact" />
          </div>

        </div>
      </footer>

      {/* BOOKING INVITATION MODAL WITH GOOGLE CALENDAR */}
      <AnimatePresence>
        {bookingTreatment && (
          <BookingModal 
            treatment={bookingTreatment} 
            onClose={() => setBookingTreatment(null)} 
          />
        )}
      </AnimatePresence>

      {/* INTERNATIONAL LANG SANCTUARY MODAL */}
      <AnimatePresence>
        {isLanguageModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-luxury-dark/80 backdrop-blur-md z-50 flex items-center justify-center p-4 print:hidden"
            id="language-sanctuary-modal-backdrop"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-luxury-cream border-2 border-luxury-sand p-6 md:p-10 max-w-xl w-full relative space-y-6 max-h-[90vh] overflow-y-auto text-left"
              id="language-sanctuary-modal-card"
            >
              {/* Close Cross */}
              <button 
                onClick={() => setIsLanguageModalOpen(false)}
                className="absolute top-4 right-4 text-luxury-dark/90 hover:text-luxury-dark text-lg font-mono cursor-pointer"
                aria-label="Zamknij"
              >
                ✕
              </button>

              {/* Silent seal watermark */}
              <div className="absolute top-2 right-24 w-24 h-24 rounded-full border border-dashed border-luxury-gold/10 flex items-center justify-center font-mono text-[5.5px] text-luxury-gold/15 uppercase select-none pointer-events-none tracking-widest rotate-12">
                <span className="text-center block font-serif leading-none p-2 animate-[spin_50s_linear_infinite]">SLOW<br/>SKIN<br/>GUEST</span>
              </div>

              {(() => {
                const data = LANGUAGE_SANCTUARY_DATA[currentLanguage as keyof typeof LANGUAGE_SANCTUARY_DATA] || LANGUAGE_SANCTUARY_DATA.EN;
                return (
                  <div className="space-y-5">
                    <div className="space-y-1 border-b border-luxury-sand/40 pb-4 pr-12">
                      <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">
                        {data.badge}
                      </span>
                      <h3 className="font-serif text-2.5xl md:text-3xl font-light text-luxury-dark tracking-tight leading-tight">
                        {data.title}
                      </h3>
                      <p className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase opacity-85 mt-1">
                        {data.sub}
                      </p>
                    </div>

                    <p className="text-xs text-luxury-dark font-medium leading-relaxed font-serif">
                      {data.text1}
                    </p>

                    <p className="text-xs text-luxury-dark/95 leading-relaxed font-light">
                      {data.text2}
                    </p>

                    <div className="bg-white/40 border border-luxury-sand/40 p-5 space-y-3.5 rounded-none">
                      <h4 className="font-mono text-[9px] tracking-wider text-luxury-gold uppercase font-bold">
                        {data.featuresTitle}
                      </h4>
                      <ul className="space-y-2.5 text-xs text-luxury-dark font-light pr-1">
                        {data.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-snug">
                            <span className="text-luxury-gold font-mono text-[10px] mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setIsLanguageModalOpen(false);
                          setBookingTreatment(TREATMENTS[0]); // Zawsze zaczynamy od diagnostyki jako klucza Slow Skin
                        }}
                        className="flex-1 py-3.5 bg-luxury-gold hover:bg-luxury-dark text-white hover:text-luxury-cream text-xs font-mono tracking-widest uppercase transition-all duration-300 text-center font-semibold cursor-pointer rounded-none shadow-xs text-[10px]"
                      >
                        {data.cta} &rarr;
                      </button>

                      <button
                        onClick={() => setIsLanguageModalOpen(false)}
                        className="py-3.5 px-6 border border-luxury-dark/40 hover:bg-luxury-dark hover:text-white hover:border-luxury-dark text-xs font-mono tracking-widest uppercase transition-all duration-300 text-center cursor-pointer rounded-none text-[10px]"
                      >
                        {currentLanguage === "PL" ? "Zamknij" : "Close"}
                      </button>
                    </div>

                    <div className="pt-1.5 text-center">
                      <span className="font-mono text-[8px] tracking-[0.2em] text-luxury-gold/60 uppercase">
                        ✓ {data.langStatus}
                      </span>
                    </div>

                  </div>
                );
              })()}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEGAL POLICIES MODAL */}
      <AnimatePresence>
        {openPolicyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-luxury-dark/80 backdrop-blur-md z-50 flex items-center justify-center p-4 print:hidden"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-luxury-cream border-2 border-luxury-sand p-6 md:p-10 max-w-2xl w-full relative space-y-6 max-h-[85vh] overflow-y-auto"
            >
              {/* Close Cross */}
              <button 
                onClick={() => setOpenPolicyModal(null)}
                className="absolute top-4 right-4 text-luxury-dark/90 hover:text-luxury-dark text-lg font-mono cursor-pointer"
                aria-label="Zamknij"
              >
                ✕
              </button>

              {openPolicyModal === "privacy" && (
                <div className="space-y-4 text-left">
                  <div className="text-center space-y-1.5 border-b border-luxury-sand/40 pb-4">
                    <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">Zgodność RODO</span>
                    <h3 className="font-serif text-2xl font-light text-luxury-dark text-center">Polityka Prywatności i Ochrona Danych</h3>
                    <p className="text-[10px] text-luxury-gold font-mono uppercase text-center">Slow Skin Concept — Instytut Zdrowej Skóry</p>
                  </div>

                  <div className="space-y-4 text-xs leading-relaxed text-luxury-dark font-light overflow-y-auto pr-2">
                    <p>
                      Szanując Twoją prywatność oraz dbając o nienaganne standardy etyki, przedstawiamy zasady przetwarzania danych osobowych w naszym Instytucie oraz w ramach niniejszej witryny, zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">1. Administrator Danych Osobowych</h4>
                      <p>
                        Administratorem Twoich danych osobowych jest <strong>Katarzyna Brzezińska</strong>, prowadząca działalność gospodarczą pod nazwą: <strong>Instytut Zdrowej Skóry SLOW SKIN CONCEPT</strong>, z siedzibą przy ul. Szkolnej 5, 55-220 Jelcz-Laskowice. Wszelkie pytania dotyczące ochrony prywatności można kierować na adres e-mail: <a href="mailto:baumann.jelcz@wp.pl" className="font-mono text-luxury-gold underline hover:text-luxury-dark">baumann.jelcz@wp.pl</a>.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">2. Cele, Zakres i Podstawa Prawna Przetwarzania</h4>
                      <ul className="list-disc pl-4 space-y-1.5">
                        <li><strong>Obsługa rezerwacji i zapytań:</strong> Przetwarzamy Twoje imię, nazwisko, e-mail oraz numer telefonu na podstawie Art. 6 ust. 1 lit. b RODO (niezbędność do wykonania umowy lub podjęcia działań przed jej zawarciem).</li>
                        <li><strong>Audyt Komórkowy Slow Skin™ (Opcjonalny test):</strong> Dobrowolnie przesyłane informacje o parametrach Twojej skóry i stylu życia przetwarzane są na podstawie wyraźnej zgody (Art. 9 ust. 2 lit. a RODO - dane dotyczące zdrowia/fizjologii skóry), wyłącznie w celu automatycznego opracowania spersonalizowanego Paszportu Skóry™.</li>
                        <li><strong>Kameralny Dziennik (Newsletter):</strong> Przetwarzamy Twój adres e-mail w oparciu o udzieloną zgodę (Art. 6 ust. 1 lit. a RODO) w celu wysyłki autorskich artykułów edukacyjnych oraz informacji o dostępnych wolnych terminach wizyt w gabinecie.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">3. Okres Przechowywania Danych</h4>
                      <p>
                        Dane pozyskane w procesie wniosku o rezerwację przechowujemy przez czas niezbędny do przeprowadzenia konsultacji i ewentualnego wykonania zabiegu oraz dochodzenia ewentualnych roszczeń. Dane do wysyłki newslettera są przetwarzane do czasu odwołania zgody (wypisania się przez odnośnik lub bezpośredni kontakt z Instytutem).
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">4. Odbiorcy Danych i Bezpieczeństwo</h4>
                      <p>
                        Twoje dane mogą być przekazywane wyłącznie zaufanym podmiotom zapewniającym obsługę techniczną, hostingową oraz komunikacyjną naszej witryny. Nie sprzedajemy, nie wymieniamy ani nie udostępniamy Twoich danych podmiotom komercyjnym na cele marketingowe. Dane są należycie chronione przed nieuprawnionym dostępem i zaszyfrowane.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">5. Twoje Prawa</h4>
                      <p>
                        Posiadasz prawo do dostępu do swoich danych, ich sprostowania, usunięcia (prawo do bycia zapomnianym), ograniczenia przetwarzania, wniesienia sprzeciwu wobec przetwarzania, przenoszenia danych oraz do wycofania zgody w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania przed jej wycofaniem. Masz również prawo wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych (UODO).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {openPolicyModal === "terms" && (
                <div className="space-y-4 text-left">
                  <div className="text-center space-y-1.5 border-b border-luxury-sand/40 pb-4">
                    <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">Standardy Bezpieczeństwa</span>
                    <h3 className="font-serif text-2xl font-light text-luxury-dark text-center">Regulamin Instytutu i Etyka Zabiegowa</h3>
                    <p className="text-[10px] text-luxury-gold font-mono uppercase text-center">Slow Skin Concept — Instytut Zdrowej Skóry</p>
                  </div>

                  <div className="space-y-4 text-xs leading-relaxed text-luxury-dark font-light overflow-y-auto pr-2">
                    <p>
                      Niniejszy dokument określa warunki organizacyjne świadczenia usług kosmetologii estetycznej i bionomicznej w Instytucie Zdrowej Skóry SLOW SKIN CONCEPT przy ul. Szkolnej 5, 55-220 Jelcz-Laskowice.
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">1. Standard Opieki i Czasu</h4>
                      <p>
                        Nasz gabinet hołduje ideologii slow beauty. Aby zapewnić Ci najwyższy poziom intymności oraz niczym niezakłóconej ciszy sensorycznej, w trakcie Twojej wizyty gabinet oraz recepcja są rezerwowane wyłącznie dla Ciebie na wyłączność. Standardowa rezerwacja rytuału obejmuje pełny dedykowany czas opieki Katarzyny Brzezińskiej bez pośpiechu i obecności innych osób postronnych.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">2. Zasady Rezerwacji i Odwoływania Wizyt</h4>
                      <ul className="list-disc pl-4 space-y-1.5">
                        <li><strong>Rezerwacja terminu:</strong> Rezerwacje przez witrynę mają status wstępnej rezerwacji terminu. Potwierdzenie dogodnej godziny następuje telefonicznie lub wiadomością SMS w ciągu 2 godzin roboczych.</li>
                        <li><strong>Szanowanie czasu:</strong> Rezerwacja terminu wymaga pełnej gotowości organizacyjnej ze strony Instytutu. Ewentualną chęć odwołania lub rezygnacji z zabiegu należy zgłosić telefonicznie, najpóźniej na 24 godziny przed planowanym terminem.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">3. Diagnoza Komórkowa i Bezpieczeństwo Skóry</h4>
                      <p>
                        W naszym gabinecie nie podejmujemy zabiegów bez uprzedniej pełnej diagnozy komputerowo-fizykalnej. Pierwsza wizyta zawsze rozpoczyna się od multispektralnej diagnozy Thessia™ w celu zdefiniowania grubości naskórka, uszkodzeń bariery hydrolipidowej i ewentualnych stanów zapalnych. Zastrzegamy sobie prawo odmowy wykonania ekspansywnych zabiegów lub modyfikacji ich przebiegu, o ile aktualne parametry fizjologiczne naskórka zagrażają powikłaniami zapalnymi.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-serif text-sm font-medium text-luxury-dark font-semibold">4. Standard bionomiczny preparatów</h4>
                      <p>
                        Wszystkie receptury stosowane w gabinecie cechuje czystość medyczna i zgodność bionomiczna – nie stosujemy olejów mineralnych, parabenów, sls, slifów i syntetycznych barwników. Pielęgnacja domowa opisywana w ramach Paszportu Skóry™ stanowi nieodłączny element powodzenia terapii gabinetowych.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-luxury-sand/40 flex justify-end">
                <button
                  onClick={() => setOpenPolicyModal(null)}
                  className="px-6 py-2 border border-luxury-dark text-luxury-dark font-mono text-[10px] uppercase tracking-widest hover:bg-luxury-dark hover:text-white transition-all cursor-pointer rounded-none"
                >
                  Zamknij dokument
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYLEMAT EKSPERTA: BIONOMICZNY NAWIGATOR PYTANIOWY SLIDING DRAWER */}
      <AnimatePresence>
        {isExpertDilemmaOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpertDilemmaOpen(false)}
              className="fixed inset-0 bg-[#1e1a14]/65 backdrop-blur-md z-50 cursor-pointer"
              id="expert-dilemma-backdrop"
            />

            {/* Panel Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg md:max-w-xl bg-[#FAF8F5] border-l border-luxury-sand shadow-2xl z-55 flex flex-col overflow-hidden"
              id="expert-dilemma-drawer"
            >
              {/* Drawer Header */}
              <div className="bg-[#FAF8F5]/90 backdrop-blur-xs border-b border-luxury-sand/40 p-6 md:p-8 flex items-center justify-between pb-4 sticky top-0 z-10">
                <div className="space-y-1">
                  <span className="font-mono text-[8px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">Bionomiczny Nawigator Pytaniowy</span>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-luxury-gold" strokeWidth={1.5} />
                    <h3 className="font-serif text-2xl font-light text-luxury-dark tracking-tight">Dylemat Eksperta</h3>
                  </div>
                </div>
                {/* Close Button */}
                <button
                  onClick={() => setIsExpertDilemmaOpen(false)}
                  className="w-10 h-10 rounded-full border border-luxury-sand/40 hover:border-luxury-gold/50 flex items-center justify-center text-luxury-dark hover:text-luxury-gold transition-all duration-300 cursor-pointer bg-white"
                  aria-label="Zamknij"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Search & Filter Top Bar */}
              <div className="p-6 md:p-8 pb-4 space-y-4 border-b border-luxury-sand/30 bg-white/40">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Wyszukaj dylemat (np. bariera, kwas, diagnoza, trądzik...)"
                    value={expertDilemmaSearch}
                    onChange={(e) => setExpertDilemmaSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-3.5 bg-white border border-[#ebdcb9] hover:border-luxury-gold focus:border-luxury-gold focus:outline-none placeholder-luxury-dark/35 text-luxury-dark text-xs font-mono rounded-none transition-all duration-300 shadow-[0_3px_12px_rgba(179,155,114,0.03)] focus:shadow-md animate-fade-in"
                  />
                  {expertDilemmaSearch && (
                    <button
                      onClick={() => setExpertDilemmaSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-luxury-dark/90 hover:text-luxury-dark cursor-pointer transition-colors"
                      aria-label="Wyczyść wyszukiwanie"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Categories filtering carousel (Quiet Luxury pill buttons) */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[8px] text-luxury-dark/90 uppercase tracking-widest block">Kategorie Kliniczne</span>
                  <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto no-scrollbar py-1">
                    {expertCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedExpertCategory(cat)}
                        className={`px-3 py-1.5 font-mono text-[9px] tracking-wider uppercase transition-all duration-300 rounded-none cursor-pointer border ${
                          selectedExpertCategory === cat
                            ? "bg-luxury-dark border-luxury-dark text-white shadow-xs"
                            : "bg-white border-luxury-sand/60 text-luxury-dark/95 hover:text-luxury-dark hover:border-[#ebdcb9]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 max-h-[calc(100vh-270px)]">
                {filteredExpertFaqs.length > 0 ? (
                  filteredExpertFaqs.map((faq, index) => {
                    const faqId = "dilemma-" + index;
                    return (
                      <div
                        key={faqId}
                        className="p-5 border border-luxury-sand/30 bg-white hover:border-[#ebdcb9] hover:shadow-[0_4px_16px_rgba(179,155,114,0.06)] rounded-none transition-all duration-300 text-left"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-luxury-sand/20 pb-2 mb-3">
                          <span className="font-mono text-[8px] tracking-widest text-luxury-gold uppercase font-bold bg-luxury-sand/15 px-2 py-0.5 rounded-sm">
                            {faq.category}
                          </span>
                          <span className="text-[9px] font-mono text-luxury-dark/90 font-medium">
                            Zabieg: {faq.treatmentName}
                          </span>
                        </div>
                        <h4 className="font-serif text-sm font-medium text-luxury-dark leading-snug">
                          {faq.question}
                        </h4>
                        <p className="text-xs text-luxury-dark/95 font-light leading-relaxed mt-2.5 bg-[#FAF8F5]/60 p-3.5 border-l-2 border-[#ebdcb9] text-justify">
                          {faq.answer}
                        </p>
                        
                        <div className="mt-3 pt-2.5 border-t border-luxury-sand/20 flex justify-end">
                          <button
                            onClick={() => {
                              const t = TREATMENTS.find((item) => item.id === faq.treatmentId);
                              if (t) {
                                setSelectedTreatment(t);
                                setIsExpertDilemmaOpen(false);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }}
                            className="text-[9px] font-mono font-medium text-luxury-dark uppercase tracking-widest flex items-center gap-1 hover:text-luxury-gold transition-colors duration-200 cursor-pointer"
                          >
                            Szczegóły Terapii <ChevronRight className="w-3.5 h-3.5 text-luxury-gold" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 px-4 space-y-3">
                    <HelpCircle className="w-8 h-8 text-luxury-gold/40 mx-auto" strokeWidth={1} />
                    <p className="font-serif text-sm text-luxury-dark font-light italic">Nie znaleziono dylematu dla danej frazy.</p>
                    <p className="text-[11px] font-mono text-luxury-dark/90">Wpisz inne bionomiczne zapytanie lub wyczyść filtry.</p>
                    <button
                      onClick={() => {
                        setExpertDilemmaSearch("");
                        setSelectedExpertCategory("Wszystkie");
                      }}
                      className="px-4 py-2 mt-2 border border-luxury-dark text-[9px] font-mono tracking-widest uppercase hover:bg-luxury-dark hover:text-white transition-all cursor-pointer"
                    >
                      Resetuj Parametry Szukania
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Footer Callout */}
              <div className="bg-[#FAF8F5] border-t border-luxury-sand/40 p-5 text-center space-y-2 sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <p className="text-[10px] text-luxury-dark/95 font-serif leading-normal px-2">
                  Chcesz omówić specyficzny stan swojej skóry bezpośrednio z założycielką Instytutu?
                </p>
                <div className="px-3">
                  <button
                    onClick={() => {
                      setIsExpertDilemmaOpen(false);
                      const t = TREATMENTS[0];
                      setBookingTreatment(t);
                      setBookingConfirmed(false);
                      setBookingName("");
                      setBookingEmail("");
                      setBookingPhone("");
                      setBookingDate("");
                    }}
                    className="w-full py-3 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer font-medium"
                  >
                    Umów Konsultację z Kosmetologiem
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Quiet Luxury Toast feedback notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[9999] text-left text-luxury-cream border p-5 shadow-[0_12px_44px_rgba(0,0,0,0.15)] flex items-start gap-3.5 max-w-sm rounded-none transition-all duration-350 border-luxury-gold/50 ${
              toast.type === "error" ? "bg-red-950 border-red-700/80" : "bg-luxury-dark border-luxury-gold"
            }`}
          >
            <Sparkles className="w-5 h-5 text-luxury-gold shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1 text-left">
              <span className="font-mono text-[9px] tracking-widest text-[#d9c49a] uppercase font-bold block">Slow Skin Concept™</span>
              <p className="text-[11px] font-mono leading-relaxed text-luxury-cream font-medium">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SkincareAssistant 
        onViewTreatment={(id) => {
          const t = TREATMENTS.find((item) => item.id === id);
          if (t) {
            setSelectedTreatment(t);
            setActiveTab("clinic");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        onBookTreatment={(id) => {
          const t = TREATMENTS.find((item) => item.id === id);
          if (t) {
            setBookingTreatment(t);
            setBookingConfirmed(false);
            setBookingName("");
            setBookingEmail("");
            setBookingPhone("");
            setBookingDate("");
          }
        }}
        onReadArticle={(id) => {
          const a = ARTICLES.find((item) => item.id === id);
          if (a) {
            setSelectedArticle(a);
            setActiveTab("journal");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      />

      {/* Floating WhatsApp Action Button - Compact Circular Icon Only */}
      <a
        href="https://wa.me/48793088854?text=Dzie%C5%84%20dobry!%20Chcia%C5%82(a)bym%20zapyta%C4%87%20o%20zabiegi%20lub%20rezerwacj%C4%99%20w%20Instytucie%20Slow%20Skin%20Concept."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-[88px] sm:right-[92px] z-40 w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] border-2 border-white flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
        title="Napisz do recepcji na WhatsApp (+48 793 088 854)"
        id="floating-whatsapp-btn"
        aria-label="Czat WhatsApp (+48 793 088 854)"
      >
        <svg 
          className="w-6 h-6 sm:w-7 sm:h-7 fill-white transition-transform group-hover:scale-105" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.715 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Floating Manager & Universal Active Photo Mode */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsImageManagerOpen(true)}
          className="bg-luxury-dark hover:bg-black text-luxury-gold border border-luxury-gold/80 px-4 py-2.5 rounded-full shadow-2xl text-[10px] font-mono uppercase tracking-wider flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer backdrop-blur-xs group"
          title="Tryb Wymiany Zdjęć jest aktywny na każdym zdjęciu na stronie. Kliknij, aby otworzyć panel zbiorczy."
        >
          <Camera className="w-4 h-4 text-luxury-gold group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-white">Tryb Wymiany Zdjęć: <span className="text-luxury-gold font-bold">AKTYWNY</span></span>
          <span className="bg-luxury-gold text-luxury-dark text-[8px] font-bold px-1.5 py-0.5 rounded-full">ON</span>
        </button>
      </div>

      <OriginalImageManagerModal
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        onImageUpdated={(key, url) => {
          setCustomTreatmentImages(prev => ({ ...prev, [key]: url }));
          if (key === "hero") {
            setHeroCustomUrl(url);
          }
        }}
      />

      <WcagWidget />
      <CookieBot onOpenPolicy={() => setIsCookiesPolicyOpen(true)} />
      <CookiesPolicyModal 
        isOpen={isCookiesPolicyOpen} 
        onClose={() => setIsCookiesPolicyOpen(false)} 
        onOpenSettings={() => {
          window.dispatchEvent(new CustomEvent("openCookieSettings"));
        }}
      />

      </div>
    );
  }
