import { Card, CardHeader } from "@/components/ui/Card";
import { formatINR } from "@/lib/format";
import { CategoryDonut } from "./CategoryDonut";
import { BudgetTrackers } from "./BudgetTrackers";
import type { BudgetItem, CategoryShare } from "../types";

interface ExpenseCategoryCardProps {
  total: number;
  segments: readonly CategoryShare[];
  budgets: readonly BudgetItem[];
}

export function ExpenseCategoryCard({
  total,
  segments,
  budgets,
}: ExpenseCategoryCardProps) {
  return (
    <Card className="flex flex-col gap-6 p-5 sm:p-6">
      <CardHeader
        title="Expense Category Share"
        description="Top outflows for the current billing cycle"
        actions={
          <span className="text-sm font-semibold text-muted">
            {formatINR(total, { decimals: false })} Total
          </span>
        }
      />
      <CategoryDonut segments={segments} />
      <BudgetTrackers items={budgets} />
    </Card>
  );
}
