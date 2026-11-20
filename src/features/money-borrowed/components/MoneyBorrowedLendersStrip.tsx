"use client";

import { AlertCircle, Check, Clock, Handshake, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";
import type { BorrowedLoanItem } from "../types";

interface MoneyBorrowedLendersStripProps {
  items: BorrowedLoanItem[];
  onOpenRepayModal: (item: BorrowedLoanItem) => void;
  onNotifyLender: (item: BorrowedLoanItem) => void;
}

export function MoneyBorrowedLendersStrip({
  items,
  onOpenRepayModal,
  onNotifyLender,
}: MoneyBorrowedLendersStripProps) {
  // Top active lenders with highest pending balances
  const topLenders = items
    .filter((item) => item.balanceDue > 0)
    .sort((a, b) => b.balanceDue - a.balanceDue)
    .slice(0, 4);

  if (topLenders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
          Active Payables Spotlight
        </h3>
        <span className="text-xs text-muted">
          Top {topLenders.length} highest debt commitments
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {topLenders.map((item) => {
          const percent =
            item.originalAmount > 0
              ? Math.min(
                  100,
                  Math.round((item.repaidAmount / item.originalAmount) * 100),
                )
              : 0;

          const isOverdue = item.status === "OVERDUE";

          return (
            <Card
              key={item.id}
              className={`flex flex-col justify-between border-l-4 p-4 shadow-card transition-all hover:shadow-md ${
                isOverdue
                  ? "border-l-bad bg-bad-soft/10 dark:bg-bad-soft/5"
                  : "border-l-indigo-500"
              }`}
            >
              <div>
                {/* Header: Avatar + Name + Relationship */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                        toneSoft[item.lenderAvatarTone]
                      }`}
                    >
                      {item.lenderInitials}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-ink">
                          {item.lenderName}
                        </p>
                        {item.counterpartyUserId && (
                          <span
                            className="inline-flex shrink-0 items-center rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent"
                            title="Linked Member Account"
                          >
                            Member
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-muted">
                        {item.relationship}
                      </p>
                    </div>
                  </div>

                  <Badge
                    tone={isOverdue ? "bad" : "neutral"}
                    className="shrink-0 text-[10px]"
                  >
                    {isOverdue ? "Overdue" : "Payable"}
                  </Badge>
                </div>

                {/* Balance Due Display */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Balance Payable
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

                {/* Repayment Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
                    <span>{percent}% Repaid</span>
                    <span className="text-good">
                      {formatINR(item.repaidAmount, { decimals: false })}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent === 100
                          ? "bg-good"
                          : isOverdue
                            ? "bg-bad"
                            : "bg-indigo-500"
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
                      Due by {item.dueDate || "No deadline"}
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
                  onClick={() => onNotifyLender(item)}
                  className="gap-1 text-xs text-muted hover:text-ink"
                  title="Notify lender on status"
                >
                  <MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Notify</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onOpenRepayModal(item)}
                  className="gap-1 text-xs font-semibold"
                >
                  <Check aria-hidden="true" className="h-3.5 w-3.5 text-good" />
                  <span>Make Payment</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
