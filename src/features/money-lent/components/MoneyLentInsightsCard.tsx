"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Info,
  ShieldCheck,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import type { LentLoanItem, LentMetrics } from "../types";

interface MoneyLentInsightsCardProps {
  metrics: LentMetrics;
  items: LentLoanItem[];
}

export function MoneyLentInsightsCard({
  metrics,
  items,
}: MoneyLentInsightsCardProps) {
  // Find next upcoming due loan
  const upcomingLoans = items
    .filter((item) => item.balanceDue > 0 && item.status !== "OVERDUE")
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

  const nextDue = upcomingLoans[0];

  // Find largest single debtor
  const largestDebtor = [...items]
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
                LedgerFlow Double-Entry Principles
              </h4>
              <p className="text-[11px] font-medium text-muted">
                Balance Sheet Integrity &amp; Net Worth Protection
              </p>
            </div>
          </div>

          <div className="mt-3.5 space-y-2 rounded-xl bg-surface-muted/50 p-3.5 text-xs text-muted">
            <p>
              <strong className="text-ink">1. Asset, Not an Expense:</strong> When
              you lend money to an individual, cash departs your bank account, but
              your net worth does <em>not</em> drop. It transforms into a{" "}
              <strong className="text-accent">Current Asset (Loan Receivable)</strong>.
            </p>
            <p>
              <strong className="text-ink">2. Zero Tax &amp; Budget Distortion:</strong>{" "}
              Treating loans as expenses would artificially inflate your monthly
              burn rate and show false deficit. Repayments merely swap the receivable
              asset back to bank cash.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-xs">
          <div className="flex items-center gap-2 text-good font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Compliant with Double-Entry Standards</span>
          </div>

          <Link
            href="/money-borrowed"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
          >
            <span>View Money Borrowed (Payables)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      {/* Recovery Analytics & Next Milestone (5 cols) */}
      <Card className="flex flex-col justify-between p-5 shadow-card lg:col-span-5">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-good-soft text-good">
                <CalendarCheck className="h-4 w-4" />
              </span>
              <h4 className="text-sm font-bold text-ink">Repayment Milestones</h4>
            </div>

            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-bold text-accent">
              Schedule
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            {nextDue ? (
              <div className="rounded-xl border border-line bg-surface p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Next Expected Settlement
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-bold text-ink text-sm">
                    {nextDue.borrowerName}
                  </span>
                  <span className="font-bold text-accent">
                    {formatINR(nextDue.balanceDue, { decimals: false })}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted">
                  Due on {nextDue.dueDate} ({nextDue.relationship})
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-surface p-3 text-muted">
                No scheduled pending settlements.
              </div>
            )}

            {largestDebtor && (
              <div className="rounded-xl border border-line bg-surface p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Single Largest Exposure
                </p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-bold text-ink text-sm">
                    {largestDebtor.borrowerName}
                  </span>
                  <span className="font-bold text-ink">
                    {formatINR(largestDebtor.balanceDue, { decimals: false })}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted">
                  Represents{" "}
                  {metrics.outstandingReceivable > 0
                    ? Math.round(
                        (largestDebtor.balanceDue /
                          metrics.outstandingReceivable) *
                          100,
                      )
                    : 0}
                  % of total outstanding receivables
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-3">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Portfolio Recovery Rate</span>
            <span className="text-good">{metrics.recoveryRatePercent}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-good transition-all duration-500"
              style={{ width: `${metrics.recoveryRatePercent}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
