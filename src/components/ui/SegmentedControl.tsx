import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  semantics?: "group" | "tabs";
  size?: "sm" | "md";
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  semantics = "group",
  size = "sm",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role={semantics === "tabs" ? "tablist" : "group"}
      aria-label={label}
      className={cn("inline-flex rounded-xl bg-accent-soft/60 p-1", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role={semantics === "tabs" ? "tab" : undefined}
            aria-selected={semantics === "tabs" ? active : undefined}
            aria-pressed={semantics === "group" ? active : undefined}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-colors",
              size === "md"
                ? "min-h-10 px-3.5 py-2 text-sm"
                : "px-3 py-1.5 text-xs",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              active
                ? "bg-surface text-accent shadow-sm"
                : "text-muted hover:text-ink",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
