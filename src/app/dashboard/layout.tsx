"use client";

import { ExpenseCategoryCard } from "@/features/dashboard/components/ExpenseCategoryCard";
import { LendingLedgerCard } from "@/features/dashboard/components/LendingLedgerCard";
import { MarketsCard } from "@/features/dashboard/components/MarketsCard";
import { Navbar } from "@/features/dashboard/components/Navbar/Navbar";
import Sidebar from "@/features/dashboard/components/Sidebar/Sidebar";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { TransactionsTable } from "@/features/dashboard/components/TransactionsTable";
import { TrendChartCard } from "@/features/dashboard/components/TrendChartCard";
import { WelcomeCard } from "@/features/dashboard/components/WelcomeCard";
import { getDashboardSummary } from "@/features/dashboard/api";
import type {
  BudgetItem,
  CategoryShare,
  DashboardSummary,
  LedgerEntry,
  MarketIndex,
  StatCardData,
  Holding,
  Transaction,
  TrendPoint,
} from "@/features/dashboard/types";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  ChartCandlestick,
  CircleCheck,
  Clock,
  Landmark,
  PiggyBank,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { user: authUser } = useAuthUser();
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
        if (reason instanceof DOMException && reason.name === "AbortError")
          return;
        if (currentRequestId !== requestId.current) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load dashboard data.",
        );
      })
      .finally(() => {
        if (currentRequestId === requestId.current) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void loadSummary(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadSummary]);

  const stats = useMemo(() => (summary ? toStats(summary) : []), [summary]);
  const budgets = useMemo(() => (summary ? toBudgets(summary) : []), [summary]);
  const ledger = useMemo(
    () => (summary ? toLedger(summary) : emptyLedger),
    [summary],
  );
  const markets = useMemo(
    () => (summary ? toMarkets(summary) : emptyMarkets),
    [summary],
  );
  const trendData = emptyTrendData;
  const trendMeta = summary ? toTrendMeta(summary) : emptyTrendMeta;
  const categoryShares: CategoryShare[] = [];
  const transactions: Transaction[] = [];

  const expenses = summary?.expenses.totalAmount ?? 0;

  if (isLoading && !summary) {
    return (
      <DashboardShell
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      >
        <DashboardStatus>Loading dashboard…</DashboardStatus>
      </DashboardShell>
    );
  }

  if (error && !summary) {
    return (
      <DashboardShell
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      >
        <DashboardStatus error={error} onRetry={() => void loadSummary()}>
          Unable to load dashboard
        </DashboardStatus>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      mobileOpen={mobileOpen}
      onMobileClose={() => setMobileOpen(false)}
    >
      <main className="mx-auto w-full max-w-350 space-y-6 p-4 sm:p-6">
        <WelcomeCard
          name={authUser?.name ?? "there"}
          netWorth={summary?.netWorthBanner.totalNetWorth ?? 0}
          netWorthChange={formatYoY(
            summary?.netWorthBanner.yoyChangePercent ?? 0,
          )}
          periodLabel={summary?.period.monthLabel ?? ""}
        />
        <StatsGrid stats={stats} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <TrendChartCard data={trendData} {...trendMeta} />
          <ExpenseCategoryCard
            total={expenses}
            segments={categoryShares}
            budgets={budgets}
          />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <LendingLedgerCard {...ledger} />
          <MarketsCard {...markets} />
        </div>

        <TransactionsTable
          transactions={transactions}
          total={transactions.length}
          pageSize={transactions.length || 1}
          page={page}
          onPageChange={setPage}
        />
        {children}
      </main>
    </DashboardShell>
  );
}

function DashboardShell({
  children,
  mobileOpen,
  onMobileClose,
}: {
  children: ReactNode;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={onMobileClose} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

function DashboardStatus({
  children,
  error,
  onRetry,
}: {
  children: ReactNode;
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-350 flex-1 items-center justify-center p-6">
      <div
        role={error ? "alert" : "status"}
        className="rounded-2xl border border-line bg-white p-8 text-center shadow-sm"
      >
        <p className="font-semibold text-ink">{children}</p>
        {error && <p className="mt-2 max-w-md text-sm text-muted">{error}</p>}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        )}
      </div>
    </main>
  );
}

const signedPercent = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
const formatYoY = (value: number) => `${signedPercent(value)} YoY`;
const deltaTone = (value: number): "good" | "bad" | "neutral" =>
  value > 0 ? "good" : value < 0 ? "bad" : "neutral";

function toStats(data: DashboardSummary): StatCardData[] {
  return [
    {
      id: "liquid",
      label: "Total Liquid Balance",
      icon: Landmark,
      iconTone: "accent",
      value: data.liquidBalance.totalAmount,
      delta: {
        text: `${signedPercent(data.liquidBalance.momChangePercent)} MoM`,
        icon:
          data.liquidBalance.momChangePercent >= 0 ? TrendingUp : TrendingDown,
        tone: deltaTone(data.liquidBalance.momChangePercent),
      },
      note: `${data.liquidBalance.linkedAccountsCount} Accounts linked`,
      footerLeft: data.liquidBalance.accountNames.join(", "),
      footerRight: data.liquidBalance.isReconciled
        ? { text: "Reconciled", tone: "accent" }
        : undefined,
    },
    {
      id: "income",
      label: `Income (${data.period.shortMonthLabel})`,
      icon: ArrowDown,
      iconTone: "good",
      value: data.income.totalAmount,
      delta: {
        text: `${signedPercent(data.income.momChangePercent)} vs Last Mo`,
        icon: data.income.momChangePercent >= 0 ? TrendingUp : TrendingDown,
        tone: deltaTone(data.income.momChangePercent),
      },
      footerLeft: data.income.topSources
        .map(
          (source) => `${source.categoryName}: ${formatCompact(source.amount)}`,
        )
        .join(" | "),
    },
    {
      id: "expenses",
      label: `Expenses (${data.period.shortMonthLabel})`,
      icon: ArrowUp,
      iconTone: "bad",
      value: data.expenses.totalAmount,
      delta: {
        text: `${signedPercent(data.expenses.momChangePercent)} MoM (${data.expenses.statusLabel})`,
        icon: data.expenses.momChangePercent <= 0 ? TrendingDown : TrendingUp,
        tone: data.expenses.momChangePercent <= 0 ? "good" : "bad",
      },
      footerLeft:
        data.expenses.budgetLimit > 0
          ? `${data.expenses.budgetSpentPercent.toFixed(1)}% of ${formatCompact(data.expenses.budgetLimit)} Budget Spent`
          : "No budget set",
    },
    {
      id: "net-cash-flow",
      label: "Net Cash Flow",
      icon: PiggyBank,
      iconTone: "accent",
      value: Math.abs(data.netCashFlow.netAmount),
      prefix: data.netCashFlow.netAmount >= 0 ? "+" : "-",
      valueTone: data.netCashFlow.netAmount >= 0 ? "good" : "bad",
      delta: {
        text: `${data.netCashFlow.savingsRatePercent.toFixed(1)}% Savings Rate`,
        tone: data.netCashFlow.isTargetHit ? "good" : "neutral",
      },
      note: data.netCashFlow.isTargetHit ? "Target hit" : "Below target",
      progress: Math.max(0, Math.min(100, data.netCashFlow.savingsRatePercent)),
      footerLeft: "",
    },
    {
      id: "equities",
      label: "Equities & MFs",
      icon: ChartCandlestick,
      iconTone: "accent",
      value: data.equitiesAndMfs.currentValue,
      delta: {
        text: `${data.equitiesAndMfs.totalPnL >= 0 ? "+" : ""}${formatCompact(data.equitiesAndMfs.totalPnL)} (${signedPercent(data.equitiesAndMfs.pnlPercent)} P&L)`,
        icon: data.equitiesAndMfs.totalPnL >= 0 ? TrendingUp : TrendingDown,
        tone: data.equitiesAndMfs.totalPnL >= 0 ? "good" : "bad",
      },
      footerLeft: data.equitiesAndMfs.focusTags.join(" + "),
      footerRight: data.equitiesAndMfs.isLiveSync
        ? { text: "Live sync", tone: "good" }
        : undefined,
    },
    {
      id: "lent",
      label: "Money Lent (Receivable)",
      icon: ArrowUpRight,
      iconTone: "bad",
      value: data.moneyLent.totalReceivable,
      delta: {
        text: data.moneyLent.topOverdueItem
          ? `${data.moneyLent.overdueCount} Overdue (${data.moneyLent.topOverdueItem.counterpartyName} ${formatCompact(data.moneyLent.topOverdueItem.amount)})`
          : "No overdue items",
        icon: data.moneyLent.overdueCount ? Clock : CircleCheck,
        tone: data.moneyLent.overdueCount ? "bad" : "good",
      },
      footerLeft: `${data.moneyLent.activeBorrowersCount} Active borrowers pending`,
    },
    {
      id: "borrowed",
      label: "Money Borrowed (Liability)",
      icon: ArrowDownLeft,
      iconTone: "ink",
      value: data.moneyBorrowed.totalLiability,
      delta: {
        text: data.moneyBorrowed.nextDueItem
          ? `Due in ${data.moneyBorrowed.nextDueItem.daysRemaining} days (${data.moneyBorrowed.nextDueItem.counterpartyName})`
          : "No upcoming dues",
        icon: Clock,
        tone: "accent",
      },
      footerLeft:
        data.moneyBorrowed.nextDueItem?.note ?? "No upcoming repayment",
    },
    {
      id: "sips",
      label: "SIPs & Auto-Debits",
      icon: RefreshCw,
      iconTone: "accent",
      value: data.sipsAndAutoDebits.totalMonthlyCommitment,
      suffix: "/mo",
      hideDecimals: true,
      delta: {
        text: `${data.sipsAndAutoDebits.executedThisMonthCount}/${data.sipsAndAutoDebits.totalActiveRulesCount} Executed this month`,
        icon: CircleCheck,
        tone: "good",
      },
      footerLeft: data.sipsAndAutoDebits.nextExecutionDate
        ? `Next on: ${data.sipsAndAutoDebits.nextExecutionDate}`
        : "No upcoming execution",
      footerRight: data.sipsAndAutoDebits.highlightTitles.length
        ? {
            text: data.sipsAndAutoDebits.highlightTitles.join(" + "),
            tone: "neutral",
          }
        : undefined,
    },
  ];
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

const emptyLedger = {
  lentTotal: 0,
  borrowedTotal: 0,
  entries: [] as LedgerEntry[],
};
function toLedger(data: DashboardSummary) {
  return {
    lentTotal: data.moneyLent.totalReceivable,
    borrowedTotal: data.moneyBorrowed.totalLiability,
    entries: [] as LedgerEntry[],
  };
}
const emptyMarkets = {
  portfolioValue: 0,
  portfolioChangePct: 0,
  indices: [] as MarketIndex[],
  holdings: [] as Holding[],
};
function toMarkets(data: DashboardSummary) {
  return {
    portfolioValue: data.equitiesAndMfs.currentValue,
    portfolioChangePct: data.equitiesAndMfs.pnlPercent,
    indices: [] as MarketIndex[],
    holdings: [] as Holding[],
  };
}
const emptyTrendData = { monthly: [], weekly: [], daily: [] } as Record<
  "monthly" | "weekly" | "daily",
  TrendPoint[]
>;
const emptyTrendMeta = {
  incomeDelta: "N/A",
  expenseDelta: "N/A",
  surplusMargin: "N/A",
};
function toTrendMeta(data: DashboardSummary) {
  return {
    incomeDelta: signedPercent(data.income.momChangePercent),
    expenseDelta: signedPercent(data.expenses.momChangePercent),
    surplusMargin: `${data.netCashFlow.savingsRatePercent.toFixed(1)}%`,
  };
}
function formatCompact(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(Math.abs(value))}`;
}
