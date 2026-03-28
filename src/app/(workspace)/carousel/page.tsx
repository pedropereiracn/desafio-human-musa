"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Layers, Loader2, Sparkles, ArrowRight, Trash2, Clock, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CarouselEditor from "@/components/carousel/CarouselEditor";
import type { CarouselSlide, Platform, Tone, BrandKit, SlideType } from "@/lib/types";
import { getTemplate } from "@/lib/carousel-templates";
import { useCarousels, type SavedCarousel } from "@/hooks/useCarousels";

interface GeneratedSlide {
  slideType?: string;
  headline: string;
  body?: string;
  footnote?: string;
  listItems?: string[];
  statValue?: string;
  statLabel?: string;
  quoteAttribution?: string;
}

interface GeneratedData {
  brandKit?: BrandKit;
  slides: GeneratedSlide[];
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

type ViewMode = "home" | "editor";

function CarouselPageInner() {
  const [topic, setTopic] = useState("");
  const [brandName, setBrandName] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("casual");
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[] | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit | undefined>(undefined);
  const [generatedCaption, setGeneratedCaption] = useState<{ caption: string; hashtags: string[] } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [activeCarouselId, setActiveCarouselId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const { carousels, isLoaded, saveCarousel, updateCarousel, deleteCarousel } = useCarousels();

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
      let context;
      const storedContext = typeof window !== "undefined" ? sessionStorage.getItem("carousel-context") : null;
      if (storedContext) {
        context = JSON.parse(storedContext);
        sessionStorage.removeItem("carousel-context");
      }

      const res = await fetch("/api/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, brandName: brandName.trim() || undefined, context }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details || "Generation failed");
      }
      const data: GeneratedData = await res.json();

      // Use brand kit from API or fallback to template
      const responseBrandKit = data.brandKit;
      const template = getTemplate("corporate");

      const carouselSlides: CarouselSlide[] = data.slides.map((s, i) => ({
        id: `slide-${i}`,
        order: i,
        headline: s.headline,
        body: s.body || "",
        footnote: s.footnote || "",
        backgroundType: template.defaults.backgroundType,
        colors: { ...template.defaults.colors },
        layout: template.defaults.layout,
        slideType: (s.slideType as SlideType) || "content",
        listItems: s.listItems,
        statValue: s.statValue,
        statLabel: s.statLabel,
        quoteAttribution: s.quoteAttribution,
      }));

      setSlides(carouselSlides);
      setBrandKit(responseBrandKit);
      setGeneratedCaption({ caption: data.caption, hashtags: data.hashtags });

      const id = saveCarousel({
        title: topic.slice(0, 60),
        topic,
        platform,
        templateId: "corporate",
        slides: carouselSlides,
        brandKit: responseBrandKit,
        caption: data.caption,
        hashtags: data.hashtags,
      });
      setActiveCarouselId(id);
      setViewMode("editor");
      toast.success(`${carouselSlides.length} slides gerados e salvos!`);
    } catch (error) {
      console.error("Carousel generation error:", error);
      toast.error("Erro ao gerar carrossel. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [topic, platform, tone, brandName, saveCarousel]);

  const handleOpenSaved = useCallback(
    (saved: SavedCarousel) => {
      setTopic(saved.topic);
      setPlatform(saved.platform);
      setSlides(saved.slides);
      setBrandKit(saved.brandKit);
      setActiveCarouselId(saved.id);
      setGeneratedCaption(
        saved.caption ? { caption: saved.caption, hashtags: saved.hashtags || [] } : null
      );
      setViewMode("editor");
    },
    []
  );

  const handleReset = useCallback(() => {
    setSlides(null);
    setBrandKit(undefined);
    setGeneratedCaption(null);
    setActiveCarouselId(null);
    setTopic("");
    setBrandName("");
    setViewMode("home");
  }, []);

  const handleSaveCurrentState = useCallback(
    (updatedSlides: CarouselSlide[], templateId: string, updatedBrandKit?: BrandKit) => {
      if (activeCarouselId) {
        updateCarousel(activeCarouselId, { slides: updatedSlides, templateId, brandKit: updatedBrandKit });
      }
    },
    [activeCarouselId, updateCarousel]
  );

  const handleDeleteCarousel = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      deleteCarousel(id);
      toast.success("Carrossel removido");
    },
    [deleteCarousel]
  );

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <AnimatePresence mode="wait">
        {viewMode === "home" && !slides ? (
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
                Gere slides com identidade visual de marca, tipos variados e design profissional.
              </p>
            </div>

            <div className="card p-6 space-y-4">
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

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Marca <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ex: Rockstar Games, Apple, Nike..."
                  className="input-field w-full"
                />
              </div>

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

            {/* Saved Carousels */}
            {isLoaded && carousels.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Carrosséis salvos ({carousels.length})
                </h2>
                <div className="space-y-2">
                  {carousels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleOpenSaved(c)}
                      className="w-full card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors text-left group"
                    >
                      <div
                        className="w-10 h-10 rounded-md shrink-0 flex items-center justify-center"
                        style={{
                          background: c.brandKit?.palette.primary || c.slides[0]?.colors.background || "#0c0c10",
                        }}
                      >
                        <span
                          style={{ color: c.brandKit?.palette.text || c.slides[0]?.colors.text || "#fff" }}
                          className="text-[8px] font-bold leading-none text-center px-0.5"
                        >
                          {c.slides[0]?.headline.slice(0, 12)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{c.slides.length} slides</span>
                          <span className="capitalize">{c.platform}</span>
                          {c.brandKit?.brandName && (
                            <span className="text-primary/70">{c.brandKit.brandName}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(c.updatedAt).toLocaleDateString("pt-BR")}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="p-1.5 rounded-lg hover:bg-surface-2 text-muted-foreground">
                          <Edit3 size={14} />
                        </span>
                        <span
                          onClick={(e) => handleDeleteCarousel(c.id, e)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h1 className="text-xl font-bold text-foreground">Editor de Carrossel</h1>
                <p className="text-sm text-muted-foreground">
                  {slides?.length || 0} slides &mdash; {topic}
                  {brandKit?.brandName && <span className="text-primary/70 ml-2">{brandKit.brandName}</span>}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/20 transition-colors"
              >
                Novo carrossel
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {slides && (
                <CarouselEditor
                  initialSlides={slides}
                  platform={platform}
                  topic={topic}
                  brandKit={brandKit}
                  onSave={handleSaveCurrentState}
                />
              )}
            </div>

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
