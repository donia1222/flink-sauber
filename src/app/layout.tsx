import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import 'lenis/dist/lenis.css';
import '../styles/global.css';
import { display, sans } from './fonts';
import Motion from '../components/Motion';

export const metadata: Metadata = {
  title: 'DF Flink Sauber · Reinigung in Liechtenstein',
  description:
    'DF Flink Sauber aus Triesen: Fensterreinigung, Wohnungsreinigung mit Abgabegarantie, Büroreinigung, Hauswartung und Teppichreinigung in ganz Liechtenstein.',
  robots: 'noindex, follow',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a1628',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
      </head>
      <body className="min-h-svh overflow-x-clip">
        {children}
        <Motion />
      </body>
    </html>
  );
}
