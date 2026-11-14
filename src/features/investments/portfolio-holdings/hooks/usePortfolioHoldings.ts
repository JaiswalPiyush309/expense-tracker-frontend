"use client";

import { useState, useMemo, useCallback } from "react";
import { PORTFOLIO_HOLDINGS_MOCK } from "../data/mock";

export function usePortfolioHoldings() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [exchangeFilter, setExchangeFilter] = useState<string>("ALL");
  const [sectorFilter, setSectorFilter] = useState<string>("ALL");
  const [capFilter, setCapFilter] = useState<string>("ALL");
  const [pnlStatusFilter, setPnlStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("Current Value: High to Low");
  const [viewLayout, setViewLayout] = useState<"split" | "grid">("split");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(["reliance"]);
  const [activeScripId, setActiveScripId] = useState<string | null>("reliance");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredHoldings = useMemo(() => {
    const list = PORTFOLIO_HOLDINGS_MOCK.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.companyName.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          item.sector.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (exchangeFilter !== "ALL" && item.exchange !== exchangeFilter) {
        return false;
      }

      if (sectorFilter !== "ALL" && item.sector !== sectorFilter) {
        return false;
      }

      if (capFilter !== "ALL" && item.capCategory !== capFilter) {
        return false;
      }

      if (pnlStatusFilter === "PROFIT" && item.netGainAmount < 0) {
        return false;
      }
      if (pnlStatusFilter === "LOSS" && item.netGainAmount >= 0) {
        return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "Current Value: High to Low") {
        return b.currentValue - a.currentValue;
      }
      if (sortBy === "Invested: High to Low") {
        return b.investedAmount - a.investedAmount;
      }
      if (sortBy === "Returns %: High to Low") {
        return b.netGainPercent - a.netGainPercent;
      }
      return 0;
    });
  }, [
    searchQuery,
    exchangeFilter,
    sectorFilter,
    capFilter,
    pnlStatusFilter,
    sortBy,
  ]);

  const activeScrip = useMemo(() => {
    if (!activeScripId) return null;
    return (
      PORTFOLIO_HOLDINGS_MOCK.find((s) => s.id === activeScripId) ??
      PORTFOLIO_HOLDINGS_MOCK[0]
    );
  }, [activeScripId]);

  const toggleSelectAll = useCallback(() => {
    if (selectedRowIds.length === filteredHoldings.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredHoldings.map((h) => h.id));
    }
  }, [filteredHoldings, selectedRowIds.length]);

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setExchangeFilter("ALL");
    setSectorFilter("ALL");
    setCapFilter("ALL");
    setPnlStatusFilter("ALL");
    setSortBy("Current Value: High to Low");
    setCurrentPage(1);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    exchangeFilter,
    setExchangeFilter,
    sectorFilter,
    setSectorFilter,
    capFilter,
    setCapFilter,
    pnlStatusFilter,
    setPnlStatusFilter,
    sortBy,
    setSortBy,
    viewLayout,
    setViewLayout,
    selectedRowIds,
    toggleSelectAll,
    toggleSelectRow,
    activeScrip,
    setActiveScripId,
    currentPage,
    setCurrentPage,
    filteredHoldings,
    resetFilters,
  };
}
