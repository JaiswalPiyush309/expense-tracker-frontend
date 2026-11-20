"use client";

import { useMemo, useState } from "react";
import {
  INITIAL_BUDGET_ENVELOPES,
  INITIAL_FIFTY_THIRTY_TWENTY,
  INITIAL_OVERVIEW_METRICS,
  INITIAL_TRAJECTORY_POINTS,
} from "../data/mock-data";
import type {
  BudgetEnvelope,
  BudgetOverviewMetrics,
  BudgetStatus,
  FiftyThirtyTwentyAllocation,
  TimeframePreset,
  TrajectoryPoint,
} from "../types";
import { downloadCsv } from "@/lib/csv";

export function useBudgets() {
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>(
    INITIAL_BUDGET_ENVELOPES,
  );
  const [timeframe, setTimeframe] = useState<TimeframePreset>("THIS_MONTH");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BudgetStatus>("ALL");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<string>("ALL");
  const [progressStateFilter, setProgressStateFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [trajectoryMode, setTrajectoryMode] = useState<
    "CUMULATIVE" | "DAILY_OUTFLOW"
  >("CUMULATIVE");

  // Modals state
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isAddEnvelopeOpen, setIsAddEnvelopeOpen] = useState(false);
  const [isReallocateOpen, setIsReallocateOpen] = useState(false);
  const [selectedEnvelopeForEdit, setSelectedEnvelopeForEdit] =
    useState<BudgetEnvelope | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  // Dynamically compute metrics from current envelopes
  const metrics = useMemo<BudgetOverviewMetrics>(() => {
    let totalBudget = 0;
    let totalOutflow = 0;
    let overBudgetCount = 0;
    let largestOverBudgetName = "";
    let largestOverBudgetAmount = 0;

    for (const env of envelopes) {
      totalBudget += env.allocatedAmount;
      totalOutflow += env.actualSpent;
      if (env.actualSpent > env.allocatedAmount) {
        overBudgetCount++;
        const over = env.actualSpent - env.allocatedAmount;
        if (over > largestOverBudgetAmount) {
          largestOverBudgetAmount = over;
          largestOverBudgetName = env.name;
        }
      }
    }

    const safeSurplus = Math.max(0, totalBudget - totalOutflow);
    const outflowPercent =
      totalBudget > 0 ? Number(((totalOutflow / totalBudget) * 100).toFixed(1)) : 0;
    const remainingDays = 14;
    const dailyRunBurn =
      remainingDays > 0 ? Number((safeSurplus / remainingDays).toFixed(2)) : 0;

    return {
      totalBudget,
      totalOutflow,
      outflowPercent,
      outflowTrendPercent: -4.8,
      safeSurplus,
      remainingDays,
      currentDay: 16,
      totalDays: 30,
      pacingGaugePercent: outflowPercent,
      pacingTargetPercent: 53.3,
      pacingAheadPercent: Number((outflowPercent - 53.3).toFixed(1)),
      overBudgetCount,
      overBudgetName: largestOverBudgetName || "None",
      overBudgetAmount: largestOverBudgetAmount,
      dailyRunBurn,
      projectedSpend: 94200,
      projectedSavings: Math.max(0, totalBudget - 94200),
    };
  }, [envelopes]);

  // 50/30/20 Rule computation
  const fiftyThirtyTwenty = useMemo<FiftyThirtyTwentyAllocation>(() => {
    let needsSpent = 0;
    let wantsSpent = 0;
    let total = metrics.totalOutflow || 1;

    for (const env of envelopes) {
      if (env.ruleCategory === "NEEDS") needsSpent += env.actualSpent;
      else if (env.ruleCategory === "WANTS") wantsSpent += env.actualSpent;
    }

    const needsPercent = Math.round((needsSpent / total) * 100);
    const wantsPercent = Math.round((wantsSpent / total) * 100);
    const savingsPercent = Math.max(0, 100 - needsPercent - wantsPercent);

    return {
      needs: {
        spent: needsSpent,
        allocated: 50000,
        actualPercent: needsPercent,
        targetPercent: 50,
        categories: ["Rent", "Groceries", "Utilities", "Health"],
      },
      wants: {
        spent: wantsSpent,
        allocated: 30000,
        actualPercent: wantsPercent,
        targetPercent: 30,
        categories: ["Dining", "Shopping", "Entertainment"],
      },
      savings: {
        spent: Math.round(total * 0.2),
        allocated: 20000,
        actualPercent: savingsPercent,
        targetPercent: 20,
        categories: ["SIPs", "Emergency Buffer"],
      },
    };
  }, [envelopes, metrics.totalOutflow]);

  // Filtered envelopes
  const filteredEnvelopes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return envelopes.filter((item) => {
      // Search
      if (q) {
        const nameMatch = item.name.toLowerCase().includes(q);
        const subMatch = item.sublabel.toLowerCase().includes(q);
        const tagMatch = item.categoryTag.toLowerCase().includes(q);
        const actMatch = item.recentActivity.toLowerCase().includes(q);
        if (!nameMatch && !subMatch && !tagMatch && !actMatch) return false;
      }

      // Status pill tab
      if (statusFilter !== "ALL") {
        if (statusFilter === "HEALTHY") {
          if (item.status !== "HEALTHY" && item.status !== "ON_TRACK") return false;
        } else if (item.status !== statusFilter) {
          return false;
        }
      }

      // Expense type dropdown
      if (expenseTypeFilter !== "ALL") {
        if (item.ruleCategory !== expenseTypeFilter) return false;
      }

      // Progress state dropdown
      if (progressStateFilter !== "ALL") {
        if (progressStateFilter === "OVER" && item.status !== "OVER_BUDGET")
          return false;
        if (progressStateFilter === "NEAR" && item.status !== "NEAR_LIMIT")
          return false;
        if (
          progressStateFilter === "HEALTHY" &&
          item.status !== "HEALTHY" &&
          item.status !== "ON_TRACK"
        )
          return false;
      }

      return true;
    });
  }, [
    envelopes,
    searchQuery,
    statusFilter,
    expenseTypeFilter,
    progressStateFilter,
  ]);

  // Status counts
  const statusCounts = useMemo(() => {
    let overBudget = 0;
    let nearLimit = 0;
    let healthy = 0;

    for (const e of envelopes) {
      if (e.status === "OVER_BUDGET") overBudget++;
      else if (e.status === "NEAR_LIMIT") nearLimit++;
      else healthy++;
    }

    return {
      all: envelopes.length,
      overBudget,
      nearLimit,
      healthy,
    };
  }, [envelopes]);

  // Action Handlers
  const addEnvelope = (newEnv: Omit<BudgetEnvelope, "id" | "remainingBalance" | "utilizationPercent" | "status">) => {
    const remaining = newEnv.allocatedAmount - newEnv.actualSpent;
    const util = Number(((newEnv.actualSpent / newEnv.allocatedAmount) * 100).toFixed(1));
    const status: BudgetStatus =
      util > 100
        ? "OVER_BUDGET"
        : util >= 80
          ? "NEAR_LIMIT"
          : util >= 60
            ? "ON_TRACK"
            : "HEALTHY";

    const created: BudgetEnvelope = {
      ...newEnv,
      id: `env-${Date.now()}`,
      remainingBalance: remaining,
      utilizationPercent: util,
      status,
    };

    setEnvelopes((prev) => [...prev, created]);
    setIsAddEnvelopeOpen(false);
    showNotice(`Added envelope "${created.name}" with budget of ₹${created.allocatedAmount.toLocaleString("en-IN")}.`);
  };

  const reallocateFunds = (sourceEnvId: string, targetEnvId: string, amount: number) => {
    setEnvelopes((prev) =>
      prev.map((e) => {
        if (e.id === sourceEnvId) {
          const newAlloc = e.allocatedAmount - amount;
          const newRem = newAlloc - e.actualSpent;
          const newUtil = Number(((e.actualSpent / newAlloc) * 100).toFixed(1));
          return {
            ...e,
            allocatedAmount: newAlloc,
            remainingBalance: newRem,
            utilizationPercent: newUtil,
            status: newUtil > 100 ? "OVER_BUDGET" : newUtil >= 80 ? "NEAR_LIMIT" : "HEALTHY",
            footnoteLeft: `Remaining: ₹${newRem.toLocaleString("en-IN")}`,
          };
        }
        if (e.id === targetEnvId) {
          const newAlloc = e.allocatedAmount + amount;
          const newRem = newAlloc - e.actualSpent;
          const newUtil = Number(((e.actualSpent / newAlloc) * 100).toFixed(1));
          return {
            ...e,
            allocatedAmount: newAlloc,
            remainingBalance: newRem,
            utilizationPercent: newUtil,
            status: newUtil > 100 ? "OVER_BUDGET" : newUtil >= 80 ? "NEAR_LIMIT" : "HEALTHY",
            footnoteLeft:
              newRem < 0
                ? `Overrun: -₹${Math.abs(newRem).toLocaleString("en-IN")}`
                : `Remaining: ₹${newRem.toLocaleString("en-IN")}`,
          };
        }
        return e;
      }),
    );
    setIsReallocateOpen(false);
    showNotice(`Successfully reallocated ₹${amount.toLocaleString("en-IN")} between envelopes.`);
  };

  const updateEnvelopeLimit = (id: string, newLimit: number) => {
    setEnvelopes((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const newRem = newLimit - e.actualSpent;
        const newUtil = Number(((e.actualSpent / newLimit) * 100).toFixed(1));
        return {
          ...e,
          allocatedAmount: newLimit,
          remainingBalance: newRem,
          utilizationPercent: newUtil,
          status: newUtil > 100 ? "OVER_BUDGET" : newUtil >= 80 ? "NEAR_LIMIT" : "HEALTHY",
          footnoteLeft:
            newRem < 0
              ? `Overrun: -₹${Math.abs(newRem).toLocaleString("en-IN")}`
              : `Remaining: ₹${newRem.toLocaleString("en-IN")}`,
        };
      }),
    );
    setSelectedEnvelopeForEdit(null);
    showNotice("Envelope spending limit adjusted.");
  };

  const deleteEnvelope = (id: string) => {
    setEnvelopes((prev) => prev.filter((e) => e.id !== id));
    showNotice("Envelope removed.");
  };

  const exportToCsv = () => {
    const headers = [
      "Category Envelope",
      "Tag",
      "Period",
      "Allocated Budget (INR)",
      "Actual Spent (INR)",
      "Remaining Balance (INR)",
      "Utilization %",
      "Status",
      "Rule Classification",
      "Recent Activity",
    ];

    const rows = filteredEnvelopes.map((item) => [
      item.name,
      item.sublabel,
      item.period,
      item.allocatedAmount,
      item.actualSpent,
      item.remainingBalance,
      `${item.utilizationPercent}%`,
      item.status,
      item.ruleCategory,
      item.recentActivity,
    ]);

    downloadCsv(`LedgerFlow_Budgets_April_2025.csv`, [headers, ...rows]);
  };

  const resetRange = () => {
    setTimeframe("THIS_MONTH");
    setStatusFilter("ALL");
    setExpenseTypeFilter("ALL");
    setProgressStateFilter("ALL");
    setSearchQuery("");
  };

  return {
    envelopes: filteredEnvelopes,
    allEnvelopes: envelopes,
    metrics,
    fiftyThirtyTwenty,
    trajectoryPoints: INITIAL_TRAJECTORY_POINTS,
    timeframe,
    setTimeframe,
    statusFilter,
    setStatusFilter,
    statusCounts,
    expenseTypeFilter,
    setExpenseTypeFilter,
    progressStateFilter,
    setProgressStateFilter,
    searchQuery,
    setSearchQuery,
    isAlertDismissed,
    setIsAlertDismissed,
    trajectoryMode,
    setTrajectoryMode,
    isCreateBudgetOpen,
    setIsCreateBudgetOpen,
    isAddEnvelopeOpen,
    setIsAddEnvelopeOpen,
    isReallocateOpen,
    setIsReallocateOpen,
    selectedEnvelopeForEdit,
    setSelectedEnvelopeForEdit,
    actionNotice,
    addEnvelope,
    reallocateFunds,
    updateEnvelopeLimit,
    deleteEnvelope,
    exportToCsv,
    resetRange,
  };
}
