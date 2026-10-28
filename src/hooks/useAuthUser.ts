"use client";

import { UserProfile } from "@/features/auth/types";
import { getStoredUser, saveStoredUser } from "@/lib/storage";
import { useCallback, useEffect, useState } from "react";

export function useAuthUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setUser(getStoredUser());
    } catch (error) {
      console.error("Unable to restore the stored user.", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback((nextUser: UserProfile) => {
    saveStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    saveStoredUser(null);
    setUser(null);
  }, []);

  return {
    user,
    signIn,
    signOut,
    isLoading,
    isAuthenticated: user !== null,
  };
}
