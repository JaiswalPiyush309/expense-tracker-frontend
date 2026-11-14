"use client";

import { Card } from "@/components/ui/Card";
import type { PortfolioHoldingRow } from "../types";

interface Props {
  holdings: PortfolioHoldingRow[];
}

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function HoldingsKpiGrid({ holdings }: Props) {
  const invested = holdings.reduce((sum, holding) => sum + holding.investedAmount, 0);
  const current = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const pnl = holdings.reduce((sum, holding) => sum + holding.netGainAmount, 0);
  const returnPercent = invested > 0 ? (pnl / invested) * 100 : 0;
  const cards = [
    { label: "TOTAL INVESTED", value: money(invested), detail: "Recorded cost basis", color: "text-slate-900 dark:text-white" },
    { label: "CURRENT VALUE", value: money(current), detail: "Value returned by your holdings records", color: "text-slate-900 dark:text-white" },
    { label: "UNREALIZED P&L", value: money(pnl), detail: "Open positions", color: pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400" },
    { label: "RETURN", value: `${returnPercent >= 0 ? "+" : ""}${returnPercent.toFixed(2)}%`, detail: "Based on recorded cost and value", color: returnPercent >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-rose-600 dark:text-rose-400" },
    { label: "HOLDINGS", value: String(holdings.length), detail: "Positions in your account", color: "text-slate-900 dark:text-white" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label} className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {card.label}
          </div>
          <div className={`mt-2 text-xl font-bold tracking-tight ${card.color}`}>
            {card.value}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {card.detail}
          </div>
        </Card>
      ))}
    </div>
  );
}
