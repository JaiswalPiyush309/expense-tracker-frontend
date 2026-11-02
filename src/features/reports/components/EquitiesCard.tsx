import { formatINR, formatPct } from "@/lib/format";
import { EquityRow } from "../types";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, Td, Th } from "@/components/ui/Table";
import Link from "next/link";

interface EquitiesCardProps {
  rows: EquityRow[];
  syncedAt: string;
  invested: number;
  current: number;
  className?: string;
}

const money = (n: number) => formatINR(n, { decimals: false });

export function EquitiesCard({
  rows,
  syncedAt,
  invested,
  current,
  className,
}: EquitiesCardProps) {
  return (
    <Card className={cn("flex flex-col p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow={
          <span className="inline-flex flex-wrap items-center gap-2">
            Direct Equity Holdings
            <Badge
              tone="good"
              className="px-2 py-0.5 text-xs normal-case tracking-normal"
            >
              Groww Auto-Sync
            </Badge>
          </span>
        }
        title="Equities & Index Portfolios"
        actions={
          <div className="text-right text-xs">
            <p className="text-muted">{syncedAt}</p>
            <p className="font-semibold text-good">Live NSE Prices Verified</p>
          </div>
        }
      />

      <div className="mt-4">
        <Table className="min-w-[640px]">
          <thead>
            <tr className="border-b border-line">
              <Th className="px-2">Instrument</Th>
              <Th align="right" className="px-2">
                Buy Avg
              </Th>
              <Th align="right" className="px-2">
                LTP (₹)
              </Th>
              <Th align="right" className="px-2">
                Cur Value
              </Th>
              <Th align="right" className="px-2">
                Unrealized P&L
              </Th>
              <Th align="right" className="px-2">
                Day Chg
              </Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => {
              const cost = r.shares * r.buyAvg;
              const value = r.shares * r.ltp;
              const pnl = value - cost;
              const pnlPct = (pnl / cost) * 100;
              const pnlTone = pnl >= 0 ? "text-good" : "text-bad";
              const dayTone = r.dayChangePct >= 0 ? "text-good" : "text-bad";
              return (
                <tr key={r.id} className="hover:bg-surface-muted/50">
                  <Td className="px-2">
                    <p className="font-bold text-ink">{r.symbol}</p>
                    <p className="text-xs text-muted">
                      {r.name} ({r.shares} Shares)
                    </p>
                  </Td>
                  <Td align="right" className="px-2 tabular-nums text-muted">
                    {formatINR(r.buyAvg)}
                  </Td>
                  <Td
                    align="right"
                    className="px-2 font-bold tabular-nums text-ink"
                  >
                    {formatINR(r.ltp)}
                  </Td>
                  <Td
                    align="right"
                    className="px-2 font-bold tabular-nums text-ink"
                  >
                    {money(value)}
                  </Td>
                  <Td
                    align="right"
                    className={cn("px-2 font-semibold tabular-nums", pnlTone)}
                  >
                    {formatINR(pnl, { sign: true, decimals: false })} (
                    {formatPct(pnlPct, 2)})
                  </Td>
                  <Td
                    align="right"
                    className={cn("px-2 font-semibold tabular-nums", dayTone)}
                  >
                    {formatPct(r.dayChangePct)}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5 text-xs">
        <p className="text-muted">
          Portfolio Invested:{" "}
          <span className="font-semibold text-ink">{money(invested)}</span> |
          Current:{" "}
          <span className="font-semibold text-ink">{money(current)}</span>
        </p>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 rounded-md font-semibold text-accent hover:underline"
        >
          Detailed Portfolio Holdings
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </footer>
    </Card>
  );
}
