'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import type { SubmitResult } from './types';

interface ActionRowProps {
  submitResult: SubmitResult | null;
  submitted: boolean;
  selectedPage: number | null;
  selectedLine: number | null;
  loading: boolean;
  onSubmit: () => void;
  onNext: () => void;
}

const BTN =
  'bg-primary-container text-on-primary-container text-sm font-medium px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors active:scale-95 flex items-center gap-2';

export default function ActionRow({
  submitResult,
  submitted,
  selectedPage,
  selectedLine,
  loading,
  onSubmit,
  onNext,
}: ActionRowProps): React.JSX.Element {
  const t = useTranslations('locateVerse');
  const tCommon = useTranslations('common');

  let feedbackEl: React.ReactNode = null;
  if (submitted && submitResult) {
    const { pageCorrect, lineCorrect, correctPage, correctLine, roundScore } = submitResult;
    const pts = `+${roundScore.toLocaleString()} ${tCommon('pointsAbbr')}`;
    if (pageCorrect && lineCorrect) {
      feedbackEl = (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-green-400">
            {t('perfect')} {pts}
          </p>
          <p className="text-xs text-on-surface-variant">
            {t('pageRow', { page: correctPage, line: correctLine })}
          </p>
        </div>
      );
    } else if (pageCorrect) {
      feedbackEl = (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-amber-400">
            {t('rightPage')} {pts}
          </p>
          <p className="text-xs text-on-surface-variant">{t('rowWas', { line: correctLine })}</p>
        </div>
      );
    } else if (lineCorrect) {
      feedbackEl = (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-amber-400">
            {t('rightRow')} {pts}
          </p>
          <p className="text-xs text-on-surface-variant">{t('pageWas', { page: correctPage })}</p>
        </div>
      );
    } else {
      const pageDist = Math.abs((selectedPage ?? 0) - correctPage);
      const lineDist = Math.abs((selectedLine ?? 0) - correctLine);
      let missLabel: string;
      let missColor: string;
      if (pageDist <= 3 && lineDist <= 2) {
        missLabel = t('soClose');
        missColor = 'text-amber-400';
      } else if (pageDist <= 10) {
        missLabel = t('close');
        missColor = 'text-amber-400';
      } else if (pageDist <= 30) {
        missLabel = t('notFar');
        missColor = 'text-orange-400';
      } else {
        missLabel = t('miss');
        missColor = 'text-rose-400';
      }
      feedbackEl = (
        <div className="flex flex-col gap-0.5">
          <p className={`text-sm font-medium ${missColor}`}>
            {missLabel} {pts}
          </p>
          <p className="text-xs text-on-surface-variant">
            {t('pageRow', { page: correctPage, line: correctLine })}
          </p>
        </div>
      );
    }
  }

  return (
    <div className="w-full flex items-center justify-between min-h-12">
      <div role="status" aria-live="polite" aria-atomic="true" className="flex-1">
        {submitted ? feedbackEl : null}
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
            <button onClick={onNext} className={BTN}>
              {tCommon('nextQuestion')}
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_forward
              </span>
            </button>
          </>
        ) : (
          <button
            onClick={onSubmit}
            disabled={selectedPage === null || selectedLine === null || loading}
            className={`${BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {t('submitAnswer')}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              check
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
