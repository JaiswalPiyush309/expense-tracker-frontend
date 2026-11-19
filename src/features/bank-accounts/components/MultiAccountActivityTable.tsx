"use client";

import { ArrowLeftRight, CalendarClock, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import type { BankAccount } from "@/features/profile/accounts-api";
import type {
  ApiTransaction,
  ApiTransactionType,
} from "@/features/transactions/transactions-api";

interface MultiAccountActivityTableProps {
  accounts: BankAccount[];
  items: ApiTransaction[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  accountFilter: string;
  onAccountFilterChange: (value: string) => void;
  typeFilter: "All" | ApiTransactionType;
  onTypeFilterChange: (value: "All" | ApiTransactionType) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function transactionTypeLabel(type: ApiTransactionType) {
  switch (type) {
    case "INCOME":
      return "Income";
    case "EXPENSE":
      return "Expense";
    case "TRANSFER":
      return "Transfer";
  }
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value, time: "" };

  return {
    date: new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
}

function formatAmount(amount: number | string, currency: string, type: ApiTransactionType) {
  const value = Number(amount);
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

  if (type === "INCOME") return `+${formatted}`;
  if (type === "EXPENSE") return `−${formatted}`;
  return formatted;
}

function accountDisplay(account: BankAccount | undefined, fallback?: ApiTransaction["account"]) {
  const name = account?.name ?? fallback?.name ?? "Unknown account";
  const last4 = account?.accountNumberLast4 ?? fallback?.accountNumberLast4;
  return { name, mask: last4 ? `•••• ${last4}` : "" };
}

export function MultiAccountActivityTable({
  accounts,
  items,
  totalItems,
  isLoading,
  error,
  onRetry,
  accountFilter,
  onAccountFilterChange,
  typeFilter,
  onTypeFilterChange,
  currentPage,
  totalPages,
  onPageChange,
}: MultiAccountActivityTableProps) {
  const accountById = new Map(accounts.map((account) => [account.id, account]));

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="border-b border-line px-5 py-4"
        title="Recent account activity"
        description="Transactions recorded across your connected accounts."
        icon={<CalendarClock aria-hidden="true" className="h-5 w-5" />}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={accountFilter}
              onChange={(event) => onAccountFilterChange(event.target.value)}
              aria-label="Filter activity by account"
              className="w-full sm:w-auto sm:min-w-48"
            >
              <option value="All">All accounts</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}{account.isArchived ? " (archived)" : ""}
                </option>
              ))}
            </Select>
            <Select
              value={typeFilter}
              onChange={(event) =>
                onTypeFilterChange(event.target.value as "All" | ApiTransactionType)
              }
              aria-label="Filter activity by transaction type"
              className="w-full sm:w-auto sm:min-w-40"
            >
              <option value="All">All types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expenses</option>
              <option value="TRANSFER">Transfers</option>
            </Select>
          </div>
        }
      />

      {error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="text-sm text-bad">{error}</p>
          <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <p role="status" className="flex items-center gap-2 p-5 text-sm text-muted">
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
          Loading account activity…
        </p>
      ) : items.length === 0 ? (
        <EmptyState
          className="m-5"
          title="No account activity found"
          description="Transactions matching these filters will appear here."
          icon={<CalendarClock aria-hidden="true" className="h-5 w-5" />}
        />
      ) : (
        <>
          <Table
            aria-label="Recent account activity"
            className="min-w-[760px]"
            wrapperClassName="overflow-x-auto"
          >
            <thead className="border-b border-line bg-surface-muted/50">
              <tr>
                <Th className="pl-5">Date &amp; time</Th>
                <Th>Description</Th>
                <Th>Account</Th>
                <Th>Category</Th>
                <Th align="right">Amount</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {items.map((transaction) => {
                const source = accountDisplay(
                  accountById.get(transaction.accountId),
                  transaction.account,
                );
                const destination = transaction.toAccountId
                  ? accountDisplay(
                      accountById.get(transaction.toAccountId),
                      transaction.toAccount,
                    )
                  : null;
                const account = accountById.get(transaction.accountId);
                const { date, time } = formatDateTime(transaction.transactionDate);
                const tone =
                  transaction.type === "INCOME"
                    ? "good"
                    : transaction.type === "EXPENSE"
                      ? "bad"
                      : "neutral";
                const amountColor =
                  transaction.type === "INCOME"
                    ? "text-good"
                    : transaction.type === "EXPENSE"
                      ? "text-bad"
                      : "text-ink";
                const title =
                  transaction.merchant ||
                  transaction.category?.name ||
                  transactionTypeLabel(transaction.type);

                return (
                  <tr key={transaction.id} className="transition-colors hover:bg-surface-muted/40">
                    <Td className="whitespace-nowrap pl-5">
                      <p className="font-semibold text-ink">{date}</p>
                      <p className="mt-0.5 text-xs text-muted">{time}</p>
                    </Td>
                    <Td className="min-w-48">
                      <p className="font-semibold text-ink">{title}</p>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-muted">
                        {transaction.note || transaction.category?.name || "—"}
                      </p>
                    </Td>
                    <Td className="min-w-52">
                      <div className="flex items-center gap-2 text-sm text-ink">
                        <span className="truncate">{source.name}</span>
                        {destination && (
                          <>
                            <ArrowLeftRight
                              aria-label="transferred to"
                              className="h-3.5 w-3.5 shrink-0 text-muted"
                            />
                            <span className="truncate">{destination.name}</span>
                          </>
                        )}
                      </div>
                      {(source.mask || destination?.mask) && (
                        <p className="mt-0.5 text-xs text-muted">
                          {source.mask}{destination?.mask ? ` → ${destination.mask}` : ""}
                        </p>
                      )}
                    </Td>
                    <Td>
                      <Badge tone={tone}>
                        {transaction.category?.name || transactionTypeLabel(transaction.type)}
                      </Badge>
                    </Td>
                    <Td align="right" className={`whitespace-nowrap font-semibold tabular-nums ${amountColor}`}>
                      {formatAmount(
                        transaction.amount,
                        account?.currency ?? "INR",
                        transaction.type,
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
            <p className="text-xs text-muted">
              Showing {items.length} of {totalItems} transactions
            </p>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </Card>
  );
}
