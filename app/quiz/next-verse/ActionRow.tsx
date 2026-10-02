'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

interface ActionRowProps {
  isCorrect: boolean;
  submitted: boolean;
  selected: number | null;
  loading: boolean;
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
  onSubmit,
  onNext,
}: ActionRowProps): React.JSX.Element {
  const t = useTranslations('nextVerseQuiz');
  const tCommon = useTranslations('common');

  return (
    <div className="w-full flex items-center justify-between min-h-12">
      <div role="status" aria-live="polite" aria-atomic="true" className="flex-1">
        {submitted && (
          <p className={`text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-rose-400'}`}>
            {isCorrect ? tCommon('correct') : t('notQuite')}
          </p>
        )}
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
            disabled={selected === null || loading}
            className={`${BTN} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {tCommon('submit')}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              arrow_forward
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
