import { UserProfile } from "@/features/auth/types";

const USER_STORAGE_KEY = "expense-tracker-user";
const ACCESS_TOKEN_KEY = "expense-tracker-access-token";

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;

  const storedValue = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!storedValue) return null;

  try {
    const parsed: unknown = JSON.parse(storedValue);

    if (!isUserProfile(parsed)) {
      window.localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function saveStoredUser(user: UserProfile | null): void {
  if (typeof window === "undefined") return;

  if (user === null) {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    removeAccessToken();
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function saveAccessToken(token: string): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.avatarInitials === "string" &&
    (user.plan === "free" || user.plan === "pro") &&
    typeof user.createdAt === "string"
  );
}
