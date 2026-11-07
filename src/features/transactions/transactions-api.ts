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
