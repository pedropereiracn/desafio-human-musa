"use client";

import { useState } from "react";
import { Search, Loader2, Camera, Sparkles } from "lucide-react";
import { Platform, Format } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (topic: string, platform: Platform, format: Format) => void;
  isLoading: boolean;
  initialTopic?: string;
  initialPlatform?: Platform;
  initialFormat?: Format;
}

const trendingTopics = [
  "Skincare",
  "Marketing Digital",
  "Receitas Fit",
  "Finanças Pessoais",
  "Moda Sustentável",
  "Produtividade",
  "Pets",
  "Viagens",
];

const formats: { value: Format; label: string }[] = [
  { value: "reels", label: "Reels / Vídeo" },
  { value: "carrossel", label: "Carrossel" },
  { value: "post", label: "Post Estático" },
  { value: "stories", label: "Stories" },
];

export default function SearchForm({ onSearch, isLoading, initialTopic = "", initialPlatform = "instagram", initialFormat = "reels" }: SearchFormProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [format, setFormat] = useState<Format>(initialFormat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSearch(topic.trim(), platform, format);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Qual o tema do conteúdo?
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex: cuidados com a pele, marketing digital, receitas fit..."
          className="w-full px-4 py-3 glass-input rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all"
        />
      </div>

      {/* Trending Chips */}
      <div className="flex flex-wrap gap-2">
        {trendingTopics.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            className={cn(
              "animate-scale-in px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              "bg-white/5 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20",
              topic === t && "bg-primary/10 text-primary border-primary/20"
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Sparkles size={10} className="inline mr-1 opacity-50" />
            {t}
          </button>
        ))}
      </div>

      {/* Platform & Format */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Plataforma
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPlatform("instagram")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                platform === "instagram"
                  ? "glass border-primary/30 text-primary glow-border"
                  : "glass text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              <Camera size={16} />
              Instagram
            </button>
            <button
              type="button"
              onClick={() => setPlatform("tiktok")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                platform === "tiktok"
                  ? "glass border-primary/30 text-primary glow-border"
                  : "glass text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.24 8.24 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.01z"/></svg>
              TikTok
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Formato
          </label>
          <div className="flex flex-wrap gap-1.5">
            {formats.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                  format === f.value
                    ? "glass border-primary/30 text-primary"
                    : "glass text-muted-foreground hover:text-foreground hover:border-white/10"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
          topic.trim() && !isLoading
            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99]"
            : "glass text-muted-foreground cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Buscando referências...
          </>
        ) : (
          <>
            <Search size={18} />
            Buscar Referências
          </>
        )}
      </button>
    </form>
  );
}
