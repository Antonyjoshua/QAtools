"use client";

import { useAppStore } from "@/lib/solo/store/useAppStore";

export function useHydrated() {
  return useAppStore((s) => s.hasHydrated);
}
