import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChevronDown, Download, MoreVertical } from "lucide-react";
import { GrowwImportButton } from "../../components/GrowwImportButton";

export function PortfolioHoldingsHeader({ onImported }: { onImported: () => void }) {
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
        </>
      }
    />
  );
}
