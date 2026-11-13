"use client";

import { TOP_PORTFOLIO_HOLDINGS } from "../data/mock-data";

export function TopHoldingsTableCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Top Portfolio Holdings
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Showing top 5 of 14 active equity holdings weighted by value
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View All Holdings (14) →
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
              <th className="py-3 pl-5 pr-3">STOCK NAME &amp; SYMBOL</th>
              <th className="py-3 px-3">EXCH</th>
              <th className="py-3 px-3 text-right">QTY</th>
              <th className="py-3 px-3 text-right">AVG BUY (₹)</th>
              <th className="py-3 px-3 text-right">CMP (₹)</th>
              <th className="py-3 px-3 text-right">CURRENT VALUE (₹)</th>
              <th className="py-3 px-3 text-right">TODAY'S GAIN</th>
              <th className="py-3 px-3 text-right">UNREALIZED P&amp;L</th>
              <th className="py-3 px-3 text-right">TOTAL RETURNS</th>
              <th className="py-3 pr-5 pl-3 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800/70">
            {TOP_PORTFOLIO_HOLDINGS.map((stock) => (
              <tr
                key={stock.id}
                className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                {/* Stock Name & Symbol */}
                <td className="py-3.5 pl-5 pr-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${stock.initialsBg} ${stock.initialsColor}`}
                    >
                      {stock.initials}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {stock.companyName}
                      </div>
                      <div className="text-[10px] font-semibold uppercase text-slate-400">
                        {stock.symbol}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Exchange */}
                <td className="py-3.5 px-3">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {stock.exchange}
                  </span>
                </td>

                {/* Qty */}
                <td className="py-3.5 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                  {stock.qty}
                </td>

                {/* Avg Buy */}
                <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-400">
                  {stock.avgBuy.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* CMP */}
                <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                  {stock.cmp.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* Current Value */}
                <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                  {stock.currentValue.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* Today's Gain */}
                <td className="py-3.5 px-3 text-right">
                  <div className={`font-semibold ${stock.todaysGainAmount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {stock.todaysGainAmount >= 0 ? "+" : ""}₹
                    {Math.abs(stock.todaysGainAmount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className={`text-[10px] ${stock.todaysGainPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    ({stock.todaysGainPercent >= 0 ? "+" : ""}{stock.todaysGainPercent.toFixed(2)}%)
                  </div>
                </td>

                {/* Unrealized P&L */}
                <td className={`py-3.5 px-3 text-right font-bold ${stock.unrealizedPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {stock.unrealizedPnl >= 0 ? "+" : ""}₹
                  {Math.abs(stock.unrealizedPnl).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                {/* Total Returns Pill */}
                <td className="py-3.5 px-3 text-right">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${stock.totalReturnsPercent >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"}`}>
                    {stock.totalReturnsPercent >= 0 ? "+" : ""}{stock.totalReturnsPercent.toFixed(2)}%
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 pr-5 pl-3 text-center">
                  <button
                    type="button"
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    aria-label="Stock actions"
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div>
          Top 5 aggregate value:{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            ₹4,22,300 (72.2% of portfolio)
          </strong>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300"
          >
            Refresh Live Quotes
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-400">Auto-syncing every 30s</span>
        </div>
      </div>
    </div>
  );
}
