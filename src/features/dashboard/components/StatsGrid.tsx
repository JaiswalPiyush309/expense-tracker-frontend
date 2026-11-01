import type { StatCardData } from "../types";
import { StatCard } from "./StatCard";

/**
 * Uses a container query (@container) so the column count follows the width
 * left over next to your sidebar, not the full viewport width.
 */
export function StatsGrid({ stats }: { stats: readonly StatCardData[] }) {
  return (
    <section aria-label="Financial summary" className="@container">
      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @5xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  );
}
