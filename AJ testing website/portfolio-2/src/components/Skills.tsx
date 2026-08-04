'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

export default function Skills() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section-pad relative" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#06b6d4' }}>
            Technical Arsenal
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Skills &amp; <span className="gradient-text-cyan">Expertise</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-lg mx-auto mt-4">
            A toolkit built across 3+ years of professional QA — from test automation frameworks to AI model validation.
          </motion.p>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {skills.map((category) => (
            <motion.div
              key={category.category}
              variants={fadeUp}
              className="glass rounded-2xl p-6 group"
              style={{ border: '1px solid rgba(148,163,184,0.08)' }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 0 40px rgba(6,182,212,0.12)',
                borderColor: 'rgba(6,182,212,0.3)',
              }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-white text-sm leading-tight">{category.category}</h3>
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <motion.span
                    key={item}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-mono"
                    style={{
                      background: 'rgba(124,58,237,0.1)',
                      border: '1px solid rgba(124,58,237,0.2)',
                      color: '#a855f7',
                    }}
                    whileHover={{ scale: 1.07, background: 'rgba(124,58,237,0.2)' }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
