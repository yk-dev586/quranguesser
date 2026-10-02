import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Toaster } from 'sonner';

import MaterialSymbolsLoader from './components/MaterialSymbolsLoader';
import SessionProvider from './components/providers/SessionProvider';
import ThemeProvider from './components/providers/ThemeProvider';

import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quranguessr.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'QuranGuessr — Test Your Knowledge of the Holy Quran', template: '%s | QuranGuessr' },
  description: 'Interactive Quran quizzes with local Quran data and offline-first reading.',
  keywords: ['Quran', 'quiz', 'Islamic', 'Quran game', 'verse location', 'missing word', 'translation'],
  authors: [{ name: 'QuranGuessr' }],
  openGraph: {
    type: 'website', locale: 'en_US', url: SITE_URL, siteName: 'QuranGuessr',
    title: 'QuranGuessr — Test Your Knowledge of the Holy Quran',
    description: 'Interactive Quran quizzes with local Quran data and offline-first reading.',
    images: [{ url: '/quran-hero.jpg', width: 1200, height: 630, alt: 'QuranGuessr' }],
  },
  twitter: {
    card: 'summary_large_image', title: 'QuranGuessr — Test Your Knowledge of the Holy Quran',
    description: 'Interactive Quran quizzes with local Quran data and offline-first reading.',
    images: ['/quran-hero.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  alternates: { canonical: SITE_URL },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${GeistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="ugY-qC7oXMg5tU6qAy3jb3F70tAmhio1uWMoy2rpICQ" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <SessionProvider session={null}>{children}</SessionProvider>
          </NextIntlClientProvider>
          <MaterialSymbolsLoader />
          <Toaster position="bottom-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
