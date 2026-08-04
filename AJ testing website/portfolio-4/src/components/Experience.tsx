'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { experience } from '@/lib/data';

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="experience" ref={ref}
             className="relative py-32 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #050514, #0a021f, #050514)' }}>

      {/* Ambient glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
           style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">// 002 — Career</p>
          <h2 className="section-title text-white">
            Mission<br /><span className="gradient-text">Timeline</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, #00d4ff 10%, #7c3aed 50%, #00d4ff 90%, transparent)' }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />

          <div className="flex flex-col gap-8">
            {experience.map((job, i) => (
              <motion.div key={i}
                          initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.7, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                          className={`relative flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-6 pl-14 md:pl-0`}>

                {/* Timeline dot */}
                <div className="absolute left-3.5 md:left-1/2 top-6 w-5 h-5 rounded-full -translate-x-1/2 z-10 flex items-center justify-center"
                     style={{ background: job.color, boxShadow: `0 0 0 4px rgba(5,5,20,1), 0 0 20px ${job.color}` }}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Date (desktop, opposite side) */}
                <div className={`hidden md:flex flex-1 ${i % 2 === 0 ? 'justify-end pr-10' : 'justify-start pl-10'} items-start pt-5`}>
                  <div className="text-right">
                    <div className="font-mono text-xs tracking-widest mb-1" style={{ color: job.color }}>
                      {job.mission}
                    </div>
                    <div className="text-slate-400 text-sm font-mono">{job.period}</div>
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 md:max-w-[calc(50%-2.5rem)]">
                  <div
                    onClick={() => setActive(active === i ? null : i)}
                    className="relative p-6 rounded-2xl glass-strong cursor-pointer group overflow-hidden
                               hover:border-cyan-400/30 transition-all duration-300"
                    style={{ borderTop: `2px solid ${job.color}40` }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-px"
                         style={{ background: `linear-gradient(90deg, transparent, ${job.color}, transparent)` }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                         style={{ background: `radial-gradient(circle at 50% 0%, ${job.color}08, transparent 70%)` }} />

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-mono text-xs tracking-widest mb-1.5 md:hidden" style={{ color: job.color }}>
                          {job.mission} · {job.period}
                        </div>
                        <h3 className="font-black text-white text-lg leading-tight mb-0.5" style={{ fontFamily: 'Exo 2' }}>
                          {job.role}
                        </h3>
                        <p className="text-sm font-semibold" style={{ color: job.color }}>{job.company}</p>
                      </div>
                      <motion.span className="text-slate-400 mt-1"
                                   animate={{ rotate: active === i ? 180 : 0 }}
                                   transition={{ duration: 0.3 }}>▾</motion.span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.tech.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md text-xs font-mono border"
                              style={{ color: job.color, borderColor: `${job.color}30`, background: `${job.color}08` }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Expandable highlights */}
                    <AnimatePresence>
                      {active === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }}
                                    className="overflow-hidden">
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <ul className="space-y-2">
                              {job.highlights.map((h, j) => (
                                <li key={j} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
                                  <span style={{ color: job.color }} className="shrink-0 mt-0.5">›</span>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
