import {
  Banknote,
  Check,
  CreditCard,
  Landmark,
  LoaderCircle,
  Star,
  TrendingUp,
  Trash2,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import type { BankAccount } from "@/features/profile/accounts-api";

interface BankAccountCardProps {
  account: BankAccount;
  isBusy?: boolean;
  onSetDefault: (account: BankAccount) => void;
  onRemove: (account: BankAccount) => void;
  onRestore: (account: BankAccount) => void;
}

const accountTypeDetails = {
  BANK: { label: "Bank account", icon: Landmark },
  CASH: { label: "Cash", icon: Banknote },
  CREDIT_CARD: { label: "Credit card", icon: CreditCard },
  WALLET: { label: "Digital wallet", icon: Wallet },
  INVESTMENT: { label: "Investment account", icon: TrendingUp },
} as const;

function formatBalance(account: BankAccount) {
  const balance = Number(account.balance);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: account.currency || "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(balance) ? balance : 0);
}

export function BankAccountCard({
  account,
  isBusy = false,
  onSetDefault,
  onRemove,
  onRestore,
}: BankAccountCardProps) {
  const { label: typeLabel, icon: Icon } = accountTypeDetails[account.type];
  const institution = account.bankName || account.name;

  return (
    <Card className="flex min-w-0 flex-col justify-between border-l-4 border-l-accent p-5 transition-shadow hover:shadow-card">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-ink" title={account.name}>
                {account.name}
              </h2>
              <p className="mt-0.5 truncate text-sm text-muted" title={institution}>
                {institution}
              </p>
            </div>
          </div>
          <Badge tone={account.isArchived ? "neutral" : "good"}>
            {account.isArchived ? "Archived" : "Active"}
          </Badge>
        </div>

        <div className="mt-5 rounded-xl bg-accent-soft/50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted">Account type</span>
            <span className="text-xs font-semibold text-ink">{typeLabel}</span>
          </div>
          {account.accountNumberLast4 && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted">Account number</span>
              <span className="font-mono text-xs font-semibold text-ink">
                •••• {account.accountNumberLast4}
              </span>
            </div>
          )}
          {account.upiId && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted">UPI ID</span>
              <span className="max-w-[65%] truncate text-xs font-semibold text-ink">
                {account.upiId}
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Current balance
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ink">
              {formatBalance(account)}
            </p>
          </div>
          {account.isDefault && (
            <Badge tone="accent">
              <Star aria-hidden="true" className="h-3 w-3" />
              Default
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="text-xs text-muted">
          {account.accountNumberLast4
            ? `•••• ${account.accountNumberLast4}`
            : typeLabel}
        </span>
        {account.isArchived ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isBusy}
            onClick={() => onRestore(account)}
          >
            {isBusy ? (
              <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Check aria-hidden="true" className="h-4 w-4" />
            )}
            Restore
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {!account.isDefault && (
              <Button
                type="button"
                variant="soft"
                size="sm"
                disabled={isBusy}
                onClick={() => onSetDefault(account)}
              >
                {isBusy ? (
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <Check aria-hidden="true" className="h-4 w-4" />
                )}
                Set default
              </Button>
            )}
            <IconButton
              label={`Remove ${account.name}`}
              disabled={isBusy}
              onClick={() => onRemove(account)}
              className="h-9 w-9 text-bad hover:text-bad"
            >
              {isBusy ? (
                <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              )}
            </IconButton>
          </div>
        )}
      </div>
    </Card>
  );
}
