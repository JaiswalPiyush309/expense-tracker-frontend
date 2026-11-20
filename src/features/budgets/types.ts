import type { ReactNode } from "react";

export type BudgetStatus = "HEALTHY" | "ON_TRACK" | "NEAR_LIMIT" | "OVER_BUDGET";

export type BudgetRuleCategory = "NEEDS" | "WANTS" | "SAVINGS";

export type TimeframePreset =
  | "THIS_MONTH"
  | "LAST_MONTH";

export interface BudgetEnvelope {
  id: string;
  name: string;
  sublabel: string;
  categoryTag: string; // e.g. "Primary Residence", "Daily Needs", "Discretionary"
  iconName: string; // icon identifier e.g. "Home", "ShoppingCart", "Utensils", etc.
  transactionCount: number;
  allocatedAmount: number;
  actualSpent: number;
  remainingBalance: number;
  utilizationPercent: number;
  status: BudgetStatus;
  ruleCategory: BudgetRuleCategory;
  footnoteLeft: string; // e.g. "Remaining: ₹5,000", "Overrun: -₹1,200"
  footnoteRight: string; // e.g. "Fixed Monthly Outflow", "₹428 / day safe", "0 days allowance"
  recentActivity: string; // e.g. "Last: Apr 03 (Rent NEFT)", "Blinkit, Nature's Basket"
  period: string; // "01 Apr - 30 Apr 2025"
  notes?: string;
}

export interface BudgetOverviewMetrics {
  totalBudget: number;
  envelopeCount: number;
  totalOutflow: number;
  outflowPercent: number;
  outflowTrendPercent: number | null;
  safeSurplus: number;
  remainingDays: number;
  currentDay: number;
  totalDays: number;
  pacingGaugePercent: number;
  pacingTargetPercent: number;
  pacingAheadPercent: number;
  overBudgetCount: number;
  overBudgetName: string;
  overBudgetAmount: number;
  dailyRunBurn: number;
  projectedSpend: number;
  projectedSavings: number;
}

export interface FiftyThirtyTwentyAllocation {
  needs: {
    spent: number;
    allocated: number;
    actualPercent: number;
    targetPercent: number;
    categories: string[];
  };
  wants: {
    spent: number;
    allocated: number;
    actualPercent: number;
    targetPercent: number;
    categories: string[];
  };
  savings: {
    spent: number;
    allocated: number;
    actualPercent: number;
    targetPercent: number;
    categories: string[];
  };
}

export interface TrajectoryPoint {
  day: number;
  label: string;
  actualBurn: number | null;
  linearPlan: number;
  projectedClose: number | null;
  dailyOutflow?: number;
}
