"use client";

import { cn } from "@/lib/utils";
import { CAROUSEL_TEMPLATES } from "@/lib/carousel-templates";
import type { CarouselTemplate } from "@/lib/types";

interface SlideTemplatesProps {
  selectedId: string;
  onSelect: (template: CarouselTemplate) => void;
}

const STYLE_LABELS: Record<string, string> = {
  corporate: "Profissional",
  bold: "Impactante",
  elegant: "Sofisticado",
  creative: "Criativo",
  tech: "Tecnológico",
  editorial: "Editorial",
};

export default function SlideTemplates({ selectedId, onSelect }: SlideTemplatesProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Template
      </label>
      <div className="grid grid-cols-3 gap-2">
        {CAROUSEL_TEMPLATES.map((template) => {
          const bk = template.brandKit;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              title={STYLE_LABELS[bk.visualStyle] || bk.visualStyle}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all",
                selectedId === template.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              {/* Mini cover slide preview */}
              <div
                className="w-full aspect-square rounded-md flex flex-col items-center justify-center p-2 relative overflow-hidden"
                style={{ background: bk.palette.primary }}
              >
                {/* Accent detail */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: bk.palette.accent,
                  }}
                />
                <span
                  style={{
                    color: bk.palette.text,
                    fontSize: 9,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    textAlign: "center",
                    letterSpacing: bk.typography.headlineStyle === "uppercase-bold" ? "0.05em" : undefined,
                    textTransform: bk.typography.headlineStyle === "uppercase-bold" || bk.typography.headlineStyle === "tech" ? "uppercase" : undefined,
                    fontFamily: bk.typography.bodyStyle === "serif" ? "Georgia, serif" : bk.typography.bodyStyle === "mono" ? "monospace" : "inherit",
                  }}
                >
                  {template.name}
                </span>
                <div
                  style={{
                    width: 12,
                    height: 2,
                    borderRadius: 1,
                    background: bk.palette.accent,
                    marginTop: 3,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{template.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
