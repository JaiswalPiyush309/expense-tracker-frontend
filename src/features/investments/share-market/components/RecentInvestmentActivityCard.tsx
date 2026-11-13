"use client";

import { RECENT_INVESTMENT_ACTIVITY } from "../data/mock-data";

export function RecentInvestmentActivityCard() {
  const getBadgeStyle = (tone: "indigo" | "emerald" | "amber") => {
    switch (tone) {
      case "indigo":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";
      case "emerald":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";
      case "amber":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ↺ Recent Investment Activity
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Executions, cash dividends, and rebalancing logs
            </p>
          </div>

          <button
            type="button"
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Trade History →
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {RECENT_INVESTMENT_ACTIVITY.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800/80 dark:bg-slate-800/40"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${act.iconBg} ${act.iconColor}`}
                >
                  {act.iconSymbol}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {act.title}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${getBadgeStyle(
                        act.badgeTone,
                      )}`}
                    >
                      {act.badgeText}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {act.subtitle}
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {act.timestamp}
                  </div>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div
                  className={`text-xs font-bold ${
                    act.amountTone === "emerald"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {act.amountFormatted}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400">
                  {act.statusLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
        <span>Showing last 3 transactions</span>
        <button
          type="button"
          className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Download FY25-26 Statement
        </button>
      </div>
    </div>
  );
}
