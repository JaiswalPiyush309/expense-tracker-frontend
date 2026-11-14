import { PortfolioHoldingsView } from "@/features/investments/portfolio-holdings/PortfolioHoldingsView";

export const metadata = {
  title: "Portfolio Holdings | LedgerFlow",
  description:
    "Track your stock holdings, monitor current market values and review the performance of every investment in your portfolio.",
};

export default function PortfolioHoldingsPage() {
  return <PortfolioHoldingsView />;
}
