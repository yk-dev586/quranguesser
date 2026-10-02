'use server';

import { decryptVerseKey, verifyAnswer } from './answerToken';
import { getRandomQuestion } from './getQuestion';
import type { Question, SubmitResult } from './types';
import { TIMER_LIMIT } from './types';

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

const GAME_MODE = 'locate-verse' as const;

export interface SessionInitResult {
  sessionToken: string;
  question: Question;
  questionNumber: number;
  totalScore: number;
  /** Seconds remaining on the current question's timer. */
  initialTimeLeft: number;
  submitResult: SubmitResult | null;
}

export async function initSession(
  sessionToken?: string,
  juzFilter?: number[],
): Promise<SessionInitResult> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (userId) {
    const existing = await getActiveSessionByUserAndMode(userId, GAME_MODE);
    if (existing) {
      const elapsed = Math.floor((Date.now() - existing.questionStartedAt.getTime()) / 1000);
      const submitResult = existing.submitResult as SubmitResult | null;
      const initialTimeLeft =
        submitResult !== null ? existing.timerLimit : Math.max(0, existing.timerLimit - elapsed);

      return {
        sessionToken: existing.token,
        question: existing.currentQuestion as unknown as Question,
        questionNumber: existing.questionNumber,
        totalScore: existing.totalScore,
        initialTimeLeft,
        submitResult,
      };
    }
  }

  if (sessionToken) {
    const existing = await getActiveQuizSession(sessionToken);
    if (existing) {
      const elapsed = Math.floor((Date.now() - existing.questionStartedAt.getTime()) / 1000);
      const submitResult = existing.submitResult as SubmitResult | null;
      const initialTimeLeft =
        submitResult !== null ? existing.timerLimit : Math.max(0, existing.timerLimit - elapsed);

      return {
        sessionToken,
        question: existing.currentQuestion as unknown as Question,
        questionNumber: existing.questionNumber,
        totalScore: existing.totalScore,
        initialTimeLeft,
        submitResult,
      };
    }
  }

  const question = await getRandomQuestion(juzFilter);
  const record = await createQuizSession({
    userId,
    gameMode: GAME_MODE,
    question,
    timerLimit: TIMER_LIMIT,
  });

  return {
    sessionToken: record.token,
    question,
    questionNumber: 1,
    totalScore: 0,
    initialTimeLeft: TIMER_LIMIT,
    submitResult: null,
  };
}

export async function fetchNextQuestion(
  sessionToken: string,
  juzFilter?: number[],
): Promise<{ question: Question; questionNumber: number }> {
  const existing = await getActiveQuizSession(sessionToken);
  if (!existing) {
    throw new Error('Session not found or expired');
  }

  const question = await getRandomQuestion(juzFilter);
  const questionNumber = existing.questionNumber + 1;

  await advanceQuizSession(sessionToken, { question, questionNumber, timerLimit: TIMER_LIMIT });

  return { question, questionNumber };
}

export async function submitAnswer(
  sessionToken: string,
  encryptedVerseKey: string,
  answerToken: string,
  guessedPage: number,
  guessedLine: number,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const result = verifyAnswer(verseKey, answerToken);
  if (!result) {
    throw new Error('Invalid answer token');
  }
  const { correctPage, correctLine } = result;
  const noAnswer = guessedPage === 0 && guessedLine === 0;
  const slotGuess = (guessedPage - 1) * 15 + guessedLine;
  const slotCorrect = (correctPage - 1) * 15 + correctLine;
  const distance = Math.abs(slotGuess - slotCorrect);
  const roundScore = noAnswer ? 0 : Math.round(5000 * Math.exp(-distance / 2000));

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (userId) {
    await Promise.all([
      prisma.user.update({
        where: { id: userId },
        data: {
          lvGames: { increment: 1 },
          ...(!noAnswer && guessedPage === correctPage ? { lvCorrect: { increment: 1 } } : {}),
        },
      }),
      recordQfActivityDay(userId, verseKey),
    ]);
  }

  const submitResult: SubmitResult = {
    pageCorrect: guessedPage === correctPage,
    lineCorrect: guessedLine === correctLine,
    correctPage,
    correctLine,
    verseKey,
    roundScore,
  };

  void recordGameEvent({
    userId,
    gameMode: GAME_MODE,
    score: roundScore,
    correct: roundScore == 5000,
  });
  await saveQuizSubmitResult(sessionToken, submitResult, roundScore);

  return submitResult;
}
