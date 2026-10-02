'use client';

import type { LeaderboardStats } from './leaderboard-types';

export function DailyStatsCards({ stats }: { stats: LeaderboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary">emoji_events</span>
          </div>
          <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">
            Top Score
          </span>
        </div>
        <h4 className="text-3xl font-bold text-on-surface mb-1">
          {stats.dailyTopScore !== null ? stats.dailyTopScore.toLocaleString() : '—'}
        </h4>
        <p className="text-sm text-on-surface-variant">Highest score today</p>
      </div>
      <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-secondary-container rounded-lg">
            <span className="material-symbols-outlined text-secondary">group</span>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Completions
          </span>
        </div>
        <h4 className="text-3xl font-bold text-on-surface mb-1">
          {stats.dailyCompletions.toLocaleString()}
        </h4>
        <p className="text-sm text-on-surface-variant">Players who finished today</p>
      </div>
      <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-tertiary-container/20 rounded-lg">
            <span className="material-symbols-outlined text-tertiary">person</span>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Your Score
          </span>
        </div>
        <h4 className="text-3xl font-bold text-on-surface mb-1">
          {stats.currentUserDailyScore !== null
            ? stats.currentUserDailyScore.toLocaleString()
            : '—'}
        </h4>
        <p className="text-sm text-on-surface-variant">Your score for today</p>
      </div>
    </div>
  );
}
