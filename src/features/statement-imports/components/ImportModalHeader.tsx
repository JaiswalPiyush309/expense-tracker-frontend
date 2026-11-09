"use client";

import React from "react";

interface ImportModalHeaderProps {
  onClose?: () => void;
}

export function ImportModalHeader({ onClose }: ImportModalHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:gap-4 sm:px-6 dark:border-slate-800">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          <h1
            id="statement-import-title"
            className="text-base font-bold tracking-tight text-slate-900 sm:text-lg dark:text-white"
          >
            Import Statement &amp; Transaction History
          </h1>
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            AI Parse Engine v3.1
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Import parsed bank statements or UPI transaction history (CSV, XLSX)
          directly into your verified accounts with automated duplicate
          detection and smart category mapping.
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800"
          title="Import Documentation"
        >
          ?
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:border-slate-800 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
