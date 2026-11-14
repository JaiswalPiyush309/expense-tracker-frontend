"use client";

import { AssetAllocationResponse } from "../api/investments-api";

interface Props {
  allocation: AssetAllocationResponse[] | null;
  totalValue: number | null;
}

const COLORS = ["#4f46e5", "#059669", "#34d399", "#818cf8", "#f59e0b"];

function formatIndian(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatTotalValue(n: number): string {
  if (n >= 1_00_000) {
    return `₹${(n / 1_00_000).toFixed(2)}L`;
  }
  return "₹" + n.toLocaleString("en-IN");
}

/** Circumference of r=14: 2π*14 ≈ 87.96 */
const CIRCUM = 87.96;

export function AssetAllocationCard({ allocation, totalValue }: Props) {
  // Build donut segments
  let offsetAccum = 0;
  const segments =
    allocation?.map((item, i) => {
      const dasharray = (item.percentage / 100) * CIRCUM;
      const dashoffset = -offsetAccum;
      offsetAccum += dasharray;
      return { ...item, dasharray, dashoffset, color: COLORS[i % COLORS.length] };
    }) ?? [];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Asset Allocation
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Distribution by recorded asset category
          </p>
        </div>
        <span className="text-slate-400">⚙</span>
      </div>

      {/* Center Donut Chart */}
      <div className="relative mx-auto my-4 flex h-36 w-36 items-center justify-center">
        {!allocation ? (
          <div className="animate-pulse h-full w-full rounded-full bg-slate-100 dark:bg-slate-800" />
        ) : (
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            {/* Track */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="4.5"
            />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={seg.color}
                strokeWidth="4.5"
                strokeDasharray={`${seg.dasharray} ${CIRCUM}`}
                strokeDashoffset={seg.dashoffset}
              />
            ))}
          </svg>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {totalValue !== null ? formatTotalValue(totalValue) : "—"}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Total Capital
          </span>
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-2 text-xs">
        {!allocation
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between py-0.5"
              >
                <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            ))
          : allocation.map((item, i) => (
              <div
                key={item.category}
                className="flex items-center justify-between py-0.5"
              >
                <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatIndian(item.value)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
      </div>

    </div>
  );
}
