import type { Tone } from "@/lib/tone";

export type LentStatus = "PENDING" | "PARTIALLY_PAID" | "SETTLED" | "OVERDUE";

export type RelationshipCategory =
  | "Friend"
  | "Colleague"
  | "Family"
  | "Business"
  | "Other";

export interface RepaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  paymentMode: "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE";
  notes?: string;
  referenceId?: string;
}

export interface LentLoanItem {
  id: string;
  borrowerName: string;
  borrowerInitials: string;
  borrowerAvatarTone: Tone;
  relationship: RelationshipCategory;
  contactNumber?: string;
  counterpartyUserId?: string | null;
  counterpartyEmail?: string | null;
  counterpartyPhone?: string | null;
  isCounterpartyView?: boolean;
  originalAmount: number;
  recoveredAmount: number;
  balanceDue: number;
  lentDate: string; // ISO date string e.g. "2025-01-15"
  dueDate: string;  // ISO date string e.g. "2025-04-30"
  status: LentStatus;
  sourceAccount: string; // e.g. "HDFC Bank (Salary)", "ICICI Savings", "Cash in Hand"
  sourceAccountId?: string | null;
  notes?: string;
  interestRate?: number; // e.g. 0 or 8.5 (%)
  repayments: RepaymentHistoryItem[];
}

export interface LentMetrics {
  totalLent: number;
  totalRecovered: number;
  outstandingReceivable: number;
  overdueAmount: number;
  activeBorrowersCount: number;
  settledLoansCount: number;
  recoveryRatePercent: number;
}

export type LentTimeframeFilter =
  | "ALL"
  | "DUE_THIS_WEEK"
  | "DUE_THIS_MONTH"
  | "OVERDUE"
  | "SETTLED";

export type LentSortOption =
  | "BALANCE_DESC"
  | "BALANCE_ASC"
  | "DUE_DATE_ASC"
  | "LENT_DATE_DESC"
  | "NAME_ASC";
