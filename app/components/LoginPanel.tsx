'use client';

import { useTransition } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { oidcLogout } from '@/app/actions/auth';

/** Login / profile panel — Apple utility card style. */
const LoginPanel = (): React.JSX.Element => {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('login');

  return (
    <div
      className="flex flex-col md:flex-row items-center gap-10 overflow-hidden"
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline)',
        borderRadius: 14,
        padding: 24,
      }}
    >
      <div className="w-full md:w-1/2 space-y-5">
        {status === 'authenticated' ? (
          /* ── Signed-in state ── */
          <>
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={48}
                  height={48}
                  className="rounded-full"
                  style={{ border: '1px solid var(--color-outline-variant)' }}
                  unoptimized
                />
              )}
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-on-surface)' }}>
                  {session.user?.name}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--color-on-surface-variant)',
                    letterSpacing: '-0.224px',
                  }}
                >
                  {session.user?.email}
                </p>
              </div>
            </div>
            <p
              style={{
                fontSize: 17,
                color: 'var(--color-on-surface-variant)',
                lineHeight: 1.47,
                letterSpacing: '-0.374px',
              }}
            >
              {t('progressSynced')}
            </p>
            <button
              className="w-full bg-primary text-on-primary text-base font-medium cursor-pointer hover:bg-on-primary-container active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
              style={{ borderRadius: 8, padding: '14px 24px' }}
              onClick={() => startTransition(() => oidcLogout())}
              disabled={isPending}
            >
              {isPending ? t('signingOut') : t('signOut')}
            </button>
          </>
        ) : (
          /* ── Signed-out state ── */
          <>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--color-on-surface)',
                lineHeight: 1.43,
              }}
            >
              {t('registerOrSignIn')}
            </h2>
            <p
              style={{
                fontSize: 16,
                color: 'var(--color-on-surface-variant)',
                lineHeight: 1.5,
              }}
            >
              {t('signInDesc')}
            </p>
            <button
              className="w-full bg-primary text-on-primary text-base font-medium cursor-pointer hover:bg-on-primary-container active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
              style={{ borderRadius: 8, padding: '14px 24px' }}
              onClick={() => signIn('quran-foundation', { callbackUrl: '/' })}
              disabled={status === 'loading'}
            >
              {t('continueWithQuran')}
            </button>
            <p
              style={{
                fontSize: 16,
                color: 'var(--color-on-surface-variant)',
                lineHeight: 1.5,
              }}
            >
              {t('or')}{' '}
              <Link
                href="/quiz"
                className="hover:bg-surface-container active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
                style={{
                  borderRadius: 8,
                  padding: '2px 4px',
                  fontSize: 16,
                  fontWeight: 500,
                  border: '1px solid var(--color-outline)',
                  cursor: 'pointer',
                }}
              >
                {t('tryTheQuiz')}
              </Link>{' '}
              {t('withoutSigningIn')}
            </p>
          </>
        )}
      </div>

      <div
        className="hidden md:block w-1/2 rounded-md overflow-hidden relative"
        style={{ minHeight: 280 }}
      >
        <Image
          className="absolute inset-0 w-full h-full object-cover"
          src="/quran-hero.jpg"
          alt={t('quranAlt')}
          fill
          sizes="(max-width: 768px) 0px, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
        />
        <p
          className="absolute bottom-4 left-4 right-4"
          style={{
            color: 'var(--color-on-primary)',
            fontSize: 14,
            fontStyle: 'italic',
            letterSpacing: '-0.224px',
          }}
        >
          {t('knowledgeQuote')}
        </p>
      </div>
    </div>
  );
};

export default LoginPanel;
