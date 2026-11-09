"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AddTransactionDialog } from "@/components/transactions/add-transaction";
import { ExpenseCategoryCard } from "@/features/dashboard/components/ExpenseCategoryCard";
import { getDashboardSummary } from "@/features/dashboard/api";
import type { BudgetItem, CategoryShare, DashboardSummary } from "@/features/dashboard/types";
import { ExpensesHeader } from "./components/ExpensesHeader";

export function ExpensesView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const loadSummary = useCallback((signal?: AbortSignal) => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError(null);
    return getDashboardSummary(signal)
      .then((data) => {
        if (currentRequestId === requestId.current) setSummary(data);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        if (currentRequestId !== requestId.current) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load expense data.",
        );
      })
      .finally(() => {
        if (currentRequestId === requestId.current) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadSummary(controller.signal);
    return () => controller.abort();
  }, [loadSummary]);

  const budgets = useMemo(
    () => (summary ? toBudgets(summary) : []),
    [summary],
  );
  const categoryShares: CategoryShare[] = [];
  const total = summary?.expenses.totalAmount ?? 0;

  return (
    <main className="mx-auto w-full max-w-350 space-y-6 p-4 pb-10 sm:p-6">
      <ExpensesHeader onOpenAddExpense={() => setIsAddModalOpen(true)} />

      {isLoading && !summary ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading expenses…
        </p>
      ) : error && !summary ? (
        <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : (
        <ExpenseCategoryCard
          total={total}
          segments={categoryShares}
          budgets={budgets}
        />
      )}

      <AddTransactionDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialType="expense"
      />
    </main>
  );
}

function toBudgets(data: DashboardSummary): BudgetItem[] {
  return data.expenses.budgetLimit > 0
    ? [
        {
          id: "overall",
          label: "Overall Monthly Budget",
          spent: data.expenses.totalAmount,
          limit: data.expenses.budgetLimit,
          tone:
            data.expenses.budgetSpentPercent > 100
              ? "bad"
              : data.expenses.budgetSpentPercent > 75
                ? "accent"
                : "good",
        },
      ]
    : [];
}
