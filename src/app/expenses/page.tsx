import { ExpensesView } from "@/features/expenses/ExpensesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expenses | LedgerFlow",
  description: "Track spending by category and manage your expense ledger.",
};

export default function ExpensesPage() {
  return <ExpensesView />;
}
