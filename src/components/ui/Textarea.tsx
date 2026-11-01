import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Multi-line input styled like <Input>. */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  ComponentProps<"textarea">
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full resize-y rounded-xl border border-transparent bg-accent-soft/60 px-3.5 py-3",
        "text-base text-ink outline-none transition-colors placeholder:text-muted sm:text-sm",
        "hover:bg-accent-soft focus-visible:border-accent focus-visible:bg-surface",
        "focus-visible:ring-2 focus-visible:ring-focus",
        "aria-invalid:border-bad aria-invalid:focus-visible:ring-bad",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
});
