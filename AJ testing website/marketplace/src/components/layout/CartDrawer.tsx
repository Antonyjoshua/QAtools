'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { items, total, isOpen, closeCart, removeItem } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={closeCart}
                      className="fixed inset-0 z-50"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{ background: '#0d0d1e', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <h2 className="font-black text-white text-lg" style={{ fontFamily: 'Outfit' }}>Your Cart</h2>
                <p className="text-xs text-slate-500 font-mono">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={closeCart}
                      className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm">
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <div className="text-4xl mb-3">🛒</div>
                  <div className="text-slate-400 text-sm">Your cart is empty</div>
                  <Link href="/templates" onClick={closeCart}
                        className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-mono underline underline-offset-2">
                    Browse templates →
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <motion.div key={item.id} layout
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-white/2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                         style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))' }}>
                      {item.type === 'bundle' ? '📦' : '🎨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'Outfit' }}>{item.name}</div>
                      <div className="text-xs text-indigo-400 font-bold">{formatPrice(item.price)}</div>
                    </div>
                    <button onClick={() => removeItem(item.id)}
                            className="text-slate-600 hover:text-red-400 transition-colors text-sm">✕</button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">Total</span>
                  <span className="font-black text-white text-xl" style={{ fontFamily: 'Outfit' }}>
                    {formatPrice(total)}
                  </span>
                </div>
                <Link href="/checkout" onClick={closeCart}
                      className="pill-btn pill-btn-primary w-full justify-center text-sm py-3">
                  Proceed to Checkout →
                </Link>
                <button onClick={closeCart}
                        className="mt-2 w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-2 font-mono">
                  Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
