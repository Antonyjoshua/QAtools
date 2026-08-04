'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < Math.floor(rating) ? 'star' : 'star-empty'} style={{ fontSize: '0.6rem' }}>★</span>
      ))}
      <span className="ml-1 text-xs font-mono text-slate-500">{rating}</span>
    </div>
  );
}

export default function TemplateCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addProduct, hasItem } = useCart();
  const inCart = hasItem(product.id);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -16;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
  };
  const onMouseLeave = () => { if (cardRef.current) cardRef.current.style.transform = ''; };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative rounded-2xl overflow-hidden group cursor-default transition-shadow duration-300"
      style={{
        background: product.cardBg,
        border: `1px solid ${product.color}20`,
        boxShadow: `0 0 0 1px ${product.color}10`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s',
      }}>

      {/* Top edge */}
      <div className="absolute top-0 left-0 right-0 h-px z-10"
           style={{ background: `linear-gradient(90deg, transparent, ${product.color}, transparent)` }} />

      {/* Shimmer */}
      <div className="absolute inset-0 card-shimmer pointer-events-none" />

      {/* Preview area */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0"
             style={{ background: `radial-gradient(circle at 30% 30%, ${product.color}35, transparent 70%)` }} />

        {/* Mock portfolio UI */}
        <div className="absolute inset-0 p-3">
          {/* Navbar mock */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-1">
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                <div key={c} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.6 }} />
              ))}
            </div>
            <div className="flex-1 h-1.5 rounded-full mx-2" style={{ background: `${product.color}20` }} />
          </div>
          {/* Hero mock */}
          <div className="mt-2 space-y-1.5">
            <div className="h-3 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="h-2 rounded-full w-1/2" style={{ background: `${product.color}30` }} />
            <div className="h-1.5 rounded-full w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>
          {/* Buttons mock */}
          <div className="flex gap-2 mt-4">
            <div className="h-6 w-20 rounded-lg" style={{ background: product.color, opacity: 0.8 }} />
            <div className="h-6 w-20 rounded-lg border" style={{ borderColor: `${product.color}50`, opacity: 0.5 }} />
          </div>
          {/* Cards mock */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-1 h-10 rounded-lg"
                   style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${product.color}20` }} />
            ))}
          </div>
        </div>

        {/* Hover overlay with Live Preview button */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link href={`/templates/${product.slug}?preview=1`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
                style={{ fontFamily: 'Outfit' }}>
            Live Preview
          </Link>
          <Link href={`/templates/${product.slug}`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: product.color, fontFamily: 'Outfit' }}>
            Details
          </Link>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="font-black text-white text-base truncate" style={{ fontFamily: 'Outfit' }}>
              {product.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">{product.tagline}</p>
          </div>
          {product.badge && (
            <span className={`badge badge-${product.badge.toLowerCase()} shrink-0 mt-0.5`}>{product.badge}</span>
          )}
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.techStack.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                  style={{ background: `${product.color}12`, color: product.color, border: `1px solid ${product.color}25` }}>
              {t}
            </span>
          ))}
          {product.techStack.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/4 text-slate-500 border border-white/5">
              +{product.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Rating + downloads */}
        <div className="flex items-center justify-between mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs font-mono text-slate-600">{product.downloads.toLocaleString()} downloads</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-xs text-slate-600 line-through font-mono">{formatPrice(product.originalPrice)}</div>
            <div className="font-black text-white text-xl leading-none" style={{ fontFamily: 'Outfit' }}>
              {formatPrice(product.price)}
            </div>
          </div>
          <button
            onClick={() => addProduct(product)}
            disabled={inCart}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${inCart
              ? 'border border-green-500/40 text-green-400 bg-green-500/10 cursor-default'
              : 'text-white hover:shadow-lg hover:-translate-y-0.5 hover:shadow-indigo-500/30'}`}
            style={!inCart ? { background: product.color, fontFamily: 'Outfit' } : { fontFamily: 'Outfit' }}>
            {inCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
