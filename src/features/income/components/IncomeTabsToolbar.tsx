"use client";

import { ListFilter, Tags } from "lucide-react";

export type IncomeLedgerTab = "all" | "uncategorized";

interface IncomeTabsToolbarProps {
  activeTab: IncomeLedgerTab;
  onTabChange: (tab: IncomeLedgerTab) => void;
  totalCount: number;
  uncategorizedCount: number;
}

export function IncomeTabsToolbar({ activeTab, onTabChange, totalCount, uncategorizedCount }: IncomeTabsToolbarProps) {
  const tabs = [
    { id: "all" as const, label: "All income", count: totalCount, icon: ListFilter },
    { id: "uncategorized" as const, label: "Uncategorized", count: uncategorizedCount, icon: Tags },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Income transaction views">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return <button key={tab.id} type="button" role="tab" aria-selected={active} onClick={() => onTabChange(tab.id)} className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${active ? "bg-indigo-600 text-white shadow-xs" : "border border-line bg-white text-muted hover:bg-surface-muted dark:bg-slate-900"}`}>
          <Icon className="h-3.5 w-3.5" /><span>{tab.label}</span><span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/15 text-white" : "bg-surface-muted text-muted"}`}>{tab.count}</span>
        </button>;
      })}
    </div>
  );
}
