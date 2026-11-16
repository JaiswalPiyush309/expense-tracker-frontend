"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { getAccessToken } from "@/lib/storage";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthUser();

  useEffect(() => {
    if (!isLoading && (!user || !getAccessToken())) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user || !getAccessToken()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400" role="status">
        Checking your session…
      </div>
    );
  }

  return <>{children}</>;
}
