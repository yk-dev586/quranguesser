import React from 'react';

import { getTranslations } from 'next-intl/server';

/* eslint-disable @typescript-eslint/no-unused-vars */
interface Props {
  userName: string;
  elo: number;
  streak: number;
  dailyRankedCount: number;
  dailyRankedLimit: number;
}

const STREAK_GOAL = 1;

export default async function DashboardHeader({
  userName,
  elo,
  streak,
  dailyRankedCount,
  dailyRankedLimit,
}: Props): Promise<React.JSX.Element> {
  const t = await getTranslations('dashboard');
  const circumference = 2 * Math.PI * 20;
  const streakOffset = circumference - circumference * Math.min(streak / STREAK_GOAL, 1);

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
      {/* ── Left: greeting ── */}
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {t('bismillah')}
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: 'var(--color-on-surface)' }}
        >
          {t('welcomeBack', { name: userName })}
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 16 }}>{t('howAreYou')}</p>
      </div>

      {/* ── Right: stat chips ── */}
      <div
        className="flex flex-wrap gap-4 items-center p-4 rounded-2xl shrink-0"
        style={{
          background: 'var(--color-surface-container-low)',
          border: '1px solid var(--color-outline)',
        }}
      >
        {/* ELO */}
        <div className="flex items-center gap-3 px-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--color-primary-container)',
              border: '1px solid #ffb3c2',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--color-primary)', fontSize: 20 }}
            >
              star_rate
            </span>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {t('elo')}
            </p>
            <span className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
              {elo.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="w-px h-10 hidden md:block" style={{ background: 'var(--color-outline)' }} />

        {/* Streak */}
        <div className="flex items-center gap-3 px-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="transparent"
                stroke="var(--color-outline-variant)"
                strokeWidth="3"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="transparent"
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={streakOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-bold" style={{ color: 'var(--color-on-surface)' }}>
                {streak}
              </span>
            </div>
          </div>
          <div>
            <p
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {t('streak')}
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
              {streak >= STREAK_GOAL
                ? t('goalReached')
                : t('toGoal', { count: STREAK_GOAL - streak })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
