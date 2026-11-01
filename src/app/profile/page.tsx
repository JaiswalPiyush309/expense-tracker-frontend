import { ProfileView } from "@/features/profile/ProfileView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile & Settings" };

export default function ProfilePage() {
  return <ProfileView />;
}
