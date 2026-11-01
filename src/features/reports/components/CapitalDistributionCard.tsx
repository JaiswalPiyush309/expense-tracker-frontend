import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { MeterList, type MeterItem } from "@/components/ui/MeterList";
import Link from "next/link";
import type { FlowItem } from "../types";
import type { ReactNode } from "react";

function toMeterItems(
  items: readonly FlowItem[],
  total: number,
): MeterItem[] {
  return items.map((item) => {
    const percent =
      Number.isFinite(total) && total > 0
        ? Math.min(100, Math.max(0, (item.amount / total) * 100))
        : 0;
    return {
      id: item.id,
      label: item.label,
      value: formatINR(item.amount, { decimals: false }),
      hint: `(${percent.toFixed(1)}%)`,
      percent,
      color: item.color,
      faded: item.faded,
    };
  });
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink/80">
      {children}
    </h3>
  );
}

interface CapitalDistributionCardProps {
  periodLabel: string;
  /** Listed categories may not add up to the total; the rest is "Discretionary / Leisure". */
  incomeTotal: number;
  expenseTotal: number;
  income: readonly FlowItem[];
  expense: readonly FlowItem[];
  subcategoryCount: number;
  className?: string;
}

export function CapitalDistributionCard({
  periodLabel,
  incomeTotal,
  expenseTotal,
  income,
  expense,
  subcategoryCount,
  className,
}: CapitalDistributionCardProps) {
  const listedExpense = expense.reduce((sum, i) => sum + i.amount, 0);
  const discretionary =
    Number.isFinite(expenseTotal) && expenseTotal > 0
      ? Math.max(0, 100 - (listedExpense / expenseTotal) * 100)
      : 0;

  return (
    <Card className={cn("flex flex-col p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow="Sources & Sinks"
        title="Capital Distribution"
        actions={
          <span className="text-xs font-semibold text-accent">
            {periodLabel}
          </span>
        }
      />

      <section className="mt-6">
        <SectionTitle>
          Income Inflows ({formatINR(incomeTotal, { decimals: false })})
        </SectionTitle>
        <MeterList items={toMeterItems(income, incomeTotal)} />
      </section>

      <section className="mt-7">
        <SectionTitle>
          Expense Outflows ({formatINR(expenseTotal, { decimals: false })})
        </SectionTitle>
        <MeterList items={toMeterItems(expense, expenseTotal)} />
      </section>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-xs font-semibold">
        <span className="text-muted">
          Discretionary / Leisure: {discretionary.toFixed(1)}%
        </span>
        <Link
          href="/transactions"
          className="rounded-md text-accent hover:underline"
        >
          View All {subcategoryCount} Sub-cats
        </Link>
      </footer>
    </Card>
  );
}
