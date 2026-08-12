import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OptionValues } from "./types";

export interface HistoryEntry {
  id: string;
  slug: string;
  generatorName: string;
  count: number;
  options: OptionValues;
  timestamp: number;
}

export interface SavedTemplate {
  id: string;
  name: string;
  slug: string;
  generatorName: string;
  count: number;
  options: OptionValues;
  createdAt: number;
}

interface AppState {
  favorites: string[];
  history: HistoryEntry[];
  templates: SavedTemplate[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  pushHistory: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
  saveTemplate: (template: Omit<SavedTemplate, "id" | "createdAt">) => void;
  deleteTemplate: (id: string) => void;
}

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],
      templates: [],
      toggleFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.includes(slug)
            ? state.favorites.filter((s) => s !== slug)
            : [...state.favorites, slug],
        })),
      isFavorite: (slug) => get().favorites.includes(slug),
      pushHistory: (entry) =>
        set((state) => ({
          history: [{ ...entry, id: genId(), timestamp: Date.now() }, ...state.history].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),
      saveTemplate: (template) =>
        set((state) => ({
          templates: [{ ...template, id: genId(), createdAt: Date.now() }, ...state.templates],
        })),
      deleteTemplate: (id) => set((state) => ({ templates: state.templates.filter((t) => t.id !== id) })),
    }),
    { name: "testdatahub-store" }
  )
);
