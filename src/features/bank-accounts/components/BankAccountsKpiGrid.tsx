"use client";

import { useMemo } from "react";
import {
  Banknote,
  CreditCard,
  Landmark,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/loaders";
import type { BankAccount } from "@/features/profile/accounts-api";

function formatBalances(accounts: BankAccount[]) {
  const totals = new Map<string, number>();

  for (const account of accounts) {
    const currency = account.currency || "INR";
    const balance = Number(account.balance || 0);
    totals.set(
      currency,
      (totals.get(currency) ?? 0) + (Number.isFinite(balance) ? balance : 0),
    );
  }

  if (totals.size === 0) totals.set("INR", 0);

  return [...totals.entries()]
    .sort(([currencyA], [currencyB]) => currencyA.localeCompare(currencyB))
    .map(([currency, total]) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(total),
    )
    .join(" · ");
}

const metrics = [
  {
    id: "liquid",
    label: "Liquid balance",
    description: "Bank, cash, and wallet balances",
    icon: Wallet,
    tone: "good" as const,
    select: (accounts: BankAccount[]) =>
      accounts.filter((account) =>
        ["BANK", "CASH", "WALLET"].includes(account.type),
      ),
    value: formatBalances,
  },
  {
    id: "bank",
    label: "Bank balances",
    description: "Across connected bank accounts",
    icon: Landmark,
    tone: "accent" as const,
    select: (accounts: BankAccount[]) =>
      accounts.filter((account) => account.type === "BANK"),
    value: formatBalances,
  },
  {
    id: "credit-card",
    label: "Credit card balance",
    description: "Current recorded card balances",
    icon: CreditCard,
    tone: "bad" as const,
    select: (accounts: BankAccount[]) =>
      accounts.filter((account) => account.type === "CREDIT_CARD"),
    value: formatBalances,
  },
  {
    id: "wallet",
    label: "Wallet balance",
    description: "Across connected wallets",
    icon: Wallet,
    tone: "good" as const,
    select: (accounts: BankAccount[]) =>
      accounts.filter((account) => account.type === "WALLET"),
    value: formatBalances,
  },
  {
    id: "cash",
    label: "Cash balance",
    description: "Across cash accounts",
    icon: Banknote,
    tone: "neutral" as const,
    select: (accounts: BankAccount[]) =>
      accounts.filter((account) => account.type === "CASH"),
    value: formatBalances,
  },
  {
    id: "accounts",
    label: "Accounts connected",
    description: "Active accounts across all types",
    icon: RefreshCw,
    tone: "accent" as const,
    select: (accounts: BankAccount[]) => accounts,
    value: (accounts: BankAccount[]) => `${accounts.length} accounts`,
  },
];

export function BankAccountsKpiGrid({
  accounts,
  loading,
}: {
  accounts: BankAccount[];
  loading: boolean;
}) {
  const activeAccounts = useMemo(
    () => accounts.filter((account) => !account.isArchived),
    [accounts],
  );

  const cards = useMemo(
    () =>
      metrics.map((metric) => {
        const matchingAccounts = metric.select(activeAccounts);
        return {
          ...metric,
          count: matchingAccounts.length,
          displayValue: metric.value(matchingAccounts),
        };
      }),
    [activeAccounts],
  );

  if (loading) {
    return <SkeletonCard variant="kpi" />;
  }

  if (activeAccounts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map(
        ({ id, label, description, icon: Icon, tone, count, displayValue }) => (
          <Card key={id} className="min-w-0 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-xs font-semibold text-muted">{label}</h2>
                <p className="mt-1 text-[11px] text-muted">{description}</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
            <p
              className="mt-4 break-words text-lg font-bold tracking-tight text-ink"
              title={displayValue}
            >
              {displayValue}
            </p>
            <div className="mt-3 border-t border-line pt-2">
              <Badge tone={tone}>
                {id === "accounts"
                  ? "Active"
                  : `${count} ${count === 1 ? "account" : "accounts"}`}
              </Badge>
            </div>
          </Card>
        ),
      )}
    </div>
  );
}
