"use client";

import { ArrowDownRight, ArrowUpRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CategoryEnvelopeItem, CategoryGroupType } from "../types";
import { CategoryEnvelopeCard } from "./CategoryEnvelopeCard";

interface CategorySectionGroupProps {
  title: string;
  type: CategoryGroupType;
  items: CategoryEnvelopeItem[];
  viewMode: "grid" | "list";
  onEdit: (item: CategoryEnvelopeItem) => void;
  onDelete: (id: string) => void;
}

export function CategorySectionGroup({
  title,
  type,
  items,
  viewMode,
  onEdit,
  onDelete,
}: CategorySectionGroupProps) {
  const Icon = type === "expense" ? ArrowDownRight : ArrowUpRight;

  return (
    <section className="space-y-3" aria-label={title}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <h2 className="truncate text-sm font-bold text-ink">{title}</h2>
          <Badge tone={type === "expense" ? "bad" : "good"}>
            {items.length}
          </Badge>
        </div>
        <span className="hidden text-xs text-muted sm:block">
          This month
        </span>
      </div>

      {items.length > 0 ? (
        <div
          className={`grid grid-cols-1 gap-3 ${
            viewMode === "list" ? "" : "sm:grid-cols-2 xl:grid-cols-4"
          }`}
        >
          {items.map((item) => (
            <CategoryEnvelopeCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          className="p-6"
          icon={<Tag className="h-5 w-5" />}
          title={`No ${type} categories found`}
          description="Try a different search or add a category to see it here."
        />
      )}
    </section>
  );
}
