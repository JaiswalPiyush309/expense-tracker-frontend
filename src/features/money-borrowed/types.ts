import type { Tone } from "@/lib/tone";

export type BorrowedStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "SETTLED"
  | "OVERDUE";

export type LenderRelationshipCategory =
  | "Friend"
  | "Colleague"
  | "Family"
  | "Bank/NBFC"
  | "Business"
  | "Other";

export interface BorrowedRepaymentItem {
  id: string;
  date: string;
  amount: number;
  paymentMode: "UPI" | "BANK_TRANSFER" | "CASH" | "CHEQUE";
  notes?: string;
  referenceId?: string;
}

export interface BorrowedLoanItem {
  id: string;
  lenderName: string;
  lenderInitials: string;
  lenderAvatarTone: Tone;
  relationship: LenderRelationshipCategory;
  contactNumber?: string;
  counterpartyUserId?: string | null;
  counterpartyEmail?: string | null;
  counterpartyPhone?: string | null;
  isCounterpartyView?: boolean;
  originalAmount: number;
  repaidAmount: number;
  balanceDue: number;
  borrowedDate: string; // ISO date string e.g. "2025-01-15"
  dueDate: string;      // ISO date string e.g. "2025-04-30"
  status: BorrowedStatus;
  receivingAccount: string; // e.g. "HDFC Salary A/c", "ICICI Savings", "Cash in Hand"
  sourceAccountId?: string | null;
  notes?: string;
  interestRate?: number;    // Annual interest % (e.g. 0 for friendly loans)
  repayments: BorrowedRepaymentItem[];
}

export interface BorrowedMetrics {
  totalBorrowed: number;
  totalRepaid: number;
  outstandingPayable: number;
  overdueAmount: number;
  activeLendersCount: number;
  settledDebtsCount: number;
  repaymentProgressPercent: number;
}

export type BorrowedTimeframeFilter =
  | "ALL"
  | "DUE_THIS_WEEK"
  | "DUE_THIS_MONTH"
  | "OVERDUE"
  | "SETTLED";

export type BorrowedSortOption =
  | "BALANCE_DESC"
  | "BALANCE_ASC"
  | "DUE_DATE_ASC"
  | "BORROWED_DATE_DESC"
  | "NAME_ASC";
