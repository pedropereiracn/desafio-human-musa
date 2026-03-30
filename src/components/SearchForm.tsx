"use client";

import { useState } from "react";
import { Search, Loader2, Camera, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Platform, Format } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (topic: string, platform: Platform, format: Format) => void;
  isLoading: boolean;
  initialTopic?: string;
  initialPlatform?: Platform;
  initialFormat?: Format;
}

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
          placeholder="Ex: cuidados com a pele, marketing digital..."
          className="w-full input-field"
        />
        <p className="text-xs text-muted-foreground/60 mt-2">
          Ex: marketing digital, skincare, receitas fit
        </p>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Plataforma
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPlatform("instagram")}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
              platform === "instagram"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-surface-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            )}
          >
            <Camera size={16} />
            Instagram
          </button>
          <button
            type="button"
            onClick={() => setPlatform("tiktok")}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
              platform === "tiktok"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-surface-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.24 8.24 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.01z"/></svg>
            TikTok
          </button>
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Formato
        </label>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFormat(f.value)}
              className={cn(
                "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                format === f.value
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-surface-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!topic.trim() || isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all",
          topic.trim() && !isLoading
            ? "btn-primary"
            : "bg-surface-2 text-muted-foreground cursor-not-allowed border border-white/[0.04] px-6 py-3.5"
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
            <ArrowRight size={14} />
          </>
        )}
      </motion.button>
    </form>
  );
}
