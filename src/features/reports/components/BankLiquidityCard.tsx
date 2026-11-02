import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { BankAccount } from "../types";
import { CircleCheck } from "lucide-react";
import { formatINR } from "@/lib/format";
import { toneSoft, toneText } from "@/lib/tone";
import { Callout } from "@/components/ui/Callout";

const safeAmount = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-muted">
      {children}
    </span>
  );
}

interface BankLiquidityCardProps {
  accounts: readonly BankAccount[];
  registered: number;
  note: string;
  className?: string;
}

export function BankLiquidityCard({
  accounts,
  registered,
  note,
  className,
}: BankLiquidityCardProps) {
  return (
    <Card className={cn("flex flex-col p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow="Liquid Accounts"
        title="Bank Liquidity & Net Additions"
        actions={
          <Pill>
            {`${registered} Registered`}
          </Pill>
        }
      />

      {accounts.length > 0 ? (
        <ul className="mt-5 space-y-3" aria-label="Bank accounts">
          {accounts.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-xl bg-accent-soft/50 p-3"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-lg text-[11px] font-bold",
                  toneSoft[a.logoTone],
                )}
              >
                {a.logo}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{a.name}</p>
                <p className="truncate text-xs text-muted">{a.subtitle}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold tabular-nums text-ink">
                  {formatINR(safeAmount(a.balance), { decimals: false })}
                </p>
                <p className={cn("text-xs font-semibold", toneText[a.net.tone])}>
                  {a.net.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl bg-accent-soft/30 px-4 py-8 text-center text-sm text-muted">
          No bank accounts available for this period.
        </p>
      )}

      <Callout
        className="mt-4 text-xs"
        icon={<CircleCheck aria-hidden="true" className="h-4 w-4 text-good" />}
      >
        {note}
      </Callout>
    </Card>
  );
}
