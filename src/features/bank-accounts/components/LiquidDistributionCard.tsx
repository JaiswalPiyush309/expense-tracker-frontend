"use client";

import { useMemo } from "react";
import { Landmark } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { DonutChart, type DonutSegment } from "@/components/chart/DonutChart";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BankAccount } from "@/features/profile/accounts-api";

interface LiquidDistributionCardProps {
  accounts: BankAccount[];
  loading: boolean;
}

interface DistributionGroup {
  currency: string;
  total: number;
  segments: DonutSegment[];
}

function currencyAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function LiquidDistributionCard({
  accounts,
  loading,
}: LiquidDistributionCardProps) {
  const distributions = useMemo(() => {
    const grouped = new Map<string, Map<string, number>>();

    for (const account of accounts) {
      if (
        account.isArchived ||
        !["BANK", "CASH", "WALLET"].includes(account.type)
      ) {
        continue;
      }

      const balance = Number(account.balance);
      if (!Number.isFinite(balance) || balance <= 0) continue;

      const currency = account.currency || "INR";
      const institution = account.bankName || account.name;
      const institutions = grouped.get(currency) ?? new Map<string, number>();
      institutions.set(institution, (institutions.get(institution) ?? 0) + balance);
      grouped.set(currency, institutions);
    }

    return [...grouped.entries()]
      .map(([currency, institutions], currencyIndex): DistributionGroup => {
        const total = [...institutions.values()].reduce(
          (sum, amount) => sum + amount,
          0,
        );
        const segments = [...institutions.entries()]
          .sort(([, amountA], [, amountB]) => amountB - amountA)
          .map(([name, amount], index) => ({
            id: `${currency}-${name}`,
            name,
            percent: (amount / total) * 100,
            color: (((index + currencyIndex) % 7) + 1) as DonutSegment["color"],
            detail: currencyAmount(amount, currency),
          }));

        return { currency, total, segments };
      })
      .sort((a, b) => a.currency.localeCompare(b.currency));
  }, [accounts]);

  return (
    <Card className="h-full p-5 sm:p-6">
      <CardHeader
        title="Liquid distribution by institution"
        description="Positive balances across active bank, cash, and wallet accounts."
        icon={<Landmark aria-hidden="true" className="h-5 w-5" />}
        actions={<Badge tone="accent">Current balances</Badge>}
      />

      {loading ? (
        <p role="status" className="mt-6 text-sm text-muted">
          Loading liquid balances…
        </p>
      ) : distributions.length === 0 ? (
        <EmptyState
          className="mt-6 p-6"
          title="No positive liquid balances"
          description="Active bank, cash, and wallet balances will appear here once available."
          icon={<Landmark aria-hidden="true" className="h-5 w-5" />}
        />
      ) : (
        <div className="mt-6 space-y-6">
          {distributions.map((distribution) => (
            <section key={distribution.currency} aria-label={`${distribution.currency} distribution`}>
              {distributions.length > 1 && (
                <h3 className="mb-3 text-sm font-semibold text-ink">
                  {distribution.currency} liquid balance
                </h3>
              )}
              <DonutChart
                segments={distribution.segments}
                center={{
                  value: currencyAmount(distribution.total, distribution.currency),
                  caption: "liquid balance",
                }}
                variant="side"
              />
            </section>
          ))}
          <p className="text-xs text-muted">
            Negative or zero account balances are excluded from distribution shares.
          </p>
        </div>
      )}
    </Card>
  );
}
