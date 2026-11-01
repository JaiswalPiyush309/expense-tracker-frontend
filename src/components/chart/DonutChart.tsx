"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  chartBg,
  chartColorAt,
  chartVar,
  type ChartColor,
} from "@/lib/chartColors";

export interface DonutSegment {
  id: string;
  name: string;
  /** 0-100; all segments should add up to 100. */
  percent: number;
  /** 1-7, defaults to the segment's position. */
  color?: ChartColor;
  /** Extra text shown in the stacked legend, e.g. "₹17.64L". */
  detail?: string;
}

interface DonutChartProps {
  segments: readonly DonutSegment[];
  /** Fixed centre text. Without it the centre follows the hovered segment. */
  center?: { value: string; caption: string };
  /** "side": legend to the right (2 columns). "stacked": legend below, one row each. */
  variant?: "side" | "stacked";
}

const SIZE = 160;
const R = 62;
const STROKE = 22;
const C = 2 * Math.PI * R;
const GAP = 2;

export function DonutChart({
  segments,
  center,
  variant = "side",
}: DonutChartProps) {
  const [activeId, setActiveId] = useState<string | undefined>(
    center ? undefined : segments[0]?.id,
  );
  const activeIdInData = segments.some((s) => s.id === activeId)
    ? activeId
    : undefined;
  const active = segments.find((s) => s.id === activeIdInData) ?? segments[0];
  const stacked = variant === "stacked";
  const colorOf = (s: DonutSegment, i: number) => s.color ?? chartColorAt(i);
  const reset = () => {
    if (center) setActiveId(undefined);
  };

  const safePercent = (value: number) =>
    Number.isFinite(value) ? Math.max(0, value) : 0;
  const totalPercent = segments.reduce(
    (total, segment) => total + safePercent(segment.percent),
    0,
  );
  const percentScale = totalPercent > 0 ? 100 / totalPercent : 0;
  let offset = 0;
  const arcs = segments.map((s, i) => {
    const normalizedPercent = safePercent(s.percent) * percentScale;
    const len = (normalizedPercent / 100) * C;
    const arc = {
      id: s.id,
      color: chartVar(colorOf(s, i)),
      dash: Math.max(len - GAP, 0),
      offset,
    };
    offset += len;
    return arc;
  });

  return (
    <div
      className={cn(
        "flex items-center gap-6",
        stacked ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div
        className={cn("relative shrink-0", stacked ? "h-52 w-52" : "h-40 w-40")}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={
            segments.length > 0
              ? `Breakdown. ${segments
                  .map((s) => `${s.name} ${safePercent(s.percent)}%`)
                  .join(", ")}`
              : "No allocation data available"
          }
          className="h-full w-full"
        >
          {arcs.map((a) => (
            <circle
              key={a.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              strokeWidth={STROKE}
              strokeDasharray={`${a.dash} ${C - a.dash}`}
              strokeDashoffset={-a.offset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{ stroke: a.color }}
              className={cn(
                "transition-opacity duration-200",
                activeIdInData && activeIdInData !== a.id
                  ? "opacity-40"
                  : "opacity-100",
              )}
            />
          ))}
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid place-content-center text-center"
        >
          {center ? (
            <>
              <span className="text-lg font-bold text-ink">{center.value}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                {center.caption}
              </span>
            </>
          ) : (
            <>
              {active ? (
                <>
                  <span className="text-xs font-medium text-muted">
                    {active.name}
                  </span>
                  <span className="text-xl font-bold text-ink">
                    {safePercent(active.percent)}%
                  </span>
                </>
              ) : (
                <span className="px-4 text-xs font-medium text-muted">
                  No data
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <ul
        onMouseLeave={reset}
        className={cn(
          "w-full text-sm",
          stacked ? "space-y-2.5" : "grid grid-cols-2 gap-x-4 gap-y-2.5",
        )}
      >
        {segments.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onMouseEnter={() => setActiveId(s.id)}
              onFocus={() => setActiveId(s.id)}
              onBlur={reset}
              aria-pressed={activeIdInData === s.id}
              aria-label={`${s.name}: ${safePercent(s.percent)}%${s.detail ? `, ${s.detail}` : ""}`}
              className="flex w-full items-center gap-2 rounded-md text-left text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-3 w-3 shrink-0 rounded-sm",
                  chartBg[colorOf(s, i)],
                )}
              />
              {stacked ? (
                <>
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {safePercent(s.percent)}%{s.detail ? ` (${s.detail})` : ""}
                  </span>
                </>
              ) : (
                <span className="truncate">
                  {s.name} ({safePercent(s.percent)}%)
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
