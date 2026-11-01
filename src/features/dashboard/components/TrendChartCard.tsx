import { Card, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { TrendPoint, TrendRange } from "../types";
import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TrendChart } from "./TrendChart";

const RANGES: readonly { value: TrendRange; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
];

const SUBTITLES: Record<TrendRange, string> = {
  monthly: "Past 6 months comparison in INR (₹)",
  weekly: "Past 6 weeks comparison in INR (₹)",
  daily: "Past 7 days comparison in INR (₹)",
};

interface TrendChartCardProps {
  data: Record<TrendRange, TrendPoint[]>;
  incomeDelta: string;
  expenseDelta: string;
  surplusMargin: string;
  className?: string;
}

export function TrendChartCard({
  data,
  incomeDelta,
  expenseDelta,
  surplusMargin,
  className,
}: TrendChartCardProps) {
  const [range, setRange] = useState<TrendRange>("monthly");

  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <CardHeader
        title="Income vs Expense Trends"
        description={SUBTITLES[range]}
        actions={
          <SegmentedControl
            label="Chart range"
            options={RANGES}
            value={range}
            onChange={setRange}
          />
        }
      />

      <div className="mt-6">
        <TrendChart points={data[range]} />
      </div>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs font-semibold text-ink">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-good" />
            Income ({incomeDelta})
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0.5 w-4 rounded-full bg-bad"
            />
            Expenses ({expenseDelta})
          </li>
        </ul>
        <span className="rounded-full bg-good-soft px-2.5 py-1 text-xs text-good">
          Net Surplus Margin: {surplusMargin}
        </span>
      </footer>
    </Card>
  );
}
