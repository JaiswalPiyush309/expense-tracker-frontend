import {
  ArrowDown,
  ArrowUp,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  FileUp,
  HandCoins,
  Handshake,
  History,
  Landmark,
  LayoutDashboard,
  PieChart,
  Radio,
  Receipt,
  RefreshCw,
  Settings,
  Tags,
  Target,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import { SidebarGroup } from "../types";

export const sidebarGroups: SidebarGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Financial Reports",
        href: "/dashboard/reports",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "Money Management",
    items: [
      {
        label: "Expenses",
        href: "/dashboard/expenses",
        icon: ArrowUp,
      },
      {
        label: "Income",
        href: "/dashboard/income",
        icon: ArrowDown,
      },
      {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: Receipt,
      },
      {
        label: "Budgets",
        href: "/dashboard/budgets",
        icon: PieChart,
      },
      {
        label: "Categories",
        href: "/dashboard/categories",
        icon: Tags,
      },
      {
        label: "Bank Accounts",
        href: "/dashboard/bank-accounts",
        icon: Landmark,
      },
      {
        label: "UPI Transactions",
        href: "/dashboard/upi-transactions",
        icon: Radio,
      },
      {
        label: "Recurring Payments",
        href: "/dashboard/recurring-payments",
        icon: RefreshCw,
      },
    ],
  },
  {
    title: "People & Lending",
    items: [
      {
        label: "Money Lent",
        href: "/dashboard/money-lent",
        icon: HandCoins,
      },
      {
        label: "Money Borrowed",
        href: "/dashboard/money-borrowed",
        icon: Wallet,
      },
      {
        label: "Settlements",
        href: "/dashboard/settlements",
        icon: Handshake,
      },
    ],
  },
  {
    title: "Investments",
    items: [
      {
        label: "Share Market Dashboard",
        href: "/dashboard/share-market",
        icon: BriefcaseBusiness,
      },
      {
        label: "Portfolio Holdings",
        href: "/dashboard/share-market/holdings",
        icon: Wallet,
      },
      {
        label: "Trade History",
        href: "/dashboard/share-market/trades",
        icon: History,
      },
      {
        label: "Profit & Loss",
        href: "/dashboard/share-market/profit-loss",
        icon: TrendingUp,
      },
      {
        label: "Market Watch",
        href: "/dashboard/market-watch",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "Planning",
    items: [
      {
        label: "Savings Goals",
        href: "/dashboard/savings-goals",
        icon: Target,
      },
      {
        label: "Bills & Subscriptions",
        href: "/dashboard/bills",
        icon: CalendarDays,
      },
      {
        label: "Financial Calendar",
        href: "/dashboard/calendar",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Import Statements",
        href: "/dashboard/import",
        icon: FileUp,
      },
      {
        label: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: UserRound,
      },
    ],
  },
];
