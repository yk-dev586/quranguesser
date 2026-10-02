'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { OFFLINE_MODE } from '@/lib/offline-mode';

/**
 * Mobile-only fixed bottom navigation bar — Apple-style frosted bar.
 */
const BottomNav = (): React.JSX.Element => {
  const pathname = usePathname();
  const t = useTranslations('common');

  const navItems = OFFLINE_MODE
    ? [
        { icon: 'quiz', label: t('quiz'), href: '/quiz' },
        { icon: 'menu_book', label: t('quran'), href: '/quran' },
      ]
    : [
        { icon: 'quiz', label: t('quiz'), href: '/quiz' },
        { icon: 'menu_book', label: t('quran'), href: '/quran' },
        { icon: 'leaderboard', label: t('rankings'), href: '/leaderboard' },
        { icon: 'bar_chart', label: t('stats'), href: '/stats' },
        { icon: 'person', label: t('profile'), href: '/profile' },
      ];

  return (
    <nav
      aria-label="Main navigation"
      className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center rounded-t-2xl"
      style={{
        height: 68,
        background: 'var(--color-bottom-nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-bottom-nav-border)',
        fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
      }}
    >
      {navItems.map(({ icon, label, href }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-1 active:opacity-60 transition-all"
            style={{
              color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
              textDecoration: 'none',
            }}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{ fontSize: 24, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {icon}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '-0.08px',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
