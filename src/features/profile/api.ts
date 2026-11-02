import {
  PROFILE_PHOTO_MAX_BYTES,
  PROFILE_PHOTO_MIME_TYPES,
  type ProfileValues,
  type ProfileResponse,
  type SaveProfileResult,
} from "./types";
import { validateProfile } from "./validation";
import { getAccessToken } from "@/lib/storage";
import { getApiBaseUrl } from "@/lib/api-config";

export const MAX_PROFILE_PHOTO_BYTES = PROFILE_PHOTO_MAX_BYTES;
const ACCEPTED_PHOTO_TYPES = new Set<string>(PROFILE_PHOTO_MIME_TYPES);

async function profileRequest<T>(endpoint = "", init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");

  const apiBaseUrl = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/users/me${endpoint}`, {
      ...init,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Cannot connect to the profile server. Check that the backend is running.");
  }

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? Array.isArray(data.message) ? data.message.join(" ") : String(data.message)
        : `Profile request failed (${response.status}).`;
    throw new Error(message);
  }
  return data as T;
}

export function getProfile() {
  return profileRequest<ProfileResponse>();
}

function toProfileValues(profile: ProfileResponse): ProfileValues {
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    displayName: profile.displayName ?? "",
    email: profile.email,
    mobile: profile.phone ?? "",
    dob: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "",
    country: profile.country ?? "",
    state: profile.state ?? "",
    city: profile.city ?? "",
    pincode: profile.postalCode ?? "",
    bio: profile.bio ?? "",
    photoUrl: profile.avatarUrl,
  };
}

export { toProfileValues };

/**
 * - `photo` is the newly chosen File (upload it, e.g. as multipart/form-data),
 *   or null when the photo is unchanged. `values.photoUrl === null` means "remove the photo".
 * - Throw an Error to show its message in the page header.
 * - Validate again on the server; client validation is only for convenience.
 */
export async function saveProfile(
  values: ProfileValues,
  photo: File | null,
): Promise<SaveProfileResult> {
  const errors = validateProfile(values);
  const firstError = Object.values(errors).find(Boolean);
  if (firstError) throw new Error(firstError);

  if (photo) {
    if (!ACCEPTED_PHOTO_TYPES.has(photo.type)) {
      throw new Error("Use a JPG, PNG or WebP image.");
    }
    if (photo.size > MAX_PROFILE_PHOTO_BYTES) {
      throw new Error("That image is over 5 MB. Choose a smaller one.");
    }
  }

  const profile = await profileRequest<ProfileResponse>("", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      displayName: values.displayName.trim(),
      phone: values.mobile.replace(/[\s()-]/g, ""),
      dateOfBirth: values.dob,
      gender: values.gender,
      country: values.country,
      state: values.state.trim(),
      city: values.city.trim(),
      postalCode: values.pincode.trim(),
      bio: values.bio.trim(),
    }),
  });

  let savedProfile = profile;
  if (photo) {
    const formData = new FormData();
    formData.append("file", photo);
    const avatar = await profileRequest<{ avatarUrl: string }>("/avatar", {
      method: "POST",
      body: formData,
    });
    savedProfile = { ...profile, avatarUrl: avatar.avatarUrl };
  } else if (values.photoUrl === null && profile.avatarUrl !== null) {
    await profileRequest<void>("/avatar", { method: "DELETE" });
    savedProfile = { ...profile, avatarUrl: null };
  }

  return {
    savedAt: new Date().toISOString(),
    profile: savedProfile,
  };
}
