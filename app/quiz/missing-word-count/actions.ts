'use server';

import { verifyAnswer, decryptVerseKey, decryptHiddenWords } from './answerToken';
import { getAdaptiveQuestion } from './getAdaptiveQuestion';
import type { Question, SubmitResult, SessionInitResult } from './types';
import { updateRankedElo } from './updateRankedElo';

import type { VerseWord } from '@/app/quiz/types';
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

const DAILY_RANKED_LIMIT = 20;
const TIMER_LIMIT = 90;
const GAME_MODE = 'missing-word-count' as const;

function toSessionInitResult(
  existing: Awaited<ReturnType<typeof getActiveQuizSession>> & object,
): SessionInitResult {
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

export async function initSession(
  sessionToken?: string,
  juzFilter?: number[],
): Promise<SessionInitResult> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (userId) {
    const existing = await getActiveSessionByUserAndMode(userId, GAME_MODE);
    if (existing) {
      return toSessionInitResult(existing);
    }
  }

  if (sessionToken) {
    const existing = await getActiveQuizSession(sessionToken);
    if (existing) {
      return toSessionInitResult(existing);
    }
  }

  const question = await getAdaptiveQuestion(userId, juzFilter);
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
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const existing = await getActiveQuizSession(sessionToken);
  if (!existing) {
    throw new Error('Session not found or expired');
  }

  const question = await getAdaptiveQuestion(userId, juzFilter);
  const questionNumber = existing.questionNumber + 1;

  await advanceQuizSession(sessionToken, { question, questionNumber, timerLimit: TIMER_LIMIT });

  return { question, questionNumber };
}

export async function submitAnswer(
  sessionToken: string,
  encryptedVerseKey: string,
  answerToken: string,
  guess: number,
  encryptedHiddenWords: string,
): Promise<SubmitResult> {
  const verseKey = decryptVerseKey(encryptedVerseKey);
  const hiddenWords = decryptHiddenWords<VerseWord>(encryptedHiddenWords);
  const verified = verifyAnswer(verseKey, answerToken);
  if (verified === null) {
    throw new Error('Invalid answer token');
  }
  const { missingCount: correctAnswer, pageNumber, totalWords } = verified;
  const isCorrect = guess === correctAnswer;

  const existingPageElo = await prisma.pageElo.findUnique({ where: { pageNumber } });
  const currentPageElo = existingPageElo?.elo ?? 1000;

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const unranked: SubmitResult = {
    isCorrect,
    correctAnswer,
    verseKey,
    hiddenWords,
    userEloDelta: null,
    newUserElo: null,
    newPageElo: currentPageElo,
    ranked: false,
  };

  if (!userId) {
    void recordGameEvent({ userId: null, gameMode: GAME_MODE, correct: isCorrect });
    await saveQuizSubmitResult(sessionToken, unranked, isCorrect ? 1 : 0);
    return unranked;
  }

  const today = new Date().toISOString().slice(0, 10);
  const daily = await prisma.dailyAttempt.upsert({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { userId_date: { userId, date: today } },
    update: {},
    create: { userId, date: today, count: 0 },
  });

  if (daily.count >= DAILY_RANKED_LIMIT) {
    void recordGameEvent({ userId, gameMode: GAME_MODE, correct: isCorrect, ranked: false });
    await saveQuizSubmitResult(sessionToken, unranked, isCorrect ? 1 : 0);
    return unranked;
  }

  const eloResult = await updateRankedElo(
    userId,
    pageNumber,
    isCorrect,
    today,
    currentPageElo,
    totalWords,
    correctAnswer,
  );
  void recordQfActivityDay(userId, verseKey);

  const submitResult: SubmitResult = {
    isCorrect,
    correctAnswer,
    verseKey,
    hiddenWords,
    userEloDelta: eloResult.userDelta,
    newUserElo: eloResult.newUserElo,
    newPageElo: eloResult.newPageElo,
    ranked: true,
  };
  void recordGameEvent({ userId, gameMode: GAME_MODE, correct: isCorrect, ranked: true });
  await saveQuizSubmitResult(sessionToken, submitResult, isCorrect ? 1 : 0);
  return submitResult;
}
