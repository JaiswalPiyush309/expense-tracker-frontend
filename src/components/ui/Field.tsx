import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label: ReactNode;
  /** id of the control; the error text gets `${htmlFor}-error` (point aria-describedby at it). */
  htmlFor: string;
  /** Aligned to the right of the label, e.g. "Change Email". */
  labelRight?: ReactNode;
  /** Helper text under the control (hidden while there is an error). */
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  labelRight,
  hint,
  error,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-2 flex min-h-4 items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold uppercase tracking-wider text-muted"
        >
          {label}
        </label>
        {labelRight}
      </div>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          aria-live="polite"
          className="mt-1.5 text-xs font-medium text-bad"
        >
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}
