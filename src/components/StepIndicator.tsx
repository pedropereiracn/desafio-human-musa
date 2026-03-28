"use client";

import { cn } from "@/lib/utils";
import { Search, Lightbulb, PenTool, Check } from "lucide-react";
import { Step } from "@/lib/types";

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "references", label: "Referências", icon: <Search size={14} /> },
  { id: "ideas", label: "Ideias", icon: <Lightbulb size={14} /> },
  { id: "copy", label: "Copy", icon: <PenTool size={14} /> },
];

interface StepIndicatorProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
  completedSteps: Step[];
}

export default function StepIndicator({ currentStep, onStepClick, completedSteps }: StepIndicatorProps) {
  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-center mb-10">
      <div className="glass rounded-2xl px-2 py-2 flex items-center gap-1">
        {steps.map((step, i) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) && !isActive;
          const isClickable = isCompleted || isActive;
          const isPast = i < currentIndex;

          return (
            <div key={step.id} className="flex items-center gap-1">
              {i > 0 && (
                <div className="w-8 h-[2px] mx-1 rounded-full overflow-hidden bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      isPast || isActive
                        ? "w-full bg-gradient-to-r from-primary to-accent"
                        : "w-0"
                    )}
                  />
                </div>
              )}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive && "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 glow-border",
                  isCompleted && "bg-white/5 text-foreground hover:bg-white/10 cursor-pointer",
                  !isActive && !isCompleted && "text-muted-foreground/50 cursor-not-allowed"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full text-xs transition-all",
                  isActive && "bg-white/20",
                  isCompleted && "bg-primary/20 text-primary"
                )}>
                  {isCompleted ? <Check size={12} /> : step.icon}
                </span>
                {step.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
