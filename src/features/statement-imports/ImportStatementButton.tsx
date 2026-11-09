"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { StatementImportDialog } from "./StatementImportDialog";

interface ImportStatementButtonProps {
  layout?: "welcome" | "page";
  className?: string;
}

export function ImportStatementButton({
  layout = "page",
  className,
}: ImportStatementButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isWelcome = layout === "welcome";

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size={isWelcome ? "md" : "sm"}
        onClick={() => setIsOpen(true)}
        aria-label="Import Transaction History"
        title="Import Transaction History"
        className={cn(
          isWelcome
            ? "h-12 min-w-0 justify-start px-4 sm:px-5"
            : "min-w-0 px-3",
          className,
        )}
      >
        <ArrowDownToLine
          aria-hidden="true"
          className={cn(
            "shrink-0 text-accent",
            isWelcome ? "h-[18px] w-[18px]" : "h-3.5 w-3.5",
          )}
        />
        <span className="truncate">Import Statement</span>
        <span className="sr-only">, also known as Import Transaction History</span>
        {isWelcome && (
          <ArrowUpRight
            aria-hidden="true"
            className="ml-auto h-4 w-4 shrink-0 text-muted"
          />
        )}
      </Button>
      <StatementImportDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
