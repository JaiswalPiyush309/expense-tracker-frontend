"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getCategoryOptions } from "../categories-api";

type CategoryMetrics = {
  total: number;
  expenses: number;
  income: number;
  custom: number;
};

const EMPTY_METRICS: CategoryMetrics = {
  total: 0,
  expenses: 0,
  income: 0,
  custom: 0,
};

const metricConfig = [
  {
    key: "total",
    label: "Total categories",
    detail: "Available to your account",
    Icon: Boxes,
  },
  {
    key: "expenses",
    label: "Expense categories",
    detail: "For outgoing transactions",
    Icon: TrendingDown,
  },
  {
    key: "income",
    label: "Income categories",
    detail: "For incoming transactions",
    Icon: TrendingUp,
  },
  {
    key: "custom",
    label: "Custom categories",
    detail: "Created by you",
    Icon: UserRound,
  },
] as const;

export function CategoriesKpiGrid() {
  const [metrics, setMetrics] = useState<CategoryMetrics>(EMPTY_METRICS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    Promise.all([
      getCategoryOptions("EXPENSE"),
      getCategoryOptions("INCOME"),
    ])
      .then(([expenses, income]) => {
        if (!active) return;
        const allCategories = [...expenses, ...income];
        setMetrics({
          total: allCategories.length,
          expenses: expenses.length,
          income: income.length,
          custom: allCategories.filter((category) => category.isCustom).length,
        });
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load category totals.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    const refresh = () => setRetry((attempt) => attempt + 1);
    window.addEventListener("categories:changed", refresh);

    return () => {
      active = false;
      window.removeEventListener("categories:changed", refresh);
    };
  }, [retry]);

  if (error) {
    return (
      <section
        role="alert"
        className="flex flex-col gap-3 rounded-card border border-bad/20 bg-bad/5 p-4 text-sm text-ink sm:flex-row sm:items-center sm:justify-between"
      >
        <p>{error}</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setRetry((attempt) => attempt + 1)}
        >
          <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
          Try again
        </Button>
      </section>
    );
  }

  return (
    <section
      aria-label="Category totals"
      aria-busy={isLoading}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metricConfig.map(({ key, label, detail, Icon }) => (
        <Card key={key} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-muted">{label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
                {isLoading ? (
                  <span
                    aria-label="Loading"
                    className="inline-block h-7 w-10 animate-pulse rounded bg-surface-muted"
                  />
                ) : (
                  metrics[key]
                )}
              </p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon aria-hidden="true" className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 border-t border-line pt-2.5 text-xs text-muted">
            {detail}
          </p>
        </Card>
      ))}
    </section>
  );
}
