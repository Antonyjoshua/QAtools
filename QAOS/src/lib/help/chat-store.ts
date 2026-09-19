import { create } from "zustand";

interface HelpChatState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
}

export const useHelpChatStore = create<HelpChatState>((set, get) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleOpen: () => (get().isOpen ? get().close() : get().open()),
}));
