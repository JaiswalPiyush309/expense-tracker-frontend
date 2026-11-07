"use client";

import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { useIncomeAnalytics } from "../hooks/useIncomeAnalytics";

const formatINR = (amount: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(amount);

export function IncomeSummaryBanner() {
  const { transactions, isLoading, error } = useIncomeAnalytics();
  const total = transactions.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-2.5 dark:border-indigo-500/20 dark:bg-indigo-950/20">
      <div className="flex items-center gap-2 text-xs">
        {isLoading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-indigo-500" /> : error ? <CircleAlert className="h-3.5 w-3.5 text-rose-500" /> : <span className="h-2 w-2 rounded-full bg-emerald-500" />}
        <span className="font-semibold text-slate-700 dark:text-slate-200">Total recorded inflow:</span>
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{isLoading ? "Loading…" : error ? "Unavailable" : formatINR(total)}</span>
        <span className="text-slate-500 dark:text-slate-400">{isLoading ? "" : error ? error : `across ${transactions.length} transactions`}</span>
      </div>
      {!isLoading && !error && <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400"><CheckCircle2 className="h-3.5 w-3.5" /><span>Synced from your income transactions</span></div>}
    </div>
  );
}
