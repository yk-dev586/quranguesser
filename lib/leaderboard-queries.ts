import { unstable_cache } from 'next/cache';

import { prisma } from './prisma';

export const getCachedPlayerLeaderboard = unstable_cache(
  async () => {
    const [topUsers, totalEloUsers] = await Promise.all([
      prisma.user.findMany({
        where: { elo: { not: 1000 } },
        orderBy: { elo: 'desc' },
        take: 50,
        select: {
          id: true,
          name: true,
          image: true,
          elo: true,
          gamesPlayed: true,
          mwcCorrect: true,
          lvGames: true,
          lvCorrect: true,
          nvGames: true,
          nvCorrect: true,
          showOnLeaderboard: true,
        },
      }),
      prisma.user.count({ where: { elo: { not: 1000 } } }),
    ]);
    return { topUsers, totalEloUsers };
  },
  ['leaderboard-players'],
  { revalidate: 60, tags: ['leaderboard-players'] },
);

export const getCachedPageLeaderboard = unstable_cache(
  async () => {
    return prisma.pageElo.findMany({
      orderBy: { elo: 'desc' },
    });
  },
  ['leaderboard-pages'],
  { revalidate: 300, tags: ['leaderboard-pages'] },
);

export const getCachedDailyLeaderboard = unstable_cache(
  async (challengeId: string) => {
    return prisma.dailyChallengeResult.findMany({
      where: { challengeId, completed: true },
      orderBy: [{ totalScore: 'desc' }, { completedAt: 'asc' }],
      take: 50,
      include: {
        user: { select: { name: true, image: true, showOnLeaderboard: true } },
      },
    });
  },
  ['leaderboard-daily'],
  { revalidate: 60, tags: ['leaderboard-daily'] },
);
