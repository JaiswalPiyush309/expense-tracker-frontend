"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  CheckCheck,
  CheckCircle2,
  Clock,
  Landmark,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import type { BorrowedMetrics } from "../types";

interface MoneyBorrowedKpiGridProps {
  metrics: BorrowedMetrics;
}

export function MoneyBorrowedKpiGrid({ metrics }: MoneyBorrowedKpiGridProps) {
  const cards = [
    {
      id: "outstanding",
      label: "OUTSTANDING PAYABLE",
      value: formatINR(metrics.outstandingPayable, { decimals: false }),
      subline: "Current liability due for return",
      badgeText: "Balance Sheet Liability",
      badgeTone: "bad" as const,
      icon: Wallet,
      valueColor: metrics.outstandingPayable > 0 ? "text-bad" : "text-good",
    },
    {
      id: "total-borrowed",
      label: "TOTAL PRINCIPAL BORROWED",
      value: formatINR(metrics.totalBorrowed, { decimals: false }),
      subline: "Cumulative borrowing inflow",
      badgeText: "Historical Debt",
      badgeTone: "neutral" as const,
      icon: Landmark,
      valueColor: "text-ink",
    },
    {
      id: "repaid",
      label: "TOTAL REPAID",
      value: formatINR(metrics.totalRepaid, { decimals: false }),
      subline: `${metrics.repaymentProgressPercent}% of total debt cleared`,
      badgeText: `${metrics.repaymentProgressPercent}% Cleared`,
      badgeTone: "good" as const,
      icon: CheckCircle2,
      valueColor: "text-good",
    },
    {
      id: "overdue",
      label: "OVERDUE DEBT",
      value: formatINR(metrics.overdueAmount, { decimals: false }),
      subline:
        metrics.overdueAmount > 0
          ? "Past scheduled repayment date"
          : "Zero overdue obligations",
      badgeText: metrics.overdueAmount > 0 ? "Urgent Action" : "On Track",
      badgeTone: (metrics.overdueAmount > 0 ? "bad" : "good") as "bad" | "good",
      icon: AlertTriangle,
      valueColor: metrics.overdueAmount > 0 ? "text-bad" : "text-good",
    },
    {
      id: "lenders",
      label: "ACTIVE CREDITORS",
      value: `${metrics.activeLendersCount} Lenders`,
      subline: "Parties with non-zero balance",
      badgeText: "Open Liabilities",
      badgeTone: "accent" as const,
      icon: Users,
      valueColor: "text-ink",
    },
    {
      id: "settled",
      label: "SETTLED LOANS",
      value: `${metrics.settledDebtsCount} Completed`,
      subline: "Fully cleared and closed",
      badgeText: "100% Repaid",
      badgeTone: "good" as const,
      icon: CheckCheck,
      valueColor: "text-good",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card
            key={c.id}
            className="flex flex-col justify-between p-4 shadow-card transition-shadow hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {c.label}
                </span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink dark:bg-slate-800">
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </div>

              <p
                className={`mt-2 text-xl font-bold tracking-tight tabular-nums ${c.valueColor}`}
              >
                {c.value}
              </p>

              <p className="mt-1 text-[11px] font-medium text-muted">
                {c.subline}
              </p>
            </div>

            <div className="mt-3 border-t border-line pt-2">
              <Badge tone={c.badgeTone} className="text-[10px] font-semibold">
                {c.badgeText}
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
