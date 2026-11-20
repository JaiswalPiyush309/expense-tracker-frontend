"use client";

import { AlertCircle, ArrowUpRight, BellRing, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";
import type { LentLoanItem } from "../types";

interface MoneyLentBorrowersStripProps {
  items: LentLoanItem[];
  onOpenRepayModal: (item: LentLoanItem) => void;
  onSendReminder: (item: LentLoanItem) => void;
}

export function MoneyLentBorrowersStrip({
  items,
  onOpenRepayModal,
  onSendReminder,
}: MoneyLentBorrowersStripProps) {
  // Top active borrowers with highest pending balances
  const topBorrowers = items
    .filter((item) => item.balanceDue > 0)
    .sort((a, b) => b.balanceDue - a.balanceDue)
    .slice(0, 4);

  if (topBorrowers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          Active Receivables Spotlight
        </h3>
        <span className="text-xs text-muted">
          Top {topBorrowers.length} highest outstanding balances
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {topBorrowers.map((item) => {
          const percent =
            item.originalAmount > 0
              ? Math.min(
                  100,
                  Math.round((item.recoveredAmount / item.originalAmount) * 100),
                )
              : 0;

          const isOverdue = item.status === "OVERDUE";

          return (
            <Card
              key={item.id}
              className={`flex flex-col justify-between border-l-4 p-4 shadow-card transition-all hover:shadow-md ${
                isOverdue
                  ? "border-l-bad bg-bad-soft/10 dark:bg-bad-soft/5"
                  : "border-l-accent"
              }`}
            >
              <div>
                {/* Header: Avatar + Name + Relationship */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                        toneSoft[item.borrowerAvatarTone]
                      }`}
                    >
                      {item.borrowerInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">
                        {item.borrowerName}
                      </p>
                      <p className="text-[11px] font-medium text-muted">
                        {item.relationship}
                      </p>
                    </div>
                  </div>

                  <Badge
                    tone={isOverdue ? "bad" : "accent"}
                    className="shrink-0 text-[10px]"
                  >
                    {isOverdue ? "Overdue" : "Active"}
                  </Badge>
                </div>

                {/* Balance Due Display */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Balance Due
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-xl font-bold tracking-tight tabular-nums ${
                        isOverdue ? "text-bad" : "text-ink"
                      }`}
                    >
                      {formatINR(item.balanceDue, { decimals: false })}
                    </span>
                    <span className="text-xs text-muted">
                      of {formatINR(item.originalAmount, { decimals: false })}
                    </span>
                  </div>
                </div>

                {/* Recovery Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
                    <span>{percent}% Cleared</span>
                    <span className="text-good">
                      {formatINR(item.recoveredAmount, { decimals: false })}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent === 100
                          ? "bg-good"
                          : isOverdue
                            ? "bg-bad"
                            : "bg-accent"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Due Date Indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                  {isOverdue ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-bad">
                      <AlertCircle className="h-3 w-3" />
                      Overdue since {item.dueDate}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-medium text-muted">
                      <Clock className="h-3 w-3" />
                      Due by {item.dueDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendReminder(item)}
                  className="gap-1 text-xs text-muted hover:text-ink"
                  title="Send repayment reminder"
                >
                  <BellRing aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Remind</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onOpenRepayModal(item)}
                  className="gap-1 text-xs font-semibold"
                >
                  <Check aria-hidden="true" className="h-3.5 w-3.5 text-good" />
                  <span>Settle / Pay</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
