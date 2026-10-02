'use client';

import { useSyncExternalStore } from 'react';

import { useTheme } from 'next-themes';

const emptySubscribe = () => () => {};

/**
 * Theme toggle — cycles system → light → dark → system.
 * Shows a sun (light), moon (dark), or desktop (system) icon.
 */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="flex items-center justify-center rounded-full transition-colors"
        style={{
          width: 36,
          height: 36,
          border: '1px solid var(--color-outline)',
          background: 'var(--color-surface-container-low)',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, color: 'var(--color-on-surface-variant)' }}
        >
          contrast
        </span>
      </button>
    );
  }

  const icon = theme === 'dark' ? 'dark_mode' : theme === 'light' ? 'light_mode' : 'contrast';
  const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
  const label =
    theme === 'dark'
      ? 'Switch to system theme'
      : theme === 'light'
        ? 'Switch to dark theme'
        : 'Switch to light theme';

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className="flex items-center justify-center rounded-full transition-colors hover:bg-surface-container active:scale-95"
      style={{
        width: 36,
        height: 36,
        border: '1px solid var(--color-outline)',
        background: 'var(--color-surface-container-low)',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 18, color: 'var(--color-on-surface-variant)' }}
      >
        {icon}
      </span>
    </button>
  );
}
