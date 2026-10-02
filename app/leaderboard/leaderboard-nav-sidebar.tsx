'use client';

import { useState } from 'react';

import type { LeaderboardStats, LeaderboardTab } from './leaderboard-types';

interface NavSidebarProps {
  stats: LeaderboardStats;
  tab: LeaderboardTab;
}

export function LeaderboardNavSidebar({ stats, tab }: NavSidebarProps) {
  const [openJuz, setOpenJuz] = useState<number | null>(null);

  return (
    <aside className="hidden md:flex flex-col w-72 bg-surface-container-low border-r border-primary/10 overflow-y-auto shrink-0">
      <div className="p-6">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">
          Navigation (Juz)
        </h3>
        <nav className="space-y-1">
          {Array.from({ length: 30 }, (element, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setOpenJuz(openJuz === num ? null : num)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm ${
                openJuz === num
                  ? 'bg-primary/10 text-primary border border-primary/20 font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container font-medium'
              }`}
            >
              <span>Juz {num}</span>
              <span className="material-symbols-outlined text-sm">
                {openJuz === num ? 'expand_more' : 'chevron_right'}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-3">
        {stats.currentUserElo !== null && (
          <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/50">
            <p className="text-xs text-on-surface-variant mb-2">My Player ELO</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-primary">
                {stats.currentUserElo.toLocaleString()}
              </span>
              {stats.currentUserEloChange !== 0 && (
                <span
                  className={`text-[10px] mb-1 px-1 rounded ${
                    stats.currentUserEloChange > 0
                      ? 'text-primary bg-primary/10'
                      : 'text-error bg-error/10'
                  }`}
                >
                  {stats.currentUserEloChange > 0 ? '↑' : '↓'}{' '}
                  {Math.abs(stats.currentUserEloChange)}
                </span>
              )}
            </div>
          </div>
        )}
        {tab === 'page' && stats.totalPageEntries > 0 && (
          <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/50">
            <p className="text-xs text-on-surface-variant mb-1">Pages Tracked</p>
            <span className="text-2xl font-bold text-secondary">{stats.totalPageEntries}</span>
            <p className="text-[11px] text-on-surface-variant mt-0.5">of 604 Mushaf pages</p>
          </div>
        )}
      </div>
    </aside>
  );
}
