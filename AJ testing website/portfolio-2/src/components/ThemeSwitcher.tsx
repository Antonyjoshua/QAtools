'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { themeList, type ThemeConfig } from '@/lib/themes';

function ThemeCard({
  t,
  active,
  onSelect,
}: {
  t: ThemeConfig;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      className="relative rounded-2xl overflow-hidden text-left w-full focus:outline-none"
      style={{
        border: active
          ? `2px solid var(--t1)`
          : '2px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.03)',
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      aria-label={`Switch to ${t.name} theme`}
      aria-pressed={active}
    >
      {/* Gradient preview banner */}
      <div
        className="h-14 w-full relative"
        style={{ background: t.gradient }}
      >
        {/* Emoji */}
        <span className="absolute bottom-1.5 left-2.5 text-lg leading-none">{t.emoji}</span>

        {/* Active check */}
        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: 'var(--t1)' }}
          >
            <Check size={11} color="#fff" strokeWidth={3} />
          </motion.div>
        )}
      </div>

      {/* Card body */}
      <div className="px-3 py-2.5">
        <div
          className="font-semibold text-xs mb-2 leading-tight"
          style={{ color: active ? 'var(--t1)' : 'rgba(255,255,255,0.85)' }}
        >
          {t.name}
        </div>

        {/* Color swatches */}
        <div className="flex gap-1">
          {t.swatches.map((c, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      {/* Active glow ring */}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: '0 0 18px rgba(var(--t1-rgb),0.35) inset' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
}

export default function ThemeSwitcher() {
  const { themeId, setTheme } = useTheme();
  const [open, setOpen]       = useState(false);
  const panelRef              = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div ref={panelRef}>
      {/* Settings panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,  y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[9990] shadow-2xl"
            style={{
              bottom: '5.5rem',
              right: '5.5rem',
              width: 'min(340px, calc(100vw - 2rem))',
              background: 'rgba(10,12,28,0.92)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(var(--t1-rgb),0.25)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{
                background: 'linear-gradient(135deg,rgba(var(--t1-rgb),0.18) 0%,rgba(var(--t2-rgb),0.1) 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(var(--t1-rgb),0.2)', border: '1px solid rgba(var(--t1-rgb),0.3)' }}
                >
                  <Palette size={14} style={{ color: 'var(--t1)' }} />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Theme Studio</div>
                  <div className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Choose your visual style
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                aria-label="Close theme panel"
              >
                <X size={15} />
              </button>
            </div>

            {/* Theme grid */}
            <div className="p-3 grid grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(var(--t1-rgb),0.3) transparent' }}
            >
              {themeList.map((t) => (
                <ThemeCard
                  key={t.id}
                  t={t}
                  active={themeId === t.id}
                  onSelect={() => { setTheme(t.id); }}
                />
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2.5 text-center"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Saved automatically · 6 themes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed z-[9991] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          bottom: '5rem',
          right: '5rem',
          background: open
            ? 'rgba(30,20,60,0.9)'
            : 'linear-gradient(135deg,var(--t1),var(--t2))',
          border: open ? '1px solid rgba(var(--t1-rgb),0.4)' : 'none',
          boxShadow: open ? 'none' : '0 0 28px rgba(var(--t1-rgb),0.45)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? 'Close theme switcher' : 'Open theme switcher'}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{ rotate: 90,    opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={20} color="#e2e8f0" />
            </motion.div>
          ) : (
            <motion.div
              key="palette"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0,  opacity: 1 }}
              exit={{ rotate: -90,  opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Palette size={20} color="#fff" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
