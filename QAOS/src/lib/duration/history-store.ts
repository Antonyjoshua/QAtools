import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CalculationEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

interface HistoryState {
  history: CalculationEntry[];
  pushEntry: (entry: Omit<CalculationEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useDurationHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      pushEntry: (entry) =>
        set((state) => ({
          history: [{ ...entry, id: genId(), timestamp: Date.now() }, ...state.history].slice(0, 5),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: "quangrade-duration-history" }
  )
);
