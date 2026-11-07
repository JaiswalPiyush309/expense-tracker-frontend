"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Download,
  Plus,
  Search,
  Wallet,
} from "lucide-react";
import { IncomeHeader } from "./components/IncomeHeader";
import { INCOME_TRANSACTIONS_MOCK } from "./data/mock";
import { AddTransactionDialog } from "@/components/transactions/add-transaction";
import { useIncomeFilters } from "./hooks/useIncomeFilters";
import { IncomeFilterToolbar } from "./components/IncomeFilterToolbar";
import { IncomeSummaryBanner } from "./components/IncomeSummaryBanner";
import { IncomeKpiGrid } from "./components/IncomeKpiGrid";
import { IncomeBySourceCard } from "./components/IncomeBySourceCard";
import { InflowVelocityCard } from "./components/InflowVelocityCard";

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export function IncomeView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [mode, setMode] = useState("All methods");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Newest first");

  const {
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
  } = useIncomeFilters();

  const categories = useMemo(
    () => [...new Set(INCOME_TRANSACTIONS_MOCK.map((item) => item.category))],
    [],
  );
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return INCOME_TRANSACTIONS_MOCK.filter(
      (item) =>
        !normalizedQuery ||
        `${item.payerName} ${item.description} ${item.channelRef}`
          .toLowerCase()
          .includes(normalizedQuery),
    )
      .filter(
        (item) => category === "All categories" || item.category === category,
      )
      .filter((item) => mode === "All methods" || item.mode === mode)
      .filter((item) => status === "All statuses" || item.status === status)
      .sort((a, b) =>
        sort === "Highest amount"
          ? b.amount - a.amount
          : sort === "Lowest amount"
            ? a.amount - b.amount
            : sort === "Oldest first"
              ? Date.parse(a.date) - Date.parse(b.date)
              : Date.parse(b.date) - Date.parse(a.date),
      );
  }, [category, mode, query, sort, status]);

  const received = INCOME_TRANSACTIONS_MOCK.filter(
    (item) => item.status === "Received",
  ).reduce((sum, item) => sum + item.amount, 0);
  const pending = INCOME_TRANSACTIONS_MOCK.filter(
    (item) => item.status === "Pending",
  ).reduce((sum, item) => sum + item.amount, 0);
  const sources = new Set(
    INCOME_TRANSACTIONS_MOCK.map((item) => item.payerName),
  ).size;
  const sourceBreakdown = useMemo(() => {
    const totals = new Map<string, number>();
    INCOME_TRANSACTIONS_MOCK.filter(
      (item) => item.status === "Received",
    ).forEach((item) =>
      totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount),
    );
    return [...totals.entries()].sort((a, b) => b[1] - a[1]);
  }, []);
  const largestSourceTotal = sourceBreakdown[0]?.[1] ?? 1;

  const exportCsv = () => {
    const rows = [
      [
        "Date",
        "Payer",
        "Description",
        "Category",
        "Method",
        "Account",
        "Amount",
        "Status",
      ],
      ...filtered.map((item) => [
        item.date,
        item.payerName,
        item.description,
        item.category,
        item.mode,
        `${item.accountTitle} ${item.accountMask}`.trim(),
        String(item.amount),
        item.status,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "income-ledger.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto w-full max-w-350 space-y-6 p-4 pb-10 sm:p-6">
      <IncomeHeader
        onOpenAddIncome={() => setIsAddModalOpen(true)}
        onExportCsv={exportCsv}
      />

      {/* Date Presets & Search Filter Bar */}
      <IncomeFilterToolbar
        datePreset={datePreset}
        onDatePresetChange={setDatePreset}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        modeFilter={modeFilter}
        onModeChange={setModeFilter}
        accountFilter={accountFilter}
        onAccountChange={setAccountFilter}
        statusFilter={statusFilter}
        onStatusToggle={() =>
          setStatusFilter((prev) =>
            prev === "Received" ? "Pending" : "Received",
          )
        }
        onReset={resetFilters}
      />

      {/* Filtered Total Inflow & NSDL Sync Banner */}
      <IncomeSummaryBanner />

      {/* 6-Card KPI Strip */}
      <IncomeKpiGrid />

      {/* 2-Column Analytics Section: Source Donut + Inflow Velocity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IncomeBySourceCard />
        <InflowVelocityCard />
      </div>
    </main>
  );
}
