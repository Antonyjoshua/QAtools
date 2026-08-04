'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import TemplateCard from '@/components/templates/TemplateCard';
import { products, categories } from '@/lib/products';

type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

function TemplatesContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState<SortOption>('popular');

  const filtered = useMemo(() => {
    let list = [...products];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.techStack.some(t => t.toLowerCase().includes(q)) ||
        p.category.some(c => c.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category.includes(activeCategory));
    }

    switch (sort) {
      case 'newest':     return list.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
      case 'price-asc':  return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating':     return list.sort((a, b) => b.rating - a.rating);
      default:           return list.sort((a, b) => b.downloads - a.downloads);
    }
  }, [search, activeCategory, sort]);

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-24 pb-20" style={{ background: '#030309' }}>
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-tag">// AJPortX Marketplace</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Outfit' }}>
              All <span className="gradient-text">Templates</span>
            </h1>
            <p className="text-slate-400 text-base">
              {products.length} premium portfolio templates · Instantly downloadable
            </p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search templates, tech stacks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9"
              />
            </div>

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
                    className="input w-auto min-w-44 bg-surface cursor-pointer">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                        activeCategory === cat.id
                          ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-300'
                          : 'border-white/8 bg-white/2 text-slate-400 hover:border-indigo-500/30 hover:text-slate-200'
                      }`}
                      style={{ fontFamily: 'Outfit' }}>
                {cat.label}
                {cat.count !== undefined && (
                  <span className="ml-2 text-xs font-mono text-slate-600">
                    {activeCategory === cat.id ? filtered.length : cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-slate-400 font-semibold mb-2" style={{ fontFamily: 'Outfit' }}>No templates found</div>
              <p className="text-sm text-slate-600">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <motion.div key={product.id} layout
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}>
                  <TemplateCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Results info */}
          <div className="mt-8 text-center text-xs font-mono text-slate-600">
            Showing {filtered.length} of {products.length} templates
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div style={{ background: '#030309', minHeight: '100vh' }} />}>
      <TemplatesContent />
    </Suspense>
  );
}
