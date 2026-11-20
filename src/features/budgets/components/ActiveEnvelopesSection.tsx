"use client";

import {
  Activity,
  Car,
  ChevronRight,
  Home,
  Plus,
  RotateCw,
  Search,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatINR } from "@/lib/format";
import type { BudgetEnvelope, BudgetStatus } from "../types";

interface ActiveEnvelopesSectionProps {
  envelopes: BudgetEnvelope[];
  statusFilter: "ALL" | BudgetStatus;
  onStatusFilterChange: (s: "ALL" | BudgetStatus) => void;
  statusCounts: {
    all: number;
    overBudget: number;
    nearLimit: number;
    healthy: number;
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  expenseTypeFilter: string;
  onExpenseTypeChange: (t: string) => void;
  progressStateFilter: string;
  onProgressStateChange: (p: string) => void;
  onOpenAddEnvelope: () => void;
  onOpenReallocate: () => void;
  onEditEnvelope: (env: BudgetEnvelope) => void;
}

function getEnvelopeIcon(iconName: string) {
  switch (iconName) {
    case "Home":
      return Home;
    case "ShoppingCart":
      return ShoppingCart;
    case "Utensils":
      return Utensils;
    case "Car":
      return Car;
    case "Zap":
      return Zap;
    case "Activity":
      return Activity;
    case "ShoppingBag":
      return ShoppingBag;
    case "Ticket":
      return Ticket;
    default:
      return Wallet;
  }
}

function EnvelopeStatusBadge({ status }: { status: BudgetStatus }) {
  switch (status) {
    case "OVER_BUDGET":
      return (
        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
          Over Budget
        </span>
      );
    case "NEAR_LIMIT":
      return (
        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
          Near Limit
        </span>
      );
    case "ON_TRACK":
      return (
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
          On Track
        </span>
      );
    case "HEALTHY":
    default:
      return (
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
          Healthy
        </span>
      );
  }
}

export function ActiveEnvelopesSection({
  envelopes,
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  searchQuery,
  onSearchChange,
  expenseTypeFilter,
  onExpenseTypeChange,
  progressStateFilter,
  onProgressStateChange,
  onOpenAddEnvelope,
  onOpenReallocate,
  onEditEnvelope,
}: ActiveEnvelopesSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">
            Active Category Envelopes
          </h2>
          <p className="text-xs text-muted">
            Real-time expenditure tracking against isolated category caps
          </p>
        </div>

        <span className="text-xs text-muted">Sorted by utilization %</span>
      </div>

      {/* Grid of 8 Category Envelopes (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {envelopes.map((item) => {
          const Icon = getEnvelopeIcon(item.iconName);
          const isOver = item.status === "OVER_BUDGET";
          const isNear = item.status === "NEAR_LIMIT";

          return (
            <Card
              key={item.id}
              className={`flex flex-col justify-between p-4 shadow-card transition-all hover:shadow-md ${
                isOver
                  ? "border-rose-200 bg-rose-50/20 dark:border-rose-900/40 dark:bg-rose-950/10"
                  : ""
              }`}
            >
              <div>
                {/* Top Row: Icon + Name + Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        isOver
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300"
                          : isNear
                            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                            : "bg-surface-muted text-ink dark:bg-slate-800"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-ink">{item.name}</h4>
                      <p className="text-[11px] text-muted">{item.categoryTag}</p>
                    </div>
                  </div>

                  <EnvelopeStatusBadge status={item.status} />
                </div>

                {/* Subtext e.g. transaction count / details */}
                <p className="mt-2 text-[11px] text-muted">
                  {item.transactionCount} transaction
                  {item.transactionCount === 1 ? "" : "s"} recorded
                </p>

                {/* Amounts + Utilization % */}
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-sm font-bold tracking-tight text-ink">
                    <span className={isOver ? "text-rose-600 dark:text-rose-400" : ""}>
                      ₹{item.actualSpent.toLocaleString("en-IN")}
                    </span>{" "}
                    <span className="text-xs font-normal text-muted">
                      / ₹{item.allocatedAmount.toLocaleString("en-IN")}
                    </span>
                  </p>

                  <span
                    className={`text-xs font-bold ${
                      isOver
                        ? "text-rose-600 dark:text-rose-400"
                        : isNear
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {item.utilizationPercent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? "bg-rose-500"
                        : isNear
                          ? "bg-indigo-600"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, item.utilizationPercent)}%` }}
                  />
                </div>

                {/* Footnote Left & Right */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                  <span className={isOver ? "font-bold text-rose-600 dark:text-rose-400" : "font-medium"}>
                    {item.footnoteLeft}
                  </span>
                  <span>{item.footnoteRight}</span>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="mt-3.5 flex items-center justify-between border-t border-line pt-2.5 text-[11px]">
                <span className="truncate text-muted">{item.recentActivity}</span>

                {isOver ? (
                  <button
                    type="button"
                    onClick={onOpenReallocate}
                    className="inline-flex shrink-0 items-center gap-1 font-semibold text-rose-600 hover:underline dark:text-rose-400"
                  >
                    <span>Adjust limit</span>
                    <RotateCw className="h-3 w-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEditEnvelope(item)}
                    className="inline-flex shrink-0 items-center gap-0.5 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    <span>Details</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter Tabs & Add Envelope Bar (Matching Screenshot 2 bottom row) */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onStatusFilterChange("ALL")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                statusFilter === "ALL"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-surface text-muted border border-line hover:text-ink"
              }`}
            >
              All Budgets ({statusCounts.all})
            </button>

            <button
              type="button"
              onClick={() => onStatusFilterChange("OVER_BUDGET")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                statusFilter === "OVER_BUDGET"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-surface text-muted border border-line hover:text-ink"
              }`}
            >
              Over Budget ({statusCounts.overBudget})
            </button>

            <button
              type="button"
              onClick={() => onStatusFilterChange("NEAR_LIMIT")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                statusFilter === "NEAR_LIMIT"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-surface text-muted border border-line hover:text-ink"
              }`}
            >
              Near Limit ({statusCounts.nearLimit})
            </button>

            <button
              type="button"
              onClick={() => onStatusFilterChange("HEALTHY")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                statusFilter === "HEALTHY"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-surface text-muted border border-line hover:text-ink"
              }`}
            >
              Healthy ({statusCounts.healthy})
            </button>
          </div>

          {/* Add Envelope Button */}
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={onOpenAddEnvelope}
            className="gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Envelope</span>
          </Button>
        </div>

        {/* Search & Secondary Filter Dropdowns */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="w-full sm:flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by envelope name, tag, or merchant... ⌘F"
              aria-label="Filter envelopes"
              icon={<Search className="h-4 w-4 text-muted" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={expenseTypeFilter}
              onChange={(e) => onExpenseTypeChange(e.target.value)}
              aria-label="Filter by expense type"
            >
              <option value="ALL">All Expense Types</option>
              <option value="NEEDS">Needs (50% Rule)</option>
              <option value="WANTS">Wants (30% Rule)</option>
              <option value="SAVINGS">Savings (20% Rule)</option>
            </Select>
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={progressStateFilter}
              onChange={(e) => onProgressStateChange(e.target.value)}
              aria-label="Filter by progress state"
            >
              <option value="ALL">All Progress States</option>
              <option value="HEALTHY">Healthy (&lt; 75%)</option>
              <option value="NEAR">Near Limit (75% - 99%)</option>
              <option value="OVER">Over Budget (&ge; 100%)</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
