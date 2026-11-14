"use client";

import React from "react";

interface HoldingsFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  capFilter: string;
  onCapChange: (val: string) => void;
  assetClasses: string[];
  pnlStatusFilter: string;
  onPnlStatusChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  viewLayout: "split" | "grid";
  onViewLayoutChange: (layout: "split" | "grid") => void;
  onReset: () => void;
}

export function HoldingsFilterToolbar({
  searchQuery,
  onSearchChange,
  capFilter,
  onCapChange,
  assetClasses,
  pnlStatusFilter,
  onPnlStatusChange,
  sortBy,
  onSortChange,
  viewLayout,
  onViewLayoutChange,
  onReset,
}: HoldingsFilterToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Search Box */}
      <div className="flex min-w-45 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
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
            placeholder="Filter scrips..."
            className="w-28 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 sm:w-36 dark:text-slate-200"
          />
        </div>
        <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800">
          ESC
        </span>
      </div>

      {/* Asset class filter: the API does not currently return exchange or sector metadata. */}
      <select
        value={capFilter}
        onChange={(e) => onCapChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
      >
        <option value="ALL">Asset class: All</option>
        {assetClasses.map((assetClass) => (
          <option key={assetClass} value={assetClass}>{assetClass}</option>
        ))}
      </select>

      {/* P&L Status Filter */}
      <select
        value={pnlStatusFilter}
        onChange={(e) => onPnlStatusChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
      >
        <option value="ALL">P&amp;L: All Status</option>
        <option value="PROFIT">In Profit Only</option>
        <option value="LOSS">In Loss Only</option>
      </select>

      {/* Sort Dropdown */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300"
      >
        <option value="Current Value: High to Low">
          Sort: Current Value: High to Low
        </option>
        <option value="Invested: High to Low">
          Sort: Invested: High to Low
        </option>
        <option value="Returns %: High to Low">
          Sort: Returns %: High to Low
        </option>
      </select>

      {/* View Toggle Icons */}
      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => onViewLayoutChange("split")}
          className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
            viewLayout === "split"
              ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400"
              : "text-slate-400"
          }`}
          title="Table + Inspector Split View"
        >
          ▤
        </button>
        <button
          type="button"
          onClick={() => onViewLayoutChange("grid")}
          className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
            viewLayout === "grid"
              ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400"
              : "text-slate-400"
          }`}
          title="Full Width Table View"
        >
          ⊞
        </button>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <span>↻</span>
        <span>Reset</span>
      </button>
    </div>
  );
}
