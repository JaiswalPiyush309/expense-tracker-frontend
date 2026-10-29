import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

const variants = {
  primary:
    "bg-accent text-accent-ink shadow-sm hover:bg-accent-hover active:translate-y-px",
  secondary:
    "border border-line bg-surface text-ink hover:bg-surface-muted active:translate-y-px",
  soft: "bg-accent-soft text-accent hover:brightness-[0.97] active:translate-y-px",
  ghost: "bg-transparent text-muted hover:bg-surface-muted hover:text-ink",
  danger: "bg-bad text-accent-ink hover:brightness-95 active:translate-y-px",
} as const;

const sizes = {
  sm: "min-h-9 px-4 py-2 text-xs",
  md: "min-h-11 px-5 py-2.5 text-sm",
  icon: "h-10 w-10 p-0 text-sm",
} as const;

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  variant = "primary",
  size = "sm",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2",
        "whitespace-nowrap rounded-xl font-semibold",
        "transition-colors duration-200 motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  );
}
