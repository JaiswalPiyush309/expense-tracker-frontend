"use client";

import { ArrowDownToLine, CalendarDays, Landmark, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { useIncomeAnalytics } from "../hooks/useIncomeAnalytics";

const currency = (value: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(value);

export function IncomeKpiGrid() {
  const { transactions, isLoading, error } = useIncomeAnalytics();
  const total = transactions.reduce((sum, item) => sum + Number(item.amount), 0);
  const average = transactions.length ? total / transactions.length : 0;
  const peak = transactions.reduce((best, item) => Number(item.amount) > Number(best?.amount ?? 0) ? item : best, transactions[0]);
  const categories = new Set(transactions.map((item) => item.category?.name).filter(Boolean));
  const accounts = new Set(transactions.map((item) => item.account?.id).filter(Boolean));
  const metrics = [
    { label: "Total recorded inflow", value: currency(total), detail: `${transactions.length} income transactions`, icon: ArrowDownToLine, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300" },
    { label: "Average transaction", value: currency(average), detail: "Across recorded income", icon: TrendingUp, tone: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/15 dark:text-indigo-300" },
    { label: "Largest transaction", value: currency(Number(peak?.amount ?? 0)), detail: peak?.merchant || peak?.category?.name || "No income recorded", icon: Wallet, tone: "text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-300" },
    { label: "Income transactions", value: String(transactions.length), detail: "All recorded income", icon: ReceiptText, tone: "text-violet-600 bg-violet-50 dark:bg-violet-500/15 dark:text-violet-300" },
    { label: "Income categories", value: String(categories.size), detail: "Categories used", icon: CalendarDays, tone: "text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300" },
    { label: "Receiving accounts", value: String(accounts.size), detail: "Accounts credited", icon: Landmark, tone: "text-cyan-600 bg-cyan-50 dark:bg-cyan-500/15 dark:text-cyan-300" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" aria-live="polite">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return <div key={metric.label} className="flex min-h-32 flex-col justify-between rounded-xl border border-line bg-white p-3.5 shadow-2xs dark:bg-slate-900">
          <div className="flex items-start justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-muted">{metric.label}</span><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${metric.tone}`}><Icon className="h-3.5 w-3.5" /></span></div>
          <div className="mt-2 text-lg font-bold tracking-tight text-ink">{isLoading ? "—" : error ? "—" : metric.value}</div>
          <div className="mt-1 truncate text-[11px] text-muted" title={error || metric.detail}>{error ? "Unable to load income" : metric.detail}</div>
        </div>;
      })}
    </div>
  );
}
