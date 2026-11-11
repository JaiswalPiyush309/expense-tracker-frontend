"use client";

import React from "react";
import { TransactionsSubTabId } from "../types";

interface TransactionsSubTabsProps {
  activeTab: TransactionsSubTabId;
  onSelectTab: (tab: TransactionsSubTabId) => void;
  counts: Record<TransactionsSubTabId, number>;
}

export function TransactionsSubTabs({
  activeTab,
  onSelectTab,
  counts,
}: TransactionsSubTabsProps) {
  const tabs: Array<{ id: TransactionsSubTabId; label: string }> = [
    { id: "all", label: "All Transactions" },
    { id: "expenses", label: "Expenses" },
    { id: "income", label: "Income" },
    { id: "transfers", label: "Transfers" },
    { id: "investments", label: "Investments" },
    { id: "money-lent", label: "Money Lent" },
    { id: "money-borrowed", label: "Money Borrowed" },
    { id: "recurring", label: "Recurring" },
  ];
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              active
                ? "bg-indigo-600 text-white shadow-2xs"
                : "border border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            {tab.label} ({counts[tab.id]})
          </button>
        );
      })}
    </div>
  );
}
