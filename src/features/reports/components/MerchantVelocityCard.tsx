import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { toneSoft, toneText } from "@/lib/tone";
import type { Merchant, VelocityStat } from "../types";

interface MerchantVelocityCardProps {
  peakNote: string;
  stats: readonly VelocityStat[];
  merchants: readonly Merchant[];
  className?: string;
}

export function MerchantVelocityCard({
  peakNote,
  stats,
  merchants,
  className,
}: MerchantVelocityCardProps) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow="Micro-Spending Velocity"
        title="Merchant Intensity & Daily Velocity"
        actions={
          <span
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              toneSoft.accent,
            )}
          >
            {peakNote}
          </span>
        }
      />

      {stats.length > 0 ? (
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="rounded-xl bg-accent-soft/50 p-4">
              <dt className="text-xs font-semibold text-muted">{stat.label}</dt>
              <dd className="mt-1">
                <span
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    stat.valueTone ? toneText[stat.valueTone] : "text-ink",
                  )}
                >
                  {formatINR(stat.value, { decimals: false })}
                </span>
                {stat.suffix && (
                  <span className="text-sm text-muted">{stat.suffix}</span>
                )}
                <p
                  className={cn(
                    "mt-0.5 text-xs font-medium",
                    toneText[stat.captionTone],
                  )}
                >
                  {stat.caption}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-5 rounded-xl bg-accent-soft/30 px-4 py-6 text-center text-sm text-muted">
          No velocity data available for this period.
        </p>
      )}

      <h3 className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted">
        Top Merchants (Last 6 Months)
      </h3>

      {merchants.length > 0 ? (
        <ol className="space-y-2" aria-label="Top merchants by spending">
          {merchants.map((m, i) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-xl bg-accent-soft/30 px-3 py-2.5"
            >
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-sm font-bold text-accent"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{m.name}</p>
                <p className="truncate text-xs text-muted">{m.category}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold tabular-nums text-ink">
                  {formatINR(m.amount, { decimals: false })}
                </p>
                <p className="text-xs text-muted">{m.countLabel}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-xl bg-accent-soft/30 px-4 py-6 text-center text-sm text-muted">
          No merchant data available for this period.
        </p>
      )}
    </Card>
  );
}
