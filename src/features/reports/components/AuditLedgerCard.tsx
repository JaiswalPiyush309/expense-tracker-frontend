"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { downloadCsv } from "@/lib/csv";
import { ALL, useAuditFilters } from "../hooks/useAuditFilters";
import type { AuditEntry } from "../types";
import { Input } from "@/components/ui/Input";
import { FileSpreadsheet, ListFilter, Search, X } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { IconButton } from "@/components/ui/IconButton";
import { Table, Td, Th } from "@/components/ui/Table";
import { formatDate, formatINR } from "@/lib/format";
import { toneSoft, toneText } from "@/lib/tone";
import { Pagination } from "@/components/ui/Pagination";
import { useEffect } from "react";

function Pill({ tone, children }: { tone: keyof typeof toneSoft; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        toneSoft[tone],
      )}
    >
      {children}
    </span>
  );
}

interface AuditLedgerCardProps {
  entries: readonly AuditEntry[];
  /** Entries across all pages (from the API). */
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AuditLedgerCard({
  entries,
  total,
  page,
  pageSize,
  onPageChange,
  className,
}: AuditLedgerCardProps) {
  const f = useAuditFilters(entries);
  const totalPages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));

  useEffect(() => {
    onPageChange(1);
  }, [f.search, f.category, f.account, f.type, onPageChange]);

  const exportCsv = () =>
    downloadCsv("audit-ledger.csv", [
      [
        "Date",
        "Description",
        "Reference",
        "Category",
        "Account & Mode",
        "Type",
        "Amount",
        "Status",
      ],
      ...f.rows.map((e) => [
        e.date,
        e.merchant,
        e.ref,
        e.category,
        e.account,
        e.type,
        e.amount,
        e.status,
      ]),
    ]);

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow="Audit Record"
        title="Granular Transaction Ledger"
        actions={
          <>
            <Input
              type="search"
              aria-label="Search reference or merchant"
              placeholder="Search reference or merchant..."
              icon={<Search aria-hidden="true" className="h-4 w-4" />}
              value={f.search}
              onChange={(e) => f.setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              aria-label="Filter by category"
              icon={<ListFilter aria-hidden="true" className="h-4 w-4" />}
              value={f.category}
              onChange={(e) => f.setCategory(e.target.value)}
            >
              <option value={ALL}>All Categories</option>
              {f.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Filter by account"
              value={f.account}
              onChange={(e) => f.setAccount(e.target.value)}
            >
              <option value={ALL}>All Accounts</option>
              {f.accounts.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Filter by type"
              value={f.type}
              onChange={(e) => f.setType(e.target.value)}
            >
              <option value={ALL}>All Types</option>
              {f.types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <IconButton
              label="Export visible rows as CSV"
              onClick={exportCsv}
              className="bg-accent-soft/60 text-ink"
            >
              <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
            </IconButton>
            {f.hasFilters && (
              <IconButton
                label="Clear ledger filters"
                onClick={() => {
                  f.clearFilters();
                  onPageChange(1);
                }}
                className="bg-surface-muted text-muted"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </IconButton>
            )}
          </>
        }
      />

      <div className="mt-5">
        <Table className="min-w-215">
          <thead>
            <tr className="border-b border-line">
              <Th>Date</Th>
              <Th>Description & Entity</Th>
              <Th>Category</Th>
              <Th>Account & Mode</Th>
              <Th>Type</Th>
              <Th align="right">Amount (₹)</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {f.rows.map((e) => (
              <tr key={e.id} className="hover:bg-surface-muted/50">
                <Td className="w-28 text-muted">{formatDate(e.date)}</Td>
                <Td>
                  <p className="font-semibold text-ink">{e.merchant}</p>
                  <p className="text-xs text-muted">Ref: {e.ref}</p>
                </Td>
                <Td>
                  <Pill tone={e.categoryTone}>
                    {e.category}
                  </Pill>
                </Td>
                <Td className="text-ink">{e.account}</Td>
                <Td>
                  <Pill tone={e.typeTone}>
                    {e.type}
                  </Pill>
                </Td>
                <Td
                  align="right"
                  className={cn(
                    "whitespace-nowrap font-bold tabular-nums",
                    e.plain
                      ? "text-ink"
                      : e.amount < 0
                        ? toneText.bad
                        : toneText.good,
                  )}
                >
                  {e.plain
                    ? formatINR(Math.abs(e.amount))
                    : formatINR(e.amount, { sign: true })}
                </Td>
                <Td align="right">
                  <Pill tone={e.statusTone}>
                    {e.status}
                  </Pill>
                </Td>
              </tr>
            ))}
            {f.rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-muted">
                  No ledger entries match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <p>
          Showing {f.rows.length} of {Math.max(0, total)} ledger entries
          matching period parameters
        </p>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          maxButtons={3}
        />
      </footer>
    </Card>
  );
}
