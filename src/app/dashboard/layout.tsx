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
import {
  budgets,
  categoryShares,
  ledger,
  markets,
  overview,
  stats,
  transactions,
  trendData,
  trendMeta,
} from "@/features/dashboard/data/mock";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useState } from "react";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { user: authUser } = useAuthUser();

  const expenses = stats.find((s) => s.id === "expenses")?.value ?? 0;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="mx-auto w-full max-w-350 space-y-6 p-4 sm:p-6">
          <WelcomeCard
            name={authUser?.name ?? "there"}
            netWorth={overview.netWorth}
            netWorthChange={overview.netWorthYoY}
            periodLabel={overview.periodLabel}
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
      </div>
    </div>
  );
}
