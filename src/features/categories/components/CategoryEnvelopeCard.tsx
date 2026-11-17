"use client";

import {
  Award,
  Baby,
  BadgeIndianRupee,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Car,
  CircleHelp,
  CirclePlus,
  Code2,
  CreditCard,
  Dumbbell,
  FileText,
  Fuel,
  Gift,
  GraduationCap,
  HandCoins,
  HandHeart,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  PawPrint,
  Percent,
  PieChart,
  Plane,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
  Ticket,
  TrendingUp,
  Tv,
  Utensils,
  Wallet,
  Wifi,
  Wrench,
  Zap,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/IconButton";
import type { CategoryEnvelopeItem } from "../types";

interface CategoryEnvelopeCardProps {
  item: CategoryEnvelopeItem;
  viewMode: "grid" | "list";
  onEdit: (item: CategoryEnvelopeItem) => void;
  onDelete: (id: string) => void;
}

const iconByName = {
  award: Award,
  baby: Baby,
  "badge-indian-rupee": BadgeIndianRupee,
  building: Building2,
  briefcase: Briefcase,
  "briefcase-business": BriefcaseBusiness,
  car: Car,
  "chart-no-axes-combined": TrendingUp,
  code: Code2,
  "credit-card": CreditCard,
  dumbbell: Dumbbell,
  "file-text": FileText,
  fuel: Fuel,
  gift: Gift,
  "graduation-cap": GraduationCap,
  "hand-coins": HandCoins,
  "hand-heart": HandHeart,
  "heart-pulse": HeartPulse,
  "help-circle": CircleHelp,
  home: Home,
  landmark: Landmark,
  laptop: Laptop,
  paw: PawPrint,
  "paw-print": PawPrint,
  percent: Percent,
  "pie-chart": PieChart,
  plane: Plane,
  "plus-circle": CirclePlus,
  "rotate-ccw": RotateCcw,
  "shield-check": ShieldCheck,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  sparkles: Sparkles,
  ticket: Ticket,
  "trending-up": TrendingUp,
  tv: Tv,
  utensils: Utensils,
  wallet: Wallet,
  wifi: Wifi,
  wrench: Wrench,
  zap: Zap,
} as const;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function CategoryEnvelopeCard({
  item,
  viewMode,
  onEdit,
  onDelete,
}: CategoryEnvelopeCardProps) {
  const Icon = item.icon
    ? iconByName[item.icon as keyof typeof iconByName] ?? Tag
    : Tag;
  const customColor =
    item.color && /^#[\da-f]{6}$/i.test(item.color) ? item.color : undefined;

  function confirmDelete() {
    if (window.confirm(`Delete “${item.name}”? This action cannot be undone.`)) {
      onDelete(item.id);
    }
  }

  return (
    <Card
      className={`flex h-full flex-col p-4 transition-colors hover:border-accent/40 ${
        viewMode === "list" ? "sm:flex-row sm:items-center sm:gap-6" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"
            style={
              customColor
                ? { color: customColor, backgroundColor: `${customColor}1A` }
                : undefined
            }
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">
              {item.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              {item.isSystem ? "System category" : "Custom category"}
            </p>
          </div>
        </div>

        {item.isCustom && (
          <div className="flex shrink-0 items-center gap-1">
            <IconButton
              label={`Edit ${item.name}`}
              onClick={() => onEdit(item)}
              className="h-8 w-8"
            >
              <Pencil aria-hidden="true" className="h-4 w-4" />
            </IconButton>
            <IconButton
              label={`Delete ${item.name}`}
              onClick={confirmDelete}
              className="h-8 w-8 text-bad hover:bg-bad-soft hover:text-bad"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </IconButton>
          </div>
        )}
      </div>

      <div
        className={`mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 ${
          viewMode === "list" ? "sm:mt-0 sm:min-w-64 sm:border-0 sm:pt-0" : ""
        }`}
      >
        <div>
          <p className="text-[11px] text-muted">This month</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {currencyFormatter.format(item.monthlyVolume)}
          </p>
        </div>
        <Badge tone={item.group === "expense" ? "bad" : "good"}>
          {item.txnCount} {item.txnCount === 1 ? "transaction" : "transactions"}
        </Badge>
      </div>
    </Card>
  );
}
