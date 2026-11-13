"use client";

import { IconButton } from "@/components/ui/IconButton";
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { LogOut, Search } from "lucide-react";
import { DateRangeSelector } from "./DateRangeSelector";
import ThemeToggle from "@/components/common/ThemeToggle";
import { NotificationButton } from "./NotificationButton";
import { Button } from "@/components/ui/Button";
import { UserProfileBadge } from "./UserProfileBadge";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

interface NavbarProps {
  onMenuToggle?: () => void;
}

const DATE_RANGES = [
  { label: "Today",        range: "13 Nov 2026"              },
  { label: "This Week",    range: "10 Nov – 16 Nov 2026"     },
  { label: "This Month",   range: "01 Nov – 30 Nov 2026"     },
  { label: "Last Month",   range: "01 Oct – 31 Oct 2026"     },
  { label: "This Quarter", range: "01 Oct – 31 Dec 2026"     },
  { label: "This Year",    range: "01 Apr – 31 Mar 2027"     },
  { label: "All Time",     range: "Since inception"          },
];

export function Navbar({ onMenuToggle }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(DATE_RANGES[2]); // "This Month" default
  const { signOut } = useAuthUser();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  const handleSelectRange = (item: typeof DATE_RANGES[number]) => {
    setSelectedRange(item);
    setDatePickerOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-2 border-b border-line bg-surface/90 px-3 backdrop-blur sm:gap-3 sm:px-6">
      {/* Left: menu + search */}
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
        <IconButton
          label="Open sidebar"
          onClick={onMenuToggle}
          className="lg:hidden"
        />

        <div className="hidden w-full max-w-md md:block">
          <SearchBar value={search} onChange={setSearch} shortcut />
        </div>

        <IconButton
          label="Search"
          onClick={() => setMobileSearchOpen(true)}
          className="md:hidden"
        >
          <Search className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Right: actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">

        {/* Date Range Selector with Dropdown */}
        <div className="relative">
          <DateRangeSelector
            label={selectedRange.label}
            range={selectedRange.range}
            onClick={() => setDatePickerOpen((prev) => !prev)}
            isExpanded={datePickerOpen}
          />

          {datePickerOpen && (
            <>
              {/* Backdrop to close on outside click */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDatePickerOpen(false)}
              />
              {/* Dropdown panel */}
              <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Select Period
                </div>
                {DATE_RANGES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectRange(item)}
                    className={cn(
                      "flex w-full flex-col items-start px-4 py-2.5 text-left transition-colors hover:bg-surface-muted",
                      selectedRange.label === item.label &&
                        "bg-accent-soft/50 text-accent"
                    )}
                  >
                    <span className="text-xs font-semibold">{item.label}</span>
                    <span className="text-[11px] text-muted">{item.range}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <ThemeToggle />

        <NotificationButton hasUnread />

        <div className="mx-1 hidden h-6 w-px bg-line sm:block" />

        {/* User profile — fixed width to prevent it from pushing logout off screen */}
        <div className="shrink-0">
          <UserProfileBadge
            name="Piyush Jaiswal"
            badge="Premium Member"
            isOnline
            onClick={() => router.push("/profile")}
            className="w-auto"
          />
        </div>

        <div className="mx-1 hidden h-6 w-px bg-line sm:block" />

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          aria-label="Logout"
          className="shrink-0 gap-1.5 whitespace-nowrap px-2.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div
          className="absolute inset-0 z-10 flex items-center gap-2 bg-surface px-3 md:hidden"
          onKeyDown={(e) => e.key === "Escape" && setMobileSearchOpen(false)}
        >
          <SearchBar value={search} onChange={setSearch} autoFocus />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSearchOpen(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </header>
  );
}
