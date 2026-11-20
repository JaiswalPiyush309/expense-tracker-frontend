"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  MessageSquare,
  MoreVertical,
  Trash2,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, Td, Th } from "@/components/ui/Table";
import { formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";
import type { BorrowedLoanItem, BorrowedStatus } from "../types";

interface MoneyBorrowedTableCardProps {
  items: BorrowedLoanItem[];
  onOpenRepayModal: (item: BorrowedLoanItem) => void;
  onDeleteLoan: (id: string) => void;
  onNotifyLender: (item: BorrowedLoanItem) => void;
  onResetFilters: () => void;
}

function StatusBadge({ status }: { status: BorrowedStatus }) {
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

export function MoneyBorrowedTableCard({
  items,
  onOpenRepayModal,
  onDeleteLoan,
  onNotifyLender,
  onResetFilters,
}: MoneyBorrowedTableCardProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 shadow-card">
        <EmptyState
          icon={<Wallet className="h-8 w-8 text-muted" />}
          title="No borrowed money records found"
          description="You haven't recorded any personal borrowings matching the selected filters. Track debts or loans from friends, family, or institutions with full repayment tracking."
          action={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          }
        />
      </Card>
    );
  }

  const today = new Date();

  return (
    <Card className="overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="border-b border-line bg-surface-muted/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted">
              <Th className="py-3 pl-4 pr-3 sm:pl-6">Lender / Creditor</Th>
              <Th className="px-3 py-3 text-right">Principal Borrowed</Th>
              <Th className="px-3 py-3 text-right">Repaid to Date</Th>
              <Th className="px-3 py-3 text-right">Balance Payable</Th>
              <Th className="px-3 py-3">Schedule</Th>
              <Th className="px-3 py-3">Deposit Account</Th>
              <Th className="px-3 py-3 text-center">Status</Th>
              <Th className="py-3 pl-3 pr-4 text-right sm:pr-6">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-xs">
            {items.map((item) => {
              const isOverdue =
                item.status === "OVERDUE" ||
                (item.dueDate &&
                  new Date(item.dueDate) < today &&
                  item.balanceDue > 0);

              const percentRepaid =
                item.originalAmount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (item.repaidAmount / item.originalAmount) * 100,
                      ),
                    )
                  : 0;

              return (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-surface-muted/30"
                >
                  {/* Lender info */}
                  <Td className="py-3.5 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                          toneSoft[item.lenderAvatarTone]
                        }`}
                      >
                        {item.lenderInitials}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-ink">{item.lenderName}</p>
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

                  {/* Principal Borrowed */}
                  <Td className="px-3 py-3.5 text-right font-medium text-ink tabular-nums">
                    {formatINR(item.originalAmount, { decimals: false })}
                    {item.interestRate && item.interestRate > 0 ? (
                      <span className="block text-[10px] text-muted">
                        @{item.interestRate}% p.a.
                      </span>
                    ) : null}
                  </Td>

                  {/* Repaid */}
                  <Td className="px-3 py-3.5 text-right tabular-nums">
                    <span className="font-semibold text-good">
                      {formatINR(item.repaidAmount, { decimals: false })}
                    </span>
                    <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-muted">
                      <span>{percentRepaid}%</span>
                      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className="h-full rounded-full bg-good transition-all duration-300"
                          style={{ width: `${percentRepaid}%` }}
                        />
                      </div>
                    </div>
                  </Td>

                  {/* Balance Payable */}
                  <Td className="px-3 py-3.5 text-right tabular-nums">
                    <span
                      className={`font-bold ${
                        item.balanceDue === 0
                          ? "text-muted"
                          : isOverdue
                            ? "text-bad"
                            : "text-ink"
                      }`}
                    >
                      {formatINR(item.balanceDue, { decimals: false })}
                    </span>
                  </Td>

                  {/* Schedule */}
                  <Td className="px-3 py-3.5 text-muted">
                    <div className="space-y-0.5">
                      <p className="text-[11px]">
                        Borrowed:{" "}
                        <span className="font-medium text-ink">
                          {item.borrowedDate}
                        </span>
                      </p>
                      {item.dueDate ? (
                        <p
                          className={`text-[11px] ${
                            isOverdue
                              ? "font-semibold text-bad"
                              : "text-muted"
                          }`}
                        >
                          Due: {item.dueDate}
                          {isOverdue && " (Overdue)"}
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted">No due date</p>
                      )}
                    </div>
                  </Td>

                  {/* Receiving Account */}
                  <Td className="px-3 py-3.5 text-ink">
                    <span className="inline-flex rounded-lg bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-ink">
                      {item.receivingAccount}
                    </span>
                  </Td>

                  {/* Status */}
                  <Td className="px-3 py-3.5 text-center">
                    <StatusBadge
                      status={isOverdue ? "OVERDUE" : item.status}
                    />
                  </Td>

                  {/* Actions */}
                  <Td className="py-3.5 pl-3 pr-4 text-right sm:pr-6">
                    <div className="relative inline-flex items-center gap-1.5">
                      {item.balanceDue > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => onOpenRepayModal(item)}
                          className="gap-1 text-xs font-semibold"
                          title="Record repayment made to lender"
                        >
                          <Check className="h-3 w-3 text-good" />
                          <span>Make Payment</span>
                        </Button>
                      )}

                      {/* Dropdown Menu Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.id)}
                          className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-ink focus:outline-hidden"
                          aria-label="More actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Dropdown Floating Menu */}
                        {activeMenuId === item.id && (
                          <div
                            className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-line bg-surface p-1 shadow-lg"
                            onMouseLeave={() => setActiveMenuId(null)}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onNotifyLender(item);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-ink hover:bg-surface-muted"
                            >
                              <MessageSquare className="h-3.5 w-3.5 text-muted" />
                              <span>Notify Lender</span>
                            </button>

                            {item.balanceDue > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenRepayModal(item);
                                  setActiveMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-ink hover:bg-surface-muted"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-good" />
                                <span>Record Full Payment</span>
                              </button>
                            )}

                            <div className="my-1 border-t border-line" />

                            {!item.isCounterpartyView && <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                if (window.confirm(`Delete the borrowing record from ${item.lenderName}? This cannot be undone.`)) {
                                  onDeleteLoan(item.id);
                                }
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-bad hover:bg-bad-soft"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete Record</span>
                            </button>}
                          </div>
                        )}
                      </div>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}
