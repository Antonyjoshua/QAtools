'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const reviews = [
  { name: 'Ravi Kumar', role: 'Full Stack Developer', rating: 5, text: 'CyberVault is absolutely stunning. The loader animation alone is worth the price. My hiring manager noticed immediately.', avatar: 'R', color: '#6366f1' },
  { name: 'Sarah Chen', role: 'Frontend Engineer', rating: 5, text: 'Nexus 3D blew my mind. Three.js background, AI chatbot, TypeScript — and it deploys to Vercel in one click. 10/10.', avatar: 'S', color: '#a855f7' },
  { name: 'Mohamed Al-Rashid', role: 'QA Automation Engineer', rating: 5, text: 'Phoenix Fire gave me the boldest portfolio in my team. The fire animations are incredible. Got 3 interview calls that week.', avatar: 'M', color: '#f97316' },
  { name: 'Priya Sharma', role: 'Software Tester', rating: 5, text: 'Nebula Classic is perfect for people who want to deploy in minutes without any build step. The radar chart is beautiful.', avatar: 'P', color: '#10b981' },
  { name: 'Alex Johnson', role: 'DevOps Engineer', rating: 5, text: 'Bought the bundle. Best $99 I ever spent on career development. Each template is genuinely world-class.', avatar: 'A', color: '#06b6d4' },
  { name: 'Deepa Nair', role: 'React Developer', rating: 5, text: 'The code quality is exceptional — TypeScript throughout, clean components, well-documented. This is how templates should be made.', avatar: 'D', color: '#8b5cf6' },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < n ? 'star' : 'star-empty'} style={{ fontSize: '0.7rem' }}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-28 overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #030309, #050510, #030309)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-14">
          <span className="section-tag">// Customer Reviews</span>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: 'Outfit' }}>
            Loved by <span className="gradient-text">Developers</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="relative p-6 rounded-2xl glass-strong overflow-hidden group
                                   hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{ background: `linear-gradient(90deg, transparent, ${r.color}, transparent)` }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: `radial-gradient(circle at 50% 0%, ${r.color}08, transparent 70%)` }} />

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white shrink-0"
                     style={{ background: `${r.color}30`, border: `1px solid ${r.color}40`, fontSize: '0.9rem', fontFamily: 'Outfit' }}>
                  {r.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Outfit' }}>{r.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{r.role}</div>
                </div>
                <div className="ml-auto">
                  <Stars n={r.rating} />
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed relative z-10">"{r.text}"</p>
            </motion.div>
          ))}
        </div>

        {/* Overall rating */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl border border-white/8 bg-white/2">
            <div className="text-4xl font-black text-white" style={{ fontFamily: 'Outfit' }}>4.9</div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => <span key={i} className="star">★</span>)}
              </div>
              <div className="text-xs font-mono text-slate-500">Based on 471+ reviews</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
