"use client";

export function HoldingsExposureStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
      {/* 1. Sector Exposure */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-400">SECTOR EXPOSURE</span>
          <span className="text-slate-700 dark:text-slate-200">5 Sectors</span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-indigo-600" style={{ width: "32%" }} />
          <div className="h-full bg-emerald-500" style={{ width: "25%" }} />
          <div className="h-full bg-amber-500" style={{ width: "20%" }} />
          <div className="h-full bg-sky-500" style={{ width: "13%" }} />
          <div className="h-full bg-slate-300" style={{ width: "10%" }} />
        </div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            Tech 32%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Energy 25%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Fin 20%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            FMCG 13%
          </span>
        </div>
      </div>

      {/* 2. Cap Allocation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-400">CAP ALLOCATION</span>
          <span className="text-slate-700 dark:text-slate-200">Weighted</span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-indigo-600" style={{ width: "48%" }} />
          <div className="h-full bg-emerald-500" style={{ width: "26.5%" }} />
          <div className="h-full bg-amber-500" style={{ width: "14.5%" }} />
          <div className="h-full bg-slate-400" style={{ width: "11%" }} />
        </div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            Large 48%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Mid 26.5%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Small 14.5%
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            ETF 11%
          </span>
        </div>
      </div>

      {/* 3. Top 3 Concentration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-400">TOP 3 CONCENTRATION</span>
          <span className="text-rose-600 dark:text-rose-400">54.5% Total</span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-rose-500" style={{ width: "54.5%" }} />
        </div>
        <div className="truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
          RELIANCE (25.1%) • HDFC (15.7%) • TC...
        </div>
      </div>

      {/* 4. Dividend Yield (TTM) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-400">DIVIDEND YIELD (TTM)</span>
          <span className="text-emerald-600 dark:text-emerald-400">1.42%</span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-emerald-500" style={{ width: "42%" }} />
        </div>
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <span>Est. Annual Payout:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            ₹7,850 / yr
          </span>
        </div>
      </div>
    </div>
  );
}
