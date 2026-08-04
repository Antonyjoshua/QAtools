'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

const navLinks = [
  { href: '/templates', label: 'Templates' },
  { href: '/templates?tab=bundle', label: 'Bundle Deal' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <div className={`mx-4 mt-3 rounded-2xl transition-all duration-500 ${scrolled
          ? 'bg-black/70 backdrop-blur-2xl border border-white/8 shadow-2xl shadow-black/50'
          : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
                   style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                <span className="text-white font-black text-sm tracking-tight">AX</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="leading-none">
                <span className="font-black text-white text-base tracking-tight">AJPortX</span>
                <div className="text-[9px] font-mono text-slate-500 tracking-widest">PREMIUM TEMPLATES</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href}
                      className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button onClick={openCart}
                      className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white
                                 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/8 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Cart
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </button>

              {/* Browse CTA */}
              <Link href="/templates"
                    className="hidden sm:flex pill-btn pill-btn-primary text-xs px-5 py-2.5">
                Browse Templates
              </Link>

              {/* Hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 flex flex-col gap-1.5">
                <span className={`block w-5 h-0.5 bg-slate-300 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-slate-300 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-slate-300 transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="fixed top-20 left-4 right-4 z-40 rounded-2xl glass-strong p-6 flex flex-col gap-4 md:hidden">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    className="text-base font-semibold text-slate-200 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/templates" onClick={() => setMobileOpen(false)}
                  className="pill-btn pill-btn-primary justify-center mt-2">
              Browse Templates
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
