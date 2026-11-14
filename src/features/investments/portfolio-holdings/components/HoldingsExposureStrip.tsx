"use client";

import type { PortfolioHoldingRow } from "../types";

export function HoldingsExposureStrip({ holdings }: { holdings: PortfolioHoldingRow[] }) {
  const topThree = [...holdings]
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 3);
  const concentration = topThree.reduce(
    (sum, holding) => sum + holding.portfolioWeightPercent,
    0,
  );
  const facts = [
    {
      label: "TOP 3 CONCENTRATION",
      value: `${concentration.toFixed(1)}%`,
      detail: topThree.map((holding) => holding.symbol).join(" · ") || "No holdings yet",
    },
    {
      label: "ASSET CLASS DATA",
      value: `${new Set(holdings.map((holding) => holding.capCategory)).size}`,
      detail: "Distinct classes in recorded holdings",
    },
    {
      label: "MARKET QUOTES",
      value: "Unavailable",
      detail: "Current prices are not provided by the holdings API",
    },
    {
      label: "CHARGES & INTEREST",
      value: "Transaction history",
      detail: "Shown per transaction when available",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
      {facts.map((fact) => (
        <div key={fact.label} className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {fact.label}
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {fact.value}
          </div>
          <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">
            {fact.detail}
          </div>
        </div>
      ))}
    </div>
  );
}
