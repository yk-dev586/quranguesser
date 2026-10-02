'use server';

import { revalidateTag } from 'next/cache';

import { computeElo } from '@/lib/elo';
import { prisma } from '@/lib/prisma';

export interface EloUpdateResult {
  userDelta: number;
  newUserElo: number;
  newPageElo: number;
}

export async function updateRankedElo(
  userId: string,
  pageNumber: number,
  isCorrect: boolean,
  today: string,
  currentPageElo: number,
  totalWords: number,
  missingCount: number,
): Promise<EloUpdateResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { elo: true, gamesPlayed: true },
  });
  const result = computeElo(
    user?.elo ?? 1000,
    currentPageElo,
    isCorrect,
    user?.gamesPlayed ?? 0,
    totalWords,
    missingCount,
  );

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        elo: result.newUserElo,
        gamesPlayed: { increment: 1 },
        ...(isCorrect ? { mwcCorrect: { increment: 1 } } : {}),
      },
    }),
    prisma.pageElo.upsert({
      where: { pageNumber },
      create: {
        pageNumber,
        elo: result.newPageElo,
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
      },
      update: {
        elo: result.newPageElo,
        totalAttempts: { increment: 1 },
        ...(isCorrect ? { correctAttempts: { increment: 1 } } : {}),
      },
    }),
    prisma.dailyAttempt.update({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { userId_date: { userId, date: today } },
      data: { count: { increment: 1 } },
    }),
  ]);

  revalidateTag('leaderboard-players', {});
  revalidateTag('leaderboard-pages', {});

  return result;
}
