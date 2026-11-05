"use client";

import React, { useState } from "react";
import { TRANSACTION_CATEGORIES } from "../model/data";

interface TransactionCategorySelectorProps {
  categoryId: string;
  onChange: (categoryId: string) => void;
}

export function TransactionCategorySelector({
  categoryId,
  onChange,
}: TransactionCategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = TRANSACTION_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Category
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60"
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected?.iconBg ?? "bg-surface-muted"} ${selected?.iconColor ?? "text-muted"}`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </span>
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              {selected?.name ?? "Select a category"}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              {selected?.subCategory ?? "Choose the best match"}
            </div>
          </div>
        </div>

        <svg
          className="h-4 w-4 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {TRANSACTION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onChange(cat.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                cat.id === categoryId
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${cat.iconBg} ${cat.iconColor}`}
              >
                <span className="text-xs font-bold">{cat.name[0]}</span>
              </span>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {cat.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {cat.subCategory}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
