import { Button } from "@/components/ui/Button";
import { Badge, Download, FileText, RefreshCw } from "lucide-react";

interface ReportsHeaderProps {
  title: string;
  badge: string;
  description: string;
  currencyLabel: string;
  onRefresh?: () => void;
  onExportCsv?: () => void;
  onDownloadPdf?: () => void;
}

export function ReportsHeader({
  title,
  badge,
  description,
  currencyLabel,
  onRefresh,
  onExportCsv,
  onDownloadPdf,
}: ReportsHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {title}
          </h1>
          <Badge tone="accent" className="px-2.5 py-1 text-xs">
            {badge}
          </Badge>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:max-w-md lg:justify-end">
        <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent-soft/60 px-3.5 text-xs font-semibold text-ink">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-good" />
          {currencyLabel}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          className="min-h-10 px-3.5"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Refresh
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportCsv}
          className="min-h-10 px-3.5"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          Export CSV
        </Button>
        <Button size="sm" onClick={onDownloadPdf} className="min-h-10 px-4">
          <FileText aria-hidden="true" className="h-4 w-4" />
          Download PDF (Audit-Ready)
        </Button>
      </div>
    </header>
  );
}
