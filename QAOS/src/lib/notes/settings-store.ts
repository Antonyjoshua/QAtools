import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FontSize = "sm" | "md" | "lg" | "xl";
export type FontFamily = "sans" | "serif" | "mono";

interface SettingsState {
  fontSize: FontSize;
  fontFamily: FontFamily;
  autoSave: boolean;
  autoSaveIntervalSec: number;
  sidebarCollapsed: boolean;
  setFontSize: (v: FontSize) => void;
  setFontFamily: (v: FontFamily) => void;
  setAutoSave: (v: boolean) => void;
  setAutoSaveIntervalSec: (v: number) => void;
  setSidebarCollapsed: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: "md",
      fontFamily: "sans",
      autoSave: true,
      autoSaveIntervalSec: 2,
      sidebarCollapsed: false,
      setFontSize: (fontSize) => set({ fontSize }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setAutoSave: (autoSave) => set({ autoSave }),
      setAutoSaveIntervalSec: (autoSaveIntervalSec) => set({ autoSaveIntervalSec }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
    }),
    { name: "qanotes-settings" }
  )
);

export const FONT_SIZE_PX: Record<FontSize, string> = {
  sm: "14px",
  md: "16px",
  lg: "18px",
  xl: "20px",
};

export const FONT_FAMILY_STACK: Record<FontFamily, string> = {
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  serif: "'Georgia', 'Iowan Old Style', 'Palatino Linotype', serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
};
