export interface ThemeScene {
  background:        string;
  fogColor:          string;
  fogNear:           number;
  fogFar:            number;
  ambientColor:      string;
  ambientIntensity:  number;
  primary:           string;
  secondary:         string;
  tertiary:          string;
}

export interface ThemeConfig {
  id:        string;
  name:      string;
  emoji:     string;
  gradient:  string;
  swatches:  [string, string, string, string];
  css:       Record<string, string>;
  scene:     ThemeScene;
}

export const themes: Record<string, ThemeConfig> = {
  'midnight-ai': {
    id:       'midnight-ai',
    name:     'Midnight AI',
    emoji:    '⚡',
    gradient: 'linear-gradient(135deg,#030711 0%,#0d1040 50%,#071526 100%)',
    swatches: ['#030711','#7c3aed','#06b6d4','#a855f7'],
    css: {
      '--bg':              '#030711',
      '--bg-alt':          '#0a0f2e',
      '--card-bg':         'rgba(15,23,42,0.68)',
      '--card-bg-strong':  'rgba(15,23,42,0.92)',
      '--card-border':     'rgba(148,163,184,0.08)',
      '--t1':              '#7c3aed',
      '--t1-rgb':          '124,58,237',
      '--t2':              '#06b6d4',
      '--t2-rgb':          '6,182,212',
      '--t3':              '#a855f7',
      '--t3-rgb':          '168,85,247',
      '--text':            '#f8fafc',
      '--muted':           '#94a3b8',
      '--subtle':          '#475569',
      '--glow1':           'rgba(124,58,237,0.4)',
      '--glow2':           'rgba(6,182,212,0.4)',
      '--scrollbar':       '#7c3aed',
    },
    scene: {
      background: '#030711', fogColor: '#030711',
      fogNear: 18, fogFar: 110,
      ambientColor: '#1a0540', ambientIntensity: 0.18,
      primary: '#7c3aed', secondary: '#06b6d4', tertiary: '#a855f7',
    },
  },

  'cyber-purple': {
    id:       'cyber-purple',
    name:     'Cyber Purple',
    emoji:    '🌌',
    gradient: 'linear-gradient(135deg,#0d0118 0%,#1a0535 50%,#0a011a 100%)',
    swatches: ['#0d0118','#9333ea','#d946ef','#c026d3'],
    css: {
      '--bg':              '#0d0118',
      '--bg-alt':          '#180330',
      '--card-bg':         'rgba(26,5,53,0.68)',
      '--card-bg-strong':  'rgba(26,5,53,0.92)',
      '--card-border':     'rgba(147,51,234,0.15)',
      '--t1':              '#9333ea',
      '--t1-rgb':          '147,51,234',
      '--t2':              '#d946ef',
      '--t2-rgb':          '217,70,239',
      '--t3':              '#c026d3',
      '--t3-rgb':          '192,38,211',
      '--text':            '#faf5ff',
      '--muted':           '#c4b5fd',
      '--subtle':          '#7e22ce',
      '--glow1':           'rgba(147,51,234,0.5)',
      '--glow2':           'rgba(217,70,239,0.4)',
      '--scrollbar':       '#9333ea',
    },
    scene: {
      background: '#0d0118', fogColor: '#0d0118',
      fogNear: 14, fogFar: 100,
      ambientColor: '#1a003a', ambientIntensity: 0.2,
      primary: '#9333ea', secondary: '#d946ef', tertiary: '#c026d3',
    },
  },

  'emerald-matrix': {
    id:       'emerald-matrix',
    name:     'Emerald Matrix',
    emoji:    '🌿',
    gradient: 'linear-gradient(135deg,#000c00 0%,#001a0a 50%,#000800 100%)',
    swatches: ['#000c00','#10b981','#00e676','#34d399'],
    css: {
      '--bg':              '#000c00',
      '--bg-alt':          '#001200',
      '--card-bg':         'rgba(0,20,8,0.68)',
      '--card-bg-strong':  'rgba(0,20,8,0.92)',
      '--card-border':     'rgba(16,185,129,0.15)',
      '--t1':              '#10b981',
      '--t1-rgb':          '16,185,129',
      '--t2':              '#00e676',
      '--t2-rgb':          '0,230,118',
      '--t3':              '#34d399',
      '--t3-rgb':          '52,211,153',
      '--text':            '#ecfdf5',
      '--muted':           '#6ee7b7',
      '--subtle':          '#065f46',
      '--glow1':           'rgba(16,185,129,0.5)',
      '--glow2':           'rgba(0,230,118,0.4)',
      '--scrollbar':       '#10b981',
    },
    scene: {
      background: '#000c00', fogColor: '#000c00',
      fogNear: 14, fogFar: 100,
      ambientColor: '#001a05', ambientIntensity: 0.2,
      primary: '#10b981', secondary: '#00e676', tertiary: '#34d399',
    },
  },

  'sunset-orange': {
    id:       'sunset-orange',
    name:     'Sunset Orange',
    emoji:    '🌅',
    gradient: 'linear-gradient(135deg,#0a0814 0%,#1a0a00 50%,#0f0510 100%)',
    swatches: ['#0a0814','#f97316','#f59e0b','#fb923c'],
    css: {
      '--bg':              '#0a0814',
      '--bg-alt':          '#150a00',
      '--card-bg':         'rgba(20,10,5,0.68)',
      '--card-bg-strong':  'rgba(20,10,5,0.92)',
      '--card-border':     'rgba(249,115,22,0.15)',
      '--t1':              '#f97316',
      '--t1-rgb':          '249,115,22',
      '--t2':              '#f59e0b',
      '--t2-rgb':          '245,158,11',
      '--t3':              '#fb923c',
      '--t3-rgb':          '251,146,60',
      '--text':            '#fff7ed',
      '--muted':           '#fed7aa',
      '--subtle':          '#92400e',
      '--glow1':           'rgba(249,115,22,0.5)',
      '--glow2':           'rgba(245,158,11,0.4)',
      '--scrollbar':       '#f97316',
    },
    scene: {
      background: '#0a0814', fogColor: '#0a0814',
      fogNear: 14, fogFar: 100,
      ambientColor: '#1a0800', ambientIntensity: 0.2,
      primary: '#f97316', secondary: '#f59e0b', tertiary: '#fb923c',
    },
  },

  'arctic-white': {
    id:       'arctic-white',
    name:     'Arctic White',
    emoji:    '❄️',
    gradient: 'linear-gradient(135deg,#f8fafc 0%,#e0f2fe 50%,#f0f9ff 100%)',
    swatches: ['#f8fafc','#1d4ed8','#0ea5e9','#3b82f6'],
    css: {
      '--bg':              '#f0f4f8',
      '--bg-alt':          '#e2e8f0',
      '--card-bg':         'rgba(255,255,255,0.78)',
      '--card-bg-strong':  'rgba(255,255,255,0.96)',
      '--card-border':     'rgba(0,0,0,0.07)',
      '--t1':              '#1d4ed8',
      '--t1-rgb':          '29,78,216',
      '--t2':              '#0ea5e9',
      '--t2-rgb':          '14,165,233',
      '--t3':              '#3b82f6',
      '--t3-rgb':          '59,130,246',
      '--text':            '#0f172a',
      '--muted':           '#475569',
      '--subtle':          '#94a3b8',
      '--glow1':           'rgba(29,78,216,0.2)',
      '--glow2':           'rgba(14,165,233,0.15)',
      '--scrollbar':       '#1d4ed8',
    },
    scene: {
      background: '#dde6f0', fogColor: '#dde6f0',
      fogNear: 12, fogFar: 90,
      ambientColor: '#c7d8f8', ambientIntensity: 0.65,
      primary: '#1d4ed8', secondary: '#0ea5e9', tertiary: '#3b82f6',
    },
  },

  'crimson-neon': {
    id:       'crimson-neon',
    name:     'Crimson Neon',
    emoji:    '🔴',
    gradient: 'linear-gradient(135deg,#080000 0%,#1a0000 50%,#0a0000 100%)',
    swatches: ['#080000','#dc2626','#f43f5e','#ef4444'],
    css: {
      '--bg':              '#080000',
      '--bg-alt':          '#140000',
      '--card-bg':         'rgba(20,0,0,0.68)',
      '--card-bg-strong':  'rgba(20,0,0,0.92)',
      '--card-border':     'rgba(220,38,38,0.15)',
      '--t1':              '#dc2626',
      '--t1-rgb':          '220,38,38',
      '--t2':              '#f43f5e',
      '--t2-rgb':          '244,63,94',
      '--t3':              '#ef4444',
      '--t3-rgb':          '239,68,68',
      '--text':            '#fff1f2',
      '--muted':           '#fca5a5',
      '--subtle':          '#991b1b',
      '--glow1':           'rgba(220,38,38,0.5)',
      '--glow2':           'rgba(244,63,94,0.4)',
      '--scrollbar':       '#dc2626',
    },
    scene: {
      background: '#080000', fogColor: '#080000',
      fogNear: 14, fogFar: 100,
      ambientColor: '#1a0000', ambientIntensity: 0.2,
      primary: '#dc2626', secondary: '#f43f5e', tertiary: '#ef4444',
    },
  },
};

export const themeList   = Object.values(themes);
export const defaultTheme = 'midnight-ai';

// Inline script injected in <head> to apply saved theme before React hydrates (no flicker)
export const antiFlashScript = `(function(){try{
  var saved=localStorage.getItem('aj-theme')||'${defaultTheme}';
  var map=${JSON.stringify(
    Object.fromEntries(
      Object.entries(themes).map(([id, t]) => [id, t.css])
    )
  )};
  var css=map[saved]||map['midnight-ai'];
  var r=document.documentElement;
  r.setAttribute('data-theme',saved);
  Object.keys(css).forEach(function(k){r.style.setProperty(k,css[k]);});
}catch(e){}})();`;
