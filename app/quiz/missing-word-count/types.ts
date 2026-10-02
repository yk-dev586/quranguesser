export type { VerseWord } from '@/app/quiz/types';

export type Segment =
  | { type: 'words'; words: import('@/app/quiz/types').VerseWord[] }
  | { type: 'blank' }
  | { type: 'verse-end'; verseKey: string };

/** Sent to the client — both the answer and the verse reference are hidden. */
export interface Question {
  /** AES-256-GCM encrypted verse key; opaque to the client. */
  encryptedVerseKey: string;
  segments: Segment[];
  /** HMAC-signed token; decoded only by the server on submission. */
  answerToken: string;
  /** AES-256-GCM encrypted array of hidden VerseWords; revealed after submission. */
  encryptedHiddenWords: string;
  /** Total number of Arabic words in this verse (used for adaptive timer). */
  totalWords: number;
  /** ELO of the page this verse is from (difficulty indicator). */
  pageElo: number;
}

export interface SubmitResult {
  isCorrect: boolean;
  correctAnswer: number;
  /** Revealed after submission so the UI can display it. */
  verseKey: string;
  /** Hidden words revealed after submission for full-verse display. */
  hiddenWords: import('@/app/quiz/types').VerseWord[];
  /** ELO change for the authenticated user (null if not signed in or rate-limited). */
  userEloDelta: number | null;
  /** User's new ELO after this attempt (null if not signed in or rate-limited). */
  newUserElo: number | null;
  /** Page's new ELO after this attempt. */
  newPageElo: number;
  /** Whether this attempt counted as ranked (false for anonymous or daily-limit exceeded). */
  ranked: boolean;
}

export interface SessionInitResult {
  sessionToken: string;
  question: Question;
  questionNumber: number;
  totalScore: number;
  initialTimeLeft: number;
  submitResult: SubmitResult | null;
}
