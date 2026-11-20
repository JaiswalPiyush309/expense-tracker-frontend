"use client";

import { useState } from "react";
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  LayoutTemplate,
  MoreHorizontal,
  Plus,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { TimeframePreset } from "../types";

interface BudgetHeaderProps {
  timeframe: TimeframePreset;
  onTimeframeChange: (t: TimeframePreset) => void;
  onResetRange: () => void;
  onOpenCreateBudget: () => void;
  onOpenTemplates: () => void;
  onExportCsv: () => void;
}

export function BudgetHeader({
  timeframe,
  onTimeframeChange,
  onResetRange,
  onOpenCreateBudget,
  onOpenTemplates,
  onExportCsv,
}: BudgetHeaderProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const presets: { id: TimeframePreset; label: string; icon?: typeof SlidersHorizontal }[] = [
    { id: "THIS_MONTH", label: "This Month (01 Apr – 30 Apr 2025)" },
    { id: "TODAY", label: "Today" },
    { id: "THIS_WEEK", label: "This Week" },
    { id: "LAST_MONTH", label: "Last Month" },
    { id: "THIS_QUARTER", label: "This Quarter" },
    { id: "FY25_26", label: "Financial Year (FY25-26)" },
    { id: "CUSTOM", label: "Custom", icon: SlidersHorizontal },
  ];

  return (
    <div className="space-y-4">
      {/* Top Title & Primary Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Budgets
            </h1>
            <span className="inline-flex items-center rounded-full bg-good-soft px-2.5 py-0.5 text-xs font-semibold text-good">
              Active Run
            </span>
          </div>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Plan your spending, set category-wise limits, and track your financial
            goals to stay strictly within budget.
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Templates Button */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onOpenTemplates}
            className="gap-1.5 font-medium"
          >
            <LayoutTemplate className="h-4 w-4 text-muted" />
            <span>Templates</span>
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className="gap-1.5 font-medium"
            >
              <Download className="h-4 w-4 text-muted" />
              <span>Export</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted" />
            </Button>

            {isExportMenuOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-line bg-surface p-1 shadow-lg"
                onMouseLeave={() => setIsExportMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setIsExportMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-ink hover:bg-surface-muted"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-muted" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    setIsExportMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-ink hover:bg-surface-muted"
                >
                  <FileText className="h-3.5 w-3.5 text-muted" />
                  <span>Print Report</span>
                </button>
              </div>
            )}
          </div>

          {/* More Options */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen((prev) => !prev)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:bg-surface-muted hover:text-ink"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isMoreMenuOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-line bg-surface p-1 shadow-lg"
                onMouseLeave={() => setIsMoreMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    onResetRange();
                    setIsMoreMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-ink hover:bg-surface-muted"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Create Budget Button */}
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={onOpenCreateBudget}
            className="gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Create Budget</span>
          </Button>
        </div>
      </div>

      {/* Preset Timeframes Selector Row */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {presets.map((preset) => {
          const isActive = timeframe === preset.id;
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onTimeframeChange(preset.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-accent text-white shadow-xs"
                  : "bg-surface text-muted border border-line hover:bg-surface-muted hover:text-ink"
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{preset.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onResetRange}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Range</span>
        </button>
      </div>

      {/* Double-Entry Compliance Callout */}
      <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-muted shadow-xs">
        <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
        <p className="min-w-0 flex-1">
          <strong className="text-ink">Double-entry compliance enabled:</strong>{" "}
          Self-transfers, credit card balance payoffs, and investments are
          excluded from budget burn. Refunds dynamically restore envelope caps.{" "}
          <button
            type="button"
            className="font-semibold text-accent hover:underline"
            onClick={() =>
              alert(
                "Double-Entry Budget Compliance: Only genuine P&L expenses count toward category envelope limits. Balance sheet transfers (savings transfers, credit card repayments, asset investments, and loan lending) do not burn your spending allowances.",
              )
            }
          >
            Learn rules
          </button>
        </p>
      </div>
    </div>
  );
}
