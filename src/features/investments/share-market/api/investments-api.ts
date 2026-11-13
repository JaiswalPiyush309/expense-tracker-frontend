import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";

// ─── Response types ───────────────────────────────────────────────────────────

export interface KpiData {
  totalInvestment: number;
  portfolioValue: number;
  totalReturns: number;
  realizedPnl: number;
  unrealizedPnl: number;
  todaysPnl: number;
  activePositionsCount: number;
  closedPositionsCount: number;
}

export interface AssetAllocationResponse {
  category: string;
  value: number;
  percentage: number;
}

export interface ChartDataPoint {
  date: string;
  invested: number;
  currentValue: number;
}

export interface RecentActivityItem {
  id: string;
  tradeType: string;
  tickerSymbol: string;
  quantity: number;
  executionPrice: number;
  tradeDate: string;
  realizedPnl: number | null;
  broker: string;
}

export interface HoldingResponse {
  id: string;
  tickerSymbol: string;
  name: string;
  assetClass: string;
  deliveryQuantity: number;
  mtfQuantity: number;
  averagePrice: number;
  investedAmount: number;
  currentValue: number;
  unrealizedPnl: number;
  totalReturnsPercent: number;
}

export interface ShareMarketDashboardResponse {
  kpis: KpiData;
  assetAllocation: AssetAllocationResponse[];
  portfolioGrowth: ChartDataPoint[];
  recentActivity: RecentActivityItem[];
  topHoldings: HoldingResponse[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function fetchDashboardMetrics(): Promise<ShareMarketDashboardResponse> {
  const url = `${getApiBaseUrl()}/investments/dashboard`;
  let res: Response;
  try {
    res = await fetch(url, { headers: authHeaders() });
  } catch {
    throw new Error("Unable to reach the server. Please check your connection.");
  }
  if (!res.ok) {
    throw new Error(
      `Failed to load dashboard data (${res.status}). Please try again.`,
    );
  }
  return res.json() as Promise<ShareMarketDashboardResponse>;
}

export async function fetchHoldings(): Promise<HoldingResponse[]> {
  const url = `${getApiBaseUrl()}/investments/holdings`;
  let res: Response;
  try {
    res = await fetch(url, { headers: authHeaders() });
  } catch {
    throw new Error("Unable to reach the server. Please check your connection.");
  }
  if (!res.ok) {
    throw new Error(
      `Failed to load holdings (${res.status}). Please try again.`,
    );
  }
  return res.json() as Promise<HoldingResponse[]>;
}
