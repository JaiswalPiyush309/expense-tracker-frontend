import { cn } from "@/lib/cn";
import type { ComponentProps, ReactNode } from "react";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Small tile shown before the title. */
  icon?: ReactNode;
  /** Anything aligned to the right (filters, badges, buttons). */
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  description,
  icon,
  actions,
  className,
}: CardHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-4 gap-y-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
            {icon}
          </span>
        )}

        <div className="min-w-0">
          <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
