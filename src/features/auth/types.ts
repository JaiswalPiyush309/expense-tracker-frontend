export type AuthMode = "signin" | "signup";

export type UserPlan = "free" | "pro";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  plan: UserPlan;
  createdAt: string;
}
