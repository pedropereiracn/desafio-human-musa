"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Loader2,
  AlignCenter,
  AlignLeft,
  Columns2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { CarouselSlide, CarouselTemplate, SlideLayout, SlideBackgroundType } from "@/lib/types";
import { getTemplate, getSlideSizeForPlatform } from "@/lib/carousel-templates";
import SlidePreview from "./SlidePreview";
import SlideTemplates from "./SlideTemplates";
import CarouselExport from "./CarouselExport";

interface CarouselEditorProps {
  initialSlides: CarouselSlide[];
  platform: string;
  topic: string;
  onSave?: (slides: CarouselSlide[], templateId: string) => void;
}

let slideCounter = 100;

export default function CarouselEditor({ initialSlides, platform, topic, onSave }: CarouselEditorProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>(initialSlides);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [templateId, setTemplateId] = useState("obsidian");
  const [regenerating, setRegenerating] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-save when slides change
  useEffect(() => {
    if (!onSave) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      onSave(slides, templateId);
    }, 1000);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [slides, templateId, onSave]);

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
      if (template.id === "custom") return;
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
        // Silent fail, user can try again
      } finally {
        setRegenerating(false);
      }
    },
    [slides, topic, platform, updateSlide]
  );

  if (!selected) return null;

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
            />
            <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white/60 drop-shadow">
              {i + 1}
            </span>
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

        {/* Layout */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Layout
          </label>
          <div className="flex gap-1.5">
            {([
              { value: "centered", icon: AlignCenter, label: "Centro" },
              { value: "left", icon: AlignLeft, label: "Esquerda" },
              { value: "split", icon: Columns2, label: "Split" },
            ] as const).map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => updateSlide(selectedIndex, { layout: value as SlideLayout })}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] transition-all border",
                  selected.layout === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Type */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Fundo
          </label>
          <div className="flex gap-1.5">
            {(["solid", "gradient"] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateSlide(selectedIndex, { backgroundType: type as SlideBackgroundType })}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-medium transition-all border capitalize",
                  selected.backgroundType === type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {type === "solid" ? "Sólido" : "Gradiente"}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Cores
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2">
              <input
                type="color"
                value={selected.colors.background}
                onChange={(e) =>
                  updateSlide(selectedIndex, {
                    colors: { ...selected.colors, background: e.target.value },
                  })
                }
                className="w-6 h-6 rounded cursor-pointer border border-border"
              />
              <span className="text-[10px] text-muted-foreground">Fundo</span>
            </label>
            {selected.backgroundType === "gradient" && (
              <label className="flex items-center gap-2">
                <input
                  type="color"
                  value={selected.colors.backgroundEnd || selected.colors.background}
                  onChange={(e) =>
                    updateSlide(selectedIndex, {
                      colors: { ...selected.colors, backgroundEnd: e.target.value },
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer border border-border"
                />
                <span className="text-[10px] text-muted-foreground">Fundo 2</span>
              </label>
            )}
            <label className="flex items-center gap-2">
              <input
                type="color"
                value={selected.colors.text}
                onChange={(e) =>
                  updateSlide(selectedIndex, {
                    colors: { ...selected.colors, text: e.target.value },
                  })
                }
                className="w-6 h-6 rounded cursor-pointer border border-border"
              />
              <span className="text-[10px] text-muted-foreground">Texto</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="color"
                value={selected.colors.accent}
                onChange={(e) =>
                  updateSlide(selectedIndex, {
                    colors: { ...selected.colors, accent: e.target.value },
                  })
                }
                className="w-6 h-6 rounded cursor-pointer border border-border"
              />
              <span className="text-[10px] text-muted-foreground">Accent</span>
            </label>
          </div>
        </div>

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
          />
        </div>
      </div>
    </div>
  );
}
