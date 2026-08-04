'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { products } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

type AdminTab = 'overview' | 'templates' | 'orders' | 'coupons' | 'analytics';

const mockOrders = [
  { id: 'AJX-0042', customer: 'Ravi Kumar', email: 'ravi@example.com', template: 'Nexus 3D', amount: 49, date: '2025-07-01', status: 'completed' },
  { id: 'AJX-0041', customer: 'Sarah Chen', email: 'sarah@example.com', template: 'CyberVault', amount: 59, date: '2025-07-11', status: 'completed' },
  { id: 'AJX-0040', customer: 'Mohamed Al', email: 'mo@example.com', template: 'Bundle All', amount: 99, date: '2025-07-10', status: 'completed' },
  { id: 'AJX-0039', customer: 'Priya S', email: 'priya@example.com', template: 'Phoenix Fire', amount: 29, date: '2025-07-09', status: 'completed' },
];

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('overview');

  const totalRevenue = mockOrders.reduce((s, o) => s + o.amount, 0);
  const totalOrders  = mockOrders.length;
  const totalDownloads = products.reduce((s, p) => s + p.downloads, 0);

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview',   label: 'Overview',   icon: '📊' },
    { id: 'templates',  label: 'Templates',  icon: '🎨' },
    { id: 'orders',     label: 'Orders',     icon: '📋' },
    { id: 'coupons',    label: 'Coupons',    icon: '🎟' },
    { id: 'analytics',  label: 'Analytics',  icon: '📈' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#030309' }}>
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-white/5 flex flex-col"
           style={{ background: '#07070f' }}>
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <span className="text-white font-black text-xs">AX</span>
            </div>
            <div className="leading-none">
              <div className="font-black text-white text-sm" style={{ fontFamily: 'Outfit' }}>AJPortX</div>
              <div className="text-[9px] font-mono text-slate-600">ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      tab === t.id
                        ? 'bg-indigo-500/15 border border-indigo-500/25 text-white'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/4'
                    }`}
                    style={{ fontFamily: 'Outfit' }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors font-mono">
            ← Back to site
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 sticky top-0 backdrop-blur-xl z-10"
             style={{ background: 'rgba(3,3,9,0.9)' }}>
          <h1 className="font-black text-white capitalize" style={{ fontFamily: 'Outfit' }}>
            {tab}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-500">Admin: Antony Joshua</div>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-400">
              A
            </div>
          </div>
        </div>

        <div className="p-8">

          {tab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* KPI cards */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Revenue', value: `$${totalRevenue}`, icon: '💰', color: '#10b981', sub: '+22% this month' },
                  { label: 'Total Orders', value: totalOrders, icon: '📋', color: '#6366f1', sub: '4 this week' },
                  { label: 'Downloads', value: totalDownloads.toLocaleString(), icon: '⬇', color: '#a855f7', sub: '+156 today' },
                  { label: 'Templates', value: products.length, icon: '🎨', color: '#06b6d4', sub: 'All published' },
                ].map((kpi, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-white/8 bg-white/2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px"
                         style={{ background: `linear-gradient(90deg, transparent, ${kpi.color}60, transparent)` }} />
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xl">{kpi.icon}</span>
                      <span className="text-xs font-mono text-slate-600">{kpi.sub}</span>
                    </div>
                    <div className="font-black text-white text-2xl mb-0.5" style={{ fontFamily: 'Outfit', color: kpi.color }}>
                      {kpi.value}
                    </div>
                    <div className="text-xs font-mono text-slate-500">{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="font-black text-white" style={{ fontFamily: 'Outfit' }}>Recent Orders</h2>
                  <button onClick={() => setTab('orders')} className="text-xs text-indigo-400 hover:text-indigo-300 font-mono">View all →</button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Order', 'Customer', 'Template', 'Amount', 'Status'].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-mono text-slate-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {mockOrders.slice(0, 3).map(o => (
                      <tr key={o.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-3 font-mono text-xs text-slate-500">{o.id}</td>
                        <td className="px-6 py-3 text-white font-medium" style={{ fontFamily: 'Outfit' }}>{o.customer}</td>
                        <td className="px-6 py-3 text-slate-300">{o.template}</td>
                        <td className="px-6 py-3 font-bold text-white" style={{ fontFamily: 'Outfit' }}>{formatPrice(o.amount)}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-green-500/15 text-green-400 border border-green-500/25">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === 'templates' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Manage Templates</h2>
                <button className="pill-btn pill-btn-primary text-xs px-4 py-2">+ Upload New</button>
              </div>
              <div className="space-y-3">
                {products.map((p, i) => (
                  <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-white/8 bg-white/2">
                    <div className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0"
                         style={{ borderColor: `${p.color}30`, background: `${p.color}10` }}>
                      <div className="text-lg">🎨</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white" style={{ fontFamily: 'Outfit' }}>{p.name}</span>
                        {p.badge && <span className={`badge badge-${p.badge.toLowerCase()}`}>{p.badge}</span>}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">v{p.version} · {p.downloads} downloads · {formatPrice(p.price)}</div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/templates/${p.slug}`}
                            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all"
                            style={{ fontFamily: 'Outfit' }}>
                        Preview
                      </Link>
                      <button className="px-3 py-1.5 rounded-lg text-xs text-white transition-all hover:-translate-y-0.5"
                              style={{ background: p.color, fontFamily: 'Outfit' }}>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>All Orders</h2>
              <div className="rounded-2xl border border-white/8 bg-white/2 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Order ID', 'Customer', 'Email', 'Template', 'Amount', 'Date', 'Status'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {mockOrders.map(o => (
                      <tr key={o.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{o.id}</td>
                        <td className="px-5 py-3 text-white font-medium" style={{ fontFamily: 'Outfit' }}>{o.customer}</td>
                        <td className="px-5 py-3 text-slate-400 font-mono text-xs">{o.email}</td>
                        <td className="px-5 py-3 text-slate-300">{o.template}</td>
                        <td className="px-5 py-3 font-bold text-white" style={{ fontFamily: 'Outfit' }}>{formatPrice(o.amount)}</td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{o.date}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-green-500/15 text-green-400 border border-green-500/25">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === 'coupons' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Coupons</h2>
                <button className="pill-btn pill-btn-primary text-xs px-4 py-2">+ Create Coupon</button>
              </div>
              <div className="space-y-3">
                {[
                  { code: 'AJPORTX10', discount: '10%', usage: '47/100', expires: '2025-12-31', status: 'active' },
                  { code: 'LAUNCH50',  discount: '50%', usage: '12/20',  expires: '2025-07-31', status: 'active' },
                  { code: 'NEWYEAR25', discount: '25%', usage: '20/20',  expires: '2025-01-31', status: 'expired' },
                ].map(c => (
                  <div key={c.code} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-white/8 bg-white/2">
                    <code className="font-mono text-indigo-400 text-sm font-bold">{c.code}</code>
                    <div className="flex-1 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                      <span>{c.discount} off</span>
                      <span>Used: {c.usage}</span>
                      <span>Expires: {c.expires}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${c.status === 'active' ? 'bg-green-500/15 text-green-400 border-green-500/25' : 'bg-red-500/15 text-red-400 border-red-500/25'}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-black text-white mb-6" style={{ fontFamily: 'Outfit' }}>Analytics</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                {products.map(p => (
                  <div key={p.id} className="p-5 rounded-2xl border border-white/8 bg-white/2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                      <span className="font-semibold text-white" style={{ fontFamily: 'Outfit' }}>{p.name}</span>
                      <span className="ml-auto text-xs font-mono text-slate-500">{formatPrice(p.price)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: 'Downloads', value: p.downloads.toLocaleString() },
                        { label: 'Rating', value: `${p.rating}★` },
                        { label: 'Reviews', value: p.reviews },
                      ].map(s => (
                        <div key={s.label}>
                          <div className="font-black text-white text-lg" style={{ fontFamily: 'Outfit', color: p.color }}>{s.value}</div>
                          <div className="text-[10px] font-mono text-slate-600">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(p.downloads / 1500) * 100}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl border border-amber-500/15 bg-amber-500/4 text-center">
                <div className="text-xs font-mono text-amber-500">
                  📊 Full analytics with charts (Chart.js / Recharts) can be added — connect Supabase or Plausible for real-time data.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
