"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  BorrowedLoanItem,
  BorrowedMetrics,
  BorrowedSortOption,
  BorrowedStatus,
  BorrowedTimeframeFilter,
  LenderRelationshipCategory,
  BorrowedRepaymentItem,
} from "../types";
import { downloadCsv } from "@/lib/csv";
import {
  createLedgerEntry,
  deleteLedgerEntry,
  getLedgers,
  recordLedgerRepayment,
  type BackendLedgerRecord,
  type LedgerRepaymentDTO,
} from "../../money-lent/api/ledgers-api";

function mapRepayment(item: LedgerRepaymentDTO): BorrowedRepaymentItem {
  return {
    id: item.id,
    date: String(item.paymentDate).slice(0, 10),
    amount: Number(item.amount),
    paymentMode: item.paymentMode,
    notes: item.notes || undefined,
    referenceId: item.referenceId || undefined,
  };
}

function mapBackendToBorrowedItem(item: BackendLedgerRecord): BorrowedLoanItem {
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
  const repaidAmount = Number(item.settledAmount);
  const balanceDue = Number(
    item.balanceDue ?? Math.max(0, originalAmount - repaidAmount),
  );
  const dueDate = item.dueDate ? String(item.dueDate).slice(0, 10) : "";
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const status: BorrowedStatus =
    balanceDue <= 0
      ? "SETTLED"
      : dueDate && dueDate < todayDate
        ? "OVERDUE"
        : repaidAmount > 0
          ? "PARTIALLY_PAID"
          : "PENDING";

  return {
    id: item.id,
    lenderName: item.counterpartyName,
    lenderInitials: initials,
    lenderAvatarTone: tones[toneIndex],
    relationship: (item.relationship as LenderRelationshipCategory) || "Friend",
    contactNumber: item.counterpartyPhone || item.counterpartyEmail || undefined,
    counterpartyUserId: item.counterpartyUserId,
    counterpartyEmail: item.counterpartyEmail,
    counterpartyPhone: item.counterpartyPhone,
    isCounterpartyView: item.isCounterpartyView,
    originalAmount,
    repaidAmount,
    balanceDue,
    borrowedDate: item.lentDate
      ? String(item.lentDate).slice(0, 10)
      : todayDate,
    dueDate,
    status,
    receivingAccount: item.sourceAccountName || "Bank Account",
    sourceAccountId: item.sourceAccountId,
    notes: item.notes || undefined,
    interestRate: Number(item.interestRate || 0),
    repayments: (item.repayments || []).map(mapRepayment),
  };
}

export function useMoneyBorrowed() {
  const [items, setItems] = useState<BorrowedLoanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BorrowedStatus>("ALL");
  const [timeframeFilter, setTimeframeFilter] =
    useState<BorrowedTimeframeFilter>("ALL");
  const [relationshipFilter, setRelationshipFilter] =
    useState<"ALL" | LenderRelationshipCategory>("ALL");
  const [sortBy, setSortBy] = useState<BorrowedSortOption>("BALANCE_DESC");

  // Modals state
  const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState(false);
  const [selectedLoanForRepay, setSelectedLoanForRepay] =
    useState<BorrowedLoanItem | null>(null);
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
      const liveData = await getLedgers("BORROWED");
      setItems(liveData.map(mapBackendToBorrowedItem));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load borrowed loans.";
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLedgers();
  }, [loadLedgers]);

  // Metrics computation
  const metrics = useMemo<BorrowedMetrics>(() => {
    let totalBorrowed = 0;
    let totalRepaid = 0;
    let outstandingPayable = 0;
    let overdueAmount = 0;
    let settledDebtsCount = 0;
    const activeLendersSet = new Set<string>();

    for (const item of items) {
      totalBorrowed += item.originalAmount;
      totalRepaid += item.repaidAmount;
      const balance = Math.max(0, item.balanceDue);
      outstandingPayable += balance;

      if (balance > 0) {
        activeLendersSet.add(item.lenderName.toLowerCase().trim());
      }
      if (item.status === "OVERDUE" && balance > 0) {
        overdueAmount += balance;
      }
      if (item.status === "SETTLED" || balance === 0) {
        settledDebtsCount++;
      }
    }

    const repaymentProgressPercent =
      totalBorrowed > 0
        ? Number(((totalRepaid / totalBorrowed) * 100).toFixed(1))
        : 0;

    return {
      totalBorrowed,
      totalRepaid,
      outstandingPayable,
      overdueAmount,
      activeLendersCount: activeLendersSet.size,
      settledDebtsCount,
      repaymentProgressPercent,
    };
  }, [items]);

  // Filtering and Sorting
  const filteredItems = useMemo(() => {
    const today = new Date();
    const query = searchQuery.trim().toLowerCase();

    return items
      .filter((item) => {
        if (query) {
          const nameMatch = item.lenderName.toLowerCase().includes(query);
          const notesMatch = item.notes?.toLowerCase().includes(query);
          const accountMatch = item.receivingAccount.toLowerCase().includes(query);
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
          return (
            item.status === "OVERDUE" ||
            (item.dueDate && new Date(item.dueDate) < today && item.balanceDue > 0)
          );
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
            return (
              (a.dueDate ? new Date(a.dueDate).getTime() : 0) -
              (b.dueDate ? new Date(b.dueDate).getTime() : 0)
            );
          case "BORROWED_DATE_DESC":
            return (
              new Date(b.borrowedDate).getTime() -
              new Date(a.borrowedDate).getTime()
            );
          case "NAME_ASC":
            return a.lenderName.localeCompare(b.lenderName);
          default:
            return 0;
        }
      });
  }, [items, searchQuery, statusFilter, relationshipFilter, timeframeFilter, sortBy]);

  // Actions
  const addLoan = async (
    newLoan: Omit<
      BorrowedLoanItem,
      "id" | "repayments" | "repaidAmount" | "balanceDue" | "lenderInitials"
    >,
  ) => {
    setActionError(null);
    try {
      const created = await createLedgerEntry({
        type: "BORROWED",
        counterpartyName: newLoan.lenderName,
        counterpartyUserId: newLoan.counterpartyUserId || undefined,
        counterpartyEmail: newLoan.counterpartyEmail || undefined,
        counterpartyPhone: newLoan.contactNumber || undefined,
        relationship: newLoan.relationship,
        principalAmount: newLoan.originalAmount,
        interestRate: newLoan.interestRate,
        lentDate: newLoan.borrowedDate,
        dueDate: newLoan.dueDate || undefined,
        sourceAccountId: newLoan.sourceAccountId || undefined,
        sourceAccountName: newLoan.receivingAccount,
        notes: newLoan.notes,
      });

      const mapped = mapBackendToBorrowedItem(created);
      setItems((prev) => [mapped, ...prev.filter((i) => i.id !== mapped.id)]);
      setIsAddLoanModalOpen(false);
      showNotice(
        `Recorded borrowed amount of ₹${newLoan.originalAmount.toLocaleString(
          "en-IN",
        )} from ${newLoan.lenderName}. ${
          created.counterpartyUserId ? "(Linked to member account)" : ""
        }`,
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to record this borrowing.",
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
          const repaidAmount = Number(res.updatedLedger.settledAmount);
          const balanceDue = Math.max(0, originalAmount - repaidAmount);
          const today = new Date();
          const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
          const status: BorrowedStatus =
            balanceDue <= 0
              ? "SETTLED"
              : item.dueDate && item.dueDate < todayDate
                ? "OVERDUE"
                : "PARTIALLY_PAID";

          const newRepaymentItem: BorrowedRepaymentItem = {
            id: res.repayment.id,
            date: String(res.repayment.paymentDate).slice(0, 10),
            amount: Number(res.repayment.amount),
            paymentMode: res.repayment.paymentMode,
            notes: res.repayment.notes || undefined,
            referenceId: res.repayment.referenceId || undefined,
          };

          return {
            ...item,
            originalAmount,
            repaidAmount,
            balanceDue,
            status,
            repayments: [newRepaymentItem, ...item.repayments].sort((a, b) =>
              b.date.localeCompare(a.date),
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
      `Repayment of ₹${repayment.amount.toLocaleString(
        "en-IN",
      )} recorded successfully.`,
    );
  };

  const deleteLoan = async (loanId: string) => {
    setActionError(null);
    try {
      await deleteLedgerEntry(loanId);
      setItems((prev) => prev.filter((item) => item.id !== loanId));
      showNotice("Debt record removed from ledger.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to delete this borrowing.",
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
      "Lender / Creditor Name",
      "Relationship",
      "Contact",
      "Principal Borrowed (INR)",
      "Repaid (INR)",
      "Balance Due (INR)",
      "Borrowed Date",
      "Due Date",
      "Status",
      "Receiving Account",
      "Notes",
    ];

    const rows = filteredItems.map((item) => [
      item.lenderName,
      item.relationship,
      item.contactNumber || "N/A",
      item.originalAmount,
      item.repaidAmount,
      item.balanceDue,
      item.borrowedDate,
      item.dueDate,
      item.status,
      item.receivingAccount,
      item.notes || "",
    ]);

    downloadCsv(
      `LedgerFlow_Money_Borrowed_${new Date().toISOString().slice(0, 10)}.csv`,
      [headers, ...rows],
    );
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
