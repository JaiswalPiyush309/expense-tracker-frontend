"use client";

import { ASSET_ALLOCATION_ITEMS } from "../data/mock-data";

export function AssetAllocationCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Asset Allocation
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Market capitalization distribution
          </p>
        </div>
        <span className="text-slate-400">⚙</span>
      </div>

      {/* Center Donut Chart */}
      <div className="relative mx-auto my-4 flex h-36 w-36 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="4.5"
          />
          {/* Large Cap 48% */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="4.5"
            strokeDasharray="42.2 100"
            strokeDashoffset="0"
          />
          {/* Mid Cap 26.5% */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#059669"
            strokeWidth="4.5"
            strokeDasharray="23.3 100"
            strokeDashoffset="-42.2"
          />
          {/* Small Cap 14.5% */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#34d399"
            strokeWidth="4.5"
            strokeDasharray="12.7 100"
            strokeDashoffset="-65.5"
          />
          {/* ETFs & Index 11% */}
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#818cf8"
            strokeWidth="4.5"
            strokeDasharray="9.8 100"
            strokeDashoffset="-78.2"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-bold text-slate-900 dark:text-white">
            ₹5.85L
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Total Capital
          </span>
        </div>
      </div>

      {/* Market Cap Breakdown Rows */}
      <div className="space-y-2 text-xs">
        {ASSET_ALLOCATION_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-0.5"
          >
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <span className={`h-2 w-2 rounded-full ${item.dotColorClass}`} />
              <span>{item.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white">
                {item.amountFormatted}
              </span>
              <span className="text-[11px] text-slate-400">
                {item.percentage}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Risk Profile Box */}
      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            🛡 Portfolio Risk Profile
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            Beta 0.88
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full w-3/5 rounded-full bg-linear-to-r from-emerald-500 via-indigo-500 to-amber-500" />
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
          <span>Conservative</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Optimal Diversification
          </span>
          <span>Aggressive</span>
        </div>
      </div>
    </div>
  );
}
