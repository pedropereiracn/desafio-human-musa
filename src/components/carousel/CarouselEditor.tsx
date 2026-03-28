"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type {
  CarouselSlide,
  CarouselTemplate,
  BrandKit,
  SlideType,
  TypographyStyle,
  VisualStyle,
} from "@/lib/types";
import { getTemplate, getSlideSizeForPlatform } from "@/lib/carousel-templates";
import { useFontLoader } from "@/hooks/useFontLoader";
import SlidePreview from "./SlidePreview";
import SlideTemplates from "./SlideTemplates";
import CarouselExport from "./CarouselExport";

interface CarouselEditorProps {
  initialSlides: CarouselSlide[];
  platform: string;
  topic: string;
  brandKit?: BrandKit;
  onSave?: (slides: CarouselSlide[], templateId: string, brandKit?: BrandKit) => void;
}

let slideCounter = 100;

const SLIDE_TYPES: { value: SlideType; label: string }[] = [
  { value: "cover", label: "Cover" },
  { value: "content", label: "Conteúdo" },
  { value: "statistic", label: "Estatística" },
  { value: "quote", label: "Citação" },
  { value: "list", label: "Lista" },
  { value: "cta", label: "CTA" },
];

const HEADLINE_STYLES: { value: TypographyStyle; label: string }[] = [
  { value: "uppercase-bold", label: "Uppercase Bold" },
  { value: "elegant", label: "Elegant" },
  { value: "playful", label: "Playful" },
  { value: "minimal", label: "Minimal" },
  { value: "tech", label: "Tech" },
  { value: "editorial", label: "Editorial" },
];

const VISUAL_STYLES: { value: VisualStyle; label: string }[] = [
  { value: "corporate", label: "Corporate" },
  { value: "bold", label: "Bold" },
  { value: "elegant", label: "Elegant" },
  { value: "creative", label: "Creative" },
  { value: "tech", label: "Tech" },
  { value: "editorial", label: "Editorial" },
];

export default function CarouselEditor({ initialSlides, platform, topic, brandKit: initialBrandKit, onSave }: CarouselEditorProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>(initialSlides);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [templateId, setTemplateId] = useState("corporate");
  const [regenerating, setRegenerating] = useState(false);
  const [brandKit, setBrandKit] = useState<BrandKit | undefined>(initialBrandKit);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  useFontLoader(brandKit?.fonts?.url);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onSave) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSave(slides, templateId, brandKit);
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [slides, templateId, brandKit, onSave]);

  const { width, height } = getSlideSizeForPlatform(platform);
  const selected = slides[selectedIndex];
  const previewScale = Math.min(500 / width, 500 / height);
  const thumbScale = Math.min(80 / width, 80 / height);

  const updateSlide = useCallback(
    (index: number, updates: Partial<CarouselSlide>) => {
      setSlides((prev) =>
        prev.map((s, i) => (i === index ? { ...s, ...updates } : s))
      );
    },
    []
  );

  const updateBrandKitPalette = useCallback(
    (key: keyof BrandKit["palette"], value: string) => {
      setBrandKit((prev) => {
        if (!prev) return prev;
        return { ...prev, palette: { ...prev.palette, [key]: value } };
      });
    },
    []
  );

  const addSlide = useCallback(() => {
    const template = getTemplate(templateId);
    const newSlide: CarouselSlide = {
      id: `slide-${++slideCounter}`,
      order: slides.length,
      headline: "Novo slide",
      body: "",
      footnote: "",
      backgroundType: template.defaults.backgroundType,
      colors: { ...template.defaults.colors },
      layout: template.defaults.layout,
      slideType: "content",
    };
    setSlides((prev) => [...prev, newSlide]);
    setSelectedIndex(slides.length);
  }, [slides.length, templateId]);

  const removeSlide = useCallback(
    (index: number) => {
      if (slides.length <= 1) return;
      setSlides((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
      setSelectedIndex((prev) => Math.min(prev, slides.length - 2));
    },
    [slides.length]
  );

  const moveSlide = useCallback(
    (index: number, direction: -1 | 1) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= slides.length) return;
      setSlides((prev) => {
        const arr = [...prev];
        [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
        return arr.map((s, i) => ({ ...s, order: i }));
      });
      setSelectedIndex(newIndex);
    },
    [slides.length]
  );

  const applyTemplate = useCallback(
    (template: CarouselTemplate) => {
      setTemplateId(template.id);
      setBrandKit(template.brandKit);
      setSlides((prev) =>
        prev.map((s) => ({
          ...s,
          backgroundType: template.defaults.backgroundType,
          colors: { ...template.defaults.colors },
          layout: template.defaults.layout,
        }))
      );
    },
    []
  );

  const regenerateSlide = useCallback(
    async (index: number) => {
      setRegenerating(true);
      try {
        const res = await fetch("/api/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: `Regenere APENAS 1 slide alternativo para: "${slides[index].headline}". Contexto do carrossel: ${topic}`,
            platform,
            numSlides: 1,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.slides?.[0]) {
          updateSlide(index, {
            headline: data.slides[0].headline,
            body: data.slides[0].body || "",
            footnote: data.slides[0].footnote || "",
          });
        }
      } catch {
        // Silent fail
      } finally {
        setRegenerating(false);
      }
    },
    [slides, topic, platform, updateSlide]
  );

  if (!selected) return null;

  const slideType = selected.slideType || "content";

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Panel - Thumbnails */}
      <div className="lg:w-28 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden p-1 shrink-0">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setSelectedIndex(i)}
            className={cn(
              "relative rounded-lg overflow-hidden border-2 transition-all shrink-0",
              i === selectedIndex
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-transparent hover:border-white/10"
            )}
          >
            <SlidePreview
              slide={slide}
              width={width}
              height={height}
              scale={thumbScale}
              brandKit={brandKit}
            />
            <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white/60 drop-shadow">
              {i + 1}
            </span>
            {slide.slideType && slide.slideType !== "content" && (
              <span className="absolute top-0.5 left-0.5 text-[7px] font-bold text-white/50 bg-black/40 px-1 rounded">
                {slide.slideType}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={addSlide}
          className="w-[80px] h-[80px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shrink-0"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Center Panel - Preview */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="shadow-2xl rounded-lg overflow-hidden"
          >
            <SlidePreview
              slide={selected}
              width={width}
              height={height}
              scale={previewScale}
              brandKit={brandKit}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Panel - Edit */}
      <div className="lg:w-72 space-y-4 overflow-y-auto p-1 shrink-0">
        {/* Slide Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground flex-1">
            Slide {selectedIndex + 1}/{slides.length}
          </span>
          <button
            onClick={() => moveSlide(selectedIndex, -1)}
            disabled={selectedIndex === 0}
            className="p-1.5 rounded-lg hover:bg-surface-2 text-muted-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={() => moveSlide(selectedIndex, 1)}
            disabled={selectedIndex === slides.length - 1}
            className="p-1.5 rounded-lg hover:bg-surface-2 text-muted-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={() => removeSlide(selectedIndex)}
            disabled={slides.length <= 1}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 disabled:opacity-30 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Slide Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tipo de Slide
          </label>
          <select
            value={slideType}
            onChange={(e) => updateSlide(selectedIndex, { slideType: e.target.value as SlideType })}
            className="input-field w-full text-sm"
          >
            {SLIDE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Text Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
              Headline
            </label>
            <textarea
              value={selected.headline}
              onChange={(e) => updateSlide(selectedIndex, { headline: e.target.value })}
              className="input-field w-full resize-none text-sm"
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
              Body
            </label>
            <textarea
              value={selected.body || ""}
              onChange={(e) => updateSlide(selectedIndex, { body: e.target.value })}
              className="input-field w-full resize-none text-sm"
              rows={2}
              placeholder="Texto complementar (opcional)"
            />
          </div>

          {/* Conditional fields based on slide type */}
          {slideType === "statistic" && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                  Valor da Estatística
                </label>
                <input
                  value={selected.statValue || ""}
                  onChange={(e) => updateSlide(selectedIndex, { statValue: e.target.value })}
                  className="input-field w-full text-sm"
                  placeholder="Ex: 87%, 2.5M, 10x"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                  Label da Estatística
                </label>
                <input
                  value={selected.statLabel || ""}
                  onChange={(e) => updateSlide(selectedIndex, { statLabel: e.target.value })}
                  className="input-field w-full text-sm"
                  placeholder="Descrição do número"
                />
              </div>
            </>
          )}

          {slideType === "quote" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                Atribuição
              </label>
              <input
                value={selected.quoteAttribution || ""}
                onChange={(e) => updateSlide(selectedIndex, { quoteAttribution: e.target.value })}
                className="input-field w-full text-sm"
                placeholder="Autor da citação"
              />
            </div>
          )}

          {slideType === "list" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
                Itens da Lista (um por linha)
              </label>
              <textarea
                value={(selected.listItems || []).join("\n")}
                onChange={(e) => updateSlide(selectedIndex, { listItems: e.target.value.split("\n").filter(Boolean) })}
                className="input-field w-full resize-none text-sm"
                rows={4}
                placeholder={"Item 1\nItem 2\nItem 3"}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
              Footnote
            </label>
            <input
              value={selected.footnote || ""}
              onChange={(e) => updateSlide(selectedIndex, { footnote: e.target.value })}
              className="input-field w-full text-sm"
              placeholder="@handle, slide X de Y..."
            />
          </div>

          {/* Regenerate */}
          <button
            onClick={() => regenerateSlide(selectedIndex)}
            disabled={regenerating}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50"
          >
            {regenerating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            Regenerar texto deste slide
          </button>
        </div>

        {/* Brand Kit Section */}
        {brandKit && (
          <div className="space-y-2 border-t border-border pt-3">
            <button
              onClick={() => setBrandKitOpen(!brandKitOpen)}
              className="flex items-center gap-2 w-full text-left"
            >
              <ChevronRight
                size={14}
                className={cn(
                  "text-muted-foreground transition-transform",
                  brandKitOpen && "rotate-90"
                )}
              />
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer">
                Brand Kit{brandKit.brandName ? ` — ${brandKit.brandName}` : ""}
              </label>
            </button>

            {brandKitOpen && (
              <div className="space-y-3 pl-1">
                {/* Handle */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-0.5 block">Handle</label>
                  <input
                    value={brandKit.handle || ""}
                    onChange={(e) => setBrandKit((prev) => prev ? { ...prev, handle: e.target.value } : prev)}
                    className="input-field w-full text-sm"
                    placeholder="@handle"
                  />
                </div>

                {/* Google Fonts (read-only) */}
                {brandKit.fonts && (
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">Fontes</label>
                    <div className="text-xs text-foreground/70 space-y-0.5">
                      <p>Headline: <span className="font-medium text-foreground">{brandKit.fonts.headline}</span></p>
                      <p>Body: <span className="font-medium text-foreground">{brandKit.fonts.body}</span></p>
                    </div>
                  </div>
                )}

                {/* Palette Colors */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-1 block">Paleta</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["primary", "secondary", "background", "backgroundAlt", "text", "accent"] as const).map((key) => (
                      <label key={key} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={brandKit.palette[key]}
                          onChange={(e) => updateBrandKitPalette(key, e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border border-border"
                        />
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {key === "backgroundAlt" ? "Bg Alt" : key}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-0.5 block">Headline Style</label>
                  <select
                    value={brandKit.typography.headlineStyle}
                    onChange={(e) => setBrandKit((prev) => prev ? {
                      ...prev,
                      typography: { ...prev.typography, headlineStyle: e.target.value as TypographyStyle }
                    } : prev)}
                    className="input-field w-full text-sm"
                  >
                    {HEADLINE_STYLES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Visual Style */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-0.5 block">Visual Style</label>
                  <select
                    value={brandKit.visualStyle}
                    onChange={(e) => setBrandKit((prev) => prev ? {
                      ...prev,
                      visualStyle: e.target.value as VisualStyle
                    } : prev)}
                    className="input-field w-full text-sm"
                  >
                    {VISUAL_STYLES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Templates */}
        <SlideTemplates selectedId={templateId} onSelect={applyTemplate} />

        {/* Export */}
        <div className="pt-2 border-t border-border">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Exportar
          </label>
          <CarouselExport
            slides={slides}
            width={width}
            height={height}
            title={topic.slice(0, 30).replace(/\s+/g, "-")}
            brandKit={brandKit}
          />
        </div>
      </div>
    </div>
  );
}
