"use client";

import { cn } from "@/lib/cn";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  shortcut?: boolean; // enables Cmd/Ctrl+K and shows the hint
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  autoFocus,
  shortcut,
  className,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcut]);

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted"
      />
      <input
        ref={inputRef}
        type="text"
        aria-label="Search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search transactions, stocks, people..."
        className={cn(
          "h-10 w-full rounded-xl border border-line bg-surface-muted/60 pl-10 text-sm text-ink",
          "placeholder:text-muted outline-none transition-all",
          "focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20",
          shortcut ? "pr-12" : "pr-4",
        )}
      />
      {shortcut && (
        <kbd className="pointer-events-none absolute right-3 rounded-md border border-line bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-muted">
          ⌘K
        </kbd>
      )}
    </div>
  );
}
