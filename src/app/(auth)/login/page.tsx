"use client";

import {
  getAuthUser,
  getAccessTokenFromResponse,
  loginUser,
} from "@/lib/auth-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { saveAccessToken } from "@/lib/storage";
import AuthShell, { Field } from "@/features/auth/components/AuthShell";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuthUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    setError("");

    const normalizedEmail = email.trim();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await loginUser({
        email: normalizedEmail,
        password,
      });

      const accessToken = getAccessTokenFromResponse(response);

      if (!accessToken) {
        throw new Error(
          "Login response did not contain an access token. Please check the backend login response.",
        );
      }

      saveAccessToken(accessToken);

      const apiUser = getAuthUser(response);

      if (!apiUser?.id || !apiUser.email) {
        throw new Error(
          "Login succeeded, but the backend did not return the required user details. Please check the login API response.",
        );
      }

      const name = apiUser.name?.trim() || apiUser.email.split("@")[0];

      signIn({
        id: apiUser.id,
        name,
        email: apiUser.email,
        avatarInitials: name
          .split(/\s+/)
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        plan: "free",
        createdAt: new Date().toISOString(),
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to review your spending, budgets, and monthly progress."
      footer={
        <>
          New to LedgerFlow?{" "}
          <Link
            href="/signup"
            className="font-semibold text-accent hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field
          label="Email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />

        <Field
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent py-2.5 font-semibold text-accent-ink transition-colors hover:bg-accent-hover focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
