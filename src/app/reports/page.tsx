import { ReportsView } from "@/features/reports/ReportsView";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Reports & Analytics" };

export default function ReportsPage() {
  return <ReportsView />;
}
