'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { roles } from '@/lib/data';

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false });

export default function Hero() {
  const [roleIdx, setRoleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Typing animation
  useEffect(() => {
    const target = roles[roleIdx];
    let timeout: NodeJS.Timeout;
    if (!deleting) {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 65);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setDeleting(false);
        setRoleIdx(i => (i + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  // Mouse parallax
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      el.style.transform = `translate(${dx * -10}px, ${dy * -6}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const letter = { hidden: { opacity: 0, y: 80 }, show: { opacity: 1, y: 0 } };
  const name = 'ANTONY JOSHUA S'.split('');

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #000008, #050514, #08021a)' }}>

      {/* Particle universe */}
      <ParticleField />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-30"
           style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />

      {/* Corner glows */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)', filter: 'blur(60px)', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', filter: 'blur(80px)', transform: 'translate(40%, 40%)' }} />

      {/* Main content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 pt-20 transition-transform duration-75"
           style={{ willChange: 'transform' }}>

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.6, duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30
                               bg-cyan-400/5 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          AI · Quality · Engineering · Chennai
        </motion.div>

        {/* Name — letters animate in */}
        <div className="overflow-hidden mb-4">
          <motion.div className="flex flex-wrap justify-center"
                      variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 3.5 } } }}
                      initial="hidden" animate="show">
            {name.map((ch, i) => (
              <motion.span key={i} variants={letter}
                           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                           className={`font-black ${ch === ' ' ? 'w-6 sm:w-10' : ''}`}
                           style={{
                             fontFamily: 'Exo 2, sans-serif',
                             fontSize: 'clamp(3rem, 10vw, 9rem)',
                             lineHeight: 0.9,
                             letterSpacing: '-0.03em',
                             background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                             WebkitBackgroundClip: 'text',
                             WebkitTextFillColor: 'transparent',
                             backgroundClip: 'text',
                             filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.25))',
                           }}>
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Typing subtitle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 4.2, duration: 0.6 }}
                    className="flex items-center justify-center gap-2 mb-10 h-10">
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}
                className="text-lg sm:text-2xl font-medium text-cyan-400">
            {displayed}
          </span>
          <span className="terminal-cursor" />
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4.4, duration: 0.7 }}
                    className="flex flex-wrap items-center justify-center gap-0 mb-12">
          {[
            { val: '2500+', label: 'Defects Found' },
            { val: '3+', label: 'Years Exp' },
            { val: '9+', label: 'Projects' },
            { val: '8', label: 'Domains' },
          ].map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="px-6 py-2 text-center">
                <div className="text-2xl sm:text-4xl font-black text-cyan-400" style={{ fontFamily: 'Exo 2' }}>{s.val}</div>
                <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-0.5">{s.label}</div>
              </div>
              {i < 3 && <div className="w-px h-8 bg-white/10" />}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4.6, duration: 0.7 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticBtn href="#projects" primary>
            ⚡ Explore Portfolio
          </MagneticBtn>
          <MagneticBtn href="/resume.pdf" download>
            ⬇ Download Resume
          </MagneticBtn>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 5, duration: 1 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-mono text-xs tracking-widest text-slate-500 uppercase">Scroll</span>
        <div className="flex flex-col items-center gap-1">
          {[0, 0.2, 0.4].map(d => (
            <motion.div key={d} className="w-px h-3 rounded-full bg-cyan-400/60"
                        animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, delay: d, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, transparent, #050514)' }} />
    </section>
  );
}

function MagneticBtn({ href, children, primary, download }: {
  href: string; children: React.ReactNode; primary?: boolean; download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const b = ref.current; if (!b) return;
    const r = b.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    b.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <a ref={ref} href={href} download={download}
       onMouseMove={onMove} onMouseLeave={onLeave}
       onClick={!download ? (e) => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); } : undefined}
       className={`relative px-7 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase
                   transition-all duration-200 ${primary
         ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg hover:shadow-cyan-500/30'
         : 'border border-cyan-400/40 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-400/8'
       }`}
       style={{ fontFamily: 'Exo 2' }}>
      {children}
    </a>
  );
}
