export type AccountCategoryTab =
  | "all"
  | "savings"
  | "current"
  | "credit-cards"
  | "wallets"
  | "cash";

export type BankAccountKind = "savings" | "current" | "credit-card" | "wallet";

export interface BankAccountItem {
  id: string;
  kind: BankAccountKind;
  institutionName: string;
  subtitle: string;
  tagLabel: string;
  tagTone: "indigo" | "emerald" | "slate" | "rose";
  borderAccentClass: string;
  iconSymbol: string;
  iconBg: string;
  iconColor: string;

  // Metadata Box (varies by account kind)
  holderLabel: string;
  holderName: string;
  secondaryMetaLabel: string;
  maskedNumber: string;
  ifscOrSubCode?: string;

  // Credit Card specific fields
  creditLimitUsedFormatted?: string;
  creditLimitTotalFormatted?: string;
  utilizationPercent?: number;
  availableCreditFormatted?: string;

  // Wallet specific fields
  velocity30dFormatted?: string;

  // Balance section
  balanceHeading: string;
  balanceAmount: number;
  balanceFormatted: string;
  balanceColorClass?: string;

  // Footer
  footerStatusText: string;
  footerDotColor: string;
  footerIsWarning?: boolean;
  actionLabel: string;
  syncMode: "Auto-Synced" | "Manual";
  status: "Active" | "Inactive";
}

export interface LiquidBankShare {
  id: string;
  name: string;
  percentage: string;
  amountShort: string;
  dotColorClass: string;
  strokeColor: string;
}

export interface MultiAccountActivityItem {
  id: string;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  accountDisplayType: "single" | "transfer";
  sourceAccountBadge: string;
  sourceAccountTone: "indigo" | "rose" | "emerald" | "slate";
  destinationAccountBadge?: string;
  classificationLabel: string;
  classificationTone: "emerald" | "indigo" | "rose" | "slate";
  amountFormatted: string;
  amountTone: "emerald" | "rose" | "slate";
  statusLabel: "Reconciled" | "Settled";
}
