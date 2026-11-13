"use client";

import { INVESTMENT_KPI_METRICS } from "../data/mock-data";

export function InvestmentKpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {INVESTMENT_KPI_METRICS.map((kpi) => (
        <div
          key={kpi.id}
          className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {kpi.label}
              </span>
              <span className={`text-xs ${kpi.iconColor}`}>
                {kpi.iconSymbol}
              </span>
            </div>

            {kpi.valuePrefix && (
              <div className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                {kpi.valuePrefix}
              </div>
            )}

            <div
              className={`${
                kpi.valuePrefix ? "mt-0" : "mt-2"
              } flex items-baseline tracking-tight`}
            >
              <span className={`text-lg font-bold ${kpi.valueColor}`}>
                {kpi.value}
              </span>
              {kpi.valueSuffix && (
                <span className="text-xs font-semibold text-slate-400">
                  {kpi.valueSuffix}
                </span>
              )}
            </div>

            <div
              className={`mt-1 text-[11px] ${
                kpi.sublineColor ?? "text-slate-500"
              }`}
            >
              {kpi.sublineText}
            </div>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2 dark:border-slate-800/80">
            {kpi.footerPill ? (
              kpi.footerPillTone === "slate" ? (
                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {kpi.footerText}
                </span>
              ) : (
                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {kpi.footerText}
                </span>
              )
            ) : (
              <span className="inline-block rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {kpi.footerText}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
