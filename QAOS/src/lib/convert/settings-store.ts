import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConvertSettingsState {
  /** Default on. When enabled, converted files are never written to IndexedDB — only
   * lightweight history metadata (name/size/format/date) persists, matching "Your uploaded
   * files are automatically removed after processing." */
  privacyMode: boolean;
  favoritePairs: string[]; // "xlsx:pdf"
  recentPairs: string[]; // capped, most-recent-first

  setPrivacyMode: (v: boolean) => void;
  toggleFavoritePair: (pair: string) => void;
  isFavoritePair: (pair: string) => boolean;
  recordRecentPair: (pair: string) => void;
}

export const useConvertSettings = create<ConvertSettingsState>()(
  persist(
    (set, get) => ({
      privacyMode: true,
      favoritePairs: [],
      recentPairs: [],

      setPrivacyMode: (v) => set({ privacyMode: v }),
      toggleFavoritePair: (pair) =>
        set((s) => ({
          favoritePairs: s.favoritePairs.includes(pair) ? s.favoritePairs.filter((p) => p !== pair) : [...s.favoritePairs, pair],
        })),
      isFavoritePair: (pair) => get().favoritePairs.includes(pair),
      recordRecentPair: (pair) => set((s) => ({ recentPairs: [pair, ...s.recentPairs.filter((p) => p !== pair)].slice(0, 12) })),
    }),
    { name: "qaos-convert-settings" }
  )
);
