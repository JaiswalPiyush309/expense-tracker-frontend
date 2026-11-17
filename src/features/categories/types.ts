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
