"use client";

import { CheckCircle2 } from "lucide-react";
import { useMoneyLent } from "./hooks/useMoneyLent";
import { MoneyLentHeader } from "./components/MoneyLentHeader";
import { MoneyLentKpiGrid } from "./components/MoneyLentKpiGrid";
import { MoneyLentFilterToolbar } from "./components/MoneyLentFilterToolbar";
import { MoneyLentBorrowersStrip } from "./components/MoneyLentBorrowersStrip";
import { MoneyLentTableCard } from "./components/MoneyLentTableCard";
import { MoneyLentInsightsCard } from "./components/MoneyLentInsightsCard";
import { RecordLentModal } from "./components/RecordLentModal";
import { RecordRepaymentModal } from "./components/RecordRepaymentModal";
import type { LentLoanItem } from "./types";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/loaders";

export function MoneyLentView() {
  const {
    items,
    allItems,
    metrics,
    isLoading,
    loadError,
    actionError,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    timeframeFilter,
    setTimeframeFilter,
    relationshipFilter,
    setRelationshipFilter,
    sortBy,
    setSortBy,
    resetFilters,
    isAddLoanModalOpen,
    setIsAddLoanModalOpen,
    selectedLoanForRepay,
    setSelectedLoanForRepay,
    actionSuccessNotice,
    addLoan,
    recordRepayment,
    deleteLoan,
    exportToCsv,
    refreshLedgers,
  } = useMoneyLent();

  const handleSendReminder = (item: LentLoanItem) => {
    const text = encodeURIComponent(
      `Hi ${item.borrowerName}, friendly reminder regarding the outstanding balance of ₹${item.balanceDue.toLocaleString(
        "en-IN",
      )} (due date: ${item.dueDate}). Please let me know when you can settle it. Thanks!`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 pb-12 max-w-350 mx-auto w-full">
      {/* Top Action Header & Breadcrumb */}
      <MoneyLentHeader
        onOpenAddLoan={() => setIsAddLoanModalOpen(true)}
        onExportCsv={exportToCsv}
      />

      {/* Action Confirmation Banner */}
      {actionSuccessNotice && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-good/30 bg-good-soft px-4 py-3 text-xs font-semibold text-good shadow-xs"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccessNotice}</span>
        </div>
      )}
      {loadError && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl bg-bad/10 px-4 py-3 text-sm text-bad">
          <p className="min-w-0 flex-1">{loadError}</p>
          <Button type="button" variant="secondary" size="sm" onClick={() => void refreshLedgers()}>
            Retry
          </Button>
        </div>
      )}
      {actionError && (
        <p role="alert" className="rounded-xl bg-bad/10 px-4 py-3 text-sm font-medium text-bad">
          {actionError}
        </p>
      )}

      {/* 6-Card KPI Strip */}
      <MoneyLentKpiGrid metrics={metrics} />

      {/* Spotlight Bar of Top Active Borrowers */}
      <MoneyLentBorrowersStrip
        items={allItems}
        onOpenRepayModal={(loan) => setSelectedLoanForRepay(loan)}
        onSendReminder={handleSendReminder}
      />

      {/* Interactive Filter Toolbar */}
      <MoneyLentFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        timeframeFilter={timeframeFilter}
        onTimeframeChange={setTimeframeFilter}
        relationshipFilter={relationshipFilter}
        onRelationshipChange={setRelationshipFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={resetFilters}
        totalFiltered={items.length}
        totalAll={allItems.length}
      />

      {/* Main Ledger Table */}
      {isLoading ? (
        <SkeletonCard variant="table" rows={4} />
      ) : loadError ? null : (
        <MoneyLentTableCard
          items={items}
          onOpenRepayModal={(loan) => setSelectedLoanForRepay(loan)}
          onMarkSettled={(loan) => setSelectedLoanForRepay(loan)}
          onDeleteLoan={deleteLoan}
          onSendReminder={handleSendReminder}
          onResetFilters={resetFilters}
        />
      )}

      {/* Double-Entry Compliance & Recovery Milestones */}
      <MoneyLentInsightsCard metrics={metrics} items={allItems} />

      {/* Modals */}
      <RecordLentModal
        isOpen={isAddLoanModalOpen}
        onClose={() => setIsAddLoanModalOpen(false)}
        onSubmit={addLoan}
      />

      <RecordRepaymentModal
        loan={selectedLoanForRepay}
        onClose={() => setSelectedLoanForRepay(null)}
        onSubmit={recordRepayment}
      />
    </div>
  );
}
