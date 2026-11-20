"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  LentLoanItem,
  LentMetrics,
  LentSortOption,
  LentStatus,
  LentTimeframeFilter,
  RelationshipCategory,
} from "../types";
import { downloadCsv } from "@/lib/csv";
import {
  createLedgerEntry,
  deleteLedgerEntry,
  getLedgers,
  recordLedgerRepayment,
  type BackendLedgerRecord,
  type LedgerRepaymentDTO,
} from "../api/ledgers-api";

function mapRepayment(item: LedgerRepaymentDTO) {
  return {
    id: item.id,
    date: String(item.paymentDate).slice(0, 10),
    amount: Number(item.amount),
    paymentMode: item.paymentMode,
    notes: item.notes || undefined,
    referenceId: item.referenceId || undefined,
  };
}

function mapBackendToLentItem(item: BackendLedgerRecord): LentLoanItem {
  const initials =
    item.counterpartyName
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "LF";

  const tones = ["accent", "good", "neutral"] as const;
  const toneIndex = Math.abs(
    item.counterpartyName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0),
  ) % tones.length;

  const originalAmount = Number(item.principalAmount);
  const recoveredAmount = Number(item.settledAmount);
  const balanceDue = Number(item.balanceDue ?? originalAmount - recoveredAmount);
  const dueDate = item.dueDate ? String(item.dueDate).slice(0, 10) : "";
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const status: LentStatus =
    balanceDue <= 0
      ? "SETTLED"
      : dueDate && dueDate < todayDate
        ? "OVERDUE"
        : (item.status as LentStatus);

  return {
    id: item.id,
    borrowerName: item.counterpartyName,
    borrowerInitials: initials,
    borrowerAvatarTone: tones[toneIndex],
    relationship: (item.relationship as RelationshipCategory) || "Friend",
    contactNumber: item.counterpartyPhone || item.counterpartyEmail || undefined,
    counterpartyUserId: item.counterpartyUserId,
    counterpartyEmail: item.counterpartyEmail,
    counterpartyPhone: item.counterpartyPhone,
    isCounterpartyView: item.isCounterpartyView,
    originalAmount,
    recoveredAmount,
    balanceDue,
    lentDate: item.lentDate ? String(item.lentDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
    dueDate,
    status,
    sourceAccount: item.sourceAccountName || "Bank Account",
    sourceAccountId: item.sourceAccountId,
    notes: item.notes || undefined,
    interestRate: Number(item.interestRate || 0),
    repayments: (item.repayments || []).map(mapRepayment),
  };
}

export function useMoneyLent() {
  const [items, setItems] = useState<LentLoanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | LentStatus>("ALL");
  const [timeframeFilter, setTimeframeFilter] =
    useState<LentTimeframeFilter>("ALL");
  const [relationshipFilter, setRelationshipFilter] =
    useState<"ALL" | RelationshipCategory>("ALL");
  const [sortBy, setSortBy] = useState<LentSortOption>("BALANCE_DESC");

  // Modals state
  const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState(false);
  const [selectedLoanForRepay, setSelectedLoanForRepay] =
    useState<LentLoanItem | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(
    null,
  );

  const showNotice = (msg: string) => {
    setActionSuccessNotice(msg);
    setTimeout(() => {
      setActionSuccessNotice(null);
    }, 4500);
  };

  // Fetch live items from backend
  const loadLedgers = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const liveData = await getLedgers("LENT");
      setItems(liveData.map(mapBackendToLentItem));
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load lending records.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLedgers();
  }, [loadLedgers]);

  // Metrics computation
  const metrics = useMemo<LentMetrics>(() => {
    let totalLent = 0;
    let totalRecovered = 0;
    let outstandingReceivable = 0;
    let overdueAmount = 0;
    let settledLoansCount = 0;
    const activeBorrowersSet = new Set<string>();

    for (const item of items) {
      totalLent += item.originalAmount;
      totalRecovered += item.recoveredAmount;
      const balance = Math.max(0, item.balanceDue);
      outstandingReceivable += balance;

      if (balance > 0) {
        activeBorrowersSet.add(item.borrowerName.toLowerCase().trim());
      }
      if (item.status === "OVERDUE" && balance > 0) {
        overdueAmount += balance;
      }
      if (item.status === "SETTLED" || balance === 0) {
        settledLoansCount++;
      }
    }

    const recoveryRatePercent =
      totalLent > 0 ? Number(((totalRecovered / totalLent) * 100).toFixed(1)) : 0;

    return {
      totalLent,
      totalRecovered,
      outstandingReceivable,
      overdueAmount,
      activeBorrowersCount: activeBorrowersSet.size,
      settledLoansCount,
      recoveryRatePercent,
    };
  }, [items]);

  // Filtering and Sorting
  const filteredItems = useMemo(() => {
    const today = new Date();
    const query = searchQuery.trim().toLowerCase();

    return items
      .filter((item) => {
        if (query) {
          const nameMatch = item.borrowerName.toLowerCase().includes(query);
          const notesMatch = item.notes?.toLowerCase().includes(query);
          const accountMatch = item.sourceAccount.toLowerCase().includes(query);
          const phoneMatch = item.contactNumber?.toLowerCase().includes(query);
          if (!nameMatch && !notesMatch && !accountMatch && !phoneMatch) {
            return false;
          }
        }

        if (statusFilter !== "ALL" && item.status !== statusFilter) {
          return false;
        }

        if (
          relationshipFilter !== "ALL" &&
          item.relationship !== relationshipFilter
        ) {
          return false;
        }

        if (timeframeFilter === "OVERDUE") {
          return item.status === "OVERDUE" || (item.dueDate && new Date(item.dueDate) < today && item.balanceDue > 0);
        }
        if (timeframeFilter === "SETTLED") {
          return item.status === "SETTLED" || item.balanceDue === 0;
        }
        if (timeframeFilter === "DUE_THIS_MONTH") {
          if (!item.dueDate) return false;
          const due = new Date(item.dueDate);
          return (
            due.getFullYear() === today.getFullYear() &&
            due.getMonth() === today.getMonth() &&
            item.balanceDue > 0
          );
        }
        if (timeframeFilter === "DUE_THIS_WEEK") {
          if (!item.dueDate) return false;
          const due = new Date(item.dueDate);
          const diffDays = Math.ceil(
            (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );
          return diffDays >= 0 && diffDays <= 7 && item.balanceDue > 0;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "BALANCE_DESC":
            return b.balanceDue - a.balanceDue;
          case "BALANCE_ASC":
            return a.balanceDue - b.balanceDue;
          case "DUE_DATE_ASC":
            return (a.dueDate ? new Date(a.dueDate).getTime() : 0) - (b.dueDate ? new Date(b.dueDate).getTime() : 0);
          case "LENT_DATE_DESC":
            return new Date(b.lentDate).getTime() - new Date(a.lentDate).getTime();
          case "NAME_ASC":
            return a.borrowerName.localeCompare(b.borrowerName);
          default:
            return 0;
        }
      });
  }, [items, searchQuery, statusFilter, relationshipFilter, timeframeFilter, sortBy]);

  // Actions
  const addLoan = async (
    newLoan: Omit<
      LentLoanItem,
      "id" | "repayments" | "recoveredAmount" | "balanceDue" | "borrowerInitials"
    >,
  ) => {
    setActionError(null);
    try {
      const created = await createLedgerEntry({
        type: "LENT",
        counterpartyName: newLoan.borrowerName,
        counterpartyUserId: newLoan.counterpartyUserId || undefined,
        counterpartyEmail: newLoan.counterpartyEmail || undefined,
        counterpartyPhone: newLoan.contactNumber || undefined,
        relationship: newLoan.relationship,
        principalAmount: newLoan.originalAmount,
        interestRate: newLoan.interestRate,
        lentDate: newLoan.lentDate,
        dueDate: newLoan.dueDate || undefined,
        sourceAccountId: newLoan.sourceAccountId || undefined,
        sourceAccountName: newLoan.sourceAccount,
        notes: newLoan.notes,
      });

      const mapped = mapBackendToLentItem(created);
      setItems((prev) => [mapped, ...prev.filter((i) => i.id !== mapped.id)]);
      setIsAddLoanModalOpen(false);
      showNotice(
        `Recorded new loan of ₹${newLoan.originalAmount.toLocaleString("en-IN")} to ${newLoan.borrowerName}. ${
          created.counterpartyUserId ? "(Linked to member account)" : ""
        }`,
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to record this loan.",
      );
      throw error;
    }
  };

  const recordRepayment = async (
    loanId: string,
    repayment: {
      amount: number;
      date: string;
      paymentMode: "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE";
      notes?: string;
    },
  ) => {
    setActionError(null);
    try {
      const res = await recordLedgerRepayment(loanId, {
        amount: repayment.amount,
        paymentDate: repayment.date,
        paymentMode: repayment.paymentMode,
        notes: repayment.notes,
      });

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== loanId) return item;
          const originalAmount = Number(res.updatedLedger.principalAmount);
          const recoveredAmount = Number(res.updatedLedger.settledAmount);
          const balanceDue = Math.max(0, originalAmount - recoveredAmount);
          const today = new Date();
          const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const status: LentStatus =
            balanceDue <= 0
              ? "SETTLED"
              : item.dueDate && item.dueDate < todayDate
                ? "OVERDUE"
                : "PARTIALLY_PAID";
          return {
            ...item,
            originalAmount,
            recoveredAmount,
            balanceDue,
            status,
            repayments: [mapRepayment(res.repayment), ...item.repayments].sort(
              (a, b) => b.date.localeCompare(a.date),
            ),
          };
        }),
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to record repayment.",
      );
      throw error;
    }

    setSelectedLoanForRepay(null);
    showNotice(
      `Repayment of ₹${repayment.amount.toLocaleString("en-IN")} recorded successfully.`,
    );
  };

  const deleteLoan = async (loanId: string) => {
    setActionError(null);
    try {
      await deleteLedgerEntry(loanId);
      setItems((prev) => prev.filter((item) => item.id !== loanId));
      showNotice("Loan record removed from ledger.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to delete this loan.",
      );
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTimeframeFilter("ALL");
    setRelationshipFilter("ALL");
    setSortBy("BALANCE_DESC");
  };

  const exportToCsv = () => {
    const headers = [
      "Borrower Name",
      "Relationship",
      "Contact",
      "Principal Lent (INR)",
      "Recovered (INR)",
      "Balance Due (INR)",
      "Lent Date",
      "Due Date",
      "Status",
      "Source Account",
      "Notes",
    ];

    const rows = filteredItems.map((item) => [
      item.borrowerName,
      item.relationship,
      item.contactNumber || "N/A",
      item.originalAmount,
      item.recoveredAmount,
      item.balanceDue,
      item.lentDate,
      item.dueDate,
      item.status,
      item.sourceAccount,
      item.notes || "",
    ]);

    downloadCsv(`LedgerFlow_Money_Lent_${new Date().toISOString().slice(0, 10)}.csv`, [
      headers,
      ...rows,
    ]);
  };

  return {
    items: filteredItems,
    allItems: items,
    metrics,
    isLoading,
    loadError,
    actionError,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    timeframeFilter,
    setTimeframeFilter,
    relationshipFilter,
    setRelationshipFilter,
    sortBy,
    setSortBy,
    resetFilters,
    isAddLoanModalOpen,
    setIsAddLoanModalOpen,
    selectedLoanForRepay,
    setSelectedLoanForRepay,
    actionSuccessNotice,
    addLoan,
    recordRepayment,
    deleteLoan,
    exportToCsv,
    refreshLedgers: loadLedgers,
  };
}
