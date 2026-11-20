import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";
import type {
  BudgetEnvelope,
  BudgetOverviewMetrics,
  FiftyThirtyTwentyAllocation,
} from "../types";
import type { TrajectoryPoint } from "../types";

export interface BudgetsResponse {
  period: string;
  envelopes: BudgetEnvelope[];
  metrics: BudgetOverviewMetrics;
  fiftyThirtyTwenty: FiftyThirtyTwentyAllocation;
  masterBudget?: { id: string; amountLimit: number; notes?: string | null } | null;
  trajectoryPoints: TrajectoryPoint[];
}

export interface BudgetRecord {
  id: string;
  categoryId: string | null;
  amountLimit: number | string;
  month: number;
  year: number;
  alertThresholdPercent: number;
  ruleCategory: "NEEDS" | "WANTS" | "SAVINGS";
  categoryTag: string | null;
  notes: string | null;
}

export interface CreateBudgetPayload {
  categoryId?: string;
  amountLimit: number;
  month: number;
  year: number;
  ruleCategory?: "NEEDS" | "WANTS" | "SAVINGS";
  categoryTag?: string;
  notes?: string;
}

export interface ReallocatePayload {
  fromBudgetId: string;
  toBudgetId: string;
  amount: number;
}

export interface UpdateBudgetPayload {
  amountLimit?: number;
  alertThresholdPercent?: number;
  ruleCategory?: "NEEDS" | "WANTS" | "SAVINGS";
  categoryTag?: string;
  notes?: string;
}

function getAuthHeader(): Record<string, string> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Fetch budget envelopes, metrics, and 50/30/20 breakdown for given month/year
 */
export async function getBudgets(month?: number, year?: number): Promise<BudgetsResponse> {
  const url = new URL(`${getApiBaseUrl()}/budgets`);
  if (month) url.searchParams.set("month", String(month));
  if (year) url.searchParams.set("year", String(year));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to fetch budgets (${res.status})`);
  }

  return res.json();
}

export async function getBudgetSummary(): Promise<BudgetOverviewMetrics> {
  const res = await fetch(`${getApiBaseUrl()}/budgets/summary`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to fetch budget summary (${res.status})`);
  }
  return res.json();
}

/**
 * Create or set a budget envelope
 */
export async function createBudget(payload: CreateBudgetPayload): Promise<BudgetRecord> {
  const res = await fetch(`${getApiBaseUrl()}/budgets`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to create budget (${res.status})`);
  }

  return (await res.json()) as BudgetRecord;
}

/**
 * Reallocate funds between two envelopes
 */
export async function reallocateBudgetFunds(payload: ReallocatePayload): Promise<{
  success: boolean;
}> {
  const res = await fetch(`${getApiBaseUrl()}/budgets/reallocate`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to reallocate funds (${res.status})`);
  }

  return res.json();
}

/**
 * Update budget cap
 */
export async function updateBudget(id: string, payload: UpdateBudgetPayload): Promise<BudgetRecord> {
  const res = await fetch(`${getApiBaseUrl()}/budgets/${id}`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to update budget (${res.status})`);
  }

  return (await res.json()) as BudgetRecord;
}

/**
 * Delete a budget envelope
 */
export async function deleteBudget(id: string): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/budgets/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to delete budget (${res.status})`);
  }
}
