"use client";

import { Button } from "@/components/ui/Button";
import {
  ChevronDown,
  Download,
  MoreVertical,
  Plus,
} from "lucide-react";
import { GrowwImportButton } from "../../components/GrowwImportButton";

interface ShareMarketHeaderProps {
  onOpenAddInvestment: () => void;
  onImported: () => void;
}

export function ShareMarketHeader({
  onOpenAddInvestment,
  onImported,
}: ShareMarketHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-400">FY 2025–26</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-400">INVESTMENTS & WEALTH</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-indigo-600 dark:text-indigo-400">
            SHARE MARKET DASHBOARD
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Share Market Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Review recorded holdings, transaction activity, and portfolio performance.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="accent"
          size="sm"
          onClick={onOpenAddInvestment}
          className="gap-1.5 px-3.5 py-2 text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add Investment</span>
        </Button>

        <GrowwImportButton onImported={onImported} />

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="gap-1.5 px-3 py-2 text-xs"
        >
          <Download className="h-4 w-4" />
          <span>Export</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-8 w-8 text-slate-500 dark:text-slate-400"
          aria-label="More actions"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
