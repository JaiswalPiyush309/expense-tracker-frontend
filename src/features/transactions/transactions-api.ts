import { getApiBaseUrl } from "@/lib/api-config";
import { getAccessToken } from "@/lib/storage";

export type ApiTransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface CreateTransactionInput {
  accountId: string;
  categoryId?: string;
  toAccountId?: string;
  type: ApiTransactionType;
  amount: number;
  transactionDate: string;
  merchant?: string;
  note?: string;
  tags?: string[];
}

export interface ApiTransaction {
  id: string;
  accountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  type: ApiTransactionType;
  amount: number | string;
  transactionDate: string;
  merchant: string | null;
  note: string | null;
  tags: string[] | null;
  account?: {
    id: string;
    name: string;
    accountNumberLast4: string | null;
  } | null;
  toAccount?: {
    id: string;
    name: string;
    accountNumberLast4: string | null;
  } | null;
  category?: { id: string; name: string } | null;
}

interface TransactionPage {
  items: ApiTransaction[];
  meta: { totalPages: number; page: number };
}

export async function fetchAllTransactions(): Promise<ApiTransaction[]> {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");

  const all: ApiTransaction[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetch(
      `${getApiBaseUrl()}/transactions?page=${page}&limit=100`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const body = (await response.json().catch(() => undefined)) as
      | TransactionPage
      | { message?: string }
      | undefined;
    if (!response.ok) {
      throw new Error(
        typeof body === "object" && body && "message" in body
          ? String(body.message)
          : `Unable to load transactions (${response.status}).`,
      );
    }

    const result = body as TransactionPage;
    all.push(...result.items);
    totalPages = result.meta.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export async function createTransaction(input: CreateTransactionInput): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/transactions`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Cannot connect to the transaction server. Check that the backend is running.");
  }

  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = typeof body === "object" && body !== null && "message" in body
      ? Array.isArray(body.message) ? body.message.join(" ") : String(body.message)
      : `Unable to save transaction (${response.status}).`;
    throw new Error(message);
  }

  if (typeof window !== "undefined") window.dispatchEvent(new Event("transactions:created"));
}
