import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends ComponentProps<"input"> {
  /** Icon shown inside the left edge. */
  icon?: ReactNode;
  /** Content shown inside the right edge, e.g. a status badge. */
  trailing?: ReactNode;
  /** Classes applied directly to the native input. */
  inputClassName?: string;
}

/** Text input styled like <Select>. `className` applies to the wrapper (use it for width). */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { icon, trailing, className, inputClassName, ...props },
    ref,
  ) {
    return (
      <div className={cn("relative inline-flex w-full", className)}>
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "h-10 w-full rounded-xl border border-transparent bg-accent-soft/60 pr-3",
            "text-base text-ink outline-none transition-colors placeholder:text-muted sm:text-sm",
            "hover:bg-accent-soft focus-visible:border-accent focus-visible:bg-surface",
            "focus-visible:ring-2 focus-visible:ring-focus",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "aria-invalid:border-bad aria-invalid:focus-visible:ring-bad",
            icon ? "pl-9" : "pl-3.5",
            trailing ? "pr-20" : "pr-3",
            inputClassName,
          )}
          {...props}
        />
        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {trailing}
          </span>
        )}
      </div>
    );
  },
);
