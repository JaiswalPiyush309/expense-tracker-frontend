"use client";

import type { ChartDataPoint } from "../api/investments-api";

interface Props {
  growth: ChartDataPoint[] | null;
}

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function PortfolioGrowthChartCard({ growth }: Props) {
  const points = growth ?? [];
  const maxValue = Math.max(...points.map((point) => point.invested), 1);
  const chartPoints = points
    .map((point, index) => {
      const x = points.length < 2 ? 300 : 12 + (index / (points.length - 1)) * 576;
      const y = 160 - (point.invested / maxValue) * 130;
      return `${x},${y}`;
    })
    .join(" ");
  const latest = points[points.length - 1];

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Portfolio activity over time</h2>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Running invested amount calculated from recorded buys and sells
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          Recorded invested amount
        </span>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          {latest ? money(latest.invested) : "—"}
        </span>
      </div>

      <div className="my-4 h-48 w-full">
        {points.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            No investment transaction history available.
          </div>
        ) : (
          <svg viewBox="0 0 600 180" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Recorded invested amount by month">
            {[30, 73, 116, 160].map((y) => (
              <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
            ))}
            {points.length > 1 && <polyline points={chartPoints} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            {points.length === 1 && <circle cx="300" cy={160 - (points[0].invested / maxValue) * 130} r="5" fill="#4f46e5" />}
            {points.length > 1 && <circle cx={12 + ((points.length - 1) / (points.length - 1)) * 576} cy={160 - (latest!.invested / maxValue) * 130} r="5" fill="#4f46e5" />}
          </svg>
        )}
      </div>

      {points.length > 0 && (
        <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
          <span>{points[0].date}</span>
          {points.length > 2 && <span>{points[Math.floor(points.length / 2)].date}</span>}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{latest?.date}</span>
        </div>
      )}
      <p className="mt-3 text-[10px] text-slate-400">
        This is a ledger-based estimate, not a historical market valuation.
      </p>
    </section>
  );
}
