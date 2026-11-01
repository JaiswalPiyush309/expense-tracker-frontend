"use client";

import { useRouter } from "next/navigation";
import {
  bankMeta,
  banks,
  capital,
  cashFlow,
  compareText,
  equities,
  header,
  kpis,
  lendingRows,
  observations,
  periodOptions,
  portfolio,
  taxNote,
  upi,
  velocity,
} from "./data/mock";
import { downloadCsv } from "@/lib/csv";
import { ReportsHeader } from "./components/ReportsHeader";
import { PeriodToolbar } from "./components/PeriodToolbar";
import type { ReportPeriod, ReportSection } from "./types";
import { useState } from "react";
import { KpiGrid } from "./components/KpiGrid";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CashFlowCard } from "./components/CashFlowCard";
import { CapitalDistributionCard } from "./components/CapitalDistributionCard";
import { MerchantVelocityCard } from "./components/MerchantVelocityCard";
import { ObservationsCard } from "./components/ObservationsCard";
import { LendingPositionCard } from "./components/LendingPositionCard";
import { EquitiesCard } from "./components/EquitiesCard";
import { AllocationCard } from "./components/AllocationCard";
import { BankLiquidityCard } from "./components/BankLiquidityCard";
import { UpiVolumeCard } from "./components/UpiVolumeCard";

const SECTIONS: readonly { value: ReportSection; label: string }[] = [
  { value: "all", label: "All Analytics & Executive Summary" },
  { value: "income-expense", label: "Income & Expense Deep-Dive" },
  { value: "spending", label: "Spending & Merchants" },
  { value: "lending", label: "People & Lending Ledger" },
  { value: "investments", label: "Investments & Groww" },
  { value: "net-worth", label: "Net Worth & Goals" },
  { value: "bank-upi", label: "Bank & UPI Breakdown" },
];

const TWO_COL = "grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]";

export function ReportsView() {
  const router = useRouter();

  const [period, setPeriod] = useState<ReportPeriod>("6m");
  const [compare, setCompare] = useState(true);
  const [section, setSection] = useState<ReportSection>("all");
  const show = (...ids: ReportSection[]) =>
    section === "all" || ids.includes(section);
  const hasVisibleContent =
    section === "all" ||
    section === "income-expense" ||
    section === "spending" ||
    section === "lending" ||
    section === "investments" ||
    section === "bank-upi";

  const exportKpis = () =>
    downloadCsv("report-summary.csv", [
      ["Metric", "Value (INR)"],
      ...kpis.map((k) => [k.label, k.value]),
    ]);

  return (
    <div className="mx-auto w-full max-w-350 space-y-6 p-4 sm:p-6">
      <ReportsHeader
        {...header}
        onRefresh={() => router.refresh()}
        onExportCsv={exportKpis}
        onDownloadPdf={() => window.print()}
      />

      <PeriodToolbar
        options={periodOptions}
        period={period}
        onPeriodChange={setPeriod}
        compare={compare}
        onCompareChange={setCompare}
        compareSummary={compareText[period]}
      />

      <KpiGrid kpis={kpis} />

      <SegmentedControl
        semantics="tabs"
        size="md"
        label="Report sections"
        value={section}
        onChange={setSection}
        options={SECTIONS}
        className="w-full rounded-2xl bg-accent-soft/40"
      />

      <div
        role="tabpanel"
        aria-label={SECTIONS.find((s) => s.value === section)?.label}
        className="space-y-6"
      >
        {show("income-expense") && (
          <div className={TWO_COL}>
            <CashFlowCard data={cashFlow} />
            <CapitalDistributionCard {...capital} />
          </div>
        )}

        {show("spending") && (
          <div className={TWO_COL}>
            <MerchantVelocityCard {...velocity} />
            <ObservationsCard
              observations={observations}
              footerNote={taxNote}
            />
          </div>
        )}

        {show("lending") && <LendingPositionCard rows={lendingRows} />}

        {show("investments") && (
          <div className={TWO_COL}>
            <EquitiesCard
              rows={equities}
              syncedAt={portfolio.syncedAt}
              invested={portfolio.invested}
              current={portfolio.current}
            />
            <AllocationCard
              segments={portfolio.allocation}
              assetsLabel={portfolio.assetsLabel}
              riskLabel={portfolio.riskLabel}
              xirr={portfolio.xirr}
              rebalancing={portfolio.rebalancing}
            />
          </div>
        )}

        {show("bank-upi") && (
          <div className="grid gap-6 xl:grid-cols-2">
            <BankLiquidityCard
              accounts={banks}
              registered={bankMeta.registered}
              note={bankMeta.note}
            />
            <UpiVolumeCard {...upi} />
          </div>
        )}

        {!hasVisibleContent && (
          <div className="rounded-2xl border border-dashed border-line bg-surface-muted/40 px-6 py-10 text-center text-sm text-muted">
            This report section is not available yet.
          </div>
        )}
      </div>
    </div>
  );
}
