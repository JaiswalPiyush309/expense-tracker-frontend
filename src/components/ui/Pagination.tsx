import { Button } from "./Button";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many page-number buttons to show. */
  maxButtons?: number;
  className?: string;
}

function pageWindow(page: number, total: number, max: number) {
  const safeMax = Math.max(1, Math.floor(max));
  let start = Math.max(1, page - Math.floor(safeMax / 2));
  const end = Math.min(total, start + safeMax - 1);
  start = Math.max(1, end - safeMax + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  maxButtons = 5,
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, Math.floor(totalPages));
  const safePage = Math.min(
    safeTotalPages,
    Math.max(1, Math.floor(Number.isFinite(page) ? page : 1)),
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
    >
      <Button
        variant="soft"
        size="sm"
        disabled={safePage <= 1}
        onClick={() => onPageChange(Math.max(1, safePage - 1))}
        className="bg-surface-muted text-muted"
      >
        Previous
      </Button>
      {pageWindow(safePage, safeTotalPages, maxButtons).map((p) => (
        <Button
          key={p}
          variant={p === safePage ? "primary" : "soft"}
          size="sm"
          aria-label={`Page ${p}`}
          aria-current={p === safePage ? "page" : undefined}
          onClick={() => onPageChange(p)}
          className="min-w-9 px-0"
        >
          {p}
        </Button>
      ))}
      <Button
        variant="soft"
        size="sm"
        disabled={safePage >= safeTotalPages}
        onClick={() =>
          onPageChange(Math.min(safeTotalPages, safePage + 1))
        }
        className="bg-surface-muted text-ink"
      >
        Next
      </Button>
    </nav>
  );
}
