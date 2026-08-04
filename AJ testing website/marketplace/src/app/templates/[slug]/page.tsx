'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import LivePreview from '@/components/templates/LivePreview';
import TemplateCard from '@/components/templates/TemplateCard';
import { getProduct, products } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { formatPrice, formatDiscount } from '@/lib/utils';

type Tab = 'preview' | 'features' | 'documentation' | 'changelog' | 'faq';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < Math.floor(rating) ? 'star' : 'star-empty'} style={{ fontSize: '0.75rem' }}>★</span>
      ))}
    </span>
  );
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = getProduct(slug);
  if (!product) notFound();

  const [tab, setTab] = useState<Tab>('preview');
  const { addProduct, hasItem } = useCart();
  const inCart = hasItem(product.id);
  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'preview',       label: 'Live Preview' },
    { id: 'features',      label: 'Features' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'changelog',     label: 'Changelog' },
    { id: 'faq',           label: 'FAQ' },
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-20" style={{ background: '#030309' }}>

        {/* Hero banner */}
        <div className="relative overflow-hidden py-16"
             style={{ background: `linear-gradient(135deg, ${product.cardBg} 0%, #030309 100%)` }}>
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${product.color}10, transparent 70%)` }} />
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{ background: `linear-gradient(90deg, transparent, ${product.color}, transparent)` }} />

          <div className="max-w-7xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 mb-8">
              <Link href="/" className="hover:text-slate-400 transition-colors">AJPortX</Link>
              <span>/</span>
              <Link href="/templates" className="hover:text-slate-400 transition-colors">Templates</Link>
              <span>/</span>
              <span style={{ color: product.color }}>{product.name}</span>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left */}
              <div className="lg:col-span-2">
                {product.badge && (
                  <div className={`badge badge-${product.badge.toLowerCase()} inline-flex mb-4`}>{product.badge}</div>
                )}
                <h1 className="font-black text-white mb-3 leading-tight"
                    style={{ fontFamily: 'Outfit', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  {product.name}
                </h1>
                <p className="text-lg text-slate-300 mb-4 leading-relaxed">{product.tagline}</p>
                <p className="text-slate-400 leading-relaxed mb-6">{product.description}</p>

                <div className="flex flex-wrap items-center gap-5 text-sm">
                  <div className="flex items-center gap-2">
                    <Stars rating={product.rating} />
                    <span className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>{product.rating}</span>
                    <span className="text-slate-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="text-slate-500 font-mono text-xs">v{product.version}</div>
                  <div className="text-slate-500 font-mono text-xs">Updated {product.lastUpdated}</div>
                  <div className="text-slate-500 font-mono text-xs">{product.downloads.toLocaleString()} downloads</div>
                </div>
              </div>

              {/* Right — Purchase card */}
              <div>
                <div className="relative rounded-2xl p-6 border border-white/10 bg-white/3 backdrop-blur-xl">
                  <div className="absolute top-0 left-0 right-0 h-px"
                       style={{ background: `linear-gradient(90deg, transparent, ${product.color}, transparent)` }} />

                  <div className="flex items-end gap-3 mb-1">
                    <div className="font-black text-white leading-none" style={{ fontFamily: 'Outfit', fontSize: '3rem' }}>
                      {formatPrice(product.price)}
                    </div>
                    <div className="mb-1.5">
                      <div className="text-sm text-slate-500 line-through font-mono">{formatPrice(product.originalPrice)}</div>
                      <div className="text-xs font-bold text-green-400 font-mono">{formatDiscount(product.originalPrice, product.price)}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-500 mb-5">{product.license}</div>

                  <button
                    onClick={() => addProduct(product)}
                    disabled={inCart}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm mb-3 transition-all ${inCart
                      ? 'border border-green-500/40 text-green-400 bg-green-500/8 cursor-default'
                      : 'text-white hover:shadow-lg hover:-translate-y-0.5'}`}
                    style={!inCart ? { background: `linear-gradient(135deg, ${product.color}, #7c3aed)`, fontFamily: 'Outfit' } : { fontFamily: 'Outfit' }}>
                    {inCart ? '✓ Added to Cart' : '⚡ Add to Cart'}
                  </button>

                  <a href={product.previewUrl} target="_blank" rel="noreferrer"
                     className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:text-white hover:border-white/20 transition-all mb-5"
                     style={{ fontFamily: 'Outfit' }}>
                    ↗ Open Live Preview
                  </a>

                  <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
                    {['Complete source code', 'Lifetime updates', 'Commercial license', 'Documentation included', 'Email support'].map(b => (
                      <li key={b} className="flex items-center gap-2">
                        <span className="text-green-400">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 sticky top-14 z-30 backdrop-blur-xl"
             style={{ background: 'rgba(3,3,9,0.9)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                          tab === t.id
                            ? 'border-indigo-500 text-white'
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                        style={{ fontFamily: 'Outfit' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

              {tab === 'preview' && (
                <div>
                  <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Interactive Preview</h2>
                  <LivePreview previewUrl={product.previewUrl} productName={product.name} color={product.color} />
                </div>
              )}

              {tab === 'features' && (
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Features</h2>
                    <ul className="space-y-3">
                      {product.features.map((f, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                   transition={{ delay: i * 0.05 }}
                                   className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] mt-0.5"
                                style={{ borderColor: `${product.color}50`, color: product.color, background: `${product.color}10` }}>
                            ✓
                          </span>
                          {f}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Animations</h2>
                    <ul className="space-y-3">
                      {product.animations.map((a, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                   transition={{ delay: i * 0.05 }}
                                   className="flex items-start gap-3 text-sm text-slate-300">
                          <span style={{ color: product.color }}>⚡</span>
                          {a}
                        </motion.li>
                      ))}
                    </ul>

                    <h2 className="text-2xl font-black text-white mt-10 mb-6" style={{ fontFamily: 'Outfit' }}>Tech Stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {product.techStack.map(t => (
                        <span key={t} className="px-3 py-1.5 rounded-lg text-sm font-mono border"
                              style={{ color: product.color, borderColor: `${product.color}35`, background: `${product.color}0d` }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-2xl font-black text-white mt-10 mb-4" style={{ fontFamily: 'Outfit' }}>Folder Structure</h2>
                    <div className="p-4 rounded-xl border border-white/8 font-mono text-xs text-slate-400 space-y-0.5"
                         style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {product.folderStructure.map((line, i) => (
                        <div key={i}
                             className={line.endsWith('/') ? 'text-indigo-400 font-semibold' : 'text-slate-500'}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'documentation' && (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'Outfit' }}>Documentation</h2>
                  <div className="space-y-8">
                    {product.documentation.map((doc, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-white/8 bg-white/2">
                        <h3 className="font-black text-white text-lg mb-3" style={{ fontFamily: 'Outfit' }}>{doc.title}</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{doc.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'changelog' && (
                <div className="max-w-xl">
                  <h2 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'Outfit' }}>Version History</h2>
                  <div className="space-y-6">
                    {product.changelog.map((entry, i) => (
                      <div key={i} className="relative pl-6 border-l border-white/8">
                        <div className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1/2"
                             style={{ background: i === 0 ? product.color : '#374151' }} />
                        <div className="font-mono text-xs text-slate-500 mb-1">{entry.date}</div>
                        <div className="font-black text-white mb-2" style={{ fontFamily: 'Outfit' }}>v{entry.version}</div>
                        <ul className="space-y-1">
                          {entry.changes.map((c, j) => (
                            <li key={j} className="text-sm text-slate-400 flex items-start gap-2">
                              <span style={{ color: product.color }}>·</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'faq' && (
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'Outfit' }}>FAQ</h2>
                  <div className="space-y-4">
                    {product.faq.map((item, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-white/8 bg-white/2">
                        <div className="font-semibold text-white mb-2 text-sm" style={{ fontFamily: 'Outfit' }}>
                          <span style={{ color: product.color }}>Q.</span> {item.question}
                        </div>
                        <div className="text-slate-400 text-sm leading-relaxed">
                          <span className="text-slate-500">A.</span> {item.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="border-t border-white/5 py-16" style={{ background: '#050510' }}>
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'Outfit' }}>
                Other Templates
              </h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map(p => <TemplateCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
