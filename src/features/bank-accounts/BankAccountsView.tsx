"use client";

import { useState } from "react";
import { useBankAccounts } from "./hooks/useBankAccounts";
import { BankAccountsHeader } from "./components/BankAccountsHeader";

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
    syncFilter,
    setSyncFilter,
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
    </div>
  );
}
