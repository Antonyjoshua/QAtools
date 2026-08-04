'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { aiLab } from '@/lib/data';

export default function AILab() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="ailab" ref={ref}
             className="relative py-32 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #050514, #04021a, #050514)' }}>

      {/* Lab ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="max-w-7xl mx-auto px-6">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="mb-6">
          <p className="section-tag">// 006 — R&D</p>
          <h2 className="section-title text-white">
            AI Research<br /><span className="gradient-text">Laboratory</span>
          </h2>
        </motion.div>

        {/* Lab status bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4 mb-16 p-4 rounded-xl border border-cyan-400/15 bg-cyan-400/3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 tracking-widest">LAB ONLINE</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">FACILITY: AI-QA RESEARCH CENTER</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 tracking-widest">CLEARANCE: LEVEL 5</span>
          <span className="text-slate-600 ml-auto hidden sm:block">CHENNAI, INDIA</span>
        </motion.div>

        {/* Lab monitors grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiLab.map((item, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative p-6 rounded-2xl glass-strong overflow-hidden group cursor-default
                                   hover:-translate-y-2 transition-all duration-300"
                        style={{ boxShadow: `0 0 0 1px ${item.color}18` }}>

              {/* Top border gradient */}
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />

              {/* Monitor scanline effect */}
              <div className="scan-container absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <motion.div
                  className="absolute left-0 right-0 h-px opacity-30"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                  animate={{ top: ['-2px', 'calc(100% + 2px)'] }}
                  transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                />
              </div>

              {/* Corner decoration */}
              <div className="absolute top-3 right-3 flex gap-1">
                {[...Array(3)].map((_, j) => (
                  <motion.div key={j} className="w-1 h-1 rounded-full"
                              style={{ background: item.color }}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.2 + i * 0.1 }} />
                ))}
              </div>

              {/* Tag */}
              <div className="mb-4">
                <span className={`px-2 py-0.5 rounded-md text-xs font-mono border ${
                  item.tag === 'Live' ? 'border-green-400/40 text-green-400 bg-green-400/10' :
                  item.tag === 'Research' ? 'border-yellow-400/40 text-yellow-400 bg-yellow-400/10' :
                  'border-blue-400/40 text-blue-400 bg-blue-400/10'
                }`}>
                  {item.tag === 'Live' && '● '}{item.tag}
                </span>
              </div>

              {/* Icon */}
              <div className="relative w-12 h-12 flex items-center justify-center rounded-xl mb-4"
                   style={{ background: `${item.color}12`, border: `1px solid ${item.color}30` }}>
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute inset-0 rounded-xl"
                  style={{ background: item.color, filter: 'blur(8px)' }}
                />
                <span className="relative text-2xl">{item.icon}</span>
              </div>

              <h3 className="font-black text-white text-lg mb-2" style={{ fontFamily: 'Exo 2' }}>{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>

              {/* Bottom data line */}
              <div className="mt-5 pt-4 border-t border-white/5 font-mono text-xs text-slate-600 flex items-center justify-between">
                <span>MODULE_{String(i + 1).padStart(2, '0')}</span>
                <span style={{ color: item.color }}>ACTIVE</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
