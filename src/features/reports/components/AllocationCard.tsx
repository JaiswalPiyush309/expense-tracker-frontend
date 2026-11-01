import { DonutChart } from "@/components/chart/DonutChart";
import type { DonutSegment } from "@/components/chart/DonutChart";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { toneSoft } from "@/lib/tone";

interface AllocationCardProps {
  segments: readonly DonutSegment[];
  assetsLabel: string;
  riskLabel: string;
  xirr: string;
  rebalancing: string;
  className?: string;
}

export function AllocationCard({
  segments,
  assetsLabel,
  riskLabel,
  xirr,
  rebalancing,
  className,
}: AllocationCardProps) {
  return (
    <Card className={cn("flex flex-col p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow="Diversification"
        title="Capital Class Allocation"
        actions={
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              toneSoft.neutral,
            )}
          >
            {riskLabel}
          </span>
        }
      />

      <div className="mt-6 flex-1">
        <DonutChart
          variant="stacked"
          segments={segments}
          center={{ value: assetsLabel, caption: "Assets" }}
        />
      </div>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted">
        <span>
          XIRR Annualized: <span className="text-good">{xirr}</span>
        </span>
        <span>Rebalancing: {rebalancing}</span>
      </footer>
    </Card>
  );
}
