import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ProfileSummary, SecuritySnapshot } from "../types";
import { ProfileAvatar } from "./ProfileAvatar";
import { CalendarDays, IdCard, Mail, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/format";
import { PhotoControls } from "./PhotoControls";
import { SecuritySummary } from "./SecuritySummary";

interface ProfileHeaderCardProps {
  /** Saved name (doesn't change while typing in the form). */
  name: string;
  email: string;
  summary: ProfileSummary;
  security: SecuritySnapshot;
  /** Live photo, including an unsaved preview. */
  photoUrl: string | null;
  disabled?: boolean;
  onPhotoChange: (file: File | null) => void;
}

export function ProfileHeaderCard({
  name,
  email,
  summary,
  security,
  photoUrl,
  disabled = false,
  onPhotoChange,
}: ProfileHeaderCardProps) {
  return (
    <Card className="relative overflow-hidden p-5 sm:p-6">
      {/* soft green glow behind the security panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 bg-linear-to-l from-good-soft/70 to-transparent lg:block"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          <ProfileAvatar name={name} src={photoUrl} verified />

          <div className="min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 className="text-xl font-bold text-ink sm:text-2xl">{name}</h2>
              <Badge tone="good" className="px-2.5 py-1 text-[11px]">
                <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
                {summary.kycLabel}
              </Badge>
            </div>

            <Badge tone="accent" className="px-2.5 py-1 text-[11px]">
              {summary.planLabel}
            </Badge>

            <ul className="space-y-1 text-xs text-ink/80">
              <li className="flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="inline-flex items-center gap-2">
                  <IdCard aria-hidden="true" className="h-4 w-4 text-muted" />
                  {summary.memberId}
                </span>
                <span className="inline-flex min-w-0 items-center gap-2">
                  <Mail
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-good"
                  />
                  <span className="truncate">{email}</span>
                </span>
              </li>
              <li className="inline-flex items-center gap-2">
                <CalendarDays
                  aria-hidden="true"
                  className="h-4 w-4 text-muted"
                />
                Member since {formatDate(summary.memberSince)}
              </li>
            </ul>

            <PhotoControls
              hasPhoto={Boolean(photoUrl)}
              disabled={disabled}
              onChange={onPhotoChange}
            />
          </div>
        </div>

        <div className="lg:w-104 lg:shrink-0">
          <SecuritySummary security={security} />
        </div>
      </div>
    </Card>
  );
}
