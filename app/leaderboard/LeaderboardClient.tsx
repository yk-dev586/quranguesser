'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { DailyChallengeTable } from './leaderboard-daily-table';
import { InfoPanel } from './leaderboard-info-panel';
import { PageEloTable } from './leaderboard-page-table';
import LeaderboardStatsCards from './leaderboard-stats-cards';
import { getTabMeta, LeaderboardTabBar } from './leaderboard-tab-bar';
import { LeaderboardTable } from './leaderboard-table';
import type {
  DailyChallengeEntry,
  LeaderboardEntry,
  LeaderboardStats,
  LeaderboardTab,
  PageEloEntry,
} from './leaderboard-types';

export type { LeaderboardEntry, LeaderboardStats };

interface Props {
  playerEntries: LeaderboardEntry[];
  pageEntries: PageEloEntry[];
  dailyEntries: DailyChallengeEntry[];
  currentUserId?: string;
  stats: LeaderboardStats;
}

const PAGE_SIZE = 10;

export default function LeaderboardClient({
  playerEntries,
  pageEntries,
  dailyEntries,
  currentUserId,
  stats,
}: Props) {
  const t = useTranslations('leaderboard');
  const tCommon = useTranslations('common');
  const [tab, setTab] = useState<LeaderboardTab>('player');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (v: string) => {
    setSearch(v);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(v);
      setPage(0);
    }, 250);
  };
  useEffect(
    () => () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    },
    [],
  );

  const filteredPlayers = playerEntries.filter((e) =>
    e.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );
  const normalizedPageSearch = debouncedSearch.replace(/^0+/, '') || debouncedSearch;
  const filteredPages = pageEntries
    .filter((e) =>
      normalizedPageSearch === ''
        ? true
        : String(e.pageNumber) === normalizedPageSearch ||
          String(e.pageNumber).startsWith(normalizedPageSearch),
    )
    .sort((a, b) => {
      if (normalizedPageSearch === '') {
        return 0;
      }
      const aExact = String(a.pageNumber) === normalizedPageSearch;
      const bExact = String(b.pageNumber) === normalizedPageSearch;
      if (aExact && !bExact) {
        return -1;
      }
      if (!aExact && bExact) {
        return 1;
      }
      return 0;
    });
  const filteredDaily = dailyEntries.filter((e) =>
    e.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );
  const filtered =
    tab === 'player' ? filteredPlayers : tab === 'page' ? filteredPages : filteredDaily;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedPlayers = filteredPlayers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pagedPages = filteredPages.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const pagedDaily = filteredDaily.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const meta = getTabMeta(t)[tab];

  const handleTabChange = (newTab: LeaderboardTab) => {
    setTab(newTab);
    setSearch('');
    setDebouncedSearch('');
    setPage(0);
  };

  return (
    <div className="flex h-screen pt-20 overflow-hidden bg-surface text-on-surface">
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-2">
              {meta.title}
            </h1>
            <p className="text-on-surface-variant text-sm">{meta.desc}</p>
          </div>

          <LeaderboardTabBar
            tab={tab}
            onTabChange={handleTabChange}
            search={search}
            onSearchChange={handleSearchChange}
            placeholder={meta.placeholder}
          />

          <LeaderboardStatsCards stats={stats} tab={tab} />

          <div className="bg-surface-container-low border border-primary/20 rounded-3xl overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant text-sm">{meta.empty}</div>
            ) : tab === 'player' ? (
              <LeaderboardTable
                paged={pagedPlayers}
                currentUserId={currentUserId}
                totalEloUsers={stats.totalEloUsers}
              />
            ) : tab === 'page' ? (
              <PageEloTable paged={pagedPages} />
            ) : (
              <DailyChallengeTable
                entries={pagedDaily}
                currentUserId={currentUserId}
                date={stats.dailyDate}
              />
            )}
            <div className="p-6 bg-surface-container-lowest/40 border-t border-primary/10 flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">
                {tCommon('showing', {
                  from: filtered.length === 0 ? 0 : page * PAGE_SIZE + 1,
                  to: Math.min((page + 1) * PAGE_SIZE, filtered.length),
                  total: filtered.length,
                  noun: meta.noun,
                })}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="text-on-surface-variant hover:text-primary active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  aria-label={tCommon('previous')}
                >
                  <span className="material-symbols-outlined">arrow_back_ios</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1 || totalPages === 0}
                  className="text-primary hover:text-on-primary-container active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  aria-label={tCommon('next')}
                >
                  <span className="material-symbols-outlined">arrow_forward_ios</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <InfoPanel tab={tab} />
    </div>
  );
}
