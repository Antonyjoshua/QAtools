import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuickDurationState {
  isOpen: boolean;
  isPinned: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
  togglePinned: () => void;
}

export const useQuickDurationStore = create<QuickDurationState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isPinned: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggleOpen: () => (get().isOpen ? get().close() : get().open()),
      togglePinned: () => set((s) => ({ isPinned: !s.isPinned })),
    }),
    {
      name: "qaos-quick-duration",
      partialize: (s) => ({ isPinned: s.isPinned }),
    }
  )
);
