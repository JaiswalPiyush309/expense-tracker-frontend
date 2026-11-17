"use client";

import { useState } from "react";
import { useCategoriesTaxonomy } from "./hooks/useCategoriesTaxonomy";
import { CategoriesHeader } from "./components/CategoriesHeader";
import { CategoriesKpiGrid } from "./components/CategoriesKpiGrid";
import { CategoriesFilterToolbar } from "./components/CategoriesFilterToolbar";
import { CategoriesAnalyticsRow } from "./components/CategoriesAnalyticsRow";

export function CategoriesView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    hierarchyFilter,
    setHierarchyFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    expenseCategories,
    incomeCategories,
    compliantFrameworks,
    handleAddCategory,
    resetFilters,
  } = useCategoriesTaxonomy();

  return (
    <div className="space-y-5 p-5">
      {/* Page Header */}
      <CategoriesHeader onOpenAddCategory={() => setIsAddModalOpen(true)} />

      {/* 4-Card KPI Strip */}
      <CategoriesKpiGrid />

      {/* Taxonomy Tabs & Search/Filter Bar */}
      <CategoriesFilterToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        hierarchyFilter={hierarchyFilter}
        onHierarchyFilterChange={setHierarchyFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={resetFilters}
      />

      {/* 3-Column Analytics Row */}
      <CategoriesAnalyticsRow />
    </div>
  );
}
