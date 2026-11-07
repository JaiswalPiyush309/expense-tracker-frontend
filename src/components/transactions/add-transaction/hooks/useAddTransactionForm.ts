"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AddTransactionFormValues,
  AttachedInvoice,
  TransactionTag,
  TransactionType,
} from "../model/types";
import { createInitialTransactionForm } from "../model/data";
import { inferMerchantFromTitle } from "../model/utils";
import { getAccountDropdownOptions } from "@/features/profile/accounts-api";
import type { BankAccountOption } from "../model/types";
import { getCategoryOptions, type CategoryOption, type CategoryType } from "@/features/categories/categories-api";

export function useAddTransactionForm(
  onSuccess?: (values: AddTransactionFormValues) => void,
  initialType: TransactionType = "expense",
) {
  const [values, setValues] = useState<AddTransactionFormValues>(
    () => createInitialTransactionForm(initialType),
  );
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<BankAccountOption[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  useEffect(() => {
    let active = true;
    getAccountDropdownOptions()
      .then((result) => {
        if (!active) return;
        const options = result.map((account) => ({
          id: account.id,
          bankName: account.bankName ?? account.name,
          maskedNumber: account.accountNumberLast4 ? `••${account.accountNumberLast4}` : "",
          accountType: account.type.replaceAll("_", " "),
          balance: Number(account.currentBalance),
          shortLabel: account.name,
        }));
        setAccounts(options);
        const defaultId = result.find((account) => account.isDefault)?.id ?? options[0]?.id ?? "";
        setValues((current) => ({
          ...current,
          accountId: options.some((account) => account.id === current.accountId)
            ? current.accountId
            : defaultId,
        }));
      })
      .catch((error: unknown) => {
        if (active) setAccountsError(error instanceof Error ? error.message : "Unable to load accounts.");
      })
      .finally(() => {
        if (active) setAccountsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const categoryType: CategoryType = values.type === "income" || values.type === "borrowing" ? "INCOME" : "EXPENSE";
  useEffect(() => {
    let active = true;
    setCategoriesLoading(true);
    setCategoriesError("");
    setCategories([]);
    getCategoryOptions(categoryType)
      .then((result) => {
        if (!active) return;
        setCategories(result);
        setValues((current) => ({
          ...current,
          categoryId: result.some((category) => category.id === current.categoryId)
            ? current.categoryId
            : "",
        }));
      })
      .catch((error: unknown) => {
        if (active) setCategoriesError(error instanceof Error ? error.message : "Unable to load categories.");
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });
    return () => { active = false; };
  }, [categoryType]);

  const selectedAccount = useMemo(
    () =>
      accounts.find((acc) => acc.id === values.accountId) ?? accounts[0],
    [accounts, values.accountId],
  );

  const isLedgerValid = useMemo(() => {
    return (
      values.amount > 0 &&
      values.title.trim().length > 0 &&
      accounts.length > 0 &&
      Boolean(values.accountId) &&
      categories.length > 0 &&
      Boolean(values.categoryId)
    );
  }, [accounts.length, categories.length, values.amount, values.title, values.accountId, values.categoryId]);

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
    setValues(createInitialTransactionForm(initialType));
  }, [initialType]);

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
    accounts,
    accountsLoading,
    accountsError,
    categories,
    categoriesLoading,
    categoriesError,
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
