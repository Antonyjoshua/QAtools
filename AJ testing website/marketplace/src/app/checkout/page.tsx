'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

type Step = 'cart' | 'payment' | 'success';

export default function CheckoutPage() {
  const { items, total, removeItem, clearCart } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [method, setMethod] = useState<'razorpay' | 'stripe'>('razorpay');
  const [form, setForm] = useState({ name: '', email: '', coupon: '' });
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? Math.round(total * 0.1) : 0;
  const finalTotal = total - discount;

  const handlePayment = () => {
    // Payment gateway integration point
    // For Razorpay: load Razorpay script, open checkout widget
    // For Stripe: redirect to Stripe Checkout session
    alert(`Payment gateway integration required.\n\nIntegrate with:\n• Razorpay: Load razorpay.js and call new Razorpay({...}).open()\n• Stripe: Create a checkout session via API\n\nAmount: ${formatPrice(finalTotal)}`);
    setStep('success');
    clearCart();
  };

  const applyCoupon = () => {
    if (form.coupon.toUpperCase() === 'AJPORTX10') {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code. Try AJPORTX10 for 10% off!');
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center pt-20" style={{ background: '#030309' }}>
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Outfit' }}>Your cart is empty</h1>
          <p className="text-slate-400 mb-6 text-sm">Add some templates to get started</p>
          <Link href="/templates" className="pill-btn pill-btn-primary">Browse Templates →</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20" style={{ background: '#030309' }}>
        <div className="max-w-4xl mx-auto px-6">

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-3 mb-12">
            {[{ id: 'cart', label: '1. Review' }, { id: 'payment', label: '2. Payment' }, { id: 'success', label: '3. Done' }].map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 text-sm font-semibold ${step === s.id ? 'text-white' : step === 'success' || (step === 'payment' && i === 0) ? 'text-green-400' : 'text-slate-600'}`}
                     style={{ fontFamily: 'Outfit' }}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    step === s.id ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                    : step === 'success' || (step === 'payment' && i === 0) ? 'border-green-500/50 bg-green-500/10 text-green-400'
                    : 'border-white/10 text-slate-600'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && <div className="w-8 h-px bg-white/10" />}
              </div>
            ))}
          </div>

          {step === 'cart' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-5 gap-8">
              {/* Cart items */}
              <div className="md:col-span-3">
                <h1 className="text-2xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Review Order</h1>
                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/2">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                           style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))' }}>
                        {item.type === 'bundle' ? '📦' : '🎨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white" style={{ fontFamily: 'Outfit' }}>{item.name}</div>
                        <div className="text-xs text-slate-500 font-mono capitalize">{item.type}</div>
                      </div>
                      <div className="font-black text-white text-lg" style={{ fontFamily: 'Outfit' }}>
                        {formatPrice(item.price)}
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 transition-colors text-sm">✕</button>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2">
                  <input type="text" placeholder="Coupon code (try AJPORTX10)"
                         value={form.coupon} onChange={e => setForm(f => ({ ...f, coupon: e.target.value }))}
                         className="input flex-1 text-sm" />
                  <button onClick={applyCoupon} disabled={couponApplied}
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${couponApplied ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30'}`}
                          style={{ fontFamily: 'Outfit' }}>
                    {couponApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <div className="md:col-span-2">
                <div className="p-6 rounded-2xl border border-white/8 bg-white/2 sticky top-20">
                  <h2 className="font-black text-white mb-5" style={{ fontFamily: 'Outfit' }}>Order Summary</h2>
                  <div className="space-y-3 mb-5 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span><span>{formatPrice(total)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount (10%)</span><span>–{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>Tax</span><span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-black text-white text-lg border-t border-white/8 pt-3" style={{ fontFamily: 'Outfit' }}>
                      <span>Total</span><span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  <button onClick={() => setStep('payment')}
                          className="pill-btn pill-btn-primary w-full justify-center text-sm py-3">
                    Continue to Payment →
                  </button>
                  <div className="mt-4 text-center text-xs font-mono text-slate-600">
                    🔒 Secure checkout · Instant download
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <h1 className="text-2xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Payment Details</h1>

                {/* Contact info */}
                <div className="p-5 rounded-2xl border border-white/8 bg-white/2 mb-5">
                  <h3 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: 'Outfit' }}>Contact Information</h3>
                  <div className="space-y-3">
                    {[
                      { field: 'name', label: 'Full Name', placeholder: 'John Doe' },
                      { field: 'email', label: 'Email Address', placeholder: 'john@example.com' },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="block text-xs font-mono text-slate-500 mb-1 uppercase tracking-widest">{label}</label>
                        <input type={field === 'email' ? 'email' : 'text'} placeholder={placeholder}
                               value={form[field as 'name' | 'email']}
                               onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                               className="input" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment method */}
                <div className="p-5 rounded-2xl border border-white/8 bg-white/2 mb-5">
                  <h3 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: 'Outfit' }}>Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {(['razorpay', 'stripe'] as const).map(m => (
                      <button key={m} onClick={() => setMethod(m)}
                              className={`p-3 rounded-xl border text-sm font-semibold transition-all ${method === m ? 'border-indigo-500/60 bg-indigo-500/10 text-white' : 'border-white/8 text-slate-400 hover:border-white/15'}`}
                              style={{ fontFamily: 'Outfit' }}>
                        {m === 'razorpay' ? '🇮🇳 Razorpay' : '🌐 Stripe'}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/1 text-xs font-mono text-slate-500 text-center">
                    {method === 'razorpay'
                      ? 'Supports UPI, cards, net banking, wallets'
                      : 'Supports Visa, Mastercard, American Express'}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('cart')}
                          className="pill-btn pill-btn-outline text-sm flex-1 justify-center">
                    ← Back
                  </button>
                  <button onClick={handlePayment}
                          disabled={!form.name || !form.email}
                          className={`pill-btn flex-1 justify-center text-sm ${form.name && form.email ? 'pill-btn-primary' : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}>
                    🔒 Pay {formatPrice(finalTotal)}
                  </button>
                </div>
              </div>

              {/* Summary sidebar */}
              <div className="md:col-span-2">
                <div className="p-5 rounded-2xl border border-white/8 bg-white/2 sticky top-20 text-sm">
                  <h2 className="font-black text-white mb-4" style={{ fontFamily: 'Outfit' }}>Your Order</h2>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-slate-400 mb-2">
                      <span className="truncate mr-2">{item.name}</span>
                      <span className="shrink-0">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/5 pt-3 mt-3 flex justify-between font-black text-white" style={{ fontFamily: 'Outfit' }}>
                    <span>Total</span><span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-4xl mx-auto mb-6">
                ✅
              </div>
              <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Outfit' }}>Order Complete!</h1>
              <p className="text-slate-400 mb-2 text-sm max-w-sm mx-auto">
                Thank you for your purchase. Your templates are ready for download.
              </p>
              <p className="text-xs font-mono text-slate-600 mb-8">A confirmation email will be sent to {form.email || 'your email'}.</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/dashboard" className="pill-btn pill-btn-primary">
                  Go to Dashboard →
                </Link>
                <Link href="/templates" className="pill-btn pill-btn-outline">
                  Browse More Templates
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
