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
        "animate-fade-in w-full text-left p-5 rounded-xl border transition-all",
        selected
          ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
          : "bg-card border-border hover:border-primary/50"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
        )}>
          {index + 1}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-foreground">{idea.title}</h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles size={12} className="text-primary" />
            <span>{idea.format}</span>
          </div>

          <div className="bg-secondary/50 rounded-lg p-2.5">
            <p className="text-xs text-muted-foreground mb-1">Gancho:</p>
            <p className="text-sm font-medium text-foreground">&quot;{idea.hook}&quot;</p>
          </div>

          <p className="text-sm text-muted-foreground">{idea.angle}</p>

          <p className="text-xs text-muted-foreground leading-relaxed">{idea.description}</p>

          {selected && (
            <div className="flex items-center gap-1 text-primary text-sm font-medium pt-1">
              Gerar copy para esta ideia
              <ArrowRight size={14} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
