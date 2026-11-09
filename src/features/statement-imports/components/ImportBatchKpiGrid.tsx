"use client";

import React from "react";

interface ImportBatchKpiGridProps {
  stats: {
    totalRecords: number;
    readyCount: number;
    readyPercent: string;
    totalInflow: number;
    creditCount: number;
    totalOutflow: number;
    debitCount: number;
    duplicatesCount: number;
    needsReviewCount: number;
  };
}

export function ImportBatchKpiGrid({ stats }: ImportBatchKpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Total Records */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          TOTAL RECORDS
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalRecords}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            100% Parsed
          </span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-indigo-600" />
      </div>

      {/* 2. Ready to Import */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          READY TO IMPORT
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.readyCount}
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            {stats.readyPercent}%
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${stats.readyPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Total Inflow (CR) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          TOTAL INFLOW (CR)
        </div>
        <div className="mt-1.5 text-base font-bold text-emerald-600 dark:text-emerald-400">
          +₹
          {stats.totalInflow.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </div>
        <div className="mt-1 text-[10px] font-medium text-slate-400">
          {stats.creditCount} Credits
        </div>
      </div>

      {/* 4. Total Outflow (DR) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          TOTAL OUTFLOW (DR)
        </div>
        <div className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
          -₹
          {stats.totalOutflow.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </div>
        <div className="mt-1 text-[10px] font-medium text-slate-400">
          {stats.debitCount} Debits
        </div>
      </div>

      {/* 5. Duplicates Flagged */}
      <div className="rounded-xl border border-rose-200/80 bg-rose-50/30 p-3 shadow-2xs dark:border-rose-500/20 dark:bg-rose-950/10">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
          <span>DUPLICATES FLAGGED</span>
          <span className="h-2 w-2 rounded-full bg-rose-600" />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-700 dark:text-rose-400">
            {stats.duplicatesCount}
          </span>
          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
            Auto-Paused
          </span>
        </div>
        <div className="mt-2 h-1 w-2/3 rounded-full bg-rose-600" />
      </div>

      {/* 6. Needs Review */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>NEEDS REVIEW</span>
          <span className="font-bold">!</span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.needsReviewCount}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Category Fix
          </span>
        </div>
        <div className="mt-2 h-1 w-1/3 rounded-full bg-indigo-500" />
      </div>
    </div>
  );
}
