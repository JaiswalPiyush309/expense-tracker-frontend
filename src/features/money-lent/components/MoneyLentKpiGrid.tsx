"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  CheckCheck,
  CheckCircle2,
  HandCoins,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import type { LentMetrics } from "../types";

interface MoneyLentKpiGridProps {
  metrics: LentMetrics;
}

export function MoneyLentKpiGrid({ metrics }: MoneyLentKpiGridProps) {
  const cards = [
    {
      id: "outstanding",
      label: "OUTSTANDING RECEIVABLE",
      value: formatINR(metrics.outstandingReceivable, { decimals: false }),
      subline: "Active capital awaiting return",
      badgeText: "Asset on Balance Sheet",
      badgeTone: "accent" as const,
      icon: HandCoins,
      valueColor: "text-accent",
    },
    {
      id: "total-lent",
      label: "TOTAL PRINCIPAL LENT",
      value: formatINR(metrics.totalLent, { decimals: false }),
      subline: "Cumulative funds disbursed",
      badgeText: "Historical Principal",
      badgeTone: "neutral" as const,
      icon: Wallet,
      valueColor: "text-ink",
    },
    {
      id: "recovered",
      label: "TOTAL RECOVERED",
      value: formatINR(metrics.totalRecovered, { decimals: false }),
      subline: `${metrics.recoveryRatePercent}% of principal recovered`,
      badgeText: `${metrics.recoveryRatePercent}% Recovery Rate`,
      badgeTone: "good" as const,
      icon: CheckCircle2,
      valueColor: "text-good",
    },
    {
      id: "overdue",
      label: "OVERDUE BALANCE",
      value: formatINR(metrics.overdueAmount, { decimals: false }),
      subline:
        metrics.overdueAmount > 0
          ? "Past scheduled repayment date"
          : "All repayments on track",
      badgeText: metrics.overdueAmount > 0 ? "Requires Follow-up" : "Zero Overdue",
      badgeTone: (metrics.overdueAmount > 0 ? "bad" : "good") as "bad" | "good",
      icon: AlertTriangle,
      valueColor: metrics.overdueAmount > 0 ? "text-bad" : "text-good",
    },
    {
      id: "borrowers",
      label: "ACTIVE BORROWERS",
      value: `${metrics.activeBorrowersCount} Contacts`,
      subline: "Parties with non-zero balance",
      badgeText: "Open Accounts",
      badgeTone: "accent" as const,
      icon: Users,
      valueColor: "text-ink",
    },
    {
      id: "settled",
      label: "SETTLED LOANS",
      value: `${metrics.settledLoansCount} Completed`,
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
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
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
