import { TransactionsView } from "@/features/transactions/TransactionsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | LedgerFlow",
  description:
    "Review your unified transaction ledger and import bank or UPI history.",
};

export default function TransactionsPage() {
  return <TransactionsView />;
}
