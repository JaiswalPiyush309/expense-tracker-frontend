import { IndianRupee, LucideIcon } from "lucide-react";

interface CurrencyBadgeProps {
  currency?: string;
  status?: string;
  icon?: LucideIcon;
  showIcon?: boolean;
  className?: string;
  responsive?: boolean;
}

export function CurrencyBadge({
  currency = "INR",
  status = "Active",
  icon = IndianRupee,
  showIcon = true,
  className = "",
  responsive = true,
}: CurrencyBadgeProps) {
  const CurrencyIcon = icon;

  return (
    <div
      aria-label={`Currency: ${currency}, status: ${status}`}
      className={[
        "items-center gap-1.5 rounded-xl",
        "border border-emerald-200/70",
        "bg-emerald-50 px-3 py-1.5",
        "text-xs font-semibold text-emerald-800",
        "dark:border-emerald-900/40",
        "dark:bg-emerald-950/30",
        "dark:text-emerald-400",
        responsive ? "hidden sm:flex" : "flex",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showIcon && (
        <CurrencyIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      )}

      <div className="flex min-w-0 flex-col items-start leading-none">
        <span className="font-semibold">{currency}</span>

        <span className="mt-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
          {status}
        </span>
      </div>
    </div>
  );
}
