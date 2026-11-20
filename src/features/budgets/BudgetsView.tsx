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
import { EditBudgetLimitModal } from "./components/EditBudgetLimitModal";

export function BudgetsView() {
  const {
    envelopes,
    allEnvelopes,
    metrics,
    fiftyThirtyTwenty,
    trajectoryPoints,
    periodLabel,
    isLoading,
    loadError,
    actionError,
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
    notify,
    createMasterBudget,
    addEnvelope,
    reallocateFunds,
    updateEnvelopeLimit,
    deleteEnvelope,
    exportToCsv,
    resetRange,
    refreshBudgets,
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

      {(loadError || actionError) && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-bad/30 bg-bad-soft px-4 py-3 text-sm text-bad">
          <span>{actionError || loadError}</span>
          {loadError && <button type="button" className="font-semibold underline" onClick={() => void refreshBudgets()}>Retry</button>}
        </div>
      )}

      {isLoading && <p role="status" className="text-sm text-muted">Loading your budgets…</p>}

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
          period={periodLabel}
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
        onSubmit={createMasterBudget}
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
        onApplyTemplate={(tpl) => notify(`“${tpl}” is a planning guide. Set your monthly cap and category envelopes to apply it.`)}
      />

      <EditBudgetLimitModal
        envelope={selectedEnvelopeForEdit}
        onClose={() => setSelectedEnvelopeForEdit(null)}
        onSave={updateEnvelopeLimit}
        onDelete={deleteEnvelope}
      />
    </div>
  );
}
