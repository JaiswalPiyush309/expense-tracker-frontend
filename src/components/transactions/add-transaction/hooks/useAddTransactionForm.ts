"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AddTransactionFormValues,
  AttachedInvoice,
  TransactionTag,
  TransactionType,
} from "../model/types";
import {
  BANK_ACCOUNTS,
  createInitialTransactionForm,
  TRANSACTION_CATEGORIES,
} from "../model/data";
import { inferMerchantFromTitle } from "../model/utils";

export function useAddTransactionForm(
  onSuccess?: (values: AddTransactionFormValues) => void,
) {
  const [values, setValues] = useState<AddTransactionFormValues>(
    createInitialTransactionForm(),
  );
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAccount = useMemo(
    () =>
      BANK_ACCOUNTS.find((acc) => acc.id === values.accountId) ??
      BANK_ACCOUNTS[0],
    [values.accountId],
  );

  const selectedCategory = useMemo(
    () =>
      TRANSACTION_CATEGORIES.find((cat) => cat.id === values.categoryId) ??
      TRANSACTION_CATEGORIES[0],
    [values.categoryId],
  );

  const isLedgerValid = useMemo(() => {
    return (
      values.amount > 0 &&
      values.title.trim().length > 0 &&
      Boolean(values.accountId) &&
      Boolean(values.categoryId)
    );
  }, [values.amount, values.title, values.accountId, values.categoryId]);

  const updateField = useCallback(
    <K extends keyof AddTransactionFormValues>(
      field: K,
      value: AddTransactionFormValues[K],
    ) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "title" && typeof value === "string") {
          const inferred = inferMerchantFromTitle(value);
          if (prev.isAutoTagged || !prev.merchant) {
            next.merchant = inferred ?? "";
            next.isAutoTagged = Boolean(inferred);
          }
        }
        if (field === "merchant") next.isAutoTagged = false;
        return next;
      });
    },
    [],
  );

  const setTransactionType = useCallback((type: TransactionType) => {
    setValues((prev) => ({ ...prev, type }));
  }, []);

  const addQuickAmount = useCallback((delta: number) => {
    setValues((prev) => ({
      ...prev,
      amount: Number((prev.amount + delta).toFixed(2)),
    }));
  }, []);

  const clearAmount = useCallback(() => {
    setValues((prev) => ({ ...prev, amount: 0 }));
  }, []);

  const addTag = useCallback((rawLabel: string) => {
    const clean = rawLabel.trim();
    if (!clean) return;
    const formatted = clean.startsWith("#") ? clean : `#${clean}`;
    const newTag: TransactionTag = {
      id: `tag-${Date.now()}`,
      label: formatted,
      tone: "blue",
    };
    setValues((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
  }, []);

  const removeTag = useCallback((id: string) => {
    setValues((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t.id !== id),
    }));
  }, []);

  const setAttachment = useCallback((attachment: AttachedInvoice | null) => {
    setValues((prev) => ({ ...prev, attachment }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(createInitialTransactionForm());
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!isLedgerValid) return;

      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 350));
        onSuccess?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isLedgerValid, onSuccess, values],
  );

  return {
    values,
    selectedAccount,
    selectedCategory,
    isDetailsExpanded,
    setIsDetailsExpanded,
    isLedgerValid,
    isSubmitting,
    updateField,
    setTransactionType,
    addQuickAmount,
    clearAmount,
    addTag,
    removeTag,
    setAttachment,
    resetForm,
    handleSubmit,
  };
}
