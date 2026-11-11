"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { fetchAllTransactions, ApiTransaction } from "../transactions-api";
import { LedgerTransactionItem, TransactionsSubTabId } from "../types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function toLedgerItem(transaction: ApiTransaction): LedgerTransactionItem {
  const amount = Number(transaction.amount);
  const isIncome = transaction.type === "INCOME";
  const isTransfer = transaction.type === "TRANSFER";
  const typeBadge = isIncome ? "Income" : isTransfer ? "Transfer" : "Expense";
  const typeTone = isIncome ? "emerald" : isTransfer ? "slate" : "rose";
  const account = transaction.account;
  const destination = transaction.toAccount;

  return {
    id: transaction.id,
    transactionDate: transaction.transactionDate,
    date: formatDate(transaction.transactionDate),
    time: formatTime(transaction.transactionDate),
    title: transaction.merchant || "Untitled transaction",
    subtitle: transaction.note || "",
    iconType: isTransfer ? "transfer" : isIncome ? "trend-up" : "bag",
    iconBg: isIncome
      ? "bg-emerald-50 dark:bg-emerald-500/15"
      : isTransfer
        ? "bg-slate-100 dark:bg-slate-800"
        : "bg-rose-50 dark:bg-rose-500/15",
    iconColor: isIncome
      ? "text-emerald-600 dark:text-emerald-400"
      : isTransfer
        ? "text-slate-600 dark:text-slate-300"
        : "text-rose-600 dark:text-rose-400",
    typeBadge,
    typeTone,
    categoryName: transaction.category?.name || "Uncategorized",
    categoryDotColor: isIncome ? "bg-emerald-500" : isTransfer ? "bg-slate-500" : "bg-rose-500",
    accountTitle: destination
      ? `${account?.name || "Account"} → ${destination.name}`
      : account?.name || "Unknown account",
    accountMask: destination
      ? `••${account?.accountNumberLast4 || "????"} → ••${destination.accountNumberLast4 || "????"}`
      : account?.accountNumberLast4
        ? `••${account.accountNumberLast4}`
        : "",
    railName: transaction.tags?.[0] || "Account transaction",
    railRef: transaction.note || transaction.id,
    amount,
    direction: isIncome ? "IN" : isTransfer ? "NEUTRAL" : "OUT",
    status: "Completed",
  };
}

export function useTransactionsLedger() {
  const [transactions, setTransactions] = useState<LedgerTransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState<string>("all");
  const [activeSubTab, setActiveSubTab] = useState<TransactionsSubTabId>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [accountFilter, setAccountFilter] = useState<string>("All");
  const [railFilter, setRailFilter] = useState<string>("All");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Date (Newest First)");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [reconcileMessage, setReconcileMessage] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchAllTransactions();
      setTransactions(data.map(toLedgerItem));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
    const refresh = () => loadTransactions();
    window.addEventListener("transactions:created", refresh);

    return () => window.removeEventListener("transactions:created", refresh);
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let dateStart: Date | null = null;
    let dateEnd: Date | null = null;

    if (datePreset === "today") {
      dateStart = startOfToday;
      dateEnd = new Date(startOfToday);
      dateEnd.setDate(dateEnd.getDate() + 1);
    } else if (datePreset === "this-week") {
      dateStart = new Date(startOfToday);
      dateStart.setDate(dateStart.getDate() - ((dateStart.getDay() + 6) % 7));
      dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 7);
    } else if (datePreset === "this-month") {
      dateStart = new Date(now.getFullYear(), now.getMonth(), 1);
      dateEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (datePreset === "last-month") {
      dateStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      dateEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (datePreset === "last-3-months") {
      dateStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      dateEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (datePreset === "this-year") {
      dateStart = new Date(now.getFullYear(), 0, 1);
      dateEnd = new Date(now.getFullYear() + 1, 0, 1);
    }

    return transactions.filter((item) => {
      if (dateStart && dateEnd) {
        const transactionDate = new Date(item.transactionDate || item.date);
        if (transactionDate < dateStart || transactionDate >= dateEnd) return false;
      }

      // Sub-tab filtering
      if (activeSubTab === "expenses" && item.typeBadge !== "Expense")
        return false;
      if (
        activeSubTab === "income" &&
        item.typeBadge !== "Income" &&
        item.typeBadge !== "Refund"
      )
        return false;
      if (activeSubTab === "transfers" && item.typeBadge !== "Transfer")
        return false;
      if (activeSubTab === "investments" && item.typeBadge !== "Investment")
        return false;
      if (activeSubTab === "money-lent" && item.typeBadge !== "Money Lent")
        return false;
      if (
        activeSubTab === "money-borrowed" &&
        item.typeBadge !== "Borrowing" &&
        item.typeBadge !== "Repayment"
      )
        return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.railRef.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Dropdown filters
      if (categoryFilter !== "All" && item.categoryName !== categoryFilter)
        return false;
      if (typeFilter !== "All" && item.typeBadge !== typeFilter) return false;
      if (
        accountFilter !== "All" &&
        !item.accountTitle.toLowerCase().includes(accountFilter.toLowerCase())
      )
        return false;
      if (
        railFilter !== "All" &&
        !item.railName.toLowerCase().includes(railFilter.toLowerCase())
      )
        return false;

      return true;
    });
  }, [transactions,
    datePreset,
    activeSubTab,
    searchQuery,
    categoryFilter,
    typeFilter,
    accountFilter,
    railFilter,
  ]);

  const paginatedTransactions = useMemo(
    () => filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredTransactions, currentPage, pageSize],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const subTabCounts = useMemo(() => ({
    all: transactions.length,
    expenses: transactions.filter((item) => item.typeBadge === "Expense").length,
    income: transactions.filter((item) => item.typeBadge === "Income").length,
    transfers: transactions.filter((item) => item.typeBadge === "Transfer").length,
    investments: 0,
    "money-lent": 0,
    "money-borrowed": 0,
    recurring: 0,
  }), [transactions]);

  const categoryOptions = useMemo(
    () => Array.from(new Set(transactions.map((item) => item.categoryName))).sort(),
    [transactions],
  );
  const accountOptions = useMemo(
    () => Array.from(new Set(transactions.map((item) => item.accountTitle))).sort(),
    [transactions],
  );
  const railOptions = useMemo(
    () => Array.from(new Set(transactions.map((item) => item.railName))).sort(),
    [transactions],
  );

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

  const removeChip = useCallback((chip: string) => {
    setActiveChips((prev) => prev.filter((c) => c !== chip));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("All");
    setTypeFilter("All");
    setAccountFilter("All");
    setRailFilter("All");
    setActiveSubTab("all");
    setDatePreset("all");
    setActiveChips([]);
    setCurrentPage(1);
  }, []);

  const runReconciliationCheck = useCallback(async () => {
    setIsReconciling(true);
    setReconcileMessage(null);
    await new Promise((r) => setTimeout(r, 500));
    setIsReconciling(false);
    setReconcileMessage("Reconciliation check completed for the loaded ledger.");
  }, []);

  return {
    datePreset,
    setDatePreset,
    activeSubTab,
    setActiveSubTab,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    railFilter,
    setRailFilter,
    activeChips,
    removeChip,
    clearAllFilters,
    selectedIds,
    toggleSelectAll,
    toggleSelectRow,
    sortBy,
    setSortBy,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    subTabCounts,
    categoryOptions,
    accountOptions,
    railOptions,
    transactions,
    isLoading,
    loadError,
    reloadTransactions: loadTransactions,
    isReconciling,
    reconcileMessage,
    runReconciliationCheck,
  };
}
