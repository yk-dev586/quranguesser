'use client';

import { useTranslations } from 'next-intl';

import type { LeaderboardTab } from './leaderboard-types';

interface TabMeta {
  title: string;
  desc: string;
  placeholder: string;
  empty: string;
  noun: string;
}

export function getTabMeta(t: ReturnType<typeof useTranslations>): Record<LeaderboardTab, TabMeta> {
  return {
    player: {
      title: t('playerRankings'),
      desc: t('playerDesc'),
      placeholder: t('searchPlayers'),
      empty: t('noEntries'),
      noun: t('players'),
    },
    page: {
      title: t('pageDifficulty'),
      desc: t('pageDesc'),
      placeholder: t('searchPage'),
      empty: t('noEntries'),
      noun: t('pages'),
    },
    daily: {
      title: t('dailyRankings'),
      desc: t('dailyDesc'),
      placeholder: t('searchPlayers'),
      empty: t('noDailyEntries'),
      noun: t('completions'),
    },
  };
}

interface Props {
  tab: LeaderboardTab;
  onTabChange: (tab: LeaderboardTab) => void;
  search: string;
  onSearchChange: (v: string) => void;
  placeholder: string;
}

export function LeaderboardTabBar({
  tab,
  onTabChange,
  search,
  onSearchChange,
  placeholder,
}: Props) {
  const t = useTranslations('leaderboard');
  const tabs: { id: LeaderboardTab; label: string; icon: string }[] = [
    { id: 'player', label: t('playerElo'), icon: 'person' },
    { id: 'page', label: t('pageLevelElo'), icon: 'menu_book' },
    { id: 'daily', label: t('dailyChallenge'), icon: 'today' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div
        role="tablist"
        aria-label="Leaderboard categories"
        className="flex gap-1 shrink-0 bg-surface-container border border-outline-variant rounded-xl p-1"
      >
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTabChange(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${tab === id ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
              {label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-surface-container border border-outline-variant rounded-xl px-3 py-2">
        <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
          search
        </span>
        <input
          type="search"
          aria-label={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-on-surface text-sm outline-none placeholder:text-on-surface-variant w-44"
        />
      </div>
    </div>
  );
}
