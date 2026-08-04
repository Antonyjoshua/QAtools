'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '4', suffix: '', label: 'Premium Templates', icon: '🎨' },
  { value: '2500', suffix: '+', label: 'Downloads', icon: '⬇' },
  { value: '5.0', suffix: '★', label: 'Average Rating', icon: '⭐' },
  { value: '100', suffix: '%', label: 'Source Code Included', icon: '💾' },
  { value: '∞', suffix: '', label: 'Lifetime Updates', icon: '♾' },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-16 border-y border-white/5"
             style={{ background: 'linear-gradient(to right, #050514, #080818, #050514)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="text-center group cursor-default">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-black text-white text-3xl leading-none mb-1"
                   style={{ fontFamily: 'Outfit', color: i % 2 === 0 ? '#818cf8' : '#c084fc' }}>
                {s.value}<span className="text-lg">{s.suffix}</span>
              </div>
              <div className="text-xs font-mono text-slate-500 tracking-wide">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
