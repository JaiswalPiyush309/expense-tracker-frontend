import { cn } from "@/lib/cn";
import { toneBar, type Tone } from "@/lib/tone";

interface ProgressBarProps {
  /** 0-100 */
  value: number;
  tone?: Tone;
  label: string;
  className?: string;
}

export function ProgressBar({
  value,
  tone = "accent",
  label,
  className,
}: ProgressBarProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(100, Math.max(0, safeValue));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-accent-soft",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          toneBar[tone],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
