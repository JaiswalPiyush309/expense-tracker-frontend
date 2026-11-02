import type { LucideIcon } from "lucide-react";

export const PROFILE_PHOTO_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export type ProfileTab =
  | "personal"
  | "financial"
  | "security"
  | "notifications"
  | "data";

/** Everything the "Personal Information" form edits. All fields are strings except the photo. */
export interface ProfileValues {
  firstName: string;
  lastName: string;
  displayName: string;
  /** Read-only here; changed through the "Change Email" flow. */
  email: string;
  mobile: string;
  /** ISO date, YYYY-MM-DD (what <input type="date"> uses). */
  dob: string;
  gender: string;
  /** ISO 3166-1 alpha-2, e.g. "IN". */
  country: string;
  state: string;
  city: string;
  pincode: string;
  bio: string;
  /** URL of the current photo, a blob: URL for a not-yet-saved upload, or null for none. */
  photoUrl: string | null;
}

export type ProfileField = Exclude<keyof ProfileValues, "photoUrl">;
export type ProfileErrors = Partial<Record<ProfileField, string>>;

export interface SaveProfileRequest {
  values: ProfileValues;
  photo: File | null;
}

export interface SaveProfileResult {
  savedAt: string;
  profile?: ProfileResponse;
}

export type ProfileGender =
  | "male"
  | "female"
  | "other"
  | "prefer_not_to_say";

export interface ProfileResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  email: string;
  phone: string | null;
  phoneVerified: boolean;
  dateOfBirth: string | null;
  gender: ProfileGender | null;
  country: string | null;
  state: string | null;
  city: string | null;
  postalCode: string | null;
  bio: string | null;
  designation: string | null;
  industry: string | null;
  avatarUrl: string | null;
  plan: string;
  kyc: {
    status: "pending" | "verified" | "rejected";
    pan: string | null;
    aadhaar: string | null;
  };
  twoFactorEnabled: boolean;
  memberSince: string;
}

export interface ProfileSummary {
  kycLabel: string;
  planLabel: string;
  memberId: string;
  /** ISO date */
  memberSince: string;
}

export interface SecuritySnapshot {
  /** 0-100 */
  score: number;
  twoFactor: boolean;
  lastSession: string;
  location: string;
}

export interface KycDocument {
  id: string;
  title: string;
  icon: LucideIcon;
  /** Already masked by the server. Never send the full PAN / Aadhaar to the browser. */
  maskedNumber: string;
  source: string;
  verified: boolean;
}

export interface Designation {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface SelectOption {
  value: string;
  label: string;
}
