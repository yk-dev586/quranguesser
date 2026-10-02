'use client';

import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const t = useTranslations('auth');

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-panel rounded-3xl p-10 w-full md:max-w-[40%] space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-primary">{t('signInTitle')}</h1>
          <p className="text-on-surface-variant text-sm">{t('signInDesc')}</p>
        </div>

        {/* OAuth button */}
        <div className="space-y-3">
          <button
            className="w-full flex items-center justify-center gap-3 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary rounded-xl py-3 px-5 font-medium transition-colors active:scale-95"
            onClick={() => signIn('quran-foundation', { callbackUrl: '/' })}
          >
            {t('continueWithQuran')}
          </button>
        </div>

        <p className="text-center text-xs text-on-surface-variant">
          {t('termsPrefix')}&nbsp;
          <a className="underline hover:text-primary" href="#">
            {t('termsLink')}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
