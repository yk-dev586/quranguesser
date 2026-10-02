'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { createPortal } from 'react-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function IntegrityModal({ open, onClose, onConfirm }: Props) {
  const t = useTranslations('integrity');
  const tCommon = useTranslations('common');
  const [pledged, setPledged] = useState(false);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative md:max-w-[65%] w-full mx-4 rounded-md overflow-hidden bg-background border border-outline"
        style={{
          boxShadow:
            'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-primary text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                menu_book
              </span>
            </div>
          </div>

          <h2 className="text-[22px] font-semibold text-on-surface text-center mb-2 tracking-[-0.01em]">
            {t('title')}
          </h2>
          <p className="text-on-surface-variant text-center text-sm font-medium mb-6 tracking-widest">
            {t('bismillah')}
          </p>

          <p className="text-on-surface-variant text-center text-[15px] leading-relaxed mb-8">
            {t('desc')}
          </p>

          {/* Pledge checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-8 group select-none">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={pledged}
                onChange={(e) => setPledged(e.target.checked)}
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  pledged
                    ? 'bg-primary border-primary'
                    : 'border-outline group-hover:border-on-surface-variant'
                }`}
              >
                {pledged && (
                  <span
                    className="material-symbols-outlined text-on-primary"
                    style={{ fontSize: 14, fontVariationSettings: "'wght' 700" }}
                  >
                    check
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
              {t('pledge')}
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-lg border border-outline text-on-surface hover:border-on-surface-variant hover:bg-surface-container active:scale-95 transition-all duration-200 font-medium text-sm bg-background"
            >
              {tCommon('cancel')}
            </button>
            <button
              onClick={onConfirm}
              disabled={!pledged}
              className="flex-1 h-12 rounded-lg font-medium text-sm transition-all duration-200 bg-primary text-on-primary disabled:bg-primary-container disabled:text-on-surface-variant disabled:cursor-not-allowed disabled:pointer-events-none hover:bg-on-primary-container active:scale-95"
            >
              {t('beginGame')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
