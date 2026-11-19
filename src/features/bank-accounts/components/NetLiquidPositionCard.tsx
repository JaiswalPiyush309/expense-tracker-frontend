"use client";

import { useMemo } from "react";
import { CreditCard, Info, Scale, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SkeletonCard } from "@/components/ui/loaders";
import type { BankAccount } from "@/features/profile/accounts-api";

interface NetLiquidPositionCardProps {
  accounts: BankAccount[];
  loading: boolean;
}

interface LiquidPosition {
  currency: string;
  assets: number;
  liabilities: number;
  net: number;
}

function currencyAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function NetLiquidPositionCard({
  accounts,
  loading,
}: NetLiquidPositionCardProps) {
  const positions = useMemo(() => {
    const totals = new Map<string, Omit<LiquidPosition, "currency" | "net">>();

    for (const account of accounts) {
      if (account.isArchived) continue;

      const balance = Number(account.balance);
      if (!Number.isFinite(balance)) continue;

      const currency = account.currency || "INR";
      const total = totals.get(currency) ?? { assets: 0, liabilities: 0 };

      if (["BANK", "CASH", "WALLET"].includes(account.type)) {
        total.assets += balance;
      } else if (account.type === "CREDIT_CARD") {
        total.liabilities += Math.max(0, balance);
      }

      totals.set(currency, total);
    }

    return [...totals.entries()]
      .filter(([, total]) => total.assets !== 0 || total.liabilities !== 0)
      .map(([currency, total]) => ({
        currency,
        ...total,
        net: total.assets - total.liabilities,
      }))
      .sort((a, b) => a.currency.localeCompare(b.currency));
  }, [accounts]);

  return (
    <Card className="h-full p-5 sm:p-6">
      <CardHeader
        title="Net liquid position"
        description="Current liquid account balances minus recorded credit card balances."
        icon={<Scale aria-hidden="true" className="h-5 w-5" />}
        actions={
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Wallet aria-hidden="true" className="h-3.5 w-3.5 text-good" />
              Liquid assets
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard aria-hidden="true" className="h-3.5 w-3.5 text-bad" />
              Card balances
            </span>
          </div>
        }
      />

      {loading ? (
        <div className="mt-6">
          <SkeletonCard variant="card" className="border-0 p-0 shadow-none" />
        </div>
      ) : positions.length === 0 ? (
        <EmptyState
          className="mt-6 p-6"
          title="No liquid position to calculate"
          description="Connect a bank, cash, wallet, or credit card account to see your current position."
          icon={<Scale aria-hidden="true" className="h-5 w-5" />}
        />
      ) : (
        <div className="mt-6 space-y-4">
          {positions.map((position) => {
            const scale = Math.max(
              Math.abs(position.assets),
              position.liabilities,
              1,
            );
            const netTone =
              position.net > 0 ? "good" : position.net < 0 ? "bad" : "neutral";
            const netColor =
              position.net > 0
                ? "text-good"
                : position.net < 0
                  ? "text-bad"
                  : "text-muted";

            return (
              <section
                key={position.currency}
                className="rounded-2xl border border-line bg-surface-muted/40 p-4"
                aria-label={`${position.currency} net liquid position`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {position.currency} net position
                    </p>
                    <p
                      className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${netColor}`}
                    >
                      {currencyAmount(position.net, position.currency)}
                    </p>
                  </div>
                  <Badge tone={netTone}>
                    {position.net > 0
                      ? "Positive"
                      : position.net < 0
                        ? "Negative"
                        : "Balanced"}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-muted">Liquid assets</span>
                      <span className="font-semibold tabular-nums text-ink">
                        {currencyAmount(position.assets, position.currency)}
                      </span>
                    </div>
                    <ProgressBar
                      value={(Math.abs(position.assets) / scale) * 100}
                      tone="good"
                      label={`${position.currency} liquid assets relative balance`}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-muted">Card balances</span>
                      <span className="font-semibold tabular-nums text-ink">
                        {currencyAmount(position.liabilities, position.currency)}
                      </span>
                    </div>
                    <ProgressBar
                      value={(position.liabilities / scale) * 100}
                      tone="bad"
                      label={`${position.currency} credit card balances relative balance`}
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-line pt-3 text-xs text-muted">
                  {currencyAmount(position.assets, position.currency)} liquid assets
                  <span className="mx-1.5">−</span>
                  {currencyAmount(position.liabilities, position.currency)} card balances
                  <span className="mx-1.5">=</span>
                  <strong className={netColor}>
                    {currencyAmount(position.net, position.currency)}
                  </strong>
                </div>
              </section>
            );
          })}

          <Callout icon={<Info aria-hidden="true" className="h-4 w-4" />}>
            Bars compare liquid balances with card balances within each currency.
            Historical balance snapshots are not available, so no trend is inferred.
          </Callout>
        </div>
      )}
    </Card>
  );
}
