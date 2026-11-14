"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  fetchHoldingDetails,
  fetchHoldings,
  type HoldingResponse,
} from "../../share-market/api/investments-api";
import type { PortfolioHoldingRow, ScripTradeOrder } from "../types";

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toHoldingRow(holding: HoldingResponse): PortfolioHoldingRow {
  const quantity = toNumber(holding.deliveryQuantity) + toNumber(holding.mtfQuantity);
  const currentValue = toNumber(holding.currentValue);
  const investedAmount = toNumber(holding.investedAmount);
  const ticker = holding.tickerSymbol || holding.name;

  return {
    id: holding.id,
    initials: ticker.slice(0, 2).toUpperCase(),
    initialsBg: "bg-indigo-100 dark:bg-indigo-500/20",
    initialsColor: "text-indigo-700 dark:text-indigo-300",
    companyName: holding.name,
    shortName: holding.name,
    symbol: ticker,
    exchange: "—",
    sector: "Unclassified",
    capCategory: holding.assetClass,
    qty: quantity,
    freeDeliveryQty: toNumber(holding.deliveryQuantity),
    freeDeliveryPercent:
      quantity > 0 ? (toNumber(holding.deliveryQuantity) / quantity) * 100 : 0,
    mtfPledgedQty: toNumber(holding.mtfQuantity),
    mtfPledgedPercent:
      quantity > 0 ? (toNumber(holding.mtfQuantity) / quantity) * 100 : 0,
    avgPrice: toNumber(holding.averagePrice),
    investedAmount,
    cmp: quantity > 0 ? currentValue / quantity : 0,
    currentValue,
    dayChangeAmount: 0,
    dayChangePercent: 0,
    netGainAmount: toNumber(holding.unrealizedPnl),
    netGainPercent: toNumber(holding.totalReturnsPercent),
    portfolioWeightPercent: 0,
    high52W: 0,
    low52W: 0,
    sixMonthTrendPercent: 0,
    trendPoints: "",
    tradeOrders: [],
    targetAlertPrice: 0,
    stopLossAlertPrice: 0,
    hasActiveAlert: false,
  };
}

function toTradeOrder(tx: {
  id: string;
  tradeType: string;
  quantity: number | string | null;
  executionPrice: number | string | null;
  chargesAndTaxes: number | string;
  realizedPnl: number | string | null;
  tradeDate: string;
  broker: string;
  segment?: string | null;
}): ScripTradeOrder {
  const quantity = toNumber(tx.quantity);
  const pricePerShare = toNumber(tx.executionPrice);
  return {
    id: tx.id,
    type: tx.tradeType,
    shares: quantity,
    date: new Date(tx.tradeDate).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    pricePerShare,
    totalAmount: quantity * pricePerShare,
    chargesAndTaxes: toNumber(tx.chargesAndTaxes),
    realizedPnl: tx.realizedPnl == null ? null : toNumber(tx.realizedPnl),
    broker: tx.broker,
    segment: tx.segment,
  };
}

export function usePortfolioHoldings() {
  const [holdings, setHoldings] = useState<PortfolioHoldingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [capFilter, setCapFilter] = useState<string>("ALL");
  const [pnlStatusFilter, setPnlStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("Current Value: High to Low");
  const [viewLayout, setViewLayout] = useState<"split" | "grid">("split");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [activeScripId, setActiveScripIdState] = useState<string | null>(null);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setActiveScripIdState(null);
    fetchHoldings()
      .then((data) => {
        const mapped = data.map(toHoldingRow);
        const totalCurrentValue = mapped.reduce((sum, h) => sum + h.currentValue, 0);
        const weighted = mapped.map((h) => ({
          ...h,
          portfolioWeightPercent:
            totalCurrentValue > 0 ? (h.currentValue / totalCurrentValue) * 100 : 0,
        }));
        setHoldings(weighted);
        setSelectedRowIds([]);
        setActiveScripIdState(weighted[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load holdings.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const setActiveScripId = useCallback((id: string | null) => {
    setActiveScripIdState(id);
  }, []);

  useEffect(() => {
    if (!activeScripId) {
      setDetailsLoading(false);
      return;
    }

    let isCurrent = true;
    setDetailsError(null);
    setDetailsLoading(true);
    fetchHoldingDetails(activeScripId)
      .then(({ recentTrades }) => {
        if (!isCurrent) return;
        const trades = recentTrades.map(toTradeOrder);
        setHoldings((current) =>
          current.map((holding) =>
            holding.id === activeScripId ? { ...holding, tradeOrders: trades } : holding,
          ),
        );
      })
      .catch((err: unknown) => {
        if (!isCurrent) return;
        setDetailsError(
          err instanceof Error ? err.message : "Could not load transaction history.",
        );
      })
      .finally(() => {
        if (isCurrent) setDetailsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeScripId]);

  const filteredHoldings = useMemo(() => {
    const list = holdings.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !item.companyName.toLowerCase().includes(q) &&
          !item.symbol.toLowerCase().includes(q) &&
          !item.sector.toLowerCase().includes(q)
        ) return false;
      }
      if (capFilter !== "ALL" && item.capCategory !== capFilter) return false;
      if (pnlStatusFilter === "PROFIT" && item.netGainAmount < 0) return false;
      if (pnlStatusFilter === "LOSS" && item.netGainAmount >= 0) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === "Current Value: High to Low") return b.currentValue - a.currentValue;
      if (sortBy === "Invested: High to Low") return b.investedAmount - a.investedAmount;
      if (sortBy === "Returns %: High to Low") return b.netGainPercent - a.netGainPercent;
      return 0;
    });
  }, [holdings, searchQuery, capFilter, pnlStatusFilter, sortBy]);

  const activeScrip = useMemo(
    () => holdings.find((holding) => holding.id === activeScripId) ?? null,
    [holdings, activeScripId],
  );

  const toggleSelectAll = useCallback(() => {
    setSelectedRowIds((current) =>
      current.length === filteredHoldings.length
        ? []
        : filteredHoldings.map((holding) => holding.id),
    );
  }, [filteredHoldings]);

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedRowIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCapFilter("ALL");
    setPnlStatusFilter("ALL");
    setSortBy("Current Value: High to Low");
  }, []);

  return {
    searchQuery, setSearchQuery,
    capFilter, setCapFilter,
    pnlStatusFilter, setPnlStatusFilter,
    sortBy, setSortBy,
    viewLayout, setViewLayout,
    selectedRowIds, toggleSelectAll, toggleSelectRow,
    activeScrip, setActiveScripId,
    filteredHoldings, resetFilters,
    allHoldings: holdings,
    isLoading, error, detailsError, detailsLoading, reload,
  };
}
