"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Layers, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CarouselEditor from "@/components/carousel/CarouselEditor";
import type { CarouselSlide, Platform, Tone } from "@/lib/types";
import { getTemplate } from "@/lib/carousel-templates";

interface GeneratedData {
  slides: { headline: string; body?: string; footnote?: string }[];
  caption: string;
  hashtags: string[];
}

export default function CarouselPage() {
  return (
    <Suspense>
      <CarouselPageInner />
    </Suspense>
  );
}

function CarouselPageInner() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("casual");
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[] | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<{ caption: string; hashtags: string[] } | null>(null);
  const searchParams = useSearchParams();

  // Pre-fill from Musa pipeline URL params
  useEffect(() => {
    const paramTopic = searchParams.get("topic");
    const paramPlatform = searchParams.get("platform") as Platform | null;
    if (paramTopic) setTopic(paramTopic);
    if (paramPlatform && (paramPlatform === "instagram" || paramPlatform === "tiktok")) {
      setPlatform(paramPlatform);
    }
  }, [searchParams]);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error("Insira um tópico para o carrossel");
      return;
    }

    setLoading(true);
    setSlides(null);

    try {
      // Check for existing context from Musa pipeline in sessionStorage
      let context;
      const storedContext = typeof window !== "undefined" ? sessionStorage.getItem("carousel-context") : null;
      if (storedContext) {
        context = JSON.parse(storedContext);
        sessionStorage.removeItem("carousel-context");
      }

      const res = await fetch("/api/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, context }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data: GeneratedData = await res.json();

      const template = getTemplate("obsidian");
      const carouselSlides: CarouselSlide[] = data.slides.map((s, i) => ({
        id: `slide-${i}`,
        order: i,
        headline: s.headline,
        body: s.body || "",
        footnote: s.footnote || "",
        backgroundType: template.defaults.backgroundType,
        colors: { ...template.defaults.colors },
        layout: template.defaults.layout,
      }));

      setSlides(carouselSlides);
      setGeneratedCaption({ caption: data.caption, hashtags: data.hashtags });
      toast.success(`${carouselSlides.length} slides gerados!`);
    } catch (error) {
      console.error("Carousel generation error:", error);
      toast.error("Erro ao gerar carrossel. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [topic, platform, tone]);

  const handleReset = useCallback(() => {
    setSlides(null);
    setGeneratedCaption(null);
    setTopic("");
  }, []);

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!slides ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-xl mx-auto pt-8 w-full"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                <Layers size={14} />
                Criador de Carrosséis
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Crie carrosséis que <span className="gradient-text">engajam.</span>
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Gere slides automaticamente com IA, customize visual e cores, e exporte pronto para postar.
              </p>
            </div>

            <div className="card p-6 space-y-4">
              {/* Topic */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Tópico do carrossel
                </label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: 5 dicas de produtividade para empreendedores"
                  className="input-field w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>

              {/* Platform */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Plataforma
                </label>
                <div className="flex gap-2">
                  {(["instagram", "tiktok"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border capitalize",
                        platform === p
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {p === "instagram" ? "Instagram" : "TikTok"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Tom
                </label>
                <div className="flex gap-2 flex-wrap">
                  {(["casual", "formal", "provocativo", "inspiracional"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all border capitalize",
                        tone === t
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full flex items-center justify-center gap-2 btn-primary !py-3 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Sparkles size={18} />
                )}
                {loading ? "Gerando slides..." : "Gerar Carrossel"}
                {!loading && <ArrowRight size={16} />}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h1 className="text-xl font-bold text-foreground">Editor de Carrossel</h1>
                <p className="text-sm text-muted-foreground">{slides.length} slides &mdash; {topic}</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/20 transition-colors"
              >
                Novo carrossel
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0">
              <CarouselEditor
                initialSlides={slides}
                platform={platform}
                topic={topic}
              />
            </div>

            {/* Generated Caption */}
            {generatedCaption && (
              <div className="mt-4 card p-4 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">Caption gerada</h3>
                  <button
                    onClick={async () => {
                      const text = `${generatedCaption.caption}\n\n${generatedCaption.hashtags.map(h => `#${h}`).join(" ")}`;
                      await navigator.clipboard.writeText(text);
                      toast.success("Caption copiada!");
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-sm text-foreground/80 whitespace-pre-line mb-2">
                  {generatedCaption.caption}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {generatedCaption.hashtags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-surface-2 text-primary/80 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
