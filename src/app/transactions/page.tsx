import { TransactionsView } from "@/features/transactions/TransactionsView";

export const metadata = {
  title: "All Transactions Ledger | LedgerFlow",
  description:
    "View, track, and manage all your financial activities in one place.",
};

export default function TransactionsPage() {
  return <TransactionsView />;
}
