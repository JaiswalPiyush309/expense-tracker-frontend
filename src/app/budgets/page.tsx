import { BudgetsView } from "@/features/budgets/BudgetsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budgets | LedgerFlow",
  description:
    "Plan your spending, set category-wise limits, and track your financial goals to stay strictly within budget.",
};

export default function BudgetsPage() {
  return <BudgetsView />;
}
