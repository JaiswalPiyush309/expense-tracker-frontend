"use client";

import { useState } from "react";
import type { CategoryOption } from "@/features/categories/categories-api";

interface TransactionCategorySelectorProps {
  categoryId: string;
  categories: CategoryOption[];
  loading: boolean;
  error: string;
  onChange: (categoryId: string) => void;
}

export function TransactionCategorySelector({
  categoryId,
  categories,
  loading,
  error,
  onChange,
}: TransactionCategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = categories.find((category) => category.id === categoryId);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Category
      </label>
      <button
        type="button"
        disabled={loading || categories.length === 0}
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/60"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            {selected?.name.charAt(0) ?? "?"}
          </span>
          <div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              {loading ? "Loading categories…" : selected?.name ?? (categories.length ? "Select a category" : "No categories available")}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              {selected ? (selected.isCustom ? "Custom category" : "Default category") : "Choose the best match"}
            </div>
          </div>
        </div>
        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => { onChange(category.id); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${category.id === categoryId ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                {category.name.charAt(0)}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{category.name}</span>
              {category.isCustom && <span className="ml-auto text-[10px] text-slate-400">Custom</span>}
            </button>
          ))}
        </div>
      )}
      {error && <p role="alert" className="mt-1 text-[11px] text-rose-600">{error}</p>}
      {!loading && !error && categories.length === 0 && <p className="mt-1 text-[11px] text-slate-500">No categories found for this transaction type.</p>}
    </div>
  );
}
