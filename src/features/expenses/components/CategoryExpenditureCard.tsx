"use client";

import React from "react";
import { ExpenseCategoryShare } from "../types";

interface CategoryExpenditureCardProps {
  shares: ExpenseCategoryShare[];
  total: number;
  activeCategoryFilter: string;
  onSelectCategory: (categoryMatch?: string) => void;
}

export function CategoryExpenditureCard({ shares, total, activeCategoryFilter, onSelectCategory }: CategoryExpenditureCardProps) {
  const formattedTotal = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(total);
  let offset = 0;
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><h3 className="text-base font-bold text-slate-900 dark:text-white">Category-wise Expenditure</h3><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Relative share of loaded expense outflows</p></div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">👆 <span>Click slice to filter table</span></span>
      </div>
      <div className="my-5 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center md:col-span-5">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="4.5" />
            {shares.map((share) => {
              const currentOffset = offset;
              offset += share.percentage;
              return <circle key={share.id} cx="18" cy="18" r="14" fill="none" stroke={share.strokeColor} strokeWidth="4.5" strokeDasharray={`${share.percentage} 100`} strokeDashoffset={`${-currentOffset}`} />;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">NET SPEND</span><span className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{formattedTotal}</span><span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{total > 0 ? "100% Loaded" : "No data"}</span></div>
        </div>
        <div className="space-y-3.5 md:col-span-7">
          {shares.length === 0 && <p className="text-xs text-slate-500">No expense categories returned by the backend.</p>}
          {shares.map((cat) => {
            const isSelected = activeCategoryFilter === cat.filterCategoryMatch;
            return <button key={cat.id} type="button" onClick={() => onSelectCategory(cat.filterCategoryMatch)} className={`block w-full rounded-xl p-1.5 text-left transition ${isSelected ? "bg-indigo-50/80 ring-1 ring-indigo-300 dark:bg-indigo-950/40 dark:ring-indigo-500/40" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}>
              <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200"><span className={`h-2.5 w-2.5 rounded-full ${cat.dotColorClass}`} /><span>{cat.name}</span></div><div className="flex items-center gap-2.5"><span className="font-bold text-slate-900 dark:text-white">{cat.amountFormatted}</span><span className="w-10 text-right text-[11px] font-medium text-slate-400">{cat.percentage.toFixed(1)}%</span></div></div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full ${cat.barColorClass}`} style={{ width: `${cat.percentage}%` }} /></div>
            </button>;
          })}
        </div>
      </div>
    </div>
  );
}
