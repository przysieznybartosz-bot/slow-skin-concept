import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  ArrowRight, 
  Leaf, 
  Droplets, 
  Heart, 
  HelpCircle, 
  Package, 
  Truck, 
  Award, 
  Info, 
  RotateCcw,
  Star,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkle,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";

interface ShopPageProps {
  onLinkClick?: (url: string) => void;
  onOpenBooking?: (treatment?: any) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onLinkClick, onOpenBooking }) => {
  const [selectedProductTab, setSelectedProductTab] = useState<"all" | "cream" | "foam" | "set">("all");
  const [expandedInciId, setExpandedInciId] = useState<string | null>(null);
  const [isPreorderSuccess, setIsPreorderSuccess] = useState(false);
  const [preorderData, setPreorderData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "Zestaw RESET FOAM + BALANCE CREAM (150 ml + 50 ml)",
    notes: ""
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const products = [
    {
      id: "balance-cream",
      category: "cream" as const,
      step: "02 — Etap kremu",
      badge: "Krok 02 • BALANCE",
      title: "SKIN INFUZION™ BALANCE CREAM",
      subtitle: "Biomimetic Skin Balance • Krem do codziennej pielęgnacji na dzień i noc",
      capacity: "50 ml",
      price: "245 PLN",
      regularPrice: null,
      rating: 5.0,
      reviewsCount: 28,
      image: "/src/assets/images/balance_cream_packshot.webp",
      lead: "Krem nawilżający do twarzy, szyi i dekoltu na dzień i na noc. Oleje roślinne, skwalan, ektoina i NAG tworzą autorską kompozycję dla miękkości, gładkości i codziennego komfortu skóry. Pielęgnacja wodna i lipidowa połączona w jednej formule.",
      keyIngredients: [
        { name: "Ektoina & N-Acetyloglukozamina (NAG)", desc: "Zaawansowane cząsteczki uciszające neuroreaktywność, wspierające odnowę komórkową i komfort naskórka." },
        { name: "Skwalan & Kompleks Olejów Roślinnych", desc: "Oleje ryżowy, z nasion zielonej herbaty, jojoba i nasion bawełny – naturalne wygładzenie i zmiękczenie." },
        { name: "Humektanty & Polisacharydy Tara", desc: "Gliceryna, propanediol oraz Caesalpinia Spinosa Gum wiążące wodę w naskórku." },
        { name: "Ekstrakt z Lucerny & Wąkroty (CICA)", desc: "Medicago Sativa oraz Centella Asiatica uzupełnione kompleksem witamin (B3, B5, C, E, B6)." }
      ],
      clinicalBenefits: [
        "Szybkie wchłanianie i odczuwalne nawilżenie ocenione w badaniu użytkowym ORCIDEO RA-2026-03 (21 osób, 14 dni, samoocena)",
        "Jeden krem na dzień i na noc – bez konieczności dokładać osobnego kremu na noc",
        "Wieloskładnikowa część lipidowa zmiękcza i wygładza naskórek bez ciężkiego filmu",
        "Biozgodna kompozycja – 0% olejów mineralnych, 0% parabenów, 0% sztucznych wypełniaczy"
      ],
      inci: "Aqua, Oryza Sativa (Rice) Bran Oil, Camellia Sinensis Seed Oil, Cetearyl Olivate, Sorbitan Olivate, Coco caprilate caprate, Jojoba oil, Propanediol, Behenyl Alcohol, Glyceryl Stearate, Cetyl Palmitate, Glyceryl Stearate Citrate, Glycerin, Hydrolyzed Caesalpinia Spinosa Gum, Caesalpinia Spinosa Gum, Sodium Benzoate, Potasium Sorbate, Medicago Sativa (Alfalfa) Extract, Niacinamide, Calcium Pantothenate, Sodium Ascorbyl Phosphate, Tocopheryl Acetate, Pyridoxine Hydrochloride, Maltodextrin, Sodium Starch Octenylsuccinate, Silica, N-Acetyloglukozamin, Yeast Extract, Squalane, Gossypium (Cotton) Seed Oil, Glycerin, Centella Asiatica Extract, Ethylhexylglycerin, Cetyl alcohol, Inulin, Benzyl Alcohol, y-Aminobutyric Acid, Ectoin, Xanthan gum, Lactic Acid, Glycerin, Glycosphingolipids, Leuconostoc/Radish Root Ferment Filtrate, Dehydroacetic Acid, Sodium Phytate",
      usage: "Stosuj rano i wieczorem po oczyszczeniu skóry. Nanieś niewielką ilość na twarz, szyję i dekolt. Rano uzupełnij pielęgnację odpowiednią ochroną przeciwsłoneczną SPF.",
      texture: "Lekka, jedwabista emulsja hydro-lipidowa dająca natychmiastowe uczucie miękkości i aksamitnego wygładzenia.",
      externalShopUrl: "https://slow-skin.shop/produkty/balance-cream"
    },
    {
      id: "reset-foam",
      category: "foam" as const,
      step: "01 — Oczyszczanie",
      badge: "Krok 01 • RESET",
      title: "SKIN INFUZION™ RESET FOAM",
      subtitle: "Biomimetic Skin Reset • Pianka do mycia twarzy z NMF",
      capacity: "150 ml",
      price: "160 PLN",
      regularPrice: null,
      rating: 4.9,
      reviewsCount: 34,
      image: "/src/assets/images/reset_foam_packshot.webp",
      lead: "Pianka do mycia twarzy, szyi i dekoltu. Łączy miękką pianę ze składnikami NMF, gliceryną, sorbitolem i fermentami — dla oczyszczania, w którym liczy się również komfort skóry. Rano odświeża, wieczorem rozpoczyna Twój rytuał.",
      keyIngredients: [
        { name: "Baza Decyl Glucoside & Coco-Betaine", desc: "Myjąca podstawa tworząca miękką, delikatną pianę bez agresywnego ściągania skóry." },
        { name: "Składniki NMF (Natural Moisturizing Factor)", desc: "Sodium PCA, mocznik, aminokwasy (glutaminowy, lizyna, glicyna), mleczan sodu, glukoza – nawilżenie już na etapie mycia." },
        { name: "Fermenty Postbiotyczne", desc: "Lactobacillus/Lemon Peel Ferment & Bifidobacterium Ferment Filtrate wspierające florę bakteryjną i płaszcz skóry." },
        { name: "Ekstrakt z Korzenia Lukrecji & CICA", desc: "Glycyrrhiza Glabra i Centella Asiatica uzupełnione alantoiną i niacynamidem dla ukojenia." }
      ],
      clinicalBenefits: [
        "Czystość bez uczucia ściągnięcia, pieczenia czy napięcia po umyciu",
        "Usuwa codzienne zanieczyszczenia miejskie i sebum z zachowaniem fizjologicznego komfortu",
        "Wygodna aplikacja pianotwórcza – 1–2 pompki na wilgotną skórę bez mocnego pocierania",
        "Jeden produkt do porannego odświeżenia i wieczornego oczyszczania twarzy, szyi i dekoltu"
      ],
      inci: "Aqua, Decyl glucoside, Glycerin, Lactobacillus/Lemon Peel Ferment Extract, Sorbitol, Coco-betain, Glycyrrhiza Glabra Root Extract, Sodium Lactate, Bifidobacterium/(Lactobacillus/Saccharomyces/Schizosaccharomyces/Zygosaccharomyces Ferment Filtrate) Ferment Filtrate, Propylene Glycol, Sodium PCA, Glucose, Urea, Glutamic Acid, Lysine, Glycine, Lactic Acid, Allantoin, Sodium Benzoate, Potassium Sorbate, Centella Asiatica Extract, Benzyl alcohol, ethylhexylglycerin, Lactic acid, Gluconolactone, Benzyl Alcohol, Niacynamide, Citrus Limon Peel Oil, Dehydroacetic Acid",
      usage: "Nanieś 1–2 pompki na wilgotną skórę twarzy, szyi i dekoltu. Delikatnie masuj, a następnie dokładnie spłucz letnią wodą. Następny krok rytuału to BALANCE CREAM.",
      texture: "Puszysta, stabilna mikro-piana myjąca o delikatnym, naturalnym profilu.",
      externalShopUrl: "https://slow-skin.shop/produkty/reset-foam"
    },
    {
      id: "zestaw-reset-balance",
      category: "set" as const,
      step: "Duet • RESET + BALANCE",
      badge: "Zestaw Rytualny • Duet",
      title: "Zestaw RESET FOAM + BALANCE CREAM",
      subtitle: "Dwa kroki. Jeden rytuał • 150 ml + 50 ml",
      capacity: "150 ml + 50 ml",
      price: "385 PLN",
      regularPrice: "405 PLN",
      rating: 5.0,
      reviewsCount: 42,
      image: "/src/assets/images/skin_infuzion_duet.webp",
      lead: "RESET FOAM 150 ml i BALANCE CREAM 50 ml — oczyszczanie, a następnie pielęgnacja. Duet ma sens, gdy potrzebujesz zarówno produktu do mycia, jak i kremu. Jeśli jeden z tych etapów jest już dobrze dobrany, wybierz tylko brakujący kosmetyk. Wprowadzając dwie nowości, rozdziel ich pierwsze zastosowanie, aby łatwiej ocenić tolerancję każdej z nich.",
      keyIngredients: [
        { name: "RESET FOAM (150 ml)", desc: "Krok 01: Łagodna pianka myjąca ze składnikami NMF, gliceryną, fermentami i ekstraktami z lukrecji i CICA." },
        { name: "BALANCE CREAM (50 ml)", desc: "Krok 02: Krem nawilżający na dzień i noc ze skwalanem, ektoiną, NAG i 4 olejami roślinnymi." },
        { name: "Dwa Uporządkowane Kroki", desc: "Najpierw oczyszczanie RESET FOAM, następnie pielęgnacja BALANCE CREAM — bez przeciążania skóry." },
        { name: "Wspólny Wybór", desc: "Dwa kosmetyki w jednej ofercie ułatwiają zaplanowanie podstawowych etapów codziennego rytuału." }
      ],
      clinicalBenefits: [
        "Dwa uporządkowane kroki: najpierw oczyszczanie RESET FOAM, następnie pielęgnacja BALANCE CREAM",
        "Osobne role produktów: pianka odpowiada za etap mycia, a krem dopełnia pielęgnację po oczyszczeniu",
        "Wspólny wybór: ułatwia zaplanowanie podstawowych etapów rytuału bez przypadkowości",
        "Darmowa dostawa od 250 zł przy zamówieniu w oficjalnym sklepie slow-skin.shop"
      ],
      inci: "RESET FOAM (150 ml): Aqua, Decyl glucoside, Glycerin, Lactobacillus/Lemon Peel Ferment Extract, Sorbitol, Coco-betain, Glycyrrhiza Glabra Root Extract, Sodium Lactate, Bifidobacterium Ferment Filtrate, Propylene Glycol, Sodium PCA, Glucose, Urea... | BALANCE CREAM (50 ml): Aqua, Oryza Sativa Bran Oil, Camellia Sinensis Seed Oil, Jojoba oil, Squalane, Ectoin, N-Acetyloglukozamin, Medicago Sativa, Centella Asiatica...",
      usage: "01 RESET: nanieś 1–2 pompki pianki na wilgotną skórę twarzy, szyi i dekoltu, delikatnie masuj i spłucz. 02 BALANCE: niewielką ilość kremu nanieś na oczyszczoną skórę i rozprowadź do wchłonięcia. 03 OBSERWUJ SKÓRĘ: zwróć uwagę na jej potrzeby i odczucia.",
      texture: "Dopełniający się duet: puszysta, stabilna mikro-piana myjąca oraz aksamitny, szybko wchłaniający się krem.",
      externalShopUrl: "https://slow-skin.shop/produkty/zestaw-reset-balance"
    }
  ];

  const filteredProducts = selectedProductTab === "all" 
    ? products 
    : products.filter(p => p.category === selectedProductTab);

  const handlePreorderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPreorderSuccess(true);

    const subject = encodeURIComponent(`[Rezerwacja Kosmetyków] ${preorderData.product} — ${preorderData.name}`);
    const body = encodeURIComponent(
      `Dzień dobry!\n\n` +
      `Przesyłam formularz rezerwacji preparatów autorskich do odbioru w Instytucie Slow Skin Concept:\n\n` +
      `• Produkt: ${preorderData.product}\n` +
      `• Imię i Nazwisko: ${preorderData.name}\n` +
      `• Numer telefonu: ${preorderData.phone}\n` +
      `• Adres e-mail: ${preorderData.email}\n` +
      `• Dodatkowe uwagi / stan skóry: ${preorderData.notes || "Brak uwag"}\n\n` +
      `Proszę o potwierdzenie terminu odbioru w recepcji gabinetu (ul. Szkolna 5, Jelcz-Laskowice).`
    );

    const mailtoLink = `mailto:baumann.jelcz@wp.pl?subject=${subject}&body=${body}`;
    try {
      window.location.href = mailtoLink;
    } catch (err) {
      console.warn("Mailto triggered", err);
    }
  };

  const shopFaqs = [
    {
      q: "Gdzie znajduje się oficjalny sklep internetowy i jak realizowane są zamówienia?",
      a: "Nasz oficjalny sklep internetowy działa pod adresem slow-skin.shop jako bezpieczny portal e-commerce. Wszystkie zamówienia realizujemy z dbałością o najwyższe standardy pakowania i wysyłki. Produkty można także odebrać osobiście w naszym gabinecie w Jelczu-Laskowicach (ul. Szkolna 5)."
    },
    {
      q: "Czym wyróżniają się autorskie formuły SKIN INFUZION™ Katarzyny Brzezińskiej?",
      a: "Formuły SKIN INFUZION™ by Slow Skin Concept zostały opracowane z myślą o fizjologii i codziennym komforcie skóry. BALANCE CREAM łączy oleje roślinne (ryżowy, z herbaty, jojoba, bawełniany) i skwalan z humektantami, ektoiną i N-acetyloglukozaminą (NAG). Z kolei RESET FOAM łączy łagodne glukozydy z kompleksem NMF, gliceryną i fermentami, zapewniając czystość bez uczucia ściągnięcia."
    },
    {
      q: "Czy właściwości kremu BALANCE CREAM zostały zbadane aplikacyjnie?",
      a: "Tak. Gotowy krem BALANCE CREAM został poddany badaniu użytkowemu ORCIDEO RA-2026-03 (21 osób, 14 dni, samoocena). Uczestnicy badania ocenili między innymi natychmiastowe uczucie nawilżenia, szybkie wchłanianie oraz odczuwalny komfort po nałożeniu kremu."
    },
    {
      q: "Jaki jest czas realizacji wysyłki i koszt dostawy w sklepie slow-skin.shop?",
      a: "Dla zamówień od 250 zł wysyłka w oficjalnym sklepie slow-skin.shop jest bezpłatna. Zamówienia przygotowywane są i nadawane kurierem (InPost / DPD) w ciągu 24–48 godzin."
    }
  ];

  return (
    <div className="bg-luxury-cream text-luxury-dark min-h-screen py-10 px-4 sm:px-6 md:px-12 max-w-[1536px] mx-auto text-left selection:bg-luxury-gold/20" id="slow-skin-shop-page">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-luxury-sand text-xs font-mono text-luxury-dark/95">
        <div className="flex items-center gap-2">
          <span>INSTYTUT</span>
          <span>/</span>
          <span className="text-luxury-gold uppercase font-semibold">SKLEP</span>
          <span>/</span>
          <span className="text-luxury-dark/90">AUTORSKIE FORMUŁY</span>
        </div>
        <div className="flex items-center gap-2 text-luxury-gold bg-luxury-gold/10 px-3 py-1 border border-luxury-gold/30">
          <Sparkle className="w-3.5 h-3.5 animate-pulse" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">Dedykowany Portal E-Commerce</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mt-8 mb-12 space-y-4 max-w-4xl">
        <span className="font-mono text-[11px] tracking-[0.25em] text-luxury-gold uppercase block font-semibold">
          KOSMETOLOGIA BIONOMICZNA • AUTORSKIE PREPARATY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-luxury-dark leading-tight">
          Sklep <span className="italic font-normal text-luxury-gold">Slow Skin Concept</span>
        </h1>
        <p className="text-sm sm:text-base text-luxury-dark/95 leading-relaxed font-light">
          Przenosimy standardy naszej biologicznej terapii gabinetowej do Twojej codziennej pielęgnacji domowej. 
          Odkryj preparaty stworzone w oparciu o czystą fizjologię naskórka — bez kompromisów, parabenów i syntetycznych wypełniaczy.
        </p>
      </div>

      {/* External E-commerce Portal Banner */}
      <div className="bg-gradient-to-r from-white via-[#FAF8F5] to-white text-luxury-dark p-6 sm:p-8 md:p-10 mb-14 border border-luxury-sand/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-luxury-gold font-mono text-[10px] tracking-widest uppercase font-semibold">
              <Package className="w-4 h-4 text-luxury-gold" />
              <span>Oficjalny Sklep Internetowy • Bezpieczne Płatności & Szybka Dostawa</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
              SKIN INFUZION™ <span className="text-luxury-gold italic">by Slow Skin Concept</span>
            </h2>
            <p className="text-xs sm:text-sm text-luxury-dark/90 leading-relaxed max-w-2xl font-light">
              Nasze autorskie preparaty — pianka oczyszczająca <strong>RESET FOAM</strong> oraz krem nawilżający na dzień i noc <strong>BALANCE CREAM</strong> — są dostępne bezpośrednio w naszym oficjalnym sklepie internetowym <strong>slow-skin.shop</strong>. Zamawiaj z bezpieczną dostawą w 24–48h lub zarezerwuj preparaty do odbioru osobistego w gabinecie.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <a
              href="https://slow-skin.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-luxury-gold text-luxury-dark hover:bg-luxury-dark hover:text-white transition-all duration-300 px-6 py-3.5 text-center font-mono text-[11px] tracking-[0.15em] uppercase font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              id="cta-shop-external-banner"
            >
              <span>Otwórz Sklep Online (slow-skin.shop)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => {
                const el = document.getElementById("shop-preorder-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-2 border-luxury-dark hover:bg-luxury-dark hover:text-white text-luxury-dark px-6 py-3 text-center font-mono text-[10px] tracking-[0.15em] uppercase font-semibold transition-all bg-white/70"
            >
              Rezerwacja w Gabinecie / Przedsprzedaż
            </button>
          </div>
        </div>
      </div>

      {/* Product Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-luxury-sand">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedProductTab("all")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedProductTab === "all"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            Wszystkie Formulacje ({products.length})
          </button>
          <button
            onClick={() => setSelectedProductTab("cream")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedProductTab === "cream"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            BALANCE CREAM (Krem)
          </button>
          <button
            onClick={() => setSelectedProductTab("foam")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedProductTab === "foam"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            RESET FOAM (Pianka)
          </button>
          <button
            onClick={() => setSelectedProductTab("set")}
            className={`px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedProductTab === "set"
                ? "bg-luxury-dark text-luxury-cream font-medium"
                : "bg-white/80 border border-luxury-sand text-luxury-dark/95 hover:border-luxury-gold"
            }`}
          >
            Zestaw RESET + BALANCE
          </button>
        </div>

        <div className="text-[11px] font-mono text-luxury-dark/95 flex items-center gap-3">
          <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-luxury-gold" /> Darmowa dostawa od 250 zł</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-luxury-gold" /> 100% Czysta Bionomia</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-white border border-luxury-sand/60 hover:border-luxury-gold/80 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg relative group"
          >
            {/* Top Product Header */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Badge & Capacity */}
              <div className="flex items-center justify-between">
                <span className="bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/40 text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 font-semibold">
                  {product.badge}
                </span>
                <span className="text-[11px] font-mono text-luxury-dark/90 font-medium">
                  {product.capacity}
                </span>
              </div>

              {/* Product Visual Container with Real Packshot */}
              <div className="h-64 bg-[#FAF8F5] border border-luxury-sand/40 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group-hover:bg-white transition-colors">
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 bg-luxury-dark/90 text-luxury-gold font-mono text-[8.5px] px-2 py-0.5 uppercase tracking-wider font-semibold border border-luxury-gold/30">
                  {product.step}
                </span>
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-light text-luxury-dark group-hover:text-luxury-gold transition-colors leading-snug">
                  {product.title}
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-lg font-semibold text-luxury-dark">
                    {product.price}
                  </span>
                  {product.regularPrice && (
                    <span className="font-mono text-xs text-luxury-dark/90 line-through">
                      {product.regularPrice}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    W magazynie
                  </span>
                </div>
                <p className="text-xs text-luxury-dark/95 leading-relaxed font-light pt-1">
                  {product.lead}
                </p>
              </div>

              {/* Key Active Ingredients */}
              <div className="space-y-2 pt-2 border-t border-luxury-sand/40">
                <span className="font-mono text-[9px] tracking-widest uppercase text-luxury-gold font-semibold block">
                  Kluczowe Składniki Aktywne:
                </span>
                <ul className="space-y-1.5 text-xs text-luxury-dark font-light">
                  {product.keyIngredients.slice(0, 3).map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-luxury-gold font-bold">•</span>
                      <span><strong>{ing.name}:</strong> {ing.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Benefits Checklist */}
              <div className="space-y-1.5 bg-luxury-cream/40 p-3 border border-luxury-sand/30 text-[11px] text-luxury-dark/95">
                {product.clinicalBenefits.slice(0, 2).map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Expandable Full INCI */}
              <div className="pt-2 border-t border-luxury-sand/40">
                <button
                  type="button"
                  onClick={() => setExpandedInciId(expandedInciId === product.id ? null : product.id)}
                  className="text-[9.5px] font-mono text-luxury-gold hover:text-luxury-dark transition-colors uppercase tracking-wider flex items-center justify-between w-full font-semibold cursor-pointer py-1"
                >
                  <span>Skład i pełne INCI {expandedInciId === product.id ? "▲" : "▼"}</span>
                  <span className="text-[8px] bg-luxury-sand/30 px-1.5 py-0.5 rounded-xs">100% Bionomic</span>
                </button>
                {expandedInciId === product.id && (
                  <p className="mt-2 text-[9.5px] text-luxury-dark/85 font-mono leading-relaxed bg-[#FAF8F5] p-2.5 border border-luxury-sand/50 rounded-xs break-words">
                    {product.inci}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 sm:p-8 pt-0 space-y-2.5">
              <a
                href={product.externalShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-luxury-dark hover:bg-luxury-gold hover:text-luxury-dark text-luxury-cream transition-all duration-300 py-3.5 text-center font-mono text-[10px] tracking-[0.15em] uppercase font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Kup w Sklepie Online (slow-skin.shop)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  setPreorderData(prev => ({ ...prev, product: product.title }));
                  const el = document.getElementById("shop-preorder-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-white border border-luxury-sand hover:border-luxury-gold text-luxury-dark text-[10px] font-mono tracking-[0.15em] uppercase py-2.5 transition-colors text-center cursor-pointer"
              >
                Zarezerwuj do Odbioru w Gabinecie
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bionomic Purity Philosophy Grid */}
      <div className="bg-white border border-luxury-sand p-8 sm:p-12 mb-16 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-gold uppercase font-semibold block">
            CZYSTA FIZJOLOGIA • ZERO KOMPROMISÓW
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
            Karta Czystości Bionomicznej Slow Skin
          </h2>
          <p className="text-xs sm:text-sm text-luxury-dark/95 font-light">
            Formułujemy preparaty zgodnie z najsurowszymi regułami bionomicznej zgodności biologicznej.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="p-5 bg-luxury-cream/40 border border-luxury-sand/30 space-y-2">
            <div className="w-8 h-8 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-mono text-xs font-semibold">
              01
            </div>
            <h4 className="font-serif text-base font-medium text-luxury-dark">0% Parabenów & PEG</h4>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Całkowity brak chemicznych konserwantów i emulgatorów uszkadzających spoiwo lipidowe.
            </p>
          </div>

          <div className="p-5 bg-luxury-cream/40 border border-luxury-sand/30 space-y-2">
            <div className="w-8 h-8 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-mono text-xs font-semibold">
              02
            </div>
            <h4 className="font-serif text-base font-medium text-luxury-dark">0% Olejów Mineralnych</h4>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Żadnych pochodnych ropy naftowej i silikonów tworzących nieprzepuszczalną, duszącą okluzję.
            </p>
          </div>

          <div className="p-5 bg-luxury-cream/40 border border-luxury-sand/30 space-y-2">
            <div className="w-8 h-8 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-mono text-xs font-semibold">
              03
            </div>
            <h4 className="font-serif text-base font-medium text-luxury-dark">Ceramidy 3:1:1</h4>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Fizjologiczny stosunek ceramidów, wolnych kwasów tłuszczowych i cholesterolu zgodny z naskórkiem.
            </p>
          </div>

          <div className="p-5 bg-luxury-cream/40 border border-luxury-sand/30 space-y-2">
            <div className="w-8 h-8 rounded-full bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-mono text-xs font-semibold">
              04
            </div>
            <h4 className="font-serif text-base font-medium text-luxury-dark">Fizjologiczne pH 5.5</h4>
            <p className="text-xs text-luxury-dark/95 font-light leading-relaxed">
              Optymalne środowisko dla rozwoju pożytecznego mikrobiomu i kwaśnego płaszcza ochronnego.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Order / Reservation Form */}
      <div id="shop-preorder-section" className="bg-luxury-cream border border-luxury-sand p-8 sm:p-12 mb-16 shadow-md">
        <div className="max-w-3xl mx-auto text-left space-y-6">
          <div className="space-y-2 border-b border-luxury-sand pb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-gold uppercase font-semibold block">
              ZAMÓWIENIE GABINETOWE & PRZEDSPRZEDAŻ
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
              Zarezerwuj Autorskie Preparaty do Odbioru
            </h3>
            <p className="text-xs sm:text-sm text-luxury-dark/95 font-light">
              Chcesz odebrać produkty osobiście podczas wizyty w Instytucie lub zapytać kosmetologa o dobór do Twojego Beauty Planu? Wypełnij krótki formularz:
            </p>
          </div>

          {isPreorderSuccess ? (
            <div className="bg-white border border-emerald-300 p-8 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-2xl font-light text-luxury-dark">
                  Dziękujemy za złożenie rezerwacji!
                </h4>
                <p className="text-xs text-luxury-dark/95 max-w-md mx-auto leading-relaxed font-light">
                  Twoja rezerwacja na <strong>{preorderData.product}</strong> została skierowana do recepcji Instytutu na adres: <span className="font-mono text-emerald-800 font-medium">baumann.jelcz@wp.pl</span>.
                </p>
              </div>

              {/* Instant WhatsApp & Phone Actions */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-mono text-[10px] uppercase font-semibold">
                  <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Szybki kontakt z recepcją (WhatsApp & Tel)</span>
                </div>
                <p className="text-[11px] text-luxury-dark/90 leading-relaxed">
                  Możesz natychmiast przekazać tę rezerwację bezpośrednio na gabinetowy numer WhatsApp lub zadzwonić do recepcji:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={`https://wa.me/48793088854?text=${encodeURIComponent(
                      `Dzień dobry! Zgłaszam rezerwację kosmetyków w Instytucie Slow Skin Concept:\n` +
                      `• Produkt: ${preorderData.product}\n` +
                      `• Imię i Nazwisko: ${preorderData.name}\n` +
                      `• Telefon: ${preorderData.phone}\n` +
                      `• E-mail: ${preorderData.email}` +
                      (preorderData.notes ? `\n• Uwagi: ${preorderData.notes}` : "")
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Wyślij na WhatsApp (+48 793 088 854)
                  </a>
                  <a
                    href="tel:793088854"
                    className="py-2.5 px-4 bg-luxury-dark hover:bg-luxury-gold text-white font-mono text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> 793 088 854
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsPreorderSuccess(false)}
                  className="bg-luxury-dark text-luxury-cream px-6 py-2.5 font-mono text-[10px] tracking-widest uppercase hover:bg-luxury-gold transition-colors"
                >
                  Złóż kolejną rezerwację
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePreorderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Imię i Nazwisko *
                  </label>
                  <input
                    type="text"
                    required
                    value={preorderData.name}
                    onChange={(e) => setPreorderData({ ...preorderData, name: e.target.value })}
                    placeholder="np. Anna Nowak"
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
                    value={preorderData.phone}
                    onChange={(e) => setPreorderData({ ...preorderData, phone: e.target.value })}
                    placeholder="np. 600 000 000"
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Adres E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={preorderData.email}
                    onChange={(e) => setPreorderData({ ...preorderData, email: e.target.value })}
                    placeholder="np. anna@domena.pl"
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                    Wybór Produktu *
                  </label>
                  <select
                    value={preorderData.product}
                    onChange={(e) => setPreorderData({ ...preorderData, product: e.target.value })}
                    className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="Zestaw RESET FOAM + BALANCE CREAM (150 ml + 50 ml)">Zestaw RESET FOAM + BALANCE CREAM (150 ml + 50 ml) — 385 PLN</option>
                    <option value="SKIN INFUZION™ BALANCE CREAM (50 ml)">SKIN INFUZION™ BALANCE CREAM (50 ml) — 245 PLN</option>
                    <option value="SKIN INFUZION™ RESET FOAM (150 ml)">SKIN INFUZION™ RESET FOAM (150 ml) — 160 PLN</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider uppercase text-luxury-dark font-medium">
                  Dodatkowe pytania / informacja o stanie skóry (opcjonalnie)
                </label>
                <textarea
                  rows={3}
                  value={preorderData.notes}
                  onChange={(e) => setPreorderData({ ...preorderData, notes: e.target.value })}
                  placeholder="np. Proszę o przygotowanie zestawu na moją wizytę w piątek, mam skórę naczynkową..."
                  className="w-full bg-white border border-luxury-sand p-3 text-xs focus:outline-none focus:border-luxury-gold"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-luxury-dark/95 font-mono">
                  * Zgłoszenie trafia na e-mail: <strong className="text-luxury-dark">baumann.jelcz@wp.pl</strong> oraz WhatsApp.
                </span>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/48793088854?text=${encodeURIComponent(
                      `Dzień dobry! Chciał(a)bym zamówić preparat autorski w gabinecie: ${preorderData.product}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3 font-mono text-[10px] tracking-[0.12em] uppercase font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
                    title="Zamów bezpośrednio przez WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp (793 088 854)
                  </a>
                  <button
                    type="submit"
                    className="bg-luxury-dark hover:bg-luxury-gold hover:text-luxury-dark text-luxury-cream px-8 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase font-semibold transition-all shadow-md w-full sm:w-auto"
                  >
                    Wyślij Rezerwację Gabinetową →
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Shop FAQ Section */}
      <div className="bg-white border border-luxury-sand p-8 sm:p-12 mb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2 border-b border-luxury-sand pb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-luxury-gold uppercase font-semibold block">
              PYTANIA I ODPOWIEDZI
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-luxury-dark">
              Najczęściej Zadawane Pytania o Sklep i Formulacje
            </h3>
          </div>

          <div className="space-y-3">
            {shopFaqs.map((faq, idx) => (
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
          SLOW SKIN CONCEPT • OFICJALNY SYSTEM BIONOMICZNY • JELCZ-LASKOWICE
        </p>
        <a 
          href="https://slow-skin.shop/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-luxury-gold hover:text-luxury-dark font-mono uppercase tracking-wider inline-flex items-center gap-1 font-medium"
        >
          Przejdź do Sklepu Online (slow-skin.shop) <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
