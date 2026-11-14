"use client";

import type { PortfolioHoldingRow } from "../types";

interface ScripInspectorDrawerProps {
  scrip: PortfolioHoldingRow;
  onClose: () => void;
  detailsError: string | null;
  detailsLoading: boolean;
}

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ScripInspectorDrawer({
  scrip,
  onClose,
  detailsError,
  detailsLoading,
}: ScripInspectorDrawerProps) {
  const pnlColor = scrip.netGainAmount >= 0
    ? "text-emerald-700 dark:text-emerald-300"
    : "text-rose-700 dark:text-rose-300";

  return (
    <aside className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${scrip.initialsBg} ${scrip.initialsColor}`}>
            {scrip.initials}
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{scrip.companyName}</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{scrip.symbol} · {scrip.capCategory}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close holding details" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">✕</button>
      </div>

      <div className="border-b border-slate-100 py-3 dark:border-slate-800">
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{money(scrip.currentValue)}</div>
        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Stored current value · live market quote unavailable</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 py-3 text-xs">
        <Metric label="QUANTITY" value={String(scrip.qty)} detail={`Delivery ${scrip.freeDeliveryQty} · MTF ${scrip.mtfPledgedQty}`} />
        <Metric label="INVESTED" value={money(scrip.investedAmount)} detail={`Average cost ${money(scrip.avgPrice)}`} />
        <Metric label="PORTFOLIO WEIGHT" value={`${scrip.portfolioWeightPercent.toFixed(2)}%`} />
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="text-[10px] font-bold uppercase text-slate-400">UNREALIZED P&amp;L</div>
          <div className={`mt-1 font-bold ${pnlColor}`}>{money(scrip.netGainAmount)}</div>
          <div className={`mt-1 text-[10px] ${pnlColor}`}>{scrip.netGainPercent.toFixed(2)}%</div>
        </div>
      </div>

      <section className="border-t border-slate-100 pt-3 dark:border-slate-800">
        <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Recent transactions ({scrip.tradeOrders.length})
        </h3>
        {detailsError ? (
          <p className="text-[11px] text-rose-600 dark:text-rose-400">{detailsError}</p>
        ) : detailsLoading ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Loading transactions…</p>
        ) : scrip.tradeOrders.length === 0 ? (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">No recent transactions found.</p>
        ) : (
          <div className="space-y-2">
            {scrip.tradeOrders.map((tx) => (
              <div key={tx.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-[11px] dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">{tx.type}</span>
                  <span className="text-slate-500 dark:text-slate-400">{tx.date}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  {tx.type === "DIVIDEND" ? (
                    <span>Dividend income</span>
                  ) : (
                    <span>{tx.shares} units @ {money(tx.pricePerShare)}</span>
                  )}
                  <span>{money(tx.totalAmount)}</span>
                </div>
                <div className="mt-1 flex flex-wrap justify-between gap-x-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Charges &amp; taxes: {money(tx.chargesAndTaxes ?? 0)}</span>
                  {tx.realizedPnl != null && <span>Realized P&amp;L: {money(tx.realizedPnl)}</span>}
                </div>
                <div className="mt-1 text-[10px] text-slate-400">{tx.broker ?? ""}{tx.segment ? ` · ${tx.segment}` : ""}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="text-[10px] font-bold uppercase text-slate-400">{label}</div>
      <div className="mt-1 font-bold text-slate-900 dark:text-white">{value}</div>
      {detail && <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{detail}</div>}
    </div>
  );
}
