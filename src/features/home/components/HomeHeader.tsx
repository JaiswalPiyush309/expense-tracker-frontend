"use client";

import { BrandMark } from "@/components/common/BrandMark";
import { HOME_NAV } from "../data/home-content";
import ThemeToggle from "@/components/common/ThemeToggle";
import { AuthMode } from "@/features/auth/types";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Menu, X } from "lucide-react";

interface HomeHeaderProps {
  userEmail?: string | null;
  onOpenApp: () => void;
  onOpenAuth: (mode?: AuthMode) => void;
}

export function HomeHeader({
  userEmail,
  onOpenApp,
  onOpenAuth,
}: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          aria-label="LedgerFlow home"
          onClick={closeMobileMenu}
          className="shrink-0 rounded-lg focus-visible:outline-offset-4"
        >
          <BrandMark />
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 text-sm font-medium text-muted md:flex"
        >
          {HOME_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="hidden items-center gap-2 sm:flex">
            {userEmail ? (
              <Button onClick={onOpenApp}>Go to dashboard</Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onOpenAuth("signin")}
                  className="hidden lg:inline-flex"
                >
                  Sign in
                </Button>

                <Button onClick={() => onOpenAuth("signup")}>
                  Get started
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-home-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink transition-colors hover:bg-surface-muted focus-visible:outline-offset-2 sm:hidden"
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-home-menu"
          className="border-t border-line bg-surface px-4 pb-5 pt-3 shadow-lg sm:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {HOME_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-3 grid grid-cols-1 gap-2 border-t border-line pt-4">
            {userEmail ? (
              <Button
                onClick={() => {
                  closeMobileMenu();
                  onOpenApp();
                }}
                className="w-full justify-center"
              >
                Go to dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenAuth("signup");
                  }}
                  className="w-full justify-center"
                >
                  Create free account
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => {
                    closeMobileMenu();
                    onOpenAuth("signin");
                  }}
                  className="w-full justify-center"
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
