import { cn } from "@/lib/cn";
import { chartBg, type ChartColor } from "@/lib/chartColors";
import { ProgressBar } from "./ProgressBar";

export interface MeterItem {
  id: string;
  label: string;
  /** Main figure on the right, e.g. "₹11,10,000". */
  value: string;
  /** Muted text after the value, e.g. "(86.4%)". */
  hint?: string;
  /** Bar fill, 0-100. */
  percent: number;
  color: ChartColor;
  /** Softer fill, for de-emphasised rows. */
  faded?: boolean;
}

interface MeterListProps {
  items: readonly MeterItem[];
  /** Show a coloured dot before each label. */
  dots?: boolean;
  className?: string;
}

/** Rows of "label ........ value (hint)" with a proportional bar underneath. */
export function MeterList({ items, dots = false, className }: MeterListProps) {
  return (
    <ul className={cn("space-y-3.5", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <div className="mb-1.5 flex items-start justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-ink">
              {dots && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    chartBg[item.color],
                  )}
                />
              )}
              {item.label}
            </span>
            <span className="shrink-0 text-right font-semibold tabular-nums text-ink">
              {item.value}
              {item.hint && (
                <span className="ml-1 font-medium text-muted">{item.hint}</span>
              )}
            </span>
          </div>
          <ProgressBar
            value={item.percent}
            label={`${item.label} share`}
            barClassName={cn(chartBg[item.color], item.faded && "opacity-50")}
            className="h-1.5"
          />
        </li>
      ))}
    </ul>
  );
}
