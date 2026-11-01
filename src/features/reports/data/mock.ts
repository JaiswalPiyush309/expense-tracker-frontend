/**
 * Mock data mirroring the design. Figures are internally consistent:
 * income 12,85,000 - expenses 4,72,500 = surplus 8,12,500 (63.2%).
 * Replace each export with a real fetch; components only depend on ../types.
 */
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Banknote,
  CirclePlus,
  Download,
  Ellipsis,
  Landmark,
  Lightbulb,
  MessageSquare,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Zap,
} from "lucide-react";
import type {
  AuditEntry,
  BankAccount,
  CashFlowPoint,
  CashFlowRange,
  EquityRow,
  FlowItem,
  KpiData,
  LendingRow,
  Merchant,
  Observation,
  ReportPeriod,
  UpiApp,
  VelocityStat,
} from "../types";

export const header = {
  title: "Financial Reports & Analytics",
  badge: "Q1-Q2 FY25",
  description:
    "Analyze your income, expenses, cash flow, investments, and overall financial health across all accounts with audit-grade reconciliation.",
  currencyLabel: "INR (₹) Realized",
};

export const periodOptions: {
  value: ReportPeriod;
  label: string;
  /** Longer label shown while selected. */
  activeLabel?: string;
  icon?: typeof SlidersHorizontal;
}[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "3m", label: "3 Months" },
  { value: "6m", label: "6 Months", activeLabel: "6 Months (Nov 24 – Apr 25)" },
  { value: "1y", label: "1 Year" },
  { value: "custom", label: "Custom Range", icon: SlidersHorizontal },
];

/** Shown in the toolbar when "compare" is on. Only 6M has mock data. */
export const compareText: Partial<Record<ReportPeriod, string>> = {
  "6m": "vs Prev 6M: +14.2% Net Savings",
};

export const kpis: KpiData[] = [
  {
    id: "income",
    label: "Total Income",
    value: 1285000,
    topRight: { kind: "icon", icon: ArrowDown, tone: "good" },
    footer: {
      kind: "trend",
      icon: TrendingUp,
      text: "+12.4%",
      suffix: "vs prev",
      tone: "good",
      spark: [11, 12, 11.5, 13, 12.4, 14.5, 14, 16],
    },
  },
  {
    id: "expenses",
    label: "Total Expenses",
    value: 472500,
    topRight: { kind: "icon", icon: ShieldCheck, tone: "good" },
    footer: {
      kind: "trend",
      icon: TrendingDown,
      text: "-4.1%",
      suffix: "budget safe",
      tone: "good",
      spark: [12, 11, 12.5, 11, 12, 10.5, 11.5, 9.5],
    },
  },
  {
    id: "savings",
    label: "Net Savings (Surplus)",
    value: 812500,
    valueTone: "accent",
    topRight: { kind: "badge", text: "63.2% Rate", tone: "accent" },
    footer: {
      kind: "trend",
      icon: ArrowUpRight,
      text: "+24.8%",
      suffix: "YoY",
      tone: "good",
      sparkTone: "accent",
      spark: [10, 10.5, 10.2, 12, 11.6, 13, 12.8, 15],
    },
  },
  {
    id: "investments",
    label: "Investment Value",
    value: 2845200,
    topRight: { kind: "icon", icon: TrendingUp, tone: "accent" },
    footer: {
      kind: "trend",
      icon: ArrowUp,
      text: "+₹3.42L (+13.68%)",
      tone: "good",
      spark: [9, 10, 9.8, 12, 11.5, 13.5, 13, 15],
    },
  },
  {
    id: "pnl",
    label: "Realized P&L & Dividends",
    value: 118400,
    prefix: "+",
    valueTone: "good",
    topRight: { kind: "icon", icon: Banknote, tone: "good" },
    footer: {
      kind: "note",
      text: "STCG + ₹18.2k Dividend Yield",
      side: { kind: "badge", text: "Booked", tone: "good" },
    },
  },
  {
    id: "lent",
    label: "Money Lent (Receivable)",
    value: 125000,
    topRight: { kind: "badge", text: "₹50k Overdue", tone: "bad" },
    footer: {
      kind: "note",
      text: "3 parties (Assets ledger)",
      side: {
        kind: "text",
        text: "Action needed",
        tone: "bad",
        icon: TriangleAlert,
      },
    },
  },
  {
    id: "borrowed",
    label: "Money Borrowed (Payable)",
    value: 35000,
    topRight: { kind: "icon", icon: Download, tone: "neutral" },
    footer: {
      kind: "note",
      text: "Due in 15 days (0% Int.)",
      side: { kind: "badge", text: "1 Party", tone: "accent" },
    },
  },
  {
    id: "networth",
    label: "Estimated Net Worth",
    value: 3417850,
    valueTone: "accent",
    topRight: { kind: "icon", icon: Landmark, tone: "accent" },
    footer: {
      kind: "note",
      text: "Assets ₹34.52L - Liab ₹0.35L",
      side: { kind: "text", text: "+18.9% Growth", tone: "good" },
    },
  },
];

/* ---------- Cash flow ---------- */

export const cashFlow: Record<CashFlowRange, CashFlowPoint[]> = {
  monthly: [
    { label: "Nov 2024", income: 205000, expense: 75000 },
    { label: "Dec 2024", income: 215000, expense: 80500 },
    { label: "Jan 2025", income: 210000, expense: 78000 },
    { label: "Feb 2025", income: 208000, expense: 74600 },
    { label: "Mar 2025", income: 212000, expense: 86000 },
    { label: "Apr 2025", income: 235000, expense: 78400, current: true },
  ],
  weekly: [
    { label: "Wk 1", income: 52000, expense: 18500 },
    { label: "Wk 2", income: 61000, expense: 21000 },
    { label: "Wk 3", income: 48000, expense: 19400 },
    { label: "Wk 4", income: 59000, expense: 16800 },
    { label: "Wk 5", income: 55000, expense: 22300 },
    { label: "Wk 6", income: 72000, expense: 19600, current: true },
  ],
  daily: [
    { label: "Mon", income: 8000, expense: 1800 },
    { label: "Tue", income: 4500, expense: 3200 },
    { label: "Wed", income: 12000, expense: 840 },
    { label: "Thu", income: 6000, expense: 2450 },
    { label: "Fri", income: 9500, expense: 4320 },
    { label: "Sat", income: 3000, expense: 4850 },
    { label: "Sun", income: 5500, expense: 1200, current: true },
  ],
  yearly: [
    { label: "2023", income: 1950000, expense: 820000 },
    { label: "2024", income: 2240000, expense: 905000 },
    { label: "2025", income: 1285000, expense: 472500, current: true },
  ],
};

/* ---------- Capital distribution ---------- */

export const capital = {
  periodLabel: "6 Months Aggregated",
  incomeTotal: 1285000,
  expenseTotal: 472500,
  income: [
    { id: "salary", label: "Tech Corp Salary", amount: 1110000, color: 2 },
    {
      id: "consulting",
      label: "Fintech Consulting & Advisory",
      amount: 120000,
      color: 4,
    },
    {
      id: "dividends",
      label: "Dividends & Bank Interest",
      amount: 55000,
      color: 1,
    },
  ] satisfies FlowItem[],
  expense: [
    {
      id: "rent",
      label: "Rent & Society Maintenance",
      amount: 179550,
      color: 3,
    },
    {
      id: "groceries",
      label: "Groceries, Blinkit & Supermarkets",
      amount: 89775,
      color: 3,
    },
    {
      id: "dining",
      label: "Dining & Social Swiggy",
      amount: 66150,
      color: 3,
      faded: true,
    },
    {
      id: "transport",
      label: "Transport, Fuel & Uber",
      amount: 51975,
      color: 5,
    },
    {
      id: "utilities",
      label: "Utilities, Broadband & Subs",
      amount: 42525,
      color: 6,
    },
  ] satisfies FlowItem[],
  subcategoryCount: 18,
};

/* ---------- Spending ---------- */

export const velocity = {
  peakNote: "Saturdays = Peak (₹4,850 avg)",
  stats: [
    {
      id: "daily",
      label: "Avg Daily Spend",
      value: 2610,
      suffix: "/day",
      caption: "Controlled vs ₹2,840 target",
      captionTone: "good",
    },
    {
      id: "weekly",
      label: "Avg Weekly Burn",
      value: 18270,
      suffix: "/wk",
      caption: "-3.8% vs last month",
      captionTone: "good",
    },
    {
      id: "highest",
      label: "Highest Outflow Transaction",
      value: 25000,
      valueTone: "accent",
      caption: "Groww Investment Top-up",
      captionTone: "neutral",
    },
  ] satisfies VelocityStat[],
  merchants: [
    {
      id: "amazon",
      name: "Amazon India & Pay",
      category: "Electronics, Books & Pantry",
      amount: 34800,
      countLabel: "28 transactions",
    },
    {
      id: "swiggy",
      name: "Swiggy & Zomato Orders",
      category: "Food Delivery & Dine-out",
      amount: 28400,
      countLabel: "54 transactions",
    },
    {
      id: "blinkit",
      name: "Blinkit Quick Commerce",
      category: "Fresh Produce & Daily Needs",
      amount: 22100,
      countLabel: "42 transactions",
    },
    {
      id: "tata",
      name: "Tata Power Electricity",
      category: "Recurring Utility BBPS",
      amount: 14700,
      countLabel: "6 bills",
    },
    {
      id: "shell",
      name: "Shell Fuel Stations",
      category: "V-Power Petrol UPI",
      amount: 9200,
      countLabel: "4 refills",
    },
  ] satisfies Merchant[],
};

export const observations: Observation[] = [
  {
    id: "grocery",
    icon: Lightbulb,
    tone: "accent",
    title: "Grocery spend up +8.4%",
    body: "Blinkit purchases peaked during the Diwali week. However, monthly household supplies remain within budgeted standard tolerance.",
  },
  {
    id: "utility",
    icon: Zap,
    tone: "good",
    title: "Utility optimization achieved",
    body: "Electricity charges declined 6.2% month-on-month post seasonal air conditioning cycle normalization in March.",
  },
  {
    id: "outflow",
    icon: Target,
    tone: "bad",
    title: "Single Highest Outflow Sanitized",
    body: "The ₹25,000 transfer to Groww was detected & correctly categorized as an Asset Transfer rather than an operational expense.",
  },
];

export const taxNote = "Tax Savings 80C headroom: ₹1.5L exhausted";

/* ---------- Lending ---------- */

export const lendingRows: LendingRow[] = [
  {
    id: "rahul",
    name: "Rahul Verma",
    phone: "+91 98201 44102",
    kind: "lent",
    original: 50000,
    cleared: 0,
    dueDate: "2025-03-31",
    dueNote: "(15d Overdue)",
    overdue: true,
    status: { text: "Overdue", tone: "bad" },
    action: { label: "Reminder", variant: "successSoft", icon: MessageSquare },
  },
  {
    id: "vikram",
    name: "Vikram Malhotra",
    phone: "+91 99100 23419",
    kind: "lent",
    original: 100000,
    cleared: 50000,
    dueDate: "2025-05-15",
    dueNote: "(On track)",
    status: { text: "50% Repaid", tone: "good" },
    action: { label: "Log Part Pay", variant: "soft", icon: CirclePlus },
  },
  {
    id: "priya",
    name: "Priya Sen",
    phone: "+91 97112 88410",
    kind: "lent",
    original: 25000,
    cleared: 0,
    dueDate: "2025-04-30",
    status: { text: "Active", tone: "accent" },
    action: { label: "Details", variant: "soft", icon: Ellipsis },
  },
  {
    id: "karan",
    name: "Karan Mehra",
    phone: "+91 98110 55219",
    kind: "borrowed",
    original: 35000,
    cleared: 0,
    dueDate: "2025-04-30",
    dueNote: "(In 15 days)",
    status: { text: "Pending Settlement", tone: "accent" },
    action: { label: "Pay Via UPI", variant: "primary", icon: Send },
  },
];

/* ---------- Investments ---------- */

export const equities: EquityRow[] = [
  {
    id: "ril",
    symbol: "RELIANCE",
    name: "Reliance Ind.",
    shares: 45,
    buyAvg: 2720,
    ltp: 2985.4,
    dayChangePct: 1.2,
  },
  {
    id: "tata",
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    shares: 180,
    buyAvg: 820.5,
    ltp: 1012.3,
    dayChangePct: 2.4,
  },
  {
    id: "hdfc",
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    shares: 90,
    buyAvg: 1490,
    ltp: 1535.1,
    dayChangePct: -0.4,
  },
  {
    id: "infy",
    symbol: "INFY",
    name: "Infosys Ltd",
    shares: 85,
    buyAvg: 1440,
    ltp: 1485.5,
    dayChangePct: 0.8,
  },
];

export const portfolio = {
  syncedAt: "Sync: 14 Apr 2025, 15:30 IST",
  invested: 2503100,
  current: 2845200,
  riskLabel: "Moderate Risk",
  assetsLabel: "₹28.45L",
  xirr: "16.4%",
  rebalancing: "Balanced",
  allocation: [
    {
      id: "large",
      name: "Large Cap Equities / Index",
      percent: 62,
      detail: "₹17.64L",
      color: 1,
    },
    {
      id: "mid",
      name: "Mid & Small Cap Funds",
      percent: 24,
      detail: "₹6.83L",
      color: 2,
    },
    {
      id: "debt",
      name: "Debt Funds & Liquid T-Bills",
      percent: 14,
      detail: "₹3.98L",
      color: 7,
    },
  ] as const,
};

/* ---------- Banks & UPI ---------- */

export const banks: BankAccount[] = [
  {
    id: "hdfc",
    logo: "HDFC",
    logoTone: "accent",
    name: "HDFC Bank Salary A/c (...4821)",
    subtitle: "Primary Payroll & Outward UPI",
    balance: 342150,
    net: { text: "+₹1,20,000 Net 6M", tone: "good" },
  },
  {
    id: "icici",
    logo: "ICICI",
    logoTone: "bad",
    name: "ICICI Direct Savings (...8829)",
    subtitle: "Investment Clearing & STCG",
    balance: 114300,
    net: { text: "+₹45,000 Net 6M", tone: "good" },
  },
  {
    id: "sbi",
    logo: "SBI",
    logoTone: "neutral",
    name: "State Bank of India (...1092)",
    subtitle: "Emergency Reserve Deposit",
    balance: 75000,
    net: { text: "±₹0 (Locked Reserve)", tone: "neutral" },
  },
];

export const bankMeta = {
  registered: 4,
  note: "Self-transfers of ₹2,50,000 were auto-detected and excluded from Net Income calculations.",
};

export const upi = {
  apps: [
    {
      id: "gpay",
      label: "Google Pay UPI",
      percent: 48,
      transactions: 184,
      color: 1,
    },
    {
      id: "phonepe",
      label: "PhonePe",
      percent: 32,
      transactions: 122,
      color: 2,
    },
    {
      id: "paytm",
      label: "Paytm UPI",
      percent: 14,
      transactions: 54,
      color: 7,
    },
    {
      id: "bhim",
      label: "BHIM & IMPS Direct",
      percent: 6,
      transactions: 23,
      color: 5,
    },
  ] satisfies UpiApp[],
  averageTicket: 540,
  reliability: "Zero Failure Rate (99.8%)",
};

/* ---------- Audit ledger ---------- */

export const audit = {
  total: 384,
  pageSize: 5,
  entries: [
    {
      id: "a1",
      date: "2025-04-14",
      merchant: "Groww Invest - STCG Top-up",
      ref: "UPI/51049281729/GROWW",
      category: "Asset Transfer",
      categoryTone: "neutral",
      account: "HDFC (4821) • GPay UPI",
      type: "Transfer",
      typeTone: "accent",
      amount: 25000,
      plain: true,
      status: "Settled",
      statusTone: "good",
    },
    {
      id: "a2",
      date: "2025-04-12",
      merchant: "Blinkit Quick Mart",
      ref: "BLNK-DEL-8921",
      category: "Groceries",
      categoryTone: "neutral",
      account: "HDFC (4821) • PhonePe",
      type: "Debit",
      typeTone: "bad",
      amount: -1420,
      status: "Completed",
      statusTone: "good",
    },
    {
      id: "a3",
      date: "2025-04-01",
      merchant: "Monthly Salary Inward - Tech Corp",
      ref: "CMS/NEFT/002914801",
      category: "Salary",
      categoryTone: "good",
      account: "HDFC (4821) • Corporate NEFT",
      type: "Credit",
      typeTone: "good",
      amount: 185000,
      status: "Reconciled",
      statusTone: "good",
    },
    {
      id: "a4",
      date: "2025-03-28",
      merchant: "Lent to Priya Sen (Short term)",
      ref: "UPI/5087261921/PRIYA",
      category: "Lending Asset",
      categoryTone: "neutral",
      account: "ICICI (8829) • GPay UPI",
      type: "Asset Debit",
      typeTone: "neutral",
      amount: 25000,
      plain: true,
      status: "Receivable",
      statusTone: "accent",
    },
    {
      id: "a5",
      date: "2025-03-22",
      merchant: "Tata Power Electricity Autopay",
      ref: "NACH/TPWR/99201",
      category: "Utilities",
      categoryTone: "neutral",
      account: "HDFC (4821) • Auto-Debit NACH",
      type: "Debit",
      typeTone: "bad",
      amount: -2450,
      status: "Completed",
      statusTone: "good",
    },
  ] satisfies AuditEntry[],
};
