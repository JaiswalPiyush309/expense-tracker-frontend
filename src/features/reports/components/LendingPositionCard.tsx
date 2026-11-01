import { formatDate, formatINR } from "@/lib/format";
import { toneSoft } from "@/lib/tone";
import type { LendingRow } from "../types";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { Workflow } from "lucide-react";
import { Callout } from "@/components/ui/Callout";
import { Table, Td, Th } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

const safeAmount = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

const sum = <T,>(items: readonly T[], pick: (item: T) => number) =>
  items.reduce((total, item) => total + safeAmount(pick(item)), 0);

const money = (value: number) => formatINR(safeAmount(value), { decimals: false });

function Pill({ tone, children }: { tone: keyof typeof toneSoft; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneSoft[tone],
      )}
    >
      {children}
    </span>
  );
}

export function LendingPositionCard({
  rows,
  className,
  onAction,
}: {
  rows: readonly LendingRow[];
  className?: string;
  onAction?: (row: LendingRow) => void;
}) {
  const lent = rows.filter((r) => r.kind === "lent");
  const totalLent = sum(lent, (r) => r.original);
  const recovered = sum(lent, (r) => r.cleared);
  const overdue = sum(
    rows.filter((r) => r.overdue),
    (r) => r.original - r.cleared,
  );
  const borrowed = sum(
    rows.filter((r) => r.kind === "borrowed"),
    (r) => r.original - r.cleared,
  );

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow={
          <span className="inline-flex flex-wrap items-center gap-2">
            Credit & Interpersonal Debts
            <Pill tone="accent">
              Accounting Principle: Balance Sheet Asset/Liab
            </Pill>
          </span>
        }
        title="People & Lending Position"
        actions={
          <>
            <Pill tone="accent">
              Total Lent: {money(totalLent)}
            </Pill>
            <Pill tone="good">
              Recovered: {money(recovered)}
            </Pill>
            <Pill tone="bad">
              Overdue: {money(overdue)}
            </Pill>
            <Pill tone="accent">
              Outstanding Borrowed: {money(borrowed)}
            </Pill>
          </>
        }
      />

      <Callout
        className="mt-5"
        icon={<Workflow aria-hidden="true" className="h-4 w-4" />}
      >
        <strong className="text-ink">Accounting Notice:</strong> Money lent
        reduces bank liquid balance and increases your{" "}
        <em>Receivable Asset ledger</em>. It is not recorded as an expense to
        preserve accurate net worth calculations.
      </Callout>

      <div className="mt-4">
        <Table
          className="min-w-225"
          aria-label="People and lending positions"
        >
          <caption className="sr-only">
            Lending and borrowing positions with balances, due dates, statuses,
            and available actions.
          </caption>
          <thead>
            <tr className="border-b border-line">
              <Th>Party / Contact</Th>
              <Th>Type</Th>
              <Th align="right">Original Amount</Th>
              <Th align="right">Cleared Amount</Th>
              <Th align="right">Balance Due</Th>
              <Th>Due Date</Th>
              <Th>Status</Th>
              <Th align="right">Quick Action</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length > 0 ? (
              rows.map((r) => {
                const balance = safeAmount(r.original) - safeAmount(r.cleared);
                const Icon = r.action.icon;
                return (
                  <tr key={r.id} className="hover:bg-surface-muted/50">
                  <Td>
                    <p className="font-bold text-ink">{r.name}</p>
                    <p className="text-xs text-muted">{r.phone}</p>
                  </Td>
                  <Td>
                    <Pill tone={r.kind === "lent" ? "accent" : "bad"}>
                      {r.kind === "lent" ? "Lent (Asset)" : "Borrowed (Liab)"}
                    </Pill>
                  </Td>
                  <Td align="right" className="font-bold tabular-nums text-ink">
                    {money(r.original)}
                  </Td>
                  <Td
                    align="right"
                    className={cn(
                      "tabular-nums",
                      r.cleared > 0 ? "font-bold text-good" : "text-muted",
                    )}
                  >
                    {money(r.cleared)}
                  </Td>
                  <Td
                    align="right"
                    className={cn(
                      "font-bold tabular-nums",
                      r.overdue || r.kind === "borrowed"
                        ? "text-bad"
                        : "text-ink",
                    )}
                  >
                    {money(balance)}
                  </Td>
                  <Td
                    className={cn(
                      "text-sm",
                      r.overdue ? "font-semibold text-bad" : "text-muted",
                    )}
                  >
                    {formatDate(r.dueDate)}
                    {r.dueNote && <span className="ml-1">{r.dueNote}</span>}
                  </Td>
                  <Td>
                    <Pill tone={r.status.tone}>
                      {r.status.text}
                    </Pill>
                  </Td>
                  <Td align="right">
                    <Button
                      variant={r.action.variant}
                      size="sm"
                      className="min-h-9"
                      disabled={!onAction}
                      title={onAction ? r.action.label : "Action unavailable"}
                      aria-label={`${r.action.label} for ${r.name}`}
                      onClick={() => onAction?.(r)}
                    >
                      {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
                      {r.action.label}
                    </Button>
                  </Td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <Td colSpan={8} className="py-10 text-center text-muted">
                  No lending positions available for this period.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {!onAction && rows.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          Quick actions are enabled when the lending workflow is connected.
        </p>
      )}
    </Card>
  );
}
