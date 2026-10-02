export type { VerseWord } from '@/app/quiz/types';
import type { VerseWord } from '@/app/quiz/types';

export interface ChoiceOption {
  words: VerseWord[];
}

/** Sent to the client — answer and verse reference are hidden. */
export interface Question {
  /** AES-256-GCM encrypted verse key of the *current* verse; opaque to client. */
  encryptedVerseKey: string;
  /** QCF V2 word objects for the verse to display. */
  verseWords: VerseWord[];
  /** Human-readable reference, e.g. "Al-Baqarah · 2:255". */
  verseReference: string;
  /** Four shuffled choices; exactly one is the true next verse. */
  choices: ChoiceOption[];
  /** HMAC-signed token encoding the correct choice index. */
  answerToken: string;
}

export interface SubmitResult {
  isCorrect: boolean;
  /** Index (0-3) of the correct choice in the `choices` array. */
  correctIndex: number;
  /** Verse key of the current verse, revealed after submission. */
  verseKey: string;
}
