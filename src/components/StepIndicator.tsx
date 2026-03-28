"use client";

import { cn } from "@/lib/utils";
import { Search, Lightbulb, PenTool } from "lucide-react";
import { Step } from "@/lib/types";

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "references", label: "Referências", icon: <Search size={16} /> },
  { id: "ideas", label: "Ideias", icon: <Lightbulb size={16} /> },
  { id: "copy", label: "Copy", icon: <PenTool size={16} /> },
];

interface StepIndicatorProps {
  currentStep: Step;
  onStepClick: (step: Step) => void;
  completedSteps: Step[];
}

export default function StepIndicator({ currentStep, onStepClick, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => {
        const isActive = currentStep === step.id;
        const isCompleted = completedSteps.includes(step.id);
        const isClickable = isCompleted || isActive;

        return (
          <div key={step.id} className="flex items-center gap-2">
            {i > 0 && (
              <div className={cn(
                "w-12 h-px",
                isCompleted || isActive ? "bg-primary" : "bg-border"
              )} />
            )}
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                isCompleted && !isActive && "bg-secondary text-foreground hover:bg-secondary/80",
                !isActive && !isCompleted && "bg-secondary/50 text-muted-foreground cursor-not-allowed"
              )}
            >
              {step.icon}
              {step.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
