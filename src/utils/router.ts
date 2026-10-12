/**
 * SEO & History API Router for Slow Skin Concept
 * Manages clean canonical URLs, Googlebot crawlability, browser history (pushState/popstate),
 * and dynamic SEO tags (title, description, canonical link, open graph).
 */

import { TREATMENTS, ARTICLES } from "../data";
import { Treatment, MagazineArticle } from "../types";

export interface RouteState {
  tab: "cover" | "journal" | "method" | "clinic" | "diagnose" | "account" | "shop" | "training";
  treatmentSlug?: string | null;
  articleSlug?: string | null;
  diagnoseSubTab?: "analyzer" | "barrierMap" | "plan";
  isBookingOpen?: boolean;
}

/**
 * Parses the current window.location.pathname and returns the corresponding state.
 */
export function parseCurrentRoute(): RouteState {
  if (typeof window === "undefined") {
    return { tab: "cover" };
  }

  // Normalize path: lowercase and remove trailing slash
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const searchParams = new URLSearchParams(window.location.search);
  const bookingParam = searchParams.get("rezerwacja") || searchParams.get("booking");

  // 1. Root / Cover
  if (path === "/" || path === "/okladka" || path === "/home") {
    return { tab: "cover", isBookingOpen: bookingParam === "true" };
  }

  // 2. Specialized Knowledge Base & Educational Articles URLs (from Google Search Console / Baza Wiedzy)
  if (
    path === "/baza-wiedzy/jak-odbudowac-bariere-hydrolipidowa" ||
    path.includes("jak-odbudowac-bariere-hydrolipidowa")
  ) {
    return { tab: "journal", articleSlug: "art-hydrolipid-barrier" };
  }
  if (
    path === "/baza-wiedzy/skora-wrazliwa-reaktywna" ||
    path.includes("skora-wrazliwa-reaktywna")
  ) {
    return { tab: "journal", articleSlug: "art-slow-skin-philosophy" };
  }
  if (
    path === "/baza-wiedzy/neurolifting-dla-kogo" ||
    path.includes("neurolifting-dla-kogo")
  ) {
    return { tab: "journal", articleSlug: "art-neurobiology-skin" };
  }
  if (
    path === "/baza-wiedzy/jak-przygotowac-sie-do-wizyty" ||
    path.includes("jak-przygotowac-sie-do-wizyty") ||
    path === "/pierwsza-wizyta-diagnostyka-skory" ||
    path === "/pierwsza-wizyta"
  ) {
    return { tab: "clinic", treatmentSlug: "skin-readiness" };
  }
  if (path === "/baza-wiedzy" || path === "/edukacja") {
    return { tab: "journal" };
  }

  // 3. Treatments (Menu Zabiegowe, Monografie i kategorie problemowe)
  if (
    path === "/zabiegi" ||
    path === "/menu-zabiegowe" ||
    path === "/klinika" ||
    path === "/oferta" ||
    path === "/zabiegi-na-twarz"
  ) {
    return { tab: "clinic", isBookingOpen: bookingParam === "true" };
  }

  // Direct problem/therapy routes mapping to key treatments
  if (path === "/zabiegi-slow-aging" || path === "/slow-aging") {
    return { tab: "clinic", treatmentSlug: "lift-firm-therapy" };
  }
  if (path === "/odbudowa-bariery-hydrolipidowej") {
    return { tab: "clinic", treatmentSlug: "rosacea-calm-therapy" };
  }
  if (path === "/terapia-skory-wrazliwej-i-reaktywnej") {
    return { tab: "clinic", treatmentSlug: "couperose-therapy" };
  }
  if (path === "/cera-naczynkowa-rumien") {
    return { tab: "clinic", treatmentSlug: "couperose-therapy" };
  }
  if (path === "/neurolifting") {
    return { tab: "clinic", treatmentSlug: "neurolifting-nogier" };
  }
  if (path === "/meso-remodeling") {
    return { tab: "clinic", treatmentSlug: "skin-remodeling-therapy" };
  }
  if (path === "/hifu-lifting" || path === "/hifu") {
    return { tab: "clinic", treatmentSlug: "hifu-lifting" };
  }
  if (path === "/rf-microneedling") {
    return { tab: "clinic", treatmentSlug: "rf-microneedling" };
  }
  if (path === "/hydrogen-purification") {
    return { tab: "clinic", treatmentSlug: "hydrogen-purification" };
  }
  if (path === "/ceragem") {
    return { tab: "clinic", treatmentSlug: "ceragem-thermal-massage" };
  }
  if (path === "/pst") {
    return { tab: "clinic", treatmentSlug: "pst-signal-therapy" };
  }

  // Treatment Slugs: /zabiegi/[slug] or /zabieg/[slug]
  if (path.startsWith("/zabiegi/") || path.startsWith("/zabieg/")) {
    const slug = path.replace(/^\/(zabiegi|zabieg)\//, "").trim();
    return {
      tab: "clinic",
      treatmentSlug: slug,
      isBookingOpen: bookingParam === "true"
    };
  }

  // Direct match to treatment IDs (e.g. /acne-balance-therapy)
  const directTreatment = TREATMENTS.find(
    (t) => t.id === path.replace(/^\//, "")
  );
  if (directTreatment) {
    return {
      tab: "clinic",
      treatmentSlug: directTreatment.id,
      isBookingOpen: bookingParam === "true"
    };
  }

  // 4. Methodology & Philosophy
  if (
    path === "/metoda" ||
    path === "/metodologia" ||
    path === "/filozofia" ||
    path === "/o-nas" ||
    path === "/katarzyna-brzezinska" ||
    path === "/o-mnie"
  ) {
    return { tab: "method" };
  }

  // 5. Articles / Journal / Knowledge
  if (
    path === "/artykuly" ||
    path === "/magazyn" ||
    path === "/journal" ||
    path === "/wiedza"
  ) {
    return { tab: "journal" };
  }
  if (
    path.startsWith("/artykuly/") ||
    path.startsWith("/artykul/") ||
    path.startsWith("/magazyn/") ||
    path.startsWith("/baza-wiedzy/")
  ) {
    const slug = path.replace(/^\/(artykuly|artykul|magazyn|baza-wiedzy)\//, "").trim();
    // Try matching article by slug or prefix
    const article = ARTICLES.find(
      (a) => a.id === slug || a.id.replace(/^art-/, "") === slug.replace(/^art-/, "")
    );
    return {
      tab: "journal",
      articleSlug: article ? article.id : slug
    };
  }

  // Direct match to article IDs
  const directArticle = ARTICLES.find(
    (a) => a.id === path.replace(/^\//, "")
  );
  if (directArticle) {
    return {
      tab: "journal",
      articleSlug: directArticle.id
    };
  }

  // 6. Diagnostics
  if (path === "/diagnoza" || path === "/analizator" || path === "/diagnostyka") {
    return { tab: "diagnose", diagnoseSubTab: "analyzer" };
  }
  if (path === "/paszport-skory" || path === "/paszport" || path === "/mapa-bariery") {
    return { tab: "diagnose", diagnoseSubTab: "barrierMap" };
  }

  // 7. Shop
  if (path === "/sklep" || path === "/produkty" || path === "/kosmetyki") {
    return { tab: "shop" };
  }

  // 8. Training / Academy
  if (path === "/szkolenia" || path === "/akademia" || path === "/kursy") {
    return { tab: "training" };
  }

  // 9. Patient Account
  if (path === "/konto" || path === "/profil" || path === "/panel-pacjenta") {
    return { tab: "account" };
  }

  // 10. Direct Booking route
  if (path === "/rezerwacja" || path === "/umow-wizyte") {
    const zabieg = searchParams.get("zabieg");
    return {
      tab: zabieg ? "clinic" : "cover",
      treatmentSlug: zabieg,
      isBookingOpen: true
    };
  }

  // 11. Social Proof & Contact
  if (path === "/opinie" || path === "/rekomendacje") {
    return { tab: "cover" };
  }
  if (path === "/kontakt") {
    return { tab: "cover" };
  }

  // Default fallback
  return { tab: "cover" };
}

/**
 * Returns the canonical URL path for a given app state.
 */
export function getPathForRoute(state: RouteState): string {
  if (state.treatmentSlug) {
    return `/zabiegi/${state.treatmentSlug}`;
  }
  if (state.articleSlug) {
    return `/artykuly/${state.articleSlug}`;
  }
  if (state.tab === "clinic") {
    return "/zabiegi";
  }
  if (state.tab === "method") {
    return "/metodologia";
  }
  if (state.tab === "journal") {
    return "/artykuly";
  }
  if (state.tab === "diagnose") {
    return state.diagnoseSubTab === "barrierMap" ? "/paszport-skory" : "/diagnoza";
  }
  if (state.tab === "shop") {
    return "/sklep";
  }
  if (state.tab === "training") {
    return "/szkolenia";
  }
  if (state.tab === "account") {
    return "/konto";
  }
  return "/";
}

/**
 * Updates browser history and SEO metadata.
 */
export function syncRoute(
  state: RouteState,
  options?: {
    replace?: boolean;
    title?: string;
    description?: string;
    image?: string;
  }
) {
  if (typeof window === "undefined") return;

  const targetPath = getPathForRoute(state);
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  // Only push or replace if path is different (normalized)
  if (targetPath !== currentPath) {
    if (options?.replace) {
      window.history.replaceState({ ...state }, "", targetPath);
    } else {
      window.history.pushState({ ...state }, "", targetPath);
    }
  }

  // Dynamic SEO meta tags update
  updateSeoTags(state, options);
}

/**
 * Dynamically updates document title, meta description, canonical link, and OpenGraph tags
 */
export function updateSeoTags(
  state: RouteState,
  custom?: { title?: string; description?: string; image?: string }
) {
  if (typeof document === "undefined") return;

  let pageTitle = "Instytut Zdrowej Skóry Slow Skin Concept — Biologiczna Terapia Skóry Jelcz-Laskowice";
  let pageDesc = "Instytut Zdrowej Skóry Slow Skin Concept w Jelczu-Laskowicach (k. Wrocławia). Biologiczna terapia skóry, odbudowa bariery hydrolipidowej i autorski Neurolifting.";
  let ogImage = "https://slow-skin-concept.pl/hero-main.png";
  const canonicalUrl = `https://slow-skin-concept.pl${getPathForRoute(state)}`;

  // Find details if treatment or article
  if (state.treatmentSlug) {
    const t = TREATMENTS.find((item) => item.id === state.treatmentSlug);
    if (t) {
      pageTitle = `${t.title} — Monografia Zabiegu | Slow Skin Concept Jelcz-Laskowice`;
      pageDesc = `${t.title} (${t.subtitle || "Terapia Bionomiczna"}). ${t.focus || t.description.slice(0, 150)}... Czas: ${t.duration}, Cena: ${t.price}.`;
      if (t.image) {
        ogImage = t.image.startsWith("http") ? t.image : `https://slow-skin-concept.pl${t.image}`;
      }
    }
  } else if (state.articleSlug) {
    const a = ARTICLES.find((item) => item.id === state.articleSlug);
    if (a) {
      pageTitle = `${a.title} | Magazyn Wiedzy Bionomicznej Slow Skin Concept`;
      pageDesc = `${a.lead || a.title}. Artykuł naukowy autorstwa ${a.author}.`;
      if (a.image) {
        ogImage = a.image.startsWith("http") ? a.image : `https://slow-skin-concept.pl${a.image}`;
      }
    }
  } else {
    switch (state.tab) {
      case "clinic":
        pageTitle = "Katalog Zabiegów i Terapii Bionomicznych | Slow Skin Concept Jelcz-Laskowice";
        pageDesc = "Kompleksowe menu zabiegowe: Acne Balance, Meso Remodeling, Terapia PST, Ceragem, Neurolifting, Sonaris Pro, Karboksyterapia i Peelingi Węglowe.";
        break;
      case "method":
        pageTitle = "Metodologia Bionomiczna i Filozofia Slow Skin | Instytut Jelcz-Laskowice";
        pageDesc = "Filozofia biologicznej odbudowy skóry bez agresywnych uszkodzeń. Pielęgnacja bionomiczna, fizjologia naskórka i równowaga neurobiologiczna.";
        break;
      case "journal":
        pageTitle = "Magazyn Naukowy i Publikacje Eksperckie | Slow Skin Concept";
        pageDesc = "Artykuły naukowe i monografie z zakresu fizjologii skóry, osi mózg-skóra, bariery hydrolipidowej i regeneracji komórkowej.";
        break;
      case "diagnose":
        pageTitle = "Diagnostyka Bionomiczna i Paszport Skóry | Slow Skin Concept";
        pageDesc = "Interaktywny analizator potrzeb skóry, mapa kondycji bariery hydrolipidowej oraz indywidualny plan terapeutyczny.";
        break;
      case "shop":
        pageTitle = "Bionomiczny Sklep Kosmetologiczny | Slow Skin Concept";
        pageDesc = "Wyselekcjonowane preparaty bionomiczne wolne od substancji drażniących, syntetycznych zapachów i parabenów.";
        break;
      case "training":
        pageTitle = "Akademia i Szkolenia Kosmetologii Bionomicznej | Slow Skin Concept";
        pageDesc = "Eksperckie programy certyfikacyjne i warsztaty praktyczne dla kosmetologów oraz specjalistów pielęgnacji.";
        break;
      case "account":
        pageTitle = "Panel Pacjenta i Paszport Skóry | Slow Skin Concept";
        pageDesc = "Zarządzaj swoimi wizytami, historią zabiegów i indywidualnym planem pielęgnacji domowej.";
        break;
      default:
        break;
    }
  }

  // Override if custom passed
  if (custom?.title) pageTitle = custom.title;
  if (custom?.description) pageDesc = custom.description;
  if (custom?.image) ogImage = custom.image;

  // Set document title
  document.title = pageTitle;

  // Set meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", pageDesc);

  // Set canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", canonicalUrl);

  // Set OpenGraph tags
  const setMeta = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setMeta("og:title", pageTitle);
  setMeta("og:description", pageDesc);
  setMeta("og:url", canonicalUrl);
  setMeta("og:image", ogImage);
}
