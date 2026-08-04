import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { antiFlashScript } from '@/lib/themes';

export const metadata: Metadata = {
  title: 'Antony Joshua S — Quality Analyst',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  description:
    'Quality Analyst with 3+ years of experience in automation, AI testing, and enterprise QA engineering. Expert in Playwright, TypeScript, Selenium, and AI-driven quality systems.',
  keywords:
    'Quality Analyst, QA Engineer, Playwright, TypeScript, Selenium, Automation Testing, AI Testing, Chennai',
  authors: [{ name: 'Antony Joshua S' }],
  openGraph: {
    title: 'Antony Joshua S — Quality Analyst',
    description: '2500+ bugs reported. 100+ automated tests. Building the future of QA.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Anti-flash: apply saved theme before React hydrates to prevent color flicker */}
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
