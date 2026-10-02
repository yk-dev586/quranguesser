import { getTranslations } from 'next-intl/server';

import { fmt, pct } from './stats-helpers';
import StatsActivityChart from './StatsActivityChart';
import StatsModeBreakdown from './StatsModeBreakdown';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { getCachedStats } from '@/lib/stats-queries';

export default async function StatsPage() {
  const t = await getTranslations('statsPage');
  const stats = await getCachedStats();

  const overallAccuracy = pct(stats.totalCorrect, stats.totalGames);
  const maxDayTotal = Math.max(...stats.last30Days.map((d) => d.total), 1);

  return (
    <>
      <TopAppBar activeHref="/stats" />
      <main className="min-h-screen bg-surface text-on-surface pt-20 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
            <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
                <span className="material-symbols-outlined text-primary">sports_esports</span>
              </div>
              <p className="text-3xl font-bold text-on-surface">{fmt(stats.totalGames)}</p>
              <p className="text-sm text-on-surface-variant mt-1">{t('gamesPlayed')}</p>
            </div>

            <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
              <div className="p-2 bg-green-500/10 rounded-lg w-fit mb-3">
                <span className="material-symbols-outlined text-green-500">target</span>
              </div>
              <p className="text-3xl font-bold text-on-surface">{overallAccuracy}</p>
              <p className="text-sm text-on-surface-variant mt-1">{t('overallAccuracy')}</p>
            </div>

            <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
              <div className="p-2 bg-secondary/10 rounded-lg w-fit mb-3">
                <span className="material-symbols-outlined text-secondary">group</span>
              </div>
              <p className="text-3xl font-bold text-on-surface">{fmt(stats.uniquePlayers)}</p>
              <p className="text-sm text-on-surface-variant mt-1">{t('activePlayers')}</p>
            </div>

            <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
              <div className="p-2 bg-amber-500/10 rounded-lg w-fit mb-3">
                <span className="material-symbols-outlined text-amber-400">today</span>
              </div>
              <p className="text-3xl font-bold text-on-surface">{fmt(stats.totalToday)}</p>
              <p className="text-sm text-on-surface-variant mt-1">{t('gamesToday')}</p>
            </div>
          </div>

          <StatsActivityChart last30Days={stats.last30Days} maxDayTotal={maxDayTotal} />

          <StatsModeBreakdown modeStats={stats.modeStats} />

          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
            <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                supervised_user_circle
              </span>
              {t('playerOrigin')}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    manage_accounts
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    {t('signedIn')}
                  </span>
                </div>
                <p className="text-2xl font-bold text-on-surface">{fmt(stats.totalAuthGames)}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {t('ofGames', { pct: pct(stats.totalAuthGames, stats.totalGames) })}
                </p>
              </div>
              <div className="bg-surface-container rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                    person_off
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    {t('anonymous')}
                  </span>
                </div>
                <p className="text-2xl font-bold text-on-surface">{fmt(stats.totalAnonGames)}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {t('ofGames', { pct: pct(stats.totalAnonGames, stats.totalGames) })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
