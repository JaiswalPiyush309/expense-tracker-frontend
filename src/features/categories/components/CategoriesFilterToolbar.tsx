"use client";

import {
  CheckCircle2,
  GitBranch,
  ListFilter,
  ListOrdered,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import { CATEGORY_FILTER_TABS } from "../data/mock";
import type { CategoryFilterTabId } from "../types";

interface CategoriesFilterToolbarProps {
  activeTab: CategoryFilterTabId;
  onTabChange: (tab: CategoryFilterTabId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  hierarchyFilter: string;
  onHierarchyFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onReset: () => void;
}

const viewOptions = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
] as const;

export function CategoriesFilterToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  hierarchyFilter,
  onHierarchyFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onReset,
}: CategoriesFilterToolbarProps) {
  const hasActiveFilters =
    searchQuery.length > 0 ||
    activeTab !== "all" ||
    typeFilter !== "All Types" ||
    hierarchyFilter !== "All Hierarchies" ||
    statusFilter !== "Active" ||
    sortBy !== "Highest Usage";

  return (
    <Card className="space-y-4 p-4">
      <div className="overflow-x-auto pb-1">
        <SegmentedControl
          semantics="tabs"
          label="Category groups"
          value={activeTab}
          onChange={onTabChange}
          options={CATEGORY_FILTER_TABS.map(({ id, label }) => ({
            value: id,
            label,
          }))}
          className="min-w-max"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4 lg:flex-row lg:items-center">
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search categories or subcategories"
          aria-label="Search categories"
          icon={<Search className="h-4 w-4" />}
          className="min-w-0 flex-1"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Sort categories"
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}
            icon={<ListOrdered className="h-4 w-4" />}
            className="min-w-48 flex-1 sm:flex-none"
          >
            <option value="Highest Usage">Highest usage</option>
            <option value="Highest Volume">Highest volume</option>
            <option value="Alphabetical">Alphabetical</option>
          </Select>

          <SegmentedControl
            label="Category layout"
            value={viewMode}
            onChange={onViewModeChange}
            options={viewOptions}
            className="h-10"
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={!hasActiveFilters}
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="inline-flex items-center gap-1.5 pr-1 text-xs font-semibold text-muted">
          <ListFilter aria-hidden="true" className="h-3.5 w-3.5" />
          Filters
        </span>

        <Select
          aria-label="Filter by category type"
          value={typeFilter}
          onChange={(event) => onTypeFilterChange(event.target.value)}
          className="min-w-36"
        >
          <option value="All Types">All types</option>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </Select>

        <Select
          aria-label="Filter by hierarchy"
          value={hierarchyFilter}
          onChange={(event) => onHierarchyFilterChange(event.target.value)}
          icon={<GitBranch className="h-4 w-4" />}
          className="min-w-44"
        >
          <option value="All Hierarchies">All hierarchies</option>
          <option value="Fixed Essential">Fixed essential</option>
          <option value="Discretionary">Discretionary</option>
        </Select>

        <Select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          icon={<CheckCircle2 className="h-4 w-4" />}
          className="min-w-36"
        >
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </Select>
      </div>
    </Card>
  );
}
