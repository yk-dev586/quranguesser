'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

export default function AboutSection(): React.JSX.Element {
  const t = useTranslations('about');

  const LINKS = [
    { label: t('github'), icon: 'code', href: 'https://github.com/runsdev/quran-guessr/issues' },
    { label: t('quranCom'), icon: 'menu_book', href: 'https://quran.com' },
    {
      label: t('quranApi'),
      icon: 'api',
      href: 'https://api-docs.quran.foundation/',
    },
    {
      label: t('supportMe'),
      icon: 'volunteer_activism',
      href: 'https://ko-fi.com/runsha/tip',
    },
  ];

  return (
    <section
      id="about"
      style={{ backgroundColor: 'var(--color-surface-container-low)', padding: '80px 24px' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {t('label')}
        </p>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-on-surface)',
            lineHeight: 1.3,
            marginBottom: 48,
          }}
        >
          {t('title')}
        </h2>

        {/* ── Card ── */}
        <div
          className="flex flex-col md:flex-row"
          style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {/* Avatar column */}
          <div
            className="w-full md:w-1/3 lg:w-70 shrink-0 flex items-center justify-center min-h-60"
            style={{
              background: 'var(--color-outline-variant)',
            }}
          >
            {/* If you drop an actual <img /> here later, you can add className="w-full h-full object-cover" to it */}
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 72, color: 'var(--color-outline)' }}
            >
              person
            </span>
          </div>

          {/* Content column */}
          <div style={{ padding: '36px 40px', flex: 1 }}>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--color-on-surface)',
                marginBottom: 4,
              }}
            >
              {t('authorName')}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: 'var(--color-primary)',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {t('authorRole')}
            </p>
            <p
              style={{
                fontSize: 16,
                color: 'var(--color-on-surface-variant)',
                lineHeight: 1.65,
                marginBottom: 28,
                textAlign: 'justify',
              }}
            >
              {t('authorBio')}
            </p>

            {/* Links */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    border: '1px solid var(--color-outline)',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    textDecoration: 'none',
                    background: 'var(--color-surface-container-lowest)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {link.icon}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
