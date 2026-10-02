import { DailyStatsCards } from './leaderboard-daily-stats';
import type { LeaderboardStats, LeaderboardTab } from './leaderboard-types';

interface StatsCardsProps {
  stats: LeaderboardStats;
  tab: LeaderboardTab;
}

function PlayerPageStatsCards({ stats, tab }: StatsCardsProps) {
  if (tab === 'player') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">
              Global Avg
            </span>
          </div>
          <h4 className="text-3xl font-bold text-on-surface mb-1">
            {stats.globalAvgPlayerElo.toLocaleString()}
          </h4>
          <p className="text-sm text-on-surface-variant">Average player ELO</p>
        </div>
        <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg">
              <span className="material-symbols-outlined text-secondary">sports_score</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Total Games
            </span>
          </div>
          <h4 className="text-3xl font-bold text-on-surface mb-1">
            {stats.totalGamesPlayed.toLocaleString()}
          </h4>
          <p className="text-sm text-on-surface-variant">Games played globally</p>
        </div>
        <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container/20 rounded-lg">
              <span className="material-symbols-outlined text-tertiary">group</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Ranked Players
            </span>
          </div>
          <h4 className="text-3xl font-bold text-on-surface mb-1">
            {stats.totalPlayerEntries.toLocaleString()}
          </h4>
          <p className="text-sm text-on-surface-variant">Players with recorded games</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary">auto_graph</span>
          </div>
          <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">
            Global Avg
          </span>
        </div>
        <h4 className="text-3xl font-bold text-on-surface mb-1">
          {stats.globalAvgPageElo.toLocaleString()}
        </h4>
        <p className="text-sm text-on-surface-variant">Average page difficulty ELO</p>
      </div>
      <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-error-container/20 rounded-lg">
            <span className="material-symbols-outlined text-error">priority_high</span>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Hardest Page
          </span>
        </div>
        <h4 className="text-3xl font-bold text-on-surface mb-1">
          {stats.hardestPageNumber !== null ? `Page ${stats.hardestPageNumber}` : '—'}
        </h4>
        <p className="text-sm text-on-surface-variant">Most answered incorrectly</p>
      </div>
      <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-tertiary-container/20 rounded-lg">
            <span className="material-symbols-outlined text-tertiary">check_circle</span>
          </div>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Easiest Page
          </span>
        </div>
        <h4 className="text-3xl font-bold text-on-surface mb-1">
          {stats.easiestPageNumber !== null ? `Page ${stats.easiestPageNumber}` : '—'}
        </h4>
        <p className="text-sm text-on-surface-variant">Most answered correctly</p>
      </div>
    </div>
  );
}

export default function LeaderboardStatsCards({ stats, tab }: StatsCardsProps) {
  if (tab === 'daily') {
    return <DailyStatsCards stats={stats} />;
  }
  return <PlayerPageStatsCards stats={stats} tab={tab} />;
}
