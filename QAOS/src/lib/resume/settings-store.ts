import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PageSize, PreviewScheme } from "./types";

interface ResumeSettingsState {
  favoriteTemplateIds: string[];
  recentTemplateIds: string[];
  defaultPageSize: PageSize;
  previewScheme: PreviewScheme;
  lastResumeId: string | null;
  toggleFavoriteTemplate: (id: string) => void;
  isFavoriteTemplate: (id: string) => boolean;
  recordRecentTemplate: (id: string) => void;
  setDefaultPageSize: (size: PageSize) => void;
  setPreviewScheme: (scheme: PreviewScheme) => void;
  setLastResumeId: (id: string | null) => void;
}

export const useResumeSettings = create<ResumeSettingsState>()(
  persist(
    (set, get) => ({
      favoriteTemplateIds: [],
      recentTemplateIds: [],
      defaultPageSize: "a4",
      previewScheme: "light",
      lastResumeId: null,

      toggleFavoriteTemplate: (id) =>
        set((s) => ({
          favoriteTemplateIds: s.favoriteTemplateIds.includes(id)
            ? s.favoriteTemplateIds.filter((f) => f !== id)
            : [...s.favoriteTemplateIds, id],
        })),
      isFavoriteTemplate: (id) => get().favoriteTemplateIds.includes(id),
      recordRecentTemplate: (id) =>
        set((s) => ({ recentTemplateIds: [id, ...s.recentTemplateIds.filter((t) => t !== id)].slice(0, 8) })),
      setDefaultPageSize: (defaultPageSize) => set({ defaultPageSize }),
      setPreviewScheme: (previewScheme) => set({ previewScheme }),
      setLastResumeId: (lastResumeId) => set({ lastResumeId }),
    }),
    { name: "qaos-resume-settings" }
  )
);
