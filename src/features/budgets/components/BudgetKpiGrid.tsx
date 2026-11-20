"use client";

import {
  AlertTriangle,
  ArrowDown,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Gauge,
  ShieldCheck,
  TrendingDown,
  Wallet,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import type { BudgetOverviewMetrics } from "../types";

interface BudgetKpiGridProps {
  metrics: BudgetOverviewMetrics;
}

export function BudgetKpiGrid({ metrics }: BudgetKpiGridProps) {
  const cards = [
    {
      id: "total-budget",
      label: "TOTAL BUDGET",
      value: formatINR(metrics.totalBudget, { decimals: true }),
      subline: `${metrics.envelopeCount} category envelopes allocated`,
      footnote: "Monthly Cycle",
      footnoteIcon: Calendar,
      footnoteColor: "text-muted",
      icon: Wallet,
      valueColor: "text-ink",
    },
    {
      id: "total-outflow",
      label: "TOTAL OUTFLOW",
      value: formatINR(metrics.totalOutflow, { decimals: true }),
      subline: `${metrics.outflowPercent}% of limit consumed`,
      footnote: metrics.outflowTrendPercent === null
        ? "No prior month comparison"
        : `${metrics.outflowTrendPercent > 0 ? "↑" : "↓"} ${Math.abs(metrics.outflowTrendPercent)}% vs last month`,
      footnoteIcon: TrendingDown,
      footnoteColor: "text-good",
      icon: TrendingDown,
      valueColor: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "safe-surplus",
      label: "SAFE SURPLUS",
      value: formatINR(metrics.safeSurplus, { decimals: true }),
      subline: `Buffer for remaining ${metrics.remainingDays} days`,
      footnote: "✓ Positive cash reserve",
      footnoteIcon: CheckCircle2,
      footnoteColor: "text-good",
      icon: ShieldCheck,
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "pacing-gauge",
      label: "PACING GAUGE",
      value: `${metrics.pacingGaugePercent}%`,
      badge: `${Math.abs(metrics.pacingAheadPercent)}% ${metrics.pacingAheadPercent >= 0 ? "ahead" : "behind"}`,
      subline: `Pacing target: ${metrics.pacingTargetPercent}% at Day ${metrics.currentDay}`,
      footnote: `${metrics.remainingDays} days remaining`,
      footnoteIcon: Clock,
      footnoteColor: "text-muted",
      icon: Gauge,
      valueColor: "text-ink",
    },
    {
      id: "over-budget",
      label: "OVER BUDGET",
      value: `${metrics.overBudgetCount} ${metrics.overBudgetCount === 1 ? "Envelope" : "Envelopes"}`,
      subline: metrics.overBudgetCount > 0
        ? `${metrics.overBudgetName} exceeds by ₹${metrics.overBudgetAmount.toLocaleString("en-IN")}`
        : "No category is over its limit",
      footnote: "⚠ Reallocation required",
      footnoteIcon: AlertTriangle,
      footnoteColor: "text-rose-600 font-semibold dark:text-rose-400",
      icon: Flame,
      valueColor: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "daily-run-burn",
      label: "DAILY RUN BURN",
      value: formatINR(metrics.dailyRunBurn, { decimals: true }),
      subline: "Optimal daily ceiling",
      footnote: "⚡ Smooth glidepath",
      footnoteIcon: Zap,
      footnoteColor: "text-good",
      icon: Calendar,
      valueColor: "text-ink",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const FootnoteIcon = card.footnoteIcon;
        return (
          <Card
            key={card.id}
            className="flex flex-col justify-between p-4 shadow-card transition-shadow hover:shadow-md"
          >
            <div>
              {/* Header Label + Icon */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {card.label}
                </span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-muted text-muted">
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Metric Value */}
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-xl font-bold tracking-tight tabular-nums ${card.valueColor}`}
                >
                  {card.value}
                </span>
                {card.badge && (
                  <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Subline */}
              <p className="mt-1 text-[11px] font-medium text-muted">
                {card.subline}
              </p>
            </div>

            {/* Footnote */}
            <div className="mt-3 border-t border-line pt-2">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium ${card.footnoteColor}`}
              >
                {card.footnote}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
