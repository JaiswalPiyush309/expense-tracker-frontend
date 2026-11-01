import { splitAmount } from "@/lib/format";
import { StatCardData } from "../types";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { toneBar, toneSoft, toneText } from "@/lib/tone";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function StatCard({ stat }: { stat: StatCardData }) {
  const { whole, decimals } = splitAmount(stat.value);
  const Icon = stat.icon;
  const DeltaIcon = stat.delta.icon;

  return (
    <Card className="flex flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="pt-1 text-[11px] font-semibold uppercase tracking-wider text-ink/80">
          {stat.label}
        </h3>
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            toneSoft[stat.iconTone],
          )}
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>

      <p
        className={cn(
          "mt-3 text-2xl font-bold tabular-nums tracking-tight @5xl:text-[1.65rem] @6xl:text-3xl",
          stat.valueTone ? toneText[stat.valueTone] : "text-ink",
        )}
      >
        {stat.prefix}₹{whole}
        {!stat.hideDecimals && (
          <span className="text-base font-medium text-muted">.{decimals}</span>
        )}
        {stat.suffix && (
          <span className="text-base font-medium text-muted">
            {stat.suffix}
          </span>
        )}
      </p>

      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-semibold",
            toneText[stat.delta.tone],
          )}
        >
          {DeltaIcon ? (
            <DeltaIcon aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                toneBar[stat.delta.tone],
              )}
            />
          )}
          {stat.delta.text}
        </span>
        {stat.note && <span className="text-muted">• {stat.note}</span>}
      </p>

      {stat.progress !== undefined && (
        <ProgressBar
          value={stat.progress}
          tone="good"
          label={`${stat.label} progress`}
          className="mt-3"
        />
      )}

      {(stat.footerLeft || stat.footerRight) && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-4 text-xs text-muted">
          <span>{stat.footerLeft}</span>
          {stat.footerRight && (
            <span
              className={cn("font-semibold", toneText[stat.footerRight.tone])}
            >
              {stat.footerRight.text}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
