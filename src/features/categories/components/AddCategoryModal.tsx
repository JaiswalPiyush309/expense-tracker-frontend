"use client";

import { type FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { saveCategory } from "../categories-api";
import type { CategoryEnvelopeItem } from "../types";

interface AddCategoryModalProps {
  isOpen: boolean;
  category?: CategoryEnvelopeItem | null;
  onClose: () => void;
}

export function AddCategoryModal({
  isOpen,
  category = null,
  onClose,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(category?.name ?? "");
    setType(category?.group === "income" ? "INCOME" : "EXPENSE");
    setError(null);
  }, [category, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Enter a category name.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await saveCategory({ name: trimmedName, type }, category?.id);
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save category.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-dialog-title"
        className="w-full max-w-md p-5 shadow-xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="category-dialog-title" className="text-lg font-bold text-ink">
              {category ? "Edit category" : "Add category"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Categories help organize your income and expenses.
            </p>
          </div>
          <IconButton
            label="Close dialog"
            onClick={onClose}
            disabled={isSaving}
            className="h-8 w-8"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Category name" htmlFor="category-name">
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Groceries"
              maxLength={80}
              autoFocus
              required
            />
          </Field>

          <Field label="Category type" htmlFor="category-type">
            <Select
              id="category-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as "EXPENSE" | "INCOME")
              }
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </Select>
          </Field>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-bad-soft px-3 py-2.5 text-sm text-bad"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : category ? "Save changes" : "Add category"}
            </Button>
          </div>
        </form>
      </Card>
    </div>,
    document.body,
  );
}
