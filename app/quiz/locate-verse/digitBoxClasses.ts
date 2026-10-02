import type { BoxId, Digits } from './DigitBoxRow';

export function getBoxClass(
  box: BoxId,
  digits: Digits,
  correctDigit: Record<BoxId, number | null>,
  activeBox: BoxId,
  submitted: boolean,
): string {
  const val = digits[box];
  const cd = correctDigit[box];
  const isC = submitted && cd !== null && val === cd;
  const isW = submitted && cd !== null && val !== null && val !== cd;
  const isActive = activeBox === box && !submitted;
  return isC
    ? 'ring-2 ring-green-500 bg-green-500/10 text-green-700'
    : isW
      ? 'ring-2 ring-rose-500 bg-rose-500/10 text-rose-700'
      : isActive
        ? 'ring-2 ring-primary bg-primary-container/20 text-on-background'
        : val !== null
          ? 'ring-1 ring-outline-variant bg-surface-container text-on-background'
          : 'ring-1 ring-outline-variant/50 bg-surface-container-high text-on-surface-variant/30';
}

export function getDigitClass(
  box: BoxId,
  d: number,
  digits: Digits,
  correctDigit: Record<BoxId, number | null>,
  submitted: boolean,
): string {
  const val = digits[box];
  const cd = correctDigit[box];
  const isSel = val === d;
  const isC = submitted && cd === d;
  const isW = submitted && isSel && cd !== d;
  return isC && isSel
    ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500'
    : isC
      ? 'bg-green-500/10 text-green-400/60 ring-1 ring-green-500/40'
      : isW
        ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500'
        : !submitted && isSel
          ? 'bg-primary-container text-on-primary-container ring-1 ring-primary'
          : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container/30 hover:text-on-primary-container';
}
