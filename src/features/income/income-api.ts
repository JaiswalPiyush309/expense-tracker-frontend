import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";

export interface IncomeTransaction {
  id: string;
  amount: number | string;
  transactionDate: string;
  merchant: string | null;
  note: string | null;
  category: { id: string; name: string; color: string | null } | null;
  account: { id: string; name: string; bankName?: string | null } | null;
}

interface TransactionPage {
  items: IncomeTransaction[];
  meta: { totalPages: number };
}

let cachedRequest: { expiresAt: number; promise: Promise<IncomeTransaction[]> } | null = null;

export function invalidateIncomeTransactions() {
  cachedRequest = null;
}

export function getIncomeTransactions(): Promise<IncomeTransaction[]> {
  if (cachedRequest && cachedRequest.expiresAt > Date.now()) return cachedRequest.promise;
  const promise = loadIncomeTransactions();
  cachedRequest = { expiresAt: Date.now() + 30_000, promise };
  promise.catch(() => {
    if (cachedRequest?.promise === promise) cachedRequest = null;
  });
  return promise;
}

async function loadIncomeTransactions(): Promise<IncomeTransaction[]> {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");

  const all: IncomeTransaction[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page += 1) {
    let response: Response;
    try {
      response = await fetch(
        `${getApiBaseUrl()}/transactions?type=INCOME&page=${page}&limit=100`,
        { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } },
      );
    } catch {
      throw new Error("Cannot connect to the transaction server. Check that the backend is running.");
    }

    const body: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      const message = typeof body === "object" && body !== null && "message" in body
        ? Array.isArray(body.message) ? body.message.join(" ") : String(body.message)
        : `Income request failed (${response.status}).`;
      throw new Error(message);
    }
    const result = body as TransactionPage;
    all.push(...result.items);
    totalPages = result.meta.totalPages;
  }
  return all;
}
