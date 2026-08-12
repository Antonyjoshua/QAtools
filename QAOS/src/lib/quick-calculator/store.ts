import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AngleUnit } from "./math";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorSettings {
  angleUnit: AngleUnit;
  thousandsSeparator: boolean;
  decimalPrecision: number;
  scientificNotation: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export type CalculatorMode = "basic" | "scientific";

interface QuickCalculatorState {
  isOpen: boolean;
  isPinned: boolean;
  mode: CalculatorMode;
  history: HistoryEntry[];
  settings: CalculatorSettings;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
  togglePinned: () => void;
  setMode: (mode: CalculatorMode) => void;
  addHistoryEntry: (expression: string, result: string) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  updateSettings: (patch: Partial<CalculatorSettings>) => void;
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useQuickCalculatorStore = create<QuickCalculatorState>()(
  persist(
    (set) => ({
      isOpen: false,
      isPinned: false,
      mode: "basic",
      history: [],
      settings: {
        angleUnit: "deg",
        thousandsSeparator: true,
        decimalPrecision: 8,
        scientificNotation: true,
        soundEnabled: true,
        hapticEnabled: true,
      },
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
      togglePinned: () => set((s) => ({ isPinned: !s.isPinned })),
      setMode: (mode) => set({ mode }),
      addHistoryEntry: (expression, result) =>
        set((s) => ({
          history: [{ id: genId(), expression, result, timestamp: Date.now() }, ...s.history].slice(0, 100),
        })),
      removeHistoryEntry: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
    }),
    {
      name: "qaos-quick-calculator",
      partialize: (s) => ({ history: s.history, settings: s.settings, mode: s.mode, isPinned: s.isPinned }),
    }
  )
);
