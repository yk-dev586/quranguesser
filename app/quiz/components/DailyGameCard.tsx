'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { PrimaryGameModesProps } from './types';

type DailyProps = Pick<PrimaryGameModesProps, 'openModal'>;

export default function DailyGameCard({ openModal }: DailyProps): React.JSX.Element {
  const t = useTranslations('dailyCard');
  const tCommon = useTranslations('common');

  return (
    <button
      onClick={() => openModal('/quiz/locate-verse?practice=true')}
      className="game-card card-shadow group flex flex-col text-left w-full p-8 rounded-2xl transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline)',
      }}
    >
      <div className="flex justify-between items-start mb-6 w-full">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: 'var(--color-surface-container)',
            border: '1px solid var(--color-outline)',
          }}
        >
          <span
            className="material-symbols-outlined text-3xl"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            auto_stories
          </span>
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'var(--color-surface-container-low)',
            border: '1px solid var(--color-outline)',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          {t('dailyCasual')}
        </span>
      </div>
      <h4 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-on-surface)' }}>
        {t('title')}
      </h4>
      <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
        {t('desc')}
      </p>
      <div
        className="mt-auto flex items-center justify-between rounded-xl p-4 w-full"
        style={{
          background: 'var(--color-surface-container)',
          border: '1px solid var(--color-outline)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            shuffle
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
            {t('mode')}{' '}
            <span style={{ color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
              {t('dailyFreePlay')}
            </span>
          </span>
        </div>
        <span
          className="px-6 py-2.5 rounded-lg font-bold text-sm inline-block"
          style={{
            border: '1px solid var(--color-outline)',
            color: 'var(--color-on-surface)',
            background: 'var(--color-surface-container-lowest)',
          }}
        >
          {tCommon('play')}
        </span>
      </div>
    </button>
  );
}
