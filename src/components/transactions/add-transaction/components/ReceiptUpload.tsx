"use client";

import React, { useRef } from "react";
import { AttachedInvoice } from "../model/types";

interface ReceiptUploadProps {
  attachment: AttachedInvoice | null;
  onUpload: (attachment: AttachedInvoice | null) => void;
}

export function ReceiptUpload({ attachment, onUpload }: ReceiptUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kb = Math.max(1, Math.round(file.size / 1024));
    onUpload({
      name: file.name,
      sizeLabel: `${kb} KB • ${file.type.includes("pdf") ? "PDF Document" : "Image"}`,
      file,
    });
  };

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
        Bill / Invoice Attachment
      </label>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-3.5 px-3 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-800/40"
        >
          <svg
            className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Drop receipt or click to browse
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </button>

        {attachment ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-[10px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                PDF
              </div>
              <div className="truncate">
                <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {attachment.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {attachment.sizeLabel}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpload(null)}
              className="ml-2 rounded-md p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 dark:hover:bg-slate-700"
              aria-label="Remove attachment"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50/30 px-3 py-2.5 text-[11px] text-slate-400 dark:border-slate-800/60 dark:bg-slate-900/30">
            No invoice attached
          </div>
        )}
      </div>
    </div>
  );
}
