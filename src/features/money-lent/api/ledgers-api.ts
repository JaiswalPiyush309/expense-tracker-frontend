import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";

export interface LedgerRepaymentDTO {
  id: string;
  ledgerId: string;
  recordedByUserId: string;
  amount: number | string;
  paymentDate: string;
  paymentMode: "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE";
  referenceId?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface BackendLedgerItem {
  id: string;
  userId?: string;
  creatorUserId?: string;
  creatorName?: string;
  creatorEmail?: string;
  counterpartyUserId: string | null;
  type: "LENT" | "BORROWED";
  counterpartyName: string;
  counterpartyEmail: string | null;
  counterpartyPhone: string | null;
  relationship: string | null;
  principalAmount: number | string;
  settledAmount: number | string;
  balanceDue: number | string;
  interestRate: number | string;
  lentDate: string;
  dueDate: string | null;
  sourceAccountId: string | null;
  sourceAccountName: string | null;
  description: string | null;
  notes: string | null;
  status: "PENDING" | "PARTIALLY_PAID" | "SETTLED";
  isCounterpartyView: boolean;
  repayments: LedgerRepaymentDTO[];
  createdAt: string;
  updatedAt: string;
}

/** Creation returns the persisted entity; list responses add computed fields and repayments. */
export type BackendLedgerRecord = Omit<
  BackendLedgerItem,
  "balanceDue" | "isCounterpartyView" | "repayments"
> & {
  balanceDue?: number | string;
  isCounterpartyView?: boolean;
  repayments?: LedgerRepaymentDTO[];
};

export type UpdatedLedgerResponse = Pick<
  BackendLedgerItem,
  "id" | "principalAmount" | "settledAmount" | "status"
>;

export interface MemberSearchResult {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface LedgerSummaryMetrics {
  lent: LedgerSummaryGroup;
  borrowed: LedgerSummaryGroup;
}

export interface LedgerSummaryGroup {
  totalOriginal: number;
  totalSettled: number;
  balanceDue: number;
  activeCount: number;
  overdueCount: number;
  overdueAmount: number;
  uniqueContacts: number;
  settledCount: number;
  recoveryRatePercent: number;
}

export interface CreateLedgerPayload {
  type: "LENT" | "BORROWED";
  counterpartyName: string;
  counterpartyUserId?: string;
  counterpartyEmail?: string;
  counterpartyPhone?: string;
  relationship?: string;
  principalAmount: number;
  interestRate?: number;
  lentDate?: string;
  dueDate?: string;
  sourceAccountId?: string;
  sourceAccountName?: string;
  description?: string;
  notes?: string;
}

export interface CreateRepaymentPayload {
  amount: number;
  paymentDate: string;
  paymentMode?: "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE";
  referenceId?: string;
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
 * Fetch all personal ledgers (filtered by LENT or BORROWED)
 */
export async function getLedgers(type?: "LENT" | "BORROWED"): Promise<BackendLedgerItem[]> {
  const url = new URL(`${getApiBaseUrl()}/ledgers`);
  if (type) {
    url.searchParams.set("type", type);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to fetch ledgers (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch overall summary metrics
 */
export async function getLedgerSummary(): Promise<LedgerSummaryMetrics> {
  const res = await fetch(`${getApiBaseUrl()}/ledgers/summary`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to fetch ledger summary (${res.status})`);
  }

  return res.json();
}

/**
 * Search registered members on the platform
 */
export async function searchRegisteredMembers(query: string): Promise<MemberSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const url = new URL(`${getApiBaseUrl()}/ledgers/members`);
  url.searchParams.set("query", query.trim());

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

/**
 * Create a new personal loan entry (Lent or Borrowed)
 */
export async function createLedgerEntry(payload: CreateLedgerPayload): Promise<BackendLedgerRecord> {
  const res = await fetch(`${getApiBaseUrl()}/ledgers`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const msg = Array.isArray(errorBody?.message)
      ? errorBody.message.join(", ")
      : errorBody?.message || `Failed to record loan entry (${res.status})`;
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Update an existing loan entry
 */
export async function updateLedgerEntry(
  id: string,
  payload: Partial<CreateLedgerPayload>,
): Promise<BackendLedgerRecord> {
  const res = await fetch(`${getApiBaseUrl()}/ledgers/${id}`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to update loan (${res.status})`);
  }

  return res.json();
}

/**
 * Delete a loan entry
 */
export async function deleteLedgerEntry(id: string): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/ledgers/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to delete loan (${res.status})`);
  }
}

/**
 * Record a repayment against a loan
 */
export async function recordLedgerRepayment(
  ledgerId: string,
  payload: CreateRepaymentPayload,
): Promise<{ repayment: LedgerRepaymentDTO; updatedLedger: UpdatedLedgerResponse }> {
  const res = await fetch(`${getApiBaseUrl()}/ledgers/${ledgerId}/repayments`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const msg = Array.isArray(errorBody?.message)
      ? errorBody.message.join(", ")
      : errorBody?.message || `Failed to record repayment (${res.status})`;
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Delete a repayment
 */
export async function deleteLedgerRepayment(
  ledgerId: string,
  repaymentId: string,
): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/ledgers/${ledgerId}/repayments/${repaymentId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `Failed to delete repayment (${res.status})`);
  }
}
