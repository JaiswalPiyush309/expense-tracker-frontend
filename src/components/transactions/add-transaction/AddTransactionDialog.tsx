"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AddTransactionFormValues } from "./model/types";
import { useAddTransactionForm } from "./hooks/useAddTransactionForm";
import { TransactionTypeSelector } from "./components/TransactionTypeSelector";
import { TransactionAmountInput } from "./components/TransactionAmountInput";
import { TransactionFormFields } from "./components/TransactionFormFields";
import { TransactionFormFooter } from "./components/TransactionFormFooter";
import type { TransactionType } from "./model/types";

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordTransaction?: (transaction: AddTransactionFormValues) => void;
  initialType?: TransactionType;
}

export default function AddTransactionDialog({
  isOpen,
  onClose,
  onRecordTransaction,
  initialType = "expense",
}: AddTransactionDialogProps) {
  const {
    values,
    selectedAccount,
    accounts,
    accountsLoading,
    accountsError,
    categories,
    categoriesLoading,
    categoriesError,
    isDetailsExpanded,
    setIsDetailsExpanded,
    isLedgerValid,
    isSubmitting,
    submitError,
    updateField,
    setTransactionType,
    addQuickAmount,
    clearAmount,
    addTag,
    removeTag,
    setAttachment,
    resetForm,
    handleSubmit,
  } = useAddTransactionForm((recorded) => {
    onRecordTransaction?.(recorded);
    onClose();
  }, initialType);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, resetForm]);

  if (!isOpen || typeof document === "undefined") return null;

  const dialog = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-md transition-all sm:items-center sm:py-6"
    >
      {/* Modal Card */}
      <div className="relative my-auto flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:max-h-[calc(100dvh-1rem)]">
        {/* Top Rose/Crimson Accent Strip */}
        <div className="h-1 w-full shrink-0 bg-accent" />

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-5 sm:p-6">
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-[11px] font-bold text-accent">
                  LF
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Transaction
                </h2>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  INR LEDGER
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Record cash outflows, income, inter-account transfers, stock
                investments, or lending.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                ESC
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 6-Tab Transaction Type Selector */}
          <TransactionTypeSelector
            value={values.type}
            onChange={setTransactionType}
          />

          {/* Transaction Amount & Quick Add Chips */}
          <TransactionAmountInput
            amount={values.amount}
            type={values.type}
            accountShortLabel={selectedAccount?.shortLabel ?? "Account"}
            onChange={(val) => updateField("amount", val)}
            onQuickAdd={addQuickAmount}
            onClear={clearAmount}
          />

          {/* Main Form Inputs & Collapsible Attachments */}
          <TransactionFormFields
            values={values}
            isDetailsExpanded={isDetailsExpanded}
            onToggleDetails={() => setIsDetailsExpanded((prev) => !prev)}
            updateField={updateField}
            accounts={accounts}
            accountsLoading={accountsLoading}
            accountsError={accountsError}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            onAttachmentChange={setAttachment}
          />

          {submitError && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {submitError}
            </p>
          )}

          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-line bg-surface-muted/60 px-5 py-3.5 sm:px-6 sm:py-4">
          <TransactionFormFooter
            isRecurring={values.isRecurring}
            onRecurringChange={(checked) => updateField("isRecurring", checked)}
            isLedgerValid={isLedgerValid}
            isSubmitting={isSubmitting}
            onCancel={onClose}
          />
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
