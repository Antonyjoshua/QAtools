import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favoriteTemplateIds: string[];
  toggleFavoriteTemplate: (id: string) => void;
  isFavoriteTemplate: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteTemplateIds: [],
      toggleFavoriteTemplate: (id) =>
        set((state) => ({
          favoriteTemplateIds: state.favoriteTemplateIds.includes(id)
            ? state.favoriteTemplateIds.filter((t) => t !== id)
            : [...state.favoriteTemplateIds, id],
        })),
      isFavoriteTemplate: (id) => get().favoriteTemplateIds.includes(id),
    }),
    { name: "bugforge-favorites" }
  )
);
