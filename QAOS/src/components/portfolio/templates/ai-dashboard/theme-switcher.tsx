"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, X } from "lucide-react";
import { AI_DASHBOARD_THEMES, type AiDashboardTheme } from "@/lib/portfolio/templates/ai-dashboard/themes";

function ThemeCard({ t, active, onSelect }: { t: AiDashboardTheme; active: boolean; onSelect: () => void }) {
  return (
    <motion.button
      onClick={onSelect}
      className="relative w-full overflow-hidden rounded-2xl text-left focus:outline-none"
      style={{ border: active ? "2px solid var(--t1)" : "2px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Switch to ${t.name} theme`}
      aria-pressed={active}
    >
      <div className="relative h-14 w-full" style={{ background: t.gradient }}>
        <span className="absolute bottom-1.5 left-2.5 text-lg leading-none">{t.emoji}</span>
        {active && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "var(--t1)" }}>
            <Check size={11} color="#fff" strokeWidth={3} />
          </motion.div>
        )}
      </div>
      <div className="px-3 py-2.5">
        <div className="mb-2 text-xs leading-tight font-semibold" style={{ color: active ? "var(--t1)" : "rgba(255,255,255,0.85)" }}>
          {t.name}
        </div>
        <div className="flex gap-1">
          {t.swatches.map((c, i) => (
            <div key={i} className="h-4 w-4 shrink-0 rounded-full border border-white/10" style={{ background: c }} />
          ))}
        </div>
      </div>
    </motion.button>
  );
}

export function ThemeSwitcher({ themeId, onSelect }: { themeId: string; onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={panelRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[9990] shadow-2xl"
            style={{
              bottom: "5.5rem",
              right: "5.5rem",
              width: "min(340px, calc(100vw - 2rem))",
              background: "rgba(10,12,28,0.92)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(var(--t1-rgb),0.25)",
              borderRadius: "1.25rem",
              overflow: "hidden",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3.5" style={{ background: "linear-gradient(135deg,rgba(var(--t1-rgb),0.18) 0%,rgba(var(--t2-rgb),0.1) 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "rgba(var(--t1-rgb),0.2)", border: "1px solid rgba(var(--t1-rgb),0.3)" }}>
                  <Palette size={14} style={{ color: "var(--t1)" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Theme Studio</div>
                  <div className="font-mono-jb text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Choose your visual style
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ color: "rgba(255,255,255,0.5)" }} aria-label="Close theme panel">
                <X size={15} />
              </button>
            </div>
            <div className="grid max-h-[420px] grid-cols-2 gap-2.5 overflow-y-auto p-3">
              {AI_DASHBOARD_THEMES.map((t) => (
                <ThemeCard key={t.id} t={t} active={themeId === t.id} onSelect={() => onSelect(t.id)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed z-[9991] flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
        style={{
          bottom: "5rem",
          right: "5rem",
          background: open ? "rgba(30,20,60,0.9)" : "linear-gradient(135deg,var(--t1),var(--t2))",
          border: open ? "1px solid rgba(var(--t1-rgb),0.4)" : "none",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? "Close theme switcher" : "Open theme switcher"}
        aria-expanded={open}
      >
        {open ? <X size={20} color="#e2e8f0" /> : <Palette size={20} color="#fff" />}
      </motion.button>
    </div>
  );
}
