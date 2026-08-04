'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#hero',             label: 'Home' },
  { href: '#about',            label: 'About' },
  { href: '#experience',       label: 'Experience' },
  { href: '#projects',         label: 'Projects' },
  { href: '#skills',           label: 'Skills' },
  { href: '#certifications',   label: 'Certifications' },
  { href: '#ai-lab',           label: 'AI Lab' },
  { href: '#contact',          label: 'Contact' },
];

export default function Navigation() {
  const [active, setActive]   = useState('');
  const [menuOpen, setMenu]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrolled(v > 0.01);
  });

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = links.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    setMenu(false);
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-DEFAULT via-violet-light to-cyan z-[9999] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav
        className="fixed top-0 left-0 right-0 z-[999] transition-all duration-500"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: scrolled ? 'rgba(3,7,17,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(148,163,184,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => scrollTo('#hero')}
            className="font-mono text-sm font-semibold tracking-widest text-white/90 hover:text-white transition-colors"
            whileHover={{ scale: 1.03 }}
          >
            <span className="gradient-text font-bold text-base">AJ</span>
            <span className="text-slate-500 mx-1">·</span>
            <span className="text-slate-400 text-xs">QA</span>
          </motion.button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const isActive = active === l.href.replace('#', '');
              return (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="relative px-4 py-2 text-sm font-medium transition-colors rounded-lg"
                    style={{ color: isActive ? '#a855f7' : '#94a3b8' }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo('#contact'); }}
              className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.97 }}
            >
              Hire Me
            </motion.a>

            <motion.button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
              style={{ background: 'rgba(15,23,42,0.5)' }}
              onClick={() => setMenu(!menuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-[998] glass-strong border-t border-white/5 md:hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="w-full text-left py-3 px-4 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
