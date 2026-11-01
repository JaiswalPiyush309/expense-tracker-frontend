import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { formatINR, formatPct } from "@/lib/format";
import { toneText } from "@/lib/tone";
import { ArrowRight, ChartLine, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Holding, MarketIndex } from "../types";

const indexNumber = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function Change({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold",
        toneText[up ? "good" : "bad"],
        className,
      )}
    >
      {formatPct(value)}
      <span aria-hidden="true" className="text-[0.7em]">
        {up ? "▲" : "▼"}
      </span>
      <span className="sr-only">{up ? "up" : "down"}</span>
    </span>
  );
}

interface MarketsCardProps {
  portfolioValue: number;
  portfolioChangePct: number;
  indices: readonly MarketIndex[];
  holdings: readonly Holding[];
  onRefresh?: () => void;
  onImport?: () => void;
}

export function MarketsCard({
  portfolioValue,
  portfolioChangePct,
  indices,
  holdings,
  onRefresh,
  onImport,
}: MarketsCardProps) {
  return (
    <Card className="flex flex-col p-5 sm:p-6">
      <CardHeader
        title="Indian Markets & Holdings"
        icon={<ChartLine aria-hidden="true" className="h-5 w-5" />}
        description={`Portfolio Value: ${formatINR(portfolioValue, { decimals: false })} (${formatPct(portfolioChangePct, 2)})`}
        actions={
          <IconButton
            label="Refresh market data"
            onClick={onRefresh}
            disabled={!onRefresh}
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          </IconButton>
        }
      />

      <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-accent-soft/50 p-3">
        {indices.map((index) => (
          <div key={index.id} className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {index.name}
            </dt>
            <dd className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-ink">
              <span className="text-base font-bold tabular-nums sm:text-lg">
                {indexNumber.format(index.value)}
              </span>
              <Change value={index.changePct} className="text-xs" />
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-2 divide-y divide-line">
        {holdings.map((h) => (
          <li
            key={h.id}
            className="flex items-start justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-ink">{h.name}</p>
              <p className="text-xs text-muted">
                {h.shares} shares @ {formatINR(h.avgPrice, { decimals: false })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold tabular-nums text-ink">
                {formatINR(h.value, { decimals: false })}
              </p>
              <Change value={h.changePct} className="text-xs" />
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3 text-xs font-semibold">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 rounded-md text-accent hover:underline"
        >
          View Full Portfolio & Trade History
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={onImport}
          disabled={!onImport}
          className="min-h-0 px-2 py-1"
        >
          Import Groww CSV
        </Button>
      </footer>
    </Card>
  );
}
