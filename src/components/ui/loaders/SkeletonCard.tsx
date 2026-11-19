"use client";

/**
 * SkeletonCard — Animated shimmer skeleton for cards, tables, and list rows.
 *
 * Variants:
 *  - "kpi"      → 6-column KPI strip skeleton
 *  - "chart"    → tall chart card skeleton
 *  - "table"    → table with N skeleton rows
 *  - "activity" → activity feed with icon + text rows
 *  - "card"     → generic single card skeleton
 *
 * Usage:
 *   <SkeletonCard variant="kpi" />
 *   <SkeletonCard variant="table" rows={5} />
 *   <SkeletonCard variant="activity" rows={3} />
 */

import { cn } from "@/lib/cn";
import type { CSSProperties } from "react";

type SkeletonVariant = "kpi" | "chart" | "table" | "activity" | "card" | "account";

interface SkeletonCardProps {
  variant?: SkeletonVariant;
  /** Number of rows (for table / activity variants) */
  rows?: number;
  className?: string;
}

/** Base shimmer bar */
function Shimmer({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        "animate-pulse rounded-lg",
        "bg-surface-muted dark:bg-surface-muted",
        className,
      )}
    />
  );
}

// ── KPI Strip ─────────────────────────────────────────────────────────────────
function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between">
            <Shimmer className="h-2.5 w-20" />
            <Shimmer className="h-5 w-5 rounded-full" />
          </div>
          <Shimmer className="h-6 w-28 mt-1" />
          <Shimmer className="h-2.5 w-16" />
          <div className="mt-2 border-t border-line pt-2">
            <Shimmer className="h-5 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Chart Card ─────────────────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div
      className="rounded-2xl border border-line bg-surface p-5 shadow-card"
      aria-hidden="true"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Shimmer className="h-4 w-48" />
          <Shimmer className="h-3 w-36" />
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Shimmer key={i} className="h-7 w-9 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-6">
        <Shimmer className="h-3 w-28" />
        <Shimmer className="h-3 w-24" />
        <Shimmer className="ml-auto h-5 w-36 rounded-full" />
      </div>

      {/* Chart area */}
      <div className="relative mt-4 h-52 w-full overflow-hidden rounded-xl bg-surface-muted">
        {/* Animated gradient sweep */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(var(--accent-soft-rgb, 237 240 255) / 0.5) 50%, transparent 100%)",
            animation: "ledger-shimmer-sweep 1.6s ease-in-out infinite",
          }}
        />
        {/* Faint bars suggest a chart */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-2 px-4 pb-4">
          {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t opacity-20"
              style={{
                height: `${h}%`,
                background: "var(--accent)",
              }}
            />
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Shimmer key={i} className="h-2.5 w-full" />
        ))}
      </div>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
      aria-hidden="true"
    >
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-line px-5 py-4">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="ml-auto h-4 w-28" />
      </div>

      {/* Column heads */}
      <div className="flex items-center gap-4 border-b border-line bg-surface-muted px-5 py-3">
        {[200, 60, 80, 90, 90, 100, 100, 90, 90, 60].map((w, i) => (
          <Shimmer key={i} className="h-2.5 shrink-0 rounded" style={{ width: w }} />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-line px-5 py-3.5 last:border-0"
        >
          {/* Avatar + name */}
          <div className="flex items-center gap-3" style={{ width: 200 }}>
            <Shimmer className="h-8 w-8 shrink-0 rounded-lg" />
            <div className="flex flex-col gap-1.5">
              <Shimmer className="h-3 w-28" />
              <Shimmer className="h-2.5 w-14" />
            </div>
          </div>
          {[60, 80, 90, 90, 100, 100, 90, 90, 60].map((w, j) => (
            <Shimmer key={j} className="h-3 shrink-0 rounded" style={{ width: w }} />
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <Shimmer className="h-3 w-48" />
        <Shimmer className="h-3 w-32" />
      </div>
    </div>
  );
}

// ── Activity Feed ─────────────────────────────────────────────────────────────
function ActivitySkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="rounded-2xl border border-line bg-surface p-5 shadow-card"
      aria-hidden="true"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Shimmer className="h-4 w-44" />
          <Shimmer className="h-3 w-36" />
        </div>
        <Shimmer className="h-4 w-24 rounded" />
      </div>

      {/* Rows */}
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-3 rounded-xl border border-line bg-surface-muted p-3"
          >
            <div className="flex items-start gap-3">
              <Shimmer className="mt-0.5 h-8 w-8 shrink-0 rounded-lg" />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Shimmer className="h-3 w-28" />
                  <Shimmer className="h-4 w-10 rounded" />
                </div>
                <Shimmer className="h-2.5 w-44" />
                <Shimmer className="h-2.5 w-24" />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Shimmer className="h-3 w-20" />
              <Shimmer className="h-2.5 w-14" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-3 w-40" />
      </div>
    </div>
  );
}

// ── Generic Card ──────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Shimmer className="h-4 w-40" />
          <Shimmer className="h-3 w-28" />
        </div>
        <Shimmer className="h-6 w-6 rounded-full" />
      </div>
      <Shimmer className="h-32 w-32 rounded-full self-center" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Account Cards Grid ────────────────────────────────────────────────────────
function AccountSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl border-l-4 border-l-accent border border-line bg-surface p-5 shadow-card"
          aria-hidden="true"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Shimmer className="h-11 w-11 shrink-0 rounded-xl" />
                <div className="flex flex-col gap-1.5">
                  <Shimmer className="h-4 w-32" />
                  <Shimmer className="h-3 w-24" />
                </div>
              </div>
              <Shimmer className="h-5 w-16 rounded-full" />
            </div>

            <div className="mt-5 rounded-xl bg-accent-soft/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-3 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <Shimmer className="h-3 w-24" />
                <Shimmer className="h-3 w-20" />
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div className="space-y-1.5">
                <Shimmer className="h-2.5 w-24" />
                <Shimmer className="h-7 w-36" />
              </div>
              <Shimmer className="h-6 w-16 rounded-full" />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
            <Shimmer className="h-3 w-20" />
            <div className="flex gap-2">
              <Shimmer className="h-7 w-7 rounded-lg" />
              <Shimmer className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function SkeletonCard({ variant = "card", rows, className }: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading…"
      className={cn("w-full", className)}
    >
      {variant === "kpi"      && <KpiSkeleton />}
      {variant === "chart"    && <ChartSkeleton />}
      {variant === "table"    && <TableSkeleton rows={rows} />}
      {variant === "activity" && <ActivitySkeleton rows={rows} />}
      {variant === "card"     && <CardSkeleton />}
      {variant === "account"  && <AccountSkeleton count={rows ?? 3} />}

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes ledger-shimmer-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%);  }
        }
      `}</style>
    </div>
  );
}
