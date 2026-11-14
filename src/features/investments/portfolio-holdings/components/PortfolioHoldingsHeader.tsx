import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChevronDown, Download, MoreVertical } from "lucide-react";
import Link from "next/link";

export function PortfolioHoldingsHeader() {
  return (
    <PageHeader
      title="Portfolio Holdings"
      description="Track your stock holdings, monitor current market values and review the performance of every investment in your portfolio."
      breadcrumbs={[
        { label: "Investments & Wealth" },
        { label: "Portfolio Holdings" },
      ]}
      actions={
        <>
          <Link
            href="/import-statements"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <span>↑</span>
            <span>Import</span>
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
        </>
      }
    />
  );
}
