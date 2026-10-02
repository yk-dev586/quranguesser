'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import TranslationSelector, {
  loadTranslationId,
  saveTranslationId,
} from '@/app/quiz/translation/TranslationSelector';

interface Props {
  rankedLimitReached: boolean;
  openModal: (href: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ChallengeCategories({ rankedLimitReached, openModal }: Props) {
  const t = useTranslations('challenges');
  const tCommon = useTranslations('common');
  const [translationId, setTranslationId] = useState<number | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return loadTranslationId();
  });

  const handleTranslationChange = (id: number) => {
    saveTranslationId(id);
    setTranslationId(id);
  };

  return (
    <section className="space-y-8">
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {t('moreModesLabel')}
        </p>
        <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>
          {t('title')}
        </h3>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>{t('desc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Verse */}
        <button
          onClick={() => openModal('/quiz/next-verse?practice=true')}
          className="game-card card-shadow p-6 rounded-2xl text-left w-full transition-all hover:-translate-y-0.5"
          style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>
              format_quote
            </span>
          </div>
          <h5 className="font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            {t('nextVerse')}
          </h5>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {t('nextVerseDesc')}
          </p>
        </button>

        {/* Verse Location */}
        <button
          onClick={() => openModal('/quiz/locate-verse?practice=true')}
          className="game-card card-shadow p-6 rounded-2xl text-left w-full transition-all hover:-translate-y-0.5"
          style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>
              my_location
            </span>
          </div>
          <h5 className="font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            {t('verseLocation')}
          </h5>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {t('verseLocationDesc')}
          </p>
        </button>

        {/* Missing Word Count */}
        <button
          onClick={() => openModal('/quiz/missing-word-count?practice=true')}
          className="game-card card-shadow p-6 rounded-2xl text-left w-full transition-all hover:-translate-y-0.5"
          style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>
              pin
            </span>
          </div>
          <h5 className="font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>
            {t('missingWordCount')}
          </h5>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {t('missingWordDesc')}
          </p>
        </button>

        {/* Meaning Match */}
        <div
          className="game-card card-shadow p-6 rounded-2xl text-left w-full flex flex-col gap-3"
          style={{
            background: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>
              translate
            </span>
          </div>
          <h5 className="font-bold" style={{ color: 'var(--color-on-surface)' }}>
            {t('meaningMatch')}
          </h5>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            {t('meaningMatchDesc')}
          </p>
          <TranslationSelector value={translationId} onChange={handleTranslationChange} />
          <button
            onClick={() => openModal('/quiz/translation?practice=true')}
            disabled={translationId === null}
            className="mt-1 w-full rounded-lg py-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
            }}
          >
            {translationId === null ? t('selectTranslation') : tCommon('play')}
          </button>
        </div>
      </div>
    </section>
  );
}
