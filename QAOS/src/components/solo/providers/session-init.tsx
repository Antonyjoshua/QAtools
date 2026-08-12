"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useHydrated } from "@/lib/solo/hooks/useHydrated";

/** Fires the once-per-day login XP + quest period rollover after the persisted store rehydrates. */
export function SessionInit() {
  const hydrated = useHydrated();
  const recordLogin = useAppStore((s) => s.recordLogin);

  useEffect(() => {
    if (hydrated) recordLogin();
  }, [hydrated, recordLogin]);

  return null;
}
