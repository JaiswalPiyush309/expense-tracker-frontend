export type ExpensesSubTabId =
  | "all"
  | "recurring"
  | "rules-budgets"
  | "receipts-vault";

export type SpendingPacingGranularity = "Daily" | "Weekly";

export interface ExpenseKpiMetric {
  id: string;
  label: string;
  value: string;
  valueSuffix?: string;
  valueColor?: string;
  sublineText: string;
  sublineColor?: string;
  progressPercent?: number;
  progressColor?: string;
  progressSecondaryPercent?: number;
  footerLine1: string;
  footerLine2?: string;
  footerHighlightColor?: string;
  iconType:
    | "trend-down"
    | "gauge"
    | "alert"
    | "receipt"
    | "repeat"
    | "calendar-alert";
  iconBg: string;
  iconColor: string;
}

export interface ExpenseCategoryShare {
  id: string;
  name: string;
  amount: number;
  amountFormatted: string;
  percentage: number;
  strokeColor: string;
  dotColorClass: string;
  barColorClass: string;
  filterCategoryMatch?: string;
}

export interface PaymentRailShare {
  id: string;
  label: string;
  percentage: string;
  iconType: "qr" | "card" | "bank" | "cash";
}

export interface ExpenseTransactionRow {
  id: string;
  transactionDate: string;
  date: string;
  time: string;
  merchantTitle: string;
  merchantSubtitle: string;
  iconType: "utensils" | "bag" | "cloud" | "car" | "fuel" | "fitness" | "bolt";
  iconBg: string;
  iconColor: string;
  categoryEnvelope: string;
  categoryDotColor: string;
  paymentRail: string;
  paymentRailType: "upi" | "card" | "autodebit" | "netbanking" | "bbps";
  sourceAccount: string;
  hasReceipt: boolean;
  amount: number;
  status: "Paid" | "Unsettled";
}
