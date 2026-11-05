import { getAccessToken } from "@/lib/storage";
import { getApiBaseUrl } from "@/lib/api-config";

export type AccountType =
  | "CASH"
  | "BANK"
  | "CREDIT_CARD"
  | "WALLET"
  | "INVESTMENT";

export interface SupportedBank {
  code: string;
  bankName: string;
  shortName: string;
  category: string;
  defaultAccountType: AccountType;
  brandColor: string;
  isPopular: boolean;
}

export interface SupportedBanksResponse {
  popular: SupportedBank[];
  all: SupportedBank[];
}

export interface BankAccount {
  id: string;
  name: string;
  type: AccountType;
  bankName: string | null;
  accountNumberLast4: string | null;
  upiId: string | null;
  currency: string;
  openingBalance: number | string;
  balance: number | string;
  color: string | null;
  isDefault: boolean;
  isArchived: boolean;
}

export interface CreateBankAccountInput {
  bankCode: string;
  name?: string;
  type: AccountType;
  accountNumberLast4?: string;
  upiId?: string;
  openingBalance: number;
  isDefault: boolean;
}

async function accountRequest<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/accounts${endpoint}`, {
      ...init,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Cannot connect to the account server. Check that the backend is running.");
  }

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? Array.isArray(data.message)
          ? data.message.join(" ")
          : String(data.message)
        : `Account request failed (${response.status}).`;
    throw new Error(message);
  }

  return data as T;
}

export function getSupportedBanks() {
  return accountRequest<SupportedBanksResponse>("/supported-banks");
}

export function getBankAccounts() {
  return accountRequest<BankAccount[]>("");
}

export function createBankAccount(input: CreateBankAccountInput) {
  return accountRequest<BankAccount>("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateBankAccount(id: string, input: Partial<CreateBankAccountInput>) {
  return accountRequest<BankAccount>(`/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteBankAccount(id: string) {
  return accountRequest<{ message: string }>(`/${id}`, { method: "DELETE" });
}
