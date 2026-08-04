'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Download } from 'lucide-react';
import { profile } from '@/lib/data';

const roles = [
  'Quality Analyst',
  'Automation Engineer',
  'AI QA Specialist',
  'Test Architect',
];

const floatingBadges = [
  { label: 'Playwright',   angle:   0, radius: 44, color: 'rgba(124,58,237,0.15)',  border: 'rgba(124,58,237,0.35)' },
  { label: 'TypeScript',   angle:  72, radius: 44, color: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)' },
  { label: 'AI Testing',   angle: 144, radius: 44, color: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.35)' },
  { label: 'Selenium',     angle: 216, radius: 44, color: 'rgba(124,58,237,0.15)',  border: 'rgba(124,58,237,0.35)' },
  { label: 'JIRA',         angle: 288, radius: 44, color: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)' },
];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayRole, setDisplayRole] = useState(roles[0]);
  const [deleting, setDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = roles[roleIdx];

    if (!deleting) {
      if (displayRole.length < current.length) {
        timeout = setTimeout(() => setDisplayRole(current.slice(0, displayRole.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (displayRole.length > 0) {
        timeout = setTimeout(() => setDisplayRole(displayRole.slice(0, -1)), 50);
      } else {
        setDeleting(false);
        setRoleIdx((i) => (i + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayRole, deleting, roleIdx]);

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(124,58,237,0.12) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 60%), ' +
            'linear-gradient(180deg, rgba(3,7,17,0.3) 0%, rgba(3,7,17,0.85) 85%, #030711 100%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none grid-overlay opacity-30"
      />

      {/* Content */}
      <div className="relative z-[2] max-w-7xl mx-auto px-6 pt-24 pb-28 flex flex-col items-center text-center">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 font-mono text-xs"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.25)',
            color: '#4ade80',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available for opportunities · Chennai, India
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-bold leading-none mb-4"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
        >
          <span className="text-white">{profile.name.split(' ')[0]} </span>
          <span className="gradient-text">{profile.name.split(' ').slice(1).join(' ')}</span>
        </motion.h1>

        {/* Role typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl font-mono font-medium mb-6 h-8 flex items-center"
          style={{ color: '#94a3b8' }}
        >
          <span className="text-violet-light">&gt; </span>
          <span style={{ color: '#e2e8f0' }}>{displayRole}</span>
          <span className="ml-1 text-violet-light animate-pulse">_</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl text-slate-400 text-lg leading-relaxed mb-10"
        >
          {profile.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <motion.button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            View My Work
            <ArrowRight size={17} />
          </motion.button>

          <motion.a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-300 glass"
            whileHover={{ scale: 1.04, color: '#fff', borderColor: 'rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={17} />
            Download CV
          </motion.a>
        </motion.div>

        {/* Floating tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {floatingBadges.map((b, i) => (
            <motion.span
              key={b.label}
              className="tech-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ scale: 1.08, y: -2 }}
            >
              {b.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {[
            { n: '2500+', l: 'Bugs Reported' },
            { n: '3+',    l: 'Years Experience' },
            { n: '100+',  l: 'Tests Automated' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-2xl font-bold font-display gradient-text">{s.n}</div>
              <div className="text-xs text-slate-500 mt-0.5 tracking-widest uppercase">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <span className="text-xs font-mono tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
