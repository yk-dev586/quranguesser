'use client';

import { useState, useTransition } from 'react';

import { useTranslations } from 'next-intl';

import { updateLeaderboardConsent } from '@/app/actions/auth';

export default function LeaderboardConsentToggle({ initialValue }: { initialValue: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(initialValue);
  const t = useTranslations('leaderboardPrivacy');

  function handleToggle() {
    const next = !value;
    setValue(next);
    startTransition(async () => {
      try {
        await updateLeaderboardConsent(next);
      } catch {
        setValue(!next); // revert on failure
      }
    });
  }

  return (
    <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
      <h2 className="text-base font-semibold text-on-surface mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">leaderboard</span>
        {t('title')}
      </h2>
      <p className="text-sm text-on-surface-variant mb-4">{value ? t('visible') : t('hidden')}</p>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 ${
          value ? 'bg-primary' : 'bg-outline-variant'
        }`}
        role="switch"
        aria-checked={value}
        aria-label={t('ariaLabel')}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-on-primary shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          } ${!value ? 'bg-surface' : ''}`}
        />
      </button>
    </div>
  );
}
