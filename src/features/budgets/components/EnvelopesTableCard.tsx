"use client";

import { useState } from "react";
import {
  Activity,
  Car,
  Eye,
  Home,
  Pencil,
  RotateCw,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { formatINR } from "@/lib/format";
import type { BudgetEnvelope, BudgetStatus } from "../types";

interface EnvelopesTableCardProps {
  envelopes: BudgetEnvelope[];
  totalMasterAllocated: number;
  onEditEnvelope: (env: BudgetEnvelope) => void;
  onOpenReallocate: () => void;
}

function getEnvelopeIcon(iconName: string) {
  switch (iconName) {
    case "Home":
      return Home;
    case "ShoppingCart":
      return ShoppingCart;
    case "Utensils":
      return Utensils;
    case "Car":
      return Car;
    case "Zap":
      return Zap;
    case "Activity":
      return Activity;
    case "ShoppingBag":
      return ShoppingBag;
    case "Ticket":
      return Ticket;
    default:
      return Wallet;
  }
}

function TableStatusBadge({ status }: { status: BudgetStatus }) {
  switch (status) {
    case "OVER_BUDGET":
      return (
        <span className="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
          Exceeded
        </span>
      );
    case "NEAR_LIMIT":
      return (
        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
          Near Limit
        </span>
      );
    case "ON_TRACK":
    case "HEALTHY":
    default:
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
          Healthy
        </span>
      );
  }
}

export function EnvelopesTableCard({
  envelopes,
  totalMasterAllocated,
  onEditEnvelope,
  onOpenReallocate,
}: EnvelopesTableCardProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedIds.size === envelopes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(envelopes.map((e) => e.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <Card className="overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="border-b border-line bg-surface-muted/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted">
              <Th className="w-10 py-3 pl-4 pr-2">
                <input
                  type="checkbox"
                  checked={
                    envelopes.length > 0 && selectedIds.size === envelopes.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-line text-indigo-600 focus:ring-indigo-500"
                  aria-label="Select all envelopes"
                />
              </Th>
              <Th className="py-3 px-3">Category Envelope</Th>
              <Th className="py-3 px-3">Period</Th>
              <Th className="py-3 px-3 text-right">Allocated Budget</Th>
              <Th className="py-3 px-3 text-right">Actual Spent</Th>
              <Th className="py-3 px-3 text-right">Remaining Balance</Th>
              <Th className="py-3 px-3">Utilization</Th>
              <Th className="py-3 px-3 text-center">Status</Th>
              <Th className="py-3 pl-3 pr-4 text-right">Action</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-xs">
            {envelopes.map((item) => {
              const Icon = getEnvelopeIcon(item.iconName);
              const isOver = item.status === "OVER_BUDGET";
              const isNear = item.status === "NEAR_LIMIT";
              const isSelected = selectedIds.has(item.id);

              return (
                <tr
                  key={item.id}
                  className={`group transition-colors hover:bg-surface-muted/30 ${
                    isSelected ? "bg-indigo-50/20 dark:bg-indigo-950/20" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <Td className="py-3.5 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(item.id)}
                      className="rounded border-line text-indigo-600 focus:ring-indigo-500"
                      aria-label={`Select ${item.name}`}
                    />
                  </Td>

                  {/* Category Envelope */}
                  <Td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                          isOver
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300"
                            : isNear
                              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-surface-muted text-ink dark:bg-slate-800"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold text-ink">{item.name}</p>
                        <p className="text-[11px] text-muted">
                          <span>{item.sublabel}</span>
                          <span className="mx-1">•</span>
                          <span>
                            {item.transactionCount} transaction
                            {item.transactionCount === 1 ? "" : "s"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Td>

                  {/* Period */}
                  <Td className="py-3.5 px-3 text-muted">
                    <div className="space-y-0.5 text-[11px]">
                      <p>01 Apr –</p>
                      <p>30 Apr 2025</p>
                    </div>
                  </Td>

                  {/* Allocated Budget */}
                  <Td className="py-3.5 px-3 text-right font-medium text-ink tabular-nums">
                    {formatINR(item.allocatedAmount, { decimals: true })}
                  </Td>

                  {/* Actual Spent */}
                  <Td className="py-3.5 px-3 text-right font-medium tabular-nums">
                    <span className={isOver ? "font-bold text-rose-600 dark:text-rose-400" : "text-ink"}>
                      {formatINR(item.actualSpent, { decimals: true })}
                    </span>
                  </Td>

                  {/* Remaining Balance */}
                  <Td className="py-3.5 px-3 text-right font-semibold tabular-nums">
                    {item.remainingBalance >= 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {formatINR(item.remainingBalance, { decimals: true })}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">
                        -{formatINR(Math.abs(item.remainingBalance), { decimals: true })}
                      </span>
                    )}
                  </Td>

                  {/* Utilization */}
                  <Td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-semibold text-ink">
                          {item.utilizationPercent}%
                        </span>
                        <span className="text-muted">
                          ₹{(item.actualSpent / 1000).toFixed(0)}k / ₹
                          {(item.allocatedAmount / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOver
                              ? "bg-rose-500"
                              : isNear
                                ? "bg-indigo-600"
                                : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${Math.min(100, item.utilizationPercent)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Td>

                  {/* Status */}
                  <Td className="py-3.5 px-3 text-center">
                    <TableStatusBadge status={item.status} />
                  </Td>

                  {/* Actions */}
                  <Td className="py-3.5 pl-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isOver && (
                        <button
                          type="button"
                          onClick={onOpenReallocate}
                          className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
                          title="Reallocate surplus funds to cover deficit"
                          aria-label="Reallocate funds"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onEditEnvelope(item)}
                        className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-ink"
                        title="Edit envelope cap"
                        aria-label="Edit envelope"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditEnvelope(item)}
                        className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-ink"
                        title="View details"
                        aria-label="View envelope details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Table Footer with Master Allocation & Pagination (Matching Screenshot 3) */}
      <div className="flex flex-col gap-2 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted">
        <div>
          Showing <span className="font-bold text-ink">{envelopes.length}</span>{" "}
          of <span className="font-bold text-ink">{envelopes.length}</span> total
          envelopes <span className="mx-1">|</span> Total Master Allocated:{" "}
          <strong className="text-ink">
            {formatINR(totalMasterAllocated, { decimals: true })}
          </strong>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-center">
          <button
            type="button"
            disabled
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted/60"
          >
            Previous
          </button>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-xs">
            1
          </span>
          <button
            type="button"
            disabled
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted/60"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}
