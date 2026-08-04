'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { profile } from '@/lib/data';

const navLinks = [
  { href: '#hero',           label: 'Home' },
  { href: '#about',          label: 'About' },
  { href: '#experience',     label: 'Experience' },
  { href: '#projects',       label: 'Projects' },
  { href: '#skills',         label: 'Skills' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#ai-lab',         label: 'AI Lab' },
  { href: '#contact',        label: 'Contact' },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="relative border-t pt-16 pb-8"
      style={{
        background: 'rgba(3,7,17,0.95)',
        borderColor: 'rgba(148,163,184,0.08)',
      }}
    >
      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-2xl gradient-text mb-3">Antony Joshua S</div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-56">
              Quality Analyst · Automation Engineer · AI Testing Specialist
            </p>
            <div className="flex items-center gap-1 mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-mono">Available for hire</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-slate-400 font-mono text-xs tracking-widest uppercase mb-4">Navigation</h4>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => document.getElementById(l.href.replace('#',''))?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-400 font-mono text-xs tracking-widest uppercase mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              {[
                { Icon: Mail,     href: `mailto:${profile.email}`,   label: profile.email },
                { Icon: Github,   href: profile.github,              label: 'github.com/Antonyjoshua' },
                { Icon: Linkedin, href: profile.linkedin,            label: 'antony-joshua-471704aj' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm group"
                >
                  <Icon size={14} className="group-hover:text-violet-light transition-colors" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: 'rgba(148,163,184,0.06)' }}
        >
          <p className="text-slate-600 text-xs font-mono">
            © {new Date().getFullYear()} Antony Joshua S · Chennai, India
          </p>
          <p className="text-slate-700 text-xs font-mono">
            Crafted with ⚡ Next.js · Three.js · Framer Motion
          </p>
          <motion.button
            onClick={scrollTop}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
