"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

interface CategoriesHeaderProps {
  onOpenAddCategory: () => void;
}

export function CategoriesHeader({ onOpenAddCategory }: CategoriesHeaderProps) {
  return (
    <PageHeader
      title="Categories"
      description="Organize income and expenses, review monthly category activity, and manage your custom categories."
      actions={
        <Button
          type="button"
          onClick={onOpenAddCategory}
          variant="accent"
          size="sm"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          <span>Add category</span>
        </Button>
      }
    />
  );
}
