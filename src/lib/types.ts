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
}

export interface CopyResult {
  caption: string;
  hashtags: string[];
  cta: string;
  script?: string;
  notes: string;
}

export type Step = "search" | "references" | "ideas" | "copy";
