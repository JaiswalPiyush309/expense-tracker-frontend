"use client";

/**
 * Spinner — Lightweight inline loader for buttons, cards, and async states.
 *
 * Usage:
 *   <Spinner />                        — default accent, md size
 *   <Spinner size="sm" tone="muted" /> — small muted spinner
 *   <Spinner size="lg" tone="good" />  — large green spinner
 *   <Spinner label="Fetching data…" /> — custom aria-label
 */

import { cn } from "@/lib/cn";

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerTone = "accent" | "good" | "bad" | "muted" | "white";

interface SpinnerProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  label?: string;
  className?: string;
}

const sizeMap: Record<SpinnerSize, { px: number; stroke: number }> = {
  xs: { px: 14, stroke: 2 },
  sm: { px: 18, stroke: 2 },
  md: { px: 24, stroke: 2.5 },
  lg: { px: 36, stroke: 3 },
};

const toneColorMap: Record<SpinnerTone, string> = {
  accent: "var(--accent)",
  good:   "var(--good)",
  bad:    "var(--bad)",
  muted:  "var(--muted)",
  white:  "#ffffff",
};

export function Spinner({
  size = "md",
  tone = "accent",
  label = "Loading…",
  className,
}: SpinnerProps) {
  const { px, stroke } = sizeMap[size];
  const r = (px - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const color = toneColorMap[tone];

  return (
    <svg
      role="status"
      aria-label={label}
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      className={cn("animate-spin shrink-0", className)}
      style={{ animationDuration: "0.75s" }}
    >
      {/* Track */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        opacity={0.18}
      />
      {/* Arc */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
      />
    </svg>
  );
}
