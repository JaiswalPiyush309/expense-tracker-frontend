"use client";

import React from "react";
import { PortfolioHoldingRow } from "../types";

interface HoldingsListTableProps {
  holdings: PortfolioHoldingRow[];
  selectedRowIds: string[];
  activeScripId: string | null;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onSelectScripForInspector: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function HoldingsListTable({
  holdings,
  selectedRowIds,
  activeScripId,
  onToggleSelectAll,
  onToggleSelectRow,
  onSelectScripForInspector,
  currentPage,
  onPageChange,
}: HoldingsListTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={
              holdings.length > 0 && selectedRowIds.length === holdings.length
            }
            onChange={onToggleSelectAll}
            className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
          />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Holdings List
          </h3>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            14 Scrips
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <span>▤</span>
            <span>Columns (10/10)</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <span>↓</span>
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
              <th className="w-9 py-3 pl-4" />
              <th className="py-3 px-2.5">COMPANY / STOCK</th>
              <th className="py-3 px-2 text-right">QTY</th>
              <th className="py-3 px-2.5 text-right">AVG (₹)</th>
              <th className="py-3 px-2.5 text-right">INVESTED (₹)</th>
              <th className="py-3 px-2.5 text-right">CMP (₹)</th>
              <th className="py-3 px-2.5 text-right">CUR. VALUE (₹)</th>
              <th className="py-3 pr-4 pl-2 text-right">NET P&amp;L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800/70">
            {holdings.map((row) => {
              const isChecked = selectedRowIds.includes(row.id);
              const isInspected = activeScripId === row.id;
              const isProfit = row.netGainAmount >= 0;

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectScripForInspector(row.id)}
                  className={`cursor-pointer transition ${
                    isInspected
                      ? "bg-indigo-50/60 dark:bg-indigo-950/25"
                      : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <td
                    className="py-3.5 pl-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelectRow(row.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                    />
                  </td>

                  {/* Company / Stock */}
                  <td className="py-3.5 px-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${row.initialsBg} ${row.initialsColor}`}
                      >
                        {row.initials}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {row.companyName}
                          </span>
                          {isInspected && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-semibold uppercase text-slate-400">
                          {row.symbol} • {row.exchange}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Qty */}
                  <td className="whitespace-nowrap py-3.5 px-2 text-right font-bold text-slate-800 dark:text-slate-200">
                    {row.qty}
                  </td>

                  {/* Avg (₹) */}
                  <td className="whitespace-nowrap py-3.5 px-2.5 text-right text-slate-500 dark:text-slate-400">
                    {row.avgPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  {/* Invested (₹) */}
                  <td className="whitespace-nowrap py-3.5 px-2.5 text-right text-slate-600 dark:text-slate-300">
                    {row.investedAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  {/* CMP (₹) */}
                  <td className="whitespace-nowrap py-3.5 px-2.5 text-right font-bold text-slate-900 dark:text-white">
                    {row.cmp.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  {/* Current Value (₹) */}
                  <td className="whitespace-nowrap py-3.5 px-2.5 text-right font-bold text-slate-900 dark:text-white">
                    {row.currentValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  {/* Net P&L */}
                  <td className="whitespace-nowrap py-3.5 pr-4 pl-2 text-right">
                    <div
                      className={`font-bold ${
                        isProfit
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isProfit ? "+" : "-"}₹
                      {Math.abs(row.netGainAmount).toLocaleString("en-IN", {
                        minimumFractionDigits: 0,
                      })}
                    </div>
                    <div
                      className={`text-[10px] font-semibold ${
                        isProfit
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      ({isProfit ? "+" : ""}
                      {row.netGainPercent.toFixed(2)}%)
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
        <div className="flex items-center gap-3">
          <span>
            Showing{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              1–{holdings.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-800 dark:text-slate-200">14</strong>{" "}
            holdings
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Total Portfolio Weight: 100%</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800"
          >
            ‹
          </button>
          {[1, 2].map((p) => (
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
          <button
            type="button"
            onClick={() => onPageChange(Math.min(2, currentPage + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
