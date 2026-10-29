"use client";

import React from "react";
import Image from "next/image";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface UserProfileBadgeProps {
  name: string;
  badge: string;
  avatarUrl?: string;
  onClick?: () => void;
  isOnline?: boolean;
  showDetails?: boolean;
  ariaLabel?: string;
  isExpanded?: boolean;
  className?: string;
}

export function UserProfileBadge({
  name,
  badge,
  avatarUrl = "/avatar.jpg",
  onClick,
  isOnline = true,
  showDetails = true,
  isExpanded,
  className = "",
}: UserProfileBadgeProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={`Open profile menu for ${name}`}
      aria-haspopup={onClick ? "menu" : undefined}
      aria-expanded={onClick ? isExpanded : undefined}
      className={[
        "w-full min-w-0 justify-start gap-2.5",
        "px-2! py-1! text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Avatar */}
      <span className="relative h-9 w-9 shrink-0">
        <Image
          src={avatarUrl}
          alt={`${name}'s avatar`}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover ring-1 ring-line"
        />

        {isOnline && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface"
          />
        )}
      </span>

      {/* Name and badge */}
      {showDetails && (
        <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
          <span className="w-full truncate text-xs font-bold text-ink">
            {name}
          </span>

          <span className="mt-1 max-w-full truncate text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            {badge}
          </span>
        </span>
      )}

      {/* Dropdown icon */}
      {onClick && (
        <ChevronsUpDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      )}
    </Button>
  );
}
