"use client";

import { useState } from "react";
import { useCategoriesTaxonomy } from "./hooks/useCategoriesTaxonomy";
import { CategoriesHeader } from "./components/CategoriesHeader";
import { CategoriesKpiGrid } from "./components/CategoriesKpiGrid";

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
    </div>
  );
}
