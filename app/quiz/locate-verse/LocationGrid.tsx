'use client';

import { useState } from 'react';

import DigitBoxRow, { BOX_ORDER } from './DigitBoxRow';
import type { BoxId, Digits } from './DigitBoxRow';

interface LocationGridProps {
  selectedPage: number | null;
  selectedLine: number | null;
  submitted: boolean;
  correctPage: number | null;
  correctLine: number | null;
  onSelectPage: (page: number | null) => void;
  onSelectLine: (line: number | null) => void;
}

function numDisplay(
  val: number | null,
  oob: boolean,
  correct: boolean,
  wrong: boolean,
): React.ReactNode {
  if (val === null) {
    return <span className="opacity-40">—</span>;
  }
  if (oob) {
    return <span className="text-error font-semibold">{val} ✗</span>;
  }
  const cls = correct ? 'text-green-400' : wrong ? 'text-rose-400' : 'text-on-background';
  return <span className={`font-bold text-sm ${cls}`}>{val}</span>;
}

export default function LocationGrid({
  selectedPage,
  selectedLine,
  submitted,
  correctPage,
  correctLine,
  onSelectPage,
  onSelectLine,
}: LocationGridProps) {
  const [digits, setDigits] = useState<Digits>({ h: null, t: null, o: null, rt: null, ro: null });
  const [activeBox, setActiveBox] = useState<BoxId>('h');

  const correctDigit: Record<BoxId, number | null> = {
    h: correctPage !== null ? Math.floor(correctPage / 100) : null,
    t: correctPage !== null ? Math.floor((correctPage % 100) / 10) : null,
    o: correctPage !== null ? correctPage % 10 : null,
    rt: correctLine !== null ? Math.floor(correctLine / 10) : null,
    ro: correctLine !== null ? correctLine % 10 : null,
  };

  const notify = (d: Digits) => {
    const { h, t, o, rt, ro } = d;
    const p = h !== null && t !== null && o !== null ? h * 100 + t * 10 + o : null;
    const r = rt !== null && ro !== null ? rt * 10 + ro : null;
    onSelectPage(p !== null && p >= 1 && p <= 604 ? p : null);
    onSelectLine(r !== null && r >= 1 && r <= 15 ? r : null);
  };

  const pickDigit = (box: BoxId, d: number) => {
    const next = { ...digits, [box]: d };
    setDigits(next);
    notify(next);
    const idx = BOX_ORDER.indexOf(box);
    if (idx < BOX_ORDER.length - 1) {
      setActiveBox(BOX_ORDER[idx + 1]);
    }
  };

  const navigateBox = (direction: 'prev' | 'next') => {
    const idx = BOX_ORDER.indexOf(activeBox);
    const newIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (newIdx >= 0 && newIdx < BOX_ORDER.length) {
      setActiveBox(BOX_ORDER[newIdx]);
    }
  };

  const handleBackspace = (box: BoxId) => {
    if (digits[box] !== null) {
      const next = { ...digits, [box]: null };
      setDigits(next);
      notify(next);
    } else {
      const idx = BOX_ORDER.indexOf(box);
      if (idx > 0) {
        const prevBox = BOX_ORDER[idx - 1];
        setActiveBox(prevBox);
        const next = { ...digits, [prevBox]: null };
        setDigits(next);
        notify(next);
      }
    }
  };

  const { h, t, o, rt, ro } = digits;
  const assembledPage = h !== null && t !== null && o !== null ? h * 100 + t * 10 + o : null;
  const assembledRow = rt !== null && ro !== null ? rt * 10 + ro : null;
  const pageOob = assembledPage !== null && (assembledPage < 1 || assembledPage > 604);
  const rowOob = assembledRow !== null && (assembledRow < 1 || assembledRow > 15);
  const isPageCorrect = submitted && correctPage !== null && selectedPage === correctPage;
  const isPageWrong = submitted && correctPage !== null && !isPageCorrect;
  const isRowCorrect = submitted && correctLine !== null && selectedLine === correctLine;
  const isRowWrong = submitted && correctLine !== null && !isRowCorrect;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-start gap-3 rounded-xl bg-surface-container px-4 py-3 border border-outline-variant">
        <span
          className="material-symbols-outlined text-tertiary mt-0.5 shrink-0"
          style={{ fontSize: 18 }}
        >
          auto_stories
        </span>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          This quiz uses the <span className="font-semibold text-on-surface">QCF Hafs v2</span>{' '}
          (Usman Taha 2nd Edition) — 604 pages, 15 rows per page.
        </p>
      </div>

      <div
        className={`flex flex-col gap-4 rounded-2xl p-4 ring-2 bg-surface-container transition-all duration-200 ${
          isPageCorrect && isRowCorrect
            ? 'ring-green-700'
            : isPageWrong || isRowWrong
              ? 'ring-rose-700'
              : 'ring-outline-variant'
        }`}
      >
        <DigitBoxRow
          digits={digits}
          activeBox={activeBox}
          submitted={submitted}
          correctDigit={correctDigit}
          onFocusBox={setActiveBox}
          onPickDigit={pickDigit}
          onNavigate={navigateBox}
          onBackspace={handleBackspace}
        />

        <div className="flex items-center justify-center gap-3 text-xs text-on-surface-variant border-t border-outline-variant pt-3">
          <span>Page {numDisplay(assembledPage, pageOob, isPageCorrect, isPageWrong)}</span>
          <span className="opacity-20">·</span>
          <span>Row {numDisplay(assembledRow, rowOob, isRowCorrect, isRowWrong)}</span>
          {submitted &&
            (!isPageCorrect || !isRowCorrect) &&
            correctPage !== null &&
            correctLine !== null && (
              <span className="opacity-50 ml-1">
                →{' '}
                <span className="text-green-900 font-semibold">
                  Page {correctPage}, Row {correctLine}
                </span>
              </span>
            )}
        </div>
      </div>
    </div>
  );
}
