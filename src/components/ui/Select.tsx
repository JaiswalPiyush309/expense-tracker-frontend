import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends ComponentProps<"select"> {
  /** Icon shown inside the left edge. */
  icon?: ReactNode;
}

/** Native <select> styled to match the design; keeps full keyboard + mobile support. */
export function Select({ icon, className, children, ...props }: SelectProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      {icon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        >
          {icon}
        </span>
      )}
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-xl border border-transparent bg-accent-soft/60",
          "pr-9 text-xs font-semibold text-ink outline-none transition-colors hover:bg-accent-soft",
          "focus-visible:ring-2 focus-visible:ring-focus",
          "[&>option]:bg-surface [&>option]:text-ink",
          icon ? "pl-9" : "pl-3.5",
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      />
    </div>
  );
}
