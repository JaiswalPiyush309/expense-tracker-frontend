"use client";

import { useRouter } from "next/navigation";
import { HomeHeader } from "./components/HomeHeader";
import { AuthMode } from "../auth/types";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HighlightsSection } from "./sections/HighlightsSection";

export interface HomePageProps {
  onOpenApp: () => void;
  onOpenAuth: (mode?: AuthMode) => void;
  userEmail?: string | null;
}

export default function HomePage({
  onOpenApp,
  onOpenAuth,
  userEmail = null,
}: HomePageProps) {
  return (
    <div
      id="top"
      className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-slate-800"
    >
      <HomeHeader
        userEmail={userEmail}
        onOpenApp={onOpenApp}
        onOpenAuth={onOpenAuth}
      />

      <main className="flex-1">
        <HeroSection onOpenApp={onOpenApp} onOpenAuth={onOpenAuth} />

        <FeaturesSection />

        <HighlightsSection />
      </main>
    </div>
  );
}
