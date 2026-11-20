"use client";

import { useState } from "react";
import { FolderPlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { BudgetEnvelope, BudgetRuleCategory } from "../types";

interface AddEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    envelope: Omit<
      BudgetEnvelope,
      "id" | "remainingBalance" | "utilizationPercent" | "status"
    >,
  ) => void;
}

export function AddEnvelopeModal({
  isOpen,
  onClose,
  onSubmit,
}: AddEnvelopeModalProps) {
  const [name, setName] = useState("");
  const [categoryTag, setCategoryTag] = useState("Discretionary");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [ruleCategory, setRuleCategory] = useState<BudgetRuleCategory>("WANTS");
  const [iconName, setIconName] = useState("ShoppingCart");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const alloc = Number(allocatedAmount);
    if (!name.trim()) {
      setError("Please specify the envelope name.");
      return;
    }
    if (!Number.isFinite(alloc) || alloc <= 0) {
      setError("Please enter a valid allocation cap greater than ₹0.");
      return;
    }

    onSubmit({
      name: name.trim(),
      sublabel: categoryTag,
      categoryTag,
      iconName,
      transactionCount: 0,
      allocatedAmount: alloc,
      actualSpent: 0,
      ruleCategory,
      footnoteLeft: `Remaining: ₹${alloc.toLocaleString("en-IN")}`,
      footnoteRight: "New allocation",
      recentActivity: "No transactions yet",
      period: "01 Apr – 30 Apr 2025",
    });
    onClose();
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
        onClick={onClose}
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
          <Field label="Category Envelope Name *" htmlFor="env-name">
            <Input
              id="env-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vacation &amp; Travel"
            />
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
            <Field label="Sub-tag" htmlFor="env-tag">
              <Input
                id="env-tag"
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                placeholder="e.g. Travel"
              />
            </Field>

            <Field label="Icon Style" htmlFor="env-icon">
              <Select
                id="env-icon"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
              >
                <option value="ShoppingCart">Shopping / Cart</option>
                <option value="Utensils">Dining / Food</option>
                <option value="Home">Housing / Rent</option>
                <option value="Car">Transport / Fuel</option>
                <option value="Zap">Utilities / Bills</option>
                <option value="Activity">Health / Fitness</option>
                <option value="Ticket">Entertainment</option>
                <option value="ShoppingBag">Lifestyle</option>
              </Select>
            </Field>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" className="px-5 shadow-xs">
              Add Envelope
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
