"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BUG_REGISTRY } from "./registry";

interface BugToggleState {
  overrides: Record<string, boolean>;
  isActive: (bugId: string) => boolean;
  setActive: (bugId: string, active: boolean) => void;
  toggle: (bugId: string) => void;
  resetToDefaults: () => void;
}

function defaultActiveMap(): Record<string, boolean> {
  return Object.fromEntries(BUG_REGISTRY.map((b) => [b.id, b.defaultActive]));
}

export const useBugToggleStore = create<BugToggleState>()(
  persist(
    (set, get) => ({
      overrides: defaultActiveMap(),
      isActive: (bugId) => get().overrides[bugId] ?? true,
      setActive: (bugId, active) =>
        set((s) => ({ overrides: { ...s.overrides, [bugId]: active } })),
      toggle: (bugId) =>
        set((s) => ({
          overrides: { ...s.overrides, [bugId]: !(s.overrides[bugId] ?? true) },
        })),
      resetToDefaults: () => set({ overrides: defaultActiveMap() }),
    }),
    { name: "quangrade-playground-bug-toggles" }
  )
);

/**
 * Non-hook accessor for use inside plain repo/business-logic functions
 * (outside React render) — e.g. Brightbasket's cart/checkout code gating
 * its buggy behavior without needing to be a component.
 */
export function isBugActive(bugId: string): boolean {
  return useBugToggleStore.getState().isActive(bugId);
}
