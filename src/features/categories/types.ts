export type CategoryGroupType =
  | "expense"
  | "income"
  | "transfer"
  | "investment"
  | "lending";

export type CategoryFilterTabId =
  | "all"
  | "expense"
  | "income"
  | "transfers"
  | "investments"
  | "lending";

export interface TopSpendingEnvelopeItem {
  id: string;
  name: string;
  amountFormatted: string;
  shareFormatted: string;
  percentage: number;
  barColorClass: string;
}

export interface HighVelocityClusterItem {
  id: string;
  title: string;
  subtitle: string;
  txnCountLabel: string;
  iconSymbol: string;
  iconBg: string;
  iconColor: string;
}

export interface IncomeRailDistributionItem {
  id: string;
  label: string;
  percentage: string;
  dotColorClass: string;
}

export interface CategoryEnvelopeItem {
  id: string;
  group: CategoryGroupType;
  name: string;
  hierarchySubtitle: string;
  monthlyVolume: number;
  amountWholeFormatted: string;
  amountDecimalFormatted: string;
  txnCount: number;
  txnLabel: string;
  subcategories: string[];
  extraSubcategoryCount?: number;
  statusLabel: string;
  statusDotColor: string;
  amountColorClass?: string;
  iconSymbol: string;
  iconBg: string;
  iconColor: string;
}
