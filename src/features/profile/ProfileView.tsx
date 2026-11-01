"use client";

import { Bell, Check, Database, SlidersHorizontal, Wallet } from "lucide-react";
import type { ProfileTab } from "./types";
import {
  countryOptions,
  designations,
  genderOptions,
  initialValues,
  kycDocuments,
  kycNote,
  security,
  summary,
} from "./data/mock";
import { saveProfile } from "./api";
import { useState } from "react";
import { useProfileForm } from "./hooks/useProfileForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { IdentityForm } from "./components/IdentityForm";
import { KycCard } from "./components/KycCard";
import { DesignationCard } from "./components/DesignationCard";
import { EmptyState } from "@/components/ui/EmptyState";

const TABS: readonly { value: ProfileTab; label: string }[] = [
  { value: "personal", label: "Personal Information" },
  { value: "financial", label: "Financial Preferences" },
  { value: "security", label: "Security & 2FA" },
  { value: "notifications", label: "Notifications & Alerts" },
  { value: "data", label: "Data Management & Privacy" },
];

const PLACEHOLDER_ICONS = {
  financial: Wallet,
  security: SlidersHorizontal,
  notifications: Bell,
  data: Database,
} as const;

export function ProfileView() {
  const form = useProfileForm(initialValues, saveProfile);
  const [tab, setTab] = useState<ProfileTab>("personal");

  const saving = form.saveState.status === "saving";
  const savedName = `${form.saved.firstName} ${form.saved.lastName}`.trim();

  const status =
    form.saveState.status === "error"
      ? { text: form.saveState.message, className: "text-bad" }
      : form.saveState.status === "saved"
        ? { text: "All changes saved", className: "text-good" }
        : form.dirty
          ? { text: "You have unsaved changes", className: "text-muted" }
          : { text: "", className: "" };

  const activeTab = TABS.find((t) => t.value === tab);
  const PlaceholderIcon = tab === "personal" ? null : PLACEHOLDER_ICONS[tab];

  return (
    <div className="mx-auto w-full max-w-350 space-y-6 p-4 sm:p-6">
      <PageHeader
        breadcrumbs={[{ label: "Account" }, { label: "Profile & Settings" }]}
        title="My Profile & Account Settings"
        description="Manage your personal identity, regional financial preferences, security credentials, and active data sessions."
        actions={
          <>
            <p
              role="status"
              aria-live="polite"
              className={`min-h-4 text-xs font-medium ${status.className}`}
            >
              {status.text}
            </p>
            <Button
              variant="soft"
              size="sm"
              disabled={!form.dirty || saving}
              onClick={form.discard}
              className="min-h-10 px-4 text-ink"
            >
              Discard Changes
            </Button>
            <Button
              size="sm"
              disabled={!form.dirty || saving}
              onClick={() => void form.submit()}
              className="min-h-10 px-4"
            >
              <Check aria-hidden="true" className="h-4 w-4" />
              {saving ? "Saving…" : "Save All Changes"}
            </Button>
          </>
        }
      />

      <ProfileHeaderCard
        name={savedName}
        email={form.saved.email}
        summary={summary}
        security={security}
        photoUrl={form.values.photoUrl}
        disabled={saving}
        onPhotoChange={form.setPhoto}
      />

      <SegmentedControl
        semantics="tabs"
        size="md"
        label="Profile sections"
        value={tab}
        onChange={setTab}
        options={TABS}
        className="w-full rounded-2xl bg-accent-soft/40"
      />

      <div role="tabpanel" aria-label={activeTab?.label}>
        {tab === "personal" ? (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
            <IdentityForm
              form={form}
              genderOptions={genderOptions}
              countryOptions={countryOptions}
              mobileVerified
              onChangeEmail={() => {
                // Open your email-change flow (modal or route) here.
              }}
            />
            <div className="space-y-6">
              <KycCard documents={kycDocuments} note={kycNote} />
              <DesignationCard items={designations} />
            </div>
          </div>
        ) : (
          <EmptyState
            icon={
              PlaceholderIcon && (
                <PlaceholderIcon aria-hidden="true" className="h-5 w-5" />
              )
            }
            title={activeTab?.label ?? ""}
            description="This section isn't designed yet. Send the design and it will slot in here."
          />
        )}
      </div>
    </div>
  );
}
