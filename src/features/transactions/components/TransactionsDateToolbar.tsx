"use client";

import { Button } from "@/components/ui/Button";
const TRANSACTIONS_DATE_PRESETS = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
  { id: "last-3-months", label: "Last 3 Months" },
  { id: "this-year", label: "This Year" },
];

interface TransactionsDateToolbarProps {
  datePreset: string;
  onDatePresetChange: (id: string) => void;
  onResetRange: () => void;
  filteredCount: number;
  filteredVolume: number;
}

export function TransactionsDateToolbar({
  datePreset,
  onDatePresetChange,
  onResetRange,
  filteredCount,
  filteredVolume,
}: TransactionsDateToolbarProps) {
  const formattedVolume = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(filteredVolume);
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Row 1: Date Range Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {TRANSACTIONS_DATE_PRESETS.map((preset) => {
            const active = datePreset === preset.id;
            return (
              <Button
                key={preset.id}
                type="button"
                variant={active ? "accent" : "ghost"}
                size="sm"
                onClick={() => onDatePresetChange(preset.id)}
                className={`gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  active ? "shadow-2xs" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}

                <span>{preset.label}</span>
              </Button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5 rounded-lg border-slate-200 bg-slate-50/70 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
        >
          <span>📅</span>
          <span>Custom</span>
        </Button>
      </div>

      {/* Row 2: Filtered Volume Pill & Double-Entry Compliance Note */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/90 px-3 py-1 text-[11px] font-semibold text-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            <span>
              Filtered Volume: <strong>{formattedVolume}</strong> across {filteredCount}
              transactions
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">✓</span>
            <span>
              Double-entry compliance active: Internal transfers &amp; lending
              excluded from P&amp;L
            </span>
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetRange}
          className="min-h-0 rounded-none px-0 py-0 text-[11px] font-semibold text-indigo-600 hover:bg-transparent hover:underline dark:text-indigo-400"
        >
          Reset Range
        </Button>
      </div>
    </div>
  );
}
