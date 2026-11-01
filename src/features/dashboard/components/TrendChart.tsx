import { useId } from "react";
import { formatCompactINR } from "@/lib/format";
import type { TrendPoint } from "../types";

const W = 640;
const H = 260;
const PAD = { left: 56, right: 16, top: 12, bottom: 30 };

type Pt = { x: number; y: number };

/** "Nice" axis bounds, e.g. 78k..215k -> 50k..250k in steps of 50k. */
function niceScale(min: number, max: number, target = 4) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 0;
    max = 1;
  }

  if (min === max) {
    const padding = Math.abs(min) * 0.1 || 1;
    min -= padding;
    max += padding;
  }

  const span = max - min;
  const raw = span / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step =
    (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) *
    mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
  return { lo, hi, ticks };
}

/** Monotone cubic curve: smooth, but never overshoots the data. */
function smoothPath(p: Pt[]) {
  const n = p.length;
  if (n < 2) return "";
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1].x - p[i].x;
    m[i] = (p[i + 1].y - p[i].y) / dx[i];
  }
  const t: number[] = new Array(n);
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++)
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;

  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${p[i].x + h},${p[i].y + t[i] * h} ${p[i + 1].x - h},${p[i + 1].y - t[i + 1] * h} ${p[i + 1].x},${p[i + 1].y}`;
  }
  return d;
}

export function TrendChart({ points }: { points: readonly TrendPoint[] }) {
  const uid = useId().replace(/:/g, "");
  if (points.length === 0) {
    return (
      <div
        role="img"
        aria-label="Income versus expense trend. No trend data available."
        className="flex min-h-60 items-center justify-center text-sm text-muted"
      >
        No trend data available.
      </div>
    );
  }

  const safePoints = points.map((point) => ({
    ...point,
    income: Number.isFinite(point.income) ? point.income : 0,
    expense: Number.isFinite(point.expense) ? point.expense : 0,
  }));
  const all = safePoints.flatMap((p) => [p.income, p.expense]);
  const { lo, hi, ticks } = niceScale(Math.min(...all), Math.max(...all));

  const x = (i: number) =>
    PAD.left +
    (i * (W - PAD.left - PAD.right)) / Math.max(points.length - 1, 1);
  const y = (v: number) =>
    PAD.top + (1 - (v - lo) / (hi - lo)) * (H - PAD.top - PAD.bottom);
  const baseline = H - PAD.bottom;

  const series = [
    { key: "income" as const, color: "var(--good)" },
    { key: "expense" as const, color: "var(--bad)" },
  ].map((s) => {
    const pts = safePoints.map((p, i) => ({ x: x(i), y: y(p[s.key]) }));
    const line = smoothPath(pts);
    const area = `${line} L${pts[pts.length - 1].x},${baseline} L${pts[0].x},${baseline} Z`;
    return { ...s, pts, line, area };
  });

  const last = safePoints[safePoints.length - 1];
  const summary = `Income ${formatCompactINR(last.income)} and expenses ${formatCompactINR(last.expense)} in ${last.label}`;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Income versus expense trend. ${summary}.`}
        className="h-auto w-full min-w-120"
      >
        <defs>
          {series.map((s) => (
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
                style={{ stopColor: s.color, stopOpacity: 0.22 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: s.color, stopOpacity: 0 }}
              />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              className="stroke-line"
              strokeDasharray="3 4"
            />
            <text
              x={PAD.left - 10}
              y={y(tick) + 4}
              textAnchor="end"
              fontSize="11"
              className="fill-muted"
            >
              {formatCompactINR(tick)}
            </text>
          </g>
        ))}

        {series.map((s) => (
          <g key={s.key}>
            <path d={s.area} fill={`url(#${uid}-${s.key})`} />
            <path
              d={s.line}
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ stroke: s.color }}
            />
            <circle
              cx={s.pts[s.pts.length - 1].x}
              cy={s.pts[s.pts.length - 1].y}
              r="4.5"
              style={{ fill: s.color }}
            />
          </g>
        ))}

        {safePoints.map((p, i) => (
          <text
            key={`${p.label}-${i}`}
            x={x(i)}
            y={H - 8}
            textAnchor={
              i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"
            }
            fontSize="11"
            className={
              i === points.length - 1 ? "fill-ink font-semibold" : "fill-muted"
            }
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
