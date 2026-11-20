"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type {
  BorrowedSortOption,
  BorrowedStatus,
  BorrowedTimeframeFilter,
  LenderRelationshipCategory,
} from "../types";

interface MoneyBorrowedFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: "ALL" | BorrowedStatus;
  onStatusChange: (s: "ALL" | BorrowedStatus) => void;
  timeframeFilter: BorrowedTimeframeFilter;
  onTimeframeChange: (t: BorrowedTimeframeFilter) => void;
  relationshipFilter: "ALL" | LenderRelationshipCategory;
  onRelationshipChange: (r: "ALL" | LenderRelationshipCategory) => void;
  sortBy: BorrowedSortOption;
  onSortChange: (s: BorrowedSortOption) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
}

export function MoneyBorrowedFilterToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  timeframeFilter,
  onTimeframeChange,
  relationshipFilter,
  onRelationshipChange,
  sortBy,
  onSortChange,
  onReset,
  totalFiltered,
  totalAll,
}: MoneyBorrowedFilterToolbarProps) {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "ALL" ||
    timeframeFilter !== "ALL" ||
    relationshipFilter !== "ALL" ||
    sortBy !== "BALANCE_DESC";

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-surface p-3.5 sm:p-4 shadow-card">
      {/* Top Filter Controls Row */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="w-full sm:max-w-xs">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search lender, notes, account..."
            aria-label="Search borrowed loans"
            icon={<Search aria-hidden="true" className="h-4 w-4 text-muted" />}
          />
        </div>

        {/* Relationship & Timeframe Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Relationship Filter */}
          <div className="w-full sm:w-auto">
            <Select
              value={relationshipFilter}
              onChange={(e) =>
                onRelationshipChange(
                  e.target.value as "ALL" | LenderRelationshipCategory,
                )
              }
              aria-label="Filter by relationship"
            >
              <option value="ALL">All Relationships</option>
              <option value="Friend">Friends</option>
              <option value="Family">Family</option>
              <option value="Colleague">Colleagues</option>
              <option value="Bank/NBFC">Bank / NBFC</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          {/* Timeframe Filter */}
          <div className="w-full sm:w-auto">
            <Select
              value={timeframeFilter}
              onChange={(e) =>
                onTimeframeChange(e.target.value as BorrowedTimeframeFilter)
              }
              aria-label="Filter by timeframe"
            >
              <option value="ALL">All Due Dates</option>
              <option value="DUE_THIS_WEEK">Due This Week</option>
              <option value="DUE_THIS_MONTH">Due This Month</option>
              <option value="OVERDUE">Overdue Commitments</option>
              <option value="SETTLED">Settled Only</option>
            </Select>
          </div>

          {/* Sort By */}
          <div className="w-full sm:w-auto">
            <Select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as BorrowedSortOption)
              }
              aria-label="Sort debts"
            >
              <option value="BALANCE_DESC">Balance: High to Low</option>
              <option value="BALANCE_ASC">Balance: Low to High</option>
              <option value="DUE_DATE_ASC">Due Date: Earliest First</option>
              <option value="BORROWED_DATE_DESC">Borrowed: Most Recent</option>
              <option value="NAME_ASC">Lender Name: A–Z</option>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1 text-xs text-muted hover:text-ink"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Status Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            Status:
          </span>

          {(
            [
              { key: "ALL", label: "All Debts" },
              { key: "PENDING", label: "Pending" },
              { key: "PARTIALLY_PAID", label: "Part-Paid" },
              { key: "OVERDUE", label: "Overdue" },
              { key: "SETTLED", label: "Settled" },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusChange(tab.key)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-ink text-surface shadow-xs"
                    : "text-muted hover:bg-surface-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Results count indicator */}
        <p className="text-[11px] text-muted">
          Showing <span className="font-bold text-ink">{totalFiltered}</span> of{" "}
          <span className="font-semibold text-ink">{totalAll}</span> debt records
        </p>
      </div>
    </div>
  );
}
