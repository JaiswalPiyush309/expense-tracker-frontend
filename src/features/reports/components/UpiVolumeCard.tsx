import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { UpiApp } from "../types";
import { MeterList } from "@/components/ui/MeterList";
import { formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";

const safePercent = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

const safeAmount = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

interface UpiVolumeCardProps {
  apps: readonly UpiApp[];
  averageTicket: number;
  reliability: string;
  className?: string;
}

export function UpiVolumeCard({
  apps,
  averageTicket,
  reliability,
  className,
}: UpiVolumeCardProps) {
  return (
    <Card className={cn("flex flex-col p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow="Payment Channels"
        title="UPI Apps Volume Share"
        actions={
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              toneSoft.neutral,
            )}
          >
            NPCI Rails
          </span>
        }
      />

      {apps.length > 0 ? (
        <MeterList
          dots
          className="mt-6"
          items={apps.map((app) => {
            const percent = safePercent(app.percent);
            const transactions = Number.isFinite(app.transactions)
              ? Math.max(0, app.transactions)
              : 0;
            return {
              id: app.id,
              label: app.label,
              value: `${percent}%`,
              hint: `(${transactions} transactions)`,
              percent,
              color: app.color,
            };
          })}
        />
      ) : (
        <p className="mt-6 rounded-xl bg-accent-soft/30 px-4 py-8 text-center text-sm text-muted">
          No UPI volume data available for this period.
        </p>
      )}

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 text-xs font-semibold">
        <span className="text-muted">
          Average UPI Ticket:{" "}
          <span className="text-ink">
            {formatINR(safeAmount(averageTicket), { decimals: false })}
          </span>
        </span>
        <span className="text-good">{reliability}</span>
      </footer>
    </Card>
  );
}
