"use client";

import { Button } from "@/components/ui/Button";
import { INCOME_DATE_PRESETS } from "../data/mock";
import { cn } from "@/lib/cn";
import { CalendarDays, Search } from "lucide-react";

interface IncomeFilterToolbarProps {
  datePreset: string;
  onDatePresetChange: (preset: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  modeFilter: string;
  onModeChange: (mode: string) => void;
  accountFilter: string;
  onAccountChange: (acc: string) => void;
  statusFilter: string;
  onStatusToggle: () => void;
  onReset: () => void;
}

export function IncomeFilterToolbar({
  datePreset,
  onDatePresetChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  modeFilter,
  onModeChange,
  accountFilter,
  onAccountChange,
  statusFilter,
  onStatusToggle,
  onReset,
}: IncomeFilterToolbarProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Date Range Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        {INCOME_DATE_PRESETS.map((preset) => {
          const active = datePreset === preset.id;
          return (
            <Button
              key={preset.id}
              type="button"
              variant={active ? "accent" : "secondary"}
              size="sm"
              onClick={() => onDatePresetChange(preset.id)}
              className={cn(
                "h-auto min-h-0 rounded-full px-3 py-1.5 text-xs font-medium shadow-none",
                active
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
              )}
            >
              {" "}
              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              <span>{preset.label}</span>
            </Button>
          );
        })}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onDatePresetChange("custom")}
          className="h-auto min-h-0 rounded-full px-3 py-1.5 text-xs font-medium"
        >
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
          <span>Custom Range</span>
        </Button>
      </div>

      {/* Row 2: Search & Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex min-w-55 flex-1 items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/60">
          <Search />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search income by source, payer, or ref..."
            className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="All">Category: All</option>
          <option value="Salary & Compensation">Salary & Compensation</option>
          <option value="Consulting & Advisory">Consulting & Advisory</option>
          <option value="Equity Dividends">Equity Dividends</option>
          <option value="Freelance & Contract">Freelance & Contract</option>
          <option value="Cashback & Rewards">Cashback & Rewards</option>
        </select>

        {/* Mode Filter */}
        <select
          value={modeFilter}
          onChange={(e) => onModeChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="All">Mode: All</option>
          <option value="NEFT">Mode: NEFT</option>
          <option value="UPI">Mode: UPI</option>
          <option value="ECS">Mode: ECS</option>
          <option value="SWIFT">Mode: SWIFT</option>
        </select>

        {/* Account Filter */}
        <select
          value={accountFilter}
          onChange={(e) => onAccountChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="All">Account: All</option>
          <option value="HDFC">HDFC ••4821</option>
          <option value="ICICI">ICICI ••8829</option>
        </select>

        {/* Status Pill */}
        <Button
          type="button"
          variant="soft"
          size="sm"
          onClick={onStatusToggle}
          className="h-auto min-h-0 rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:brightness-95 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Status: {statusFilter} (Active)</span>
        </Button>

        {/* Reset */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-auto min-h-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <span>↻</span>
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
}
