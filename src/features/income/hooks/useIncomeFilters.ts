"use client";

import { useState, useMemo, useCallback } from "react";
import { IncomeSubTab } from "../types";
import { INCOME_TRANSACTIONS_MOCK } from "../data/mock";

export function useIncomeFilters() {
  const [datePreset, setDatePreset] = useState<string>("this-month");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [modeFilter, setModeFilter] = useState<string>("All");
  const [accountFilter, setAccountFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("Received");
  const [activeTab, setActiveTab] = useState<IncomeSubTab>("all");
  const [sortBy, setSortBy] = useState<string>("Date (Newest)");
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredTransactions = useMemo(() => {
    return INCOME_TRANSACTIONS_MOCK.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.payerName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.channelRef.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (categoryFilter !== "All" && item.category !== categoryFilter) {
        return false;
      }

      if (modeFilter !== "All" && item.mode !== modeFilter) {
        return false;
      }

      if (
        accountFilter !== "All" &&
        !item.accountTitle.toLowerCase().includes(accountFilter.toLowerCase())
      ) {
        return false;
      }

      if (activeTab === "pending-invoices" && item.status !== "Pending") {
        return false;
      }

      return true;
    });
  }, [searchQuery, categoryFilter, modeFilter, accountFilter, activeTab]);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    }
  }, [filteredTransactions, selectedIds.length]);

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("All");
    setModeFilter("All");
    setAccountFilter("All");
    setStatusFilter("Received");
    setActiveTab("all");
    setCurrentPage(1);
  }, []);

  return {
    datePreset,
    setDatePreset,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    modeFilter,
    setModeFilter,
    accountFilter,
    setAccountFilter,
    statusFilter,
    setStatusFilter,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedIds,
    toggleSelectAll,
    toggleSelectRow,
    filteredTransactions,
    resetFilters,
  };
}
