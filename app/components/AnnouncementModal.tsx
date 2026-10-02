/* eslint-disable max-lines */
'use client';

import { useState } from 'react';

import { createPortal } from 'react-dom';

import type { AnnouncementRecord } from '@/app/actions/announcements';

const LS_KEY = 'qg_read_announcements';

const TYPE_META: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  info: {
    icon: 'info',
    label: 'Info',
    color: 'var(--color-on-surface-variant)',
    bg: 'var(--color-surface-container)',
  },
  feature: {
    icon: 'new_releases',
    label: 'New',
    color: '#1d6fa0',
    bg: '#e8f4fd',
  },
  hotfix: {
    icon: 'build',
    label: 'Hotfix',
    color: '#a06a00',
    bg: '#fff3cd',
  },
  warning: {
    icon: 'warning',
    label: 'Notice',
    color: 'var(--color-error)',
    bg: 'var(--color-error-container)',
  },
};

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markRead(ids: string[]): void {
  try {
    const existing = getReadIds();
    for (const id of ids) {
      existing.add(id);
    }
    localStorage.setItem(LS_KEY, JSON.stringify([...existing]));
  } catch {
    // localStorage unavailable (private mode, etc.) — fail silently
  }
}

interface Props {
  announcements: AnnouncementRecord[];
}

export default function AnnouncementModal({ announcements }: Props) {
  // Lazy initializer runs once on the client — reads localStorage to filter already-read records.
  // Returns [] on the server (typeof window guard) so there's no SSR/hydration mismatch.
  const [unread] = useState<AnnouncementRecord[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const readIds = getReadIds();
    return announcements.filter((a) => !readIds.has(a.id));
  });

  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  if (dismissed || unread.length === 0) {
    return null;
  }

  const current = unread[index];
  const meta = TYPE_META[current.type] ?? TYPE_META.info;
  const isLast = index === unread.length - 1;

  function dismiss() {
    markRead(unread.map((a) => a.id));
    setDismissed(true);
  }

  function next() {
    if (isLast) {
      dismiss();
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'var(--color-scrim)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: 'var(--color-surface-container-lowest)',
          border: '1px solid var(--color-outline)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 480,
          boxShadow:
            'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.06) 0 4px 12px, rgba(0,0,0,0.12) 0 8px 24px',
          overflow: 'hidden',
        }}
      >
        {/* Type badge bar */}
        <div
          style={{
            background: meta.bg,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: meta.color }}>
            {meta.icon}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: meta.color,
            }}
          >
            {meta.label}
          </span>
          {unread.length > 1 && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: 'var(--color-on-surface-variant)',
              }}
            >
              {index + 1} / {unread.length}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '24px 24px 20px' }}>
          <h2
            id="announcement-title"
            style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'var(--color-on-surface)',
              marginBottom: 12,
            }}
          >
            {current.title}
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: 'var(--color-on-surface-variant)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {current.body}
          </p>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '0 24px 20px',
          }}
        >
          {/* Dismiss all */}
          {unread.length > 1 && (
            <button
              onClick={dismiss}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: '1px solid var(--color-outline)',
                background: 'transparent',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--color-on-surface-variant)',
                cursor: 'pointer',
              }}
            >
              Dismiss all
            </button>
          )}
          {/* Next / Got it */}
          <button
            onClick={next}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isLast ? 'Got it' : 'Next'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
