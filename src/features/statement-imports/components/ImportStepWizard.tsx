"use client";

import React from "react";

interface ImportStepWizardProps {
  activeStep: number;
  onSelectStep?: (step: number) => void;
}

const STEPS = [
  { num: 1, label: "1. Select Type" },
  { num: 2, label: "2. Provider & Account" },
  { num: 3, label: "3. Upload Statement" },
  { num: 4, label: "4. Column Mapping" },
  { num: 5, label: "5. Review & Confirm" },
];

export function ImportStepWizard({
  activeStep,
  onSelectStep,
}: ImportStepWizardProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3 sm:px-6 dark:border-slate-800">
      {STEPS.map((step, index) => {
        const isCompleted = step.num < activeStep;
        const isCurrent = step.num === activeStep;

        return (
          <React.Fragment key={step.num}>
            <button
              type="button"
              onClick={() => onSelectStep?.(step.num)}
              className="flex items-center gap-2 text-xs font-semibold transition"
            >
              {isCompleted ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                  ✓
                </span>
              ) : (
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isCurrent
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {step.num}
                </span>
              )}
              <span
                className={
                  isCurrent
                    ? "font-bold text-indigo-600 dark:text-indigo-400"
                    : isCompleted
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-slate-400 dark:text-slate-500"
                }
              >
                {step.label}
              </span>
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={`hidden h-0.5 flex-1 sm:block ${
                  isCompleted
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
