"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { CategoryShare } from "../types";

const SIZE = 160;
const R = 62;
const STROKE = 22;
const C = 2 * Math.PI * R;
const GAP = 2;

/** Colour for segment i comes from --chart-1..6 (see globals additions). */
const chartVar = (i: number) => `var(--chart-${(i % 6) + 1})`;
const chartBg = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
];

export function CategoryDonut({
  segments,
}: {
  segments: readonly CategoryShare[];
}) {
  const [activeId, setActiveId] = useState(segments[0]?.id);
  const active = segments.find((s) => s.id === activeId) ?? segments[0];

  if (segments.length === 0) {
    return (
      <div
        role="img"
        aria-label="Expense categories. No category data available."
        className="flex min-h-40 items-center justify-center text-sm text-muted"
      >
        No category data available.
      </div>
    );
  }

  let offset = 0;
  const arcs = segments.map((s, i) => {
    const len = (s.percent / 100) * C;
    const arc = {
      id: s.id,
      color: chartVar(i),
      dash: Math.max(len - GAP, 0),
      offset,
    };
    offset += len;
    return arc;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`Expense categories. ${segments.map((s) => `${s.name} ${s.percent}%`).join(", ")}`}
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
                activeId && activeId !== a.id ? "opacity-40" : "opacity-100",
              )}
            />
          ))}
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid place-content-center text-center"
        >
          <span className="text-xs font-medium text-muted">{active?.name}</span>
          <span className="text-xl font-bold text-ink">{active?.percent}%</span>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
        {segments.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onMouseEnter={() => setActiveId(s.id)}
              onFocus={() => setActiveId(s.id)}
              onClick={() => setActiveId(s.id)}
              aria-pressed={activeId === s.id}
              className="flex w-full items-center gap-2 rounded-md text-left text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span
                aria-hidden="true"
                className={cn("h-3 w-3 shrink-0 rounded-sm", chartBg[i % 6])}
              />
              <span className="truncate">
                {s.name} ({s.percent}%)
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
