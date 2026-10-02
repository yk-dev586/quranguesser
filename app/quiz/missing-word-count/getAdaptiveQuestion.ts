import { getRandomQuestion } from './getQuestion';
import type { Question } from './types';

import { prisma } from '@/lib/prisma';
import { getPageRangeForJuz } from '@/lib/quran-pages';

export async function getAdaptiveQuestion(
  userId: string | null,
  juzFilter?: number[],
): Promise<Question> {
  if (!userId) {
    return getRandomQuestion(undefined, juzFilter);
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { elo: true } });
  const userElo = user?.elo ?? 1000;

  const juzPageRanges =
    juzFilter && juzFilter.length > 0 ? juzFilter.map((j) => getPageRangeForJuz(j)) : null;

  const matchingPages = await prisma.pageElo.findMany({
    where: {
      elo: { gte: userElo - 200, lte: userElo + 200 },
      ...(juzPageRanges
        ? {
            OR: juzPageRanges.map(({ start, end }) => ({
              pageNumber: { gte: start, lte: end },
            })),
          }
        : {}),
    },
    select: { pageNumber: true },
  });

  const targetPage =
    matchingPages.length > 0
      ? matchingPages[Math.floor(Math.random() * matchingPages.length)].pageNumber
      : undefined;

  return getRandomQuestion(targetPage, juzFilter);
}
