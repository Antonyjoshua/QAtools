'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '@/lib/data';

const categories = ['Automation', 'AI Testing', 'Testing', 'Programming', 'Tools', 'CI/CD'];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const grouped = categories.map(cat => ({
    cat,
    items: skills.filter(s => s.category === cat),
  })).filter(g => g.items.length > 0);

  return (
    <section id="skills" ref={ref}
             className="relative py-32 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #050514, #06011a, #050514)' }}>

      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
           style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)', filter: 'blur(80px)', transform: 'translateY(-50%)' }} />
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
           style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(80px)', transform: 'translateY(-50%)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">// 004 — Arsenal</p>
          <h2 className="section-title text-white">
            Tech<br /><span className="gradient-text">Mastery</span>
          </h2>
        </motion.div>

        {/* All skills radar display */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {skills.map((sk, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative p-4 rounded-2xl glass hover:glass-strong transition-all duration-300 overflow-hidden cursor-default">

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: `radial-gradient(circle at left center, ${sk.color}0a, transparent 60%)` }} />

              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Orb */}
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2.5 + i * 0.2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: sk.color, filter: 'blur(6px)' }}
                    />
                    <div className="relative w-4 h-4 rounded-full" style={{ background: sk.color }} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm" style={{ fontFamily: 'Exo 2' }}>{sk.name}</span>
                    <div className="text-xs font-mono text-slate-500">{sk.category}</div>
                  </div>
                </div>
                <span className="font-black text-lg" style={{ fontFamily: 'Exo 2', color: sk.color }}>{sk.level}%</span>
              </div>

              {/* Bar */}
              <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${sk.color}80, ${sk.color})` }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${sk.level}%` } : {}}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Glow tip */}
                <motion.div
                  className="absolute top-0 h-full w-4 rounded-full"
                  style={{ background: sk.color, filter: 'blur(4px)', boxShadow: `0 0 8px ${sk.color}` }}
                  initial={{ left: 0 }}
                  animate={inView ? { left: `calc(${sk.level}% - 8px)` } : {}}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category pills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap gap-3 justify-center">
          {grouped.map(({ cat, items }) => (
            <div key={cat}
                 className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/5">
              <span className="w-2 h-2 rounded-full"
                    style={{ background: items[0].color, boxShadow: `0 0 6px ${items[0].color}` }} />
              <span className="text-sm font-mono text-slate-300">{cat}</span>
              <span className="text-xs font-mono text-slate-500">({items.length})</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
