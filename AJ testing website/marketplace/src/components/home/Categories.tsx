'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { categories, products } from '@/lib/products';

export default function Categories() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-20" style={{ background: '#030309' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-10">
          <span className="section-tag">// Filter by</span>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit' }}>
            Browse by <span className="gradient-text">Category</span>
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden" animate={inView ? 'show' : 'hidden'}>
          {categories.map((cat, i) => {
            const count = cat.id === 'all' ? products.length
              : products.filter(p => p.category.includes(cat.id)).length;
            return (
              <motion.div key={cat.id}
                          variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}>
                <Link href={cat.id === 'all' ? '/templates' : `/templates?category=${encodeURIComponent(cat.id)}`}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8
                                 bg-white/2 text-slate-300 text-sm font-medium
                                 hover:border-indigo-500/40 hover:bg-indigo-500/8 hover:text-white transition-all">
                  <span>{cat.label}</span>
                  <span className="text-xs font-mono text-slate-600 group-hover:text-indigo-400 transition-colors">
                    {count}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
