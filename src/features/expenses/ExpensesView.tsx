"use client";

import { useState } from "react";
import { AddTransactionDialog } from "@/components/transactions/add-transaction";
import { ExpensesHeader } from "./components/ExpensesHeader";
import { useExpensesLedger } from "./hooks/useExpensesLedger";
import { ExpensesFilterToolbar } from "./components/ExpensesFilterToolbar";
import { ExpensesKpiGrid } from "./components/ExpensesKpiGrid";
import { CategoryExpenditureCard } from "./components/CategoryExpenditureCard";
import { SpendingPacingCard } from "./components/SpendingPacingCard";
import { ExpensesSubTabs } from "./components/ExpensesSubTabs";
import { ExpensesLedgerTable } from "./components/ExpensesLedgerTable";

export function ExpensesView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    datePreset,
    setDatePreset,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    paymentFilter,
    setPaymentFilter,
    accountFilter,
    setAccountFilter,
    statusFilterActive,
    setStatusFilterActive,
    activeSubTab,
    setActiveSubTab,
    selectedIds,
    toggleSelectAll,
    toggleSelectRow,
    sortBy,
    setSortBy,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    filteredExpenses,
    paginatedExpenses,
    totalPages,
    totalAmount,
    expenses,
    categoryOptions,
    paymentOptions,
    accountOptions,
    subTabCounts,
    categoryShares,
    paymentRailShares,
    pacingValues,
    isLoading,
    loadError,
    handleCategorySliceClick,
    resetFilters,
  } = useExpensesLedger();

  return (
    <div className="space-y-5 pb-10">
      {/* Top Page Header */}
      <ExpensesHeader onOpenAddExpense={() => setIsAddModalOpen(true)} />

      {/* Date Presets, Total Filtered Pill & Filter Bar */}
      <ExpensesFilterToolbar
        datePreset={datePreset}
        onDatePresetChange={setDatePreset}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        paymentFilter={paymentFilter}
        onPaymentChange={setPaymentFilter}
        accountFilter={accountFilter}
        onAccountChange={setAccountFilter}
        statusFilterActive={statusFilterActive}
        onToggleStatusFilter={() => setStatusFilterActive((prev) => !prev)}
        onReset={resetFilters}
        totalAmount={totalAmount}
        totalCount={filteredExpenses.length}
        categoryOptions={categoryOptions}
        paymentOptions={paymentOptions}
        accountOptions={accountOptions}
      />

      {/* 6-Card KPI Strip */}
      <ExpensesKpiGrid items={expenses} />

      {/* 2-Column Analytics Section: Category-wise Expenditure + Spending Pacing */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <CategoryExpenditureCard
            shares={categoryShares}
            total={totalAmount}
            activeCategoryFilter={categoryFilter}
            onSelectCategory={handleCategorySliceClick}
          />
        </div>
        <div className="lg:col-span-5">
          <SpendingPacingCard paymentRailShares={paymentRailShares} pacingValues={pacingValues} />
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <ExpensesSubTabs activeTab={activeSubTab} onTabChange={setActiveSubTab} counts={subTabCounts} />

      {/* Main Expenses Table */}
      <ExpensesLedgerTable
        items={paginatedExpenses}
        selectedIds={selectedIds}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectRow={toggleSelectRow}
        sortBy={sortBy}
        onSortChange={setSortBy}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={filteredExpenses.length}
        totalPages={totalPages}
      />

      {isLoading && <p className="text-xs text-slate-500">Loading expenses...</p>}
      {loadError && <p className="text-xs text-rose-600">{loadError}</p>}

      {/* Reused AddTransactionDialog */}
      <AddTransactionDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialType="expense"
      />
    </div>
  );
}
