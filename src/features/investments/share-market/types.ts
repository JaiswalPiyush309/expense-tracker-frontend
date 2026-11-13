export type PortfolioTimeRange =
  | "1D"
  | "1W"
  | "1M"
  | "3M"
  | "6M"
  | "1Y"
  | "3Y"
  | "ALL";

export interface InvestmentKpiMetric {
  id: string;
  label: string;
  valuePrefix?: string;
  value: string;
  valueSuffix?: string;
  valueColor: string;
  sublineText: string;
  sublineColor?: string;
  footerText: string;
  footerPill?: boolean;
  footerPillTone?: "emerald" | "slate";
  iconSymbol: string;
  iconColor: string;
}

export interface AssetAllocationItem {
  id: string;
  label: string;
  amountFormatted: string;
  percentage: string;
  dotColorClass: string;
  strokeColor: string;
}

export interface MarketIndexQuote {
  id: string;
  name: string;
  value: string;
  changeText: string;
  isPositive: boolean;
}

export interface SectorTrendPill {
  id: string;
  sector: string;
  change: string;
  isPositive: boolean;
}

export interface TopPortfolioHolding {
  id: string;
  initials: string;
  initialsBg: string;
  initialsColor: string;
  companyName: string;
  symbol: string;
  exchange: "NSE" | "BSE";
  qty: number;
  avgBuy: number;
  cmp: number;
  currentValue: number;
  todaysGainAmount: number;
  todaysGainPercent: number;
  unrealizedPnl: number;
  totalReturnsPercent: number;
}

export interface RecentInvestmentActivityItem {
  id: string;
  title: string;
  badgeText: "BUY" | "DIVIDEND" | "SELL";
  badgeTone: "indigo" | "emerald" | "amber";
  subtitle: string;
  timestamp: string;
  amountFormatted: string;
  amountTone: "slate" | "emerald";
  statusLabel: string;
  iconBg: string;
  iconColor: string;
  iconSymbol: string;
}

export interface IntelligenceInsightItem {
  id: string;
  title: string;
  description: string;
  tone: "emerald" | "indigo" | "slate";
  iconSymbol: string;
}
