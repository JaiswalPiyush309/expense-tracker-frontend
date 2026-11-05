"use client";

import React, { useState } from "react";
import { AttachedInvoice, TransactionTag } from "../model/types";
import { ReceiptUpload } from "./ReceiptUpload";

interface AdditionalDetailsSectionProps {
  expanded: boolean;
  onToggle: () => void;
  tags: TransactionTag[];
  onAddTag: (label: string) => void;
  onRemoveTag: (id: string) => void;
  utrNumber: string;
  onUtrChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  attachment: AttachedInvoice | null;
  onAttachmentChange: (attachment: AttachedInvoice | null) => void;
}

export function AdditionalDetailsSection({
  expanded,
  onToggle,
  tags,
  onAddTag,
  onRemoveTag,
  utrNumber,
  onUtrChange,
  notes,
  onNotesChange,
  attachment,
  onAttachmentChange,
}: AdditionalDetailsSectionProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagDraft, setTagDraft] = useState("");

  const getTagStyle = (tone?: TransactionTag["tone"]) => {
    switch (tone) {
      case "emerald":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30";
      case "slate":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      default:
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900/50">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Additional Details &amp; Attachments
          </span>
          {attachment && (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
              1 File Attached
            </span>
          )}
        </div>

        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-3.5 border-t border-slate-100 px-4 pt-3 pb-4 dark:border-slate-800/80">
          {/* Financial Tags & Tax Categories */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Financial Tags &amp; Tax Categories
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getTagStyle(
                    tag.tone,
                  )}`}
                >
                  {tag.label}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag.id)}
                    className="opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                </span>
              ))}

              {isAddingTag ? (
                <input
                  type="text"
                  autoFocus
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddTag(tagDraft);
                      setTagDraft("");
                      setIsAddingTag(false);
                    } else if (e.key === "Escape") {
                      setIsAddingTag(false);
                    }
                  }}
                  onBlur={() => {
                    if (tagDraft.trim()) onAddTag(tagDraft);
                    setTagDraft("");
                    setIsAddingTag(false);
                  }}
                  placeholder="#TagName"
                  className="w-24 rounded-full border border-indigo-300 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-800 outline-none dark:border-indigo-500 dark:bg-slate-800 dark:text-slate-200"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-[11px] font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400"
                >
                  + Add Tag
                </button>
              )}
            </div>
          </div>

          {/* Bank Reference / UPI UTR Number & Internal Memo */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Bank Reference / UPI UTR Number
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="rounded border border-slate-300 px-1 text-[9px] font-bold text-slate-400 dark:border-slate-700">
                  123
                </span>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => onUtrChange(e.target.value)}
                  className="w-full bg-transparent font-mono text-[11px] font-medium text-slate-700 outline-none dark:text-slate-300"
                  placeholder="UPI/YYYY/MM/DD/UTR"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-400 dark:text-slate-500">
                Internal Memo / Notes
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2 dark:border-slate-800 dark:bg-slate-900/60">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  className="w-full bg-transparent text-[11px] font-medium text-slate-700 outline-none dark:text-slate-300"
                  placeholder="Add internal audit note..."
                />
              </div>
            </div>
          </div>

          {/* Receipt Upload */}
          <ReceiptUpload
            attachment={attachment}
            onUpload={onAttachmentChange}
          />
        </div>
      )}
    </div>
  );
}
