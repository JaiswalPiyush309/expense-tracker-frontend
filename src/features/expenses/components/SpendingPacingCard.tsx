"use client";

import React, { useState } from "react";
import { PaymentRailShare, SpendingPacingGranularity } from "../types";

export function SpendingPacingCard({ paymentRailShares, pacingValues }: { paymentRailShares: PaymentRailShare[]; pacingValues: number[] }) {
  const [granularity, setGranularity] = useState<SpendingPacingGranularity>("Daily");
  const values = pacingValues.length ? pacingValues : [0];
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 400},${95 - (value / max) * 80}`).join(" ");
  const areaPath = `M ${points} L 400 105 L 0 105 Z`;

  return <div className="flex flex-col gap-4">
    <div className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2"><div><h3 className="text-base font-bold text-slate-900 dark:text-white">Spending Pacing &amp; Trend</h3><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Transaction amount trend from the backend ledger</p></div><div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800">{(["Daily", "Weekly"] as SpendingPacingGranularity[]).map((mode) => <button key={mode} type="button" onClick={() => setGranularity(mode)} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${granularity === mode ? "bg-white text-indigo-600 shadow-2xs dark:bg-slate-900 dark:text-indigo-400" : "text-slate-500"}`}>{mode}</button>)}</div></div>
      <div className="my-4"><div className="relative h-32 w-full"><div className="absolute right-0 top-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">MAX LOADED: ₹{max.toLocaleString("en-IN")}</div><svg viewBox="0 0 400 110" className="h-full w-full overflow-visible" preserveAspectRatio="none"><defs><linearGradient id="expensePacingGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" /><stop offset="100%" stopColor="#4f46e5" stopOpacity="0" /></linearGradient></defs><path d={areaPath} fill="url(#expensePacingGrad)" /><polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
      <div><div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400"><span>PAYMENT RAIL</span><span>VOLUME SHARE</span></div><div className="grid grid-cols-2 gap-2">{paymentRailShares.length === 0 && <p className="col-span-2 text-xs text-slate-500">No payment rail data returned.</p>}{paymentRailShares.map((rail) => <div key={rail.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-800/50"><span className="font-semibold text-slate-700 dark:text-slate-200">{rail.label}</span><span className="font-bold text-slate-900 dark:text-white">{rail.percentage}</span></div>)}</div></div>
    </div>
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-500/20 dark:bg-indigo-950/25"><div className="flex items-start gap-2.5"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">🛡</span><div><div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">ACCOUNTING STANDARD COMPLIANCE</div><p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">Only transactions marked as <strong className="text-slate-900 dark:text-white">EXPENSE</strong> are included here. Transfers and income remain excluded from expense totals.</p></div></div></div>
  </div>;
}
