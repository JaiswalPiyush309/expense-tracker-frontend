"use client";

import { useState } from "react";
import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { useCategoriesTaxonomy } from "./hooks/useCategoriesTaxonomy";
import { CategoriesHeader } from "./components/CategoriesHeader";
import { CategoriesKpiGrid } from "./components/CategoriesKpiGrid";
import { CategoriesFilterToolbar } from "./components/CategoriesFilterToolbar";
import { CategoriesAnalyticsRow } from "./components/CategoriesAnalyticsRow";
import { CategorySectionGroup } from "./components/CategorySectionGroup";
import { AddCategoryModal } from "./components/AddCategoryModal";
import { SkeletonCard } from "@/components/ui/loaders";
import type { CategoryEnvelopeItem } from "./types";

export function CategoriesView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryEnvelopeItem | null>(null);

  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    expenseCategories,
    incomeCategories,
    isLoading,
    error,
    retry,
    handleDeleteCategory,
    resetFilters,
  } = useCategoriesTaxonomy();

  return (
    <div className="space-y-5 p-5">
      {/* Page Header */}
      <CategoriesHeader onOpenAddCategory={() => setIsAddModalOpen(true)} />

      {/* 4-Card KPI Strip */}
      <CategoriesKpiGrid />

      {/* Category tabs and filters */}
      <CategoriesFilterToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={resetFilters}
      />

      <CategoriesAnalyticsRow />

      {error && (
        <Callout
          icon={<AlertCircle className="h-4 w-4" />}
          className="justify-between"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>{error}</p>
            <Button type="button" variant="secondary" size="sm" onClick={retry}>
              <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        </Callout>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard variant="table" rows={6} />
        </div>
      ) : !error ? (
        <>
          <CategorySectionGroup
            title="Expense categories"
            type="expense"
            items={expenseCategories}
            viewMode={viewMode}
            onEdit={setEditingCategory}
            onDelete={handleDeleteCategory}
          />
          <CategorySectionGroup
            title="Income categories"
            type="income"
            items={incomeCategories}
            viewMode={viewMode}
            onEdit={setEditingCategory}
            onDelete={handleDeleteCategory}
          />
        </>
      ) : null}

      <AddCategoryModal
        isOpen={isAddModalOpen || editingCategory !== null}
        category={editingCategory}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCategory(null);
        }}
      />
    </div>
  );
}
