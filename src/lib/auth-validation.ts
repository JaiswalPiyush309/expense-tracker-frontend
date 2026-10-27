import { AuthMode } from "@/types/auth";

export const MIN_PASSWORD = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthField = "name" | "email" | "password" | "confirm";
export type AuthValues = Record<AuthField, string>;
export type FieldErrors = Partial<Record<AuthField, string>>;

export function validateAuth(mode: AuthMode, v: AuthValues): FieldErrors {
  const errors: FieldErrors = {};
  if (mode === "signup" && !v.name.trim()) errors.name = "Enter your name.";
  if (!EMAIL_RE.test(v.email.trim()))
    errors.email = "Enter a valid email address.";
  if (mode === "signup") {
    if (v.password.length < MIN_PASSWORD)
      errors.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (v.confirm !== v.password) errors.confirm = "Passwords don't match.";
  } else if (!v.password) {
    errors.password = "Enter your password.";
  }
  return errors;
}

/** "Priya Sharma" -> "PS", handles extra spaces and single names */
export function getInitials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length
    ? parts.map((p) => Array.from(p)[0]).join("")
    : email.slice(0, 2);
  return letters.toUpperCase().slice(0, 2) || "US";
}
