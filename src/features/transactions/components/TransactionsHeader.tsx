"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImportStatementButton } from "@/features/statement-imports";
import Link from "next/link";

interface TransactionsHeaderProps {
  onOpenAddTransaction: () => void;
}

export function TransactionsHeader({
  onOpenAddTransaction,
}: TransactionsHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-indigo-600 dark:text-indigo-400">
            FY 2025–26
          </span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-400 dark:text-slate-500">
            ALL TRANSACTIONS LEDGER
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Transactions
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          View, track, and manage all your financial activities in one place,
          including expenses, income, transfers, investments, and repayments.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ImportStatementButton />

        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5 rounded-xl shadow-2xs"
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
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-xl text-slate-500 dark:text-slate-400"
          aria-label="More options"
        >
          ⋮
        </Button>

        <Button
          type="button"
          variant="accent"
          size="sm"
          onClick={onOpenAddTransaction}
          className="gap-1.5 px-4 py-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Transaction</span>
        </Button>
      </div>
    </div>
  );
}
