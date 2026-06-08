"use client";

import { Check } from "lucide-react";
import { FORM_STEPS } from "@/types/application";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Step counter text */}
      <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
        Step {currentStep} of {FORM_STEPS.length}
      </p>

      {/* Progress bar */}
      <div className="flex items-center justify-between gap-2">
        {FORM_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.step;
          const isCurrent = currentStep === step.step;
          const isUpcoming = currentStep < step.step;

          return (
            <div key={step.step} className="flex flex-1 items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? "border-dmrc-blue bg-dmrc-blue text-white shadow-md shadow-dmrc-blue/30"
                      : isCurrent
                      ? "border-dmrc-blue bg-dmrc-blue/10 text-dmrc-blue shadow-md shadow-dmrc-blue/20"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.step
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      isCurrent
                        ? "text-dmrc-blue"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="hidden text-[10px] text-muted-foreground sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < FORM_STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded-full transition-all duration-500 ${
                    isCompleted
                      ? "bg-dmrc-blue"
                      : isUpcoming
                      ? "bg-border"
                      : "bg-dmrc-blue/30"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
