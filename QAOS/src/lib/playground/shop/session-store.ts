"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";

interface SessionState {
  currentUserId: string | null;
  /** Retained across logout so BUG-003 can reproduce "logout doesn't clear the cart". */
  lastUserId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      currentUserId: null,
      lastUserId: null,
      login: (userId) => set({ currentUserId: userId, lastUserId: userId }),
      logout: () => set({ currentUserId: null }),
    }),
    { name: "quangrade-playground-shop-session" }
  )
);

/**
 * The user id the cart should actually be scoped to. Correct behavior: only
 * ever the logged-in user (null when logged out). When BUG-003 is active,
 * falls back to the previous session's user id after logout — reproducing a
 * stale local cart that leaks into the next browsing session.
 */
export function getEffectiveCartUserId(): string | null {
  const { currentUserId, lastUserId } = useSessionStore.getState();
  if (currentUserId) return currentUserId;
  return isBugActive("BUG-003") ? lastUserId : null;
}
