import { create } from "zustand";
import { persist } from "zustand/middleware";

// Live MediaStream/MediaRecorder instances are NOT serializable and don't belong in zustand
// state — the component that owns a capture in progress holds those itself (in a ref/module
// scope). This store only tracks simple, UI-relevant chrome: popup open/pin state, and just
// enough of the recording phase for the toolbar trigger to show a "recording…" indicator even
// while the popup itself is closed (mirrors Quick Timer's always-visible "running" dot).
export type CapturePhase = "idle" | "recording";

interface QuickCaptureState {
  isOpen: boolean;
  isPinned: boolean;
  phase: CapturePhase;
  elapsedMs: number;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
  togglePinned: () => void;
  setPhase: (phase: CapturePhase) => void;
  setElapsedMs: (elapsedMs: number) => void;
}

export const useQuickCaptureStore = create<QuickCaptureState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isPinned: false,
      phase: "idle",
      elapsedMs: 0,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggleOpen: () => (get().isOpen ? get().close() : get().open()),
      togglePinned: () => set((s) => ({ isPinned: !s.isPinned })),
      setPhase: (phase) => set({ phase }),
      setElapsedMs: (elapsedMs) => set({ elapsedMs }),
    }),
    {
      name: "qaos-quick-capture",
      partialize: (s) => ({ isPinned: s.isPinned }),
    }
  )
);
