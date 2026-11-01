import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CalloutProps {
  icon?: ReactNode;
  /** Content aligned to the far right, e.g. a check icon. */
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Soft tinted note box used for notices and footers inside cards. */
export function Callout({ icon, trailing, children, className }: CalloutProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl bg-accent-soft/50 px-4 py-3 text-sm text-ink/80",
        className,
      )}
    >
      {icon && <span className="mt-0.5 shrink-0 text-accent">{icon}</span>}
      <div className="min-w-0 flex-1">{children}</div>
      {trailing && (
        <span className="mt-0.5 shrink-0 text-good">{trailing}</span>
      )}
    </div>
  );
}
