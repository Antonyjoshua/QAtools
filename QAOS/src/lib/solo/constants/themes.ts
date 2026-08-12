import type { ThemeDefinition } from "@/lib/solo/types";

export const THEMES: ThemeDefinition[] = [
  {
    id: "cyber-hunter",
    name: "Cyber Hunter",
    description: "Signature cyan neon — the default Hunter interface.",
    unlockLevel: 1,
    colors: { accent: "#22d3ee", accentSoft: "#083344", glow: "rgba(34,211,238,0.45)" },
  },
  {
    id: "dark-neon",
    name: "Dark Neon",
    description: "High-voltage magenta for late-night grind sessions.",
    unlockLevel: 1,
    colors: { accent: "#ec4899", accentSoft: "#3b0764", glow: "rgba(236,72,153,0.45)" },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Distraction-free neutral tones.",
    unlockLevel: 1,
    colors: { accent: "#64748b", accentSoft: "#1e293b", glow: "rgba(100,116,139,0.35)" },
  },
  {
    id: "glass-ui",
    name: "Glass UI",
    description: "Frosted, translucent panels.",
    unlockLevel: 1,
    colors: { accent: "#94a3b8", accentSoft: "#0f172a", glow: "rgba(148,163,184,0.35)" },
  },
  {
    id: "purple-matrix",
    name: "Purple Matrix",
    description: "Unlocked at Level 15 — violet code-rain aesthetic.",
    unlockLevel: 15,
    colors: { accent: "#a855f7", accentSoft: "#2e1065", glow: "rgba(168,85,247,0.45)" },
  },
  {
    id: "blue-tech",
    name: "Blue Tech",
    description: "Unlocked at Level 20 — precision engineering blue.",
    unlockLevel: 20,
    colors: { accent: "#3b82f6", accentSoft: "#172554", glow: "rgba(59,130,246,0.45)" },
  },
  {
    id: "gold-elite",
    name: "Gold Elite",
    description: "Unlocked at Level 40 — reserved for elite Hunters.",
    unlockLevel: 40,
    colors: { accent: "#eab308", accentSoft: "#422006", glow: "rgba(234,179,8,0.45)" },
  },
  {
    id: "solo-hunter",
    name: "Solo Hunter",
    description: "Unlocked at Level 60 — shadow monarch prestige skin.",
    unlockLevel: 60,
    colors: { accent: "#8b5cf6", accentSoft: "#020617", glow: "rgba(139,92,246,0.55)" },
  },
];

export const DEFAULT_THEME_ID = "cyber-hunter";
