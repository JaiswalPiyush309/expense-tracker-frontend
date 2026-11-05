"use client";

import React from "react";

interface PaymentMethodSelectorProps {
  merchant: string;
  isAutoTagged: boolean;
  onChange: (merchant: string) => void;
}

export function PaymentMethodSelector({
  merchant,
  isAutoTagged,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Merchant / Recipient
        </label>
        {isAutoTagged && (
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Auto-tagged
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-3 dark:border-slate-800 dark:bg-slate-900/60">
        <svg
          className="h-4 w-4 shrink-0 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <input
          type="text"
          value={merchant}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Merchant or Recipient legal name"
          className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none dark:text-slate-200"
        />
      </div>
    </div>
  );
}
