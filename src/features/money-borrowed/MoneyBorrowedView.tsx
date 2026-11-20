"use client";

import { CheckCircle2 } from "lucide-react";
import { useMoneyBorrowed } from "./hooks/useMoneyBorrowed";
import { MoneyBorrowedHeader } from "./components/MoneyBorrowedHeader";
import { MoneyBorrowedKpiGrid } from "./components/MoneyBorrowedKpiGrid";
import { MoneyBorrowedFilterToolbar } from "./components/MoneyBorrowedFilterToolbar";
import { MoneyBorrowedLendersStrip } from "./components/MoneyBorrowedLendersStrip";
import { MoneyBorrowedTableCard } from "./components/MoneyBorrowedTableCard";
import { MoneyBorrowedInsightsCard } from "./components/MoneyBorrowedInsightsCard";
import { RecordBorrowedModal } from "./components/RecordBorrowedModal";
import { RecordRepaymentModal } from "./components/RecordRepaymentModal";
import type { BorrowedLoanItem } from "./types";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/loaders";

export function MoneyBorrowedView() {
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
  } = useMoneyBorrowed();

  const handleNotifyLender = (item: BorrowedLoanItem) => {
    const text = encodeURIComponent(
      `Hi ${item.lenderName}, sharing an update regarding the borrowed balance of ₹${item.balanceDue.toLocaleString(
        "en-IN",
      )} (due date: ${item.dueDate || "N/A"}). I will ensure the payment is processed as scheduled. Thank you for your support!`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 pb-12 max-w-350 mx-auto w-full">
      {/* Top Action Header & Breadcrumb */}
      <MoneyBorrowedHeader
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
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-xl bg-bad/10 px-4 py-3 text-sm text-bad"
        >
          <p className="min-w-0 flex-1">{loadError}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => void refreshLedgers()}
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

      {/* 6-Card KPI Strip */}
      <MoneyBorrowedKpiGrid metrics={metrics} />

      {/* Spotlight Bar of Top Active Lenders / Creditors */}
      <MoneyBorrowedLendersStrip
        items={allItems}
        onOpenRepayModal={(loan) => setSelectedLoanForRepay(loan)}
        onNotifyLender={handleNotifyLender}
      />

      {/* Interactive Filter Toolbar */}
      <MoneyBorrowedFilterToolbar
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

      {/* Main Debts / Liabilities Table */}
      {isLoading ? (
        <SkeletonCard variant="table" rows={4} />
      ) : loadError ? null : (
        <MoneyBorrowedTableCard
          items={items}
          onOpenRepayModal={(loan) => setSelectedLoanForRepay(loan)}
          onDeleteLoan={deleteLoan}
          onNotifyLender={handleNotifyLender}
          onResetFilters={resetFilters}
        />
      )}

      {/* Double-Entry Compliance & Debt Discharge Milestones */}
      <MoneyBorrowedInsightsCard metrics={metrics} items={allItems} />

      {/* Modals */}
      <RecordBorrowedModal
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
