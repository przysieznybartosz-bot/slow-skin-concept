import { TREATMENTS, ARTICLES } from "./data";
import { Treatment, MagazineArticle } from "./types";

export interface KnowledgeBase {
  institute: {
    name: string;
    location: string;
    address: string;
    expert: string;
    contactPhone: string;
    philosophy: string;
    pillars: string[];
  };
  method: {
    name: string;
    origins: string;
    coreMechanism: string;
    principles: string[];
  };
  treatments: {
    id: string;
    title: string;
    subtitle: string;
    duration: string;
    price: string;
    description: string;
    indications: string[];
    contraindications: string[];
    activeSubstances: string[];
    postTreatmentCare: string[];
    linkToView: string;
    linkToBook: string;
  }[];
  knowledgeBaseArticles: {
    id: string;
    title: string;
    category: string;
    author: string;
    lead: string;
    linkToRead: string;
  }[];
  booking: {
    policy: string;
    pricingSummary: string;
  };
}

export const KNOWLEDGE_BASE_DATA: KnowledgeBase = {
  institute: {
    name: "Slow Skin Concept™",
    location: "Jelcz-Laskowice",
    address: "ul. Szkolna 5, Jelcz-Laskowice (koło Wrocławia, Dolny Śląsk)",
    expert: "Katarzyna Brzezińska",
    contactPhone: "+48 71 318 12 34", // Standard kontaktowy instytutu
    philosophy: "Quiet luxury, bionomiczna pielęgnacja, neurokosmetyka, regeneracja komórkowa naskórka zamiast agresywnej, kwasowej lub laserowej stymulacji. Nasz gabinet to oaza ciszy i głębokiego relaksu przywracająca absolutną homeostazę tkankową i wyciszająca neuro-wrażliwość i inflammaging.",
    pillars: [
      "Bionomiczna ochrona skóry (kosmetyki wolne od konserwantów, silikonów, substancji zapachowych i barwników)",
      "Neuroedukacja i redukcja chronicznego kortyzolu niszczącego kolagen",
      "Neuromiostymulacja i powięziowa praca manualna (Slow Neuro-Modeling)",
      "Zero-inwazyjność i poszanowanie dla płaszcza hydrolipidowego"
    ]
  },
  method: {
    name: "Slow Skin Concept™",
    origins: "Stworzona autorsko przez Katarzynę Brzezińską w oparciu o bionomiczne standardy oraz biofizyczne podstawy częstotliwości dr. Paula Nogiera.",
    coreMechanism: "Re-edukacja receptorów naskórka za pomocą precyzyjnych mikroczęstotliwości elektromagnetycznych (tzw. fale Nogiera) i synergiczne połączenie z chromoterapią LED oraz biomimetyczną okluzją ceramidowo-lipidową.",
    principles: [
      "Brak wywoływania przewlekłego odczynu zapalnego naskórka",
      "Stymulacja przywspółczulna układu nerwowego w celu wygaszenia reaktywności",
      "Pełne dopasowanie substancji aktywnych identycznych ze spoiwem międzykomórkowym naskórka"
    ]
  },
  treatments: TREATMENTS.map((t) => ({
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    duration: t.duration,
    price: t.price,
    description: t.description,
    indications: t.indications,
    contraindications: t.contraindications,
    activeSubstances: t.activeSubstances,
    postTreatmentCare: t.postTreatmentCare,
    linkToView: `treatment:${t.id}`,
    linkToBook: `book:${t.id}`
  })),
  knowledgeBaseArticles: ARTICLES.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    author: a.author,
    lead: a.lead,
    linkToRead: `article:${a.id}`
  })),
  booking: {
    policy: "Przesyłane zgłoszenie rezerwacji online ma status wstępnej rezerwacji terminu. Po otrzymaniu zgłoszenia, Katarzyna Brzezińska lub asystentka gabinetu podejmuje kontakt telefoniczny w ciągu 2 godzin w celu ustalenia dogodnej godziny i potwierdzenia rezerwacji.",
    pricingSummary: "Ceny zabiegów wahają się od 400 PLN do 800 PLN w zależności od wybranego rytuału i stopnia zaawansowania (Standard vs Premium). Pierwsza wizyta z komputerową diagnozą skóry Nati V3 / Iomet i zabiegiem otwierającym kosztuje 400 - 600 PLN."
  }
};

// Raw text version of the entire database to easily inject as system instructions context into Gemini
export const getKnowledgeBaseTextContext = (): string => {
  return `
=== BAZA WIEDZY I CENNIK INSTYTUTU SLOW SKIN CONCEPT™ ===

O INSTYTUCIE:
- Nazwa: ${KNOWLEDGE_BASE_DATA.institute.name}
- Lokalizacja i adres: ${KNOWLEDGE_BASE_DATA.institute.address}
- Ekspert/Założycielka: ${KNOWLEDGE_BASE_DATA.institute.expert}
- Telefon: ${KNOWLEDGE_BASE_DATA.institute.contactPhone}
- Filozofia: ${KNOWLEDGE_BASE_DATA.institute.philosophy}
- Główne filary:
${KNOWLEDGE_BASE_DATA.institute.pillars.map((p, idx) => `  ${idx + 1}. ${p}`).join("\n")}

METODA AUTORSKA:
- Nazwa: ${KNOWLEDGE_BASE_DATA.method.name}
- Geneza i autor: ${KNOWLEDGE_BASE_DATA.method.origins}
- Mechanizm działania: ${KNOWLEDGE_BASE_DATA.method.coreMechanism}
- Kluczowe zasady:
${KNOWLEDGE_BASE_DATA.method.principles.map((pr) => `  * ${pr}`).join("\n")}

PROCEDURA REZERWACJI I UMÓWIENIA WIZYT:
- Opis: ${KNOWLEDGE_BASE_DATA.booking.policy}
- Ceny podsumowanie: ${KNOWLEDGE_BASE_DATA.booking.pricingSummary}

LISTA WSZYSTKICH GABINETOWYCH ZABIEGÓW (CENNIK, WSKAZANIA, PRZECIWWSKAZANIA):
${TREATMENTS.map((t) => {
  return `
-------------------------------------------
* ZABIEG: ${t.title}
  - Podtytuł: ${t.subtitle}
  - Czas trwania: ${t.duration}
  - Cena: ${t.price}
  - Opis: ${t.description}
  - Skupienie działania (Focus): ${t.focus}
  - Wskazania:
${t.indications.map((i) => `    * ${i}`).join("\n")}
  - Przeciwwskazania:
${t.contraindications.map((c) => `    * ${c}`).join("\n")}
  - Pielęgnacja pozabiegowa:
${t.postTreatmentCare.map((pt) => `    * ${pt}`).join("\n")}
  - Składniki aktywne:
${t.activeSubstances.map((as) => `    * ${as}`).join("\n")}
  - LINKI INTERAKTYWNE DO TEGO ZABIEGU:
    - Aby wyświetlić szczegóły tego zabiegu: treatment:${t.id}
    - Aby rozpocząć rezerwację/umówienie tego zabiegu: book:${t.id}
`;
}).join("\n")}

BAZA WIEDZY (ARTYKUŁY EDITORIAL):
${ARTICLES.map((a) => {
  return `
-------------------------------------------
* ARTYKUŁ: "${a.title}"
  - Kategoria: ${a.category}
  - Autor: ${a.author}
  - Czas czytania: ${a.readingTime}
  - Wprowadzenie: ${a.lead}
  - Cytat powiązany: "${a.quote}"
  - Link do pełnego artykułu: article:${a.id}
`;
}).join("\n")}
`;
};
