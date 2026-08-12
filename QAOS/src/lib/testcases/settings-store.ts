import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole, TestCaseView } from "./types";

interface TestManagementSettingsState {
  currentUser: string;
  currentRole: UserRole;
  teamMembers: string[];
  defaultView: TestCaseView;
  lastProjectId: string | null;
  setCurrentUser: (v: string) => void;
  setCurrentRole: (v: UserRole) => void;
  addTeamMember: (name: string) => void;
  setDefaultView: (v: TestCaseView) => void;
  setLastProjectId: (id: string | null) => void;
}

export const useTestManagementSettings = create<TestManagementSettingsState>()(
  persist(
    (set, get) => ({
      currentUser: "You",
      currentRole: "QA Engineer",
      teamMembers: ["You"],
      defaultView: "table",
      lastProjectId: null,
      setCurrentUser: (currentUser) =>
        set((s) => ({
          currentUser,
          teamMembers: s.teamMembers.includes(currentUser) ? s.teamMembers : [...s.teamMembers, currentUser],
        })),
      setCurrentRole: (currentRole) => set({ currentRole }),
      addTeamMember: (name) => {
        if (!name.trim() || get().teamMembers.includes(name)) return;
        set((s) => ({ teamMembers: [...s.teamMembers, name] }));
      },
      setDefaultView: (defaultView) => set({ defaultView }),
      setLastProjectId: (lastProjectId) => set({ lastProjectId }),
    }),
    { name: "qaos-testcases-settings" }
  )
);
