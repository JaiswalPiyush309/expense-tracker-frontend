"use client";

import { MARKET_INDICES_QUOTES, SECTOR_TREND_PILLS } from "../data/mock-data";

export function MarketIndicesTickerCard() {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            Indian Major Market Indices
          </h3>
          <span className="text-[11px] text-slate-400">
            — Live NSE/BSE Feeds
          </span>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View Market Watch →
        </button>
      </div>

      {/* 6 Index Quote Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {MARKET_INDICES_QUOTES.map((idx) => (
          <div
            key={idx.id}
            className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {idx.name}
              </span>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                LIVE
              </span>
            </div>

            <div className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
              {idx.value}
            </div>

            <div
              className={`mt-0.5 text-[10px] font-semibold ${
                idx.isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {idx.changeText}
            </div>
          </div>
        ))}
      </div>

      {/* Sector Trend Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          ▤ SECTOR TREND
        </span>

        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {SECTOR_TREND_PILLS.map((sec) => (
            <div
              key={sec.id}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                sec.isPositive
                  ? "bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "bg-rose-50/80 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
              }`}
            >
              <span>{sec.sector}</span>
              <span className="font-bold">{sec.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
