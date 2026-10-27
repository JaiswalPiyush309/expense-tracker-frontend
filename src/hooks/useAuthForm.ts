"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import {
  AuthField,
  AuthValues,
  FieldErrors,
  validateAuth,
} from "@/lib/auth-validation";
import { AuthMode, UserProfile } from "@/features/auth/types";
import { getAuthUser, loginUser, registerUser } from "@/lib/auth-api";

const EMPTY: AuthValues = {
  name: "",
  email: "",
  password: "",
  confirm: "",
};

interface Options {
  initialMode: AuthMode;
  onSuccess: (user: UserProfile) => void;
}

export function useAuthForm({ initialMode, onSuccess }: Options) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [values, setValues] = useState<AuthValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const setField = (field: AuthField) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );

    setFormError(null);
  };

  const switchMode = (next: AuthMode) => {
    if (next === mode) return;

    setMode(next);
    setErrors({});
    setFormError(null);
    setValues((previous) => ({
      ...previous,
      password: "",
      confirm: "",
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    const found = validateAuth(mode, values);

    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempt((previous) => previous + 1);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const response =
        mode === "signup"
          ? await registerUser({
              name: values.name.trim(),
              email: values.email.trim(),
              password: values.password,
            })
          : await loginUser({
              email: values.email.trim(),
              password: values.password,
            });

      // The backend should return the authenticated user's details.
      const apiUser = getAuthUser(response);

      if (!apiUser?.id || !apiUser.email) {
        throw new Error(
          "The request succeeded, but the backend did not return the required user details. Please check the authentication API response.",
        );
      }

      const displayName =
        apiUser.name?.trim() ||
        (mode === "signup" ? values.name.trim() : "") ||
        apiUser.email.split("@")[0];

      const user: UserProfile = {
        id: apiUser.id,
        name: displayName,
        email: apiUser.email,
        avatarInitials: displayName
          .split(/\s+/)
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        plan: "free",
        createdAt: new Date().toISOString(),
      };

      onSuccess(user);
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    mode,
    values,
    errors,
    formError,
    submitting,
    attempt,
    setField,
    switchMode,
    submit,
  };
}

export type AuthFormState = ReturnType<typeof useAuthForm>;
