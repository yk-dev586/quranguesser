'use client';

import { Fragment, useEffect, useRef } from 'react';

import { getBoxClass, getDigitClass } from './digitBoxClasses';

export type BoxId = 'h' | 't' | 'o' | 'rt' | 'ro';
export type Digits = Record<BoxId, number | null>;

export const BOX_ORDER: BoxId[] = ['h', 't', 'o', 'rt', 'ro'];

export const ALLOWED: Record<BoxId, number[]> = {
  h: [0, 1, 2, 3, 4, 5, 6],
  t: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  o: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  rt: [0, 1],
  ro: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};

export const BOX_LABEL: Record<BoxId, string> = {
  h: '×100',
  t: '×10',
  o: '×1',
  rt: '×10',
  ro: '×1',
};

const BOX_GROUPS: { label: string; boxes: BoxId[] }[] = [
  { label: 'Page', boxes: ['h', 't', 'o'] },
  { label: 'Row', boxes: ['rt', 'ro'] },
];

interface DigitBoxRowProps {
  digits: Digits;
  activeBox: BoxId;
  submitted: boolean;
  correctDigit: Record<BoxId, number | null>;
  onFocusBox: (box: BoxId) => void;
  onPickDigit: (box: BoxId, d: number) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onBackspace: (box: BoxId) => void;
}

export default function DigitBoxRow({
  digits,
  activeBox,
  submitted,
  correctDigit,
  onFocusBox,
  onPickDigit,
  onNavigate,
  onBackspace,
}: DigitBoxRowProps) {
  const boxRefs = useRef<Record<BoxId, HTMLButtonElement | null>>({
    h: null,
    t: null,
    o: null,
    rt: null,
    ro: null,
  });

  useEffect(() => {
    if (!submitted) {
      boxRefs.current[activeBox]?.focus();
    }
  }, [activeBox, submitted]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-center gap-1.5 flex-wrap">
        {BOX_GROUPS.map((group, gi) => (
          <Fragment key={group.label}>
            {gi > 0 && (
              <span className="text-on-surface-variant/30 text-2xl font-light pb-5 mx-2 select-none">
                |
              </span>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant self-start pt-2 mr-0.5">
              {group.label}
            </span>
            {group.boxes.map((box, bi) => (
              <div key={box} className="flex items-center gap-1.5">
                {bi > 0 && (
                  <span className="text-on-surface-variant/30 font-light pb-5 select-none">-</span>
                )}
                <button
                  type="button"
                  disabled={submitted}
                  ref={(el) => {
                    boxRefs.current[box] = el;
                  }}
                  onClick={() => onFocusBox(box)}
                  onKeyDown={(e) => {
                    const d = parseInt(e.key, 10);
                    if (!isNaN(d) && ALLOWED[box].includes(d)) {
                      e.preventDefault();
                      onPickDigit(box, d);
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      onNavigate('prev');
                    } else if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      onNavigate('next');
                    } else if (e.key === 'Backspace' || e.key === 'Delete') {
                      e.preventDefault();
                      onBackspace(box);
                    }
                  }}
                  className={`w-14 h-18 rounded-xl transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${getBoxClass(box, digits, correctDigit, activeBox, submitted)}`}
                  aria-label={`${group.label} digit ${BOX_LABEL[box]}`}
                >
                  <span className="text-2xl font-bold leading-none tabular-nums">
                    {digits[box] ?? '·'}
                  </span>
                </button>
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      {!submitted && (
        <div className="flex gap-1.5 justify-center">
          {ALLOWED[activeBox].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onPickDigit(activeBox, d)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-150 active:scale-90 ${getDigitClass(activeBox, d, digits, correctDigit, submitted)}`}
              aria-label={String(d)}
            >
              {d}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
