"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import type { Transaction, TransactionType } from "../types";
import { ALL, useTransactionFilters } from "../hooks/useTransactionFilters";
import { downloadCsv } from "@/lib/csv";
import { toneSoft, toneText } from "@/lib/tone";
import type { Tone } from "@/lib/tone";
import { Select } from "@/components/ui/Select";
import { Download, EllipsisVertical, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatDate, formatINR } from "@/lib/format";
import { IconButton } from "@/components/ui/IconButton";

const typeTone: Record<TransactionType, Tone> = {
  debit: "bad",
  credit: "good",
  transfer: "ink",
};

const typeLabel: Record<TransactionType, string> = {
  debit: "Debit",
  credit: "Credit",
  transfer: "Transfer",
};

const COLUMNS = [
  "Date",
  "Merchant / Description",
  "Category",
  "Account & Mode",
  "Type",
  "Amount (₹)",
  "Status",
  "Actions",
] as const;

interface TransactionsTableProps {
  transactions: readonly Transaction[];
  /** Total rows across all pages (from the API). */
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function TransactionsTable({
  transactions,
  total,
  page,
  pageSize,
  onPageChange,
}: TransactionsTableProps) {
  const {
    category,
    setCategory,
    account,
    setAccount,
    categories,
    accounts,
    rows,
  } = useTransactionFilters(transactions);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = rows.length ? (page - 1) * pageSize + 1 : 0;
  const to = (page - 1) * pageSize + rows.length;

  const exportCsv = () =>
    downloadCsv("transactions.csv", [
      ["Date", "Merchant", "Category", "Account", "Type", "Amount", "Status"],
      ...rows.map((t) => [
        t.date,
        t.merchant,
        t.category,
        t.account,
        typeLabel[t.type],
        t.amount,
        t.status,
      ]),
    ]);

  return (
    <Card className="p-5 sm:p-6">
      <CardHeader
        title="Recent Unified Transactions"
        description="Aggregated feed across NetBanking, Credit Cards, UPI, and Cash"
        actions={
          <>
            <Select
              aria-label="Filter by category"
              icon={<ListFilter aria-hidden="true" className="h-4 w-4" />}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value={ALL}>All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Filter by account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              <option value={ALL}>Account: All ({accounts.length})</option>
              {accounts.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
            <Button
              variant="soft"
              size="sm"
              onClick={exportCsv}
              className="h-10 bg-accent-soft/60 text-ink"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="mt-5 overflow-x-auto rounded-xl">
        <table className="w-full min-w-220 border-collapse text-left text-sm">
          <thead>
            <tr className="bg-accent-soft/50">
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={cn(
                    "px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted",
                    i === 5 && "text-right",
                    i === 6 && "text-center",
                    i === 7 && "text-center",
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {rows.map((t) => {
              const Icon = t.icon;
              const AccountIcon = t.accountIcon;
              return (
                <tr
                  key={t.id}
                  className="align-middle hover:bg-surface-muted/50"
                >
                  <td className="whitespace-nowrap px-3 py-4 text-muted">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                          toneSoft[t.iconTone],
                        )}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{t.merchant}</p>
                        {t.note && (
                          <p className="text-xs text-muted">{t.note}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 whitespace-normal text-xs font-medium",
                        toneSoft[t.categoryTone],
                      )}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-muted">
                    <span className="flex items-center gap-2">
                      <AccountIcon
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                      />
                      {t.account}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-3 py-4 text-xs font-semibold",
                      toneText[typeTone[t.type]],
                    )}
                  >
                    {typeLabel[t.type]}
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-4 text-right text-base font-bold tabular-nums",
                      toneText[typeTone[t.type]],
                    )}
                  >
                    {formatINR(t.amount, { sign: true })}
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        toneSoft[t.statusTone],
                      )}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <IconButton
                      label={`Actions for ${t.merchant}`}
                      disabled
                    >
                      <EllipsisVertical
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-3 py-10 text-center text-muted"
                >
                  No transactions match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <p className="font-medium">
          Showing{" "}
          <strong className="text-ink">
            {from} to {to}
          </strong>{" "}
          of {total} total transactions this month
        </p>
        <nav aria-label="Pagination" className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="font-medium text-ink">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </nav>
      </footer>
    </Card>
  );
}
