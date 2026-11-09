"use client";

import React, { useState } from "react";
import { StagedTransactionRow, UpdateStagedTransactionDto } from "../types";

const AVAILABLE_CATEGORIES = [
  "Salary & Compensation",
  "Rent & Accommodation",
  "Food & Dining",
  "Investments (SIP)",
  "Vehicle & Fuel",
  "Bills & Utilities",
  "Transfer / Reversal",
  "Consulting & Advisory",
];

interface StagedTransactionsTableProps {
  rows: StagedTransactionRow[];
  updatingRowId: string | null;
  onToggleSelect: (id: string) => void;
  onUpdateRow: (id: string, dto: UpdateStagedTransactionDto) => void;
  onDeleteRow: (id: string) => void;
}

export function StagedTransactionsTable({
  rows,
  updatingRowId,
  onToggleSelect,
  onUpdateRow,
  onDeleteRow,
}: StagedTransactionsTableProps) {
  const [editingAmountRowId, setEditingAmountRowId] = useState<string | null>(
    null,
  );
  const [draftAmount, setDraftAmount] = useState<string>("");
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  const renderAuditStatusBadge = (row: StagedTransactionRow) => {
    switch (row.auditStatus) {
      case "VERIFIED_MATCH":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Verified Match</span>
          </span>
        );
      case "DUPLICATE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-700 px-2.5 py-0.5 text-[11px] font-bold text-white">
            <span>⚠</span>
            <span>Duplicate ({row.duplicateConfidence ?? 98}%)</span>
          </span>
        );
      case "NEEDS_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
            <span>?</span>
            <span>Assign Category</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Valid</span>
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/50">
            <th className="w-10 py-2.5 pl-4">
              <input
                type="checkbox"
                checked={rows.length > 0 && rows.every((r) => r.isSelected)}
                onChange={() => {
                  rows.forEach((r) => onToggleSelect(r.id));
                }}
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
              />
            </th>
            <th className="py-2.5 px-3">DATE &amp; TIME</th>
            <th className="py-2.5 px-3">STATEMENT NARRATION / ENTITY</th>
            <th className="py-2.5 px-3">CHANNEL &amp; UTR</th>
            <th className="py-2.5 px-3">ASSIGNED CATEGORY</th>
            <th className="py-2.5 px-3 text-right">AMOUNT (INR)</th>
            <th className="py-2.5 px-3 text-center">AUDIT STATUS</th>
            <th className="w-10 py-2.5 pr-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800/70">
          {rows.map((row) => {
            const isDuplicate = row.auditStatus === "DUPLICATE";
            const isNeedsReview =
              row.auditStatus === "NEEDS_REVIEW" || !row.category;
            const isUpdating = updatingRowId === row.id;

            return (
              <tr
                key={row.id}
                className={`transition ${
                  isDuplicate
                    ? "bg-rose-50/40 dark:bg-rose-950/15"
                    : isNeedsReview
                      ? "bg-indigo-50/30 dark:bg-indigo-950/15"
                      : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                } ${isUpdating ? "opacity-60" : ""}`}
              >
                {/* Checkbox */}
                <td className="py-3 pl-4">
                  <input
                    type="checkbox"
                    checked={row.isSelected}
                    onChange={() => onToggleSelect(row.id)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                  />
                </td>

                {/* Date & Time */}
                <td className="whitespace-nowrap py-3 px-3">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {row.date}
                  </div>
                  <div className="text-[10px] text-slate-400">{row.time}</div>
                </td>

                {/* Statement Narration / Entity */}
                <td className="py-3 px-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {row.entityName}
                    </span>
                    {row.isVerifiedEntity && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        ✓
                      </span>
                    )}
                    {row.isUnknownEntity && (
                      <span className="text-amber-500">!</span>
                    )}
                    {row.taxBadge && (
                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                        {row.taxBadge}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-slate-400">
                    {row.narration}
                  </div>
                </td>

                {/* Channel & UTR */}
                <td className="py-3 px-3">
                  <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {row.channel}
                  </span>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {row.utrNumber}
                  </div>
                </td>

                {/* Assigned Category -> Triggers PATCH /transactions/import/row/:id */}
                <td className="py-3 px-3">
                  <select
                    value={row.category ?? ""}
                    onChange={(e) =>
                      onUpdateRow(row.id, { category: e.target.value })
                    }
                    className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none transition ${
                      isNeedsReview
                        ? "border-indigo-400 bg-indigo-50/90 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300"
                        : row.type === "CREDIT"
                          ? "border-emerald-200 bg-emerald-50/70 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <option value="" disabled>
                      Select Category...
                    </option>
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Amount (INR) -> Clickable inline edit via PATCH /transactions/import/row/:id */}
                <td className="whitespace-nowrap py-3 px-3 text-right">
                  {editingAmountRowId === row.id ? (
                    <input
                      type="number"
                      step="0.01"
                      autoFocus
                      value={draftAmount}
                      onChange={(e) => setDraftAmount(e.target.value)}
                      onBlur={() => {
                        const parsed = parseFloat(draftAmount);
                        if (!Number.isNaN(parsed) && parsed !== row.amount) {
                          onUpdateRow(row.id, { amount: Math.abs(parsed) });
                        }
                        setEditingAmountRowId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const parsed = parseFloat(draftAmount);
                          if (!Number.isNaN(parsed) && parsed !== row.amount) {
                            onUpdateRow(row.id, { amount: Math.abs(parsed) });
                          }
                          setEditingAmountRowId(null);
                        } else if (e.key === "Escape") {
                          setEditingAmountRowId(null);
                        }
                      }}
                      className="w-24 rounded border border-indigo-400 bg-white px-1.5 py-0.5 text-right text-xs font-bold outline-none dark:bg-slate-800"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAmountRowId(row.id);
                        setDraftAmount(String(row.amount));
                      }}
                      title="Click to edit staged amount"
                      className={`font-bold ${
                        row.type === "CREDIT"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {row.type === "CREDIT" ? "+" : "-"}₹
                      {row.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </button>
                  )}

                  {row.closingBalance !== undefined && (
                    <div className="text-[10px] text-slate-400">
                      Bal: ₹
                      {row.closingBalance.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  )}
                </td>

                {/* Audit Status */}
                <td className="whitespace-nowrap py-3 px-3 text-center">
                  {renderAuditStatusBadge(row)}
                </td>

                {/* Row Actions Menu -> Triggers DELETE /transactions/import/row/:id */}
                <td className="relative py-3 pr-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuRowId((prev) =>
                        prev === row.id ? null : row.id,
                      )
                    }
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    aria-label="Row actions"
                  >
                    ⋮
                  </button>

                  {openMenuRowId === row.id && (
                    <div className="absolute right-4 z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white p-1 text-left shadow-lg dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAmountRowId(row.id);
                          setDraftAmount(String(row.amount));
                          setOpenMenuRowId(null);
                        }}
                        className="block w-full rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Edit Amount
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteRow(row.id);
                          setOpenMenuRowId(null);
                        }}
                        className="block w-full rounded px-2.5 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        Discard Row
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
