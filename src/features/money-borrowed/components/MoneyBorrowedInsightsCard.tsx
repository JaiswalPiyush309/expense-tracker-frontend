"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Info,
  ShieldCheck,
  TrendingDown,
  Workflow,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import type { BorrowedLoanItem, BorrowedMetrics } from "../types";

interface MoneyBorrowedInsightsCardProps {
  metrics: BorrowedMetrics;
  items: BorrowedLoanItem[];
}

export function MoneyBorrowedInsightsCard({
  metrics,
  items,
}: MoneyBorrowedInsightsCardProps) {
  // Find next upcoming due repayment commitment
  const upcomingDebts = items
    .filter((item) => item.balanceDue > 0 && item.status !== "OVERDUE")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

  const nextDue = upcomingDebts[0];

  // Find largest single creditor
  const largestCreditor = [...items]
    .filter((item) => item.balanceDue > 0)
    .sort((a, b) => b.balanceDue - a.balanceDue)[0];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Accounting Compliance Banner (7 cols) */}
      <Card className="flex flex-col justify-between p-5 shadow-card lg:col-span-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent-soft text-accent">
              <Workflow className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-ink">
                Double-Entry Debt Principles
              </h4>
              <p className="text-[11px] font-medium text-muted">
                Balance Sheet Integrity &amp; Cash Flow Accuracy
              </p>
            </div>
          </div>

          <div className="mt-3.5 space-y-2 rounded-xl bg-surface-muted/50 p-3.5 text-xs text-muted">
            <p>
              <strong className="text-ink">1. Liability, Not Income:</strong> When
              funds are borrowed, your bank balance rises, but your true net worth
              does <em>not</em> increase. It creates an offsetting{" "}
              <strong className="text-bad">Current Liability (Loan Payable)</strong>.
            </p>
            <p>
              <strong className="text-ink">2. Zero Expense Distortion:</strong>{" "}
              Repaying principal debt clears the liability from your balance sheet.
              Classifying repayments as personal expenses would artificially
              double-count cash outflows and corrupt your monthly budget analytics.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs">
          <div className="flex items-center gap-2 text-good font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Compliant with Double-Entry Accounting</span>
          </div>

          <Link
            href="/money-lent"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            <span>View Money Lent (Receivables)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      {/* Debt Discharge Milestones (5 cols) */}
      <Card className="flex flex-col justify-between p-5 shadow-card lg:col-span-5">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-good-soft text-good">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">Debt Discharge Milestones</h4>
            </div>

            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-bold text-accent">
              Commitments
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {nextDue ? (
              <div className="rounded-xl border border-line bg-surface p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Next Scheduled Payment Due
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-bold text-ink text-sm">
                    {nextDue.lenderName}
                  </span>
                  <span className="font-bold text-bad">
                    {formatINR(nextDue.balanceDue, { decimals: false })}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted">
                  Due on {nextDue.dueDate} ({nextDue.relationship})
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-surface p-3 text-muted">
                No scheduled repayment deadlines pending.
              </div>
            )}

            {largestCreditor && (
              <div className="rounded-xl border border-line bg-surface p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Largest Outstanding Creditor
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-bold text-ink text-sm">
                    {largestCreditor.lenderName}
                  </span>
                  <span className="font-bold text-ink">
                    {formatINR(largestCreditor.balanceDue, { decimals: false })}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted">
                  Represents{" "}
                  {metrics.outstandingPayable > 0
                    ? Math.round(
                        (largestCreditor.balanceDue /
                          metrics.outstandingPayable) *
                          100,
                      )
                    : 0}
                  % of your total personal liabilities
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Overall Debt Clearance Progress</span>
            <span className="text-good">{metrics.repaymentProgressPercent}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-good transition-all duration-500"
              style={{ width: `${metrics.repaymentProgressPercent}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
