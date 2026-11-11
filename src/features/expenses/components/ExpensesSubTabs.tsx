"use client";

import React from "react";
import { ExpensesSubTabId } from "../types";

interface ExpensesSubTabsProps {
  activeTab: ExpensesSubTabId;
  onTabChange: (tab: ExpensesSubTabId) => void;
  counts: Record<ExpensesSubTabId, number>;
}

export function ExpensesSubTabs({
  activeTab,
  onTabChange,
  counts,
}: ExpensesSubTabsProps) {
  const tabs: { id: ExpensesSubTabId; label: string }[] = [
    { id: "all", label: "All Expenses" },
    { id: "recurring", label: "Recurring Schedules" },
    { id: "rules-budgets", label: "Category Rules & Budgets" },
    { id: "receipts-vault", label: "Receipts Vault" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              active
                ? "border border-slate-200/90 bg-white text-indigo-600 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400"
                : "text-slate-600 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-900/50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                active
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                  : "bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {counts[tab.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
