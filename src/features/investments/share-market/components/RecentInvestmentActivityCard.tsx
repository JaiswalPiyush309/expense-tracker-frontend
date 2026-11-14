"use client";

import { RecentActivityItem } from "../api/investments-api";
import Link from "next/link";

interface Props {
  activity: RecentActivityItem[] | null;
}

type BadgeTone = "indigo" | "emerald" | "amber";

function getBadgeTone(tradeType: string): BadgeTone {
  switch (tradeType.toUpperCase()) {
    case "BUY":
      return "indigo";
    case "SELL":
      return "amber";
    case "DIVIDEND":
      return "emerald";
    case "MTF_INTEREST":
      return "amber";
    default:
      return "indigo";
  }
}

function getBadgeStyle(tone: BadgeTone): string {
  switch (tone) {
    case "indigo":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";
    case "emerald":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";
    case "amber":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
  }
}

function getIconStyle(tone: BadgeTone): { bg: string; color: string; symbol: string } {
  switch (tone) {
    case "indigo":
      return {
        bg: "bg-indigo-50 dark:bg-indigo-500/15",
        color: "text-indigo-600 dark:text-indigo-300",
        symbol: "⇅",
      };
    case "emerald":
      return {
        bg: "bg-emerald-50 dark:bg-emerald-500/15",
        color: "text-emerald-600 dark:text-emerald-300",
        symbol: "🏦",
      };
    case "amber":
      return {
        bg: "bg-slate-100 dark:bg-slate-800",
        color: "text-slate-600 dark:text-slate-300",
        symbol: "◎",
      };
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function RecentInvestmentActivityCard({ activity }: Props) {
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

          <Link
            href="/investments/portfolio-holdings"
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Trade History →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {/* Skeleton rows when null */}
          {!activity &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800/80 dark:bg-slate-800/40"
              >
                <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-2.5 w-48 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-2 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="shrink-0 space-y-1 text-right">
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}

          {/* Real rows */}
          {activity?.map((act) => {
            const tone = getBadgeTone(act.tradeType);
            const icon = getIconStyle(tone);
            const tradeType = act.tradeType.toUpperCase();
            const amount = act.quantity * act.executionPrice;
            const amountValue = tradeType === "MTF_INTEREST"
              ? -act.chargesAndTaxes
              : tradeType === "SELL" && act.realizedPnl !== null
                ? act.realizedPnl
                : amount;
            const amountFormatted = `${amountValue > 0 ? "+" : amountValue < 0 ? "−" : ""}₹${Math.abs(amountValue).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
            const amountPositive =
              (tradeType === "SELL" && amountValue >= 0) ||
              tradeType === "DIVIDEND";

            return (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800/80 dark:bg-slate-800/40"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${icon.bg} ${icon.color}`}
                  >
                    {icon.symbol}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {act.tradeType} — {act.tickerSymbol}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${getBadgeStyle(tone)}`}
                      >
                        {act.tradeType}
                      </span>
                    </div>
                    {tradeType === "MTF_INTEREST" ? (
                      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Margin interest charge</div>
                    ) : (
                      <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {act.quantity} shares @ ₹{act.executionPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        {act.broker ? ` via ${act.broker}` : ""}
                      </div>
                    )}
                    {tradeType !== "MTF_INTEREST" && act.chargesAndTaxes > 0 && (
                      <div className="mt-0.5 text-[10px] text-slate-400">Charges &amp; taxes: ₹{act.chargesAndTaxes.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                    )}
                    <div className="mt-0.5 text-[10px] text-slate-400">
                      {formatDate(act.tradeDate)}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div
                    className={`text-xs font-bold ${
                      amountPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {amountFormatted}
                  </div>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    {tradeType === "SELL"
                      ? act.realizedPnl === null ? "Sell proceeds" : "Realized P&L"
                      : tradeType === "DIVIDEND"
                        ? "Dividend"
                        : tradeType === "MTF_INTEREST"
                          ? "Interest paid"
                          : "Trade value"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
        <span>Showing last {activity ? activity.length : "—"} transactions</span>
        <span>Transaction data from your broker ledger</span>
      </div>
    </div>
  );
}
