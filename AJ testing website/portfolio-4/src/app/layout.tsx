import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Antony Joshua S — AI Quality Engineer',
  description: 'World-class cinematic portfolio of Antony Joshua S — AI Quality Engineer, Automation Specialist, Playwright Expert. 2500+ defects found. 3+ years experience.',
  keywords: 'Quality Analyst, QA Engineer, Playwright, TypeScript, Selenium, AI Testing, Chennai',
  authors: [{ name: 'Antony Joshua S' }],
  openGraph: {
    title: 'Antony Joshua S — AI Quality Engineer',
    description: '2500+ bugs reported. 100+ automated tests. Building the future of QA.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
