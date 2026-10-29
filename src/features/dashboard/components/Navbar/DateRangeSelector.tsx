"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Calendar, ChevronDown } from "lucide-react";

interface DateRangeSelectorProps {
  label?: string;
  range?: string;
  onClick?: () => void;
  isExpanded?: boolean;
  className?: string;
}

export function DateRangeSelector({
  label = "This Month",
  range = "Select date range",
  onClick,
  isExpanded,
  className,
}: DateRangeSelectorProps) {
  return (
    <Button
      variant="soft"
      size="sm"
      onClick={onClick}
      aria-label={`Select date range. ${label}: ${range}`}
      aria-haspopup={onClick ? "dialog" : undefined}
      aria-expanded={onClick ? isExpanded : undefined}
      className={cn(
        "shrink-0 gap-2.5 whitespace-nowrap rounded-xl border border-accent/20 bg-accent-soft/40",
        "px-2.5 hover:bg-accent-soft/70 xl:px-3.5",
        className,
      )}
    >
      <Calendar aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />

      {/* Icon-only until xl, then full label */}
      <span className="hidden flex-col items-start leading-tight xl:flex">
        <span className="text-[11px] font-medium text-muted">{label}</span>
        <span className="text-xs font-semibold text-ink">{range}</span>
      </span>

      <ChevronDown
        aria-hidden="true"
        className={cn(
          "hidden h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 xl:block",
          isExpanded && "rotate-180",
        )}
      />
    </Button>
  );
}
