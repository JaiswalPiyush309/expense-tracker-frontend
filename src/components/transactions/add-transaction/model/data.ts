import type {
  AddTransactionFormValues,
  CategoryOption,
  TransactionType,
} from "./types";

export const TRANSACTION_TYPES: {
  id: TransactionType;
  label: string;
  accentColor: string;
  badgeTextPrefix: string;
}[] = [
  {
    id: "expense",
    label: "Expense",
    accentColor: "text-rose-600 dark:text-rose-400",
    badgeTextPrefix: "↓ Debit from",
  },
  {
    id: "income",
    label: "Income",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    badgeTextPrefix: "↑ Credit to",
  },
  {
    id: "transfer",
    label: "Transfer",
    accentColor: "text-indigo-600 dark:text-indigo-400",
    badgeTextPrefix: "⇄ Transfer from",
  },
  {
    id: "invest",
    label: "Invest",
    accentColor: "text-violet-600 dark:text-violet-400",
    badgeTextPrefix: "↗ Invest from",
  },
  {
    id: "lending",
    label: "Lending",
    accentColor: "text-amber-600 dark:text-amber-400",
    badgeTextPrefix: "→ Lend from",
  },
  {
    id: "borrowing",
    label: "Borrowing",
    accentColor: "text-cyan-600 dark:text-cyan-400",
    badgeTextPrefix: "← Borrow into",
  },
];

export const QUICK_ADD_AMOUNTS = [100, 500, 1000, 2000, 5000];

export const TRANSACTION_CATEGORIES: CategoryOption[] = [
  {
    id: "food-dining",
    name: "Food & Dining",
    subCategory: "Fine Dining / Gourmet",
    type: "expense",
    iconBg: "bg-rose-50 dark:bg-rose-500/15",
    iconColor: "text-rose-500 dark:text-rose-400",
  },
  {
    id: "groceries",
    name: "Groceries & Daily",
    subCategory: "Quick Commerce / Supermarket",
    type: "expense",
    iconBg: "bg-amber-50 dark:bg-amber-500/15",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "cloud-saas",
    name: "Software & Cloud",
    subCategory: "Developer Tools / Subscriptions",
    type: "expense",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/15",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "salary-credit",
    name: "Salary & Bonus",
    subCategory: "Monthly Payroll Credit",
    type: "income",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "equities-sip",
    name: "Equities & Mutual Funds",
    subCategory: "NSE / BSE / Direct SIP",
    type: "invest",
    iconBg: "bg-violet-50 dark:bg-violet-500/15",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
];

export function createInitialTransactionForm(): AddTransactionFormValues {
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return {
  type: "expense",
  amount: 0,
  title: "",
  date,
  time: "",
  accountId: "",
  categoryId: "",
  merchant: "",
  isAutoTagged: false,
  tags: [],
  utrNumber: "",
  notes: "",
  attachment: null,
  isRecurring: false,
  };
}
