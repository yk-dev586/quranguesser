'use client';

import { useTransition } from 'react';

import { useTranslations } from 'next-intl';

import { oidcLogout } from '@/app/actions/auth';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('profilePage');

  return (
    <button
      onClick={() => startTransition(() => oidcLogout())}
      disabled={isPending}
      aria-label={t('signOut')}
      className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-error transition-colors disabled:opacity-50 disabled:pointer-events-none shrink-0"
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      <span className="hidden sm:inline">{isPending ? t('signingOut') : t('signOut')}</span>
    </button>
  );
}
