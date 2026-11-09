"use client";

import React from "react";
import { ImportFilterTab } from "../types";

interface ImportFilterToolbarProps {
  activeTab: ImportFilterTab;
  onTabChange: (tab: ImportFilterTab) => void;
  counts: {
    total: number;
    valid: number;
    duplicates: number;
    needsReview: number;
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  channelFilter: string;
  onChannelFilterChange: (val: string) => void;
  onSelectAllValid: () => void;
  onExcludeDuplicates: () => void;
}

export function ImportFilterToolbar({
  activeTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  channelFilter,
  onChannelFilterChange,
  onSelectAllValid,
  onExcludeDuplicates,
}: ImportFilterToolbarProps) {
  return (
    <div className="space-y-2.5">
      {/* Row 1: Filter Tabs & Bulk Action Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <span>All Transactions</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("valid")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "valid"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <span>Valid Only</span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              {counts.valid}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("duplicates")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "duplicates"
                ? "bg-rose-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
            <span>Flagged Duplicates</span>
            <span className="rounded-full bg-rose-100 px-1.5 py-0.2 text-[10px] font-bold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
              {counts.duplicates}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("needs-review")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "needs-review"
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <span>Needs Review</span>
            <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {counts.needsReview}
            </span>
          </button>
        </div>

        {/* Right Quick Actions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onSelectAllValid}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <span className="text-indigo-600">✓</span>
            <span>Select All Valid</span>
          </button>

          <button
            type="button"
            onClick={onExcludeDuplicates}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/60 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100/70 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300"
          >
            <span>✕</span>
            <span>Exclude Duplicates</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300"
          >
            <span>✨</span>
            <span>Auto-Tag 80C Tax</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search & Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
          <svg
            className="h-3.5 w-3.5 text-slate-400"
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
            placeholder="Filter by narration, payee, UTR, or reference number..."
            className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="ALL">Type: All Transactions</option>
          <option value="CREDIT">Credits Only (Inflow)</option>
          <option value="DEBIT">Debits Only (Outflow)</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="ALL">Envelope: All Categories</option>
          <option value="Salary & Compensation">Salary & Compensation</option>
          <option value="Rent & Accommodation">Rent & Accommodation</option>
          <option value="Food & Dining">Food & Dining</option>
          <option value="Investments (SIP)">Investments (SIP)</option>
          <option value="Vehicle & Fuel">Vehicle & Fuel</option>
          <option value="Bills & Utilities">Bills & Utilities</option>
        </select>

        <select
          value={channelFilter}
          onChange={(e) => onChannelFilterChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="ALL">Channel: All (UPI, NEFT, IMPS)</option>
          <option value="NEFT">NEFT</option>
          <option value="UPI">UPI</option>
          <option value="IMPS">IMPS</option>
          <option value="NACH">NACH / Auto-Debit</option>
          <option value="POS">Debit Card POS</option>
          <option value="BBPS">BBPS Utility</option>
        </select>
      </div>
    </div>
  );
}
