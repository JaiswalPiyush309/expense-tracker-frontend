import { ShareMarketDashboardView } from "@/features/investments/ShareMarketDashboardView";

export const metadata = {
  title: "Share Market Dashboard | LedgerFlow",
  description:
    "Monitor your investment portfolio, track real-time NSE/BSE movements, and evaluate capital performance.",
};

export default function ShareMarketDashboardPage() {
  return <ShareMarketDashboardView />;
}
