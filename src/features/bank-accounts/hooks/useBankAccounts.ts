"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteBankAccount,
  getBankAccounts,
  updateBankAccount,
  type BankAccount,
} from "@/features/profile/accounts-api";
import {
  fetchTransactionsPage,
  type ApiTransactionType,
  type TransactionPage,
} from "@/features/transactions/transactions-api";
import type { AccountCategoryTab } from "../types";

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [busyAccountId, setBusyAccountId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AccountCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("All Banks");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [activityAccountFilter, setActivityAccountFilter] = useState("All");
  const [activityTypeFilter, setActivityTypeFilter] = useState<
    "All" | ApiTransactionType
  >("All");
  const [activityPage, setActivityPage] = useState(1);
  const [activityReload, setActivityReload] = useState(0);
  const [activityResult, setActivityResult] = useState<{
    key: string;
    page: TransactionPage;
  } | null>(null);
  const [activityFailure, setActivityFailure] = useState<{
    key: string;
    message: string;
  } | null>(null);

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setAccountsError(null);
    try {
      setAccounts(await getBankAccounts(true));
    } catch (error) {
      setAccountsError(
        error instanceof Error ? error.message : "Unable to load bank accounts.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    getBankAccounts(true)
      .then((result) => {
        if (isCurrent) setAccounts(result);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setAccountsError(
            error instanceof Error ? error.message : "Unable to load bank accounts.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const activityQueryKey = [
    activityAccountFilter,
    activityTypeFilter,
    activityPage,
    activityReload,
  ].join(":");

  useEffect(() => {
    let isCurrent = true;
    fetchTransactionsPage({
      page: activityPage,
      limit: 10,
      relatedAccountId:
        activityAccountFilter === "All" ? undefined : activityAccountFilter,
      type: activityTypeFilter === "All" ? undefined : activityTypeFilter,
    })
      .then((page) => {
        if (isCurrent) setActivityResult({ key: activityQueryKey, page });
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setActivityFailure({
            key: activityQueryKey,
            message:
              error instanceof Error
                ? error.message
                : "Unable to load account activity.",
          });
        }
      });

    const refresh = () => setActivityReload((current) => current + 1);
    window.addEventListener("transactions:created", refresh);
    return () => {
      isCurrent = false;
      window.removeEventListener("transactions:created", refresh);
    };
  }, [
    activityAccountFilter,
    activityPage,
    activityQueryKey,
    activityReload,
    activityTypeFilter,
  ]);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return accounts.filter((account) => {
      if (statusFilter === "Archived" ? !account.isArchived : account.isArchived) {
        return false;
      }

      if (
        activeTab === "bank" && account.type !== "BANK" ||
        activeTab === "credit-cards" && account.type !== "CREDIT_CARD" ||
        activeTab === "wallets" && account.type !== "WALLET" ||
        activeTab === "cash" && account.type !== "CASH" ||
        activeTab === "investments" && account.type !== "INVESTMENT"
      ) {
        return false;
      }

      const institution = account.bankName || account.name;
      if (
        institutionFilter !== "All Banks" &&
        !institution.toLowerCase().includes(institutionFilter.toLowerCase())
      ) {
        return false;
      }

      if (query) {
        const searchable = [
          account.name,
          account.bankName,
          account.accountNumberLast4,
          account.upiId,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [accounts, activeTab, institutionFilter, searchQuery, statusFilter]);

  const setDefaultAccount = useCallback(async (account: BankAccount) => {
    setBusyAccountId(account.id);
    setActionError(null);
    setActionNotice(null);
    try {
      await updateBankAccount(account.id, { isDefault: true });
      setAccounts((current) =>
        current.map((item) => ({ ...item, isDefault: item.id === account.id })),
      );
      setActionNotice(`${account.name} is now your default account.`);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to change the default account.",
      );
    } finally {
      setBusyAccountId(null);
    }
  }, []);

  const removeAccount = useCallback(async (account: BankAccount) => {
    if (!window.confirm(`Remove ${account.name}?`)) return;

    setBusyAccountId(account.id);
    setActionError(null);
    setActionNotice(null);
    try {
      const result = await deleteBankAccount(account.id);
      setAccounts(await getBankAccounts(true));
      setActionNotice(result.message);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to remove this account.",
      );
    } finally {
      setBusyAccountId(null);
    }
  }, []);

  const restoreAccount = useCallback(async (account: BankAccount) => {
    setBusyAccountId(account.id);
    setActionError(null);
    setActionNotice(null);
    try {
      await updateBankAccount(account.id, { isArchived: false });
      setAccounts((current) =>
        current.map((item) =>
          item.id === account.id ? { ...item, isArchived: false } : item,
        ),
      );
      setActionNotice(`${account.name} has been restored.`);
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to restore this account.",
      );
    } finally {
      setBusyAccountId(null);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setActiveTab("all");
    setSearchQuery("");
    setInstitutionFilter("All Banks");
    setStatusFilter("Active");
  }, []);

  const changeActivityAccountFilter = useCallback((value: string) => {
    setActivityAccountFilter(value);
    setActivityPage(1);
  }, []);

  const changeActivityTypeFilter = useCallback(
    (value: "All" | ApiTransactionType) => {
      setActivityTypeFilter(value);
      setActivityPage(1);
    },
    [],
  );

  const loadActivity = useCallback(() => {
    setActivityReload((current) => current + 1);
  }, []);

  const matchingActivityResult =
    activityResult?.key === activityQueryKey ? activityResult.page : null;
  const activityError =
    activityFailure?.key === activityQueryKey ? activityFailure.message : null;
  const isActivityLoading =
    !matchingActivityResult && activityError === null;

  return {
    accounts,
    isLoading,
    accountsError,
    actionError,
    actionNotice,
    busyAccountId,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    institutionFilter,
    setInstitutionFilter,
    statusFilter,
    setStatusFilter,
    activityAccountFilter,
    changeActivityAccountFilter,
    activityTypeFilter,
    changeActivityTypeFilter,
    activityPage,
    setActivityPage,
    activityItems: matchingActivityResult?.items ?? [],
    activityTotalItems: matchingActivityResult?.meta.total ?? 0,
    activityTotalPages: matchingActivityResult?.meta.totalPages ?? 1,
    isActivityLoading,
    activityError,
    loadActivity,
    filteredAccounts,
    resetFilters,
    loadAccounts,
    setDefaultAccount,
    removeAccount,
    restoreAccount,
  };
}
