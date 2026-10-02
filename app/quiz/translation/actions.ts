'use server';

import { verifyAnswer, decryptVerseKey } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';

import { auth } from '@/auth';
import { recordGameEvent } from '@/lib/game-events';
import { prisma } from '@/lib/prisma';
import { recordQfActivityDay } from '@/lib/qf-api';
import {
  createQuizSession,
  getActiveQuizSession,
  getActiveSessionByUserAndMode,
  advanceQuizSession,
  saveQuizSubmitResult,
} from '@/lib/quiz-session';

const GAME_MODE = 'translation-quiz' as const;

export interface SessionInitResult {
  sessionToken: string;
  question: Question;
  questionNumber: number;
  totalScore: number;
  submitResult: SubmitResult | null;
}

export async function initSession(
  translationId: number,
  sessionToken?: string,
  juzFilter?: number[],
): Promise<SessionInitResult> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (userId) {
    const existing = await getActiveSessionByUserAndMode(userId, GAME_MODE);
    if (existing) {
      return {
        sessionToken: existing.token,
        question: existing.currentQuestion as unknown as Question,
        questionNumber: existing.questionNumber,
        totalScore: existing.totalScore,
        submitResult: existing.submitResult as SubmitResult | null,
      };
    }
  }

  if (sessionToken) {
    const existing = await getActiveQuizSession(sessionToken);
    if (existing) {
      return {
        sessionToken,
        question: existing.currentQuestion as unknown as Question,
        questionNumber: existing.questionNumber,
        totalScore: existing.totalScore,
        submitResult: existing.submitResult as SubmitResult | null,
      };
    }
  }

  const question = await getRandomQuestion(translationId, juzFilter);
  const record = await createQuizSession({ userId, gameMode: GAME_MODE, question, timerLimit: 0 });

  return {
    sessionToken: record.token,
    question,
    questionNumber: 1,
    totalScore: 0,
    submitResult: null,
  };
}

export async function fetchNextQuestion(
  sessionToken: string,
  translationId: number,
  juzFilter?: number[],
): Promise<{ question: Question; questionNumber: number }> {
  const existing = await getActiveQuizSession(sessionToken);
  if (!existing) {
    throw new Error('Session not found or expired');
  }

  const question = await getRandomQuestion(translationId, juzFilter);
  const questionNumber = existing.questionNumber + 1;

  await advanceQuizSession(sessionToken, { question, questionNumber, timerLimit: 0 });

  return { question, questionNumber };
}

export async function submitAnswer(
  sessionToken: string,
  encryptedVerseKey: string,
  answerToken: string,
  guess: number,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const correctIndex = verifyAnswer(verseKey, answerToken);
  if (correctIndex === null) {
    throw new Error('Invalid answer token');
  }
  const isCorrect = guess === correctIndex;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (userId) {
    await Promise.all([
      prisma.user.update({
        where: { id: userId },
        data: {
          tqGames: { increment: 1 },
          ...(isCorrect ? { tqCorrect: { increment: 1 } } : {}),
        },
      }),
      recordQfActivityDay(userId, verseKey),
    ]);
  }

  const submitResult: SubmitResult = { isCorrect, correctIndex, verseKey };
  void recordGameEvent({ userId, gameMode: GAME_MODE, correct: isCorrect });
  await saveQuizSubmitResult(sessionToken, submitResult, isCorrect ? 1 : 0);
  return submitResult;
}
