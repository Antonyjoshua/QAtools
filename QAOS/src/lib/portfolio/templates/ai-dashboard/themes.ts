export interface AiDashboardTheme {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  swatches: [string, string, string, string];
  css: Record<string, string>;
}

export const AI_DASHBOARD_THEMES: AiDashboardTheme[] = [
  {
    id: "midnight-ai",
    name: "Midnight AI",
    emoji: "⚡",
    gradient: "linear-gradient(135deg,#030711 0%,#0d1040 50%,#071526 100%)",
    swatches: ["#030711", "#7c3aed", "#06b6d4", "#a855f7"],
    css: {
      "--bg": "#030711", "--card-bg": "rgba(15,23,42,0.68)", "--card-bg-strong": "rgba(15,23,42,0.92)",
      "--card-border": "rgba(148,163,184,0.08)", "--t1": "#7c3aed", "--t1-rgb": "124,58,237",
      "--t2": "#06b6d4", "--t2-rgb": "6,182,212", "--t3": "#a855f7", "--text": "#f8fafc", "--muted": "#94a3b8",
      "--glow1": "rgba(124,58,237,0.4)", "--glow2": "rgba(6,182,212,0.4)",
    },
  },
  {
    id: "cyber-purple",
    name: "Cyber Purple",
    emoji: "🌌",
    gradient: "linear-gradient(135deg,#0d0118 0%,#1a0535 50%,#0a011a 100%)",
    swatches: ["#0d0118", "#9333ea", "#d946ef", "#c026d3"],
    css: {
      "--bg": "#0d0118", "--card-bg": "rgba(26,5,53,0.68)", "--card-bg-strong": "rgba(26,5,53,0.92)",
      "--card-border": "rgba(147,51,234,0.15)", "--t1": "#9333ea", "--t1-rgb": "147,51,234",
      "--t2": "#d946ef", "--t2-rgb": "217,70,239", "--t3": "#c026d3", "--text": "#faf5ff", "--muted": "#c4b5fd",
      "--glow1": "rgba(147,51,234,0.5)", "--glow2": "rgba(217,70,239,0.4)",
    },
  },
  {
    id: "emerald-matrix",
    name: "Emerald Matrix",
    emoji: "🌿",
    gradient: "linear-gradient(135deg,#000c00 0%,#001a0a 50%,#000800 100%)",
    swatches: ["#000c00", "#10b981", "#00e676", "#34d399"],
    css: {
      "--bg": "#000c00", "--card-bg": "rgba(0,20,8,0.68)", "--card-bg-strong": "rgba(0,20,8,0.92)",
      "--card-border": "rgba(16,185,129,0.15)", "--t1": "#10b981", "--t1-rgb": "16,185,129",
      "--t2": "#00e676", "--t2-rgb": "0,230,118", "--t3": "#34d399", "--text": "#ecfdf5", "--muted": "#6ee7b7",
      "--glow1": "rgba(16,185,129,0.5)", "--glow2": "rgba(0,230,118,0.4)",
    },
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    emoji: "🌅",
    gradient: "linear-gradient(135deg,#0a0814 0%,#1a0a00 50%,#0f0510 100%)",
    swatches: ["#0a0814", "#f97316", "#f59e0b", "#fb923c"],
    css: {
      "--bg": "#0a0814", "--card-bg": "rgba(20,10,5,0.68)", "--card-bg-strong": "rgba(20,10,5,0.92)",
      "--card-border": "rgba(249,115,22,0.15)", "--t1": "#f97316", "--t1-rgb": "249,115,22",
      "--t2": "#f59e0b", "--t2-rgb": "245,158,11", "--t3": "#fb923c", "--text": "#fff7ed", "--muted": "#fed7aa",
      "--glow1": "rgba(249,115,22,0.5)", "--glow2": "rgba(245,158,11,0.4)",
    },
  },
  {
    id: "arctic-white",
    name: "Arctic White",
    emoji: "❄️",
    gradient: "linear-gradient(135deg,#f8fafc 0%,#e0f2fe 50%,#f0f9ff 100%)",
    swatches: ["#f8fafc", "#1d4ed8", "#0ea5e9", "#3b82f6"],
    css: {
      "--bg": "#f0f4f8", "--card-bg": "rgba(255,255,255,0.78)", "--card-bg-strong": "rgba(255,255,255,0.96)",
      "--card-border": "rgba(0,0,0,0.07)", "--t1": "#1d4ed8", "--t1-rgb": "29,78,216",
      "--t2": "#0ea5e9", "--t2-rgb": "14,165,233", "--t3": "#3b82f6", "--text": "#0f172a", "--muted": "#475569",
      "--glow1": "rgba(29,78,216,0.2)", "--glow2": "rgba(14,165,233,0.15)",
    },
  },
  {
    id: "crimson-neon",
    name: "Crimson Neon",
    emoji: "🔴",
    gradient: "linear-gradient(135deg,#080000 0%,#1a0000 50%,#0a0000 100%)",
    swatches: ["#080000", "#dc2626", "#f43f5e", "#ef4444"],
    css: {
      "--bg": "#080000", "--card-bg": "rgba(20,0,0,0.68)", "--card-bg-strong": "rgba(20,0,0,0.92)",
      "--card-border": "rgba(220,38,38,0.15)", "--t1": "#dc2626", "--t1-rgb": "220,38,38",
      "--t2": "#f43f5e", "--t2-rgb": "244,63,94", "--t3": "#ef4444", "--text": "#fff1f2", "--muted": "#fca5a5",
      "--glow1": "rgba(220,38,38,0.5)", "--glow2": "rgba(244,63,94,0.4)",
    },
  },
];

export const DEFAULT_AI_DASHBOARD_THEME = "midnight-ai";

export function getAiDashboardTheme(id: string | undefined): AiDashboardTheme {
  return AI_DASHBOARD_THEMES.find((t) => t.id === id) ?? AI_DASHBOARD_THEMES[0];
}
