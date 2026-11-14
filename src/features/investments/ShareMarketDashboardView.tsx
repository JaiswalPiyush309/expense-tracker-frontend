"use client";

import { useState } from "react";
import { AddInvestmentDialog } from "./components/AddInvestmentDialog";
import { ShareMarketHeader } from "./share-market/components/ShareMarketHeader";
import { InvestmentKpiGrid } from "./share-market/components/InvestmentKpiGrid";
import { PortfolioGrowthChartCard } from "./share-market/components/PortfolioGrowthChartCard";
import { AssetAllocationCard } from "./share-market/components/AssetAllocationCard";
import { TopHoldingsTableCard } from "./share-market/components/TopHoldingsTableCard";
import { RecentInvestmentActivityCard } from "./share-market/components/RecentInvestmentActivityCard";
import { useShareMarketSummary } from "./share-market/hooks/useShareMarketSummary";

export function ShareMarketDashboardView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useShareMarketSummary();

  return (
    <div className="space-y-5 p-5">
      {/* Top Breadcrumb & Action Header */}
      <ShareMarketHeader
        onOpenAddInvestment={() => setIsAddModalOpen(true)}
        onImported={refetch}
      />

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 dark:border-rose-800 dark:bg-rose-900/20">
          <span className="text-rose-500">⚠</span>
          <p className="flex-1 text-sm text-rose-700 dark:text-rose-300">
            {error}
          </p>
          <button
            type="button"
            onClick={refetch}
            className="text-xs font-semibold text-rose-700 underline dark:text-rose-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Full-page loading skeleton */}
      {isLoading && !data ? (
        <div className="animate-pulse space-y-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 lg:col-span-8" />
            <div className="h-72 rounded-2xl bg-slate-100 dark:bg-slate-800 lg:col-span-4" />
          </div>
          <div className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-56 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-56 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ) : (
        <>
          {/* 6-Card KPI Strip */}
          <InvestmentKpiGrid kpis={data?.kpis ?? null} />

          {/* Row 1: Portfolio Growth vs Benchmark (8 cols) + Asset Allocation (4 cols) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <PortfolioGrowthChartCard growth={data?.portfolioGrowth ?? null} />
            </div>
            <div className="lg:col-span-4">
              <AssetAllocationCard
                allocation={data?.assetAllocation ?? null}
                totalValue={data?.kpis?.portfolioValue ?? null}
              />
            </div>
          </div>

          {/* Top Portfolio Holdings Table */}
          <TopHoldingsTableCard holdings={data?.topHoldings ?? null} isLoading={isLoading} />

          <RecentInvestmentActivityCard activity={data?.recentActivity ?? null} />
        </>
      )}

      <AddInvestmentDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={refetch}
      />
    </div>
  );
}
