'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { aiLabItems } from '@/lib/data';

const statusConfig = {
  active:   { label: 'Live Experiment', color: '#4ade80', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  dot: '#4ade80' },
  progress: { label: 'In Progress',     color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.25)',  dot: '#06b6d4' },
  research: { label: 'Research',        color: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)', dot: '#a855f7' },
} as const;

export default function AILab() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="ai-lab" className="section-pad relative overflow-hidden" ref={ref}>
      {/* Blueprint grid bg */}
      <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Scan line animation */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none animate-scan opacity-20"
        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-3 text-cyan">
            Experiments & Research
          </p>
          <h2
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            The{' '}
            <span className="gradient-text">AI Lab</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Where QA engineering meets artificial intelligence. Experiments that will define
            the future of software quality.
          </p>
        </motion.div>

        {/* Lab status bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center gap-6 mb-16 font-mono text-xs"
        >
          <div className="h-px flex-1 max-w-32" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4))' }} />
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-light animate-pulse" />
            <span className="text-violet-light tracking-widest">LAB STATUS: ACTIVE</span>
          </div>
          <div className="h-px flex-1 max-w-32" style={{ background: 'linear-gradient(90deg, rgba(6,182,212,0.4), transparent)' }} />
        </motion.div>

        {/* Experiment cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiLabItems.map((item, i) => {
            const s = statusConfig[item.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="relative rounded-2xl p-6 overflow-hidden group"
                style={{
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid rgba(124,58,237,0.12)',
                  backdropFilter: 'blur(20px)',
                }}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(124,58,237,0.35)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 30px rgba(124,58,237,0.1)',
                }}
              >
                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at top right, ${s.color}, transparent)`,
                  }}
                />

                {/* Holographic border top */}
                <div
                  className="absolute top-0 left-6 right-6 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
                />

                {/* Status badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5"
                    style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: s.dot }}
                    />
                    {s.label}
                  </span>
                  <span className="text-2xl">{item.icon}</span>
                </div>

                <h3 className="font-display font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>

                {/* Bottom bar */}
                <motion.div
                  className="mt-5 flex items-center gap-2 text-xs font-mono text-slate-600 group-hover:text-slate-400 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <span>Explore experiment</span>
                  <span>→</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-600 font-mono text-xs tracking-widest uppercase mt-16"
        >
          // The future of QA is autonomous, intelligent, and always learning
        </motion.p>
      </div>
    </section>
  );
}
