'use server';

import { revalidateTag } from 'next/cache';

import { decryptVerseKey, verifyAnswer } from '@/app/quiz/locate-verse/answerToken';
import type { Question, SubmitResult } from '@/app/quiz/locate-verse/types';
import { TIMER_LIMIT } from '@/app/quiz/locate-verse/types';
import { auth } from '@/auth';
import { getOrCreateDailyChallenge, getUtcDateStr } from '@/lib/daily-challenge';
import { prisma } from '@/lib/prisma';
import { createQuizSession, advanceQuizSession } from '@/lib/quiz-session';

export async function initDailySession(
  challengeId: string,
  questionIndex: number,
  question: Question,
): Promise<{ sessionToken: string; initialTimeLeft: number }> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (userId) {
    const existing = await prisma.quizSession.findFirst({
      where: {
        userId,
        gameMode: 'locate-verse-daily',
        status: 'active',
        expiresAt: { gt: new Date() },
      },
    });

    if (existing) {
      const q = existing.currentQuestion as { questionIndex?: number };
      if (q.questionIndex === questionIndex) {
        const elapsed = Math.floor((Date.now() - existing.questionStartedAt.getTime()) / 1000);
        const initialTimeLeft = Math.max(0, existing.timerLimit - elapsed);
        return { sessionToken: existing.token, initialTimeLeft };
      }
      await advanceQuizSession(existing.token, {
        question: { ...question, questionIndex } as object,
        questionNumber: questionIndex + 1,
        timerLimit: TIMER_LIMIT,
      });
      return { sessionToken: existing.token, initialTimeLeft: TIMER_LIMIT };
    }
  }

  const record = await createQuizSession({
    userId,
    gameMode: 'locate-verse-daily',
    question: { ...question, questionIndex } as object,
    timerLimit: TIMER_LIMIT,
  });
  return { sessionToken: record.token, initialTimeLeft: TIMER_LIMIT };
}

export async function advanceDailyQuestion(
  sessionToken: string,
  questionIndex: number,
  question: Question,
): Promise<void> {
  await advanceQuizSession(sessionToken, {
    question: { ...question, questionIndex } as object,
    questionNumber: questionIndex + 1,
    timerLimit: TIMER_LIMIT,
  });
}

export async function submitDailyAnswer(
  challengeId: string,
  questionIndex: number,
  encryptedVerseKey: string,
  answerToken: string,
  guessedPage: number,
  guessedLine: number,
): Promise<SubmitResult> {
  if (questionIndex < 0 || questionIndex > 4) {
    throw new Error('Invalid question index');
  }

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
    const today = getUtcDateStr();
    const challenge = await prisma.dailyChallenge.findUnique({ where: { id: challengeId } });
    if (!challenge || challenge.date !== today) {
      throw new Error('Invalid challenge');
    }

    const existing = await prisma.dailyChallengeResult.findUnique({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { challengeId_userId: { challengeId, userId } },
    });

    if (!existing) {
      await prisma.dailyChallengeResult.create({
        data: {
          challengeId,
          userId,
          scores: [roundScore],
          totalScore: roundScore,
          completed: false,
        },
      });
    } else if (!existing.completed) {
      // Only append if this question hasn't been recorded yet
      if (existing.scores.length === questionIndex) {
        const newScores = [...existing.scores, roundScore];
        const newTotal = newScores.reduce((a, b) => a + b, 0);
        const completed = newScores.length >= 5;
        await prisma.dailyChallengeResult.update({
          where: { id: existing.id },
          data: {
            scores: newScores,
            totalScore: newTotal,
            completed,
            completedAt: completed ? new Date() : null,
          },
        });
        if (completed) {
          revalidateTag('leaderboard-daily', {});
        }
      }
    }
  }

  return {
    pageCorrect: guessedPage === correctPage,
    lineCorrect: guessedLine === correctLine,
    correctPage,
    correctLine,
    verseKey,
    roundScore,
  };
}

export async function getDailyChallengeStatus() {
  const today = getUtcDateStr();
  const challenge = await getOrCreateDailyChallenge(today);

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  if (!userId) {
    return { challengeId: challenge.id, completedScores: null, resumeFromIndex: 0 };
  }

  const existing = await prisma.dailyChallengeResult.findUnique({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    where: { challengeId_userId: { challengeId: challenge.id, userId } },
  });

  if (!existing) {
    return { challengeId: challenge.id, completedScores: null, resumeFromIndex: 0 };
  }

  if (existing.completed) {
    return { challengeId: challenge.id, completedScores: existing.scores, resumeFromIndex: 5 };
  }

  return {
    challengeId: challenge.id,
    completedScores: null,
    resumeFromIndex: existing.scores.length,
  };
}
