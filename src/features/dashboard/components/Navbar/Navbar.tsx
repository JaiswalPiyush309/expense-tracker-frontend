"use client";

import { IconButton } from "@/components/ui/IconButton";
import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { Plus, Search } from "lucide-react";
import { DateRangeSelector } from "./DateRangeSelector";
import ThemeToggle from "@/components/common/ThemeToggle";
import { NotificationButton } from "./NotificationButton";
import { Button } from "@/components/ui/Button";
import { UserProfileBadge } from "./UserProfileBadge";

interface NavbarProps {
  onMenuToggle?: () => void;
  onAddTransaction?: () => void;
}

export function Navbar({ onMenuToggle, onAddTransaction }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
        <DateRangeSelector label="This Month" range="01 Apr – 30 Apr 2025" />

        <ThemeToggle />

        <NotificationButton hasUnread />

        <Button
          variant="primary"
          size="sm"
          onClick={onAddTransaction}
          aria-label="Add transaction"
          className="shrink-0 gap-1.5 whitespace-nowrap px-2.5 md:px-3.5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Add Transaction</span>
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-line xl:block" />

        <UserProfileBadge
          name="Piyush Jaiswal" // TODO: replace with real user data
          badge="Premium Member"
          avatarUrl="/avatar.jpg"
          isOnline
        />
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
