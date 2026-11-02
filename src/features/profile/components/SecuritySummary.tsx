import type { Tone } from "@/lib/tone";
import type { SecuritySnapshot } from "../types";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";

function rate(score: number): { label: string; tone: Tone } {
  if (score >= 80) return { label: "Strong Security", tone: "good" };
  if (score >= 50) return { label: "Fair Security", tone: "accent" };
  return { label: "Weak Security", tone: "bad" };
}

export function SecuritySummary({ security }: { security: SecuritySnapshot }) {
  const { label, tone } = rate(security.score);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface/70 p-4 backdrop-blur-sm">
      <ProgressRing
        value={security.score}
        size={60}
        stroke={5}
        tone={tone}
        label={`Security score ${security.score} out of 100`}
      >
        {security.score}%
      </ProgressRing>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 font-bold text-ink">
          {label}
          <Badge tone={security.twoFactor ? "good" : "bad"}>
            2FA {security.twoFactor ? "ON" : "OFF"}
          </Badge>
        </p>
        {security.lastSession ? (
          <p className="mt-1 text-xs text-muted">
            Last session: {security.lastSession}
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted">Session details available in Security</p>
        )}
        {security.location && (
          <p className="mt-0.5 text-[11px] font-semibold text-muted">
            {security.location}
          </p>
        )}
      </div>
    </div>
  );
}
