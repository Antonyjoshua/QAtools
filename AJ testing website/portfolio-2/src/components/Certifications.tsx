'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { certifications } from '@/lib/data';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

export default function Certifications() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="certifications" className="section-pad relative" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168,85,247,0.05) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 50% 40% at 20% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#a855f7' }}>
            Credentials
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Certifications &amp; <span className="gradient-text">Achievements</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-lg mx-auto mt-4">
            Continuous learning is a core part of my QA practice — from Selenium fundamentals to cutting-edge AI testing methodologies.
          </motion.p>
        </motion.div>

        {/* Certifications grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 gap-6"
        >
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.title}
              variants={fadeUp}
              className="relative glass rounded-2xl p-6 group overflow-hidden"
              style={{ border: `1px solid ${cert.color}22` }}
              whileHover={{
                y: -4,
                boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${cert.color}18`,
                borderColor: `${cert.color}44`,
              }}
            >
              {/* Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)` }}
              />

              {/* Number badge */}
              <div
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                style={{ background: `${cert.color}18`, border: `1px solid ${cert.color}30`, color: cert.color }}
              >
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Header */}
              <div className="mb-5 pr-10">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono mb-3"
                  style={{ background: `${cert.color}12`, border: `1px solid ${cert.color}25`, color: cert.color }}
                >
                  🏅 {cert.issuer}
                </div>
                <h3 className="font-display font-bold text-white text-lg leading-snug">{cert.title}</h3>
                <p className="text-slate-400 text-sm mt-1">{cert.subtitle}</p>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-5 text-xs font-mono text-slate-500">
                <span>📅 {cert.date}</span>
                {cert.instructor && cert.instructor !== cert.issuer && (
                  <span>👤 {cert.instructor}</span>
                )}
                {cert.duration && (
                  <span>⏱ {cert.duration}</span>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono"
                    style={{ background: `${cert.color}10`, border: `1px solid ${cert.color}22`, color: cert.color }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
