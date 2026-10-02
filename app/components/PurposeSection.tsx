'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

export default function PurposeSection(): React.JSX.Element {
  const t = useTranslations('purpose');

  const FEATURES = [
    {
      icon: 'auto_stories',
      title: t('featureDeepen'),
      desc: t('featureDeepenDesc'),
    },
    {
      icon: 'emoji_events',
      title: t('featureCompete'),
      desc: t('featureCompeteDesc'),
    },
    {
      icon: 'calendar_today',
      title: t('featureDaily'),
      desc: t('featureDailyDesc'),
    },
  ];

  return (
    <section
      id="purpose"
      style={{ backgroundColor: 'var(--color-background)', padding: '80px 24px' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div style={{ maxWidth: 560, marginBottom: 56 }}>
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
              marginBottom: 12,
            }}
          >
            {t('title')}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--color-on-surface-variant)', lineHeight: 1.65 }}>
            {t('desc')}
          </p>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 20 }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: 'var(--color-surface-container-low)',
                borderRadius: 14,
                padding: '28px 28px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 32, color: 'var(--color-primary)' }}
              >
                {f.icon}
              </span>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--color-on-surface)',
                  lineHeight: 1.35,
                  margin: 0,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--color-on-surface-variant)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
