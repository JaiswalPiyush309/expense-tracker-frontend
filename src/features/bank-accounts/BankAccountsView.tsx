"use client";

import { useState } from "react";
import { useBankAccounts } from "./hooks/useBankAccounts";
import { BankAccountsHeader } from "./components/BankAccountsHeader";
import { BankAccountsKpiGrid } from "./components/BankAccountsKpiGrid";
import { BankAccountsFilterToolbar } from "./components/BankAccountsFilterToolbar";

export function BankAccountsView() {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    institutionFilter,
    setInstitutionFilter,
    statusFilter,
    setStatusFilter,
    activityAccountFilter,
    setActivityAccountFilter,
    activityTypeFilter,
    setActivityTypeFilter,
    currentPage,
    setCurrentPage,
    filteredAccounts,
    filteredActivity,
    handleAddAccount,
    resetFilters,
    isReconciling,
    reconcileNotice,
    runAccountReconciliation,
  } = useBankAccounts();

  return (
    <div className="space-y-5 p-5">
      {/* Top Page Header */}
      <BankAccountsHeader
        onOpenAddAccount={() => setIsAddAccountOpen(true)}
        onOpenTransferMoney={() => setIsTransferModalOpen(true)}
      />

      {/* 6-Card KPI Strip */}
      <BankAccountsKpiGrid />

      {/* Category Tabs & Search/Filter Bar */}
      <BankAccountsFilterToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        institutionFilter={institutionFilter}
        onInstitutionChange={setInstitutionFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={resetFilters}
      />
    </div>
  );
}
