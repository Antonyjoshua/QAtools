import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "./types";

interface SettingsState {
  currentUser: string;
  currentRole: UserRole;
  autoSave: boolean;
  setCurrentUser: (v: string) => void;
  setCurrentRole: (v: UserRole) => void;
  setAutoSave: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currentUser: "You",
      currentRole: "QA Engineer",
      autoSave: true,
      setCurrentUser: (currentUser) => set({ currentUser }),
      setCurrentRole: (currentRole) => set({ currentRole }),
      setAutoSave: (autoSave) => set({ autoSave }),
    }),
    { name: "bugforge-settings" }
  )
);
