"use client";

import { Check, LayoutTemplate, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (templateName: string) => void;
}

export function TemplatesModal({
  isOpen,
  onClose,
  onApplyTemplate,
}: TemplatesModalProps) {
  if (!isOpen) return null;

  const templates = [
    {
      id: "50-30-20",
      title: "50 / 30 / 20 Balanced Rule",
      subtitle: "Senator Elizabeth Warren's classic framework",
      description:
        "Allocates 50% to essential Needs (Housing, Groceries, Utilities), 30% to Wants (Dining, Shopping), and 20% to Savings & Investments.",
      recommended: true,
    },
    {
      id: "zero-based",
      title: "Zero-Based Cash Envelope System",
      subtitle: "Dave Ramsey style rigorous allocation",
      description:
        "Every rupee is given a dedicated category job before the month starts until income minus allocations equals exactly zero.",
      recommended: false,
    },
    {
      id: "frugal-fire",
      title: "FIRE Aggressive Wealth Accumulator (70/20/10)",
      subtitle: "High savings rate for early retirement",
      description:
        "Compresses living expenses to 20% Needs and 10% Wants, channeling an aggressive 70% toward SIPs, index funds, and equity portfolios.",
      recommended: false,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="templates-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <LayoutTemplate className="h-5 w-5" />
            </span>
            <div>
              <h2 id="templates-title" className="text-base font-bold text-ink">
                Budget Templates
              </h2>
              <p className="text-xs text-muted">
                Pre-configured financial blueprints &amp; envelope systems
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-ink"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`rounded-2xl border p-4 transition-all hover:border-accent ${
                tpl.recommended
                  ? "border-accent/40 bg-accent-soft/10 dark:bg-accent-soft/5"
                  : "border-line bg-surface"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">{tpl.title}</h3>
                    {tpl.recommended && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                        <Sparkles className="h-3 w-3" />
                        Active Profile
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-muted">
                    {tpl.subtitle}
                  </p>
                </div>

                <Button
                  type="button"
                  variant={tpl.recommended ? "accent" : "secondary"}
                  size="sm"
                  onClick={() => {
                    onApplyTemplate(tpl.title);
                    onClose();
                  }}
                  className="shrink-0 text-xs"
                >
                  Apply
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted leading-relaxed">
                {tpl.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
