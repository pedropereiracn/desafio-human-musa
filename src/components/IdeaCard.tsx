"use client";

import { ArrowRight } from "lucide-react";
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
        "w-full text-left p-5 rounded-xl transition-all duration-200 card",
        selected && "border-l-2 border-l-primary bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
          selected
            ? "bg-primary text-white"
            : "bg-surface-2 text-muted-foreground"
        )}>
          {index + 1}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-foreground">
            {idea.title}
          </h3>

          <div className="text-xs text-muted-foreground">
            {idea.format}
          </div>

          <div className="bg-surface-2 rounded-lg p-3">
            <p className="text-xs text-muted-foreground/70 mb-1">Gancho:</p>
            <p className="text-sm font-medium text-foreground">&quot;{idea.hook}&quot;</p>
          </div>

          <p className="text-sm text-muted-foreground">{idea.angle}</p>

          <p className="text-xs text-muted-foreground/70 leading-relaxed">{idea.description}</p>

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
