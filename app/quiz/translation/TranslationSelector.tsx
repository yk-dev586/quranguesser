'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { TRANSLATION_OPTIONS } from '@/lib/qdc-translations';

export const TRANSLATION_STORAGE_KEY = 'quizTranslationId';

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export function loadTranslationId(): number | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = localStorage.getItem(TRANSLATION_STORAGE_KEY);
    if (stored) {
      const id = parseInt(stored, 10);
      if (TRANSLATION_OPTIONS.some((t) => t.id === id)) {
        return id;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveTranslationId(id: number): void {
  localStorage.setItem(TRANSLATION_STORAGE_KEY, String(id));
}

interface Props {
  value: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
}

export default function TranslationSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('translationQuiz');

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const selected = TRANSLATION_OPTIONS.find((tOption) => tOption.id === value);

  const filtered = query.trim()
    ? TRANSLATION_OPTIONS.filter(
        (tOption) =>
          tOption.label.toLowerCase().includes(query.toLowerCase()) ||
          tOption.language.toLowerCase().includes(query.toLowerCase()),
      )
    : TRANSLATION_OPTIONS;

  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>
        translate
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!open) {
            setQuery('');
          }
          setOpen((o) => !o);
        }}
        className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface disabled:opacity-50 focus:outline-none focus:border-primary flex items-center gap-1 text-left"
      >
        <span>{selected ? truncate(selected.label, 20) : t('selectTranslation')}</span>
        <span
          className="material-symbols-outlined text-on-surface-variant shrink-0"
          style={{ fontSize: 16 }}
        >
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && (
        <div className="absolute top-full left-6 mt-1 z-50 bg-surface-container border border-outline-variant rounded-lg shadow-lg flex flex-col w-72">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-outline-variant">
            <span
              className="material-symbols-outlined text-on-surface-variant shrink-0"
              style={{ fontSize: 16 }}
            >
              search
            </span>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  close
                </span>
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-60">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-on-surface-variant">{t('noResults')}</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    saveTranslationId(opt.id);
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm whitespace-nowrap hover:bg-primary/10 transition-colors ${
                    opt.id === value ? 'text-primary font-medium' : 'text-on-surface'
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
