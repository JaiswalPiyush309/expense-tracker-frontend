"use client";

import { Download, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

interface MoneyBorrowedHeaderProps {
  onOpenAddLoan: () => void;
  onExportCsv: () => void;
}

export function MoneyBorrowedHeader({
  onOpenAddLoan,
  onExportCsv,
}: MoneyBorrowedHeaderProps) {
  return (
    <PageHeader
      title="Money Borrowed (Payables & Liabilities)"
      description="Track personal debts, liabilities, scheduled repayment commitments, and settle balances without distorting your real income or expenses."
      breadcrumbs={[
        { label: "FY 2025–26" },
        { label: "People & Lending" },
        { label: "Money Borrowed" },
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
            <span>Export Debts</span>
          </Button>

          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={onOpenAddLoan}
            className="gap-1.5 shadow-sm"
          >
            <Wallet aria-hidden="true" className="h-4 w-4" />
            <span>Record Borrowed Money</span>
          </Button>
        </div>
      }
    />
  );
}
