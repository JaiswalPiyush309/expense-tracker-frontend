"use client";

import { useState } from "react";
import { useBankAccounts } from "./hooks/useBankAccounts";
import { BankAccountsHeader } from "./components/BankAccountsHeader";
import { BankAccountsKpiGrid } from "./components/BankAccountsKpiGrid";
import { BankAccountsFilterToolbar } from "./components/BankAccountsFilterToolbar";
import { BankAccountCard } from "./components/BankAccountCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/loaders";
import { LiquidDistributionCard } from "./components/LiquidDistributionCard";
import { NetLiquidPositionCard } from "./components/NetLiquidPositionCard";
import { MultiAccountActivityTable } from "./components/MultiAccountActivityTable";

export function BankAccountsView() {
  const [, setIsAddAccountOpen] = useState(false);
  const [, setIsTransferModalOpen] = useState(false);

  const {
    accounts,
    isLoading,
    accountsError,
    actionError,
    actionNotice,
    busyAccountId,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    institutionFilter,
    setInstitutionFilter,
    statusFilter,
    setStatusFilter,
    filteredAccounts,
    resetFilters,
    loadAccounts,
    setDefaultAccount,
    removeAccount,
    restoreAccount,
    activityAccountFilter,
    changeActivityAccountFilter,
    activityTypeFilter,
    changeActivityTypeFilter,
    activityPage,
    setActivityPage,
    activityItems,
    activityTotalItems,
    activityTotalPages,
    isActivityLoading,
    activityError,
    loadActivity,
  } = useBankAccounts();

  return (
    <div className="space-y-5 p-5">
      {/* Top Page Header */}
      <BankAccountsHeader
        onOpenAddAccount={() => setIsAddAccountOpen(true)}
        onOpenTransferMoney={() => setIsTransferModalOpen(true)}
      />

      {accountsError && (
        <div role="alert" className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-bad">{accountsError}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void loadAccounts()}
          >
            Retry
          </Button>
        </div>
      )}
      {actionError && (
        <p
          role="alert"
          className="rounded-xl bg-bad/10 px-4 py-3 text-sm font-medium text-bad"
        >
          {actionError}
        </p>
      )}
      {actionNotice && (
        <p
          role="status"
          className="rounded-xl bg-good-soft px-4 py-3 text-sm font-medium text-good"
        >
          {actionNotice}
        </p>
      )}

      {accountsError && accounts.length === 0 ? null : (
        <>
          {/* Account summary */}
          <BankAccountsKpiGrid accounts={accounts} loading={isLoading} />

          {/* Category Tabs & Search/Filter Bar */}
          <BankAccountsFilterToolbar
            accounts={accounts}
            loading={isLoading}
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

          {isLoading ? (
            <SkeletonCard variant="account" rows={3} />
          ) : filteredAccounts.length === 0 ? (
            <EmptyState
              title={
                accounts.length === 0
                  ? "No accounts connected"
                  : "No matching accounts"
              }
              description={
                accounts.length === 0
                  ? "Add a bank account, wallet, or cash account to see it here."
                  : "Try changing your search or filters to find an account."
              }
              action={
                accounts.length > 0 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredAccounts.map((account) => (
                <BankAccountCard
                  key={account.id}
                  account={account}
                  isBusy={busyAccountId === account.id}
                  onSetDefault={setDefaultAccount}
                  onRemove={removeAccount}
                  onRestore={restoreAccount}
                />
              ))}
            </div>
          )}
        </>
      )}

      {accountsError && accounts.length === 0 ? null : (
        /* 2-Column Analytics Section: Liquid Distribution + Net Liquid Position */
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <LiquidDistributionCard accounts={accounts} loading={isLoading} />
          </div>
          <div className="lg:col-span-7">
            <NetLiquidPositionCard accounts={accounts} loading={isLoading} />
          </div>
        </div>
      )}

      <MultiAccountActivityTable
        accounts={accounts}
        items={activityItems}
        totalItems={activityTotalItems}
        isLoading={isActivityLoading}
        error={activityError}
        onRetry={loadActivity}
        accountFilter={activityAccountFilter}
        onAccountFilterChange={changeActivityAccountFilter}
        typeFilter={activityTypeFilter}
        onTypeFilterChange={changeActivityTypeFilter}
        currentPage={activityPage}
        totalPages={activityTotalPages}
        onPageChange={setActivityPage}
      />
    </div>
  );
}
