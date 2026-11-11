"use client";

import React from "react";
import { ExpenseTransactionRow } from "../types";

interface ExpensesLedgerTableProps {
  items: ExpenseTransactionRow[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  totalPages: number;
}

function MerchantIcon({ type }: { type: ExpenseTransactionRow["iconType"] }) {
  switch (type) {
    case "utensils":
      return <span>🍴</span>;
    case "bag":
      return <span>🛍</span>;
    case "cloud":
      return <span>☁</span>;
    case "car":
      return <span>🚖</span>;
    case "fuel":
      return <span>⛽</span>;
    case "fitness":
      return <span>🏋️</span>;
    case "bolt":
      return <span>⚡</span>;
  }
}

export function ExpensesLedgerTable({
  items,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  sortBy,
  onSortChange,
  pageSize,
  onPageSizeChange,
  currentPage,
  onPageChange,
  totalItems,
  totalPages,
}: ExpensesLedgerTableProps) {
  return (
    <div className="space-y-3">
      {/* Top Controls Strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <input
            type="checkbox"
            checked={items.length > 0 && selectedIds.length === items.length}
            onChange={onToggleSelectAll}
            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
          />
          <span>Selected ({selectedIds.length})</span>
        </label>

        <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <span className="text-slate-400">⇅ Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 outline-none dark:text-slate-200"
          >
            <option value="Date (Newest)">Date (Newest)</option>
            <option value="Amount (Highest)">Amount (Highest)</option>
          </select>
        </div>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value={15}>15 per page</option>
          <option value={30}>30 per page</option>
        </select>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
                <th className="w-10 py-3.5 pl-4" />
                <th className="py-3.5 px-3">DATE &amp; TIMESTAMP</th>
                <th className="py-3.5 px-3">MERCHANT &amp; DESCRIPTION</th>
                <th className="py-3.5 px-3">CATEGORY ENVELOPE</th>
                <th className="py-3.5 px-3">PAYMENT RAIL / MODE</th>
                <th className="py-3.5 px-3">SOURCE ACCOUNT</th>
                <th className="py-3.5 px-3 text-center">RECEIPT</th>
                <th className="py-3.5 pr-5 pl-3 text-right">AMOUNT (INR)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800/70">
              {items.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 pl-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(row.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                      />
                    </td>

                    {/* Date & Timestamp */}
                    <td className="whitespace-nowrap py-4 px-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {row.date}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {row.time}
                      </div>
                    </td>

                    {/* Merchant & Description */}
                    <td className="py-4 px-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${row.iconBg} ${row.iconColor}`}
                        >
                          <MerchantIcon type={row.iconType} />
                        </span>
                        <div className="max-w-50">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {row.merchantTitle}
                          </div>
                          <div className="mt-0.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
                            {row.merchantSubtitle}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Envelope */}
                    <td className="whitespace-nowrap py-4 px-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100/80 px-3 py-1 text-[11px] font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${row.categoryDotColor}`}
                        />
                        <span>{row.categoryEnvelope}</span>
                      </span>
                    </td>

                    {/* Payment Rail / Mode */}
                    <td className="whitespace-nowrap py-4 px-3">
                      <div className="inline-flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {row.paymentRailType === "upi"
                            ? "⊞"
                            : row.paymentRailType === "card"
                              ? "💳"
                              : row.paymentRailType === "autodebit"
                                ? "↻"
                                : row.paymentRailType === "netbanking"
                                  ? "🏛"
                                  : "🧾"}
                        </span>
                        <span>{row.paymentRail}</span>
                      </div>
                    </td>

                    {/* Source Account */}
                    <td className="whitespace-nowrap py-4 px-3 font-medium text-slate-600 dark:text-slate-300">
                      {row.sourceAccount}
                    </td>

                    {/* Receipt Attachment */}
                    <td className="whitespace-nowrap py-4 px-3 text-center">
                      {row.hasReceipt ? (
                        <button
                          type="button"
                          title="View Attached Receipt"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                        >
                          📎
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">
                          —
                        </span>
                      )}
                    </td>

                    {/* Amount (INR) */}
                    <td className="whitespace-nowrap py-4 pr-5 pl-3 text-right text-sm font-bold text-rose-700 dark:text-rose-400">
                      -₹
                      {row.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div>
            Showing{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {items.length ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, totalItems)}` : "0"}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {totalItems}
            </span>{" "}
            recorded transactions
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-400 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
                  currentPage === p
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                {p}
              </button>
            ))}
            {totalPages > 3 && <><span className="px-1 text-slate-400">...</span><button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="h-7 w-7 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
            >
              {totalPages}
            </button></>}
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
