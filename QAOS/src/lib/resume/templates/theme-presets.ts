import type { ResumeTheme } from "../types";

const BASE_THEME: ResumeTheme = {
  headingFont: "Arial, Helvetica, sans-serif",
  bodyFont: "Arial, Helvetica, sans-serif",
  fontSize: 13,
  fontWeight: 400,
  primaryColor: "#1e293b",
  accentColor: "#2563eb",
  textColor: "#1f2937",
  mutedColor: "#6b7280",
  backgroundColor: "#ffffff",
  sectionSpacing: 18,
  pageMargin: 36,
  dividers: true,
  borders: false,
  alignment: "left",
};

export function buildTheme(overrides: Partial<ResumeTheme>): ResumeTheme {
  return { ...BASE_THEME, ...overrides };
}

// Web-safe / ATS-safe font stacks. Font choice never affects ATS text-parsing (parsers read
// the underlying text, not glyphs) — these are purely a visual pairing per category.
export const FONT_STACKS = {
  arial: "Arial, Helvetica, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
  segoe: "'Segoe UI', Roboto, sans-serif",
  calibri: "Calibri, 'Segoe UI', sans-serif",
  trebuchet: "'Trebuchet MS', sans-serif",
  verdana: "Verdana, Geneva, sans-serif",
  // Already loaded app-wide via next/font for the QuanGrade wordmark — real availability, not just a fallback name.
  plexMono: "var(--font-plex-mono), ui-monospace, 'Courier New', monospace",
};
