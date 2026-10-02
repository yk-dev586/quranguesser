import { randomUUID } from 'crypto';

import type { Prisma } from '@prisma/client';

import { prisma } from './prisma';

export type GameMode =
  | 'locate-verse'
  | 'next-verse'
  | 'missing-word-count'
  | 'locate-verse-daily'
  | 'translation-quiz';

const SESSION_TTL_HOURS = 24;

function sessionExpiresAt(): Date {
  const d = new Date();
  d.setHours(d.getHours() + SESSION_TTL_HOURS);
  return d;
}

export interface ActiveSession {
  token: string;
  questionNumber: number;
  totalScore: number;
  timerLimit: number;
  questionStartedAt: Date;
  currentQuestion: Prisma.JsonValue;
  submitResult: Prisma.JsonValue | null;
}

function toActiveSession(record: {
  token: string;
  questionNumber: number;
  totalScore: number;
  timerLimit: number;
  questionStartedAt: Date;
  currentQuestion: Prisma.JsonValue;
  submitResult: Prisma.JsonValue | null;
}): ActiveSession {
  return {
    token: record.token,
    questionNumber: record.questionNumber,
    totalScore: record.totalScore,
    timerLimit: record.timerLimit,
    questionStartedAt: record.questionStartedAt,
    currentQuestion: record.currentQuestion,
    submitResult: record.submitResult,
  };
}

export async function createQuizSession(opts: {
  userId: string | null;
  gameMode: GameMode;
  question: object;
  timerLimit: number;
}): Promise<ActiveSession> {
  const token = randomUUID();
  const questionStartedAt = new Date();
  const record = await prisma.quizSession.create({
    data: {
      token,
      userId: opts.userId ?? undefined,
      gameMode: opts.gameMode,
      currentQuestion: opts.question as Prisma.InputJsonValue,
      timerLimit: opts.timerLimit,
      questionStartedAt,
      expiresAt: sessionExpiresAt(),
    },
  });
  return toActiveSession(record);
}

export async function getActiveQuizSession(token: string): Promise<ActiveSession | null> {
  const record = await prisma.quizSession.findFirst({
    where: { token, status: 'active', expiresAt: { gt: new Date() } },
  });
  if (!record) {
    return null;
  }
  return toActiveSession(record);
}

export async function getActiveSessionByUserAndMode(
  userId: string,
  gameMode: GameMode,
): Promise<ActiveSession | null> {
  const record = await prisma.quizSession.findFirst({
    where: { userId, gameMode, status: 'active', expiresAt: { gt: new Date() } },
    orderBy: { updatedAt: 'desc' },
  });
  if (!record) {
    return null;
  }
  return toActiveSession(record);
}

export async function advanceQuizSession(
  token: string,
  opts: {
    question: object;
    questionNumber: number;
    timerLimit: number;
  },
): Promise<void> {
  await prisma.quizSession.update({
    where: { token },
    data: {
      currentQuestion: opts.question as Prisma.InputJsonValue,
      questionNumber: opts.questionNumber,
      timerLimit: opts.timerLimit,
      questionStartedAt: new Date(),
      submitResult: null,
      expiresAt: sessionExpiresAt(),
    },
  });
}

export async function saveQuizSubmitResult(
  token: string,
  result: object,
  scoreDelta: number,
): Promise<void> {
  await prisma.quizSession.update({
    where: { token },
    data: {
      submitResult: result as Prisma.InputJsonValue,
      totalScore: { increment: scoreDelta },
    },
  });
}

export async function endQuizSession(token: string): Promise<void> {
  await prisma.quizSession.updateMany({
    where: { token, status: 'active' },
    data: { status: 'abandoned', expiresAt: new Date() },
  });
}
