import { MoneyBorrowedView } from "@/features/money-borrowed/MoneyBorrowedView";

export const metadata = {
  title: "Money Borrowed (Payables & Liabilities) | LedgerFlow",
  description:
    "Track personal debts, liabilities, scheduled repayment commitments, and manage creditors with zero budget distortion.",
};

export default function MoneyBorrowedPage() {
  return <MoneyBorrowedView />;
}
