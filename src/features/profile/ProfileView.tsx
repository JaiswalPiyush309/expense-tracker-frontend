"use client";

import { Banknote, Bell, Check, CreditCard, Database, Fingerprint, SlidersHorizontal, Wallet, Building2 } from "lucide-react";
import type { ProfileResponse, ProfileTab } from "./types";
import {
  countryOptions,
  genderOptions,
} from "./data/mock";
import { getProfile, saveProfile, toProfileValues } from "./api";
import { useEffect, useState } from "react";
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
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<ProfileTab>("personal");

  useEffect(() => {
    getProfile().then(setProfile).catch((err: unknown) => {
      setLoadError(err instanceof Error ? err.message : "Unable to load your profile.");
    });
  }, []);

  if (loadError) return <p role="alert" className="p-6 text-sm text-bad">{loadError}</p>;
  if (!profile) return <p role="status" className="p-6 text-sm text-muted">Loading your profile…</p>;

  return <ProfileContent profile={profile} tab={tab} setTab={setTab} />;
}

function ProfileContent({
  profile,
  tab,
  setTab,
}: {
  profile: ProfileResponse;
  tab: ProfileTab;
  setTab: (tab: ProfileTab) => void;
}) {
  const form = useProfileForm(toProfileValues(profile), async (values, photo) => {
    const result = await saveProfile(values, photo);
    return result.profile ? toProfileValues(result.profile) : undefined;
  });

  const saving = form.saveState.status === "saving";
  const savedName = form.saved.displayName || `${form.saved.firstName} ${form.saved.lastName}`.trim();
  const summary = {
    kycLabel: profile.kyc.status === "verified" ? "KYC Verified" : `KYC ${profile.kyc.status}`,
    planLabel: profile.plan,
    memberId: profile.id,
    memberSince: profile.memberSince,
  };
  const kycDocuments = [
    ...(profile.kyc.pan ? [{ id: "pan", title: "PAN Card", icon: CreditCard, maskedNumber: profile.kyc.pan, source: "Linked to NSDL", verified: profile.kyc.status === "verified" }] : []),
    ...(profile.kyc.aadhaar ? [{ id: "aadhaar", title: "Aadhaar e-KYC", icon: Fingerprint, maskedNumber: profile.kyc.aadhaar, source: "UIDAI Digilocker", verified: profile.kyc.status === "verified" }] : []),
  ];
  const designations = [
    ...(profile.designation ? [{ id: "role", label: "Designation", value: profile.designation, icon: Building2 }] : []),
    ...(profile.industry ? [{ id: "industry", label: "Primary Industry", value: profile.industry, icon: Banknote }] : []),
  ];
  const security = { score: profile.twoFactorEnabled ? 92 : 60, twoFactor: profile.twoFactorEnabled, lastSession: "", location: "" };

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
              mobileVerified={profile.phoneVerified}
              onChangeEmail={() => {
                // Open your email-change flow (modal or route) here.
              }}
            />
            <div className="space-y-6">
              <KycCard documents={kycDocuments} note="Your tax identifiers are masked and protected by the server." />
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
