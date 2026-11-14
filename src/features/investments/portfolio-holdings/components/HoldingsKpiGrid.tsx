"use client";

import { HOLDINGS_KPI_CARDS } from "../data/mock";
import { Card } from "@/components/ui/Card";

export function HoldingsKpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {HOLDINGS_KPI_CARDS.map((card) => (
        <Card
          key={card.id}
          className="flex flex-col justify-between p-4"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {card.label}
              </span>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${card.iconBg} ${card.iconColor}`}
              >
                {card.iconSymbol}
              </span>
            </div>

            <div
              className={`mt-2 text-xl font-bold tracking-tight ${card.valueColor}`}
            >
              {card.value}
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              {card.badgeText && (
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  {card.badgeText}
                </span>
              )}
              <span>{card.sublineText}</span>
            </div>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
            {card.progressPercent !== undefined ? (
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${card.progressPercent}%` }}
                />
                <div className="h-full w-[14%] bg-amber-400" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {card.footerDotColor && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${card.footerDotColor}`}
                  />
                )}
                <span>{card.footerText}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
