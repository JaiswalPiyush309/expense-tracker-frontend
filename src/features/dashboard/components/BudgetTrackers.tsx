import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/cn";
import { toneText } from "@/lib/tone";
import type { BudgetItem } from "../types";

export function BudgetTrackers({ items }: { items: readonly BudgetItem[] }) {
  return (
    <section aria-labelledby="budget-trackers-title">
      <h3
        id="budget-trackers-title"
        className="text-[11px] font-semibold uppercase tracking-wider text-muted"
      >
        Top Budget Trackers
      </h3>

      <ul className="mt-3 space-y-4">
        {items.map((item) => {
          const hasLimit = Number.isFinite(item.limit) && item.limit > 0;
          const pct = hasLimit ? (item.spent / item.limit) * 100 : 0;
          return (
            <li key={item.id}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-xs font-semibold">
                <span className="text-ink">{item.label}</span>
                <span className={cn("tabular-nums", toneText[item.tone])}>
                  {formatINR(item.spent, { decimals: false })} /{" "}
                  {hasLimit
                    ? `${formatINR(item.limit, { decimals: false })} (${pct.toFixed(1)}%)`
                    : "No limit"}
                </span>
              </div>
              <ProgressBar
                value={pct}
                tone={item.tone}
                label={`${item.label} budget used`}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
