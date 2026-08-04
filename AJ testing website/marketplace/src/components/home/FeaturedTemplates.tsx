'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import TemplateCard from '@/components/templates/TemplateCard';
import { products } from '@/lib/products';
import Link from 'next/link';

export default function FeaturedTemplates() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="templates" ref={ref} className="py-28"
             style={{ background: 'linear-gradient(to bottom, #030309, #05050f, #030309)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }} className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div>
            <span className="section-tag">// 004 Premium Templates</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight" style={{ fontFamily: 'Outfit' }}>
              Featured<br /><span className="gradient-text">Templates</span>
            </h2>
          </div>
          <Link href="/templates"
                className="pill-btn pill-btn-outline text-sm shrink-0">
            View All Templates →
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <motion.div key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <TemplateCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
