"use client";

import React from "react";
import { LedgerTransactionItem } from "../types";

interface MasterTransactionsTableProps {
  items: LedgerTransactionItem[];
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

function RowCounterpartyIcon({
  type,
}: {
  type: LedgerTransactionItem["iconType"];
}) {
  switch (type) {
    case "building":
      return <span>🏢</span>;
    case "utensils":
      return <span>🍴</span>;
    case "trend-up":
      return <span>📈</span>;
    case "transfer":
      return <span>⇄</span>;
    case "bag":
      return <span>🛍</span>;
    case "hand-coin":
      return <span>🤝</span>;
    case "refund":
      return <span>↩</span>;
    case "bank":
      return <span>🏛</span>;
    case "arrow-down-left":
      return <span>↙</span>;
    case "car":
      return <span>🚗</span>;
  }
}

export function MasterTransactionsTable({
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
}: MasterTransactionsTableProps) {
  const getTypeBadgeStyle = (tone: LedgerTransactionItem["typeTone"]) => {
    switch (tone) {
      case "emerald":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30";
      case "rose":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30";
      case "indigo":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30";
      case "blue":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Bulk Action & Sort Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={items.length > 0 && selectedIds.length === items.length}
              onChange={onToggleSelectAll}
              className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
            />
            <span>Select All ({selectedIds.length})</span>
          </label>

          <button
            type="button"
            disabled={selectedIds.length === 0}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800"
          >
            Export Selected
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800"
          >
            Categorize
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800"
          >
            Mark Verified
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="Date (Newest First)">Date (Newest First)</option>
            <option value="Amount (High to Low)">Amount (High to Low)</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
              <th className="w-10 py-3 pl-4">
                <input
                  type="checkbox"
                  checked={
                    items.length > 0 && selectedIds.length === items.length
                  }
                  onChange={onToggleSelectAll}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                />
              </th>
              <th className="py-3 px-3">DATE &amp; TIME</th>
              <th className="py-3 px-3">TRANSACTION &amp; COUNTERPARTY</th>
              <th className="py-3 px-3">TYPE</th>
              <th className="py-3 px-3">CATEGORY ENVELOPE</th>
              <th className="py-3 px-3">ACCOUNT / ROUTE</th>
              <th className="py-3 pr-4 pl-3">RAIL &amp; REF ID</th>
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
                  <td className="py-3.5 pl-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectRow(row.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                    />
                  </td>

                  {/* Date & Time */}
                  <td className="whitespace-nowrap py-3.5 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {row.date}
                    </div>
                    <div className="text-[11px] text-slate-400">{row.time}</div>
                  </td>

                  {/* Transaction & Counterparty */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${row.iconBg} ${row.iconColor}`}
                      >
                        <RowCounterpartyIcon type={row.iconType} />
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {row.title}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {row.subtitle}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="whitespace-nowrap py-3.5 px-3">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${getTypeBadgeStyle(
                        row.typeTone,
                      )}`}
                    >
                      {row.typeBadge}
                    </span>
                  </td>

                  {/* Category Envelope */}
                  <td className="whitespace-nowrap py-3.5 px-3">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${row.categoryDotColor}`}
                      />
                      <span>{row.categoryName}</span>
                    </div>
                  </td>

                  {/* Account / Route */}
                  <td className="whitespace-nowrap py-3.5 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {row.accountTitle}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {row.accountMask}
                    </div>
                  </td>

                  {/* Rail & Ref ID */}
                  <td className="whitespace-nowrap py-3.5 pr-4 pl-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {row.railName}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {row.railRef}
                    </div>
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
            1 to {items.length}
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
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800"
          >
            ‹
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
          {totalPages > 3 && <span className="px-1 text-slate-400">...</span>}
          {totalPages > 3 && <button type="button" onClick={() => onPageChange(totalPages)} className="h-7 w-7 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300">{totalPages}</button>}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
