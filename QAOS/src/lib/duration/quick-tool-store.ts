import { create } from "zustand";

interface QuickDurationState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
}

export const useQuickDurationStore = create<QuickDurationState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
}));
