"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImportStatementButton } from "@/features/statement-imports";

interface TransactionsHeaderProps {
  onOpenAddTransaction: () => void;
}

export function TransactionsHeader({
  onOpenAddTransaction,
}: TransactionsHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">
          Unified ledger
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Transactions
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Review income and expenses in one feed, or import a bank statement and
          transaction history.
        </p>
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
        <ImportStatementButton />
        <Button
          type="button"
          onClick={onOpenAddTransaction}
          variant="accent"
          size="sm"
          className="px-3.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add transaction</span>
        </Button>
      </div>
    </header>
  );
}
