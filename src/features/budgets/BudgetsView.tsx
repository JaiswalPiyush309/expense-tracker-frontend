"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useBudgets } from "./hooks/useBudgets";
import { BudgetHeader } from "./components/BudgetHeader";
import { BudgetKpiGrid } from "./components/BudgetKpiGrid";
import { BudgetCriticalAlert } from "./components/BudgetCriticalAlert";
import { BudgetHealthCard } from "./components/BudgetHealthCard";
import { BudgetTrajectoryCard } from "./components/BudgetTrajectoryCard";
import { ActiveEnvelopesSection } from "./components/ActiveEnvelopesSection";
import { EnvelopesTableCard } from "./components/EnvelopesTableCard";
import { CreateBudgetModal } from "./components/CreateBudgetModal";
import { AddEnvelopeModal } from "./components/AddEnvelopeModal";
import { ReallocateModal } from "./components/ReallocateModal";
import { TemplatesModal } from "./components/TemplatesModal";

export function BudgetsView() {
  const {
    envelopes,
    allEnvelopes,
    metrics,
    fiftyThirtyTwenty,
    trajectoryPoints,
    timeframe,
    setTimeframe,
    statusFilter,
    setStatusFilter,
    statusCounts,
    expenseTypeFilter,
    setExpenseTypeFilter,
    progressStateFilter,
    setProgressStateFilter,
    searchQuery,
    setSearchQuery,
    isAlertDismissed,
    setIsAlertDismissed,
    trajectoryMode,
    setTrajectoryMode,
    isCreateBudgetOpen,
    setIsCreateBudgetOpen,
    isAddEnvelopeOpen,
    setIsAddEnvelopeOpen,
    isReallocateOpen,
    setIsReallocateOpen,
    selectedEnvelopeForEdit,
    setSelectedEnvelopeForEdit,
    actionNotice,
    addEnvelope,
    reallocateFunds,
    updateEnvelopeLimit,
    deleteEnvelope,
    exportToCsv,
    resetRange,
  } = useBudgets();

  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 sm:p-6 pb-16 max-w-350 mx-auto w-full">
      {/* Top Header & Preset Timeframe Selector */}
      <BudgetHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onResetRange={resetRange}
        onOpenCreateBudget={() => setIsCreateBudgetOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onExportCsv={exportToCsv}
      />

      {/* Confirmation Notification Banner */}
      {actionNotice && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-good/30 bg-good-soft px-4 py-3 text-xs font-semibold text-good shadow-xs"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 6-Card KPI Metrics Strip */}
      <BudgetKpiGrid metrics={metrics} />

      {/* Critical Reallocation Alert Banner */}
      <BudgetCriticalAlert
        isDismissed={isAlertDismissed}
        onDismiss={() => setIsAlertDismissed(true)}
        onOpenReallocate={() => setIsReallocateOpen(true)}
      />

      {/* Middle Row: Overall Budget Health & Spending Trajectory Chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BudgetHealthCard
          metrics={metrics}
          fiftyThirtyTwenty={fiftyThirtyTwenty}
        />

        <BudgetTrajectoryCard
          points={trajectoryPoints}
          mode={trajectoryMode}
          onModeChange={setTrajectoryMode}
          projectedClose={metrics.projectedSpend}
          projectedSavings={metrics.projectedSavings}
        />
      </div>

      {/* Active Category Envelopes (8 Cards + Filter Pills) */}
      <ActiveEnvelopesSection
        envelopes={envelopes}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusCounts={statusCounts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        expenseTypeFilter={expenseTypeFilter}
        onExpenseTypeChange={setExpenseTypeFilter}
        progressStateFilter={progressStateFilter}
        onProgressStateChange={setProgressStateFilter}
        onOpenAddEnvelope={() => setIsAddEnvelopeOpen(true)}
        onOpenReallocate={() => setIsReallocateOpen(true)}
        onEditEnvelope={(env) => setSelectedEnvelopeForEdit(env)}
      />

      {/* Envelopes Table View */}
      <EnvelopesTableCard
        envelopes={envelopes}
        totalMasterAllocated={metrics.totalBudget}
        onEditEnvelope={(env) => setSelectedEnvelopeForEdit(env)}
        onOpenReallocate={() => setIsReallocateOpen(true)}
      />

      {/* Modals */}
      <CreateBudgetModal
        isOpen={isCreateBudgetOpen}
        onClose={() => setIsCreateBudgetOpen(false)}
        onSubmit={(data) => {
          // Master cap saved
        }}
      />

      <AddEnvelopeModal
        isOpen={isAddEnvelopeOpen}
        onClose={() => setIsAddEnvelopeOpen(false)}
        onSubmit={addEnvelope}
      />

      <ReallocateModal
        isOpen={isReallocateOpen}
        onClose={() => setIsReallocateOpen(false)}
        envelopes={allEnvelopes}
        onReallocate={reallocateFunds}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={(tpl) => {
          // Template applied
        }}
      />
    </div>
  );
}
