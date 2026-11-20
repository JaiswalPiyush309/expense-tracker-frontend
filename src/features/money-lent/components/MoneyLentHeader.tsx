"use client";

import { Download, HandCoins, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

interface MoneyLentHeaderProps {
  onOpenAddLoan: () => void;
  onExportCsv: () => void;
}

export function MoneyLentHeader({
  onOpenAddLoan,
  onExportCsv,
}: MoneyLentHeaderProps) {
  return (
    <PageHeader
      title="Money Lent (Receivables)"
      description="Track interpersonal loans, receivables, repayment schedules, and settle outstanding balances without distorting your personal expense budgets."
      breadcrumbs={[
        { label: "FY 2025–26" },
        { label: "People & Lending" },
        { label: "Money Lent" },
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onExportCsv}
            className="gap-1.5"
          >
            <Download aria-hidden="true" className="h-4 w-4 text-muted" />
            <span>Export Ledger</span>
          </Button>

          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={onOpenAddLoan}
            className="gap-1.5 shadow-sm"
          >
            <HandCoins aria-hidden="true" className="h-4 w-4" />
            <span>Record Lent Money</span>
          </Button>
        </div>
      }
    />
  );
}
