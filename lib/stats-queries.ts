import { unstable_cache } from 'next/cache';

import { prisma } from './prisma';

export type GameMode = 'missing-word-count' | 'locate-verse' | 'next-verse' | 'translation-quiz';

export interface ModeStats {
  gameMode: string;
  total: number;
  correct: number;
  ranked: number;
  rankedCorrect: number;
  practice: number;
  practiceCorrect: number;
  casual: number;
  casualCorrect: number;
  score: number; // aggregate score for modes that have it (currently only locate-verse)
}

export interface DayBucket {
  date: string; // YYYY-MM-DD
  total: number;
  correct: number;
}

export interface GlobalStats {
  totalGames: number;
  totalCorrect: number;
  totalToday: number;
  totalAuthGames: number;
  totalAnonGames: number;
  uniquePlayers: number;
  modeStats: ModeStats[];
  last30Days: DayBucket[];
}

/**
 * Aggregate all GameEvent data for the public statistics page.
 * Revalidates every 5 minutes.
 */
export const getCachedStats = unstable_cache(
  async (): Promise<GlobalStats> => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      // Flat group-by across all dimensions we need
      grouped,
      totalToday,
      totalAnonGames,
      totalAuthGames,
      uniquePlayers,
      recentEvents,
    ] = await Promise.all([
      prisma.gameEvent.groupBy({
        by: ['gameMode', 'correct', 'ranked', 'practice'],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _count: { id: true },
      }),
      prisma.gameEvent.count({
        where: { createdAt: { gte: new Date(`${todayStr}T00:00:00.000Z`) } },
      }),
      prisma.gameEvent.count({ where: { userId: null } }),
      prisma.gameEvent.count({ where: { userId: { not: null } } }),
      prisma.gameEvent.groupBy({
        by: ['userId'],
        where: { userId: { not: null } },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        _count: { id: true },
      }),
      prisma.gameEvent.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, correct: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // ── Per-mode aggregation ──────────────────────────────────────────────
    const modeMap = new Map<string, ModeStats>();
    for (const row of grouped) {
      const key = row.gameMode;
      if (!modeMap.has(key)) {
        modeMap.set(key, {
          gameMode: key,
          total: 0,
          correct: 0,
          ranked: 0,
          rankedCorrect: 0,
          practice: 0,
          practiceCorrect: 0,
          casual: 0,
          casualCorrect: 0,
          score: 0,
        });
      }
      const m = modeMap.get(key)!;
      const n = row._count.id;
      m.total += n;
      if (row.correct) {
        m.correct += n;
      }
      if (row.practice) {
        m.practice += n;
        if (row.correct) {
          m.practiceCorrect += n;
        }
      } else if (row.ranked) {
        m.ranked += n;
        if (row.correct) {
          m.rankedCorrect += n;
        }
      } else {
        m.casual += n;
        if (row.correct) {
          m.casualCorrect += n;
        }
      }
    }

    const MODE_ORDER: GameMode[] = [
      'missing-word-count',
      'locate-verse',
      'next-verse',
      'translation-quiz',
    ];
    const modeStats = MODE_ORDER.map(
      (m) =>
        modeMap.get(m) ?? {
          gameMode: m,
          total: 0,
          correct: 0,
          ranked: 0,
          rankedCorrect: 0,
          practice: 0,
          practiceCorrect: 0,
          casual: 0,
          casualCorrect: 0,
          score: 0,
        },
    );

    // ── Daily buckets (last 30 days) ──────────────────────────────────────
    const bucketMap = new Map<string, DayBucket>();
    // Pre-fill every day so empty days show as 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      bucketMap.set(key, { date: key, total: 0, correct: 0 });
    }
    for (const ev of recentEvents) {
      const key = ev.createdAt.toISOString().slice(0, 10);
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.total += 1;
        if (ev.correct) {
          bucket.correct += 1;
        }
      }
    }
    const last30Days = [...bucketMap.values()];

    // ── Totals ────────────────────────────────────────────────────────────
    let totalGames = 0;
    let totalCorrect = 0;
    for (const m of modeStats) {
      totalGames += m.total;
      totalCorrect += m.correct;
    }

    return {
      totalGames,
      totalCorrect,
      totalToday,
      totalAuthGames,
      totalAnonGames,
      uniquePlayers: uniquePlayers.length,
      modeStats,
      last30Days,
    };
  },
  ['global-stats'],
  { revalidate: 300, tags: ['global-stats'] },
);
