import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (calculatorId: string) => void;
  isFavorite: (calculatorId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (calculatorId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(calculatorId)
            ? state.favoriteIds.filter((id) => id !== calculatorId)
            : [...state.favoriteIds, calculatorId],
        })),
      isFavorite: (calculatorId) => get().favoriteIds.includes(calculatorId),
    }),
    { name: "qa-calculator-favorites" }
  )
);
