"use client";

import { AddTransactionDialog } from "@/components/transactions/add-transaction";
import { useState } from "react";
import { ShareMarketHeader } from "./share-market/components/ShareMarketHeader";
import { InvestmentKpiGrid } from "./share-market/components/InvestmentKpiGrid";
import { PortfolioGrowthChartCard } from "./share-market/components/PortfolioGrowthChartCard";
import { AssetAllocationCard } from "./share-market/components/AssetAllocationCard";
import { MarketIndicesTickerCard } from "./share-market/components/MarketIndicesTickerCard";
import { TopHoldingsTableCard } from "./share-market/components/TopHoldingsTableCard";
import { RecentInvestmentActivityCard } from "./share-market/components/RecentInvestmentActivityCard";
import { LedgerFlowIntelligenceCard } from "./share-market/components/LedgerFlowIntelligenceCard";

export function ShareMarketDashboardView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-5 p-5">
      {/* Top Breadcrumb & Action Header */}
      <ShareMarketHeader onOpenAddInvestment={() => setIsAddModalOpen(true)} />

      {/* 6-Card KPI Strip */}
      <InvestmentKpiGrid />

      {/* Row 1: Portfolio Growth vs Benchmark (8 cols) + Asset Allocation (4 cols) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PortfolioGrowthChartCard />
        </div>
        <div className="lg:col-span-4">
          <AssetAllocationCard />
        </div>
      </div>

      {/* Live NSE/BSE Market Indices & Sector Trend Strip */}
      <MarketIndicesTickerCard />

      {/* Top Portfolio Holdings Table */}
      <TopHoldingsTableCard />

      {/* Bottom Row: Recent Investment Activity + LedgerFlow Intelligence */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentInvestmentActivityCard />
        <LedgerFlowIntelligenceCard />
      </div>

      {/* Reused AddTransactionDialog */}
      <AddTransactionDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
