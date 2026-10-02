import React from 'react';

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

/**
 * Airbnb-style hero section — white canvas, modest 28px/700 headline,
 */
export default async function HeroSection(): Promise<React.JSX.Element> {
  const t = await getTranslations('hero');

  return (
    <section
      className="w-full flex flex-col items-center text-center"
      style={{ backgroundColor: 'var(--color-background)', padding: '64px 24px' }}
    >
      {/* Hero headline — 28px/700 per Airbnb spec */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          lineHeight: 1.43,
          color: 'var(--color-on-surface)',
          maxWidth: 640,
          marginBottom: 8,
        }}
      >
        {t('title')}
      </h1>

      {/* Sub-headline */}
      <p
        style={{
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'var(--color-on-surface-variant)',
          maxWidth: 480,
          marginBottom: 36,
        }}
      >
        {t('subtitle')}
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/quiz"
          className="inline-block bg-primary text-on-primary hover:bg-on-primary-container active:scale-95 transition-all"
          style={{
            borderRadius: 8,
            padding: '14px 24px',
            fontSize: 16,
            fontWeight: 500,
            textDecoration: 'none',
            textAlign: 'center',
            lineHeight: 1.25,
          }}
        >
          {t('exploreQuiz')}
        </Link>
        <Link
          href="/leaderboard"
          className="inline-block bg-background text-on-background hover:bg-surface-container active:scale-95 transition-all"
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            border: '1px solid var(--color-on-surface)',
          }}
        >
          {t('viewLeaderboard')}
        </Link>
      </div>
    </section>
  );
}
