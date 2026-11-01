"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CashFlowChart } from "./CashFlowChart";
import { formatINR } from "@/lib/format";
import { Sparkles } from "lucide-react";
import type { CashFlowPoint, CashFlowRange } from "../types";

const RANGES: readonly { value: CashFlowRange; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const UNIT: Record<CashFlowRange, string> = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  yearly: "yearly",
};

export function CashFlowCard({
  data,
  className,
}: {
  data: Readonly<Record<CashFlowRange, readonly CashFlowPoint[]>>;
  className?: string;
}) {
  const [range, setRange] = useState<CashFlowRange>("monthly");
  const points = data[range];

  const surpluses = points.map((p) => p.income - p.expense);
  const average = points.length
    ? Math.floor(surpluses.reduce((a, b) => a + b, 0) / points.length)
    : 0;
  const positivePct = points.length
    ? Math.round((surpluses.filter((s) => s > 0).length / points.length) * 100)
    : 0;

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <CardHeader
        eyebrow="Cash Flow Matrix"
        title="Income vs. Expense & Net Surplus"
        actions={
          <SegmentedControl
            label="Chart range"
            options={RANGES}
            value={range}
            onChange={setRange}
          />
        }
      />

      <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-muted">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-good" />
          Inflow (Salary/Earned)
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-bad" />
          Outflow (Expenses)
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-3 rounded-sm bg-accent" />
          Net Retained Surplus
        </li>
      </ul>

      <div className="mt-6">
        <CashFlowChart key={range} points={points} />
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl bg-accent-soft/50 px-4 py-3 text-sm text-ink/80">
        <p className="flex items-center gap-2.5">
          <Sparkles
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-accent"
          />
          <span>
            Average {UNIT[range]} surplus of{" "}
            <strong className="text-ink">
              {formatINR(average, { decimals: false })}
            </strong>{" "}
            across the selected period.
          </span>
        </p>
        <span className="text-xs font-semibold text-good">
          {positivePct}% Positive Cashflow
        </span>
      </footer>
    </Card>
  );
}
