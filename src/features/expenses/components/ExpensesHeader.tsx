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
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-300">
          Expense ledger
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Expenses
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Review outflows by category, stay on budget, and import bank or UPI
          history in bulk.
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
      </div>
    </header>
  );
}
