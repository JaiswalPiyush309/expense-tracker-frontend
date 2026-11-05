"use client";

import { AccountSelector } from "./AccountSelector";
import { AdditionalDetailsSection } from "./AdditionalDetailsSection";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { TransactionCategorySelector } from "./TransactionCategorySelector";
import { TransactionDatePicker } from "./TransactionDatePicker";
import { AddTransactionFormValues, AttachedInvoice } from "../model/types";

interface TransactionFormFieldsProps {
  values: AddTransactionFormValues;
  isDetailsExpanded: boolean;
  onToggleDetails: () => void;
  updateField: <K extends keyof AddTransactionFormValues>(
    field: K,
    value: AddTransactionFormValues[K],
  ) => void;
  onAddTag: (label: string) => void;
  onRemoveTag: (id: string) => void;
  onAttachmentChange: (attachment: AttachedInvoice | null) => void;
}

export function TransactionFormFields({
  values,
  isDetailsExpanded,
  onToggleDetails,
  updateField,
  onAddTag,
  onRemoveTag,
  onAttachmentChange,
}: TransactionFormFieldsProps) {
  return (
    <div className="space-y-3.5">
      {/* Title / Description */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Title / Description
          </label>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Merchant or Payee purpose
          </span>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white dark:border-slate-800 dark:bg-slate-900/60">
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="17" y1="10" x2="3" y2="10" />
            <line x1="21" y1="6" x2="3" y2="6" />
            <line x1="21" y1="14" x2="3" y2="14" />
            <line x1="17" y1="18" x2="3" y2="18" />
          </svg>
          <input
            type="text"
            value={values.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Swiggy Gourmet Dinner with Team"
            className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none dark:text-slate-100"
          />
        </div>
      </div>

      {/* Row 1: Date & Time + Account / Payment Source */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <TransactionDatePicker
          date={values.date}
          time={values.time}
          onDateChange={(val) => updateField("date", val)}
          onTimeChange={(val) => updateField("time", val)}
        />

        <AccountSelector
          accountId={values.accountId}
          onChange={(id) => updateField("accountId", id)}
        />
      </div>

      {/* Row 2: Category + Merchant / Recipient */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <TransactionCategorySelector
          categoryId={values.categoryId}
          onChange={(id) => updateField("categoryId", id)}
        />
        <PaymentMethodSelector
          merchant={values.merchant}
          isAutoTagged={values.isAutoTagged}
          onChange={(val) => updateField("merchant", val)}
        />
      </div>

      {/* Collapsible Additional Details & Attachments */}
      <AdditionalDetailsSection
        expanded={isDetailsExpanded}
        onToggle={onToggleDetails}
        tags={values.tags}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        utrNumber={values.utrNumber}
        onUtrChange={(val) => updateField("utrNumber", val)}
        notes={values.notes}
        onNotesChange={(val) => updateField("notes", val)}
        attachment={values.attachment}
        onAttachmentChange={onAttachmentChange}
      />
    </div>
  );
}
