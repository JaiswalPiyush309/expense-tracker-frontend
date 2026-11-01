import { Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { KycDocument } from "../types";

interface KycCardProps {
  documents: KycDocument[];
  note: string;
}

export function KycCard({ documents, note }: KycCardProps) {
  return (
    <Card className="p-5 sm:p-6">
      <CardHeader
        title="Tax ID & KYC"
        actions={
          <ShieldCheck aria-hidden="true" className="h-5 w-5 text-good" />
        }
      />
      <p className="mt-4 text-sm text-muted">
        Indian statutory compliance identifiers used for automated IT tax audit
        classification, capital gains computations, and Form 26AS
        cross-referencing.
      </p>

      {documents.length > 0 ? (
        <ul className="mt-5 space-y-3" aria-label="KYC documents">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
          <li key={doc.id} className="rounded-xl bg-accent-soft/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                <Icon aria-hidden="true" className="h-4 w-4 text-accent" />
                {doc.title}
              </h3>
              <Badge
                tone={doc.verified ? "good" : "bad"}
                className="rounded-full px-2.5 py-1 text-xs"
              >
                {doc.verified && (
                  <Check aria-hidden="true" className="h-3 w-3" />
                )}
                {doc.verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              {/* Masked by the server. Spoken as-is, so don't hide it from screen readers. */}
              <p className="text-lg font-bold tracking-wide tabular-nums text-ink">
                {doc.maskedNumber}
              </p>
              <span className="text-xs text-muted">{doc.source}</span>
            </div>
          </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          className="mt-5 border-0 bg-accent-soft/40 p-4"
          title="No KYC documents"
          description="Verified tax and identity documents will appear here."
        />
      )}

      <Callout
        className="mt-4 text-xs"
        icon={<LockKeyhole aria-hidden="true" className="h-4 w-4 text-good" />}
      >
        {note}
      </Callout>
    </Card>
  );
}
