import { create } from "zustand";

interface QuickConvertState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
}

export const useQuickConvertStore = create<QuickConvertState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
}));
