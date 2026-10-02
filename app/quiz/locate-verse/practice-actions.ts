 'use server';

import { decryptVerseKey, verifyAnswer } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

export async function fetchPracticeQuestion(pageNumber?: number): Promise<Question> {
  return getRandomQuestion(undefined, pageNumber);
}

export async function submitPracticeAnswer(encryptedVerseKey: string, answerToken: string, guessedPage: number, guessedLine: number): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const result = verifyAnswer(verseKey, answerToken);
  if (!result) throw new Error('Invalid answer token');
  const { correctPage, correctLine } = result;
  const noAnswer = guessedPage === 0 && guessedLine === 0;
  const distance = noAnswer ? 0 : Math.abs((guessedPage - 1) * 15 + guessedLine - ((correctPage - 1) * 15 + correctLine));
  const roundScore = noAnswer ? 0 : Math.round(5000 * Math.exp(-distance / 2000));
  return {
    pageCorrect: guessedPage === correctPage,
    lineCorrect: guessedLine === correctLine,
    correctPage,
    correctLine,
    verseKey,
    roundScore,
  };
}
