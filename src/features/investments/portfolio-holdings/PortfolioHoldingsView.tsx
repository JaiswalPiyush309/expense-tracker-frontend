"use client";

import { usePortfolioHoldings } from "./hooks/usePortfolioHoldings";
import { PortfolioHoldingsHeader } from "./components/PortfolioHoldingsHeader";
import { HoldingsKpiGrid } from "./components/HoldingsKpiGrid";
import { HoldingsExposureStrip } from "./components/HoldingsExposureStrip";
import { HoldingsFilterToolbar } from "./components/HoldingsFilterToolbar";
import { HoldingsListTable } from "./components/HoldingsListTable";
import { ScripInspectorDrawer } from "./components/ScripInspectorDrawer";

export function PortfolioHoldingsView() {
  const {
    searchQuery,
    setSearchQuery,
    capFilter,
    setCapFilter,
    pnlStatusFilter,
    setPnlStatusFilter,
    sortBy,
    setSortBy,
    viewLayout,
    setViewLayout,
    selectedRowIds,
    toggleSelectAll,
    toggleSelectRow,
    activeScrip,
    setActiveScripId,
    filteredHoldings,
    resetFilters,
    allHoldings,
    isLoading,
    error,
    detailsError,
    detailsLoading,
    reload,
  } = usePortfolioHoldings();

  const showInspector = viewLayout === "split" && activeScrip !== null;

  return (
    <div className="space-y-4 p-5">
      {/* Page Header */}
      <PortfolioHoldingsHeader onImported={reload} />

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
          <span className="flex-1">{error}</span>
          <button type="button" onClick={reload} className="font-semibold underline">Retry</button>
        </div>
      )}

      {/* Portfolio metrics calculated from the API holdings response */}
      <HoldingsKpiGrid holdings={allHoldings} />

      <HoldingsExposureStrip holdings={allHoldings} />

      {/* Search, Filter & Sort Toolbar */}
      <HoldingsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        capFilter={capFilter}
        onCapChange={setCapFilter}
        assetClasses={[...new Set(allHoldings.map((holding) => holding.capCategory))]}
        pnlStatusFilter={pnlStatusFilter}
        onPnlStatusChange={setPnlStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewLayout={viewLayout}
        onViewLayoutChange={setViewLayout}
        onReset={resetFilters}
      />

      {/* Master-Detail Split Grid: Holdings List Table + Scrip Inspector Drawer */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        <div className={showInspector ? "lg:col-span-8" : "lg:col-span-12"}>
          <HoldingsListTable
            holdings={filteredHoldings}
            selectedRowIds={selectedRowIds}
            activeScripId={activeScrip?.id ?? null}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectRow={toggleSelectRow}
            onSelectScripForInspector={(id) => {
              setActiveScripId(id);
              setViewLayout("split");
            }}
          />
        </div>

        {showInspector && activeScrip && (
          <div className="lg:col-span-4">
            <ScripInspectorDrawer
              scrip={activeScrip}
              onClose={() => setActiveScripId(null)}
              detailsError={detailsError}
              detailsLoading={detailsLoading}
            />
          </div>
        )}
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Loading your holdings…
        </div>
      )}

    </div>
  );
}
