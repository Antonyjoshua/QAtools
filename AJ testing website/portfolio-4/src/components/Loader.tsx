'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lines = [
  '> Initializing AI Core...',
  '> Loading Test Matrix...',
  '> Calibrating Bug Detectors...',
  '> Connecting Neural Interface...',
  '> System Ready.',
];

interface LoaderProps { onComplete: () => void; }

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [lineIdx, setLineIdx]   = useState(0);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2.2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setLineIdx(i => Math.min(i + 1, lines.length - 1));
    }, 580);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => { setDone(true); setTimeout(onComplete, 600); }, 300);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader-bg"
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Grid */}
          <div className="loader-circuit" />

          {/* Corner decorations */}
          {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8`}>
              <div className="w-4 h-px bg-cyan absolute top-0 left-0" />
              <div className="h-4 w-px bg-cyan absolute top-0 left-0" />
              <div className="w-4 h-px bg-cyan absolute bottom-0 right-0" />
              <div className="h-4 w-px bg-cyan absolute bottom-0 right-0" />
            </div>
          ))}

          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md px-8">

            {/* Hex logo */}
            <motion.div
              className="relative flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <svg width="80" height="80" viewBox="0 0 80 80">
                <polygon points="40,4 72,22 72,58 40,76 8,58 8,22"
                  fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.6" />
                <polygon points="40,14 62,27 62,53 40,66 18,53 18,27"
                  fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
              </svg>
              <span className="absolute font-display font-black text-xl text-cyan"
                    style={{ fontFamily: 'Exo 2' }}>AJ</span>
            </motion.div>

            {/* Title */}
            <div className="text-center">
              <p className="font-mono text-xs tracking-widest text-cyan mb-2">SYSTEM BOOT</p>
              <h1 className="text-2xl font-black tracking-widest text-white"
                  style={{ fontFamily: 'Exo 2' }}>ANTONY JOSHUA S</h1>
            </div>

            {/* Terminal lines */}
            <div className="w-full bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xs space-y-1 min-h-[100px]">
              {lines.slice(0, lineIdx + 1).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={i === lineIdx ? 'text-cyan' : 'text-green-400/60'}
                >
                  {line}
                  {i === lineIdx && <span className="terminal-cursor" />}
                </motion.p>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between font-mono text-xs text-muted mb-2">
                <span>LOADING PORTFOLIO</span>
                <span className="text-cyan">{Math.floor(Math.min(progress, 100))}%</span>
              </div>
              <div className="w-full h-px bg-white/10 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7c3aed, #00d4ff)', boxShadow: '0 0 12px #00d4ff' }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </div>

          {/* Scan line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute left-0 right-0 h-px opacity-30"
              style={{ background: 'linear-gradient(90deg,transparent,#00d4ff,transparent)' }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
