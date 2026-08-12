import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimezoneTab, FavoriteTimezone, ConversionHistoryEntry, TimezoneSettings, MeetingLocation } from "./types";

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface QuickTimezoneState {
  // Popup chrome
  isOpen: boolean;
  isPinned: boolean;
  activeTab: TimezoneTab;

  // Converter — null zones mean "not yet customized, fall back to the detected browser timezone"
  sourceZoneId: string | null;
  targetZoneId: string | null;
  converterDate: string; // "yyyy-mm-dd"
  converterTime: string; // "HH:mm"

  favorites: FavoriteTimezone[];
  history: ConversionHistoryEntry[];
  settings: TimezoneSettings;
  meetingLocations: MeetingLocation[];
  workingHoursStart: number; // 0-23
  workingHoursEnd: number; // 1-24

  open: () => void;
  close: () => void;
  toggleOpen: () => void;
  togglePinned: () => void;
  setActiveTab: (tab: TimezoneTab) => void;

  setSourceZone: (id: string) => void;
  setTargetZone: (id: string) => void;
  setConverterDate: (date: string) => void;
  setConverterTime: (time: string) => void;
  swapZones: () => void;

  addFavorite: (timezoneId: string) => void;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, name: string | null) => void;
  reorderFavorites: (orderedIds: string[]) => void;
  isFavorite: (timezoneId: string) => boolean;

  addHistoryEntry: (sourceZoneId: string, targetZoneId: string, sourceDateISO: string, resultUtcMs: number) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;

  updateSettings: (patch: Partial<TimezoneSettings>) => void;

  setMeetingLocation: (index: number, timezoneId: string | null) => void;
  addMeetingLocation: () => void;
  removeMeetingLocation: (id: string) => void;
  setWorkingHours: (start: number, end: number) => void;
}

export const useQuickTimezoneStore = create<QuickTimezoneState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isPinned: false,
      activeTab: "converter",

      sourceZoneId: null,
      targetZoneId: null,
      converterDate: new Date().toISOString().slice(0, 10),
      converterTime: `${String(new Date().getHours()).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`,

      favorites: [],
      history: [],
      settings: {
        use24Hour: false,
        dateFormat: "dmy",
        firstDayOfWeek: 1,
        defaultTimezoneId: null,
        autoDetectLocation: true,
      },
      meetingLocations: [],
      workingHoursStart: 9,
      workingHoursEnd: 17,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggleOpen: () => (get().isOpen ? get().close() : get().open()),
      togglePinned: () => set((s) => ({ isPinned: !s.isPinned })),
      setActiveTab: (activeTab) => set({ activeTab }),

      setSourceZone: (sourceZoneId) => set({ sourceZoneId }),
      setTargetZone: (targetZoneId) => set({ targetZoneId }),
      setConverterDate: (converterDate) => set({ converterDate }),
      setConverterTime: (converterTime) => set({ converterTime }),
      swapZones: () =>
        set((s) => ({
          sourceZoneId: s.targetZoneId ?? s.sourceZoneId,
          targetZoneId: s.sourceZoneId ?? s.targetZoneId,
        })),

      addFavorite: (timezoneId) =>
        set((s) => {
          if (s.favorites.some((f) => f.timezoneId === timezoneId)) return s;
          return { favorites: [...s.favorites, { id: genId(), timezoneId, customName: null, order: s.favorites.length }] };
        }),
      removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),
      renameFavorite: (id, name) => set((s) => ({ favorites: s.favorites.map((f) => (f.id === id ? { ...f, customName: name } : f)) })),
      reorderFavorites: (orderedIds) =>
        set((s) => {
          const byId = new Map(s.favorites.map((f) => [f.id, f]));
          const reordered = orderedIds.map((id, index) => {
            const fav = byId.get(id);
            return fav ? { ...fav, order: index } : null;
          });
          return { favorites: reordered.filter((f): f is FavoriteTimezone => f !== null) };
        }),
      isFavorite: (timezoneId) => get().favorites.some((f) => f.timezoneId === timezoneId),

      addHistoryEntry: (sourceZoneId, targetZoneId, sourceDateISO, resultUtcMs) =>
        set((s) => ({
          history: [{ id: genId(), sourceZoneId, targetZoneId, sourceDateISO, resultUtcMs, createdAt: Date.now() }, ...s.history].slice(0, 100),
        })),
      removeHistoryEntry: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      setMeetingLocation: (index, timezoneId) =>
        set((s) => {
          const next = [...s.meetingLocations];
          if (timezoneId === null) {
            next.splice(index, 1);
          } else if (next[index]) {
            next[index] = { ...next[index], timezoneId };
          } else {
            next[index] = { id: genId(), timezoneId };
          }
          return { meetingLocations: next };
        }),
      addMeetingLocation: () =>
        set((s) => (s.meetingLocations.length >= 3 ? s : { meetingLocations: [...s.meetingLocations, { id: genId(), timezoneId: "UTC" }] })),
      removeMeetingLocation: (id) => set((s) => ({ meetingLocations: s.meetingLocations.filter((l) => l.id !== id) })),
      setWorkingHours: (workingHoursStart, workingHoursEnd) => set({ workingHoursStart, workingHoursEnd }),
    }),
    {
      name: "qaos-quick-timezone",
      partialize: (s) => ({
        isPinned: s.isPinned,
        activeTab: s.activeTab,
        sourceZoneId: s.sourceZoneId,
        targetZoneId: s.targetZoneId,
        converterDate: s.converterDate,
        converterTime: s.converterTime,
        favorites: s.favorites,
        history: s.history,
        settings: s.settings,
        meetingLocations: s.meetingLocations,
        workingHoursStart: s.workingHoursStart,
        workingHoursEnd: s.workingHoursEnd,
      }),
    }
  )
);
