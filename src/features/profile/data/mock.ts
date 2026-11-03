/**
 * Mock data mirroring the design. Replace with real fetches (server component
 * or React Query); components only depend on ../types.
 */
import { Banknote, Building2, CreditCard, Fingerprint } from "lucide-react";
import type {
  Designation,
  KycDocument,
  ProfileSummary,
  ProfileValues,
  SecuritySnapshot,
  SelectOption,
} from "../types";

export const initialValues: ProfileValues = {
  firstName: "Aditya",
  lastName: "Sharma",
  displayName: "Aditya S. (FinPro)",
  email: "aditya.sharma@fintech.io",
  mobile: "+91 98110 55219",
  dob: "1991-08-18",
  gender: "Male",
  country: "IN",
  state: "Karnataka",
  city: "Bengaluru",
  pincode: "560103",
  bio: "Tracking personal cashflows, angel investments, equity portfolio, and freelance fintech advisory income.",
  photoUrl: null,
};

export const summary: ProfileSummary = {
  kycLabel: "KYC Verified Pro",
  planLabel: "LedgerFlow Pro (Lifetime)",
  memberId: "LF-948201-IND",
  memberSince: "2023-10-14",
};

export const security: SecuritySnapshot = {
  score: 92,
  twoFactor: true,
  lastSession: "Today, 10:42 AM IST",
  location: "Bengaluru, IN • macOS (Chrome 124)",
};

export const kycDocuments: KycDocument[] = [
  {
    id: "pan",
    title: "PAN Card",
    icon: CreditCard,
    maskedNumber: "ABCPS****K",
    source: "Linked to NSDL",
    verified: true,
  },
  {
    id: "aadhaar",
    title: "Aadhaar e-KYC",
    icon: Fingerprint,
    maskedNumber: "•••• •••• 9104",
    source: "UIDAI Digilocker",
    verified: true,
  },
];

export const kycNote =
  "Your tax identifiers are encrypted using AES-256 with hardware key store security. LedgerFlow never shares tax records with unauthorized third parties.";

export const designations: Designation[] = [
  {
    id: "role",
    label: "Designation",
    value: "Senior Tech Lead & Architect",
    icon: Building2,
  },
  {
    id: "industry",
    label: "Primary Industry",
    value: "Fintech / Payment Systems",
    icon: Banknote,
  },
];

export const genderOptions: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const countryOptions: SelectOption[] = [
  { value: "IN", label: "India (IN)" },
  { value: "US", label: "United States (US)" },
  { value: "GB", label: "United Kingdom (GB)" },
  { value: "AE", label: "United Arab Emirates (AE)" },
  { value: "SG", label: "Singapore (SG)" },
  { value: "AU", label: "Australia (AU)" },
  { value: "CA", label: "Canada (CA)" },
];
