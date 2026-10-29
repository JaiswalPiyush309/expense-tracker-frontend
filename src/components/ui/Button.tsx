import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-accent text-accent-ink shadow-sm hover:bg-accent-hover active:translate-y-px",

  secondary:
    "border border-line bg-surface text-ink hover:bg-surface-muted active:translate-y-px",

  soft: "bg-accent-soft text-accent hover:brightness-[0.97] active:translate-y-px",

  ghost: "bg-transparent text-muted hover:bg-surface-muted hover:text-ink",
} as const;

const sizes = {
  sm: "min-h-9 px-4 py-2 text-xs",
  md: "min-h-11 px-5 py-2.5 text-sm",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  variant = "primary",
  size = "sm",
  className = "",
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={[
        "inline-flex shrink-0 items-center justify-center gap-2",
        "whitespace-nowrap rounded-xl font-semibold",
        "transition-colors duration-200",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-surface",
        "disabled:pointer-events-none disabled:opacity-50",
        "motion-reduce:transition-none",
        variants[variant],
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
