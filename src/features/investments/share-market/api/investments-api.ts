import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";

// ─── Response types ───────────────────────────────────────────────────────────

export interface KpiData {
  totalInvestment: number;
  portfolioValue: number;
  totalReturns: number;
  realizedPnl: number;
  unrealizedPnl: number;
  todaysPnl: number | null;
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
  chargesAndTaxes: number;
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

export interface HoldingTransactionResponse {
  id: string;
  tradeType: string;
  quantity: number | string | null;
  executionPrice: number | string | null;
  chargesAndTaxes: number | string;
  realizedPnl: number | string | null;
  tradeDate: string;
  broker: string;
  segment?: string | null;
}

export interface HoldingDetailsResponse {
  holdingInfo: {
    id: string;
    tickerSymbol: string | null;
    name: string;
    assetClass: string;
    deliveryQuantity: number | string;
    mtfQuantity: number | string;
    averagePrice: number | string;
    investedAmount: number | string;
    currentValue: number | string;
    totalQuantity: number;
    deliveryPercentage: number;
    mtfPercentage: number;
  };
  recentTrades: HoldingTransactionResponse[];
}

export interface ShareMarketDashboardResponse {
  kpis: KpiData;
  assetAllocation: AssetAllocationResponse[];
  portfolioGrowth: ChartDataPoint[];
  recentActivity: RecentActivityItem[];
  topHoldings: HoldingResponse[];
}

export interface GrowwImportResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: { row: number; symbol: string; error: string }[];
}

export interface CreateInvestmentTransactionInput {
  tickerSymbol: string;
  tradeType: "BUY" | "SELL" | "DIVIDEND" | "MTF_INTEREST";
  tradeDate: string;
  segment?: "DELIVERY" | "MTF";
  quantity?: number;
  executionPrice?: number;
  chargesAndTaxes?: number;
  broker?: string;
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

export async function fetchHoldingDetails(
  holdingId: string,
): Promise<HoldingDetailsResponse> {
  const url = `${getApiBaseUrl()}/investments/holdings/${encodeURIComponent(holdingId)}/details`;
  let res: Response;
  try {
    res = await fetch(url, { headers: authHeaders() });
  } catch {
    throw new Error("Unable to reach the server. Please check your connection.");
  }
  if (!res.ok) {
    throw new Error(
      `Failed to load holding details (${res.status}). Please try again.`,
    );
  }
  return res.json() as Promise<HoldingDetailsResponse>;
}

export async function importGrowwTrades(file: File): Promise<GrowwImportResult> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/investments/import/groww`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  } catch {
    throw new Error("Unable to reach the server. Please check your connection.");
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `Groww import failed (${res.status}).`);
  }

  const payload = (await res.json()) as { data: GrowwImportResult };
  return payload.data;
}

export async function createInvestmentTransaction(
  transaction: CreateInvestmentTransactionInput,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/investments/trade`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(transaction),
    });
  } catch {
    throw new Error("Unable to reach the server. Please check your connection.");
  }

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? `Could not save investment activity (${res.status}).`);
  }
}
