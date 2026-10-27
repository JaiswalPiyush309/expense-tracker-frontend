"use client";

import { AuthForm } from "@/features/auth/components/AuthForm";
import AuthShell from "@/features/auth/components/AuthShell";
import { PrivacyNote } from "@/features/auth/components/PrivacyNote";
import { useAuthForm } from "@/hooks/useAuthForm";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const form = useAuthForm({
    initialMode: "signup",
    onSuccess: () => {
      router.push("/login?registered=true");
    },
  });

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your spending and make a clearer plan for your money."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm form={form} />
      <PrivacyNote />
    </AuthShell>
  );
}
