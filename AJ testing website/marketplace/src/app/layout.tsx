import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'AJPortX — Premium Developer Portfolio Templates',
  description: 'Premium developer portfolio templates. Modern, 3D, AI-powered, and production-ready. Buy once, own forever.',
  keywords: ['portfolio template', 'developer portfolio', 'Next.js template', 'Three.js portfolio', 'buy portfolio template'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
