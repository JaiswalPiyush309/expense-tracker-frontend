"use client";

import {
  ListOrdered,
  RotateCcw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import type { CategoryFilterTabId } from "../types";

interface CategoriesFilterToolbarProps {
  activeTab: CategoryFilterTabId;
  onTabChange: (tab: CategoryFilterTabId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
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

const categoryTabs = [
  { id: "all", label: "All categories" },
  { id: "expense", label: "Expense categories" },
  { id: "income", label: "Income categories" },
] as const;

export function CategoriesFilterToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onReset,
}: CategoriesFilterToolbarProps) {
  const hasActiveFilters =
    searchQuery.length > 0 ||
    activeTab !== "all" ||
    sortBy !== "Most transactions" ||
    viewMode !== "grid";

  return (
    <Card className="space-y-4 p-4">
      <div className="overflow-x-auto pb-1">
        <SegmentedControl
          semantics="tabs"
          label="Category groups"
          value={activeTab}
          onChange={onTabChange}
          options={categoryTabs.map(({ id, label }) => ({ value: id, label }))}
          className="min-w-max"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4 lg:flex-row lg:items-center">
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search categories"
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
            <option value="Most transactions">Most transactions</option>
            <option value="Highest volume">Highest monthly amount</option>
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

    </Card>
  );
}
