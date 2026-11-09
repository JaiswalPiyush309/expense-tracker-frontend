"use client";

import React from "react";

interface ImportModalFooterProps {
  selectedCount: number;
  totalCount: number;
  netImpact: number;
  isCommitting: boolean;
  onCancel?: () => void;
  onReupload: () => void;
  onCommit: () => void;
}

export function ImportModalFooter({
  selectedCount,
  totalCount,
  netImpact,
  isCommitting,
  onCancel,
  onReupload,
  onCommit,
}: ImportModalFooterProps) {
  const isPositive = netImpact >= 0;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200/80 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
      {/* Left Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Cancel Import
        </button>

        <button
          type="button"
          onClick={onReupload}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <span>↻</span>
          <span>Re-upload File</span>
        </button>
      </div>

      {/* Center Status Pill */}
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50 px-3.5 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {selectedCount} of {totalCount} transactions selected
        </span>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          Net Impact:{" "}
          <span
            className={
              isPositive
                ? "font-bold text-emerald-600 dark:text-emerald-400"
                : "font-bold text-rose-600 dark:text-rose-400"
            }
          >
            {isPositive ? "+" : "-"}₹
            {Math.abs(netImpact).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </span>
        </span>
      </div>

      {/* Right CTA Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Save as Draft
        </button>

        <button
          type="button"
          disabled={selectedCount === 0 || isCommitting}
          onClick={onCommit}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>
            {isCommitting
              ? "Committing Batch..."
              : `Import ${selectedCount} Transactions →`}
          </span>
        </button>
      </div>
    </div>
  );
}
