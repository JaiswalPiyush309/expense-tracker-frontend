import { Callout } from "@/components/ui/Callout";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { toneText } from "@/lib/tone";
import { CircleCheck, Sparkles } from "lucide-react";
import type { Observation } from "../types";

interface ObservationsCardProps {
  observations: readonly Observation[];
  footerNote?: string;
  className?: string;
}

export function ObservationsCard({
  observations,
  footerNote,
  className,
}: ObservationsCardProps) {
  return (
    <Card className={cn("flex flex-col p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow={
          <span className="inline-flex flex-wrap items-center gap-2">
            LedgerFlow Intelligence
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
                "bg-accent-soft text-xs normal-case tracking-normal text-accent",
              )}
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Smart Audit
            </span>
          </span>
        }
        title="Auditor Observations"
      />

      {observations.length > 0 ? (
        <ul className="mt-5 space-y-3" aria-label="Auditor observations">
          {observations.map((o) => {
            const Icon = o.icon;
            return (
              <li
                key={o.id}
                className="flex gap-3 rounded-xl bg-accent-soft/50 p-4"
              >
                <Icon
                  aria-hidden="true"
                  className={cn("mt-0.5 h-5 w-5 shrink-0", toneText[o.tone])}
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-ink">{o.title}</h3>
                  <p className="mt-1 text-sm text-muted">{o.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl bg-accent-soft/30 px-4 py-6 text-center text-sm text-muted">
          No observations are available for this period.
        </p>
      )}

      {footerNote && (
        <Callout
          className="mt-auto"
          trailing={<CircleCheck aria-hidden="true" className="h-5 w-5" />}
        >
          {footerNote}
        </Callout>
      )}
    </Card>
  );
}
