"use client";

import { Card } from "@/components/ui/Card";
import type { BudgetOverviewMetrics, FiftyThirtyTwentyAllocation } from "../types";

interface BudgetHealthCardProps {
  metrics: BudgetOverviewMetrics;
  fiftyThirtyTwenty: FiftyThirtyTwentyAllocation;
}

export function BudgetHealthCard({
  metrics,
  fiftyThirtyTwenty,
}: BudgetHealthCardProps) {
  const percent = Math.min(100, metrics.outflowPercent);

  return (
    <Card className="flex flex-col justify-between p-5 shadow-card">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-ink">
              Overall Budget Health
            </h3>
            <p className="text-xs text-muted">
              Aggregated status of all 8 active spending envelopes
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-ink">
              ₹{(metrics.totalOutflow / 1000).toFixed(1)}k / ₹
              {(metrics.totalBudget / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent > 100
                  ? "bg-rose-500"
                  : percent > 85
                    ? "bg-amber-500"
                    : "bg-indigo-600"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>₹0 (Day 1)</span>
            <span className="font-semibold text-ink">
              Current: ₹{metrics.totalOutflow.toLocaleString("en-IN")} ({percent}%)
            </span>
            <span>Target: ₹{metrics.totalBudget.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* 3 Status Pills */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              ● 5 Healthy
            </p>
            <p className="mt-0.5 text-[10px] text-muted">Under 75% pace</p>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-2 text-center dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              ● 2 Guarded
            </p>
            <p className="mt-0.5 text-[10px] text-muted">75% - 99% pace</p>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-2 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
              ● 1 Over Limit
            </p>
            <p className="mt-0.5 text-[10px] text-muted">Exceeded ceiling</p>
          </div>
        </div>
      </div>

      {/* 50 / 30 / 20 Rule Allocation Section */}
      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            50 / 30 / 20 RULE ALLOCATION
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Balanced Profile
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {/* Needs */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">
                Needs{" "}
                <span className="font-normal text-muted">
                  (Rent, Groceries, Utilities, Health)
                </span>
              </span>
              <span className="font-bold text-ink">
                {fiftyThirtyTwenty.needs.actualPercent}% /{" "}
                {fiftyThirtyTwenty.needs.targetPercent}% target
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (fiftyThirtyTwenty.needs.actualPercent / 50) * 100)}%` }}
              />
            </div>
          </div>

          {/* Wants */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">
                Wants{" "}
                <span className="font-normal text-muted">
                  (Dining, Shopping, Entertainment)
                </span>
              </span>
              <span className="font-bold text-ink">
                {fiftyThirtyTwenty.wants.actualPercent}% /{" "}
                {fiftyThirtyTwenty.wants.targetPercent}% target
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (fiftyThirtyTwenty.wants.actualPercent / 30) * 100)}%` }}
              />
            </div>
          </div>

          {/* Savings */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">
                Savings, SIPs &amp; Emergency Buffer
              </span>
              <span className="font-bold text-ink">
                {fiftyThirtyTwenty.savings.actualPercent}% /{" "}
                {fiftyThirtyTwenty.savings.targetPercent}% target
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-300"
                style={{ width: `${Math.min(100, (fiftyThirtyTwenty.savings.actualPercent / 20) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
