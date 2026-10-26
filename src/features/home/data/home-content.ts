/**
 * Product copy and sample data used by the home page.
 *
 * Keep this module free of React and browser dependencies so it can be used by
 * both Server Components and Client Components without expanding the client
 * bundle unnecessarily.
 */

import {
  CalendarClock,
  ChartNoAxesCombined,
  FileDown,
  LucideIcon,
  PiggyBank,
  Repeat,
  Search,
  Target,
  WalletCards,
} from "lucide-react";

export interface HomeNavItem {
  href: string;
  label: string;
}

export const HOME_NAV: HomeNavItem[] = [
  { href: "#features", label: "Features" },
  { href: "#preview", label: "Preview" },
  { href: "#highlights", label: "Highlights" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const FEATURES: Feature[] = [
  {
    icon: WalletCards,
    title: "Simple transaction tracking",
    body: "Record money received and spent with an amount, category, date, and useful notes.",
  },
  {
    icon: Search,
    title: "Searchable ledger",
    body: "Search transaction titles, categories, or notes and filter income and expenses to find entries quickly.",
  },
  {
    icon: Target,
    title: "Category budgets",
    body: "Set monthly spending limits by category and monitor how much of each budget you have used.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Spending insights",
    body: "Understand where your money goes with income, expense, and category summaries.",
  },
  {
    icon: Repeat,
    title: "Recurring bills",
    body: "Keep track of regular subscriptions and bills, including monthly and yearly costs.",
  },
  {
    icon: PiggyBank,
    title: "Savings awareness",
    body: "Compare your income with your expenses to understand how much money remains.",
  },
  {
    icon: CalendarClock,
    title: "Date-based records",
    body: "Review transactions by date and keep a clearer picture of your daily spending.",
  },
  {
    icon: FileDown,
    title: "Portable data",
    body: "Export your transactions to CSV for backups or further analysis in spreadsheet tools.",
  },
];

export interface Highlight {
  value: string;
  label: string;
}

export const HIGHLIGHTS: Highlight[] = [
  {
    value: "₹",
    label: "Designed for Indian rupees, with lakh and crore formatting",
  },
  { value: "6", label: "Navigation views available in the tracker" },
  { value: "CSV", label: "Keep a portable copy of your transaction records" },
  {
    value: "Daily",
    label: "Designed to help you record everyday income and expenses",
  },
];

export interface PreviewRow {
  name: string;
  category: string;
  amount: number;
  type: "in" | "out";
}

export interface PreviewData {
  inflow: number;
  outflow: number;
  entries: number;
  rows: PreviewRow[];
}

export const PREVIEW: PreviewData = {
  inflow: 125000,
  outflow: 48650,
  entries: 14,
  rows: [
    {
      name: "Local kirana store",
      category: "Food & Groceries",
      amount: 3450,
      type: "out",
    },
    {
      name: "Freelance design retainer",
      category: "Income",
      amount: 85000,
      type: "in",
    },
    { name: "Apartment rent", category: "Housing", amount: 22000, type: "out" },
  ],
};

export interface Plan {
  name: string;
  badge: string;
  price: number;
  blurb: string;
  features: string[];
  cta: {
    label: string;
    action: "app" | "signup";
  };
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Free",
    badge: "Available now",
    price: 0,
    blurb: "A straightforward expense tracker for everyday personal finances.",
    features: [
      "Transaction tracking",
      "Income and expense summaries",
      "Category budgets, if enabled in the app",
      "CSV export",
      "Browser-based storage",
    ],
    cta: { label: "Get started free", action: "app" },
  },
  {
    name: "Pro",
    badge: "Planned",
    price: 499,
    blurb:
      "Potential future tools for people who want more detailed financial insights.",
    features: [
      "Everything in Free",
      "Cross-device synchronisation",
      "Advanced spending reports",
      "Yearly financial summaries",
      "Additional backup options",
    ],
    cta: { label: "Join the waitlist", action: "signup" },
    featured: true,
  },
];

export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  {
    q: "Where is my data stored?",
    a: "The current browser-based version stores data locally on your device. If you clear browser data or change devices, your records may be lost. Export regular backups. Local storage is not the same as encrypted storage.",
  },
  {
    q: "Can I export my transactions?",
    a: "The tracker is designed to support CSV exports so you can keep a backup or analyse your records in spreadsheet software. CSV import is available only if it has been implemented in your version.",
  },
  {
    q: "Which currency does LedgerFlow use?",
    a: "LedgerFlow is designed around Indian rupees (₹), with Indian number grouping such as ₹12,34,567. Compact displays may use lakh and crore notation.",
  },
  {
    q: "Can I track recurring bills?",
    a: "The planned recurring-bills workflow can help you keep an eye on subscriptions, regular payments, and their monthly or yearly costs. Check that this functionality is enabled in your current app.",
  },
  {
    q: "Can I use LedgerFlow on multiple devices?",
    a: "With browser-local storage, your data does not automatically synchronise between devices. Cross-device synchronisation would require an implemented backend and an appropriate account and security setup.",
  },
  {
    q: "Is LedgerFlow free?",
    a: "The current plan is to offer a free tracker. Any future paid plan, pricing, or additional features should be confirmed before being advertised as available.",
  },
];
