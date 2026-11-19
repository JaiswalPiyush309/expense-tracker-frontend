"use client";

import { useState, useMemo, useCallback } from "react";
import { BANK_ACCOUNTS_MOCK, MULTI_ACCOUNT_ACTIVITY_MOCK } from "../data/mock";
import { AccountCategoryTab, BankAccountItem } from "../types";

export function useBankAccounts() {
  const [accounts, setAccounts] =
    useState<BankAccountItem[]>(BANK_ACCOUNTS_MOCK);
  const [activeTab, setActiveTab] = useState<AccountCategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [institutionFilter, setInstitutionFilter] =
    useState<string>("All Banks");
  const [statusFilter, setStatusFilter] = useState<string>("Active");

  // Activity table filters
  const [activityAccountFilter, setActivityAccountFilter] =
    useState<string>("All (6)");
  const [activityTypeFilter, setActivityTypeFilter] =
    useState<string>("All Transactions");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);
  const [reconcileNotice, setReconcileNotice] = useState<string | null>(null);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      if (
        activeTab === "bank" &&
        acc.kind !== "savings" &&
        acc.kind !== "current"
      ) {
        return false;
      }
      if (activeTab === "credit-cards" && acc.kind !== "credit-card")
        return false;
      if (activeTab === "wallets" && acc.kind !== "wallet") return false;
      if (activeTab === "cash") return false;
      if (activeTab === "investments" && acc.kind !== "investment") {
        return false;
      }

      if (
        institutionFilter !== "All Banks" &&
        !acc.institutionName
          .toLowerCase()
          .includes(institutionFilter.toLowerCase())
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          acc.institutionName.toLowerCase().includes(q) ||
          acc.holderName.toLowerCase().includes(q) ||
          acc.maskedNumber.toLowerCase().includes(q) ||
          (acc.ifscOrSubCode?.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }

      return true;
    });
  }, [accounts, activeTab, institutionFilter, searchQuery]);

  const filteredActivity = useMemo(() => {
    return MULTI_ACCOUNT_ACTIVITY_MOCK.filter((item) => {
      if (
        activityAccountFilter !== "All (6)" &&
        !item.sourceAccountBadge
          .toLowerCase()
          .includes(activityAccountFilter.toLowerCase())
      ) {
        return false;
      }

      if (
        activityTypeFilter === "Inflows" &&
        !item.amountFormatted.startsWith("+")
      ) {
        return false;
      }
      if (
        activityTypeFilter === "Outflows" &&
        !item.amountFormatted.startsWith("-")
      ) {
        return false;
      }
      if (
        activityTypeFilter === "Transfers" &&
        item.accountDisplayType !== "transfer"
      ) {
        return false;
      }

      return true;
    });
  }, [activityAccountFilter, activityTypeFilter]);

  const handleAddAccount = useCallback(
    (newAcc: Omit<BankAccountItem, "id">) => {
      setAccounts((prev) => [
        ...prev,
        {
          ...newAcc,
          id: `acc-${Date.now()}`,
        },
      ]);
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setActiveTab("all");
    setSearchQuery("");
    setInstitutionFilter("All Banks");
    setStatusFilter("Active");
  }, []);

  const runAccountReconciliation = useCallback(async () => {
    setIsReconciling(true);
    setReconcileNotice(null);
    await new Promise((r) => setTimeout(r, 500));
    setIsReconciling(false);
    setReconcileNotice(
      "All 6 accounts verified: ₹2,61,500.00 liquid reserves & ₹28,500.00 credit liability reconciled with 0 discrepancies.",
    );
  }, []);

  return {
    accounts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    institutionFilter,
    setInstitutionFilter,
    statusFilter,
    setStatusFilter,
    activityAccountFilter,
    setActivityAccountFilter,
    activityTypeFilter,
    setActivityTypeFilter,
    currentPage,
    setCurrentPage,
    filteredAccounts,
    filteredActivity,
    handleAddAccount,
    resetFilters,
    isReconciling,
    reconcileNotice,
    runAccountReconciliation,
  };
}
