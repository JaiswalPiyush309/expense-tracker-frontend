import { Tone } from "@/lib/tone";
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export interface SidebarSectionProps {
  group: SidebarGroup;
  collapsed: boolean;
  onNavigate?: () => void;
}

export interface SidebarNavItemProps {
  item: SidebarItem;
  collapsed: boolean;
  onNavigate?: () => void;
}

export interface StatCardData {
  id: string;
  label: string;
  icon: LucideIcon;
  iconTone: Tone;
  value: number;
  prefix?: string;
  suffix?: string;
  hideDecimals?: boolean;
  valueTone?: Tone;
  delta: { text: string; tone: Tone; icon?: LucideIcon };
  /** Muted text shown after the delta, e.g. "4 Accounts linked". */
  note?: string;
  /** 0-100, renders a progress bar. */
  progress?: number;
  footerLeft: string;
  footerRight?: { text: string; tone: Tone };
}

export type TrendRange = "monthly" | "weekly" | "daily";

export interface TrendPoint {
  label: string;
  income: number;
  expense: number;
}

export interface CategoryShare {
  id: string;
  name: string;
  /** 0-100; all segments should add up to 100. */
  percent: number;
}

export interface BudgetItem {
  id: string;
  label: string;
  spent: number;
  limit: number;
  tone: Tone;
}

export interface LedgerAction {
  label: string;
  variant: "primary" | "soft" | "success" | "secondary";
  icon?: LucideIcon;
}

export interface LedgerEntry {
  id: string;
  initials: string;
  avatarTone: Tone;
  name: string;
  tag?: { text: string; tone: Tone; icon?: LucideIcon };
  subtitle: string;
  amount: number;
  amountCaption?: string;
  amountTone: Tone;
  actions: LedgerAction[];
}

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  changePct: number;
}

export interface Holding {
  id: string;
  name: string;
  shares: number;
  avgPrice: number;
  value: number;
  changePct: number;
}

export type TransactionType = "debit" | "credit" | "transfer";

export interface Transaction {
  id: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  merchant: string;
  note?: string;
  icon: LucideIcon;
  iconTone: Tone;
  category: string;
  categoryTone: Tone;
  account: string;
  accountIcon: LucideIcon;
  type: TransactionType;
  /** Signed: negative for money out. */
  amount: number;
  status: string;
  statusTone: Tone;
}
