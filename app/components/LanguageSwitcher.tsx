'use client';

import { useState, useRef, useEffect, useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { setLocale } from '@/app/actions/locale';

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(nextLocale: LocaleCode) {
    setIsOpen(false); // Close the dropdown immediately on selection
    if (nextLocale === locale) {
      return;
    } // Don't trigger transition if same locale

    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  const currentLabel = LOCALES.find((l) => l.code === locale)?.label ?? locale;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Switch language (current: ${currentLabel})`}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-outline text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
          translate
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-surface border border-outline shadow-lg z-50 overflow-hidden focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleChange(l.code)}
                role="menuitem"
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  locale === l.code
                    ? 'bg-surface-container text-on-surface font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
