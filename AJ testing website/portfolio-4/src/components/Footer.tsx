'use client';

import { motion } from 'framer-motion';
import { profile } from '@/lib/data';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 overflow-hidden"
            style={{ background: '#020210', borderTop: '1px solid rgba(0,212,255,0.08)' }}>

      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(124,58,237,0.3), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center rounded-lg"
                 style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.3)' }}>
              <span className="text-cyan-400 font-black text-sm">AJ</span>
            </div>
            <div>
              <div className="font-black text-white text-sm" style={{ fontFamily: 'Exo 2' }}>ANTONY JOSHUA S</div>
              <div className="text-xs font-mono text-slate-500">Quality Analyst · Chennai</div>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="flex items-center gap-6 font-mono text-xs">
            {[
              { href: profile.github, label: 'GitHub' },
              { href: profile.linkedin, label: 'LinkedIn' },
              { href: `mailto:${profile.email}`, label: 'Email' },
              { href: '/resume.pdf', label: 'Resume', download: true },
            ].map(l => (
              <a key={l.label} href={l.href} target={l.download ? undefined : '_blank'} rel="noreferrer"
                 download={l.download}
                 className="text-slate-500 hover:text-cyan-400 transition-colors tracking-widest uppercase">
                {l.label}
              </a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                      className="font-mono text-xs text-slate-600 text-center md:text-right">
            <div>© {year} Antony Joshua S. All rights reserved.</div>
            <div className="mt-0.5 flex items-center justify-center md:justify-end gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400/60">Built with Next.js · Three.js · Framer Motion</span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
