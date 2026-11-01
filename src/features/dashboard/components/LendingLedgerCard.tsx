import { Card, CardHeader } from "@/components/ui/Card";
import { Handshake } from "lucide-react";
import { formatINR } from "@/lib/format";
import { toneSoft, toneText } from "@/lib/tone";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import type { LedgerEntry } from "../types";

interface LendingLedgerCardProps {
  lentTotal: number;
  borrowedTotal: number;
  entries: readonly LedgerEntry[];
}

export function LendingLedgerCard({
  lentTotal,
  borrowedTotal,
  entries,
}: LendingLedgerCardProps) {
  return (
    <Card className="p-5 sm:p-6">
      <CardHeader
        title="Lending & People Ledger"
        icon={<Handshake aria-hidden="true" className="h-5 w-5" />}
        actions={
          <>
            <span className="rounded-full bg-bad-soft px-2.5 py-1 text-xs font-semibold text-bad">
              {formatINR(lentTotal, { decimals: false })} Lent
            </span>
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-ink">
              {formatINR(borrowedTotal, { decimals: false })} Borrowed
            </span>
          </>
        }
      />

      <ul className="mt-5 space-y-2">
        {entries.map((entry) => {
          const TagIcon = entry.tag?.icon;
          return (
            <li
              key={entry.id}
              className="flex flex-col gap-3 rounded-xl bg-accent-soft/50 p-3 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold",
                    toneSoft[entry.avatarTone],
                  )}
                >
                  {entry.initials}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold text-ink">{entry.name}</span>
                    {entry.tag && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          toneSoft[entry.tag.tone],
                        )}
                      >
                        {TagIcon && (
                          <TagIcon aria-hidden="true" className="h-3 w-3" />
                        )}
                        {entry.tag.text}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{entry.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="text-left sm:text-right">
                  <span
                    className={cn(
                      "block text-lg font-bold tabular-nums",
                      toneText[entry.amountTone],
                    )}
                  >
                    {formatINR(entry.amount, { decimals: false })}
                  </span>
                  {entry.amountCaption && (
                    <span className="block text-[11px] text-muted">
                      {entry.amountCaption}
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  {entry.actions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={action.label}
                        variant={
                          action.variant === "success"
                            ? "soft"
                            : action.variant
                        }
                        size="sm"
                        onClick={action.onClick}
                        disabled={!action.onClick}
                        className={cn(
                          action.variant === "success" &&
                            "bg-good-soft text-good shadow-none hover:brightness-95",
                        )}
                      >
                        {ActionIcon && (
                          <ActionIcon aria-hidden="true" className="h-4 w-4" />
                        )}
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
