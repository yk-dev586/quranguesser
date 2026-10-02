 'use server';

import { decryptHiddenWords, decryptVerseKey, verifyAnswer } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import type { VerseWord } from '@/app/quiz/types';

export async function fetchPracticeQuestion(pageNumber?: number): Promise<Question> {
  return getRandomQuestion(pageNumber, undefined);
}

export async function submitPracticeAnswer(
  encryptedVerseKey: string,
  answerToken: string,
  guess: number,
  encryptedHiddenWords: string,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const hiddenWords = decryptHiddenWords<VerseWord>(encryptedHiddenWords);
  const verified = verifyAnswer(verseKey, answerToken);
  if (!verified) throw new Error('Invalid answer token');
  const { missingCount: correctAnswer } = verified;
  return {
    isCorrect: guess === correctAnswer,
    correctAnswer,
    verseKey,
    hiddenWords,
    userEloDelta: null,
    newUserElo: null,
    newPageElo: 1000,
    ranked: false,
  };
}
