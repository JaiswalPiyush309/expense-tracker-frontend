"use client";

import { useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { IncomeVelocityGranularity } from "../types";
import { useIncomeAnalytics } from "../hooks/useIncomeAnalytics";

const currency = (value: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(value);

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function InflowVelocityCard() {
  const [granularity, setGranularity] = useState<IncomeVelocityGranularity>("Monthly");
  const { transactions, isLoading, error } = useIncomeAnalytics();
  const points = useMemo(() => {
    const now = new Date();
    const count = granularity === "Monthly" ? 6 : granularity === "Weekly" ? 6 : 7;
    const periods = Array.from({ length: count }, (_, index) => {
      const date = new Date(now);
      if (granularity === "Monthly") date.setMonth(now.getMonth() - (count - index - 1), 1);
      else date.setDate(now.getDate() - (count - index - 1) * (granularity === "Weekly" ? 7 : 1));
      const label = granularity === "Monthly"
        ? new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" }).format(date)
        : granularity === "Weekly"
          ? `Wk ${index + 1}`
          : new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date);
      return { date, label, amount: 0 };
    });

    transactions.forEach((transaction) => {
      const date = new Date(transaction.transactionDate);
      if (Number.isNaN(date.getTime())) return;
      const period = periods.find(({ date: start }, index) => {
        if (granularity === "Monthly") return date.getFullYear() === start.getFullYear() && date.getMonth() === start.getMonth();
        if (granularity === "Daily") return dayKey(date) === dayKey(start);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return date >= start && (index === periods.length - 1 ? date <= now : date < end);
      });
      if (period) period.amount += Number(transaction.amount);
    });
    return periods;
  }, [granularity, transactions]);

  const maxAmount = Math.max(...points.map((point) => point.amount), 1);
  const plotted = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? 250 : 10 + (index * 475) / (points.length - 1),
    y: 100 - (point.amount / maxAmount) * 82,
  }));
  const linePath = plotted.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = plotted.length ? `${linePath} L ${plotted.at(-1)?.x} 112 L ${plotted[0].x} 112 Z` : "";
  const peak = points.reduce((best, point) => point.amount > best.amount ? point : best, points[0]);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-2xs dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><h3 className="text-sm font-bold text-ink">Inflow Velocity &amp; Historical Trend</h3><p className="mt-0.5 text-xs text-muted">Income transactions grouped by date</p></div>
        <div className="inline-flex rounded-lg border border-line bg-surface-muted p-0.5" role="group" aria-label="Trend time grouping">
          {(["Monthly", "Weekly", "Daily"] as IncomeVelocityGranularity[]).map((mode) => <button key={mode} type="button" aria-pressed={granularity === mode} onClick={() => setGranularity(mode)} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${granularity === mode ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400" : "text-muted hover:text-ink"}`}>{mode}</button>)}
        </div>
      </div>

      {isLoading ? <div className="flex h-56 items-center justify-center gap-2 text-sm text-muted"><LoaderCircle className="h-4 w-4 animate-spin" />Loading income history…</div> : error ? <div role="alert" className="flex h-56 items-center justify-center text-sm text-bad">{error}</div> : transactions.length === 0 ? <div className="flex h-56 items-center justify-center text-sm text-muted">Add income transactions to see your trend.</div> : (
        <div className="my-4">
          <div className="relative h-36 w-full">
            <svg viewBox="0 0 500 120" className="h-full w-full overflow-visible" preserveAspectRatio="none" role="img" aria-label={`${granularity} income trend`}>
              <defs><linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.28" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
              {[35, 65, 95].map((y) => <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 5" />)}
              <path d={areaPath} fill="url(#incomeAreaGrad)" />
              <path d={linePath} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {plotted.map((point) => <circle key={point.label} cx={point.x} cy={point.y} r="3.5" fill="white" stroke="#059669" strokeWidth="2"><title>{`${point.label}: ${currency(point.amount)}`}</title></circle>)}
            </svg>
          </div>
          <div className="mt-2 grid text-center" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
            {points.map((point) => <div key={point.label} className="text-[10px]"><div className="font-medium text-muted">{point.label}</div><div className="mt-0.5 font-semibold text-ink">{currency(point.amount)}</div></div>)}
          </div>
        </div>
      )}

      <div className="border-t border-line pt-3 text-[11px] text-muted">
        {error ? "Trend data is unavailable." : peak?.amount ? `Highest ${granularity.toLowerCase()} inflow: ${currency(peak.amount)} in ${peak.label}.` : "No income recorded in this time range."}
      </div>
    </div>
  );
}
