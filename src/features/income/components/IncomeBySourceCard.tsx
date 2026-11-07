"use client";

import { useMemo } from "react";
import { useIncomeAnalytics } from "../hooks/useIncomeAnalytics";

const COLORS = ["#10b981", "#4f46e5", "#0ea5e9", "#f59e0b", "#d946ef", "#f43f5e"];
const CIRCUMFERENCE = 2 * Math.PI * 14;
const currency = (value: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(value);

export function IncomeBySourceCard() {
  const { transactions, isLoading, error } = useIncomeAnalytics();
  const sources = useMemo(() => {
    const totals = new Map<string, { amount: number; color: string | null }>();
    transactions.forEach((transaction) => {
      const name = transaction.category?.name ?? "Uncategorized";
      const existing = totals.get(name);
      totals.set(name, {
        amount: (existing?.amount ?? 0) + Number(transaction.amount),
        color: transaction.category?.color ?? existing?.color ?? null,
      });
    });
    return [...totals.entries()]
      .map(([name, details], index) => ({ name, ...details, color: details.color || COLORS[index % COLORS.length] }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);
  const total = sources.reduce((sum, item) => sum + item.amount, 0);

  let offset = 0;
  const arcs = sources.map((source) => {
    const share = total > 0 ? (source.amount / total) * CIRCUMFERENCE : 0;
    const arc = { ...source, dashArray: `${share} ${CIRCUMFERENCE - share}`, dashOffset: -offset, percentage: total > 0 ? (source.amount / total) * 100 : 0 };
    offset += share;
    return arc;
  });

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-2xs dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div><h3 className="text-sm font-bold text-ink">Income by Source &amp; Category</h3><p className="mt-0.5 text-xs text-muted">Recorded income grouped by transaction category</p></div>
        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-center text-[10px] font-bold leading-tight text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{isLoading ? "Loading" : error ? "Unavailable" : currency(total)}<br />Recorded</span>
      </div>

      {isLoading ? <div className="my-8 text-center text-sm text-muted">Loading category breakdown…</div> : error ? <div role="alert" className="my-8 text-center text-sm text-bad">{error}</div> : sources.length === 0 ? <div className="my-8 text-center text-sm text-muted">No income transactions to group yet.</div> : (
        <div className="my-4 grid grid-cols-1 items-center gap-5 sm:grid-cols-12">
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center sm:col-span-5">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" role="img" aria-label={`Income category breakdown totaling ${currency(total)}`}>
              <circle cx="18" cy="18" r="14" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="4.2" />
              {arcs.map((arc) => <circle key={arc.name} cx="18" cy="18" r="14" fill="none" stroke={arc.color} strokeWidth="4.2" strokeDasharray={arc.dashArray} strokeDashoffset={arc.dashOffset} />)}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-[9px] font-bold uppercase tracking-wider text-muted">Income</span><span className="text-sm font-bold text-ink">{currency(total)}</span><span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{transactions.length} entries</span></div>
          </div>
          <div className="max-h-64 space-y-2.5 overflow-y-auto sm:col-span-7">
            {arcs.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-muted/40 px-3 py-2">
              <div className="flex min-w-0 items-start gap-2.5"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /><div className="min-w-0"><div className="truncate text-xs font-semibold text-ink">{item.name}</div><div className="text-[10px] text-muted">{item.percentage.toFixed(1)}% of total</div></div></div>
              <div className="shrink-0 text-xs font-bold text-ink">{currency(item.amount)}</div>
            </div>)}
          </div>
        </div>
      )}
    </div>
  );
}
