"use client";

import { useId, useState } from "react";
import { niceScale, smoothPath } from "@/lib/chart";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import type { CashFlowPoint } from "../types";

const W = 640;
const H = 300;
const PAD = { left: 16, right: 16, top: 20, bottom: 44 };

export function CashFlowChart({ points }: { points: readonly CashFlowPoint[] }) {
  const uid = useId().replace(/:/g, "");
  const [hovered, setHovered] = useState<number | null>(null);

  if (points.length === 0) {
    return (
      <div
        role="img"
        aria-label="Cash flow chart. No cash flow data available."
        className="flex min-h-72 items-center justify-center text-sm text-muted"
      >
        No cash flow data available.
      </div>
    );
  }

  const safePoints = points.map((point) => ({
    ...point,
    income: Number.isFinite(point.income) ? point.income : 0,
    expense: Number.isFinite(point.expense) ? point.expense : 0,
  }));

  const surplus = safePoints.map((p) => p.income - p.expense);
  const peak = surplus.indexOf(Math.max(...surplus));
  const active = Math.min(hovered ?? peak, safePoints.length - 1);

  const { hi, ticks } = niceScale(
    0,
    Math.max(...safePoints.map((p) => p.income), 1),
    3,
  );
  const plotH = H - PAD.top - PAD.bottom;
  const colW = (W - PAD.left - PAD.right) / safePoints.length;
  const cx = (i: number) => PAD.left + colW * (i + 0.5);
  const y = (v: number) => PAD.top + (1 - v / hi) * plotH;
  const baseline = PAD.top + plotH;
  const barW = Math.min(24, colW * 0.3);

  const lines = [
    { key: "income" as const, color: "var(--good)" },
    { key: "expense" as const, color: "var(--bad)" },
  ].map((s) => {
    const pts = safePoints.map((p, i) => ({ x: cx(i), y: y(p[s.key]) }));
    const line = smoothPath(pts);
    const area = `${line} L${pts[pts.length - 1].x},${baseline} L${pts[0].x},${baseline} Z`;
    return { ...s, pts, line, area };
  });

  const tip = points[active];
  const tipLeft = Math.min(80, Math.max(20, (cx(active) / W) * 100));
  const tipTop = (Math.min(y(tip.income), y(tip.expense)) / H) * 100;

  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-130">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="group"
          aria-label="Income versus expense and net surplus, per period"
          className="h-auto w-full"
        >
          <defs>
            {lines.map((s) => (
              <linearGradient
                key={s.key}
                id={`${uid}-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: s.color, stopOpacity: 0.2 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: s.color, stopOpacity: 0 }}
                />
              </linearGradient>
            ))}
          </defs>

          {ticks.slice(1).map((t) => (
            <line
              key={t}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-line"
              strokeDasharray="3 4"
            />
          ))}
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={baseline}
            y2={baseline}
            className="stroke-line"
          />

          {/* Net surplus bars */}
          {surplus.map((s, i) => (
            <rect
              key={`${safePoints[i].label}-${i}`}
              x={cx(i) - barW / 2}
              y={y(Math.max(s, 0))}
              width={barW}
              height={Math.max(baseline - y(Math.max(s, 0)), 0)}
              rx={3}
              style={{ fill: "var(--accent)" }}
              className={cn(
                "transition-opacity duration-200",
                i === active ? "opacity-100" : "opacity-20",
              )}
            />
          ))}

          {lines.map((s) => (
            <g key={s.key}>
              <path d={s.area} fill={`url(#${uid}-${s.key})`} />
              <path
                d={s.line}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ stroke: s.color }}
              />
              {s.pts.map((p, i) => (
                <circle
                key={`${safePoints[i].label}-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={i === active ? 5 : 4}
                  strokeWidth="2"
                  style={{ stroke: s.color, fill: "var(--surface)" }}
                />
              ))}
            </g>
          ))}

          {/* X labels */}
          {safePoints.map((p, i) => (
            <text
              key={`${p.label}-${i}`}
              x={cx(i)}
              y={H - 22}
              textAnchor="middle"
              fontSize="12"
              className={cn(
                "font-semibold",
                p.current
                  ? "fill-accent"
                  : i === active
                    ? "fill-ink"
                    : "fill-muted",
              )}
            >
              {p.label}
              {p.current && (
                <tspan x={cx(i)} dy="15">
                  (Current)
                </tspan>
              )}
            </text>
          ))}

          {/* Hover / focus targets, one per period */}
          {safePoints.map((p, i) => (
            <rect
              key={`${p.label}-${i}`}
              x={PAD.left + colW * i}
              y={0}
              width={colW}
              height={H}
              fill="transparent"
              tabIndex={0}
              role="img"
              aria-label={`${p.label}: income ${formatINR(p.income, { decimals: false })}, expenses ${formatINR(p.expense, { decimals: false })}, surplus ${formatINR(p.income - p.expense, { decimals: false })}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="outline-none"
            />
          ))}
        </svg>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-card"
          style={{ left: `${tipLeft}%`, top: `calc(${tipTop}% - 12px)` }}
        >
          <p className="font-bold text-ink">
            {tip.label}
            {active === peak && " (Peak)"}
          </p>
          <p className="text-good">
            In: {formatINR(tip.income, { decimals: false })}
          </p>
          <p className="text-bad">
            Out: {formatINR(tip.expense, { decimals: false })}
          </p>
          <p className="font-bold text-accent">
            Surplus: {formatINR(tip.income - tip.expense, { decimals: false })}
          </p>
        </div>
      </div>
    </div>
  );
}
