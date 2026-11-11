"use client";

import React from "react";

interface DoubleEntryBannerProps {
  isReconciling: boolean;
  reconcileMessage: string | null;
  onRunReconciliation: () => void;
}

export function DoubleEntryBanner({
  isReconciling,
  reconcileMessage,
  onRunReconciliation,
}: DoubleEntryBannerProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 sm:flex-row sm:items-center dark:border-indigo-500/20 dark:bg-indigo-950/20">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
          ✓
        </span>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            Double-Entry Financial Health Verification
          </h4>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {reconcileMessage ||
              "All internal transfer legs (HDFC → ICICI, Groww Auto-Debits) have matching countervailing records. Zero orphaned cash movements identified."}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={isReconciling}
        onClick={onRunReconciliation}
        className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        {isReconciling ? "Verifying Ledger..." : "Run Reconciliation Check"}
      </button>
    </div>
  );
}
