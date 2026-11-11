"use client";

import React from "react";
import { ExpenseKpiMetric, ExpenseTransactionRow } from "../types";

function KpiIcon({ type }: { type: ExpenseKpiMetric["iconType"] }) {
  switch (type) {
    case "trend-down":
      return (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      );
    case "gauge":
      return (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 14l4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
      );
    case "alert":
      return <span className="text-xs font-extrabold">!</span>;
    case "receipt":
      return (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case "repeat":
      return (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case "calendar-alert":
      return (
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="12" y1="11" x2="12" y2="15" />
        </svg>
      );
  }
}

export function ExpensesKpiGrid({ items }: { items: ExpenseTransactionRow[] }) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const average = items.length ? total / items.length : 0;
  const peak = items.reduce((max, item) => item.amount > max.amount ? item : max, items[0]);
  const format = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
  const kpis: ExpenseKpiMetric[] = [
    { id: "total", label: "TOTAL EXPENSES", value: format(total), sublineText: `${items.length} expense transactions`, sublineColor: "text-slate-500", progressPercent: 100, progressColor: "bg-rose-600", footerLine1: "Loaded from backend ledger", iconType: "trend-down", iconBg: "bg-rose-50 dark:bg-rose-500/15", iconColor: "text-rose-600 dark:text-rose-400" },
    { id: "daily", label: "DAILY RUN-RATE", value: format(average), valueSuffix: "/txn", sublineText: "Average expense amount", progressPercent: 100, progressColor: "bg-indigo-600", footerLine1: "Calculated from loaded expenses", iconType: "gauge", iconBg: "bg-indigo-50 dark:bg-indigo-500/15", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "peak", label: "PEAK OUTFLOW", value: format(peak?.amount || 0), sublineText: peak?.merchantTitle || "No expenses loaded", sublineColor: "text-slate-700 dark:text-slate-300 font-semibold", footerLine1: peak ? `Paid on ${peak.date}` : "No transaction data", iconType: "alert", iconBg: "bg-slate-100 dark:bg-slate-800", iconColor: "text-slate-700 dark:text-slate-300" },
    { id: "count", label: "TOTAL TXNS", value: String(items.length), valueSuffix: " txns", sublineText: "Expense records", progressPercent: 100, progressColor: "bg-indigo-600", footerLine1: "Authenticated API data", iconType: "receipt", iconBg: "bg-emerald-50 dark:bg-emerald-500/15", iconColor: "text-emerald-600 dark:text-emerald-400" },
    { id: "recurring", label: "RECURRING MANDATES", value: "₹0.00", sublineText: "Not provided by transactions API", footerLine1: "Awaiting recurring endpoint", iconType: "repeat", iconBg: "bg-indigo-50 dark:bg-indigo-500/15", iconColor: "text-indigo-600 dark:text-indigo-400" },
    { id: "unsettled", label: "UNSETTLED BILLS", value: "₹0.00", valueColor: "text-rose-700 dark:text-rose-400", sublineText: "Not provided by transactions API", footerLine1: "Awaiting bill status endpoint", iconType: "calendar-alert", iconBg: "bg-rose-50 dark:bg-rose-500/15", iconColor: "text-rose-600 dark:text-rose-400" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {kpi.label}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${kpi.iconBg} ${kpi.iconColor}`}
              >
                <KpiIcon type={kpi.iconType} />
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline">
              <span
                className={`text-xl font-bold tracking-tight ${
                  kpi.valueColor ?? "text-slate-900 dark:text-white"
                }`}
              >
                {kpi.value}
              </span>
              {kpi.valueSuffix && (
                <span className="ml-0.5 text-xs font-medium text-slate-400">
                  {kpi.valueSuffix}
                </span>
              )}
            </div>

            <div
              className={`mt-1.5 text-[11px] font-medium ${
                kpi.sublineColor ?? "text-slate-500"
              }`}
            >
              {kpi.sublineText}
            </div>
          </div>

          <div className="mt-3 pt-2">
            {kpi.progressPercent !== undefined && (
              <div className="mb-2 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full ${kpi.progressColor ?? "bg-indigo-600"}`}
                  style={{ width: `${kpi.progressPercent}%` }}
                />
                {kpi.progressSecondaryPercent !== undefined && (
                  <div
                    className="h-full bg-emerald-600"
                    style={{ width: `${kpi.progressSecondaryPercent}%` }}
                  />
                )}
              </div>
            )}

            <div className="text-[11px] leading-snug text-slate-400 dark:text-slate-500">
              <div>{kpi.footerLine1}</div>
              {kpi.footerLine2 && (
                <div
                  className={
                    kpi.footerHighlightColor ??
                    "font-medium text-slate-500 dark:text-slate-400"
                  }
                >
                  {kpi.footerLine2}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
