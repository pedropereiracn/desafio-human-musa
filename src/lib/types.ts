// ═══ EXISTING TYPES ═══

export type Platform = "instagram" | "tiktok";
export type Format = "reels" | "carrossel" | "post" | "stories";

export interface SearchParams {
  topic: string;
  platform: Platform;
  format: Format;
}

export interface Reference {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  author: string;
  platform: Platform;
}

export interface AnalyzedReference extends Reference {
  analysis: string;
  relevanceScore: number;
  hookType?: string;
  emotionalTrigger?: string;
}

export interface BriefResult {
  topic: string;
  platform: Platform;
  format: Format;
  tone: string;
  audience: string;
  requirements: string[];
  missingInfo: string[];
  clarificationQuestions: string[];
  summary: string;
}

export interface Idea {
  id: string;
  title: string;
  angle: string;
  format: string;
  hook: string;
  description: string;
  difficultyLevel?: "fácil" | "médio" | "avançado";
  whyItWorks?: string;
}

export interface CopyResult {
  caption: string;
  hashtags: string[];
  cta: string;
  script?: string;
  notes: string;
  hookVariations?: string[];
  engagementScore?: number;
  bestTimeToPost?: string;
}

export type Step = "search" | "references" | "ideas" | "copy";

// ═══ WORKSPACE TYPES ═══

export type CopyType = "ad" | "social" | "email" | "headline" | "carrossel";
export type Tone = "formal" | "casual" | "provocativo" | "inspiracional";

export interface ClientProfile {
  id: string;
  name: string;
  segment: string;
  brandVoice: string;
  targetAudience: string;
  platforms: Platform[];
  preferredFormats: Format[];
  notes: string;
  color: string;
  createdAt: string;
}

export interface SavedBrief {
  id: string;
  clientId?: string;
  rawBriefing: string;
  decodedResult: BriefResult;
  createdAt: string;
}

export interface CopyHistoryItem {
  id: string;
  clientId?: string;
  module: "musa" | "copy-lab";
  prompt: string;
  result: CopyResult;
  copyType?: CopyType;
  tone?: Tone;
  platform: Platform;
  createdAt: string;
}

export interface UserPreferences {
  sidebarCollapsed: boolean;
  selectedClientId?: string;
}

export interface ActivityItem {
  id: string;
  type: "brief" | "copy" | "client" | "search";
  title: string;
  clientId?: string;
  module: string;
  createdAt: string;
}

export interface CalendarEntry {
  id: string;
  date: string;
  clientId?: string;
  title: string;
  platform: Platform;
  status: "rascunho" | "agendado" | "publicado";
}

export interface ReportData {
  clientId?: string;
  period: string;
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    followers: number;
    bestPost: string;
  };
  insights: string;
}

// ═══ CAROUSEL TYPES ═══

export type SlideLayout = "centered" | "left" | "split";
export type SlideBackgroundType = "solid" | "gradient";
export type SlideType = "cover" | "content" | "statistic" | "quote" | "list" | "cta";
export type TypographyStyle = "uppercase-bold" | "elegant" | "playful" | "minimal" | "tech" | "editorial";
export type VisualStyle = "corporate" | "bold" | "elegant" | "creative" | "tech" | "editorial";

export interface BrandKit {
  brandName: string;
  palette: {
    primary: string;
    secondary: string;
    background: string;
    backgroundAlt: string;
    text: string;
    accent: string;
  };
  typography: {
    headlineStyle: TypographyStyle;
    bodyStyle: "clean" | "serif" | "mono";
  };
  visualStyle: VisualStyle;
  decorativeElements: string[];
  handle?: string;
  fonts?: {
    url: string;
    headline: string;
    body: string;
  };
  backgrounds?: {
    cover: string;
    content: string;
    contentAlt: string;
    statistic: string;
    quote: string;
    quoteAlt: string;
    cta: string;
  };
}

export interface CarouselSlide {
  id: string;
  order: number;
  headline: string;
  body?: string;
  footnote?: string;
  backgroundType: SlideBackgroundType;
  colors: {
    background: string;
    backgroundEnd?: string;
    text: string;
    accent: string;
  };
  layout: SlideLayout;
  slideType?: SlideType;
  listItems?: string[];
  statValue?: string;
  statLabel?: string;
  quoteAttribution?: string;
  htmlContent?: string; // HTML+CSS auto-contido gerado pelo Claude (rich slides)
}

export interface CarouselProject {
  id: string;
  title: string;
  platform: Platform;
  slides: CarouselSlide[];
  templateId: string;
  brandHandle?: string;
  brandKit?: BrandKit;
}

export interface CarouselTemplate {
  id: string;
  name: string;
  defaults: {
    backgroundType: SlideBackgroundType;
    colors: CarouselSlide["colors"];
    layout: SlideLayout;
  };
  slideSize: { width: number; height: number };
  brandKit: BrandKit;
}
