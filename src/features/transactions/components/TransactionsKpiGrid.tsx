"use client";

import React from "react";
import type { LedgerTransactionItem, TransactionsKpiItem } from "../types";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function TransactionsKpiGrid({ items }: { items: LedgerTransactionItem[] }) {
  const inflow = items
    .filter((item) => item.direction === "IN")
    .reduce((sum, item) => sum + item.amount, 0);
  const outflow = items
    .filter((item) => item.direction === "OUT")
    .reduce((sum, item) => sum + item.amount, 0);
  const transfers = items
    .filter((item) => item.direction === "NEUTRAL")
    .reduce((sum, item) => sum + item.amount, 0);
  const kpis: TransactionsKpiItem[] = [
    { id: "total-txns", label: "TOTAL TXNS", value: String(items.length), valueColor: "text-slate-900 dark:text-white", badgeText: "Loaded from ledger", badgeTone: "indigo", footerText: `${items.length} recorded transactions`, iconSymbol: "▤", iconTone: "indigo" },
    { id: "total-inflow", label: "TOTAL INFLOW", value: money.format(inflow), valueColor: "text-emerald-600 dark:text-emerald-400", badgeText: `${items.filter((item) => item.direction === "IN").length} income`, badgeTone: "emerald", footerText: "Income transactions", iconSymbol: "↓", iconTone: "emerald" },
    { id: "total-outflow", label: "TOTAL OUTFLOW", value: money.format(outflow), valueColor: "text-rose-600 dark:text-rose-400", badgeText: `${items.filter((item) => item.direction === "OUT").length} expenses`, badgeTone: "rose", footerText: "Expense transactions", iconSymbol: "↑", iconTone: "rose" },
    { id: "net-cash-flow", label: "NET CASH FLOW", value: money.format(inflow - outflow), valuePrefix: inflow >= outflow ? "+" : "", valueColor: inflow >= outflow ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400", badgeText: "Income minus expenses", badgeTone: inflow >= outflow ? "emerald" : "rose", footerText: "Excludes transfers", iconSymbol: "↗", iconTone: "emerald" },
    { id: "transfers", label: "TRANSFERS", value: money.format(transfers), valueColor: "text-slate-900 dark:text-white", badgeText: `${items.filter((item) => item.direction === "NEUTRAL").length} transfers`, badgeTone: "indigo", footerText: "Zero P&L impact", iconSymbol: "⇄", iconTone: "blue" },
    { id: "pending-due", label: "PENDING / DUE", value: money.format(0), valueColor: "text-slate-900 dark:text-white", badgeText: "No status in API", badgeTone: "amber", footerText: "Backend has no pending state", iconSymbol: "◷", iconTone: "amber" },
  ];
  const getBadgeToneClass = (tone: string) => {
    switch (tone) {
      case "emerald":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
      case "rose":
        return "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";
      case "indigo":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300";
      case "amber":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {kpi.label}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {kpi.iconSymbol}
              </span>
            </div>

            {kpi.valuePrefix && (
              <div className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {kpi.valuePrefix}
              </div>
            )}

            <div
              className={`${
                kpi.valuePrefix ? "mt-0" : "mt-2"
              } text-lg font-bold tracking-tight ${kpi.valueColor}`}
            >
              {kpi.value}
            </div>

            <div className="mt-1.5">
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${getBadgeToneClass(
                  kpi.badgeTone,
                )}`}
              >
                {kpi.badgeText}
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
            {kpi.footerText}
          </div>
        </div>
      ))}
    </div>
  );
}
