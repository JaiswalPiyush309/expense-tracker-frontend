export type IncomeDatePreset =
  | "today"
  | "this-week"
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "this-year"
  | "custom";

export type IncomeSubTab = "all" | "sources" | "recurring" | "pending-invoices";

export type IncomeVelocityGranularity = "Monthly" | "Weekly" | "Daily";

export interface IncomeKpiMetric {
  id: string;
  label: string;
  value: string;
  valueColor?: string;
  badgeText?: string;
  badgeTone?: "emerald" | "indigo" | "amber" | "rose" | "slate";
  subtext: string;
  progressPercent?: number;
  progressColor?: string;
  footerLeft: string;
  footerRight?: string;
  footerHighlightColor?: string;
  iconTone: "emerald" | "indigo" | "blue" | "violet" | "cyan" | "rose";
}

export interface IncomeSourceCategoryItem {
  id: string;
  name: string;
  subtitle: string;
  amount: number;
  amountFormatted: string;
  percentage: number;
  color: string; // Hex for DonutChart
  dotClass: string;
}

export interface InflowVelocityPoint {
  month: string;
  shortAmount: string;
  amount: number;
}

export interface InflowRailSplit {
  label: string;
  percentage: number;
  colorClass: string;
}

export interface IncomeTransactionItem {
  id: string;
  date: string;
  timeOrSub: string;
  isExpectedDate?: boolean;
  initials: string;
  initialsBg: string;
  initialsText: string;
  payerName: string;
  isPendingBadge?: boolean;
  description: string;
  category: string;
  categoryTone: "emerald" | "indigo" | "blue" | "violet";
  channelName: string;
  channelRef: string;
  accountTitle: string;
  accountMask: string;
  accountSubtext: string;
  accountSubtextTone: "emerald" | "amber" | "slate" | "rose";
  amount: number;
  status: "Received" | "Pending";
  mode: "NEFT" | "UPI" | "ECS" | "SWIFT";
}
