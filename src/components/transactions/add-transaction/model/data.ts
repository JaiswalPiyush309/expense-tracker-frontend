import type { AddTransactionFormValues, TransactionType } from "./types";

export const TRANSACTION_TYPES: {
  id: TransactionType;
  label: string;
  accentColor: string;
  badgeTextPrefix: string;
}[] = [
  { id: "expense", label: "Expense", accentColor: "text-rose-600 dark:text-rose-400", badgeTextPrefix: "↓ Debit from" },
  { id: "income", label: "Income", accentColor: "text-emerald-600 dark:text-emerald-400", badgeTextPrefix: "↑ Credit to" },
  { id: "transfer", label: "Transfer", accentColor: "text-indigo-600 dark:text-indigo-400", badgeTextPrefix: "⇄ Transfer from" },
  { id: "invest", label: "Invest", accentColor: "text-violet-600 dark:text-violet-400", badgeTextPrefix: "↗ Invest from" },
  { id: "lending", label: "Lending", accentColor: "text-amber-600 dark:text-amber-400", badgeTextPrefix: "→ Lend from" },
  { id: "borrowing", label: "Borrowing", accentColor: "text-cyan-600 dark:text-cyan-400", badgeTextPrefix: "← Borrow into" },
];

export const QUICK_ADD_AMOUNTS = [100, 500, 1000, 2000, 5000];

export function createInitialTransactionForm(type: TransactionType = "expense"): AddTransactionFormValues {
  return {
    type,
    amount: 0,
    title: "",
    date: "",
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
