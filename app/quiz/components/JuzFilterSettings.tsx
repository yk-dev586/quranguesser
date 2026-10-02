/* eslint-disable @typescript-eslint/naming-convention */
'use client';

import { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const JUZ_FILTER_KEY = 'quizJuzFilter';

export function loadJuzFilter(): number[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const parsed = JSON.parse(localStorage.getItem(JUZ_FILTER_KEY) ?? 'null') as unknown;
    return Array.isArray(parsed) && parsed.every((x) => typeof x === 'number') ? parsed : [];
  } catch {
    return [];
  }
}

export function saveJuzFilter(juzList: number[]): void {
  localStorage.setItem(JUZ_FILTER_KEY, JSON.stringify(juzList));
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const PILL = 'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-90';
const ON = 'bg-primary text-on-primary border-primary';
const OFF = 'bg-transparent text-on-surface-variant border-outline-variant hover:border-primary/50';
const RANGES = [
  { from: 1, to: 10 },
  { from: 11, to: 20 },
  { from: 21, to: 30 },
];

function JuzFilterPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations('juzFilter');
  const tCommon = useTranslations('common');
  const [selected, setSelected] = useState<Set<number>>(() => new Set(loadJuzFilter()));

  const toggle = useCallback((juz: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(juz)) {
        next.delete(juz);
      } else {
        next.add(juz);
      }
      return next;
    });
  }, []);

  const selectAll = () => setSelected(new Set());
  const selectRange = (from: number, to: number) =>
    setSelected(new Set(Array.from({ length: to - from + 1 }, (_, i) => i + from)));
  const handleSave = () => {
    saveJuzFilter([...selected].sort((a, b) => a - b));
    toast.success(t('saved'));
    onClose();
  };

  const allSelected = selected.size === 0;
  const activeCount = allSelected ? 30 : selected.size;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm min-h-screen"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 md:max-w-[30%] w-full max-w-[90%] bg-surface-container rounded-3xl md:rounded-3xl border border-outline-variant shadow-2xl p-6 flex flex-col gap-5 overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-on-surface">{t('title')}</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {t('desc')}{' '}
              <span className="text-primary font-medium">
                {t('active', { count: activeCount })}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            aria-label={tCommon('cancel')}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button onClick={selectAll} className={`${PILL} ${allSelected ? ON : OFF}`}>
            {t('allJuz')}
          </button>
          {RANGES.map(({ from, to }) => {
            const rs = new Set(Array.from({ length: to - from + 1 }, (_, i) => i + from));
            const isOn = selected.size === rs.size && [...rs].every((j) => selected.has(j));
            return (
              <button
                key={`${from}-${to}`}
                onClick={() => selectRange(from, to)}
                className={`${PILL} ${isOn ? ON : OFF}`}
              >
                {t('juzRange', { from, to })}
              </button>
            );
          })}
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
              <button
                key={juz}
                onClick={() => toggle(juz)}
                className={`flex items-center justify-center rounded-xl border py-3 text-base font-bold transition-all active:scale-90 ${allSelected || selected.has(juz) ? 'bg-primary/15 border-primary/40 text-primary hover:bg-primary/25' : 'bg-surface-container-high border-outline-variant/50 text-on-surface-variant hover:border-primary/30'}`}
              >
                {juz}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 shrink-0 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-medium hover:bg-surface-container-high active:scale-95 transition-all"
          >
            {tCommon('cancel')}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-on-primary-container active:scale-95 transition-all"
          >
            {t('applyFilter')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JuzFilterSettings({ open, onClose }: Props) {
  if (!open) {
    return null;
  }
  return <JuzFilterPanel onClose={onClose} />;
}
