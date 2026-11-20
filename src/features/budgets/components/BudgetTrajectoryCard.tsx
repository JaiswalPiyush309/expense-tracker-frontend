"use client";

import { useId } from "react";
import { Card } from "@/components/ui/Card";
import type { TrajectoryPoint } from "../types";

interface BudgetTrajectoryCardProps {
  points: TrajectoryPoint[];
  mode: "CUMULATIVE" | "DAILY_OUTFLOW";
  onModeChange: (m: "CUMULATIVE" | "DAILY_OUTFLOW") => void;
  projectedClose: number;
  projectedSavings: number;
}

export function BudgetTrajectoryCard({
  points,
  mode,
  onModeChange,
  projectedClose,
  projectedSavings,
}: BudgetTrajectoryCardProps) {
  const gradientId = useId();

  // SVG Chart dimensions
  const width = 500;
  const height = 180;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxVal = 100000;
  const minVal = 0;

  const getX = (day: number) => padLeft + ((day - 1) / 29) * chartW;
  const getY = (val: number) =>
    padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Build Actual Burn path (Days 1 to 16)
  const actualPoints = points.filter((p) => p.actualBurn !== null);
  const actualPathD = actualPoints.reduce((acc, p, i) => {
    const x = getX(p.day);
    const y = getY(p.actualBurn!);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  // Area under curve
  const firstX = getX(actualPoints[0].day);
  const lastActual = actualPoints[actualPoints.length - 1];
  const lastX = getX(lastActual.day);
  const groundY = getY(0);
  const areaPathD = `${actualPathD} L ${lastX} ${groundY} L ${firstX} ${groundY} Z`;

  // Linear Plan path (Day 1 to 30)
  const planPathD = `M ${getX(1)} ${getY(0)} L ${getX(30)} ${getY(100000)}`;

  // Projected trajectory (from Day 16 to Day 30)
  const projectedPoints = points.filter(
    (p) => p.day >= 16 && p.projectedClose !== null,
  );
  const projectedPathD = projectedPoints.reduce((acc, p, i) => {
    const x = getX(p.day);
    const y = getY(p.projectedClose!);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  // Today marker (Day 16)
  const todayX = getX(16);
  const todayY = getY(62500);

  return (
    <Card className="flex flex-col justify-between p-5 shadow-card">
      <div>
        {/* Header with Mode Toggle & Metric */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-ink">
              Spending Pacing &amp; Run-rate Trajectory
            </h3>
            <p className="text-xs text-muted">
              Actual vs Planned Glidepath (April 2025)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Pills */}
            <div className="flex rounded-lg border border-line bg-surface-muted p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onModeChange("CUMULATIVE")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  mode === "CUMULATIVE"
                    ? "bg-surface text-ink shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Cumulative
              </button>
              <button
                type="button"
                onClick={() => onModeChange("DAILY_OUTFLOW")}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  mode === "DAILY_OUTFLOW"
                    ? "bg-surface text-ink shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                Daily Outflow
              </button>
            </div>

            <span className="text-sm font-bold text-ink">
              ₹{projectedClose.toLocaleString("en-IN")} Est.
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="mt-4 w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full overflow-visible"
            aria-label="Budget trajectory chart"
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Y Axis Gridlines */}
            {[0, 25000, 50000, 75000, 100000].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-400 text-[10px] font-medium"
                  >
                    ₹{val === 0 ? "0" : `${val / 1000}k`}
                  </text>
                </g>
              );
            })}

            {/* Today Dashed Line (Day 16) */}
            <line
              x1={todayX}
              y1={padTop}
              x2={todayX}
              y2={height - padBottom}
              stroke="currentColor"
              className="text-indigo-400 dark:text-indigo-500"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
            <text
              x={todayX}
              y={padTop - 4}
              textAnchor="middle"
              className="fill-indigo-600 text-[9px] font-bold dark:fill-indigo-400"
            >
              Today (Day 16)
            </text>

            {/* Linear Plan Line (Greenish / Slate) */}
            <path
              d={planPathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Projected Close Line (Dotted Purple) */}
            <path
              d={projectedPathD}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* Area under Actual Curve */}
            <path d={areaPathD} fill={`url(#${gradientId})`} />

            {/* Actual Burn Path */}
            <path
              d={actualPathD}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Today Point Marker */}
            <circle
              cx={todayX}
              cy={todayY}
              r="4.5"
              fill="#4f46e5"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Final Target Marker (Day 30) */}
            <circle
              cx={getX(30)}
              cy={getY(projectedClose)}
              r="3.5"
              fill="#10b981"
            />

            {/* X Axis Labels */}
            {[
              { day: 1, label: "01 Apr" },
              { day: 8, label: "08 Apr" },
              { day: 16, label: "16 Apr" },
              { day: 23, label: "23 Apr" },
              { day: 30, label: "30 Apr" },
            ].map((d) => (
              <text
                key={d.day}
                x={getX(d.day)}
                y={height - padBottom + 16}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-medium"
              >
                {d.label}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Legend & Footnote */}
      <div className="mt-4 border-t border-line pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-ink">
              <span className="h-0.5 w-3.5 bg-indigo-600 rounded-full" />
              Actual Burn (₹62,500)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-0.5 w-3.5 bg-emerald-500 rounded-full" />
              Linear Plan (₹53,300)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-indigo-400">
              <span className="h-0.5 w-3.5 border-t-2 border-dashed border-indigo-400" />
              Projected Close (₹{projectedClose.toLocaleString("en-IN")})
            </span>
          </div>

          <p className="font-semibold text-emerald-600 dark:text-emerald-400">
            Projected to save ₹{projectedSavings.toLocaleString("en-IN")} under budget
          </p>
        </div>
      </div>
    </Card>
  );
}
