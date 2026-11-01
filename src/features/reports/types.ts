import type { LucideIcon } from "lucide-react";
import type { ButtonProps } from "@/components/ui/Button";
import type { Tone } from "@/lib/tone";
import { ChartColor } from "@/lib/chartColors";

export type ReportPeriod = "7d" | "30d" | "3m" | "6m" | "1y" | "custom";

export type ReportSection =
  | "all"
  | "income-expense"
  | "spending"
  | "lending"
  | "investments"
  | "net-worth"
  | "bank-upi";

/* ---------- KPI cards ---------- */

export type KpiTopRight =
  | { kind: "icon"; icon: LucideIcon; tone: Tone }
  | { kind: "badge"; text: string; tone: Tone };

export type KpiFooter =
  | {
      kind: "trend";
      icon: LucideIcon;
      text: string;
      /** Muted text after the figure, e.g. "vs prev". */
      suffix?: string;
      tone: Tone;
      /** Defaults to `tone`. */
      sparkTone?: Tone;
      spark: number[];
    }
  | {
      kind: "note";
      text: string;
      side: {
        kind: "badge" | "text";
        text: string;
        tone: Tone;
        icon?: LucideIcon;
      };
    };

export interface KpiData {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  valueTone?: Tone;
  topRight: KpiTopRight;
  footer: KpiFooter;
}

/* ---------- Cash flow ---------- */

export type CashFlowRange = "daily" | "weekly" | "monthly" | "yearly";

export interface CashFlowPoint {
  label: string;
  income: number;
  expense: number;
  /** Marks the in-progress period; gets a "(Current)" caption. */
  current?: boolean;
}

/* ---------- Capital distribution ---------- */

export interface FlowItem {
  id: string;
  label: string;
  amount: number;
  color: ChartColor;
  faded?: boolean;
}

/* ---------- Spending ---------- */

export interface VelocityStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  valueTone?: Tone;
  caption: string;
  captionTone: Tone;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  amount: number;
  /** e.g. "28 transactions", "6 bills". */
  countLabel: string;
}

export interface Observation {
  id: string;
  icon: LucideIcon;
  tone: Tone;
  title: string;
  body: string;
}

/* ---------- Lending ---------- */

export interface LendingRow {
  id: string;
  name: string;
  phone: string;
  kind: "lent" | "borrowed";
  original: number;
  cleared: number;
  /** ISO date */
  dueDate: string;
  dueNote?: string;
  overdue?: boolean;
  status: { text: string; tone: Tone };
  action: {
    label: string;
    variant: NonNullable<ButtonProps["variant"]>;
    icon?: LucideIcon;
  };
}

/* ---------- Investments ---------- */

export interface EquityRow {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  buyAvg: number;
  ltp: number;
  dayChangePct: number;
}

/* ---------- Banks & UPI ---------- */

export interface BankAccount {
  id: string;
  logo: string;
  logoTone: Tone;
  name: string;
  subtitle: string;
  balance: number;
  net: { text: string; tone: Tone };
}

export interface UpiApp {
  id: string;
  label: string;
  percent: number;
  transactions: number;
  color: ChartColor;
}

/* ---------- Audit ledger ---------- */

export interface AuditEntry {
  id: string;
  /** ISO date */
  date: string;
  merchant: string;
  ref: string;
  category: string;
  categoryTone: Tone;
  account: string;
  type: string;
  typeTone: Tone;
  /** Signed: negative for money out. */
  amount: number;
  /** Show the amount without a +/- sign (transfers, asset moves). */
  plain?: boolean;
  status: string;
  statusTone: Tone;
}
