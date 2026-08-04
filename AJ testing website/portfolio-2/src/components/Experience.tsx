'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { experience } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

export default function Experience() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="section-pad relative" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#06b6d4' }}>
            Career Journey
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            My <span className="gradient-text-cyan">Experience</span>
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(180deg, #7c3aed, #06b6d4, rgba(124,58,237,0.1))' }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          {experience.map((job, idx) => (
            <motion.div
              key={idx}
              variants={stagger}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              className="relative pl-16 md:pl-20 pb-12"
            >
              {/* Node dot */}
              <motion.div
                className="absolute left-4 md:left-5 top-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: job.isCurrent ? '#06b6d4' : '#7c3aed',
                  boxShadow: job.isCurrent
                    ? '0 0 0 4px rgba(6,182,212,0.2), 0 0 20px rgba(6,182,212,0.4)'
                    : '0 0 0 4px rgba(124,58,237,0.2)',
                }}
                animate={job.isCurrent ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Card */}
              <motion.div
                variants={fadeUp}
                className="glass rounded-2xl p-6 md:p-8"
                style={{ border: '1px solid rgba(148,163,184,0.08)' }}
                whileHover={{
                  boxShadow: '0 0 40px rgba(124,58,237,0.12)',
                  borderColor: 'rgba(124,58,237,0.25)',
                }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-white text-xl">{job.role}</h3>
                    <p className="text-violet-light mt-1">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.isCurrent && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold font-mono"
                        style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }}
                      >
                        ● Current
                      </span>
                    )}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-mono text-slate-400"
                      style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.1)' }}
                    >
                      {job.period}
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-3 mb-6">
                  {job.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed"
                    >
                      <span className="text-violet-light mt-1 flex-shrink-0">▸</span>
                      {h}
                    </motion.li>
                  ))}
                </ul>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                  {job.tech.map((t) => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
