'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CyberBug() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const startRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  // Initialize position bottom-right
  useEffect(() => {
    setPos({ x: window.innerWidth - 100, y: window.innerHeight - 120 });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setHasMoved(false);
    startRef.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startRef.current.mx;
    const dy = e.clientY - startRef.current.my;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setHasMoved(true);
    setPos({ x: startRef.current.ox + dx, y: startRef.current.oy + dy });
  };
  const onPointerUp = () => {
    setDragging(false);
    if (!hasMoved) setOpen(o => !o);
  };

  const tips = [
    '🐛 I\'ve logged 2500+ bugs in production!',
    '🤖 AI testing? That\'s my specialty.',
    '⚡ Playwright automation is my superpower.',
    '🔍 No bug can hide from me.',
    '🚀 VR, mobile, web — tested them all!',
    '🧠 ML model testing is the future.',
  ];
  const [tip] = useState(() => tips[Math.floor(Math.random() * tips.length)]);

  return (
    <>
      {/* Bug Widget */}
      <motion.div
        style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 100, cursor: dragging ? 'grabbing' : 'grab' }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        data-hover
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.4), transparent 70%)', width: '80px', height: '80px', top: '-8px', left: '-8px' }}
        />

        {/* Bug body SVG */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Holographic wings */}
          <motion.ellipse cx="12" cy="22" rx="10" ry="14" animate={{ scaleX: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity }} fill="rgba(0,212,255,0.25)" stroke="#00d4ff" strokeWidth="0.5" />
          <motion.ellipse cx="52" cy="22" rx="10" ry="14" animate={{ scaleX: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }} fill="rgba(124,58,237,0.25)" stroke="#7c3aed" strokeWidth="0.5" />

          {/* Legs */}
          {[[-10, 20], [-14, 28], [-10, 36], [74, 20], [78, 28], [74, 36]].map(([x, y], i) => (
            <motion.line key={i} x1={x < 32 ? 18 : 46} y1={y} x2={x} y2={y + (i % 3 === 1 ? 4 : 0)}
                         stroke={i < 3 ? '#00d4ff' : '#7c3aed'} strokeWidth="1.5" strokeLinecap="round"
                         animate={{ rotate: i % 2 === 0 ? [0, 10, 0] : [0, -10, 0] }}
                         transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />
          ))}

          {/* Body armor */}
          <ellipse cx="32" cy="36" rx="14" ry="16" fill="url(#bodyGrad)" />
          <defs>
            <radialGradient id="bodyGrad" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#1a3a5c" />
              <stop offset="100%" stopColor="#0a0a20" />
            </radialGradient>
          </defs>

          {/* Armor plates */}
          <path d="M 22 30 Q 32 26 42 30 L 42 36 Q 32 40 22 36 Z" fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="0.5" />
          <path d="M 22 36 Q 32 32 42 36 L 40 44 Q 32 48 24 44 Z" fill="rgba(124,58,237,0.15)" stroke="#7c3aed" strokeWidth="0.5" />

          {/* AI energy core */}
          <motion.circle cx="32" cy="37" r="4"
                         animate={{ r: [3.5, 4.5, 3.5], opacity: [0.8, 1, 0.8] }}
                         transition={{ duration: 1.2, repeat: Infinity }}
                         fill="none" stroke="#00ff88" strokeWidth="1.5" />
          <motion.circle cx="32" cy="37" r="2"
                         animate={{ opacity: [0.5, 1, 0.5] }}
                         transition={{ duration: 0.8, repeat: Infinity }}
                         fill="#00ff88" />

          {/* Head */}
          <ellipse cx="32" cy="20" rx="11" ry="9" fill="url(#headGrad)" />
          <defs>
            <radialGradient id="headGrad" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#1e2a4a" />
              <stop offset="100%" stopColor="#050514" />
            </radialGradient>
          </defs>

          {/* Visor */}
          <path d="M 22 18 Q 32 14 42 18 L 40 24 Q 32 28 24 24 Z" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="0.5" />

          {/* Mechanical eyes */}
          <motion.circle cx="26" cy="20" r="3.5"
                         animate={{ r: [3, 4, 3] }}
                         transition={{ duration: 2, repeat: Infinity }}
                         fill="#0a0a20" stroke="#ff2d78" strokeWidth="1" />
          <motion.circle cx="38" cy="20" r="3.5"
                         animate={{ r: [3, 4, 3] }}
                         transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                         fill="#0a0a20" stroke="#00d4ff" strokeWidth="1" />
          {/* Eye pupils */}
          <motion.circle cx="26" cy="20" r="1.5"
                         animate={{ cx: [25, 27, 26], cy: [20, 19, 20] }}
                         transition={{ duration: 3, repeat: Infinity }}
                         fill="#ff2d78" />
          <motion.circle cx="38" cy="20" r="1.5"
                         animate={{ cx: [37, 39, 38], cy: [20, 19, 20] }}
                         transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                         fill="#00d4ff" />

          {/* Antennae */}
          <motion.line x1="28" y1="12" x2="22" y2="4"
                       animate={{ x2: [22, 20, 22] }}
                       transition={{ duration: 1.5, repeat: Infinity }}
                       stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
          <motion.line x1="36" y1="12" x2="42" y2="4"
                       animate={{ x2: [42, 44, 42] }}
                       transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                       stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="22" cy="4" r="2" fill="#00d4ff" />
          <circle cx="42" cy="4" r="2" fill="#7c3aed" />
        </svg>

        {/* Notification dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-[#050514] text-white flex items-center justify-center text-xs font-bold">
          !
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              left: Math.min(pos.x - 160, window.innerWidth - 300),
              top: pos.y - 80,
              zIndex: 101,
              border: '1px solid rgba(0,212,255,0.2)',
            }}
            className="max-w-xs p-4 rounded-2xl glass-strong text-sm text-slate-200 font-medium leading-relaxed">
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }} />
            <div className="font-mono text-xs text-cyan-400 mb-1">CYBER BUG SAYS:</div>
            {tip}
            {/* Arrow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0" style={{ borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid rgba(0,212,255,0.2)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
