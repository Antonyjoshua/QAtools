/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:    '#030711',
        card:  'rgba(15,23,42,0.7)',
        violet: {
          DEFAULT: '#7c3aed',
          light:   '#a855f7',
          dark:    '#6d28d9',
          glow:    'rgba(124,58,237,0.4)',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          light:   '#22d3ee',
          glow:    'rgba(6,182,212,0.4)',
        },
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50:  '#f8fafc',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'float-fast':   'float 4s ease-in-out infinite',
        'pulse-ring':   'pulseRing 2.5s ease-out infinite',
        'spin-slow':    'spin 12s linear infinite',
        'gradient':     'gradientShift 6s ease infinite',
        'scan':         'scan 3s linear infinite',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
        'count-up':     'countUp 0.8s ease-out forwards',
        'border-glow':  'borderGlow 3s ease-in-out infinite',
        'shimmer':      'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-20px)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.6' },
          '50%':     { opacity: '1' },
        },
        borderGlow: {
          '0%,100%': { borderColor: 'rgba(124,58,237,0.4)' },
          '50%':     { borderColor: 'rgba(6,182,212,0.4)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'violet-sm':  '0 0 20px rgba(124,58,237,0.3)',
        'violet-md':  '0 0 40px rgba(124,58,237,0.4)',
        'violet-lg':  '0 0 80px rgba(124,58,237,0.5)',
        'cyan-sm':    '0 0 20px rgba(6,182,212,0.3)',
        'cyan-md':    '0 0 40px rgba(6,182,212,0.4)',
        'glow':       '0 0 60px rgba(124,58,237,0.35), 0 0 120px rgba(6,182,212,0.2)',
        'card':       '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.2)',
      },
    },
  },
  plugins: [],
};
