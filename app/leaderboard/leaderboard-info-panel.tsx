'use client';

import { useTranslations } from 'next-intl';

import type { LeaderboardTab } from './leaderboard-types';

interface InfoPanelProps {
  tab: LeaderboardTab;
}

export function InfoPanel({ tab }: InfoPanelProps) {
  const t = useTranslations('leaderboard');

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-surface-container-low border-l border-primary/10 p-8 overflow-y-auto shrink-0">
      <h2 className="text-xl font-bold text-on-surface mb-6">
        {tab === 'player'
          ? t('playerElo')
          : tab === 'page'
            ? t('pageLevelElo')
            : t('dailyChallenge')}
      </h2>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            {tab === 'daily' ? t('howItWorks') : t('theAlgorithm')}
          </h3>
          {tab === 'player' ? (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {t.rich('playerEloDesc', {
                highlight: (chunks) => <strong className="text-primary">{chunks}</strong>,
              })}
            </p>
          ) : tab === 'daily' ? (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {t.rich('dailyEloDesc', {
                highlight: (chunks) => <strong className="text-primary">{chunks}</strong>,
              })}
            </p>
          ) : (
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {t.rich('pageEloDesc', {
                highlight: (chunks) => <strong className="text-primary">{chunks}</strong>,
              })}
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}
