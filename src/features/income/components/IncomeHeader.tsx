"use client";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IncomeHeaderProps {
  onOpenAddIncome: () => void;
  onExportCsv?: () => void;
}

export function IncomeHeader({
  onOpenAddIncome,
  onExportCsv,
}: IncomeHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
          Income ledger
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Income
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Track received payments, expected inflows, and where your income comes
          from.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {onExportCsv && (
          <Button
            type="button"
            onClick={onExportCsv}
            variant="secondary"
            size="sm"
            className="px-3"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
        )}
        <Button
          type="button"
          onClick={onOpenAddIncome}
          variant="accent"
          size="sm"
          className="px-3.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add income</span>
        </Button>
      </div>
    </header>
  );
}
