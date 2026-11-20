"use client";

import { useState } from "react";
import { LoaderCircle, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; totalCap: number }) => Promise<void>;
}

export function CreateBudgetModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateBudgetModalProps) {
  const [title, setTitle] = useState("");
  const [totalCap, setTotalCap] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cap = Number(totalCap);
    if (!Number.isFinite(cap) || cap <= 0) {
      setError("Please enter a valid master budget amount greater than ₹0.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ title, totalCap: cap });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-budget-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <h2 id="create-budget-title" className="text-base font-bold text-ink">
                Create Master Budget
              </h2>
              <p className="text-xs text-muted">
                Define master cap and planning cycle
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
          <Field label="Budget Plan Title *" htmlFor="budget-title">
            <Input
              id="budget-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. May 2025 Living Expenses"
            />
          </Field>

          <Field label="Total Master Cap (₹) *" htmlFor="budget-total-cap">
            <Input
              id="budget-total-cap"
              type="number"
              min="1"
              required
              value={totalCap}
              onChange={(e) => setTotalCap(e.target.value)}
              placeholder="₹1,00,000"
            />
          </Field>

          <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="px-5 shadow-xs" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving…" : "Save Master Budget"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
