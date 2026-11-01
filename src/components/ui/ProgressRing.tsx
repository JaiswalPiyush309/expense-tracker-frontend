import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { toneStroke, type Tone } from "@/lib/tone";

interface ProgressRingProps {
  /** 0-100 */
  value: number;
  size?: number;
  stroke?: number;
  tone?: Tone;
  /** Accessible description, e.g. "Security score 92%". */
  label: string;
  /** Centre content. */
  children?: ReactNode;
  className?: string;
}

export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  tone = "good",
  label,
  children,
  className,
}: ProgressRingProps) {
  const safeSize = Number.isFinite(size) ? Math.max(1, size) : 56;
  const requestedStroke = Number.isFinite(stroke) ? stroke : 5;
  const safeStroke = Math.min(safeSize, Math.max(1, requestedStroke));
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(100, Math.max(0, safeValue));
  const r = (safeSize - safeStroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn("relative shrink-0", className)}
      style={{ width: safeSize, height: safeSize }}
    >
      <svg
        width={safeSize}
        height={safeSize}
        viewBox={`0 0 ${safeSize} ${safeSize}`}
        className="-rotate-90"
      >
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={r}
          fill="none"
          strokeWidth={safeStroke}
          className="stroke-line"
        />
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={r}
          fill="none"
          strokeWidth={safeStroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped / 100)}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none",
            toneStroke[tone],
          )}
        />
      </svg>
      {children && (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center text-xs font-bold text-ink"
        >
          {children}
        </span>
      )}
    </div>
  );
}
