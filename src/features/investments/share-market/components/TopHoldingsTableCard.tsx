"use client";

import { useHoldings } from "../hooks/useShareMarketSummary";

const AVATAR_COLORS = [
  "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
];

function fmt(n: number): string {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function TopHoldingsTableCard() {
  const { data: holdings, isLoading, error } = useHoldings();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Top Portfolio Holdings
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {holdings
              ? `Showing top ${holdings.length} active equity holdings weighted by value`
              : "Active equity holdings weighted by value"}
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View All Holdings →
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-4 text-sm text-rose-600 dark:text-rose-400">
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
              <th className="py-3 pl-5 pr-3">STOCK NAME &amp; SYMBOL</th>
              <th className="py-3 px-3">CLASS</th>
              <th className="py-3 px-3 text-right">QTY</th>
              <th className="py-3 px-3 text-right">AVG BUY (₹)</th>
              <th className="py-3 px-3 text-right">INVESTED (₹)</th>
              <th className="py-3 px-3 text-right">CURRENT VALUE (₹)</th>
              <th className="py-3 px-3 text-right">UNREALIZED P&amp;L</th>
              <th className="py-3 px-3 text-right">TOTAL RETURNS</th>
              <th className="py-3 pr-5 pl-3 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs dark:divide-slate-800/70">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 pl-5 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
                      <div className="space-y-1">
                        <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800" />
                        <div className="h-2.5 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="py-3.5 px-3">
                      <div className="ml-auto h-3 w-14 rounded bg-slate-100 dark:bg-slate-800" />
                    </td>
                  ))}
                  <td className="py-3.5 pr-5 pl-3" />
                </tr>
              ))}

            {holdings?.map((stock, idx) => {
              const avatarClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
              const initials = stock.tickerSymbol.slice(0, 2).toUpperCase();
              const totalQty = stock.deliveryQuantity + stock.mtfQuantity;
              const pnlPositive = stock.unrealizedPnl >= 0;
              const retPositive = stock.totalReturnsPercent >= 0;

              return (
                <tr
                  key={stock.id}
                  className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  {/* Stock Name & Symbol */}
                  <td className="py-3.5 pl-5 pr-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${avatarClass}`}
                      >
                        {initials}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {stock.name}
                        </div>
                        <div className="text-[10px] font-semibold uppercase text-slate-400">
                          {stock.tickerSymbol}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Asset Class */}
                  <td className="py-3.5 px-3">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {stock.assetClass}
                    </span>
                  </td>

                  {/* Qty */}
                  <td className="py-3.5 px-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {totalQty}
                  </td>

                  {/* Avg Buy */}
                  <td className="py-3.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    {fmt(stock.averagePrice)}
                  </td>

                  {/* Invested */}
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {fmt(stock.investedAmount)}
                  </td>

                  {/* Current Value */}
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {fmt(stock.currentValue)}
                  </td>

                  {/* Unrealized P&L */}
                  <td
                    className={`py-3.5 px-3 text-right font-bold ${
                      pnlPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {pnlPositive ? "+" : ""}₹
                    {fmt(Math.abs(stock.unrealizedPnl))}
                  </td>

                  {/* Total Returns Pill */}
                  <td className="py-3.5 px-3 text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        retPositive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                      }`}
                    >
                      {retPositive ? "+" : ""}
                      {stock.totalReturnsPercent.toFixed(2)}%
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div>
          {holdings ? (
            <>
              Top {holdings.length} aggregate value:{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                ₹
                {holdings
                  .reduce((s, h) => s + h.currentValue, 0)
                  .toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </strong>
            </>
          ) : (
            "Loading holdings…"
          )}
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
