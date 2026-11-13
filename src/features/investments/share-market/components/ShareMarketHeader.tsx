"use client";

import { Button } from "@/components/ui/Button";
import {
  ArrowLeftRight,
  ChevronDown,
  Download,
  MoreVertical,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface ShareMarketHeaderProps {
  onOpenAddInvestment: () => void;
  onOpenBuySell?: () => void;
}

export function ShareMarketHeader({
  onOpenAddInvestment,
  onOpenBuySell,
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
          Monitor your investment portfolio, track real-time NSE/BSE movements,
          and evaluate capital performance in one place.
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

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onOpenBuySell}
          className="gap-1.5 px-3.5 py-2 text-xs"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Buy / Sell</span>
        </Button>

        <Link
          href="/import-statements"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <span>📄</span>
          <span>Import Trades</span>
        </Link>

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
