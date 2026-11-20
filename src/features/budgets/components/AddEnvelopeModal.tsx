"use client";

import { useEffect, useState } from "react";
import { FolderPlus, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { getCategoryOptions, type CategoryOption } from "@/features/categories/categories-api";
import type { BudgetRuleCategory } from "../types";

interface AddEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (envelope: {
    categoryId: string;
    categoryName: string;
    categoryTag: string;
    allocatedAmount: number;
    ruleCategory: BudgetRuleCategory;
  }) => Promise<void>;
}

export function AddEnvelopeModal({
  isOpen,
  onClose,
  onSubmit,
}: AddEnvelopeModalProps) {
  const [categoryTag, setCategoryTag] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [ruleCategory, setRuleCategory] = useState<BudgetRuleCategory>("WANTS");
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    setIsLoadingCategories(true);
    getCategoryOptions("EXPENSE")
      .then((options) => {
        if (!active) return;
        setCategories(options);
        setCategoryId((current) => options.some((option) => option.id === current) ? current : "");
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load expense categories.");
      })
      .finally(() => {
        if (active) setIsLoadingCategories(false);
      });
    return () => { active = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const alloc = Number(allocatedAmount);
    const selectedCategory = categories.find((category) => category.id === categoryId);
    if (!selectedCategory) {
      setError("Select an expense category for this envelope.");
      return;
    }
    if (!Number.isFinite(alloc) || alloc <= 0) {
      setError("Please enter a valid allocation cap greater than ₹0.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        categoryId,
        categoryName: selectedCategory.name,
        categoryTag: categoryTag.trim(),
        allocatedAmount: alloc,
        ruleCategory,
      });
      setCategoryTag("");
      setAllocatedAmount("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this envelope.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-envelope-title"
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
              <FolderPlus className="h-5 w-5" />
            </span>
            <div>
              <h2 id="add-envelope-title" className="text-base font-bold text-ink">
                Add Category Envelope
              </h2>
              <p className="text-xs text-muted">
                Allocate monthly spending cap to an expense category
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
          <Field label="Expense Category *" htmlFor="env-category">
            <Select id="env-category" required value={categoryId} disabled={isLoadingCategories || isSubmitting} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">{isLoadingCategories ? "Loading categories…" : "Select a category"}</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Allocated Cap (₹) *" htmlFor="env-allocated">
              <Input
                id="env-allocated"
                type="number"
                min="1"
                required
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                placeholder="₹12,000"
              />
            </Field>

            <Field label="50/30/20 Rule Role" htmlFor="env-rule-role">
              <Select
                id="env-rule-role"
                value={ruleCategory}
                onChange={(e) =>
                  setRuleCategory(e.target.value as BudgetRuleCategory)
                }
              >
                <option value="NEEDS">Needs (50% Essential)</option>
                <option value="WANTS">Wants (30% Lifestyle)</option>
                <option value="SAVINGS">Savings (20% Wealth)</option>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Envelope label" htmlFor="env-tag">
              <Input
                id="env-tag"
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                placeholder="Optional label, e.g. Travel"
              />
            </Field>

            <div className="flex items-center text-xs text-muted">The category icon is used automatically.</div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="px-5 shadow-xs" disabled={isSubmitting || isLoadingCategories || categories.length === 0}>
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving…" : "Add Envelope"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
