 'use server';

import { decryptVerseKey, verifyAnswer } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

export async function fetchPracticeQuestion(translationId: number): Promise<Question> {
  return getRandomQuestion(translationId);
}

export async function submitPracticeAnswer(encryptedVerseKey: string, answerToken: string, guess: number): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const correctIndex = verifyAnswer(verseKey, answerToken);
  if (correctIndex === null) throw new Error('Invalid answer token');
  return { isCorrect: guess === correctIndex, correctIndex, verseKey };
}
