'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

import { getUserProfileAction } from '@/app/actions/user';
import type { QfUserProfile } from '@/lib/qf-api';
import { OFFLINE_MODE } from '@/lib/offline-mode';

interface TopAppBarProps {
  activeHref?: string;
}

/**
 * 80px white bar, 1px hairline bottom border.
 * Wordmark (Logo) left · product tabs center · account link right.
 * Auto-hides on scroll down, reveals on scroll up.
 */
export default function TopAppBar({ activeHref }: TopAppBarProps): React.JSX.Element {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const { data: session } = useSession();
  const pathname = usePathname();

  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const [user, setUser] = useState<QfUserProfile | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Fetch user profile session
  useEffect(() => {
    async function getUserSession() {
      if (!userId) {
        setUser(null);
        return;
      }

      try {
        const userProfile = await getUserProfileAction(userId);
        setUser(userProfile);
      } catch (error) {
        console.error('Failed to load user profile', error);
        setUser(null);
      }
    }

    getUserSession();
  }, [userId]);

  // Handle scroll to show/hide header
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide if scrolling down and past the header's height (80px)
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        // Show if scrolling up
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = OFFLINE_MODE
    ? [
        { label: t('quiz'), href: '/quiz' },
        { label: t('quran'), href: '/quran' },
      ]
    : [
        { label: t('quiz'), href: '/quiz' },
        { label: t('quran'), href: '/quran' },
        { label: t('rankings'), href: '/leaderboard' },
        { label: t('stats'), href: '/stats' },
      ];

  // Helper values mapping to the QfUserProfile schema
  const imageUrl = user?.photoUrl || (user?.avatarUrls && Object.values(user.avatarUrls)[0]);
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : (user?.username ?? t('profile'));

  return (
    <header
      className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 80,
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-outline)',
        fontFamily: 'var(--font-inter), Circular, system-ui, sans-serif',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        aria-label={tNav('goToHomepage')}
        className="flex items-center gap-3"
        style={{ textDecoration: 'none' }}
      >
        <Image
          src="/icon-512.png"
          alt={tNav('quranGuessr')}
          width={40}
          height={40}
          priority // Prioritizes loading this image since it's at the top of the page
          className="object-contain"
        />
        {/* Uncomment the line below if you ever want the text to appear next to the logo */}
        {/* <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 22 }}>{tNav('quranGuessr')}</span> */}
      </Link>

      {/* Desktop center product tabs */}
      <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
        {navItems.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            aria-current={activeHref === href ? 'page' : undefined}
            className="flex flex-col items-center pb-1"
            style={{
              color: 'var(--color-on-surface)',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 600,
              borderBottom:
                activeHref === href ? '2px solid var(--color-on-surface)' : '2px solid transparent',
              transition: 'border-color 0.15s',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right — account utilities + language + theme toggle */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeSwitcher />
        {userId ? (
          <Link
            href="/profile"
            aria-label={t('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              border: '1px solid var(--color-outline)',
              borderRadius: 9999,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={userName}
                width={36}
                height={36}
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: 'var(--color-on-surface-variant)' }}
              >
                person
              </span>
            )}
          </Link>
        ) : !OFFLINE_MODE ? (
          <button
            onClick={() => signIn('quran-foundation', { callbackUrl: pathname })}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '8px 16px', fontSize: '14px', fontWeight: 500,
              color: 'var(--color-on-primary, #ffffff)', backgroundColor: 'var(--color-primary, #000000)',
              borderRadius: '8px', textDecoration: 'none', transition: 'opacity 0.2s',
            }}
          >
            {tNav('signIn')}
          </button>
        ) : null}
      </div>
    </header>
  );
}
