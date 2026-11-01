import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Placeholder for a panel that has no content (yet). */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-card border border-dashed border-line bg-surface p-10 text-center",
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent"
        >
          {icon}
        </span>
      )}
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
