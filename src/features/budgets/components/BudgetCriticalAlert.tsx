"use client";

import { BellRing, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BudgetCriticalAlertProps {
  isDismissed: boolean;
  onDismiss: () => void;
  onOpenReallocate: () => void;
}

export function BudgetCriticalAlert({
  isDismissed,
  onDismiss,
  onOpenReallocate,
}: BudgetCriticalAlertProps) {
  if (isDismissed) return null;

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs dark:border-rose-900/40 dark:bg-rose-950/20 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300">
          <BellRing className="h-4 w-4" />
        </span>
        <div className="space-y-0.5">
          <p className="font-semibold text-rose-950 dark:text-rose-100">
            <span className="rounded bg-rose-200/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-800 dark:text-rose-200">
              CRITICAL
            </span>{" "}
            <strong>Dining &amp; Social exceeded limit by ₹1,200</strong>{" "}
            <span className="text-muted">·</span> Shopping is at 84% burn
          </p>
          <p className="text-[11px] text-rose-800/90 dark:text-rose-300/80">
            Surplus in Healthcare (₹3,000 left) and Utilities (₹3,000 left) can
            absorb this deficit without expanding the master cap.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onOpenReallocate}
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
        >
          Reallocate Envelopes
        </Button>

        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-900/50"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
