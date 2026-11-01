import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { toneSoft, type Tone } from "@/lib/tone";

interface BadgeProps extends ComponentProps<"span"> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
        toneSoft[tone],
        className,
      )}
      {...props}
    />
  );
}
