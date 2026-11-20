"use client";

import { useId } from "react";
import { Card } from "@/components/ui/Card";
import type { TrajectoryPoint } from "../types";

interface BudgetTrajectoryCardProps {
  points: TrajectoryPoint[];
  period: string;
  mode: "CUMULATIVE" | "DAILY_OUTFLOW";
  onModeChange: (m: "CUMULATIVE" | "DAILY_OUTFLOW") => void;
  projectedClose: number;
  projectedSavings: number;
}

export function BudgetTrajectoryCard({
  points,
  period,
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

  const maxDay = Math.max(points.length, 1);
  const rawMax = Math.max(
    0,
    ...points.map((point, index) => {
      const dailyPlan = point.linearPlan - (points[index - 1]?.linearPlan ?? 0);
      return Math.max(
        mode === "CUMULATIVE" ? point.actualBurn ?? 0 : point.dailyOutflow ?? 0,
        mode === "CUMULATIVE" ? point.linearPlan : dailyPlan,
        mode === "CUMULATIVE" ? point.projectedClose ?? 0 : 0,
      );
    }),
  );
  const maxVal = Math.max(1000, Math.ceil(rawMax / 4 / 1000) * 1000 * 4);
  const minVal = 0;

  const getX = (day: number) => padLeft + ((day - 1) / Math.max(1, maxDay - 1)) * chartW;
  const getY = (val: number) =>
    padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Build Actual Burn path (Days 1 to 16)
  const actualPoints = points.filter((p) => p.actualBurn !== null);
  const actualPathD = actualPoints.reduce((acc, p, i) => {
    const x = getX(p.day);
    const y = getY(mode === "CUMULATIVE" ? p.actualBurn! : p.dailyOutflow ?? 0);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const groundY = getY(0);
  const firstActual = actualPoints[0];
  const lastActual = actualPoints[actualPoints.length - 1];
  const areaPathD = firstActual && lastActual
    ? `${actualPathD} L ${getX(lastActual.day)} ${groundY} L ${getX(firstActual.day)} ${groundY} Z`
    : "";
  const planPathD = points.length > 0
    ? `M ${getX(1)} ${getY(mode === "CUMULATIVE" ? 0 : points[0].linearPlan)} L ${getX(maxDay)} ${getY(points[maxDay - 1].linearPlan - (mode === "CUMULATIVE" ? 0 : points[maxDay - 2]?.linearPlan ?? 0))}`
    : "";

  // Projected trajectory (from Day 16 to Day 30)
  const projectedPoints = points.filter(
    (p) => mode === "CUMULATIVE" && p.projectedClose !== null,
  );
  const projectedPathD = projectedPoints.reduce((acc, p, i) => {
    const x = getX(p.day);
    const y = getY(mode === "CUMULATIVE" ? p.projectedClose! : p.dailyOutflow ?? 0);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const todayPoint = actualPoints[actualPoints.length - 1];
  const todayX = todayPoint ? getX(todayPoint.day) : 0;
  const todayY = todayPoint ? getY(mode === "CUMULATIVE" ? todayPoint.actualBurn! : todayPoint.dailyOutflow ?? 0) : 0;
  const xAxisDays = [...new Set([1, Math.round(maxDay * 0.25), Math.round(maxDay * 0.5), Math.round(maxDay * 0.75), maxDay])];

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
              Actual vs planned glidepath{period ? ` (${period})` : ""}
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
            {[0, 1, 2, 3, 4].map((step) => {
              const val = (maxVal / 4) * step;
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
                  ₹{val === 0 ? "0" : `${Math.round(val / 1000)}k`}
                  </text>
                </g>
              );
            })}

            {/* Today Dashed Line (Day 16) */}
            {todayPoint && <line
              x1={todayX}
              y1={padTop}
              x2={todayX}
              y2={height - padBottom}
              stroke="currentColor"
              className="text-indigo-400 dark:text-indigo-500"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />}
            {todayPoint && <text
              x={todayX}
              y={padTop - 4}
              textAnchor="middle"
              className="fill-indigo-600 text-[9px] font-bold dark:fill-indigo-400"
            >
              Through day {todayPoint.day}
            </text>}

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
            {todayPoint && <circle
              cx={todayX}
              cy={todayY}
              r="4.5"
              fill="#4f46e5"
              stroke="#ffffff"
              strokeWidth="2"
            />}

            {/* Final Target Marker (Day 30) */}
            {mode === "CUMULATIVE" && <circle
              cx={getX(maxDay)}
              cy={getY(projectedClose)}
              r="3.5"
              fill="#10b981"
            />}

            {/* X Axis Labels */}
            {xAxisDays.map((day) => (
              <text
                key={day}
                x={getX(day)}
                y={height - padBottom + 16}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-medium"
              >
                {points[day - 1]?.label ?? day}
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
              Actual Burn{todayPoint ? ` (₹${(mode === "CUMULATIVE" ? todayPoint.actualBurn ?? 0 : todayPoint.dailyOutflow ?? 0).toLocaleString("en-IN")})` : ""}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-0.5 w-3.5 bg-emerald-500 rounded-full" />
              Linear Plan
            </span>
            {mode === "CUMULATIVE" && <span className="flex items-center gap-1.5 font-medium text-indigo-400">
              <span className="h-0.5 w-3.5 border-t-2 border-dashed border-indigo-400" />
              Projected Close (₹{projectedClose.toLocaleString("en-IN")})
            </span>}
          </div>

          <p className="font-semibold text-emerald-600 dark:text-emerald-400">
            Projected to save ₹{projectedSavings.toLocaleString("en-IN")} under budget
          </p>
        </div>
      </div>
    </Card>
  );
}
