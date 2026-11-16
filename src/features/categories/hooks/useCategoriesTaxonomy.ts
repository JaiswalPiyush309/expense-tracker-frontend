"use client";

import { useState, useMemo, useCallback } from "react";
import { CATEGORY_ENVELOPES_MOCK } from "../data/mock";
import { CategoryEnvelopeItem, CategoryFilterTabId } from "../types";

export function useCategoriesTaxonomy() {
  const [categories, setCategories] = useState<CategoryEnvelopeItem[]>(
    CATEGORY_ENVELOPES_MOCK,
  );
  const [activeTab, setActiveTab] = useState<CategoryFilterTabId>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [hierarchyFilter, setHierarchyFilter] =
    useState<string>("All Hierarchies");
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [sortBy, setSortBy] = useState<string>("Highest Usage");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((item) => {
      if (activeTab === "expense" && item.group !== "expense") return false;
      if (activeTab === "income" && item.group !== "income") return false;
      if (activeTab === "transfers" && item.group !== "transfer") return false;
      if (activeTab === "investments" && item.group !== "investment")
        return false;
      if (activeTab === "lending" && item.group !== "lending") return false;

      if (typeFilter === "Expense" && item.group !== "expense") return false;
      if (typeFilter === "Income" && item.group !== "income") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSub = item.hierarchySubtitle.toLowerCase().includes(q);
        const matchesTag = item.subcategories.some((sub) =>
          sub.toLowerCase().includes(q),
        );
        if (!matchesName && !matchesSub && !matchesTag) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Highest Volume") {
        return b.monthlyVolume - a.monthlyVolume;
      }
      if (sortBy === "Alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0; // Keep default taxonomy order for "Highest Usage"
    });
  }, [categories, activeTab, typeFilter, searchQuery, sortBy]);

  const expenseCategories = useMemo(
    () => filteredCategories.filter((c) => c.group === "expense"),
    [filteredCategories],
  );

  const incomeCategories = useMemo(
    () => filteredCategories.filter((c) => c.group === "income"),
    [filteredCategories],
  );

  const compliantFrameworks = useMemo(
    () =>
      filteredCategories.filter(
        (c) =>
          c.group === "transfer" ||
          c.group === "investment" ||
          c.group === "lending",
      ),
    [filteredCategories],
  );

  const handleAddCategory = useCallback(
    (newCat: Omit<CategoryEnvelopeItem, "id">) => {
      const created: CategoryEnvelopeItem = {
        ...newCat,
        id: `cat-${Date.now()}`,
      };
      setCategories((prev) => [created, ...prev]);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setActiveTab("all");
    setSearchQuery("");
    setTypeFilter("All Types");
    setHierarchyFilter("All Hierarchies");
    setStatusFilter("Active");
    setSortBy("Highest Usage");
  }, []);

  return {
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
  };
}
