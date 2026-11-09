"use client";

import React from "react";
import { StagedBatchResponse } from "../types";

interface ImportSourceSummaryBarProps {
  batch: StagedBatchResponse;
}

export function ImportSourceSummaryBar({ batch }: ImportSourceSummaryBarProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Source Entity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              SOURCE ENTITY
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {batch.sourceEntity}
            </div>
          </div>
        </div>

        {/* Destination Account */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              DESTINATION ACCOUNT
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {batch.destinationAccountName}{" "}
              <span className="font-normal text-slate-500">
                (Bal: ₹{batch.destinationBalance.toLocaleString("en-IN")}.00)
              </span>
            </div>
          </div>
        </div>

        {/* Statement Source */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="truncate">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              STATEMENT SOURCE
            </div>
            <div className="flex items-center gap-2 truncate text-xs font-bold text-slate-900 dark:text-white">
              <span className="truncate">{batch.fileName}</span>
              <span className="shrink-0 rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {batch.fileSizeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Columns Auto-Mapped Pill */}
      <div className="mt-3 border-t border-slate-200/60 pt-2.5 dark:border-slate-800">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <span className="text-emerald-600 dark:text-emerald-400">✓</span>
          <span>
            {batch.mappedColumnsCount}/{batch.totalColumnsCount} Columns
            Auto-Mapped
          </span>
          <span className="text-slate-400">▾</span>
        </span>
      </div>
    </div>
  );
}
