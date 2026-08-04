/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        space:   '#030309',
        ink:     '#07070f',
        surface: '#0d0d1e',
        indigo:  { 500: '#6366f1', 400: '#818cf8', 600: '#4f46e5' },
        violet:  { 500: '#8b5cf6', 600: '#7c3aed' },
        cyan:    { 400: '#22d3ee', 500: '#06b6d4' },
        neon:    '#10b981',
        ember:   '#f97316',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-indigo': 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 3s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'border-spin': 'border-spin 4s linear infinite',
      },
      keyframes: {
        float:         { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        'glow-pulse':  { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        shimmer:       { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'border-spin': { to: { '--border-angle': '360deg' } },
      },
    },
  },
  plugins: [],
};
