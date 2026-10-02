'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

export default function QuizProgressHeader({
  questionNumber,
  score,
  timeLeft,
  onEndSession,
}: {
  questionNumber: number;
  score?: number;
  timeLeft?: number;
  onEndSession?: () => void;
}): React.JSX.Element {
  const t = useTranslations('nextVerseQuiz');
  const tCommon = useTranslations('common');
  const totalAnswered = questionNumber - 1;
  const masteryPct = totalAnswered > 0 && score !== undefined ? (score / totalAnswered) * 100 : 0;

  return (
    <>
      <div className="w-full flex flex-col gap-2 pt-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {onEndSession && (
              <button
                onClick={onEndSession}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                aria-label={tCommon('endSession')}
                title={tCommon('endSessionTitle')}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                {t('title')}
              </span>
              <span className="text-base font-medium text-on-background">
                {tCommon('question', { number: questionNumber })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {timeLeft !== undefined && (
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 border ${
                  timeLeft <= 10
                    ? 'bg-error/10 border-error/30 text-error animate-pulse'
                    : timeLeft <= 30
                      ? 'bg-tertiary/10 border-tertiary/30 text-tertiary'
                      : 'bg-surface-container-high border-outline-variant text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  timer
                </span>
                <span className="text-sm font-semibold tabular-nums">{timeLeft}s</span>
              </div>
            )}
            {totalAnswered > 0 && score !== undefined && (
              <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>
                  check_circle
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {score}/{totalAnswered}
                </span>
              </div>
            )}
          </div>
        </div>
        {totalAnswered > 0 && (
          <div
            className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(masteryPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={tCommon('mastery', { percent: Math.round(masteryPct) })}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${masteryPct}%` }}
            />
          </div>
        )}
      </div>
    </>
  );
}
