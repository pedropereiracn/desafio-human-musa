"use client";

import { cn } from "@/lib/utils";
import { CAROUSEL_TEMPLATES } from "@/lib/carousel-templates";
import type { CarouselTemplate } from "@/lib/types";

interface SlideTemplatesProps {
  selectedId: string;
  onSelect: (template: CarouselTemplate) => void;
}

export default function SlideTemplates({ selectedId, onSelect }: SlideTemplatesProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Template
      </label>
      <div className="grid grid-cols-3 gap-2">
        {CAROUSEL_TEMPLATES.map((template) => {
          const { colors, backgroundType } = template.defaults;
          const bg =
            backgroundType === "gradient" && colors.backgroundEnd
              ? `linear-gradient(135deg, ${colors.background}, ${colors.backgroundEnd})`
              : colors.background;

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all",
                selectedId === template.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div
                className="w-full aspect-square rounded-md flex items-center justify-center"
                style={{ background: bg }}
              >
                <span
                  style={{ color: colors.text, fontSize: 10, fontWeight: 700 }}
                >
                  Aa
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">{template.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
