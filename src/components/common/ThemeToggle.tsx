"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep the server and initial client render identical.
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Change color theme"
        className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted opacity-70"
      >
        <Sun aria-hidden="true" className="h-4.25 w-4.25" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="h-4.25 w-4.25" />
      ) : (
        <Moon aria-hidden="true" className="h-4.25 w-4.25" />
      )}
    </button>
  );
}
