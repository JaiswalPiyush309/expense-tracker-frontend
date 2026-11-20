"use client";

import { useState } from "react";
import {
  AlertCircle,
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  MoreVertical,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, Td, Th } from "@/components/ui/Table";
import { formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";
import type { LentLoanItem, LentStatus } from "../types";

interface MoneyLentTableCardProps {
  items: LentLoanItem[];
  onOpenRepayModal: (item: LentLoanItem) => void;
  onMarkSettled: (item: LentLoanItem) => void;
  onDeleteLoan: (id: string) => void;
  onSendReminder: (item: LentLoanItem) => void;
  onResetFilters: () => void;
}

function StatusBadge({ status }: { status: LentStatus }) {
  switch (status) {
    case "SETTLED":
      return (
        <Badge tone="good" className="gap-1 font-semibold">
          <CheckCircle2 className="h-3 w-3" />
          Settled
        </Badge>
      );
    case "OVERDUE":
      return (
        <Badge tone="bad" className="gap-1 font-semibold">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>
      );
    case "PARTIALLY_PAID":
      return (
        <Badge tone="accent" className="gap-1 font-semibold">
          <Clock className="h-3 w-3" />
          Part-Paid
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge tone="neutral" className="gap-1 font-semibold">
          Pending
        </Badge>
      );
  }
}

export function MoneyLentTableCard({
  items,
  onOpenRepayModal,
  onMarkSettled,
  onDeleteLoan,
  onSendReminder,
  onResetFilters,
}: MoneyLentTableCardProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          title="No lending records found"
          description="No money lent entries match the selected filters. Try resetting your search or status filter."
          action={
            <Button type="button" variant="secondary" onClick={onResetFilters}>
              Reset all filters
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-card">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-ink">
            Interpersonal Lending Records
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            Detailed ledger of loans extended to friends, family, and colleagues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            {items.length} {items.length === 1 ? "Record" : "Records"}
          </span>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Money lent records"
        className="min-w-240"
        wrapperClassName="overflow-x-auto"
      >
        <thead className="border-b border-line bg-surface-muted/50">
          <tr>
            <Th className="pl-5">Borrower / Contact</Th>
            <Th>Lent & Due Dates</Th>
            <Th>Disbursed From</Th>
            <Th align="right">Principal Lent</Th>
            <Th align="right">Recovered</Th>
            <Th align="right">Balance Due</Th>
            <Th className="w-36">Recovery %</Th>
            <Th>Status</Th>
            <Th align="right" className="pr-5">
              Quick Actions
            </Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-line/70 text-xs">
          {items.map((item) => {
            const percent =
              item.originalAmount > 0
                ? Math.min(
                    100,
                    Math.round(
                      (item.recoveredAmount / item.originalAmount) * 100,
                    ),
                  )
                : 0;

            const isOverdue = item.status === "OVERDUE";
            const isSettled = item.status === "SETTLED" || item.balanceDue === 0;

            return (
              <tr
                key={item.id}
                className="transition-colors hover:bg-surface-muted/40"
              >
                {/* Borrower / Contact */}
                <Td className="pl-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                        toneSoft[item.borrowerAvatarTone]
                      }`}
                    >
                      {item.borrowerInitials}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-ink">{item.borrowerName}</p>
                        {item.counterpartyUserId && (
                          <span
                            className="inline-flex items-center rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold text-accent"
                            title="Linked App Member (Auto-synced across accounts)"
                          >
                            Member
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted">
                        <span className="font-medium">{item.relationship}</span>
                        {item.contactNumber && (
                          <>
                            <span>•</span>
                            <span>{item.contactNumber}</span>
                          </>
                        )}
                      </div>
                      {item.notes && (
                        <p
                          className="mt-0.5 max-w-xs truncate text-[11px] text-muted"
                          title={item.notes}
                        >
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Td>

                {/* Dates */}
                <Td className="whitespace-nowrap">
                  <div>
                    <span className="text-muted">Lent: </span>
                    <span className="font-semibold text-ink">
                      {item.lentDate}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <span className="text-muted">Due: </span>
                    <span
                      className={`font-semibold ${
                        isOverdue ? "text-bad" : "text-ink"
                      }`}
                    >
                      {item.dueDate}
                    </span>
                  </div>
                </Td>

                {/* Disbursed Account */}
                <Td className="whitespace-nowrap">
                  <span className="rounded-lg bg-surface-muted px-2 py-1 font-medium text-ink">
                    {item.sourceAccount}
                  </span>
                  {item.interestRate ? (
                    <span className="ml-1 text-[10px] text-muted">
                      ({item.interestRate}% p.a.)
                    </span>
                  ) : null}
                </Td>

                {/* Principal */}
                <Td align="right" className="tabular-nums font-semibold text-ink">
                  {formatINR(item.originalAmount, { decimals: false })}
                </Td>

                {/* Recovered */}
                <Td
                  align="right"
                  className="tabular-nums font-semibold text-good"
                >
                  {formatINR(item.recoveredAmount, { decimals: false })}
                </Td>

                {/* Balance Due */}
                <Td
                  align="right"
                  className={`tabular-nums font-bold text-sm ${
                    isSettled
                      ? "text-muted"
                      : isOverdue
                        ? "text-bad"
                        : "text-accent"
                  }`}
                >
                  {formatINR(item.balanceDue, { decimals: false })}
                </Td>

                {/* Recovery Progress Bar */}
                <Td>
                  <div className="w-32 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-muted">
                      <span>{percent}%</span>
                      <span>
                        {item.repayments.length}{" "}
                        {item.repayments.length === 1 ? "repay" : "repays"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className={`h-full rounded-full ${
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
                </Td>

                {/* Status */}
                <Td className="whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </Td>

                {/* Quick Actions */}
                <Td align="right" className="pr-5 whitespace-nowrap">
                  <div className="relative inline-flex items-center gap-1.5">
                    {!isSettled && (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => onOpenRepayModal(item)}
                          className="h-8 gap-1 px-2.5 text-xs font-semibold"
                          title="Record payment"
                        >
                          <Check className="h-3.5 w-3.5 text-good" />
                          <span>Repay</span>
                        </Button>

                        <button
                          type="button"
                          onClick={() => onSendReminder(item)}
                          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-ink"
                          title="Send reminder"
                        >
                          <BellRing className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {isSettled && (
                      <span className="text-xs font-semibold text-good">
                        ✓ Cleared
                      </span>
                    )}

                    {/* Options toggle */}
                    {(!item.isCounterpartyView || !isSettled) && <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === item.id ? null : item.id,
                          )
                        }
                        className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-ink"
                        title="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === item.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-line bg-surface p-1 shadow-lg">
                            {!isSettled && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onMarkSettled(item);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-good hover:bg-good-soft"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Record Full Repayment</span>
                              </button>
                            )}

                            {!item.isCounterpartyView && <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                if (window.confirm(`Delete the loan record for ${item.borrowerName}? This cannot be undone.`)) {
                                  onDeleteLoan(item.id);
                                }
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-bad hover:bg-bad-soft"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete Record</span>
                            </button>}
                          </div>
                        </>
                      )}
                    </div>}
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
}
