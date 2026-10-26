"use client";

import { useRouter } from "next/navigation";
import { HomeHeader } from "./components/HomeHeader";
import { AuthMode } from "../auth/types";

export default function HomePage() {
  const router = useRouter();

  const handleOpenApp = () => {
    router.push("/dashboard");
  };

  const handleOpenAuth = (mode: AuthMode = "signin") => {
    router.push(mode === "signup" ? "/signup" : "/login");
  };

  return (
    <div>
      <HomeHeader onOpenApp={handleOpenApp} onOpenAuth={handleOpenAuth} />
    </div>
  );
}
