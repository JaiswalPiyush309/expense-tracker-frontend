import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Designation } from "../types";

export function DesignationCard({ items }: { items: Designation[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <CardHeader title="Professional Designation" />
      {items.length > 0 ? (
        <dl className="mt-5 space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-accent-soft/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <dt className="text-sm font-bold text-ink">{item.label}</dt>
                  <dd className="break-words text-xs text-muted">{item.value}</dd>
                </div>
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
              </div>
            );
          })}
        </dl>
      ) : (
        <EmptyState
          className="mt-5 border-0 bg-accent-soft/40 p-4"
          title="No designations yet"
          description="Your professional details will appear here when available."
        />
      )}
    </Card>
  );
}
