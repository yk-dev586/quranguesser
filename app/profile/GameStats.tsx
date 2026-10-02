import { getTranslations } from 'next-intl/server';

import { pct } from './utils';

interface GameStatsProps {
  streak: number;
  eloFormatted: string;
  user: {
    gamesPlayed: number;
    mwcCorrect: number;
    lvGames: number;
    lvCorrect: number;
    nvGames: number;
    nvCorrect: number;
    tqGames: number;
    tqCorrect: number;
  };
}

export default async function GameStats({ streak, eloFormatted, user }: GameStatsProps) {
  const t = await getTranslations('profilePage');
  const tCommon = await getTranslations('common');

  return (
    <>
      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
          <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
            <span className="material-symbols-outlined text-primary">trending_up</span>
          </div>
          <h4 className="text-3xl font-bold text-on-surface">{eloFormatted}</h4>
          <p className="text-sm text-on-surface-variant mt-1">{t('eloRating')}</p>
        </div>

        <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
          <div className="p-2 bg-amber-500/10 rounded-lg w-fit mb-3">
            <span className="material-symbols-outlined text-amber-400">local_fire_department</span>
          </div>
          <h4 className="text-3xl font-bold text-on-surface">{streak}</h4>
          <p className="text-sm text-on-surface-variant mt-1">{t('dayStreak')}</p>
        </div>

        <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
          <div className="p-2 bg-secondary-container rounded-lg w-fit mb-3">
            <span className="material-symbols-outlined text-secondary">sports_esports</span>
          </div>
          <h4 className="text-3xl font-bold text-on-surface">
            {user.gamesPlayed.toLocaleString()}
          </h4>
          <p className="text-sm text-on-surface-variant mt-1">{t('rankedGames')}</p>
        </div>

        <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
          <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3">
            <span className="material-symbols-outlined text-primary">target</span>
          </div>
          <h4 className="text-3xl font-bold text-on-surface">
            {pct(user.mwcCorrect, user.gamesPlayed)}
          </h4>
          <p className="text-sm text-on-surface-variant mt-1">{t('rankedAccuracy')}</p>
        </div>
      </div>

      {/* Game mode breakdown */}
      <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
          {t('gameModeStats')}
        </h2>

        {/* Missing Word Count */}
        <div className="flex items-center justify-between py-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">
                find_replace
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{t('mwcTitle')}</p>
              <p className="text-xs text-on-surface-variant">{t('mwcDesc')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">
              {user.gamesPlayed.toLocaleString()} {tCommon('games')}
            </p>
            <p className="text-xs text-on-surface-variant">
              {pct(user.mwcCorrect, user.gamesPlayed)} {tCommon('accuracy')}
            </p>
          </div>
        </div>

        {/* Verse Location */}
        <div className="flex items-center justify-between py-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-[18px]">
                my_location
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{t('verseLocation')}</p>
              <p className="text-xs text-on-surface-variant">{t('verseLocationDesc')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">
              {user.lvGames.toLocaleString()} {tCommon('games')}
            </p>
            <p className="text-xs text-on-surface-variant">
              {pct(user.lvCorrect, user.lvGames)} {tCommon('accuracy')}
            </p>
          </div>
        </div>

        {/* Verse Quest */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                format_quote
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{t('verseQuest')}</p>
              <p className="text-xs text-on-surface-variant">{t('verseQuestDesc')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">
              {user.nvGames.toLocaleString()} {tCommon('games')}
            </p>
            <p className="text-xs text-on-surface-variant">
              {pct(user.nvCorrect, user.nvGames)} {tCommon('accuracy')}
            </p>
          </div>
        </div>

        {/* Translation Quiz */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-700 text-[18px]">
                translate
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">{t('translationQuiz')}</p>
              <p className="text-xs text-on-surface-variant">{t('translationQuizDesc')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">
              {user.tqGames?.toLocaleString()} {tCommon('games')}
            </p>
            <p className="text-xs text-on-surface-variant">
              {pct(user.tqCorrect, user.tqGames)} {tCommon('accuracy')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
