"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Idea } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: Idea;
  index: number;
  selected: boolean;
  onSelect: (idea: Idea) => void;
}

export default function IdeaCard({ idea, index, selected, onSelect }: IdeaCardProps) {
  const [showWhy, setShowWhy] = useState(false);

  const difficultyColor = {
    "fácil": "bg-green-500/10 text-green-400",
    "médio": "bg-yellow-500/10 text-yellow-400",
    "avançado": "bg-red-500/10 text-red-400",
  };

  return (
    <button
      onClick={() => onSelect(idea)}
      className={cn(
        "w-full text-left p-5 rounded-2xl transition-all duration-200 card hover-lift",
        selected && "!border-l-2 !border-l-primary !bg-primary/[0.04]"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
          selected
            ? "bg-gradient-to-br from-primary to-orange-400 text-white shadow-sm shadow-primary/20"
            : "bg-surface-2 text-muted-foreground"
        )}>
          {index + 1}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-foreground">
            {idea.title}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{idea.format}</span>
            {idea.difficultyLevel && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-medium",
                difficultyColor[idea.difficultyLevel] || "bg-surface-2 text-muted-foreground"
              )}>
                {idea.difficultyLevel}
              </span>
            )}
          </div>

          <div className="bg-surface-2 rounded-lg p-3">
            <p className="text-xs text-muted-foreground/70 mb-1">Gancho:</p>
            <p className="text-sm font-medium text-foreground">&quot;{idea.hook}&quot;</p>
          </div>

          <p className="text-sm text-muted-foreground">{idea.angle}</p>

          <p className="text-xs text-muted-foreground/70 leading-relaxed">{idea.description}</p>

          {idea.whyItWorks && (
            <div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowWhy(!showWhy); }}
                className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors"
              >
                {showWhy ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                Por que funciona?
              </button>
              {showWhy && (
                <p className="mt-1 text-xs text-primary/60 bg-primary/5 rounded-lg p-2 leading-relaxed">
                  {idea.whyItWorks}
                </p>
              )}
            </div>
          )}

          {selected && (
            <div className="flex items-center gap-1 text-primary text-sm font-medium pt-1">
              Gerar copy
              <ArrowRight size={14} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
