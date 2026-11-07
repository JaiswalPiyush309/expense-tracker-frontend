"use client";

import { useState } from "react";
import { IncomeVelocityGranularity } from "../types";
import { INFLOW_RAILS_SPLIT, INFLOW_VELOCITY_SERIES } from "../data/mock";

export function InflowVelocityCard() {
  const [granularity, setGranularity] =
    useState<IncomeVelocityGranularity>("Monthly");

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header & Granularity Switch */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Inflow Velocity &amp; Historical Trend
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Last 6 Months trajectory showing consistency and bonus jumps
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800">
          {(["Monthly", "Weekly", "Daily"] as IncomeVelocityGranularity[]).map(
            (mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setGranularity(mode)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                  granularity === mode
                    ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                {mode}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Smooth SVG Area Trajectory Chart */}
      <div className="my-4">
        <div className="relative h-36 w-full">
          <svg
            viewBox="0 0 500 120"
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            <path
              d="M 10 92 L 105 78 L 200 62 L 295 54 L 390 36 L 485 20 L 485 115 L 10 115 Z"
              fill="url(#incomeAreaGrad)"
            />

            {/* Trend Line */}
            <path
              d="M 10 92 L 105 78 L 200 62 L 295 54 L 390 36 L 485 20"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data Nodes */}
            {[
              [10, 92],
              [105, 78],
              [200, 62],
              [295, 54],
              [390, 36],
              [485, 20],
            ].map(([cx, cy], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={idx === 5 ? 4.5 : 3}
                className="fill-white stroke-emerald-600"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="mt-2 grid grid-cols-6 text-center">
          {INFLOW_VELOCITY_SERIES.map((pt, idx) => {
            const isLatest = idx === INFLOW_VELOCITY_SERIES.length - 1;
            return (
              <div key={pt.month} className="text-[10px]">
                <div
                  className={
                    isLatest
                      ? "font-bold text-emerald-600 dark:text-emerald-400"
                      : "font-medium text-slate-400"
                  }
                >
                  {pt.month}
                </div>
                <div
                  className={
                    isLatest
                      ? "font-bold text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400"
                  }
                >
                  {pt.shortAmount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inflow Rails Distribution Bar & TDS Audit Callout */}
      <div className="space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Inflow Rails Distribution
            </span>
            <span className="font-medium text-slate-500 dark:text-slate-400">
              NEFT (86%) • UPI (9.3%) • ECS (3.5%) • Direct (1.2%)
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {INFLOW_RAILS_SPLIT.map((rail) => (
              <div
                key={rail.label}
                className={rail.colorClass}
                style={{ width: `${rail.percentage}%` }}
              />
            ))}
          </div>
        </div>

        {/* Tax Deduction at Source (TDS) Audit Box */}
        <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-500/20 dark:bg-indigo-950/30">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            ✓
          </span>
          <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            <span className="font-bold uppercase text-indigo-950 dark:text-indigo-200">
              TAX DEDUCTION AT SOURCE (TDS) AUDIT:
            </span>{" "}
            ₹24,500 TDS deducted under Sec 192/194J is auto-mapped into Form
            26AS Tax Ledger.
          </div>
        </div>
      </div>
    </div>
  );
}
