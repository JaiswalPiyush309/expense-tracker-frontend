"use client";

import React from "react";
import { PortfolioHoldingRow } from "../types";

interface ScripInspectorDrawerProps {
  scrip: PortfolioHoldingRow;
  onClose: () => void;
}

export function ScripInspectorDrawer({
  scrip,
  onClose,
}: ScripInspectorDrawerProps) {
  const isProfit = scrip.netGainAmount >= 0;
  const isDayPositive = scrip.dayChangePercent >= 0;

  // Position on 52W Low-to-High range bar
  const range52WPercent = Math.min(
    100,
    Math.max(
      5,
      Math.round(
        ((scrip.cmp - scrip.low52W) / (scrip.high52W - scrip.low52W)) * 100,
      ),
    ),
  );

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-4">
        {/* Top Scrip Header */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${scrip.initialsBg} ${scrip.initialsColor}`}
            >
              {scrip.initials}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {scrip.shortName}
                </h4>
                <span className="rounded bg-indigo-50 px-1.5 py-0.2 text-[9px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                  {scrip.exchange}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {scrip.sector} • {scrip.capCategory}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close inspector"
          >
            ✕
          </button>
        </div>

        {/* Live CMP & 52W Range Bar */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ₹
              {scrip.cmp.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                isDayPositive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
              }`}
            >
              {isDayPositive ? "↑ +" : "↓ "}
              {scrip.dayChangePercent.toFixed(2)}%
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
            <span>
              52W High:{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                ₹{scrip.high52W.toLocaleString("en-IN")}
              </strong>
            </span>
            <span>
              52W Low:{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                ₹{scrip.low52W.toLocaleString("en-IN")}
              </strong>
            </span>
          </div>

          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${range52WPercent}%` }}
            />
          </div>
        </div>

        {/* 2x2 Grid: Quantity (Free Delivery vs MTF Pledged) + Total Cost + Current Value + Net Gain */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Quantity Box with Delivery vs MTF Pledged Split */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                QUANTITY
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {scrip.qty}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-[10px]">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  Free (Delivery)
                </span>
                <span className="font-semibold">
                  {scrip.freeDeliveryQty} ({scrip.freeDeliveryPercent}%)
                </span>
              </div>

              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                <span className="inline-flex items-center gap-1">
                  <span>🔒</span>
                  <span>MTF Pledged</span>
                </span>
                <span className="font-semibold">
                  {scrip.mtfPledgedQty} ({scrip.mtfPledgedPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Total Cost Box */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-[10px] font-bold uppercase text-slate-400">
              TOTAL COST
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              ₹
              {scrip.investedAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 text-[10px] text-slate-400">
              Avg: ₹
              {scrip.avgPrice.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* Current Value Box */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-[10px] font-bold uppercase text-slate-400">
              CURRENT VALUE
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              ₹
              {scrip.currentValue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="mt-1 text-[10px] text-slate-400">
              Weight: {scrip.portfolioWeightPercent}%
            </div>
          </div>

          {/* Net Gain (P&L) Box */}
          <div
            className={`rounded-xl border p-2.5 ${
              isProfit
                ? "border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-500/20 dark:bg-emerald-950/20"
                : "border-rose-200/80 bg-rose-50/60 dark:border-rose-500/20 dark:bg-rose-950/20"
            }`}
          >
            <div
              className={`text-[10px] font-bold uppercase ${
                isProfit
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              }`}
            >
              NET GAIN (P&amp;L)
            </div>
            <div
              className={`mt-1 text-sm font-bold ${
                isProfit
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-rose-700 dark:text-rose-300"
              }`}
            >
              {isProfit ? "+" : "-"}₹
              {Math.abs(scrip.netGainAmount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div
              className={`mt-1 text-[10px] font-semibold ${
                isProfit
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {isProfit ? "+" : ""}
              {scrip.netGainPercent.toFixed(2)}% All Time
            </div>
          </div>
        </div>

        {/* 6-Month Trend Mini Chart */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">6-MONTH TREND</span>
            <span
              className={
                scrip.sixMonthTrendPercent >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }
            >
              {scrip.sixMonthTrendPercent >= 0 ? "+" : ""}
              {scrip.sixMonthTrendPercent}%
            </span>
          </div>

          <div className="mt-1.5 h-12 w-full rounded-xl bg-emerald-50/40 p-1.5 dark:bg-emerald-950/15">
            <svg
              viewBox="0 0 240 45"
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              <path
                d={scrip.trendPoints}
                fill="none"
                stroke={scrip.sixMonthTrendPercent >= 0 ? "#059669" : "#e11d48"}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Trade History (Orders) */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              TRADE HISTORY ({scrip.tradeOrders.length} ORDERS)
            </span>
            <button
              type="button"
              className="text-[10px] font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              All Trades
            </button>
          </div>

          <div className="space-y-2">
            {scrip.tradeOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-2.5 py-2 text-[11px] dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    {ord.type}
                  </span>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {ord.shares} shares
                    </div>
                    <div className="text-[10px] text-slate-400">{ord.date}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    @ ₹
                    {ord.pricePerShare.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ₹
                    {ord.totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target / Stoploss Alert */}
      <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
        {/* Active Alert Pill */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-1.5 text-[10px] font-bold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>1 Active Alert</span>
          </span>
          <span>
            T: ₹{scrip.targetAlertPrice.toLocaleString("en-IN")} SL: ₹
            {scrip.stopLossAlertPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Manage Target / Stoploss Alert Footer Button */}
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
        >
          <span>🔔 Manage Target / Stoploss Alert</span>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            ACTIVE
          </span>
        </button>
      </div>
    </div>
  );
}
