import { ComponentProps } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

type IconButtonProps = ComponentProps<"button"> & { label: string };

export function IconButton({
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      className={cn("relative", className)}
      {...props}
    />
  );
}
