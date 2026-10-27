"use client";

import { AuthMode } from "@/features/auth/types";
import HomePage from "@/features/home/HomePage";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleOpenApp = () => {
    router.push("/dashboard");
  };

  const handleOpenAuth = (mode: AuthMode = "signin") => {
    router.push(mode === "signup" ? "/signup" : "/login");
  };

  return <HomePage onOpenApp={handleOpenApp} onOpenAuth={handleOpenAuth} />;
}
