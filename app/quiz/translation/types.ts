export type { VerseWord } from '@/app/quiz/types';
import type { VerseWord } from '@/app/quiz/types';

export interface TranslationChoice {
  /** Translation text (may contain HTML tags from the API). */
  text: string;
}

/** Sent to the client — answer and verse reference are hidden until submission. */
export interface Question {
  /** AES-256-GCM encrypted verse key; opaque to client. */
  encryptedVerseKey: string;
  /** QCF V2 word objects for the verse to display in Arabic. */
  verseWords: VerseWord[];
  /** Human-readable reference, e.g. "Al-Baqarah · 2:255". */
  verseReference: string;
  /** Four shuffled translation choices; exactly one is correct. */
  choices: TranslationChoice[];
  /** HMAC-signed token encoding the correct choice index. */
  answerToken: string;
  /** Translation resource ID used for this question. */
  translationId: number;
}

export interface SubmitResult {
  isCorrect: boolean;
  /** Index (0-3) of the correct choice in the `choices` array. */
  correctIndex: number;
  /** Verse key of the current verse, revealed after submission. */
  verseKey: string;
}
