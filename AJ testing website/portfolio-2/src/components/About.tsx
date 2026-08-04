'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { aboutParagraphs, passions } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.p
      variants={fadeUp}
      className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
      style={{ color: '#7c3aed' }}
    >
      {children}
    </motion.p>
  );
}

const expandableStats = [
  { n: '2500+', l: 'Defects Found',      icon: '🐛', color: '#7c3aed', items: null },
  { n: '3+',    l: 'Years Experience',   icon: '⏳', color: '#06b6d4', items: null },
  {
    n: '9+', l: 'Projects Delivered', icon: '🚀', color: '#a855f7',
    items: ['Jeshwar Teaching', 'Funtown Kids Park', 'Scope AI Chat', 'Scope Employee Portal', 'ConfidentoAI', 'Cornovus Capital', 'MyHotel AI', 'Zane Hospitality', 'ACW Card'],
  },
  {
    n: '8', l: 'Domains Covered', icon: '🌐', color: '#06b6d4',
    items: ['EdTech', 'Healthcare', 'Finance', 'Entertainment', 'E-commerce', 'VR / AR', 'HRMS', 'NFC Technology'],
  },
];

export default function About() {
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin: '-100px' });
  const [openStat, setOpenStat] = useState<string | null>(null);

  return (
    <section id="about" className="section-pad relative" ref={ref}>
      {/* Subtle bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="text-center mb-20"
        >
          <SectionLabel>Who I Am</SectionLabel>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Crafting{' '}
            <span className="gradient-text">Quality</span>
            {' '}at Scale
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-xl mx-auto text-lg">
            A story of precision, automation, and the relentless pursuit of zero defects.
          </motion.p>
        </motion.div>

        {/* Two columns: narrative + visual */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Narrative */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="space-y-5"
          >
            {aboutParagraphs.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-slate-400 leading-relaxed"
                style={{ fontSize: '1.05rem' }}
              >
                {p}
              </motion.p>
            ))}

            {/* Quote */}
            <motion.blockquote
              variants={fadeUp}
              className="glass rounded-2xl p-6 mt-8 border-l-2"
              style={{ borderLeftColor: '#7c3aed' }}
            >
              <p className="text-slate-300 italic text-lg leading-relaxed">
                "Quality is not an act, it is a habit — and I've made it my obsession."
              </p>
              <footer className="mt-3 text-slate-500 font-mono text-xs tracking-widest">
                — ANTONY JOSHUA S
              </footer>
            </motion.blockquote>
          </motion.div>

          {/* Right: big stat display */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="grid grid-cols-2 gap-4"
          >
            {expandableStats.map((s) => (
              <motion.div
                key={s.l}
                variants={fadeUp}
                className="glass rounded-2xl p-6 text-center transition-transform duration-300"
                style={{
                  border: `1px solid ${s.color}22`,
                  cursor: s.items ? 'pointer' : 'default',
                }}
                whileHover={{ boxShadow: `0 0 30px ${s.color}22`, scale: s.items ? 1.03 : 1.02 }}
                onClick={() => s.items && setOpenStat(openStat === s.l ? null : s.l)}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-display font-bold text-3xl mb-1" style={{ color: s.color }}>
                  {s.n}
                </div>
                <div className="text-slate-500 text-xs tracking-widest uppercase flex items-center justify-center gap-1">
                  {s.l}
                  {s.items && (
                    <span className="text-slate-600" style={{ fontSize: '0.65rem' }}>
                      {openStat === s.l ? '▲' : '▼'}
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {s.items && openStat === s.l && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-3 pt-3 border-t text-left space-y-1 overflow-hidden"
                      style={{ borderColor: `${s.color}22` }}
                    >
                      {s.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-slate-400">
                          <span style={{ color: s.color }}>▸</span>
                          {item}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Education card spanning full width */}
            <motion.div
              variants={fadeUp}
              className="col-span-2 glass rounded-2xl p-6 space-y-4"
              style={{ border: '1px solid rgba(124,58,237,0.15)' }}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎓</div>
                <div>
                  <div className="text-white font-semibold">MCA — Master of Computer Applications</div>
                  <div className="text-violet-light text-sm mt-0.5">Madras University</div>
                  <div className="text-slate-500 text-xs mt-1 font-mono">Pursuing</div>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-4 border-t" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                <div className="text-2xl">🏫</div>
                <div>
                  <div className="text-white font-semibold">BCA — Bachelor of Computer Applications</div>
                  <div className="text-violet-light text-sm mt-0.5">Jaya College of Arts &amp; Science</div>
                  <div className="text-slate-500 text-xs mt-1 font-mono">85%</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Passion cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.h3
            variants={fadeUp}
            className="font-display font-bold text-white text-2xl text-center mb-10"
          >
            What Drives Me
          </motion.h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {passions.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                className="glass rounded-2xl p-6 group cursor-default"
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 40px rgba(124,58,237,0.15)',
                  borderColor: 'rgba(124,58,237,0.3)',
                }}
                style={{ border: '1px solid rgba(148,163,184,0.08)', transition: 'all 0.3s' }}
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h4 className="font-semibold text-white mb-2">{p.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
