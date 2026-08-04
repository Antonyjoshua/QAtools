/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        space:    '#050514',
        navy:     '#0a0a2e',
        void:     '#080821',
        cyan:     '#00d4ff',
        purple:   '#7c3aed',
        'purple-light': '#a855f7',
        neon:     '#00ff88',
        pink:     '#ff2d78',
      },
      fontFamily: {
        display: ['Exo 2', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float':       'float 4s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'scan':        'scan 3s linear infinite',
        'hologram':    'hologram 6s ease-in-out infinite',
        'spin-slow':   'spin 12s linear infinite',
        'border-spin': 'borderSpin 4s linear infinite',
      },
      keyframes: {
        float:      { '0%,100%': { transform:'translateY(0px)' }, '50%': { transform:'translateY(-12px)' } },
        glowPulse:  { '0%,100%': { opacity:'0.6' }, '50%': { opacity:'1' } },
        scan:       { '0%': { top:'-2px' }, '100%': { top:'100%' } },
        hologram:   { '0%,90%,100%': { opacity:'1' }, '92%': { opacity:'0.2' }, '94%': { opacity:'1' }, '96%': { opacity:'0.4' }, '98%': { opacity:'1' } },
        borderSpin: { '0%': { transform:'rotate(0deg)' }, '100%': { transform:'rotate(360deg)' } },
      },
      backgroundImage: {
        'grid':      "linear-gradient(rgba(0,212,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.04) 1px,transparent 1px)",
        'radial-glow': 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
};
