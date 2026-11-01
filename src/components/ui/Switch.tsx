import { cn } from "@/lib/cn";
import { useId } from "react";
import type { ReactNode } from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label for the switch. */
  children: ReactNode;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  children,
  className,
}: SwitchProps) {
  const labelId = useId();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-sm font-medium text-ink",
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={() => onChange(!checked)}
        className="inline-flex cursor-pointer items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            checked ? "bg-accent" : "bg-line",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left] duration-200 motion-reduce:transition-none",
              checked ? "left-5.5" : "left-0.5",
            )}
          />
        </span>
        <span id={labelId}>{children}</span>
      </button>
    </div>
  );
}
