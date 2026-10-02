'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import { PrimaryGameModesProps } from './types';

type RankedProps = Omit<PrimaryGameModesProps, 'openJuzPanel' | 'activeJuzCount'>;

export default function RankedGameCard({
  elo,
  dailyRankedCount,
  dailyRankedLimit,
  rankedLimitReached,
  openModal,
}: RankedProps): React.JSX.Element {
  const t = useTranslations('rankedCard');
  const tCommon = useTranslations('common');
  const eloValue = elo.toLocaleString();
  const [eloBefore = '', eloAfter = ''] = t('eloLabel', { elo: eloValue }).split(eloValue);

  return (
    <button
      onClick={() => openModal('/quiz/missing-word-count?practice=true')}
      disabled={rankedLimitReached}
      className="game-card card-shadow group flex flex-col text-left w-full p-8 rounded-2xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline)',
      }}
    >
      <div className="flex justify-between items-start mb-6 w-full">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            background: 'var(--color-primary-container)',
            border: '1px solid #ffb3c2',
          }}
        >
          <span
            className="material-symbols-outlined text-3xl"
            style={{ color: 'var(--color-primary)' }}
          >
            emoji_events
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'var(--color-primary-container)',
              color: 'var(--color-primary)',
            }}
          >
            {t('competitive')}
          </span>
          {rankedLimitReached && (
            <span
              className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: '#fde8e0', color: 'var(--color-error)' }}
              title={t('limitTooltip', { limit: dailyRankedLimit })}
            >
              {t('limitReached')}
            </span>
          )}
        </div>
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
            style={{ color: 'var(--color-primary)', opacity: 0.7 }}
          >
            workspace_premium
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
            <span title={t('eloTooltip')}>
              {eloBefore}
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{eloValue}</span>
              {eloAfter}
            </span>
            {' · '}
            <span
              title={t('todayTooltip', { count: dailyRankedCount, limit: dailyRankedLimit })}
              style={{
                color: rankedLimitReached
                  ? 'var(--color-error)'
                  : 'var(--color-on-surface-variant)',
                fontWeight: rankedLimitReached ? 700 : 400,
              }}
            >
              {t('todayCount', { count: dailyRankedCount, limit: dailyRankedLimit })}
            </span>
          </span>
        </div>
        <span
          className="px-6 py-2.5 rounded-lg font-bold text-sm inline-block"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
          }}
        >
          {rankedLimitReached ? t('limitReached') : tCommon('start')}
        </span>
      </div>
    </button>
  );
}
