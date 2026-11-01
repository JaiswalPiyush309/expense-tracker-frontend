import { smoothPath } from "@/lib/chart";
import { cn } from "@/lib/cn";
import { toneText, type Tone } from "@/lib/tone";

interface SparklineProps {
  data: number[];
  tone?: Tone;
  className?: string;
}

const W = 100;
const H = 32;
const PAD = 3;

/** Tiny decorative trend line. Put the meaning in nearby text, not here. */
export function Sparkline({ data, tone = "good", className }: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((v, i) => ({
    x: PAD + (i * (W - PAD * 2)) / Math.max(data.length - 1, 1),
    y: PAD + (1 - (v - min) / span) * (H - PAD * 2),
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn(
        "h-8 w-24 shrink-0 overflow-visible",
        toneText[tone],
        className,
      )}
    >
      <path
        d={smoothPath(points)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
