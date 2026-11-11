"use client";

import React from "react";
const EXPENSES_DATE_PRESETS = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "last-3-months", label: "Last 3 Months" },
  { id: "this-year", label: "This Year" },
];

interface ExpensesFilterToolbarProps {
  datePreset: string;
  onDatePresetChange: (preset: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  paymentFilter: string;
  onPaymentChange: (pay: string) => void;
  accountFilter: string;
  onAccountChange: (acc: string) => void;
  statusFilterActive: boolean;
  onToggleStatusFilter: () => void;
  onReset: () => void;
  totalAmount: number;
  totalCount: number;
  categoryOptions: string[];
  paymentOptions: string[];
  accountOptions: string[];
}

export function ExpensesFilterToolbar({
  datePreset,
  onDatePresetChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  paymentFilter,
  onPaymentChange,
  accountFilter,
  onAccountChange,
  statusFilterActive,
  onToggleStatusFilter,
  onReset,
  totalAmount,
  totalCount,
  categoryOptions,
  paymentOptions,
  accountOptions,
}: ExpensesFilterToolbarProps) {
  const formattedTotal = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(totalAmount);
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Row 1: Date Range Presets */}
      <div className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/70">
        {EXPENSES_DATE_PRESETS.map((preset) => {
          const active = datePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onDatePresetChange(preset.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {preset.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onDatePresetChange("custom")}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <svg
            className="h-3.5 w-3.5 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Custom Range</span>
        </button>
      </div>

      {/* Row 2: Total Filtered Pill */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200/70 bg-slate-50/90 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-800/60">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="font-medium text-slate-600 dark:text-slate-300">
            Total Filtered:
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {formattedTotal}
          </span>
          <span className="text-slate-400 dark:text-slate-500">
            across {totalCount} txns
          </span>
        </div>
      </div>

      {/* Row 3: Search & Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-57.5 flex-1 items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          <svg
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search expenses by description, merchant..."
            className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
        >
          <option value="All">Category: All</option>
          {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>

        {/* Payment Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => onPaymentChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
        >
          <option value="All">Payment: All</option>
          {paymentOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>

        {/* Account Filter */}
        <select
          value={accountFilter}
          onChange={(e) => onAccountChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
        >
          <option value="All">Account: All</option>
          {accountOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>

        {/* Status Paid Pill */}
        {statusFilterActive && (
          <button
            type="button"
            onClick={onToggleStatusFilter}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-100/90 px-3 py-2 text-xs font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300"
          >
            <span>✓</span>
            <span>Status: Paid ({totalCount})</span>
            <span className="ml-1 text-emerald-700 dark:text-emerald-300">
              ✕
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="px-2 py-1.5 text-xs font-medium text-slate-500 underline hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
