"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-surface-muted hover:text-ink motion-reduce:transition-none"
    >
      <Sun aria-hidden="true" className="h-4.25 w-4.25 dark:hidden!" />
      <Moon aria-hidden="true" className="hidden! h-4.25 w-4.25 dark:block!" />
    </button>
  );
}
