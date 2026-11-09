import { ExpensesView } from "@/features/expenses/ExpensesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expenses | LedgerFlow",
  description:
    "Track spending by category and import bank statements or UPI transaction history.",
};

export default function ExpensesPage() {
  return <ExpensesView />;
}
