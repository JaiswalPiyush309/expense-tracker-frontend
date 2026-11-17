"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteCategory as deleteCategoryRequest,
  getCategoryOptions,
} from "../categories-api";
import type { CategoryOption } from "../categories-api";
import { fetchAllTransactions } from "@/features/transactions/transactions-api";
import type { CategoryEnvelopeItem, CategoryFilterTabId } from "../types";

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toCategoryItems(
  categories: CategoryOption[],
  transactions: Awaited<ReturnType<typeof fetchAllTransactions>>,
): CategoryEnvelopeItem[] {
  const usageByCategory = new Map<string, { amount: number; count: number }>();

  for (const transaction of transactions) {
    if (transaction.type === "TRANSFER" || !transaction.categoryId) continue;
    const usage = usageByCategory.get(transaction.categoryId) ?? {
      amount: 0,
      count: 0,
    };
    usage.amount += Number(transaction.amount) || 0;
    usage.count += 1;
    usageByCategory.set(transaction.categoryId, usage);
  }

  return categories.map((category) => {
    const usage = usageByCategory.get(category.id);
    return {
      id: category.id,
      group: category.type.toLowerCase() as CategoryEnvelopeItem["group"],
      name: category.name,
      icon: category.icon,
      color: category.color,
      isSystem: category.isSystem,
      isCustom: category.isCustom,
      monthlyVolume: usage?.amount ?? 0,
      txnCount: usage?.count ?? 0,
    };
  });
}

export function useCategoriesTaxonomy() {
  const [categories, setCategories] = useState<CategoryEnvelopeItem[]>([]);
  const [activeTab, setActiveTab] = useState<CategoryFilterTabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Most transactions");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const now = new Date();
    const startDate = formatDateOnly(
      new Date(now.getFullYear(), now.getMonth(), 1),
    );
    const endDate = formatDateOnly(
      new Date(now.getFullYear(), now.getMonth() + 1, 0),
    );

    try {
      const [expenses, income, transactions] = await Promise.all([
        getCategoryOptions("EXPENSE"),
        getCategoryOptions("INCOME"),
        fetchAllTransactions({ startDate, endDate }),
      ]);
      setCategories(toCategoryItems([...expenses, ...income], transactions));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load categories.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
    const refresh = () => void reload();
    window.addEventListener("categories:changed", refresh);
    window.addEventListener("transactions:created", refresh);
    return () => {
      window.removeEventListener("categories:changed", refresh);
      window.removeEventListener("transactions:created", refresh);
    };
  }, [reload, retry]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = categories.filter((item) => {
      if (activeTab !== "all" && item.group !== activeTab) return false;
      if (query && !item.name.toLowerCase().includes(query)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Highest volume") return b.monthlyVolume - a.monthlyVolume;
      if (sortBy === "Alphabetical") return a.name.localeCompare(b.name);
      return b.txnCount - a.txnCount || a.name.localeCompare(b.name);
    });
  }, [categories, activeTab, searchQuery, sortBy]);

  const expenseCategories = useMemo(
    () => filteredCategories.filter((category) => category.group === "expense"),
    [filteredCategories],
  );
  const incomeCategories = useMemo(
    () => filteredCategories.filter((category) => category.group === "income"),
    [filteredCategories],
  );

  const handleDeleteCategory = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteCategoryRequest(id);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to delete category.",
      );
    }
  }, []);

  const resetFilters = useCallback(() => {
    setActiveTab("all");
    setSearchQuery("");
    setSortBy("Most transactions");
    setViewMode("grid");
  }, []);

  return {
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
    retry: () => setRetry((attempt) => attempt + 1),
    handleDeleteCategory,
    resetFilters,
  };
}
