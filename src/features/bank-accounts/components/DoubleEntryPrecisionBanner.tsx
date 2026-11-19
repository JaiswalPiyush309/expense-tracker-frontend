"use client";

import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";

interface DoubleEntryPrecisionBannerProps {
  isReconciling: boolean;
  reconcileNotice: string | null;
  reconcileHasDiscrepancies: boolean;
  reconcileError: string | null;
  onRunReconciliation: () => void;
}

export function DoubleEntryPrecisionBanner({
  isReconciling,
  reconcileNotice,
  reconcileHasDiscrepancies,
  reconcileError,
  onRunReconciliation,
}: DoubleEntryPrecisionBannerProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 border-accent/20 bg-accent-soft/20 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-ink"
        >
          ✓
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-ink">
            Account Balance Reconciliation
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Compare each account’s current backend balance with its opening balance
            and recorded income, expenses, and transfers.
          </p>
          {reconcileNotice && (
            <Callout
              className={`mt-3 py-2 text-xs ${reconcileHasDiscrepancies ? "bg-bad/10 text-bad" : "bg-good-soft text-good"}`}
              icon={<span aria-hidden="true">{reconcileHasDiscrepancies ? "!" : "✓"}</span>}
            >
              <p role={reconcileHasDiscrepancies ? "alert" : "status"}>
                {reconcileNotice}
              </p>
            </Callout>
          )}
          {reconcileError && (
            <Callout
              className="mt-3 bg-bad/10 py-2 text-xs text-bad"
              icon={<span aria-hidden="true">!</span>}
            >
              <p role="alert">{reconcileError}</p>
            </Callout>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="accent"
        size="md"
        disabled={isReconciling}
        onClick={onRunReconciliation}
        aria-live="polite"
      >
        {isReconciling ? "Checking balances…" : "Run reconciliation"}
      </Button>
    </Card>
  );
}
