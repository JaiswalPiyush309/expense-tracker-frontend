import { Card } from "@/components/ui/Card";
import type { KpiData } from "../types";
import { toneSoft, toneText } from "@/lib/tone";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { Sparkline } from "@/components/ui/Sparkline";

export function KpiCard({ kpi }: { kpi: KpiData }) {
  const { topRight, footer } = kpi;

  return (
    <Card className="flex flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="pt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
          {kpi.label}
        </h3>
        {topRight.kind === "icon" ? (
          <topRight.icon
            aria-hidden="true"
            className={cn("h-5 w-5 shrink-0", toneText[topRight.tone])}
          />
        ) : (
          <span
            className={cn(
              "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              toneSoft[topRight.tone],
            )}
          >
            {topRight.text}
          </span>
        )}
      </div>

      <p
        className={cn(
          "mt-2 text-2xl font-bold tabular-nums tracking-tight sm:text-[1.7rem]",
          kpi.valueTone ? toneText[kpi.valueTone] : "text-ink",
        )}
      >
        {kpi.prefix}
        {formatINR(kpi.value, { decimals: false })}
      </p>

      {footer.kind === "trend" ? (
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs">
            <footer.icon
              aria-hidden="true"
              className={cn("h-4 w-4", toneText[footer.tone])}
            />
            <span className={cn("font-semibold", toneText[footer.tone])}>
              {footer.text}
            </span>
            {footer.suffix && (
              <span className="text-muted">{footer.suffix}</span>
            )}
          </p>
          {footer.spark.length > 0 && (
            <Sparkline
              data={footer.spark}
              tone={footer.sparkTone ?? footer.tone}
            />
          )}
        </div>
      ) : (
        <div className="mt-auto flex items-end justify-between gap-3 pt-5 text-xs">
          <span className="min-w-0 text-muted">{footer.text}</span>
          {footer.side.kind === "badge" ? (
            <span
              className={cn(
                "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                toneSoft[footer.side.tone],
              )}
            >
              {footer.side.text}
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 text-right font-semibold",
                toneText[footer.side.tone],
              )}
            >
              {footer.side.icon && (
                <footer.side.icon aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {footer.side.text}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
