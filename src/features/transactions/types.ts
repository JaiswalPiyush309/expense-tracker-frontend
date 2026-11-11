export type LedgerTransactionBadgeType =
  | "Income"
  | "Expense"
  | "Investment"
  | "Transfer"
  | "Money Lent"
  | "Refund"
  | "Borrowing"
  | "Repayment";

export type TransactionsSubTabId =
  | "all"
  | "expenses"
  | "income"
  | "transfers"
  | "investments"
  | "money-lent"
  | "money-borrowed"
  | "recurring";

export interface TransactionsKpiItem {
  id: string;
  label: string;
  value: string;
  valuePrefix?: string;
  valueColor: string;
  badgeText: string;
  badgeTone: "indigo" | "emerald" | "rose" | "slate" | "amber";
  footerText: string;
  iconSymbol: string;
  iconTone: "indigo" | "emerald" | "rose" | "blue" | "amber";
}

export interface LedgerTransactionItem {
  id: string;
  transactionDate?: string;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  iconType:
    | "building"
    | "utensils"
    | "trend-up"
    | "transfer"
    | "bag"
    | "hand-coin"
    | "refund"
    | "bank"
    | "arrow-down-left"
    | "car";
  iconBg: string;
  iconColor: string;
  typeBadge: LedgerTransactionBadgeType;
  typeTone: "emerald" | "rose" | "indigo" | "slate" | "blue" | "violet";
  categoryName: string;
  categoryDotColor: string;
  accountTitle: string;
  accountMask: string;
  railName: string;
  railRef: string;
  amount: number;
  direction: "IN" | "OUT" | "NEUTRAL";
  status: "Completed" | "Pending" | "Flagged";
}
