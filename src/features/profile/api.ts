import type { ProfileValues, SaveProfileResult } from "./types";
import { validateProfile } from "./validation";

export const MAX_PROFILE_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * PLACEHOLDER. Replace the body with a server action or a fetch to your API.
 *
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

  // Replace this delay with the real API request. Keeping this boundary typed
  // makes the mock behave like the eventual server-backed implementation.
  await new Promise<void>((resolve) => setTimeout(resolve, 600));
  return { savedAt: new Date().toISOString() };
}
