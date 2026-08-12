import { create } from "zustand";

interface QuickJobSearchState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
}

export const useQuickJobSearchStore = create<QuickJobSearchState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
}));
