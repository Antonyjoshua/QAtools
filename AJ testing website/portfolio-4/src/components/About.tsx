'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '@/lib/data';

const panels = [
  { icon: '⚡', title: 'Experience', value: '3+', sub: 'Years of QA', color: '#00d4ff' },
  { icon: '🐛', title: 'Defects', value: '2500+', sub: 'Bugs Reported', color: '#a855f7' },
  { icon: '🚀', title: 'Projects', value: '9+', sub: 'Delivered', color: '#00ff88' },
  { icon: '🌐', title: 'Domains', value: '8', sub: 'Industries', color: '#ff2d78' },
];

const abilities = [
  { icon: '🧪', label: 'Automation Engineering' },
  { icon: '🤖', label: 'AI-Driven Testing' },
  { icon: '🔍', label: 'Precision Bug Analysis' },
  { icon: '📱', label: 'Cross-Platform Testing' },
  { icon: '🛠️', label: 'Developer Tooling' },
  { icon: '🚀', label: 'Future-Ready QA' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const card = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="about" ref={ref}
             className="relative py-32 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #050514, #08021a, #050514)' }}>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">// 001 — About The Engineer</p>
          <h2 className="section-title text-white">
            AI Control<br />
            <span className="gradient-text">Room</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — Bio + abilities */}
          <motion.div variants={{ hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } } }}
                      initial="hidden" animate={inView ? 'show' : 'hidden'}>

            {/* Holographic avatar */}
            <div className="relative w-fit mb-10">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Rotating ring */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 rounded-full"
                            style={{ background: 'conic-gradient(from 0deg, #00d4ff, #7c3aed, #00d4ff)', padding: 2 }}>
                  <div className="w-full h-full rounded-full" style={{ background: '#080821' }} />
                </motion.div>
                {/* Inner ring */}
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-3 rounded-full border border-dashed border-cyan-400/30" />
                {/* Avatar */}
                <div className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center hologram"
                     style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))' }}>
                  <span className="text-5xl">👨‍💻</span>
                </div>
                {/* Scan line */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <motion.div className="absolute left-0 right-0 h-px opacity-50"
                               style={{ background: 'linear-gradient(90deg,transparent,#00d4ff,transparent)' }}
                               animate={{ top: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                </div>
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap
                              px-3 py-1 rounded-full text-xs font-mono text-cyan-400
                              border border-cyan-400/40 bg-cyan-400/5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />
                ONLINE · CHENNAI, IN
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed mb-4">
              I'm a <span className="text-cyan-400 font-semibold">Quality Analyst</span> with 3+ years of experience
              delivering defect-free software. With hands-on experience across web, mobile (iOS/Android), VR, and AI
              platforms, I've worked in EdTech, healthcare, finance, entertainment, and e-commerce.
            </p>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              From validating cutting-edge EEG hardware integrations to testing RAG and ML models, I bring thoroughness
              and technical curiosity — having identified <span className="text-cyan-400 font-semibold">2500+ defects</span> across
              UI, functional, API, integration, streaming, and production-impacting issues.
            </p>

            {/* Abilities grid */}
            <div className="grid grid-cols-2 gap-3">
              {abilities.map((a, i) => (
                <motion.div key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.4 + i * 0.08 }}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/5 bg-white/2
                                       hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all cursor-default">
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-sm text-slate-300 font-medium">{a.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Control panels */}
          <motion.div className="grid grid-cols-2 gap-4"
                      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
                      initial="hidden" animate={inView ? 'show' : 'hidden'}>

            {panels.map((p, i) => (
              <motion.div key={i} variants={card}
                          className="relative p-5 rounded-2xl glass-strong overflow-hidden group cursor-default
                                     hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 left-0 right-0 h-px"
                     style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />
                <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-10 pointer-events-none"
                     style={{ background: p.color, filter: 'blur(20px)', transform: 'translate(30%, 30%)' }} />
                <span className="text-2xl mb-3 block">{p.icon}</span>
                <div className="text-3xl font-black mb-1" style={{ fontFamily: 'Exo 2', color: p.color }}>
                  {p.value}
                </div>
                <div className="text-xs font-bold text-white tracking-wider mb-0.5">{p.title}</div>
                <div className="text-xs text-slate-400 font-mono">{p.sub}</div>
              </motion.div>
            ))}

            {/* Education panel */}
            <motion.div variants={card}
                        className="col-span-2 p-5 rounded-2xl glass-strong relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }} />
              <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-3">🎓 Education</div>
              <div className="flex flex-col sm:flex-row gap-4">
                {[
                  { deg: 'MCA', inst: 'Madras University', note: 'Pursuing' },
                  { deg: 'BCA', inst: 'Jaya College', note: '85%' },
                ].map((e, i) => (
                  <div key={i} className="flex-1 p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="font-black text-white" style={{ fontFamily: 'Exo 2' }}>{e.deg}</div>
                    <div className="text-sm text-slate-300">{e.inst}</div>
                    <div className="text-xs text-cyan-400 font-mono mt-0.5">{e.note}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Current role panel */}
            <motion.div variants={card}
                        className="col-span-2 p-5 rounded-2xl glass-strong relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }} />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">💼 Current Mission</div>
                  <div className="font-black text-white text-lg" style={{ fontFamily: 'Exo 2' }}>Quality Analyst</div>
                  <div className="text-sm text-slate-300">Scope Thinkers · Dec 2025–Present</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
