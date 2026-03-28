"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Idea } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: Idea;
  index: number;
  selected: boolean;
  onSelect: (idea: Idea) => void;
}

export default function IdeaCard({ idea, index, selected, onSelect }: IdeaCardProps) {
  return (
    <button
      onClick={() => onSelect(idea)}
      className={cn(
        "animate-slide-up w-full text-left p-5 rounded-xl transition-all duration-300",
        selected
          ? "glass-card glow-border-active"
          : "glass-card hover:-translate-y-0.5"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all",
          selected
            ? "bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30"
            : "bg-white/5 text-muted-foreground"
        )}>
          {index + 1}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className={cn(
            "font-semibold transition-colors",
            selected ? "gradient-text" : "text-foreground"
          )}>
            {idea.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-primary/60" />
            <span>{idea.format}</span>
          </div>

          <div className="glass rounded-lg p-2.5">
            <p className="text-xs text-muted-foreground/70 mb-1">Gancho:</p>
            <p className="text-sm font-medium text-foreground">&quot;{idea.hook}&quot;</p>
          </div>

          <p className="text-sm text-muted-foreground">{idea.angle}</p>

          <p className="text-xs text-muted-foreground/70 leading-relaxed">{idea.description}</p>

          {selected && (
            <div className="flex items-center gap-1 text-primary text-sm font-medium pt-1 animate-fade-in">
              Gerar copy para esta ideia
              <ArrowRight size={14} className="animate-float" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
