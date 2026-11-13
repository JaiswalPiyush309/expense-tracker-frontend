"use client";

import { INTELLIGENCE_INSIGHTS } from "../data/mock-data";

export function LedgerFlowIntelligenceCard() {
  const getBoxStyle = (tone: "emerald" | "indigo" | "slate") => {
    switch (tone) {
      case "emerald":
        return "border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-500/20 dark:bg-emerald-950/20";
      case "indigo":
        return "border-indigo-200/80 bg-indigo-50/60 dark:border-indigo-500/20 dark:bg-indigo-950/20";
      case "slate":
        return "border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40";
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ✨ LedgerFlow Intelligence
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Automated portfolio diagnostics and yield alerts
            </p>
          </div>

          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
            3 New
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {INTELLIGENCE_INSIGHTS.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-3.5 ${getBoxStyle(item.tone)}`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <span>{item.iconSymbol}</span>
                <span>{item.title}</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          ⚙ Rebalance Recommendations
        </span>
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
        >
          Review Rules
        </button>
      </div>
    </div>
  );
}
