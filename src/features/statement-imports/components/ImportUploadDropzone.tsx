"use client";

import React, { useRef, useState } from "react";
import { UploadStatementDTO } from "../types";

interface ImportUploadDropzoneProps {
  isUploading: boolean;
  onUpload: (file: File, dto: UploadStatementDTO) => void;
}

const CONFIGURED_BANK_ACCOUNTS = [
  {
    id: "hdfc-4821",
    label: "HDFC Sal ••4821 (Bal: ₹3,42,150.00)",
    providerName: "HDFC Bank Ltd. (Salary Account)",
  },
  {
    id: "icici-8829",
    label: "ICICI Sav ••8829 (Bal: ₹5,18,400.00)",
    providerName: "ICICI Bank Ltd. (Wealth Account)",
  },
  {
    id: "sbi-1108",
    label: "SBI Sav ••1108 (Bal: ₹94,320.00)",
    providerName: "State Bank of India (Savings Account)",
  },
];

const UPI_APPS = [
  { id: "PhonePe", label: "PhonePe", badge: "Popular" },
  { id: "Google Pay", label: "Google Pay (GPay)" },
  { id: "Paytm", label: "Paytm UPI" },
  { id: "BHIM", label: "BHIM UPI" },
  { id: "CRED", label: "CRED Pay / UPI" },
];

export function ImportUploadDropzone({
  isUploading,
  onUpload,
}: ImportUploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Source Type: "BANK_STATEMENT" | "UPI_HISTORY"
  const [sourceType, setSourceType] = useState<
    "BANK_STATEMENT" | "UPI_HISTORY"
  >("BANK_STATEMENT");

  // 2. Configured Bank Account state
  const [accountId, setAccountId] = useState<string>(
    CONFIGURED_BANK_ACCOUNTS[0].id,
  );

  // 3. Selected UPI App state
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>(UPI_APPS[0].id);

  const selectedBank =
    CONFIGURED_BANK_ACCOUNTS.find((acc) => acc.id === accountId) ??
    CONFIGURED_BANK_ACCOUNTS[0];

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resolvedProviderName =
      sourceType === "BANK_STATEMENT"
        ? selectedBank.providerName
        : `${selectedUpiApp} (${selectedBank.label.split(" (")[0]})`;

    onUpload(file, {
      accountId,
      providerName: resolvedProviderName,
      sourceType,
    });

    // Reset file input so selecting the same file again triggers onChange
    e.target.value = "";
  };

  return (
    <div className="my-6 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-6 sm:p-8 text-center dark:border-indigo-500/30 dark:bg-indigo-950/10">
      <div className="mx-auto mb-6 max-w-lg space-y-4 text-left">
        {/* Step 1: Select Bank or UPI */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            1. Select Statement Source Type
          </label>
          <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-100/90 p-1.5 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setSourceType("BANK_STATEMENT")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs font-semibold transition-all ${
                sourceType === "BANK_STATEMENT"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
              </svg>
              <span>Bank Statement</span>
            </button>

            <button
              type="button"
              onClick={() => setSourceType("UPI_HISTORY")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs font-semibold transition-all ${
                sourceType === "UPI_HISTORY"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>UPI App History</span>
            </button>
          </div>
        </div>

        {/* Step 2A: If Bank is selected -> Show Configured Bank Accounts */}
        {sourceType === "BANK_STATEMENT" ? (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Configured Bank Account
              </label>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Verified Ledger Account
              </span>
            </div>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {CONFIGURED_BANK_ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* Step 2B: If UPI is selected -> Ask for UPI App (PhonePe, Google Pay, Paytm, BHIM, CRED) */
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Select UPI Application
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {UPI_APPS.map((app) => {
                  const isSelected = selectedUpiApp === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-2xs dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="truncate">{app.label}</span>
                      {isSelected && (
                        <span className="ml-1 text-indigo-600 dark:text-indigo-400">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Linked Settlement Bank Account for the UPI App */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Linked Settlement Bank Account (for Balance Reconciliation)
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {CONFIGURED_BANK_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Upload Trigger Button */}
      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>
          {isUploading
            ? "Uploading & Parsing Statement..."
            : sourceType === "BANK_STATEMENT"
              ? `Upload ${selectedBank.label.split(" ••")[0]} Statement (CSV / XLSX)`
              : `Upload ${selectedUpiApp} Statement (CSV / XLSX)`}
        </span>
      </button>

      <p className="mt-2 text-[11px] text-slate-400">
        Calls{" "}
        <code className="font-mono">POST /transactions/import/upload</code> with{" "}
        <code className="font-mono">sourceType=&quot;{sourceType}&quot;</code>
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFilePick}
        className="hidden"
      />
    </div>
  );
}
