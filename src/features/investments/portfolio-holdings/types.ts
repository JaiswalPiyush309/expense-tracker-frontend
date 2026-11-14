export type HoldingExchange = "NSE" | "BSE";
export type HoldingCapCategory = "Large Cap" | "Mid Cap" | "Small Cap" | "ETF";
export type HoldingSector =
  | "Oil & Gas"
  | "Banking & Finance"
  | "IT"
  | "FMCG"
  | "Infrastructure"
  | "Automobile"
  | "Telecom"
  | "Pharma"
  | "Consumer Durables";

export interface HoldingsKpiCardItem {
  id: string;
  label: string;
  value: string;
  valueColor: string;
  badgeText?: string;
  badgeTone?: "emerald" | "indigo";
  sublineText: string;
  footerText: string;
  footerDotColor?: string;
  progressPercent?: number;
  iconSymbol: string;
  iconBg: string;
  iconColor: string;
}

export interface ScripTradeOrder {
  id: string;
  type: "BUY" | "SELL";
  shares: number;
  date: string;
  pricePerShare: number;
  totalAmount: number;
}

export interface PortfolioHoldingRow {
  id: string;
  initials: string;
  initialsBg: string;
  initialsColor: string;
  companyName: string;
  shortName: string;
  symbol: string;
  exchange: HoldingExchange;
  sector: HoldingSector;
  capCategory: HoldingCapCategory;
  qty: number;
  freeDeliveryQty: number;
  freeDeliveryPercent: number;
  mtfPledgedQty: number;
  mtfPledgedPercent: number;
  avgPrice: number;
  investedAmount: number;
  cmp: number;
  currentValue: number;
  dayChangeAmount: number;
  dayChangePercent: number;
  netGainAmount: number;
  netGainPercent: number;
  portfolioWeightPercent: number;
  high52W: number;
  low52W: number;
  sixMonthTrendPercent: number;
  trendPoints: string; // SVG path coordinates
  tradeOrders: ScripTradeOrder[];
  targetAlertPrice: number;
  stopLossAlertPrice: number;
  hasActiveAlert: boolean;
}
