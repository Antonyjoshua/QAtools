'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/data';

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="projects" ref={ref}
             className="relative py-32 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #050514, #070220, #050514)' }}>

      <div className="absolute inset-0 pointer-events-none opacity-30"
           style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">// 003 — Portfolio</p>
          <h2 className="section-title text-white">
            Project<br /><span className="gradient-text">Chambers</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {projects.map((p, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}>
              <ProjectCard p={p} i={i} onClick={() => setSelected(i)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      style={{ background: 'rgba(5,5,20,0.85)', backdropFilter: 'blur(20px)' }}
                      onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={e => e.stopPropagation()}
                        className="relative w-full max-w-lg p-8 rounded-3xl glass-strong overflow-hidden">
              {selected !== null && (() => {
                const p = projects[selected];
                return (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-px"
                         style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />
                    <div className="absolute top-0 right-0 bottom-0 w-px"
                         style={{ background: `linear-gradient(to bottom, ${p.color}, transparent)` }} />
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-4xl">{p.icon}</span>
                        <div className="font-black text-white text-2xl mt-2" style={{ fontFamily: 'Exo 2' }}>{p.title}</div>
                        <div className="text-sm font-mono mt-0.5" style={{ color: p.color }}>{p.subtitle}</div>
                      </div>
                      <button onClick={() => setSelected(null)}
                              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all">
                        ✕
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">{p.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.tags.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-mono border"
                              style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}0d` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>{p.company}</span>
                      <span className={`px-2 py-0.5 rounded-full capitalize border text-xs`}
                            style={{ color: p.color, borderColor: `${p.color}50`, background: `${p.color}10` }}>
                        {p.status}
                      </span>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ p, i, onClick }: { p: typeof projects[0]; i: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <div ref={ref} onClick={onClick}
         onMouseMove={onMove} onMouseLeave={onLeave}
         className="relative h-64 rounded-2xl glass-strong overflow-hidden cursor-pointer group tilt-card
                    transition-shadow duration-300 hover:shadow-2xl"
         style={{ boxShadow: `0 0 0 1px ${p.color}20`, '--card-color': p.color } as React.CSSProperties}>

      {/* Gradient bg */}
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${p.gradient}`} />

      {/* Top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }} />

      {/* Shimmer */}
      <div className="card-shimmer" />

      {/* Hover bloom */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: `radial-gradient(circle at var(--mx,50%) var(--my,50%), ${p.color}18, transparent 60%)` }} />

      <div className="relative z-10 p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-auto">
          <span className="text-3xl">{p.icon}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono capitalize border`}
                style={{ color: p.color, borderColor: `${p.color}50`, background: `${p.color}15` }}>
            {p.status}
          </span>
        </div>
        <div>
          <div className="font-black text-white text-base leading-tight mb-0.5" style={{ fontFamily: 'Exo 2' }}>{p.title}</div>
          <div className="text-xs font-mono mb-3" style={{ color: p.color }}>{p.subtitle}</div>
          <div className="flex flex-wrap gap-1">
            {p.tags.slice(0, 3).map(t => (
              <span key={t} className="px-1.5 py-0.5 rounded text-xs font-mono bg-black/30 text-slate-300">{t}</span>
            ))}
            {p.tags.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-black/30 text-slate-500">+{p.tags.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
          View <span style={{ color: p.color }}>›</span>
        </div>
      </div>
    </div>
  );
}
