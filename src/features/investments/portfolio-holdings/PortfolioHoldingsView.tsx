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
    exchangeFilter,
    setExchangeFilter,
    sectorFilter,
    setSectorFilter,
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
    currentPage,
    setCurrentPage,
    filteredHoldings,
    resetFilters,
  } = usePortfolioHoldings();

  const showInspector = viewLayout === "split" && activeScrip !== null;

  return (
    <div className="space-y-4 p-5">
      {/* Page Header */}
      <PortfolioHoldingsHeader />

      {/* 5-Card KPI Strip */}
      <HoldingsKpiGrid />

      {/* 4-Column Exposure & Yield Strip */}
      <HoldingsExposureStrip />

      {/* Search, Filter & Sort Toolbar */}
      <HoldingsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        exchangeFilter={exchangeFilter}
        onExchangeChange={setExchangeFilter}
        sectorFilter={sectorFilter}
        onSectorChange={setSectorFilter}
        capFilter={capFilter}
        onCapChange={setCapFilter}
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
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {showInspector && activeScrip && (
          <div className="lg:col-span-4">
            <ScripInspectorDrawer
              scrip={activeScrip}
              onClose={() => setActiveScripId(null)}
            />
          </div>
        )}
      </div>

    </div>
  );
}
