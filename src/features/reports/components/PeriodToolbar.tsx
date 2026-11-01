"use client";

import type { LucideIcon } from "lucide-react";
import type { ReportPeriod } from "../types";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Switch } from "@/components/ui/Switch";

interface PeriodOption {
  value: ReportPeriod;
  label: string;
  /** Longer label shown while selected. */
  activeLabel?: string;
  icon?: LucideIcon;
}

interface PeriodToolbarProps {
  options: readonly PeriodOption[];
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  compare: boolean;
  onCompareChange: (compare: boolean) => void;
  /** Summary shown while comparing, if there is data for the period. */
  compareSummary?: string;
}

export function PeriodToolbar({
  options,
  period,
  onPeriodChange,
  compare,
  onCompareChange,
  compareSummary,
}: PeriodToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-accent-soft/40 p-3 lg:flex-row lg:items-center lg:justify-between">
      <SegmentedControl
        label="Report period"
        size="md"
        className="bg-transparent p-0"
        value={period}
        onChange={onPeriodChange}
        options={options.map(({ value, label, activeLabel, icon: Icon }) => ({
          value,
          label: value === period && activeLabel ? activeLabel : label,
          icon: Icon ? (
            <Icon aria-hidden="true" className="h-4 w-4" />
          ) : undefined,
        }))}
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-end">
        <Switch checked={compare} onChange={onCompareChange}>
          Compare with previous period
        </Switch>
        {compare && compareSummary && (
          <span className="rounded-full bg-good-soft px-3 py-1.5 text-xs font-semibold text-good">
            {compareSummary}
          </span>
        )}
      </div>
    </div>
  );
}
