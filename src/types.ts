export interface DiagnosticAnswers {
  ageGroup: string;
  skinConcerns: string;
  skinType: string;
  stressLevel: string;
  lifestyle: string;
  treatmentHistory: string;
  expectations: string;
}

export interface DiagnosticReport {
  skinTypeAssessment: string;
  biologicalCauses: string;
  atHomePrescription: {
    morning: string[];
    evening: string[];
  };
  clinicalTherapies: {
    name: string;
    explanation: string;
  }[];
  holisticMindfulness: string;
}

export interface Treatment {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  description: string;
  indications: string[];
  contraindications: string[];
  postTreatmentCare: string[];
  activeSubstances: string[];
  protocolSteps: {
    phase: string;
    description: string;
  }[];
  focus: string;
  image: string;
  faq?: { question: string; answer: string; category?: string; }[];
}

export interface ArticleDataPoint {
  metric: string;
  label: string;
  description: string;
}

export interface ArticleStudyNote {
  citation: string;
  finding: string;
}

export interface ArticleTable {
  caption: string;
  headers: string[];
  rows: {
    ingredient: string;
    role: string;
    effect: string;
    benefit: string;
  }[];
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  table?: ArticleTable;
  callout?: string;
  image?: string;
  imageCaption?: string;
}

export interface ArticleGraphicItem {
  label: string;
  valuePrimary: string;
  sublabelPrimary: string;
  valueSecondary?: string;
  sublabelSecondary?: string;
  percentage?: number;
  trend?: "positive" | "warning" | "neutral";
  note: string;
}

export interface ArticleGraphic {
  image: string;
  imageCaption: string;
  chartTitle: string;
  chartSubtitle: string;
  chartType: "comparison" | "cascade" | "composition";
  data: ArticleGraphicItem[];
  clinicalConclusion: string;
}

export interface MagazineArticle {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  author: string;
  lead: string;
  image?: string;
  imageCaption?: string;
  inArticleGraphic?: ArticleGraphic;
  content: string[];
  sections?: ArticleSection[];
  dataPoints?: ArticleDataPoint[];
  studyNotes?: ArticleStudyNote[];
  practicalTakeaways?: string[];
  quote: string;
}

export interface Review {
  id: string;
  author: string;
  title?: string;
  text: string;
  rating: number;
  service: string;
  platform: "Google" | "Booksy" | "slow-skin.pl";
  problem?: string;
  result?: string;
  duration?: string;
  storyDetails?: string[];
  verified: boolean;
  sourceUrl?: string;
  hasAudioInterview?: boolean;
}

