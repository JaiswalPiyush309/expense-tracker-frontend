"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  RefreshCw,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  fetchAllTransactions,
  type ApiTransaction,
} from "@/features/transactions/transactions-api";

interface CategoryMetric {
  id: string;
  name: string;
  amount: number;
  count: number;
  share: number;
}

interface AnalyticsData {
  monthLabel: string;
  totalExpenses: number;
  totalIncome: number;
  totalExpenseCount: number;
  topExpenses: CategoryMetric[];
  frequentExpenses: CategoryMetric[];
  incomeCategories: CategoryMetric[];
  incomeGradient: string;
}

const CHART_COLORS = [
  "#4f46e5",
  "#059669",
  "#e11d48",
  "#d97706",
  "#0284c7",
  "#7c3aed",
  "#0f766e",
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function summarizeByCategory(
  transactions: ApiTransaction[],
): CategoryMetric[] {
  const totals = new Map<string, Omit<CategoryMetric, "share">>();

  for (const transaction of transactions) {
    const id = transaction.categoryId ?? "uncategorized";
    const current = totals.get(id) ?? {
      id,
      name: transaction.category?.name ?? "Uncategorized",
      amount: 0,
      count: 0,
    };
    current.amount += Number(transaction.amount) || 0;
    current.count += 1;
    totals.set(id, current);
  }

  const totalAmount = [...totals.values()].reduce(
    (total, category) => total + category.amount,
    0,
  );

  return [...totals.values()]
    .map((category) => ({
      ...category,
      share: totalAmount ? (category.amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function createIncomeGradient(categories: CategoryMetric[]): string {
  if (categories.length === 0) return "conic-gradient(#e2e8f0 0% 100%)";

  const segments = categories.slice(0, 4).map((category) => category.share);
  const otherShare = categories
    .slice(4)
    .reduce((sum, category) => sum + category.share, 0);
  if (otherShare > 0) segments.push(otherShare);

  let position = 0;
  const stops = segments.map((share, index) => {
    const start = position;
    position = index === segments.length - 1 ? 100 : position + share;
    const color =
      index === 4 ? "#94a3b8" : CHART_COLORS[index % CHART_COLORS.length];
    return `${color} ${start}% ${position}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

function buildAnalytics(
  expenses: ApiTransaction[],
  income: ApiTransaction[],
  now: Date,
): AnalyticsData {
  const expenseCategories = summarizeByCategory(expenses);
  const incomeCategories = summarizeByCategory(income);
  const totalExpenses = expenses.reduce(
    (sum, transaction) => sum + (Number(transaction.amount) || 0),
    0,
  );
  const totalIncome = income.reduce(
    (sum, transaction) => sum + (Number(transaction.amount) || 0),
    0,
  );

  return {
    monthLabel: new Intl.DateTimeFormat("en-IN", {
      month: "long",
      year: "numeric",
    }).format(now),
    totalExpenses,
    totalIncome,
    totalExpenseCount: expenses.length,
    topExpenses: expenseCategories.slice(0, 4),
    frequentExpenses: [...expenseCategories]
      .sort((a, b) => b.count - a.count || b.amount - a.amount)
      .slice(0, 3),
    incomeCategories,
    incomeGradient: createIncomeGradient(incomeCategories),
  };
}

function pluralize(count: number, singular: string): string {
  return `${numberFormatter.format(count)} ${singular}${count === 1 ? "" : "s"}`;
}

export function CategoriesAnalyticsRow() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    const now = new Date();
    const startDate = formatDateOnly(
      new Date(now.getFullYear(), now.getMonth(), 1),
    );
    const endDate = formatDateOnly(
      new Date(now.getFullYear(), now.getMonth() + 1, 0),
    );

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [expenses, income] = await Promise.all([
          fetchAllTransactions({ type: "EXPENSE", startDate, endDate }),
          fetchAllTransactions({ type: "INCOME", startDate, endDate }),
        ]);
        if (active) setData(buildAnalytics(expenses, income, now));
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Unable to load category analytics.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    const refresh = () => void load();
    refresh();
    window.addEventListener("transactions:created", refresh);

    return () => {
      active = false;
      window.removeEventListener("transactions:created", refresh);
    };
  }, [retry]);

  if (error) {
    return (
      <Callout
        icon={<AlertCircle className="h-4 w-4" />}
        className="justify-between"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
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
        </div>
      </Callout>
    );
  }

  if (isLoading || !data) {
    return (
      <div
        aria-label="Loading category analytics"
        aria-busy="true"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} className="h-64 animate-pulse p-5">
            <div className="h-4 w-40 rounded bg-surface-muted" />
            <div className="mt-6 space-y-4">
              <div className="h-3 rounded bg-surface-muted" />
              <div className="h-3 rounded bg-surface-muted" />
              <div className="h-3 rounded bg-surface-muted" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const incomeTotalShare = data.incomeCategories[0]?.share ?? 0;
  const visibleIncomeCategories = data.incomeCategories.slice(0, 4);
  const otherIncomeShare = data.incomeCategories
    .slice(4)
    .reduce((sum, category) => sum + category.share, 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="p-5">
        <CardHeader
          title="Top spending categories"
          description="Expense totals for this month"
          icon={<TrendingDown className="h-4 w-4" />}
          actions={<Badge tone="neutral">{data.monthLabel}</Badge>}
        />
        {data.topExpenses.length > 0 ? (
          <div className="mt-5 space-y-4">
            {data.topExpenses.map((category) => (
              <div key={category.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className="truncate font-semibold text-ink">
                    {category.name}
                  </span>
                  <span className="shrink-0 font-semibold text-ink">
                    {currencyFormatter.format(category.amount)}
                    <span className="ml-1.5 font-normal text-muted">
                      {category.share.toFixed(1)}%
                    </span>
                  </span>
                </div>
                <ProgressBar
                  value={category.share}
                  tone="accent"
                  label={`${category.name}: ${category.share.toFixed(1)}% of expenses`}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">
            No expenses recorded this month.
          </p>
        )}
        <p className="mt-5 border-t border-line pt-3 text-xs text-muted">
          Total expenses: {currencyFormatter.format(data.totalExpenses)}
        </p>
      </Card>

      <Card className="p-5">
        <CardHeader
          title="Transaction frequency"
          description="Most active expense categories"
          icon={<Activity className="h-4 w-4" />}
          actions={
            <Badge tone="neutral">
              {pluralize(data.totalExpenseCount, "transaction")}
            </Badge>
          }
        />
        {data.frequentExpenses.length > 0 ? (
          <div className="mt-5 space-y-2.5">
            {data.frequentExpenses.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-muted/40 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted">
                      {currencyFormatter.format(category.amount)} spent
                    </p>
                  </div>
                </div>
                <Badge tone="accent">{pluralize(category.count, "txn")}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">
            No expense transactions recorded this month.
          </p>
        )}
      </Card>

      <Card className="p-5">
        <CardHeader
          title="Income by category"
          description="Share of income received this month"
          icon={<Wallet className="h-4 w-4" />}
          actions={
            <Badge tone="good">
              {currencyFormatter.format(data.totalIncome)}
            </Badge>
          }
        />

        <div className="mt-5 flex items-center gap-5">
          <div
            role="img"
            aria-label={`Income distribution. Largest category is ${incomeTotalShare.toFixed(1)} percent.`}
            className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full"
            style={{ background: data.incomeGradient }}
          >
            <div className="grid h-[4.25rem] w-[4.25rem] place-items-center rounded-full bg-surface text-center">
              <span className="text-xs font-bold text-ink">
                {incomeTotalShare.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-2.5">
            {visibleIncomeCategories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="inline-flex min-w-0 items-center gap-2 text-muted">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                  <span className="truncate">{category.name}</span>
                </span>
                <span className="shrink-0 font-semibold text-ink">
                  {category.share.toFixed(1)}%
                </span>
              </div>
            ))}
            {otherIncomeShare > 0 && (
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-2 text-muted">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-surface-muted"
                  />
                  Other categories
                </span>
                <span className="font-semibold text-ink">
                  {otherIncomeShare.toFixed(1)}%
                </span>
              </div>
            )}
            {data.incomeCategories.length === 0 && (
              <p className="text-xs text-muted">No income recorded this month.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
