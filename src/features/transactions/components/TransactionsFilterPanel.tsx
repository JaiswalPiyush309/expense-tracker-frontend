"use client";

import React from "react";

interface TransactionsFilterPanelProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
  accountFilter: string;
  onAccountChange: (val: string) => void;
  railFilter: string;
  onRailChange: (val: string) => void;
  activeChips: string[];
  onRemoveChip: (chip: string) => void;
  onClearAll: () => void;
  categoryOptions: string[];
  accountOptions: string[];
  railOptions: string[];
}

export function TransactionsFilterPanel({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  typeFilter,
  onTypeChange,
  accountFilter,
  onAccountChange,
  railFilter,
  onRailChange,
  activeChips,
  onRemoveChip,
  onClearAll,
  categoryOptions,
  accountOptions,
  railOptions,
}: TransactionsFilterPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Row 1: Search & Select Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[240px] flex-1 items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex flex-1 items-center gap-2">
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
              placeholder="Search transactions, merchants, counterparties..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
          </div>
          <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
            ⌘K
          </span>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
        >
          <option value="All">Category: All Categories</option>
          {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
        >
          <option value="All">Type: All Types</option>
          {['Income', 'Expense', 'Transfer'].map((option) => <option key={option} value={option}>{option}</option>)}
        </select>

        <select
          value={accountFilter}
          onChange={(e) => onAccountChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
        >
          <option value="All">Account: All Accounts</option>
          {accountOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>

        <select
          value={railFilter}
          onChange={(e) => onRailChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
        >
          <option value="All">Payment Rail: All Rails</option>
          {railOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      {/* Row 2: Active Chips & Advanced Filters */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ACTIVE:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => onRemoveChip(chip)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </span>
          ))}

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100/70 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300"
          >
            <span>⚙</span>
            <span>Advanced Filters (3)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
