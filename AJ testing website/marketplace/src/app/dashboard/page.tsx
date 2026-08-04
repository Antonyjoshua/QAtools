'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { products } from '@/lib/products';

type DashTab = 'downloads' | 'orders' | 'licenses' | 'support' | 'profile';

const mockPurchased = [products[1], products[3]]; // Nexus 3D + CyberVault

export default function DashboardPage() {
  const [tab, setTab] = useState<DashTab>('downloads');

  const tabs: { id: DashTab; label: string; icon: string }[] = [
    { id: 'downloads', label: 'Downloads', icon: '⬇' },
    { id: 'orders',    label: 'Orders',    icon: '📋' },
    { id: 'licenses',  label: 'Licenses',  icon: '🔑' },
    { id: 'support',   label: 'Support',   icon: '💬' },
    { id: 'profile',   label: 'Profile',   icon: '👤' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20" style={{ background: '#030309' }}>
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Dashboard</h1>
              <p className="text-slate-400 text-sm font-mono mt-1">Welcome back, Antony</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-green-500/30 bg-green-500/8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-mono">2 active licenses</span>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Purchased', value: '2', color: '#6366f1', icon: '🎨' },
              { label: 'Downloads', value: '5', color: '#a855f7', icon: '⬇' },
              { label: 'Licenses', value: '2', color: '#06b6d4', icon: '🔑' },
              { label: 'Open Tickets', value: '0', color: '#10b981', icon: '💬' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="p-4 rounded-2xl border border-white/8 bg-white/2 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-white text-2xl" style={{ fontFamily: 'Outfit', color: s.color }}>{s.value}</div>
                <div className="text-xs font-mono text-slate-500">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar tabs */}
            <div className="md:col-span-1">
              <nav className="space-y-1">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                            tab === t.id
                              ? 'bg-indigo-500/15 border border-indigo-500/30 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-white/4'
                          }`}
                          style={{ fontFamily: 'Outfit' }}>
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-white/5">
                  <Link href="/templates"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-indigo-400 hover:bg-indigo-500/8 transition-all"
                        style={{ fontFamily: 'Outfit' }}>
                    + Buy More Templates
                  </Link>
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {tab === 'downloads' && (
                <div>
                  <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Your Templates</h2>
                  {mockPurchased.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      <div className="text-4xl mb-3">📦</div>
                      <p className="text-sm">No templates purchased yet.</p>
                      <Link href="/templates" className="text-indigo-400 text-sm hover:underline mt-2 inline-block">Browse templates →</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockPurchased.map((p, i) => (
                        <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-white/8 bg-white/2">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                               style={{ background: p.cardBg, border: `1px solid ${p.color}30` }}>
                            🎨
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white" style={{ fontFamily: 'Outfit' }}>{p.name}</div>
                            <div className="text-xs text-slate-500 font-mono">v{p.version} · Purchased</div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {p.techStack.slice(0, 3).map(t => (
                                <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                      style={{ background: `${p.color}15`, color: p.color }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                                    style={{ background: p.color, fontFamily: 'Outfit' }}>
                              ⬇ Download
                            </button>
                            <Link href={`/templates/${p.slug}`}
                                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all"
                                  style={{ fontFamily: 'Outfit' }}>
                              Details
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'orders' && (
                <div>
                  <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Order History</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-left">
                          {['Order ID', 'Template', 'Date', 'Amount', 'Status'].map(h => (
                            <th key={h} className="pb-3 pr-6 text-xs font-mono text-slate-500 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          { id: 'AJX-0042', template: 'Nexus 3D', date: '2025-07-01', amount: '$49', status: 'Completed' },
                          { id: 'AJX-0041', template: 'CyberVault', date: '2025-07-11', amount: '$59', status: 'Completed' },
                        ].map(order => (
                          <tr key={order.id} className="text-slate-300">
                            <td className="py-3 pr-6 font-mono text-xs text-slate-500">{order.id}</td>
                            <td className="py-3 pr-6 font-semibold text-white" style={{ fontFamily: 'Outfit' }}>{order.template}</td>
                            <td className="py-3 pr-6 font-mono text-xs text-slate-500">{order.date}</td>
                            <td className="py-3 pr-6 font-bold" style={{ fontFamily: 'Outfit' }}>{order.amount}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-green-500/15 text-green-400 border border-green-500/25">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'licenses' && (
                <div>
                  <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Your Licenses</h2>
                  <div className="space-y-4">
                    {mockPurchased.map(p => (
                      <div key={p.id} className="p-5 rounded-2xl border border-white/8 bg-white/2">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-semibold text-white" style={{ fontFamily: 'Outfit' }}>{p.name}</div>
                          <span className="badge badge-new">Active</span>
                        </div>
                        <div className="font-mono text-xs text-slate-500 mb-2">{p.license}</div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/1">
                          <code className="text-xs font-mono text-indigo-400 flex-1 truncate">
                            AJX-LIC-{p.id.toUpperCase().padStart(4,'0')}-{Math.random().toString(36).slice(2,10).toUpperCase()}
                          </code>
                          <button className="text-xs text-slate-500 hover:text-white transition-colors font-mono">Copy</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'support' && (
                <div>
                  <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Support</h2>
                  <div className="p-6 rounded-2xl border border-white/8 bg-white/2 mb-5 text-center">
                    <div className="text-4xl mb-3">💬</div>
                    <div className="font-semibold text-white mb-1" style={{ fontFamily: 'Outfit' }}>No open tickets</div>
                    <p className="text-sm text-slate-400">Need help? Open a new support request.</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/8 bg-white/2">
                    <h3 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: 'Outfit' }}>Open a Ticket</h3>
                    <div className="space-y-3">
                      <input className="input" placeholder="Subject" />
                      <textarea className="input resize-none" rows={4} placeholder="Describe your issue..." />
                      <button className="pill-btn pill-btn-primary text-sm w-full justify-center">Submit Ticket</button>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'profile' && (
                <div>
                  <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Profile</h2>
                  <div className="p-5 rounded-2xl border border-white/8 bg-white/2">
                    <div className="space-y-4">
                      {[
                        { label: 'Full Name', value: 'Antony Joshua S', placeholder: 'Your name' },
                        { label: 'Email', value: 'antonyjoshua413@gmail.com', placeholder: 'Your email' },
                        { label: 'Location', value: 'Chennai, India', placeholder: 'Your location' },
                      ].map(f => (
                        <div key={f.label}>
                          <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-widest">{f.label}</label>
                          <input className="input" defaultValue={f.value} placeholder={f.placeholder} />
                        </div>
                      ))}
                      <button className="pill-btn pill-btn-primary text-sm mt-2">Save Changes</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
