"use client";

import { KpiData } from "../api/investments-api";

interface Props {
  kpis: KpiData | null;
}

function fmt(n: number): string {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtGain(n: number): string {
  return `${n >= 0 ? "+" : ""}₹${fmt(Math.abs(n))}`;
}

export function InvestmentKpiGrid({ kpis }: Props) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-slate-100 h-28 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  const totalReturnsPositive = kpis.totalReturns >= 0;
  const todaysPnlPositive = (kpis.todaysPnl ?? 0) >= 0;
  const realizedPositive = kpis.realizedPnl >= 0;
  const unrealizedPositive = kpis.unrealizedPnl >= 0;

  const cards = [
    {
      id: "total-investment",
      label: "TOTAL INVESTMENT",
      iconSymbol: "🏛",
      iconColor: "text-slate-500",
      valuePrefix: null,
      value: `₹${fmt(kpis.totalInvestment)}`,
      valueColor: "text-slate-900 dark:text-white",
      sublineText: `${kpis.activePositionsCount} Active Positions`,
      sublineColor: "text-slate-500 dark:text-slate-400",
      footerText: "Avg Deployed Cap",
      footerPill: false,
      footerPillTone: "slate" as const,
    },
    {
      id: "portfolio-value",
      label: "PORTFOLIO VALUE",
      iconSymbol: "📈",
      iconColor: "text-indigo-600",
      valuePrefix: null,
      value: `₹${fmt(kpis.portfolioValue)}`,
      valueColor: "text-slate-900 dark:text-white",
      sublineText: `${totalReturnsPositive ? "+" : ""}${kpis.totalInvestment > 0 ? (((kpis.portfolioValue - kpis.totalInvestment) / kpis.totalInvestment) * 100).toFixed(1) : "0.0"}% Net Worth`,
      sublineColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
      footerText: "Stored valuation",
      footerPill: true,
      footerPillTone: "emerald" as const,
    },
    {
      id: "total-returns",
      label: "TOTAL RETURNS",
      iconSymbol: "↗",
      iconColor: totalReturnsPositive ? "text-emerald-600" : "text-rose-600",
      valuePrefix: totalReturnsPositive ? "+" : "",
      value: `₹${fmt(Math.abs(kpis.totalReturns))}`,
      valueColor: totalReturnsPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400",
      sublineText: `${fmtGain(kpis.totalReturns)} All Time`,
      sublineColor: totalReturnsPositive
        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
        : "text-rose-600 dark:text-rose-400 font-semibold",
      footerText: "All Time P&L",
      footerPill: false,
      footerPillTone: "slate" as const,
    },
    {
      id: "todays-pnl",
      label: "TODAY'S P&L",
      iconSymbol: "⚡",
      iconColor: kpis.todaysPnl === null ? "text-slate-500" : todaysPnlPositive ? "text-emerald-600" : "text-rose-600",
      valuePrefix: null,
      value: kpis.todaysPnl === null ? "—" : fmtGain(kpis.todaysPnl),
      valueColor: kpis.todaysPnl === null ? "text-slate-500 dark:text-slate-400" : todaysPnlPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400",
      sublineText: kpis.todaysPnl === null ? "Live market data unavailable" : todaysPnlPositive ? "↗ Gainers today" : "↘ Loss today",
      sublineColor: kpis.todaysPnl === null ? "text-slate-500 dark:text-slate-400" : todaysPnlPositive
        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
        : "text-rose-600 dark:text-rose-400 font-semibold",
      footerText: kpis.todaysPnl === null ? "Requires market quote feed" : "Intraday",
      footerPill: false,
      footerPillTone: "slate" as const,
    },
    {
      id: "realized-pnl",
      label: "REALIZED P&L",
      iconSymbol: "🔒",
      iconColor: "text-slate-500",
      valuePrefix: realizedPositive ? "+" : "",
      value: `₹${fmt(Math.abs(kpis.realizedPnl))}`,
      valueColor: realizedPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400",
      sublineText: `${kpis.closedPositionsCount} Closed positions`,
      sublineColor: "text-slate-500 dark:text-slate-400",
      footerText: "Tax Booked",
      footerPill: false,
      footerPillTone: "slate" as const,
    },
    {
      id: "unrealized-pnl",
      label: "UNREALIZED P&L",
      iconSymbol: "◎",
      iconColor: "text-indigo-600",
      valuePrefix: unrealizedPositive ? "+" : "",
      value: `₹${fmt(Math.abs(kpis.unrealizedPnl))}`,
      valueColor: unrealizedPositive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-rose-600 dark:text-rose-400",
      sublineText: `${kpis.activePositionsCount} Active Positions`,
      sublineColor: unrealizedPositive
        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
        : "text-rose-600 dark:text-rose-400 font-semibold",
      footerText: `${kpis.activePositionsCount} Active Positions`,
      footerPill: false,
      footerPillTone: "slate" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((kpi) => (
        <div
          key={kpi.id}
          className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {kpi.label}
              </span>
              <span className={`text-xs ${kpi.iconColor}`}>{kpi.iconSymbol}</span>
            </div>

            {kpi.valuePrefix && (
              <div className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                {kpi.valuePrefix}
              </div>
            )}

            <div
              className={`${kpi.valuePrefix ? "mt-0" : "mt-2"} flex items-baseline tracking-tight`}
            >
              <span className={`text-lg font-bold ${kpi.valueColor}`}>
                {kpi.value}
              </span>
            </div>

            <div className={`mt-1 text-[11px] ${kpi.sublineColor ?? "text-slate-500"}`}>
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
