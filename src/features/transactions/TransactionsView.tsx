"use client";

import { useState } from "react";
import { AddTransactionDialog } from "@/components/transactions/add-transaction";
import { TransactionsHeader } from "./components/TransactionsHeader";
import { useTransactionsLedger } from "./hooks/useTransactionsLedger";
import { TransactionsDateToolbar } from "./components/TransactionsDateToolbar";
import { TransactionsKpiGrid } from "./components/TransactionsKpiGrid";
import { TransactionsSubTabs } from "./components/TransactionsSubTabs";
import { TransactionsFilterPanel } from "./components/TransactionsFilterPanel";
import { LedgerHealthStrip } from "./components/LedgerHealthStrip";
import { MasterTransactionsTable } from "./components/MasterTransactionsTable";
import { DoubleEntryBanner } from "./components/DoubleEntryBanner";

export function TransactionsView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
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
    isReconciling,
    reconcileMessage,
    runReconciliationCheck,
  } = useTransactionsLedger();

  return (
    <main className="mx-auto w-full max-w-350 space-y-6 p-4 pb-10 sm:p-6">
      <TransactionsHeader
        onOpenAddTransaction={() => setIsAddModalOpen(true)}
      />

      {/* Date Presets & Double-Entry Compliance Strip */}
      <TransactionsDateToolbar
        datePreset={datePreset}
        onDatePresetChange={setDatePreset}
        onResetRange={() => setDatePreset("all")}
        filteredCount={filteredTransactions.length}
        filteredVolume={filteredTransactions.reduce((sum, item) => sum + item.amount, 0)}
      />

      {/* 6-Card KPI Summary Strip */}
      <TransactionsKpiGrid items={transactions} />

      {/* Category / Type Sub-Tabs */}
      <TransactionsSubTabs
        activeTab={activeSubTab}
        onSelectTab={setActiveSubTab}
        counts={subTabCounts}
      />

      {/* Search & Multi-Filter Panel */}
      <TransactionsFilterPanel
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        accountFilter={accountFilter}
        onAccountChange={setAccountFilter}
        railFilter={railFilter}
        onRailChange={setRailFilter}
        activeChips={activeChips}
        onRemoveChip={removeChip}
        onClearAll={clearAllFilters}
        categoryOptions={categoryOptions}
        accountOptions={accountOptions}
        railOptions={railOptions}
      />

      {/* Ledger Health & Gross Flow Volume Distribution Bar */}
      <LedgerHealthStrip items={transactions} />

      {/* Master Transactions Table */}
      <MasterTransactionsTable
        items={paginatedTransactions}
        selectedIds={selectedIds}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectRow={toggleSelectRow}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={filteredTransactions.length}
        totalPages={totalPages}
      />

      {isLoading && <p className="text-xs text-slate-500">Loading transactions...</p>}
      {loadError && <p className="text-xs text-rose-600">{loadError}</p>}

      {/* Bottom Double-Entry Financial Health Verification Banner */}
      <DoubleEntryBanner
        isReconciling={isReconciling}
        reconcileMessage={reconcileMessage}
        onRunReconciliation={runReconciliationCheck}
      />

      <AddTransactionDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </main>
  );
}
