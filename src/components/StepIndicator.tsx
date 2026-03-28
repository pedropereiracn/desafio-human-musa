"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Step } from "@/lib/types";

const steps: { id: Step; label: string; number: number }[] = [
  { id: "references", label: "Referências", number: 1 },
  { id: "ideas", label: "Ideias", number: 2 },
  { id: "copy", label: "Copy", number: 3 },
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
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) && !isActive;
          const isClickable = isCompleted || isActive;
          const isPast = i < currentIndex;

          return (
            <div key={step.id} className="flex items-center">
              {i > 0 && (
                <div className={cn(
                  "w-12 h-px mx-1",
                  isPast || isActive ? "bg-primary/40" : "bg-border"
                )} />
              )}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive && "text-foreground",
                  isCompleted && "text-muted-foreground hover:text-foreground cursor-pointer",
                  !isActive && !isCompleted && "text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                <span className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all",
                  isActive && "bg-primary text-white",
                  isCompleted && "bg-green-500/20 text-green-400",
                  !isActive && !isCompleted && "bg-surface-2 text-muted-foreground/40"
                )}>
                  {isCompleted ? <Check size={12} /> : step.number}
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
