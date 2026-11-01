import { KpiData } from "../types";
import { KpiCard } from "./KpiCard";

/** Container query: columns follow the space beside your sidebar, not the viewport. */
export function KpiGrid({ kpis }: { kpis: KpiData[] }) {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @5xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </div>
  );
}
