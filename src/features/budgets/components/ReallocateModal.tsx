"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatINR } from "@/lib/format";
import type { BudgetEnvelope } from "../types";

interface ReallocateModalProps {
  isOpen: boolean;
  onClose: () => void;
  envelopes: BudgetEnvelope[];
  onReallocate: (sourceId: string, targetId: string, amount: number) => Promise<void>;
}

export function ReallocateModal({
  isOpen,
  onClose,
  envelopes,
  onReallocate,
}: ReallocateModalProps) {
  // Find surplus envelopes (Healthcare, Utilities, etc.)
  const surplusEnvelopes = envelopes.filter((e) => e.remainingBalance > 0);
  // Find deficit or near-limit envelopes (Dining, Shopping)
  const deficitEnvelopes = envelopes.filter(
    (e) => e.status === "OVER_BUDGET" || e.status === "NEAR_LIMIT",
  );

  const defaultSource = surplusEnvelopes.find((e) => e.name.includes("Healthcare")) || surplusEnvelopes[0];
  const defaultTarget = deficitEnvelopes.find((e) => e.status === "OVER_BUDGET") || deficitEnvelopes[0] || envelopes[0];

  const [sourceId, setSourceId] = useState(defaultSource?.id || envelopes[0]?.id || "");
  const [targetId, setTargetId] = useState(defaultTarget?.id || envelopes[1]?.id || "");
  const [amount, setAmount] = useState("1200");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sourceEnv = envelopes.find((e) => e.id === sourceId);
  const targetEnv = envelopes.find((e) => e.id === targetId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = Number(amount);
    if (!Number.isFinite(val) || val <= 0) {
      setError("Please enter a valid reallocation amount greater than ₹0.");
      return;
    }
    if (sourceId === targetId) {
      setError("Source and Target envelopes must be different.");
      return;
    }
    if (sourceEnv && val > sourceEnv.remainingBalance) {
      setError(
        `Amount exceeds available surplus in ${sourceEnv.name} (Max: ₹${sourceEnv.remainingBalance.toLocaleString("en-IN")}).`,
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onReallocate(sourceId, targetId, val);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reallocate this budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reallocate-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <RotateCw className="h-5 w-5" />
            </span>
            <div>
              <h2 id="reallocate-title" className="text-base font-bold text-ink">
                Reallocate Envelopes
              </h2>
              <p className="text-xs text-muted">
                Shift surplus buffer to absorb category overruns
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-ink"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-bad-soft p-3 text-xs font-semibold text-bad">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Visual Transfer Pathway */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-surface-muted/50 p-3 text-xs">
            <div>
              <p className="font-semibold text-muted">Surplus Donor</p>
              <p className="mt-0.5 font-bold text-ink truncate">
                {sourceEnv?.name || "Select donor"}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Surplus: ₹{sourceEnv?.remainingBalance.toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="font-semibold text-muted">Deficit Target</p>
              <p className="mt-0.5 font-bold text-ink truncate">
                {targetEnv?.name || "Select target"}
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                {targetEnv && targetEnv.remainingBalance < 0
                  ? `Deficit: -₹${Math.abs(targetEnv.remainingBalance).toLocaleString("en-IN")}`
                  : `Balance: ₹${targetEnv?.remainingBalance.toLocaleString("en-IN")}`}
              </p>
            </div>
          </div>

          <Field label="Donor Envelope (Surplus Source)" htmlFor="realloc-source">
            <Select
              id="realloc-source"
              value={sourceId}
              disabled={isSubmitting}
              onChange={(e) => setSourceId(e.target.value)}
            >
              {envelopes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} (Surplus: ₹{Math.max(0, e.remainingBalance).toLocaleString("en-IN")})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Target Envelope (Deficit / Overrun)" htmlFor="realloc-target">
            <Select
              id="realloc-target"
              value={targetId}
              disabled={isSubmitting}
              onChange={(e) => setTargetId(e.target.value)}
            >
              {envelopes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} (Spent: ₹{e.actualSpent.toLocaleString("en-IN")} / ₹{e.allocatedAmount.toLocaleString("en-IN")})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Reallocation Amount (₹) *" htmlFor="realloc-amount">
            <Input
              id="realloc-amount"
              type="number"
              min="1"
              required
              value={amount}
              disabled={isSubmitting}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹1,200"
            />
          </Field>

          <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="gap-1.5 px-5 shadow-xs" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              <span>{isSubmitting ? "Saving…" : "Transfer Funds"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
