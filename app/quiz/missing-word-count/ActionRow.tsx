'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

interface ActionRowProps {
  isCorrect: boolean;
  submitted: boolean;
  selected: number | null;
  loading: boolean;
  missingCount: number | null;
  userEloDelta: number | null;
  newUserElo: number | null;
  ranked: boolean;
  timedOut: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

const BTN =
  'bg-primary-container text-on-primary-container text-sm font-medium px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors active:scale-95 flex items-center gap-2';

export default function ActionRow({
  isCorrect,
  submitted,
  selected,
  loading,
  missingCount,
  userEloDelta,
  newUserElo,
  ranked,
  timedOut,
  onSubmit,
  onNext,
}: ActionRowProps): React.JSX.Element {
  const t = useTranslations('mwc');
  const tCommon = useTranslations('common');

  return (
    <div className="w-full flex items-center justify-between min-h-12">
      <div role="status" aria-live="polite" aria-atomic="true" className="flex-1">
        {submitted && missingCount !== null ? (
          <div className="flex flex-col gap-1">
            <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect
                ? tCommon('correct')
                : timedOut
                  ? t('timesUp', { count: missingCount })
                  : t('answerWas', { count: missingCount })}
            </p>
            {userEloDelta !== null && newUserElo !== null ? (
              <p className="text-xs text-on-surface-variant">
                ELO:{' '}
                <span className={userEloDelta >= 0 ? 'text-green-700' : 'text-red-700'}>
                  {userEloDelta >= 0 ? '+' : ''}
                  {userEloDelta}
                </span>{' '}
                → <span className="font-semibold text-on-background">{Math.round(newUserElo)}</span>
              </p>
            ) : ranked === false && userEloDelta === null ? (
              <p className="text-xs text-on-surface-variant opacity-60">{t('unranked')}</p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {submitted ? (
          <>
            <a
              href="/quiz"
              className="text-sm font-medium px-4 py-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                home
              </span>
              {tCommon('hub')}
            </a>
            <button
              onClick={onNext}
              disabled={loading}
              className={`${BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {tCommon('nextQuestion')}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_forward
              </span>
            </button>
          </>
        ) : (
          <button
            onClick={onSubmit}
            disabled={selected === null || loading}
            className={`${BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {t('submitAnswer')}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_forward
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
