"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  BudgetEnvelope,
  BudgetOverviewMetrics,
  BudgetStatus,
  FiftyThirtyTwentyAllocation,
  TimeframePreset,
  TrajectoryPoint,
} from "../types";
import { downloadCsv } from "@/lib/csv";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  reallocateBudgetFunds,
  updateBudget,
} from "../api/budgets-api";

const EMPTY_METRICS: BudgetOverviewMetrics = {
  totalBudget: 0, envelopeCount: 0, totalOutflow: 0, outflowPercent: 0, outflowTrendPercent: null,
  safeSurplus: 0, remainingDays: 0, currentDay: 0, totalDays: 0,
  pacingGaugePercent: 0, pacingTargetPercent: 0, pacingAheadPercent: 0,
  overBudgetCount: 0, overBudgetName: "None", overBudgetAmount: 0,
  dailyRunBurn: 0, projectedSpend: 0, projectedSavings: 0,
};
const EMPTY_ALLOCATION: FiftyThirtyTwentyAllocation = {
  needs: { spent: 0, allocated: 0, actualPercent: 0, targetPercent: 50, categories: [] },
  wants: { spent: 0, allocated: 0, actualPercent: 0, targetPercent: 30, categories: [] },
  savings: { spent: 0, allocated: 0, actualPercent: 0, targetPercent: 20, categories: [] },
};

function getSelectedBudgetPeriod(timeframe: TimeframePreset) {
  const date = new Date();
  if (timeframe === "LAST_MONTH") date.setDate(0);
  return { month: date.getMonth() + 1, year: date.getFullYear() };
}

export function useBudgets() {
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);
  const [metrics, setMetrics] = useState<BudgetOverviewMetrics>(EMPTY_METRICS);
  const [fiftyThirtyTwenty, setFiftyThirtyTwenty] =
    useState<FiftyThirtyTwentyAllocation>(EMPTY_ALLOCATION);
  const [trajectoryPoints, setTrajectoryPoints] = useState<TrajectoryPoint[]>([]);
  const [periodLabel, setPeriodLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [timeframe, setTimeframe] = useState<TimeframePreset>("THIS_MONTH");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BudgetStatus>("ALL");
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<string>("ALL");
  const [progressStateFilter, setProgressStateFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const latestLoadId = useRef(0);
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

  // Fetch live budgets from backend
  const loadBudgets = useCallback(async () => {
    const loadId = ++latestLoadId.current;
    setIsLoading(true);
    setLoadError(null);
    try {
      const { month, year } = getSelectedBudgetPeriod(timeframe);
      const res = await getBudgets(month, year);
      if (loadId !== latestLoadId.current) return;
      setEnvelopes(res.envelopes ?? []);
      setMetrics(res.metrics ?? EMPTY_METRICS);
      setFiftyThirtyTwenty(res.fiftyThirtyTwenty ?? EMPTY_ALLOCATION);
      setTrajectoryPoints(res.trajectoryPoints ?? []);
      setPeriodLabel(res.period ?? "");
    } catch (error) {
      if (loadId !== latestLoadId.current) return;
      setEnvelopes([]);
      setMetrics(EMPTY_METRICS);
      setFiftyThirtyTwenty(EMPTY_ALLOCATION);
      setTrajectoryPoints([]);
      setPeriodLabel("");
      setLoadError(error instanceof Error ? error.message : "Unable to load budgets.");
    } finally {
      if (loadId === latestLoadId.current) setIsLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    void loadBudgets();
  }, [loadBudgets]);

  // Filtered envelopes
  const filteredEnvelopes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return envelopes.filter((item) => {
      if (q) {
        const nameMatch = item.name.toLowerCase().includes(q);
        const subMatch = item.sublabel.toLowerCase().includes(q);
        const tagMatch = item.categoryTag.toLowerCase().includes(q);
        const actMatch = item.recentActivity.toLowerCase().includes(q);
        if (!nameMatch && !subMatch && !tagMatch && !actMatch) return false;
      }

      if (statusFilter !== "ALL") {
        if (statusFilter === "HEALTHY") {
          if (item.status !== "HEALTHY" && item.status !== "ON_TRACK") return false;
        } else if (item.status !== statusFilter) {
          return false;
        }
      }

      if (expenseTypeFilter !== "ALL") {
        if (item.ruleCategory !== expenseTypeFilter) return false;
      }

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

  // Actions
  const addEnvelope = async (newEnv: {
    categoryId: string;
    categoryName: string;
    categoryTag: string;
    allocatedAmount: number;
    ruleCategory: BudgetEnvelope["ruleCategory"];
  }) => {
    setActionError(null);
    try {
      const period = getSelectedBudgetPeriod(timeframe);
      await createBudget({
        categoryId: newEnv.categoryId,
        amountLimit: newEnv.allocatedAmount,
        ...period,
        ruleCategory: newEnv.ruleCategory,
        categoryTag: newEnv.categoryTag || newEnv.categoryName,
      });
      await loadBudgets();
      setIsAddEnvelopeOpen(false);
      showNotice(`Budget envelope for “${newEnv.categoryName}” saved.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save this envelope.";
      setActionError(message);
      throw new Error(message);
    }
  };

  const createMasterBudget = async (data: { title: string; totalCap: number }) => {
    setActionError(null);
    try {
      const period = getSelectedBudgetPeriod(timeframe);
      await createBudget({
        amountLimit: data.totalCap,
        ...period,
        notes: data.title.trim() || undefined,
      });
      await loadBudgets();
      setIsCreateBudgetOpen(false);
      showNotice("Master monthly budget saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save the master budget.";
      setActionError(message);
      throw new Error(message);
    }
  };

  const reallocateFunds = async (
    sourceEnvId: string,
    targetEnvId: string,
    amount: number,
  ) => {
    setActionError(null);
    try {
      await reallocateBudgetFunds({
        fromBudgetId: sourceEnvId,
        toBudgetId: targetEnvId,
        amount,
      });
      await loadBudgets();
      setIsReallocateOpen(false);
      showNotice(`Successfully reallocated ₹${amount.toLocaleString("en-IN")} between envelopes.`);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to reallocate this budget.");
      throw error;
    }
  };

  const updateEnvelopeLimit = async (id: string, newLimit: number) => {
    setActionError(null);
    try {
      await updateBudget(id, { amountLimit: newLimit });
      await loadBudgets();
      setSelectedEnvelopeForEdit(null);
      showNotice("Envelope spending limit adjusted.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to update this envelope.");
      throw error;
    }
  };

  const deleteEnvelope = async (id: string) => {
    setActionError(null);
    try {
      await deleteBudget(id);
      await loadBudgets();
      showNotice("Envelope removed.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to delete this envelope.");
      throw error;
    }
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

    downloadCsv(`LedgerFlow_Budgets_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
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
    trajectoryPoints,
    periodLabel,
    isLoading,
    loadError,
    actionError,
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
    notify: showNotice,
    addEnvelope,
    createMasterBudget,
    reallocateFunds,
    updateEnvelopeLimit,
    deleteEnvelope,
    exportToCsv,
    resetRange,
    refreshBudgets: loadBudgets,
  };
}
