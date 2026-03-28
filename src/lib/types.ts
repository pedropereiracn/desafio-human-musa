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
