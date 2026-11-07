"use client";

import { useEffect, useMemo, useState } from "react";
import { AddTransactionDialog } from "@/components/transactions/add-transaction";
import { IncomeHeader } from "./components/IncomeHeader";
import { IncomeFilterToolbar } from "./components/IncomeFilterToolbar";
import { IncomeSummaryBanner } from "./components/IncomeSummaryBanner";
import { IncomeKpiGrid } from "./components/IncomeKpiGrid";
import { IncomeBySourceCard } from "./components/IncomeBySourceCard";
import { InflowVelocityCard } from "./components/InflowVelocityCard";
import { IncomeTabsToolbar, type IncomeLedgerTab } from "./components/IncomeTabsToolbar";
import { IncomeLedgerTable } from "./components/IncomeLedgerTable";
import { useIncomeAnalytics } from "./hooks/useIncomeAnalytics";

export function IncomeView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [datePreset, setDatePreset] = useState("this-month");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Received");
  const [activeTab, setActiveTab] = useState<IncomeLedgerTab>("all");
  const [sortBy, setSortBy] = useState("Date (Newest)");
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { transactions, isLoading, error } = useIncomeAnalytics();

  const filteredTransactions = useMemo(() => transactions
    .filter((item) => {
      const query = searchQuery.trim().toLowerCase();
      if (query && !`${item.merchant ?? ""} ${item.note ?? ""} ${item.category?.name ?? ""} ${item.account?.name ?? ""}`.toLowerCase().includes(query)) return false;
      if (categoryFilter !== "All" && item.category?.id !== categoryFilter) return false;
      if (accountFilter !== "All" && item.account?.id !== accountFilter) return false;
      if (activeTab === "uncategorized" && item.category) return false;
      // The current transaction API has no persisted payment-mode or pending status fields.
      if (statusFilter === "Pending") return false;
      return true;
    })
    .sort((a, b) => sortBy === "Amount (High to Low)"
      ? Number(b.amount) - Number(a.amount)
      : new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()),
  [transactions, searchQuery, categoryFilter, accountFilter, activeTab, sortBy, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const pageItems = useMemo(() => filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize), [filteredTransactions, currentPage, pageSize]);
  const uncategorizedCount = transactions.filter((item) => !item.category).length;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, categoryFilter, modeFilter, accountFilter, statusFilter, activeTab, sortBy, pageSize]);
  useEffect(() => { setCurrentPage((page) => Math.min(page, pageCount)); }, [pageCount]);

  const toggleSelectAll = () => {
    const pageIds = pageItems.map((item) => item.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allSelected ? current.filter((id) => !pageIds.includes(id)) : [...new Set([...current, ...pageIds])]);
  };
  const toggleSelectRow = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const resetFilters = () => {
    setDatePreset("this-month");
    setSearchQuery("");
    setCategoryFilter("All");
    setModeFilter("All");
    setAccountFilter("All");
    setStatusFilter("Received");
    setActiveTab("all");
    setSortBy("Date (Newest)");
    setSelectedIds([]);
  };

  const exportCsv = () => {
    const rows = [
      ["Date", "Description", "Category", "Account", "Amount"],
      ...filteredTransactions.map((item) => [
        item.transactionDate,
        item.merchant ?? item.note ?? "Income",
        item.category?.name ?? "Uncategorized",
        item.account?.name ?? "",
        String(item.amount),
      ]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "income-ledger.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto w-full max-w-350 space-y-6 p-4 pb-10 sm:p-6">
      <IncomeHeader onOpenAddIncome={() => setIsAddModalOpen(true)} onExportCsv={exportCsv} />
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
        onStatusToggle={() => setStatusFilter((current) => current === "Received" ? "Pending" : "Received")}
        onReset={resetFilters}
      />
      <IncomeSummaryBanner />
      <IncomeKpiGrid />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2"><IncomeBySourceCard /><InflowVelocityCard /></div>
      <IncomeTabsToolbar activeTab={activeTab} onTabChange={setActiveTab} totalCount={transactions.length} uncategorizedCount={uncategorizedCount} />
      <IncomeLedgerTable
        items={pageItems}
        total={filteredTransactions.length}
        selectedIds={selectedIds}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectRow={toggleSelectRow}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        error={error}
      />
      <AddTransactionDialog isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} initialType="income" />
    </main>
  );
}
