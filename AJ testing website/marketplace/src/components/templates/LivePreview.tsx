'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const viewports = [
  { id: 'desktop' as Viewport, label: 'Desktop', icon: '🖥', w: 1440, h: 900 },
  { id: 'tablet'  as Viewport, label: 'Tablet',  icon: '📟', w: 768,  h: 1024 },
  { id: 'mobile'  as Viewport, label: 'Mobile',  icon: '📱', w: 390,  h: 844  },
];

// Which command to run for each portfolio (shown in the error state)
const startCommands: Record<string, { cmd: string; dir: string; port: number }> = {
  'http://localhost:5000': { cmd: 'npm run dev', dir: 'portfolio-1', port: 5000 },
  'http://localhost:3000': { cmd: 'npm run dev', dir: 'portfolio-2', port: 3000 },
  'http://localhost:5001': { cmd: 'npm run dev', dir: 'portfolio-3', port: 5001 },
  'http://localhost:3001': { cmd: 'npm run dev', dir: 'portfolio-4', port: 3001 },
};

interface LivePreviewProps {
  previewUrl: string;
  productName: string;
  color?: string;
}

export default function LivePreview({ previewUrl, productName, color = '#6366f1' }: LivePreviewProps) {
  const [viewport, setViewport]     = useState<Viewport>('desktop');
  const [fullscreen, setFullscreen] = useState(false);
  const [status, setStatus]         = useState<'loading' | 'loaded' | 'error'>('loading');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef  = useRef<NodeJS.Timeout | null>(null);

  const vp = viewports.find(v => v.id === viewport)!;
  const info = startCommands[previewUrl];

  // Scale iframe to fit container
  const containerW = viewport === 'desktop' ? 860 : viewport === 'tablet' ? 520 : 340;
  const containerH = viewport === 'desktop' ? 500 : viewport === 'tablet' ? 600 : 560;
  const scale = Math.min(containerW / vp.w, containerH / vp.h);

  const resetViewport = (v: Viewport) => {
    setViewport(v);
    setStatus('loading');
  };

  // Timeout if iframe never fires onLoad (blocked by X-Frame-Options)
  useEffect(() => {
    setStatus('loading');
    timerRef.current = setTimeout(() => {
      // If still loading after 6s, assume blocked/not running
      setStatus(prev => prev === 'loading' ? 'error' : prev);
    }, 6000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [previewUrl, viewport]);

  const handleLoad = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // Try to detect a blank/error page — if contentDocument is inaccessible it loaded cross-origin (ok)
    // If accessible and body is empty, that's an error page
    setStatus('loaded');
  };

  const handleError = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus('error');
  };

  const Frame = ({ inModal = false }: { inModal?: boolean }) => {
    const maxW = inModal ? Math.min(window.innerWidth - 40, containerW * 1.4) : containerW;
    const maxH = inModal ? Math.min(window.innerHeight - 120, containerH * 1.4) : containerH;
    const s    = Math.min(maxW / vp.w, maxH / vp.h);

    return (
      <div className="relative overflow-hidden rounded-xl border border-white/10"
           style={{ width: vp.w * s, height: vp.h * s, background: '#050514', flexShrink: 0 }}>

        {/* Loading state */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
               style={{ background: '#0d0d1e' }}>
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                 style={{ borderColor: `${color}40`, borderTopColor: color }} />
            <div className="text-xs font-mono text-slate-500">Connecting to {previewUrl}…</div>
          </div>
        )}

        {/* Error / not running state */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center z-10"
               style={{ background: '#0d0d1e' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                 style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              🚀
            </div>
            <div>
              <div className="font-black text-white text-base mb-1" style={{ fontFamily: 'Outfit' }}>
                {productName} is not running
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Start the portfolio dev server to see the live preview.
              </p>
            </div>
            {info && (
              <div className="w-full max-w-xs">
                <div className="text-[10px] font-mono text-slate-500 mb-1.5 uppercase tracking-widest">Run this in your terminal:</div>
                <div className="p-3 rounded-lg border border-white/8 text-left"
                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-[10px] font-mono text-slate-500 mb-1">cd "{info.dir}"</div>
                  <div className="text-xs font-mono" style={{ color }}>
                    <span className="text-slate-500">$ </span>{info.cmd}
                  </div>
                  <div className="text-[10px] font-mono text-slate-600 mt-1.5">→ opens on port {info.port}</div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <a href={previewUrl} target="_blank" rel="noreferrer"
                 className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                 style={{ background: color, fontFamily: 'Outfit' }}>
                Try opening ↗
              </a>
              <button onClick={() => setStatus('loading')}
                      className="px-4 py-2 rounded-lg text-xs font-semibold border border-white/10 text-slate-300 hover:text-white hover:border-white/25 transition-all"
                      style={{ fontFamily: 'Outfit' }}>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* The actual iframe */}
        <iframe
          ref={iframeRef}
          key={`${previewUrl}-${viewport}`}
          src={previewUrl}
          title={`${productName} live preview`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width:  vp.w,
            height: vp.h,
            border: 'none',
            display: 'block',
            transform: `scale(${s})`,
            transformOrigin: 'top left',
            opacity: status === 'loaded' ? 1 : 0,
            pointerEvents: 'none',
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  };

  return (
    <>
      <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: '#0a0a1a' }}>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 flex-wrap">
          {/* Viewport switcher */}
          <div className="flex items-center gap-1 bg-white/4 rounded-lg p-1">
            {viewports.map(v => (
              <button key={v.id} onClick={() => resetViewport(v.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewport === v.id
                          ? 'text-white bg-white/10'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}>
                <span>{v.icon}</span>
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>

          {/* URL pill */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 bg-white/2 min-w-0">
            <div className={`w-2 h-2 rounded-full shrink-0 ${status === 'loaded' ? 'bg-green-400' : status === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'}`} />
            <span className="text-xs font-mono text-slate-500 truncate">{previewUrl}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <a href={previewUrl} target="_blank" rel="noreferrer"
               className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/8 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">
              ↗ <span className="hidden sm:inline">Open</span>
            </a>
            <button onClick={() => setFullscreen(true)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/8 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">
              ⤢ <span className="hidden sm:inline">Full</span>
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex items-center justify-center p-6 overflow-hidden"
             style={{ background: 'radial-gradient(ellipse at center, #0d0d20 0%, #050514 100%)', minHeight: 300 }}>
          <Frame />
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-600">{vp.w} × {vp.h}px · {Math.round(scale * 100)}%</span>
          <span className={`text-[10px] font-mono ${status === 'loaded' ? 'text-green-500' : status === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
            {status === 'loaded' ? '● Live' : status === 'error' ? '● Offline' : '● Connecting'}
          </span>
        </div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex flex-col"
                      style={{ background: '#030309' }}>
            {/* Modal toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-1 bg-white/4 rounded-lg p-1">
                {viewports.map(v => (
                  <button key={v.id} onClick={() => resetViewport(v.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewport === v.id ? 'text-white bg-white/10' : 'text-slate-500 hover:text-slate-300'}`}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 bg-white/2">
                <div className={`w-2 h-2 rounded-full shrink-0 ${status === 'loaded' ? 'bg-green-400' : status === 'error' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'}`} />
                <span className="text-xs font-mono text-slate-500">{previewUrl}</span>
              </div>
              <a href={previewUrl} target="_blank" rel="noreferrer"
                 className="px-3 py-2 rounded-lg border border-white/8 text-xs text-slate-400 hover:text-white transition-all">↗ Open</a>
              <button onClick={() => setFullscreen(false)}
                      className="px-3 py-2 rounded-lg border border-white/8 text-xs text-slate-400 hover:text-white transition-all">✕ Close</button>
            </div>

            {/* Modal iframe */}
            <div className="flex-1 flex items-center justify-center overflow-hidden p-6">
              <Frame inModal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
