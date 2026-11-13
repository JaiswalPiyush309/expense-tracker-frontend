"use client";

import { useState } from "react";
import { PortfolioTimeRange } from "../types";

const TIME_RANGES: PortfolioTimeRange[] = [
  "1D",
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
  "3Y",
  "ALL",
];

export function PortfolioGrowthChartCard() {
  const [range, setRange] = useState<PortfolioTimeRange>("1Y");

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Portfolio Growth vs Benchmark
            </h3>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
              NIFTY 50
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Tracking capital addition against market index performance
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800">
          {TIME_RANGES.map((item) => {
            const active = range === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setRange(item)}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend & Alpha Pill */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span>Current Value (₹5.85L)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-slate-400" />
            <span>Invested (₹5.00L)</span>
          </span>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <span>⚡</span>
          <span>Benchmark Alpha: +4.2%</span>
        </span>
      </div>

      {/* SVG Dual Trajectory Chart with Floating Tooltip */}
      <div className="relative my-4 h-52 w-full">
        {/* Floating Tooltip Card matching screenshot */}
        <div className="absolute left-1/2 top-3 z-10 -translate-x-1/4 rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-md backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            📅 15 Apr 2025 (Latest Close)
          </div>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
            <div>
              <span className="text-slate-400">Value: </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                ₹5,85,000
              </span>
            </div>
            <div>
              <span className="text-slate-400">Invested: </span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                ₹5,00,000
              </span>
            </div>
            <div>
              <span className="text-slate-400">Net Gain: </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +₹85,000
              </span>
            </div>
            <div>
              <span className="text-slate-400">Alpha: </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +17.0%
              </span>
            </div>
          </div>
        </div>

        <svg
          viewBox="0 0 600 180"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="portfolioGrowthGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Horizontal Grid Lines */}
          {[35, 75, 115, 155].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
              className="dark:stroke-slate-800"
            />
          ))}

          {/* Area Fill under Current Value */}
          <path
            d="M 10 155 Q 110 140, 210 115 T 410 72 T 590 32 L 590 165 L 10 165 Z"
            fill="url(#portfolioGrowthGrad)"
          />

          {/* Invested Capital Dashed Line */}
          <path
            d="M 10 155 L 125 142 L 240 126 L 355 110 L 470 96 L 590 82"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="5 5"
          />

          {/* Current Portfolio Value Solid Line */}
          <path
            d="M 10 155 Q 110 140, 210 115 T 410 72 T 590 32"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Vertical Indicator Line at Latest Close */}
          <line
            x1="410"
            y1="72"
            x2="410"
            y2="165"
            stroke="#818cf8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle
            cx="410"
            cy="72"
            r="4.5"
            className="fill-white stroke-indigo-600"
            strokeWidth="2.5"
          />
          <circle
            cx="590"
            cy="32"
            r="5"
            className="fill-indigo-600 stroke-white"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* X-Axis Timeline Labels */}
      <div className="grid grid-cols-7 text-center text-[10px] font-medium text-slate-400">
        <span>May &apos;24</span>
        <span>Jul &apos;24</span>
        <span>Sep &apos;24</span>
        <span>Nov &apos;24</span>
        <span>Jan &apos;25</span>
        <span>Mar &apos;25</span>
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          Apr &apos;25 (Now)
        </span>
      </div>
    </div>
  );
}
