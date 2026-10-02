'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

export default function QuizPrompt(): React.JSX.Element {
  const t = useTranslations('locateVerse');

  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-semibold text-on-background">{t('whereIsAyah')}</h2>
      <p className="text-sm text-on-surface-variant mt-1">{t('selectPageRow')}</p>
    </div>
  );
}
