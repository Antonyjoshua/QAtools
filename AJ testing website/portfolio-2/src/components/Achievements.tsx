'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '@/lib/data';

function Counter({ target, suffix, duration = 2000 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = duration / 60;
    const increment = target / (duration / (1000 / 60));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const achievementCards = [
  {
    value: 2500, suffix: '+', label: 'Bugs Reported',
    desc: 'Defects identified across web, mobile, VR, and AI platforms',
    icon: '🐛',
    gradient: 'from-violet-DEFAULT to-violet-dark',
    glow: 'rgba(124,58,237,0.3)',
  },
  {
    value: 3, suffix: '+', label: 'Years of Mastery',
    desc: 'Building expertise from manual testing to AI-driven automation',
    icon: '⏳',
    gradient: 'from-cyan-DEFAULT to-blue-700',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    value: 100, suffix: '+', label: 'Tests Automated',
    desc: 'Playwright & Selenium scripts replacing repetitive manual cycles',
    icon: '🤖',
    gradient: 'from-violet-light to-cyan-DEFAULT',
    glow: 'rgba(168,85,247,0.3)',
  },
  {
    value: 9, suffix: '+', label: 'Projects Delivered',
    desc: 'Enterprise applications validated end-to-end and shipped with confidence',
    icon: '🚀',
    gradient: 'from-emerald-600 to-cyan-DEFAULT',
    glow: 'rgba(16,185,129,0.3)',
  },
];

export default function Achievements() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-pad relative" ref={ref}>
      {/* Bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-3 text-violet-light">
            By the Numbers
          </p>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Impact <span className="gradient-text">Delivered</span>
          </h2>
        </motion.div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievementCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl overflow-hidden group"
              style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(148,163,184,0.08)',
                backdropFilter: 'blur(20px)',
              }}
              whileHover={{
                y: -6,
                boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 40px ${s.glow}`,
                borderColor: s.glow.replace('0.3)', '0.4)'),
              }}
            >
              {/* Top gradient line */}
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${s.glow}, transparent)` }}
              />

              <div className="p-7">
                {/* Icon */}
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                >
                  {s.icon}
                </motion.div>

                {/* Counter */}
                <div
                  className="font-display font-black text-4xl md:text-5xl mb-2 gradient-text"
                  style={{ lineHeight: 1 }}
                >
                  <Counter target={s.value} suffix={s.suffix} duration={2000} />
                </div>

                <div className="text-white font-semibold mb-2">{s.label}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>

              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${s.glow.replace('0.3)', '0.06)')}, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            ['🏆', 'Enterprise Projects', '5+'],
            ['📱', 'Platforms Tested', 'Web / Mobile / VR / AI'],
            ['⚡', 'CI/CD Integrations', '3+ Pipelines'],
            ['🎓', 'Certifications',  'Testing & Automation'],
          ].map(([icon, label, val]) => (
            <div
              key={label}
              className="glass rounded-xl p-4 text-center"
              style={{ border: '1px solid rgba(148,163,184,0.07)' }}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-slate-300 font-semibold text-sm">{val}</div>
              <div className="text-slate-600 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
