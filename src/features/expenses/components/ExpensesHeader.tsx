"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImportStatementButton } from "@/features/statement-imports";

interface ExpensesHeaderProps {
  onOpenAddExpense: () => void;
}

export function ExpensesHeader({ onOpenAddExpense }: ExpensesHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Expenses
          </h1>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
            FY 2025–26
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Track, organize, and understand where your money goes across bank
          accounts, credit cards, merchant portals, and categorized tax
          envelopes.
        </p>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
        <ImportStatementButton />
        <Button
          type="button"
          onClick={onOpenAddExpense}
          variant="accent"
          size="sm"
          className="px-3.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add expense</span>
        </Button>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <svg
            className="h-3.5 w-3.5 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export</span>
          <span className="text-slate-400">▾</span>
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
          aria-label="More options"
        >
          ⋯
        </button>
      </div>
    </header>
  );
}
