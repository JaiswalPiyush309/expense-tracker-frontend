"use client";

import { AuthFormState } from "@/hooks/useAuthForm";
import { useEffect, useRef } from "react";
import { TextField } from "./TextField";
import { Mail, User } from "lucide-react";
import { PasswordField } from "./PasswordField";
import { MIN_PASSWORD } from "@/lib/auth-validation";
import { Button } from "@/components/common/Button";

export const AuthForm = ({ form }: { form: AuthFormState }) => {
  const {
    mode,
    values,
    errors,
    formError,
    submitting,
    attempt,
    setField,
    submit,
  } = form;

  const ref = useRef<HTMLFormElement>(null);
  const isSignup = mode === "signup";

  // Focus the first invalid field after failed validation.
  useEffect(() => {
    if (attempt > 0) {
      ref.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [attempt]);

  return (
    <form
      ref={ref}
      onSubmit={submit}
      noValidate
      aria-busy={submitting}
      className="space-y-4"
    >
      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {formError}
        </div>
      )}

      {isSignup && (
        <TextField
          label="Full name"
          icon={User}
          autoComplete="name"
          placeholder="Priya Sharma"
          value={values.name}
          onChange={setField("name")}
          error={errors.name}
          disabled={submitting}
        />
      )}

      <TextField
        label="Email address"
        icon={Mail}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={values.email}
        onChange={setField("email")}
        error={errors.email}
        disabled={submitting}
      />

      <PasswordField
        label="Password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        placeholder="••••••••"
        hint={isSignup ? `At least ${MIN_PASSWORD} characters` : undefined}
        value={values.password}
        onChange={setField("password")}
        error={errors.password}
        disabled={submitting}
      />

      {isSignup && (
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirm}
          onChange={setField("confirm")}
          error={errors.confirm}
          disabled={submitting}
        />
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 disabled:opacity-60"
      >
        {submitting
          ? "Please wait…"
          : isSignup
            ? "Create free account"
            : "Sign in"}
      </Button>
    </form>
  );
};
