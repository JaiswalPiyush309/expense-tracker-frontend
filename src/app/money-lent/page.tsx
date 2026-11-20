import { MoneyLentView } from "@/features/money-lent/MoneyLentView";

export const metadata = {
  title: "Money Lent (Receivables) | LedgerFlow",
  description:
    "Track interpersonal loans, receivables, repayment progress, and settlements without inflating your expense budgets.",
};

export default function MoneyLentPage() {
  return <MoneyLentView />;
}
