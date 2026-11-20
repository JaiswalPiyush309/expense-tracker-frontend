"use client";

import { Filter, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type {
  LentSortOption,
  LentStatus,
  LentTimeframeFilter,
  RelationshipCategory,
} from "../types";

interface MoneyLentFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: "ALL" | LentStatus;
  onStatusChange: (val: "ALL" | LentStatus) => void;
  timeframeFilter: LentTimeframeFilter;
  onTimeframeChange: (val: LentTimeframeFilter) => void;
  relationshipFilter: "ALL" | RelationshipCategory;
  onRelationshipChange: (val: "ALL" | RelationshipCategory) => void;
  sortBy: LentSortOption;
  onSortChange: (val: LentSortOption) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
}

const STATUS_TABS: { id: "ALL" | LentStatus; label: string }[] = [
  { id: "ALL", label: "All Loans" },
  { id: "PARTIALLY_PAID", label: "Partially Paid" },
  { id: "PENDING", label: "Pending Repayment" },
  { id: "OVERDUE", label: "Overdue" },
  { id: "SETTLED", label: "Fully Settled" },
];

export function MoneyLentFilterToolbar({
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
}: MoneyLentFilterToolbarProps) {
  const isFiltered =
    Boolean(searchQuery) ||
    statusFilter !== "ALL" ||
    timeframeFilter !== "ALL" ||
    relationshipFilter !== "ALL" ||
    sortBy !== "BALANCE_DESC";

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-surface p-3.5 shadow-card sm:p-4">
      {/* Top Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-accent text-white shadow-xs"
                    : "text-muted hover:bg-surface-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-muted">
          Showing <strong className="text-ink">{totalFiltered}</strong> of{" "}
          <span>{totalAll}</span> records
        </div>
      </div>

      {/* Main Filter Inputs Strip */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative min-w-55 flex-1 sm:min-w-64">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search borrower, notes, account..."
            aria-label="Search loans"
            icon={<Search aria-hidden="true" className="h-4 w-4 text-muted" />}
          />
        </div>

        {/* Relationship Filter */}
        <div className="w-full sm:w-auto">
          <Select
            value={relationshipFilter}
            onChange={(e) =>
              onRelationshipChange(e.target.value as "ALL" | RelationshipCategory)
            }
            aria-label="Filter by relationship"
            className="w-full sm:w-44 text-xs"
          >
            <option value="ALL">All Relationships</option>
            <option value="Friend">Friend</option>
            <option value="Colleague">Colleague</option>
            <option value="Family">Family</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        {/* Timeframe Filter */}
        <div className="w-full sm:w-auto">
          <Select
            value={timeframeFilter}
            onChange={(e) =>
              onTimeframeChange(e.target.value as LentTimeframeFilter)
            }
            aria-label="Filter by timeframe"
            className="w-full sm:w-44 text-xs"
          >
            <option value="ALL">All Timeframes</option>
            <option value="DUE_THIS_WEEK">Due this week</option>
            <option value="DUE_THIS_MONTH">Due this month</option>
            <option value="OVERDUE">Overdue only</option>
            <option value="SETTLED">Settled only</option>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto">
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as LentSortOption)}
            aria-label="Sort by"
            className="w-full sm:w-48 text-xs font-medium"
          >
            <option value="BALANCE_DESC">Sort: Highest Due</option>
            <option value="BALANCE_ASC">Sort: Lowest Due</option>
            <option value="DUE_DATE_ASC">Sort: Due Date (Earliest)</option>
            <option value="LENT_DATE_DESC">Sort: Lent Date (Recent)</option>
            <option value="NAME_ASC">Sort: Borrower (A-Z)</option>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-xs text-muted hover:text-bad"
            title="Reset filters"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
