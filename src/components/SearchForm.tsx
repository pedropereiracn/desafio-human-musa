"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Platform, Format } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (topic: string, platform: Platform, format: Format) => void;
  isLoading: boolean;
  initialTopic?: string;
  initialPlatform?: Platform;
  initialFormat?: Format;
}

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
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Qual o tema do conteúdo?
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex: cuidados com a pele, marketing digital, receitas fit..."
          className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Plataforma
          </label>
          <div className="flex gap-2">
            {(["instagram", "tiktok"] as Platform[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all capitalize",
                  platform === p
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {p === "instagram" ? "Instagram" : "TikTok"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Formato
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          >
            <option value="reels">Reels / Vídeo</option>
            <option value="carrossel">Carrossel</option>
            <option value="post">Post Estático</option>
            <option value="stories">Stories</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all",
          topic.trim() && !isLoading
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
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
