export const TIMER_LIMIT = 90;

export type { VerseWord } from '@/app/quiz/types';
import type { VerseWord } from '@/app/quiz/types';

export interface Question {
  encryptedVerseKey: string;
  /** QCF V2 word objects for the verse to display (page_number and line_number stripped). */
  verseWords: VerseWord[];
  /** Human-readable reference revealed after submission (e.g. "Al-Baqarah · 2:255"). */
  verseReference: string;
  /** HMAC-signed token encoding the correct page and line. */
  answerToken: string;
  /** Unique page numbers the verse spans — used only to load QCF fonts. */
  fontPages: number[];
}

export interface SubmitResult {
  pageCorrect: boolean;
  lineCorrect: boolean;
  /** The actual correct page (1–604). */
  correctPage: number;
  /** The actual correct line (1–15). */
  correctLine: number;
  /** Verse key revealed after submission. */
  verseKey: string;
  /** GeoGuessr-style score for this round (0–5000). */
  roundScore: number;
}
