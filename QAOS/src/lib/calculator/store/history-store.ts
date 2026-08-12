import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { SummaryItem, CalculatorCategory } from "@/lib/calculator/types";

export interface HistoryEntry {
  id: string;
  calculatorId: string;
  calculatorSlug: string;
  calculatorName: string;
  category: CalculatorCategory;
  timestamp: number;
  inputs: Record<string, string>;
  summary: SummaryItem[];
  favorite: boolean;
}

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "timestamp" | "favorite">) => void;
  removeEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  updateEntry: (id: string, patch: Partial<HistoryEntry>) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            { ...entry, id: uuidv4(), timestamp: Date.now(), favorite: false },
            ...state.entries,
          ].slice(0, 500),
        })),
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      toggleFavorite: (id) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, favorite: !e.favorite } : e
          ),
        })),
      clearHistory: () => set({ entries: [] }),
      updateEntry: (id, patch) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
    }),
    { name: "qa-calculator-history" }
  )
);
