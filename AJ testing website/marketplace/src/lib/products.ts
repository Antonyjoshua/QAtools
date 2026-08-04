export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  category: string[];
  tags: string[];
  techStack: string[];
  features: string[];
  animations: string[];
  pages: number;
  previewUrl: string;
  color: string;
  gradient: string;
  cardBg: string;
  badge?: 'New' | 'Popular' | 'Featured' | 'Hot';
  rating: number;
  reviews: number;
  downloads: number;
  version: string;
  lastUpdated: string;
  license: string;
  folderStructure: string[];
  documentation: { title: string; content: string }[];
  changelog: ChangelogEntry[];
  faq: FAQ[];
  responsive: boolean;
  darkMode: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'nebula-classic',
    name: 'Nebula Classic',
    tagline: 'Clean, professional & timeless',
    description: 'A polished vanilla HTML/CSS/JS portfolio with animated particle background, radar skill chart, and smooth scroll — zero dependencies, instant setup.',
    longDescription: `Nebula Classic delivers everything you need in a developer portfolio — without the weight of a framework. Built entirely with HTML5, CSS3, and Vanilla JavaScript, it loads in milliseconds and works anywhere.

The animated particle background creates an immediately impressive first impression, while the interactive radar chart elegantly displays your skill levels. The theme toggle lets visitors switch between dark and light modes with a smooth transition.

Every section — Hero, About, Skills, Experience, Projects, Certifications, and Contact — is meticulously crafted with smooth reveal animations triggered on scroll. The responsive layout looks equally sharp on any screen size.

Perfect for developers who want a fast, beautiful, dependency-free portfolio they can host on GitHub Pages, Netlify, or any static host in minutes.`,
    price: 19,
    originalPrice: 39,
    category: ['Minimal Portfolio', 'Personal Branding', 'Dark Theme'],
    tags: ['HTML', 'CSS', 'JavaScript', 'Vanilla JS', 'No Framework', 'Static'],
    techStack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Canvas API'],
    features: [
      'Zero framework dependencies',
      'Animated particle background (Canvas)',
      'Interactive radar skill chart',
      'Dark / Light theme toggle',
      'Smooth scroll reveal animations',
      'Responsive across all devices',
      'Single file deployment',
      'GitHub Pages ready',
      'Custom CSS variables system',
      'Contact form with email link',
    ],
    animations: [
      'Particle canvas animation',
      'Scroll-triggered section reveals',
      'Radar chart draw animation',
      'Typewriter role text',
      'Hover glow on cards',
      'Smooth theme transitions',
      'Floating profile image',
    ],
    pages: 1,
    previewUrl: 'http://localhost:5000',
    color: '#6366f1',
    gradient: 'from-indigo-600 via-blue-700 to-slate-900',
    cardBg: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    badge: 'Popular',
    rating: 4.8,
    reviews: 214,
    downloads: 1320,
    version: '2.1.0',
    lastUpdated: '2025-06-15',
    license: 'Single Use Commercial',
    folderStructure: [
      'nebula-classic/',
      '├── index.html',
      '├── style.css',
      '├── main.js',
      '├── profile.jpg',
      '├── resume.pdf',
      '└── README.md',
    ],
    documentation: [
      { title: 'Quick Start', content: 'Open index.html in any browser. No build step required. Customize name, bio, skills, and projects directly in the HTML file.' },
      { title: 'Customization', content: 'All colors are defined as CSS custom properties in the :root selector. Update profile.jpg for your photo and resume.pdf for your CV.' },
      { title: 'Deployment', content: 'Deploy to GitHub Pages by pushing to a repo and enabling Pages. Works with Netlify, Vercel (static), and any static host.' },
    ],
    changelog: [
      { version: '2.1.0', date: '2025-06-15', changes: ['Added radar skill chart', 'Improved mobile nav', 'Performance optimizations'] },
      { version: '2.0.0', date: '2025-03-10', changes: ['Complete redesign', 'Added dark/light toggle', 'New particle system'] },
      { version: '1.0.0', date: '2024-11-20', changes: ['Initial release'] },
    ],
    faq: [
      { question: 'Do I need Node.js to use this?', answer: 'No. Just open index.html in a browser. No build step, no dependencies.' },
      { question: 'Can I use this for a client project?', answer: 'Yes. The Single Use Commercial license covers one project for one client.' },
      { question: 'How do I change the particle colors?', answer: 'Edit the color arrays in the ParticleSystem class inside main.js.' },
    ],
    responsive: true,
    darkMode: true,
  },
  {
    id: '2',
    slug: 'nexus-3d',
    name: 'Nexus 3D',
    tagline: 'Next.js + Three.js interactive experience',
    description: 'A full Next.js 14 portfolio with a live Three.js 3D universe, AI chatbot, Framer Motion animations, and TypeScript — production-deployed on Vercel.',
    longDescription: `Nexus 3D is a fully-featured Next.js 14 portfolio that blurs the line between a portfolio and an immersive web experience. The Three.js background renders a real-time 3D universe directly in the browser — particles, connected nodes, and depth-of-field effects that respond to your cursor.

Built with TypeScript throughout, the codebase is clean, maintainable, and Vercel-ready. Framer Motion handles all page and component transitions with spring physics that feel natural and premium.

The integrated AI Chatbot (powered by configurable API) lets visitors ask questions about your experience and skills, answering instantly without you having to be online. This alone sets Nexus 3D apart from every other portfolio template in the market.

The radar skills chart, experience timeline, project showcase, and contact form are all polished to perfection. Deploy to Vercel in one click.`,
    price: 49,
    originalPrice: 89,
    category: ['3D Portfolio', 'AI Portfolio', 'Dark Theme'],
    tags: ['Next.js', 'React', 'Three.js', 'TypeScript', 'AI Chatbot', 'Vercel'],
    techStack: ['Next.js 14', 'React 18', 'TypeScript', 'Three.js', 'React Three Fiber', 'Framer Motion', 'Tailwind CSS'],
    features: [
      'Live Three.js 3D background universe',
      'AI Chatbot (configurable API)',
      'Next.js App Router architecture',
      'TypeScript throughout',
      'Framer Motion transitions',
      'Radar skill chart (SVG)',
      'Animated experience timeline',
      'Project showcase grid',
      'Vercel one-click deploy',
      'Dark mode optimized',
    ],
    animations: [
      'Three.js particle universe',
      'Framer Motion page transitions',
      'Spring physics interactions',
      'Cursor parallax',
      'Staggered section reveals',
      'Radar chart draw animation',
      'Hover depth effects',
      'Chatbot slide-in panel',
    ],
    pages: 1,
    previewUrl: 'http://localhost:3000',
    color: '#a855f7',
    gradient: 'from-violet-700 via-purple-800 to-indigo-900',
    cardBg: 'linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)',
    badge: 'Featured',
    rating: 4.9,
    reviews: 89,
    downloads: 620,
    version: '1.3.0',
    lastUpdated: '2025-07-01',
    license: 'Single Use Commercial',
    folderStructure: [
      'nexus-3d/',
      '├── src/',
      '│   ├── app/',
      '│   ├── components/',
      '│   └── lib/',
      '├── public/',
      '├── package.json',
      '├── tailwind.config.js',
      '└── README.md',
    ],
    documentation: [
      { title: 'Quick Start', content: 'Run `npm install` then `npm run dev`. Opens at localhost:3000. Configure your data in src/lib/data.ts.' },
      { title: 'AI Chatbot Setup', content: 'Add your API key to .env.local. The chatbot uses the Anthropic Claude API by default, but is configurable for any LLM.' },
      { title: 'Deployment', content: 'Connect your GitHub repo to Vercel. Add environment variables in the Vercel dashboard. One-click deploy.' },
    ],
    changelog: [
      { version: '1.3.0', date: '2025-07-01', changes: ['Added AI chatbot', 'Performance improvements', 'Mobile nav fix'] },
      { version: '1.2.0', date: '2025-05-20', changes: ['Three.js upgrade to r166', 'Added radar chart', 'Theme cleanup'] },
      { version: '1.0.0', date: '2025-02-15', changes: ['Initial release with Three.js background'] },
    ],
    faq: [
      { question: 'Which Node.js version do I need?', answer: 'Node.js 18.17 or higher, as required by Next.js 14.' },
      { question: 'Is the AI chatbot included?', answer: 'Yes. The UI is included. You need an API key (Anthropic or OpenAI) to power it.' },
      { question: 'Can I remove the Three.js background?', answer: 'Yes. The background is a standalone component you can safely remove or replace.' },
    ],
    responsive: true,
    darkMode: true,
  },
  {
    id: '3',
    slug: 'phoenix-fire',
    name: 'Phoenix Fire',
    tagline: 'Bold, blazing & unforgettable',
    description: 'A high-energy HTML/CSS/JS portfolio with a bold orange fire aesthetic — inspired by championship-winning visual design — built to make you stand out.',
    longDescription: `Phoenix Fire is a statement. It breaks away from the safe, muted palettes of most developer portfolios and instead embraces bold orange-red fire gradients, kinetic animations, and an intense visual identity that reflects energy and ambition.

The design draws inspiration from sports brand aesthetics — dynamic, powerful, and modern. Every section burns with purposeful animation: the hero text blazes in with a fire reveal, the timeline shimmers, and the skill sections pulse with life.

Despite its bold appearance, Phoenix Fire maintains professional structure: Hero, About, Experience, Skills, Projects, Certifications, and Contact are all present and properly organized for hiring managers and clients to navigate.

Zero framework required — the entire portfolio ships as static HTML/CSS/JS. Light enough to host anywhere, powerful enough to leave a lasting impression.`,
    price: 29,
    originalPrice: 59,
    category: ['Creative Portfolio', 'Dark Theme', 'Animated Portfolio'],
    tags: ['HTML', 'CSS', 'JavaScript', 'Bold Design', 'Fire Theme', 'Static'],
    techStack: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Canvas API', 'SVG Animations'],
    features: [
      'Bold orange fire color system',
      'Kinetic hero text animations',
      'Animated experience timeline',
      'Skills with progress bars',
      'Project showcase with hover effects',
      'Certifications section',
      'Responsive mobile layout',
      'Zero framework dependencies',
      'Custom CSS animation system',
      'Dark mode by design',
    ],
    animations: [
      'Fire gradient hero animations',
      'Scroll-triggered section reveals',
      'Timeline shimmer effects',
      'Skill bar progress animations',
      'Card hover glow effects',
      'Particle burst transitions',
      'Text scramble effects',
    ],
    pages: 1,
    previewUrl: 'http://localhost:5001',
    color: '#f97316',
    gradient: 'from-orange-600 via-red-700 to-orange-900',
    cardBg: 'linear-gradient(135deg, #431407 0%, #1c0a00 100%)',
    badge: 'Hot',
    rating: 4.7,
    reviews: 156,
    downloads: 890,
    version: '1.5.0',
    lastUpdated: '2025-06-28',
    license: 'Single Use Commercial',
    folderStructure: [
      'phoenix-fire/',
      '├── index.html',
      '├── style.css',
      '├── main.js',
      '├── profile.jpg',
      '├── resume.pdf',
      '└── README.md',
    ],
    documentation: [
      { title: 'Quick Start', content: 'Open index.html in any browser. No build step needed. Replace name, bio, and images to make it yours.' },
      { title: 'Color Customization', content: 'The fire theme uses CSS variables. Change --fire-primary and --fire-secondary to shift the palette entirely.' },
      { title: 'Deployment', content: 'Upload files to any static host. Works with GitHub Pages, Netlify, and Vercel static deployments.' },
    ],
    changelog: [
      { version: '1.5.0', date: '2025-06-28', changes: ['Improved scroll performance', 'Added certifications section', 'Mobile nav improvements'] },
      { version: '1.3.0', date: '2025-04-10', changes: ['New hero animation', 'Timeline redesign'] },
      { version: '1.0.0', date: '2024-12-01', changes: ['Initial release'] },
    ],
    faq: [
      { question: 'Can I change the fire colors to another palette?', answer: 'Yes. Update the CSS variables in :root. The system is designed to be color-theme-swappable.' },
      { question: 'Is this good for non-developer roles?', answer: 'Absolutely. The bold design works for designers, marketers, and creatives too.' },
      { question: 'Does it work on mobile?', answer: 'Yes. Fully responsive with a dedicated mobile navigation.' },
    ],
    responsive: true,
    darkMode: true,
  },
  {
    id: '4',
    slug: 'cybervault',
    name: 'CyberVault',
    tagline: 'Cinematic · AI-powered · World-class',
    description: 'A world-class cinematic Next.js 14 portfolio with Three.js particles, Framer Motion, glassmorphism, smooth scroll, AI Lab section, custom cursor, and a draggable cyber bug mascot.',
    longDescription: `CyberVault is the pinnacle of personal portfolio design — an immersive, cinematic experience that puts your career front-and-center with AAA-quality production value.

From the moment visitors land on your site, they're greeted by a dramatic system boot loader (3-second cinematic sequence), followed by a hero section with a live Three.js particle universe, a typing animation that cycles through your roles, and letter-by-letter name reveal with spring physics.

The full page experience includes:
- **AI Control Room** (About) — holographic avatar with floating stat panels
- **Mission Timeline** (Experience) — futuristic timeline with expandable job cards
- **Project Chambers** (Projects) — 3D tilt glass cards with click-to-expand modals
- **Tech Mastery** (Skills) — glowing orbital skill bars
- **Battle Certified** (Certifications) — premium glassmorphism credential cards
- **AI Research Laboratory** — scanline monitor interface for AI experiments
- **Open Channel** (Contact) — terminal boot sequence contact form

The draggable cyber bug mascot (red/blue armored robotic bug with glowing eyes and holographic wings) roams the page as an interactive mascot. Custom magnetic cursor. Lenis smooth scroll. The works.`,
    price: 59,
    originalPrice: 119,
    category: ['AI Portfolio', 'Glassmorphism', '3D Portfolio', 'Dark Theme', 'Animated Portfolio'],
    tags: ['Next.js', 'Three.js', 'Framer Motion', 'TypeScript', 'Glassmorphism', 'AI', 'QA', 'Lenis'],
    techStack: ['Next.js 14', 'React 18', 'TypeScript', 'Three.js', 'React Three Fiber', 'Framer Motion', 'GSAP', 'Lenis', 'Tailwind CSS'],
    features: [
      'Cinematic system boot loader',
      'Three.js 2500-particle universe',
      'Framer Motion letter-by-letter reveals',
      'Custom magnetic cursor',
      'Lenis smooth scroll',
      'Glassmorphism UI system',
      'Animated mission timeline (Experience)',
      '3D tilt project cards with modals',
      'AI Research Laboratory section',
      'Draggable cyber bug mascot',
      'Mobile hamburger nav',
      'Terminal-style contact form',
    ],
    animations: [
      'Cinematic loader (3s boot sequence)',
      'Three.js particle field with cursor interaction',
      'Spring-physics letter reveals',
      'Mouse parallax hero',
      'Magnetic button effect',
      'Timeline glowing nodes',
      '3D perspective card tilt',
      'Glassmorphism hover blooms',
      'Scanline monitor effects',
      'Draggable mascot with tooltip',
      'Lenis smooth scroll throughout',
    ],
    pages: 1,
    previewUrl: 'http://localhost:3001',
    color: '#06b6d4',
    gradient: 'from-cyan-600 via-blue-800 to-indigo-900',
    cardBg: 'linear-gradient(135deg, #050514 0%, #0a0a2e 100%)',
    badge: 'New',
    rating: 5.0,
    reviews: 12,
    downloads: 94,
    version: '1.0.0',
    lastUpdated: '2025-07-11',
    license: 'Single Use Commercial',
    folderStructure: [
      'cybervault/',
      '├── src/',
      '│   ├── app/',
      '│   │   ├── page.tsx',
      '│   │   ├── layout.tsx',
      '│   │   └── globals.css',
      '│   ├── components/',
      '│   │   ├── Hero.tsx',
      '│   │   ├── About.tsx',
      '│   │   ├── Experience.tsx',
      '│   │   ├── Projects.tsx',
      '│   │   ├── Skills.tsx',
      '│   │   ├── Certifications.tsx',
      '│   │   ├── AILab.tsx',
      '│   │   ├── Contact.tsx',
      '│   │   ├── CyberBug.tsx',
      '│   │   ├── Loader.tsx',
      '│   │   ├── CustomCursor.tsx',
      '│   │   ├── Navigation.tsx',
      '│   │   ├── ParticleField.tsx',
      '│   │   └── Footer.tsx',
      '│   └── lib/',
      '│       └── data.ts',
      '├── public/',
      '├── package.json',
      '└── README.md',
    ],
    documentation: [
      { title: 'Quick Start', content: 'Run `npm install` then `npm run dev`. Your site opens at localhost:3000. Edit src/lib/data.ts to insert your personal information — all profile data is in one file.' },
      { title: 'Customization', content: 'Colors are in globals.css as CSS custom properties (--cyan, --purple, --bg etc). Swap the Three.js particle colors in ParticleField.tsx. Customize the cyber bug SVG paths in CyberBug.tsx.' },
      { title: 'Data Configuration', content: 'Update profile, roles, experience, projects, skills, certifications, and aiLab arrays in src/lib/data.ts. The entire content of the site flows from this single file.' },
      { title: 'Deployment', content: 'Deploy to Vercel: `vercel --prod`. Or run `npm run build && npm run start`. Environment variables are not required for the base portfolio.' },
    ],
    changelog: [
      { version: '1.0.0', date: '2025-07-11', changes: ['Initial release — cinematic loader', 'Three.js particle hero', 'All 8 sections', 'CyberBug mascot', 'Custom cursor', 'Lenis smooth scroll'] },
    ],
    faq: [
      { question: 'How do I update my personal info?', answer: 'All content lives in src/lib/data.ts. Edit the profile, experience, projects, skills, and other arrays there.' },
      { question: 'Can I disable the boot loader?', answer: 'Yes. Set the loader timeout to 0 in page.tsx, or remove the Loader component import entirely.' },
      { question: 'Does the cyber bug cause performance issues?', answer: 'No. It uses CSS pointer events and lightweight SVG. The Three.js canvas is the main GPU consumer, and it\'s optimized with dpr:[1,1.5].' },
      { question: 'Can I add more sections?', answer: 'Yes. Create a new component in src/components, import it in page.tsx, and add a nav link in Navigation.tsx.' },
    ],
    responsive: true,
    darkMode: true,
  },
];

export const bundle = {
  id: 'bundle-all',
  name: 'Complete Bundle',
  tagline: 'All 4 premium templates — one unbeatable price',
  price: 99,
  originalPrice: 156,
  savings: 57,
  products: products.map(p => p.id),
  gradient: 'from-indigo-700 via-purple-700 to-cyan-700',
  color: '#a855f7',
};

export function getProduct(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export const categories = [
  { id: 'all', label: 'All Templates', count: products.length },
  { id: 'AI Portfolio', label: 'AI Portfolio' },
  { id: '3D Portfolio', label: '3D Portfolio' },
  { id: 'Minimal Portfolio', label: 'Minimal' },
  { id: 'Glassmorphism', label: 'Glassmorphism' },
  { id: 'Creative Portfolio', label: 'Creative' },
  { id: 'Dark Theme', label: 'Dark Theme' },
  { id: 'Animated Portfolio', label: 'Animated' },
  { id: 'Personal Branding', label: 'Personal Branding' },
];
