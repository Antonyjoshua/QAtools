'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/lib/products';
import { useCart } from '@/lib/cart';

const floatingCards = products.map((p, i) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
  price: p.price,
  color: p.color,
  gradient: p.cardBg,
  badge: p.badge,
  slug: p.slug,
  delay: i * 0.15,
  rotate: [-8, 4, -5, 6][i],
  x: [-220, -70, 70, 220][i],
  y: [20, -30, 15, -20][i],
}));

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
      const cards = el.querySelectorAll<HTMLElement>('[data-float-card]');
      cards.forEach((card, i) => {
        const depth = 0.02 + i * 0.005;
        card.style.transform = `translate(${dx * -20 * depth * 100}px, ${dy * -15 * depth * 100}px) rotate(${floatingCards[i]?.rotate ?? 0}deg)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const { addBundle } = useCart();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
             style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 60%), #030309' }}>

      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
           style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Corner glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none opacity-25"
           style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none opacity-20"
           style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.5), transparent 70%)', filter: 'blur(80px)' }} />

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="flex flex-col items-center text-center mb-16">

          {/* Category badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-indigo-400 text-xs font-mono tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            4 Premium Templates · Instant Download
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="font-black text-white leading-none mb-6"
            style={{ fontFamily: 'Outfit', fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            Premium Developer<br />
            <span className="gradient-text">Portfolio Templates</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="text-slate-400 text-lg max-w-xl mb-3 leading-relaxed">
            Modern · 3D · AI Powered · Interactive · Production Ready
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="text-slate-500 text-sm max-w-lg mb-10 leading-relaxed font-mono">
            Built with Next.js, Three.js, Framer Motion, and GSAP. Deploy to Vercel in minutes.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                      className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/templates" className="pill-btn pill-btn-primary text-sm">
              Browse Templates ›
            </Link>
            <Link href="/templates/cybervault" className="pill-btn pill-btn-outline text-sm">
              Live Preview
            </Link>
            <button onClick={addBundle}
                    className="pill-btn text-sm border border-amber-500/30 text-amber-400 hover:bg-amber-500/8 hover:border-amber-500/60 transition-all">
              🔥 Bundle — $99
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                      className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs font-mono text-slate-600">
            {['✓ Instant Download', '✓ Lifetime Updates', '✓ Commercial License', '✓ Source Code'].map(b => (
              <span key={b} className="text-slate-500">{b}</span>
            ))}
          </motion.div>
        </div>

        {/* Floating portfolio cards */}
        <div className="relative h-64 sm:h-80 flex items-center justify-center">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.id}
              data-float-card
              initial={{ opacity: 0, y: 60, rotate: card.rotate }}
              animate={{ opacity: 1, y: card.y, rotate: card.rotate }}
              transition={{ delay: 0.4 + card.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-44 cursor-pointer group"
              style={{ left: `calc(50% + ${card.x}px - 88px)`, transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
              <Link href={`/templates/${card.slug}`}>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl
                               group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300"
                     style={{ background: card.gradient, boxShadow: `0 20px 60px ${card.color}30` }}>
                  {/* Mock portfolio preview */}
                  <div className="h-28 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-50"
                         style={{ background: `radial-gradient(circle at 30% 30%, ${card.color}60, transparent 70%)` }} />
                    {/* Mock UI elements */}
                    <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      ))}
                      <div className="ml-auto w-16 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <div className="absolute top-8 left-3 right-3 space-y-1.5">
                      <div className="h-2 rounded-full bg-white/20 w-3/4" />
                      <div className="h-1.5 rounded-full bg-white/10 w-1/2" />
                      <div className="h-1.5 rounded-full bg-white/8 w-2/3" />
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      <div className="w-8 h-5 rounded bg-white/15 border border-white/10" />
                      <div className="w-8 h-5 rounded" style={{ background: `${card.color}40`, border: `1px solid ${card.color}60` }} />
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-3 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-white leading-tight" style={{ fontFamily: 'Outfit' }}>{card.name}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{card.tagline}</div>
                      </div>
                      <div className="text-xs font-black" style={{ color: card.color, fontFamily: 'Outfit' }}>
                        ${card.price}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  {card.badge && (
                    <div className={`absolute top-2 right-2 badge badge-${card.badge.toLowerCase()}`}>
                      {card.badge}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, transparent, #030309)' }} />
    </section>
  );
}
