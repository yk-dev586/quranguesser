'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { PrimaryGameModesProps } from './types';

type HeaderProps = Pick<PrimaryGameModesProps, 'openJuzPanel' | 'activeJuzCount'>;

export default function SectionHeader({
  openJuzPanel,
  activeJuzCount,
}: HeaderProps): React.JSX.Element {
  const t = useTranslations('section');

  return (
    <div className="flex items-end justify-between">
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {t('gameModes')}
        </p>
        <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
          {t('selectGameMode')}
        </h3>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>{t('chooseMode')}</p>
      </div>
      <button
        onClick={openJuzPanel}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:bg-surface-container active:scale-95 shrink-0"
        style={{
          border: '1px solid var(--color-outline)',
          background: 'var(--color-surface-container-lowest)',
          color: 'var(--color-on-surface-variant)',
          fontSize: 12,
        }}
        aria-label={t('juzFilter')}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          filter_list
        </span>
        <span>
          {t('juzFilter')}
          {activeJuzCount < 30 && (
            <span
              className="ml-1 text-xs font-bold rounded-full px-1.5 py-0.5"
              style={{
                background: 'var(--color-primary-container)',
                color: 'var(--color-primary)',
              }}
            >
              {activeJuzCount}
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
