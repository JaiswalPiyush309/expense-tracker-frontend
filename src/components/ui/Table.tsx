import { cn } from "@/lib/cn";
import type { ComponentProps } from "react";

type Align = "left" | "right" | "center";

const alignClass: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

interface TableProps extends ComponentProps<"table"> {
  /** Classes applied to the horizontal scrolling container. */
  wrapperClassName?: string;
}

/** Scrolls sideways on small screens. Use `className` for table styles and `wrapperClassName` for the scroller. */
export function Table({
  className,
  wrapperClassName,
  ...props
}: TableProps) {
  return (
    <div className={cn("overflow-x-auto", wrapperClassName)}>
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function Th({
  align = "left",
  className,
  ...props
}: ComponentProps<"th"> & { align?: Align }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted",
        alignClass[align],
        className,
      )}
      {...props}
    />
  );
}

export function Td({
  align = "left",
  className,
  ...props
}: ComponentProps<"td"> & { align?: Align }) {
  return (
    <td
      className={cn("px-3 py-3.5 align-middle", alignClass[align], className)}
      {...props}
    />
  );
}
