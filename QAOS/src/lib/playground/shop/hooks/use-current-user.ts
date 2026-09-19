"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { useSessionStore } from "../session-store";

export function useCurrentUser() {
  const currentUserId = useSessionStore((s) => s.currentUserId);
  const user = useLiveQuery(
    () => (currentUserId ? db.users.get(currentUserId) : undefined),
    [currentUserId]
  );
  return { user, isLoggedIn: !!currentUserId };
}
