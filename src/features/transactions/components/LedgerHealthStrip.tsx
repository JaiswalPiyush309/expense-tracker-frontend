"use client";

import React from "react";

import type { LedgerTransactionItem } from "../types";

export function LedgerHealthStrip({ items }: { items: LedgerTransactionItem[] }) {
  const inflow = items.filter((item) => item.direction === "IN").reduce((sum, item) => sum + item.amount, 0);
  const outflow = items.filter((item) => item.direction === "OUT").reduce((sum, item) => sum + item.amount, 0);
  const transfers = items.filter((item) => item.direction === "NEUTRAL").reduce((sum, item) => sum + item.amount, 0);
  const gross = inflow + outflow + transfers;
  const percent = (value: number) => gross ? `${((value / gross) * 100).toFixed(1)}%` : "0.0%";
  const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(value);
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs lg:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
      {/* Left: Ledger Health & Activity */}
      <div className="flex flex-col justify-between border-b border-slate-100 pb-3 lg:col-span-4 lg:border-r lg:border-b-0 lg:pr-4 lg:pb-0 dark:border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-400">LEDGER HEALTH &amp; ACTIVITY</span>
          <span className="text-emerald-600 dark:text-emerald-400">
            {items.length ? "Loaded" : "No activity"}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{items.length} Loaded</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>{items.filter((item) => item.status === "Pending").length} Pending</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>{items.filter((item) => item.status === "Flagged").length} Flagged</span>
          </span>
        </div>
      </div>

      {/* Right: Volume Distribution Progress Bar */}
      <div className="flex flex-col justify-between lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold">
          <span className="uppercase tracking-wider text-slate-400">
            VOLUME DISTRIBUTION ({money(gross)} GROSS FLOW)
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-emerald-600 dark:text-emerald-400">
              Inflow {money(inflow)} ({percent(inflow)})
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              Outflow {money(outflow)} ({percent(outflow)})
            </span>
            <span className="text-indigo-600 dark:text-indigo-400">
              Transfers {money(transfers)} ({percent(transfers)})
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-emerald-500" style={{ width: percent(inflow) }} />
          <div className="h-full bg-rose-500" style={{ width: percent(outflow) }} />
          <div className="h-full bg-indigo-600" style={{ width: percent(transfers) }} />
        </div>
      </div>
    </div>
  );
}
