'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { bundle, products } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { formatDiscount } from '@/lib/utils';

export default function BundleOffer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const { addBundle, hasItem } = useCart();
  const inCart = hasItem('bundle-all');

  return (
    <section ref={ref} className="py-28 relative overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #030309, #07041a, #030309)' }}>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.12), transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0d0820 0%, #0a0a1e 50%, #0d0820 100%)', border: '1px solid rgba(168,85,247,0.2)' }}>

          {/* Top edge glow */}
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, #06b6d4, transparent)' }} />

          {/* Grid BG */}
          <div className="absolute inset-0 opacity-15"
               style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="relative z-10 p-8 sm:p-14">
            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 text-xs font-mono tracking-widest uppercase mb-6">
                  🔥 Limited Time Offer
                </div>
                <h2 className="font-black text-white mb-3 leading-tight"
                    style={{ fontFamily: 'Outfit', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                  All 4 Templates<br />
                  <span className="gradient-text">One Unbeatable Price</span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  Get Nebula Classic, Nexus 3D, Phoenix Fire, and CyberVault — complete source code, documentation, and lifetime updates. Save <strong className="text-white">${bundle.savings}</strong> vs buying individually.
                </p>

                {/* Included list */}
                <ul className="space-y-2.5 mb-8">
                  {products.map(p => (
                    <li key={p.id} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-[10px]">✓</span>
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="text-slate-500">—</span>
                      <span className="text-slate-400 text-xs">{p.tagline}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="flex items-end gap-4 mb-6">
                  <div>
                    <div className="text-slate-500 text-sm line-through mb-0.5 font-mono">${bundle.originalPrice}</div>
                    <div className="font-black text-white leading-none" style={{ fontFamily: 'Outfit', fontSize: '3.5rem' }}>
                      ${bundle.price}
                    </div>
                  </div>
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-bold font-mono">
                    {formatDiscount(bundle.originalPrice, bundle.price)}
                  </div>
                </div>

                <button
                  onClick={addBundle}
                  disabled={inCart}
                  className={`pill-btn text-base px-8 py-3.5 ${inCart
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400 cursor-default'
                    : 'pill-btn-primary'}`}>
                  {inCart ? '✓ Added to Cart' : '⚡ Get the Bundle'}
                </button>
              </div>

              {/* Right — stacked preview cards */}
              <div className="relative h-72 hidden lg:block">
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="absolute rounded-2xl border border-white/10 overflow-hidden"
                    style={{
                      background: p.cardBg,
                      width: 200, height: 130,
                      top: `${i * 22}px`, left: `${i * 26}px`,
                      zIndex: 4 - i,
                      boxShadow: `0 10px 40px ${p.color}25`,
                      transform: `rotate(${[-3, -1, 1, 3][i]}deg)`,
                    }}>
                    <div className="h-16 relative overflow-hidden"
                         style={{ background: `radial-gradient(circle at 30% 30%, ${p.color}40, transparent 70%)` }}>
                      <div className="absolute bottom-2 left-3 right-3 flex gap-1.5">
                        <div className="h-1.5 rounded-full flex-1 bg-white/20" />
                        <div className="h-1.5 rounded-full w-8 bg-white/10" />
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-black text-white" style={{ fontFamily: 'Outfit' }}>{p.name}</div>
                      <div className="text-xs font-bold mt-0.5" style={{ color: p.color }}>${p.price}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
