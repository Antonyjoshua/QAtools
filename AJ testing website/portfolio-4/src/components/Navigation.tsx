'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#ailab', label: 'AI Lab' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLink = (href: string) => {
    setOpen(false);
    setActive(href);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 3.4 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ fontFamily: 'Exo 2, sans-serif' }}
      >
        <div className={`mx-4 mt-4 rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-2xl bg-black/60 border border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

            {/* Logo */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center gap-3 group">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 rounded-lg border border-cyan-400/40 group-hover:border-cyan-400/80 transition-colors" />
                <span className="text-cyan-400 font-black text-base tracking-tight">AJ</span>
              </div>
              <span className="text-white font-bold text-sm tracking-widest hidden sm:block
                               opacity-70 group-hover:opacity-100 transition-opacity">
                ANTONY JOSHUA
              </span>
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {links.map(l => (
                <button key={l.href} onClick={() => handleLink(l.href)}
                        className="relative text-xs font-semibold tracking-widest uppercase text-slate-400 hover:text-cyan-400 transition-colors group">
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* CV button */}
            <div className="flex items-center gap-3">
              <a href="/resume.pdf" download
                 className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-400/40
                            text-cyan-400 text-xs font-bold tracking-widest uppercase
                            hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-200">
                <span>⬇</span> Resume
              </a>
              {/* Hamburger */}
              <button onClick={() => setOpen(!open)} className="md:hidden p-2 flex flex-col gap-1.5">
                <span className={`block w-5 h-px bg-cyan-400 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-px bg-cyan-400 transition-all ${open ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-px bg-cyan-400 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl glass border border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {links.map(l => (
              <button key={l.href} onClick={() => handleLink(l.href)}
                      className="text-left text-sm font-bold tracking-widest uppercase text-slate-300 hover:text-cyan-400 transition-colors">
                {l.label}
              </button>
            ))}
            <a href="/resume.pdf" download
               className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-cyan-400 border-t border-white/10 pt-4">
              ⬇ Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
