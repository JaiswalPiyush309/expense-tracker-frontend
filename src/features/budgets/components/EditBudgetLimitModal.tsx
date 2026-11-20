"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { BudgetEnvelope } from "../types";

interface EditBudgetLimitModalProps {
  envelope: BudgetEnvelope | null;
  onClose: () => void;
  onSave: (id: string, amount: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function EditBudgetLimitModal({ envelope, onClose, onSave, onDelete }: EditBudgetLimitModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAmount(envelope ? String(envelope.allocatedAmount) : "");
    setError(null);
  }, [envelope]);

  if (!envelope) return null;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a budget cap greater than ₹0.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(envelope.id, value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update this budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the ${envelope.name} budget for ${envelope.period}?`)) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onDelete(envelope.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="edit-budget-title" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close dialog" className="fixed inset-0 cursor-default bg-slate-900/60 backdrop-blur-xs" onClick={() => !isSubmitting && onClose()} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 id="edit-budget-title" className="text-base font-bold text-ink">Edit {envelope.name}</h2>
            <p className="text-xs text-muted">{envelope.period}</p>
          </div>
          <button type="button" disabled={isSubmitting} onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface-muted" aria-label="Close dialog"><X className="h-4 w-4" /></button>
        </div>
        {error && <div role="alert" className="mt-3 rounded-xl bg-bad-soft p-3 text-xs font-semibold text-bad">{error}</div>}
        <form onSubmit={submit} className="mt-4 space-y-4">
          <Field label="Monthly cap (₹)" htmlFor="edit-budget-limit">
            <Input id="edit-budget-limit" type="number" min="0.01" step="0.01" required value={amount} onChange={(event) => setAmount(event.target.value)} />
          </Field>
          <div className="flex items-center justify-between border-t border-line pt-4">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={() => void remove()} className="text-bad"><Trash2 className="h-4 w-4" />Delete</Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="accent" disabled={isSubmitting}>{isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}{isSubmitting ? "Saving…" : "Save cap"}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
