import { IncomeView } from "@/features/income/IncomeView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Income Ledger | LedgerFlow",
  description:
    "Track your earnings, monitor cash inflows, and manage diversified revenue streams.",
};

export default function IncomePage() {
  return <IncomeView />;
}
