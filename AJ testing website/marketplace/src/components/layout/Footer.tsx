import Link from 'next/link';

const links = {
  Templates: [
    { label: 'Nebula Classic', href: '/templates/nebula-classic' },
    { label: 'Nexus 3D', href: '/templates/nexus-3d' },
    { label: 'Phoenix Fire', href: '/templates/phoenix-fire' },
    { label: 'CyberVault', href: '/templates/cybervault' },
    { label: 'Bundle Deal', href: '/templates?tab=bundle' },
  ],
  Marketplace: [
    { label: 'Browse All', href: '/templates' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Checkout', href: '/checkout' },
  ],
  Legal: [
    { label: 'License Terms', href: '#' },
    { label: 'Refund Policy', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: '#020208', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                <span className="text-white font-black text-xs">AX</span>
              </div>
              <span className="font-black text-white text-base" style={{ fontFamily: 'Outfit' }}>AJPortX</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Premium developer portfolio templates. Handcrafted with Next.js, Three.js, and Framer Motion.
            </p>
            <div className="flex items-center gap-3">
              {['GitHub', 'LinkedIn', 'Email'].map(s => (
                <a key={s} href="#"
                   className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all text-xs font-mono">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">{group}</div>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href}
                          className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs font-mono text-slate-600">
            © {new Date().getFullYear()} AJPortX by Antony Joshua S. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>All templates production-ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
