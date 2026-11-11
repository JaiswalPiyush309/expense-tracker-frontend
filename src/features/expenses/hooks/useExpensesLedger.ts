"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAllTransactions, type ApiTransaction } from "@/features/transactions/transactions-api";
import { ExpenseTransactionRow, ExpensesSubTabId } from "../types";

const categoryColors = [
  { dot: "bg-indigo-600", bar: "bg-indigo-600", stroke: "#4f46e5" },
  { dot: "bg-emerald-600", bar: "bg-emerald-600", stroke: "#059669" },
  { dot: "bg-rose-600", bar: "bg-rose-600", stroke: "#e11d48" },
  { dot: "bg-indigo-800", bar: "bg-indigo-800", stroke: "#3730a3" },
  { dot: "bg-emerald-400", bar: "bg-emerald-400", stroke: "#34d399" },
  { dot: "bg-slate-300 dark:bg-slate-600", bar: "bg-slate-300 dark:bg-slate-600", stroke: "#cbd5e1" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function paymentRailType(value: string): ExpenseTransactionRow["paymentRailType"] {
  const rail = value.toLowerCase();
  if (rail.includes("upi")) return "upi";
  if (rail.includes("card")) return "card";
  if (rail.includes("auto") || rail.includes("nach")) return "autodebit";
  if (rail.includes("bank") || rail.includes("neft")) return "netbanking";
  return "bbps";
}

function toExpenseRow(transaction: ApiTransaction): ExpenseTransactionRow {
  const category = transaction.category?.name || "Uncategorized";
  const rail = transaction.tags?.[0] || "Account transaction";
  const color = categoryColors[Math.abs(category.length) % categoryColors.length];
  return {
    id: transaction.id,
    transactionDate: transaction.transactionDate,
    date: formatDate(transaction.transactionDate),
    time: formatTime(transaction.transactionDate),
    merchantTitle: transaction.merchant || "Untitled expense",
    merchantSubtitle: transaction.note || "",
    iconType: "bag",
    iconBg: "bg-rose-50 dark:bg-rose-500/15",
    iconColor: "text-rose-600 dark:text-rose-400",
    categoryEnvelope: category,
    categoryDotColor: color.dot,
    paymentRail: rail,
    paymentRailType: paymentRailType(rail),
    sourceAccount: transaction.account
      ? `${transaction.account.name}${transaction.account.accountNumberLast4 ? ` ••${transaction.account.accountNumberLast4}` : ""}`
      : "Unknown account",
    hasReceipt: false,
    amount: Number(transaction.amount),
    status: "Paid",
  };
}

export function useExpensesLedger() {
  const [expenses, setExpenses] = useState<ExpenseTransactionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [referenceNow, setReferenceNow] = useState<number | null>(null);
  const [datePreset, setDatePreset] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [statusFilterActive, setStatusFilterActive] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<ExpensesSubTabId>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Date (Newest)");
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const transactions = await fetchAllTransactions();
      setExpenses(transactions.filter((transaction) => transaction.type === "EXPENSE").map(toExpenseRow));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load expenses.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setReferenceNow(Date.now());
    loadExpenses();
    const refresh = () => loadExpenses();
    window.addEventListener("transactions:created", refresh);
    return () => window.removeEventListener("transactions:created", refresh);
  }, [loadExpenses]);

  const filteredExpenses = useMemo(() => {
    const now = referenceNow === null ? null : new Date(referenceNow);
    const today = now ? new Date(now.getFullYear(), now.getMonth(), now.getDate()) : null;
    let start: Date | null = null;
    let end: Date | null = null;
    if (now && today && datePreset === "today") {
      start = today; end = new Date(today); end.setDate(end.getDate() + 1);
    } else if (now && today && datePreset === "this-week") {
      start = new Date(today); start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
      end = new Date(start); end.setDate(end.getDate() + 7);
    } else if (now && datePreset === "this-month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (now && datePreset === "last-month") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1); end = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (now && datePreset === "last-3-months") {
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (now && datePreset === "this-year") {
      start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear() + 1, 0, 1);
    }

    const result = expenses.filter((item) => {
      if (start && end) {
        const transactionDate = new Date(item.transactionDate);
        if (transactionDate < start || transactionDate >= end) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (![item.merchantTitle, item.merchantSubtitle, item.categoryEnvelope, item.paymentRail].some((value) => value.toLowerCase().includes(query))) return false;
      }
      if (categoryFilter !== "All" && item.categoryEnvelope !== categoryFilter) return false;
      if (paymentFilter !== "All" && !item.paymentRail.toLowerCase().includes(paymentFilter.toLowerCase())) return false;
      if (accountFilter !== "All" && !item.sourceAccount.toLowerCase().includes(accountFilter.toLowerCase())) return false;
      if (activeSubTab === "receipts-vault" && !item.hasReceipt) return false;
      return true;
    });
    return [...result].sort((a, b) => sortBy === "Amount (Highest)"
      ? b.amount - a.amount
      : new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [expenses, referenceNow, datePreset, searchQuery, categoryFilter, paymentFilter, accountFilter, activeSubTab, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / pageSize));
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const categoryOptions = Array.from(new Set(expenses.map((item) => item.categoryEnvelope))).sort();
  const paymentOptions = Array.from(new Set(expenses.map((item) => item.paymentRail))).sort();
  const accountOptions = Array.from(new Set(expenses.map((item) => item.sourceAccount))).sort();
  const totalAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const categoryShares = Array.from(
    filteredExpenses.reduce((groups, item) => groups.set(item.categoryEnvelope, (groups.get(item.categoryEnvelope) || 0) + item.amount), new Map<string, number>()),
  ).sort(([, a], [, b]) => b - a).map(([name, amount], index) => {
    const color = categoryColors[index % categoryColors.length];
    return {
      id: name,
      name,
      amount,
      amountFormatted: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount),
      percentage: totalAmount ? (amount / totalAmount) * 100 : 0,
      strokeColor: color.stroke,
      dotColorClass: color.dot,
      barColorClass: color.bar,
      filterCategoryMatch: name,
    };
  });
  const paymentRailShares = Array.from(
    filteredExpenses.reduce((groups, item) => groups.set(item.paymentRail, (groups.get(item.paymentRail) || 0) + item.amount), new Map<string, number>()),
  ).sort(([, a], [, b]) => b - a).slice(0, 4).map(([label, amount], index) => ({
    id: label,
    label,
    percentage: `${totalAmount ? ((amount / totalAmount) * 100).toFixed(1) : "0.0"}%`,
    iconType: (["qr", "card", "bank", "cash"] as const)[index],
  }));
  const pacingValues = filteredExpenses.slice().sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()).slice(-12).map((item) => item.amount);
  const subTabCounts = {
    all: expenses.length,
    recurring: 0,
    "rules-budgets": 0,
    "receipts-vault": expenses.filter((item) => item.hasReceipt).length,
  };

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((current) => current.length === filteredExpenses.length ? [] : filteredExpenses.map((item) => item.id));
  }, [filteredExpenses]);
  const toggleSelectRow = useCallback((id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }, []);
  const handleCategorySliceClick = useCallback((categoryName?: string) => {
    if (categoryName) setCategoryFilter((current) => current === categoryName ? "All" : categoryName);
  }, []);
  const resetFilters = useCallback(() => {
    setDatePreset("all"); setSearchQuery(""); setCategoryFilter("All"); setPaymentFilter("All");
    setAccountFilter("All"); setStatusFilterActive(true); setActiveSubTab("all"); setCurrentPage(1);
  }, []);

  return {
    datePreset, setDatePreset, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter,
    paymentFilter, setPaymentFilter, accountFilter, setAccountFilter, statusFilterActive,
    setStatusFilterActive, activeSubTab, setActiveSubTab, selectedIds, toggleSelectAll,
    toggleSelectRow, sortBy, setSortBy, pageSize, setPageSize, currentPage, setCurrentPage,
    filteredExpenses, paginatedExpenses, totalPages, totalAmount, expenses, categoryOptions,
    paymentOptions, accountOptions, subTabCounts, categoryShares, paymentRailShares, pacingValues,
    isLoading, loadError, handleCategorySliceClick,
    resetFilters,
  };
}
