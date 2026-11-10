"use client";

import React, { useRef } from "react";
import { useStatementImport } from "./hooks/useStatementImport";
import { ImportModalHeader } from "./components/ImportModalHeader";
import { ImportStepWizard } from "./components/ImportStepWizard";
import { ImportSourceSummaryBar } from "./components/ImportSourceSummaryBar";
import { ImportBatchKpiGrid } from "./components/ImportBatchKpiGrid";
import { ImportFilterToolbar } from "./components/ImportFilterToolbar";
import { ImportUploadDropzone } from "./components/ImportUploadDropzone";
import { StagedTransactionsTable } from "./components/StagedTransactionsTable";
import { ImportModalFooter } from "./components/ImportModalFooter";

interface StatementImportViewProps {
  initialBatchId?: string;
  onClose?: () => void;
}

export function StatementImportView({
  initialBatchId,
  onClose,
}: StatementImportViewProps) {
  const reuploadInputRef = useRef<HTMLInputElement | null>(null);

  const {
    batch,
    activeStep,
    setActiveStep,
    isLoading,
    isUploading,
    isCommitting,
    updatingRowId,
    error,
    setError,
    commitSuccessMessage,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    channelFilter,
    setChannelFilter,
    stats,
    filteredRows,
    handleFileUpload,
    handleUpdateRow,
    handleDeleteRow,
    handleCommitBatch,
    toggleRowSelection,
    selectAllValid,
    excludeDuplicates,
  } = useStatementImport(initialBatchId);

  return (
    <div className="mx-auto w-full max-w-295 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
      {/* Top Indigo Accent Bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600" />

      {/* Header */}
      <ImportModalHeader onClose={onClose} />

      {/* 5-Step Wizard Bar */}
      <ImportStepWizard
        activeStep={activeStep}
        onSelectStep={(step) => setActiveStep(step)}
      />

      {/* Main Content Body */}
      <div className="space-y-4 p-4 sm:p-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Commit Confirmation Banner */}
        {commitSuccessMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
            ✓ {commitSuccessMessage}
          </div>
        )}

        {isLoading ? (
          <div className="py-16 text-center text-xs font-medium text-slate-400">
            Loading staged statement batch...
          </div>
        ) : !batch || activeStep === 3 ? (
          <ImportUploadDropzone
            isUploading={isUploading}
            onUpload={handleFileUpload}
          />
        ) : (
          <>
            {/* Source Entity, Destination Account & File Bar */}
            <ImportSourceSummaryBar batch={batch} />

            {/* 6-Card KPI Summary Strip */}
            <ImportBatchKpiGrid stats={stats} />

            {/* Filter Tabs, Bulk Actions & Search Bar */}
            <ImportFilterToolbar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={{
                total: stats.totalRecords,
                valid: stats.readyCount,
                duplicates: stats.duplicatesCount,
                needsReview: stats.needsReviewCount,
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              channelFilter={channelFilter}
              onChannelFilterChange={setChannelFilter}
              onSelectAllValid={selectAllValid}
              onExcludeDuplicates={excludeDuplicates}
            />

            {/* Staged Transactions Table */}
            <StagedTransactionsTable
              rows={filteredRows}
              updatingRowId={updatingRowId}
              onToggleSelect={toggleRowSelection}
              onUpdateRow={handleUpdateRow}
              onDeleteRow={handleDeleteRow}
            />
          </>
        )}
      </div>

      {/* Hidden File Input for "Re-upload File" Footer Button */}
      <input
        ref={reuploadInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(
              file,
              batch?.sourceType === "UPI"
                ? { sourceType: "UPI", upiApp: batch.upiApp ?? "PHONEPE" }
                : { sourceType: "BANK", bankCode: batch?.bankCode ?? "HDFC" },
            );
          }
        }}
        className="hidden"
      />

      {/* Footer */}
      {batch && (
        <ImportModalFooter
          selectedCount={stats.selectedCount}
          totalCount={stats.totalRecords}
          netImpact={stats.netImpact}
          isCommitting={isCommitting}
          onCancel={onClose}
          onReupload={() => reuploadInputRef.current?.click()}
          onCommit={handleCommitBatch}
        />
      )}
    </div>
  );
}
