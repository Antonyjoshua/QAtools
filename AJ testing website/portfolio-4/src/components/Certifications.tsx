'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { certifications } from '@/lib/data';

export default function Certifications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="certifications" ref={ref}
             className="relative py-32 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #050514, #090219, #050514)' }}>

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-8"
           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="mb-20">
          <p className="section-tag">// 005 — Credentials</p>
          <h2 className="section-title text-white">
            Battle<br /><span className="gradient-text">Certified</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {certifications.map((c, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative p-7 rounded-3xl glass-strong overflow-hidden group
                                   hover:-translate-y-1 transition-all duration-300"
                        style={{ boxShadow: `0 0 0 1px ${c.color}20` }}>

              {/* Animated border top */}
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: `linear-gradient(90deg, transparent, ${c.color}, transparent)` }} />

              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{ background: c.color, filter: 'blur(30px)', transform: 'translate(50%, -50%)' }} />

              {/* Shimmer */}
              <div className="card-shimmer" />

              {/* Floating badge */}
              <div className="relative z-10 flex items-start gap-5">
                <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl relative"
                     style={{ background: `${c.color}15`, border: `1px solid ${c.color}40` }}>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: c.color, filter: 'blur(8px)' }}
                  />
                  <span className="relative">{c.badge}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-black text-white text-base leading-snug mb-1" style={{ fontFamily: 'Exo 2' }}>
                    {c.title}
                  </div>
                  <div className="text-sm text-slate-400 mb-3 leading-snug">{c.subtitle}</div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-xs font-mono border"
                            style={{ color: c.color, borderColor: `${c.color}30`, background: `${c.color}08` }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                    <span style={{ color: c.color }}>{c.issuer}</span>
                    <span>·</span>
                    <span>{c.date}</span>
                    {c.duration && (
                      <>
                        <span>·</span>
                        <span>{c.duration}</span>
                      </>
                    )}
                  </div>
                  {c.instructor && c.instructor !== c.issuer && (
                    <div className="text-xs font-mono text-slate-600 mt-0.5">by {c.instructor}</div>
                  )}
                </div>
              </div>

              {/* Floating certified label */}
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2.5 py-1 rounded-lg text-xs font-mono border"
                     style={{ color: c.color, borderColor: `${c.color}40`, background: `${c.color}10` }}>
                  VERIFIED ✓
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
