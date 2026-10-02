import { prisma } from '@/lib/prisma';

/**
 * Fire-and-forget game event recorder.
 *
 * Records every question submission — authenticated or anonymous, ranked,
 * casual, or practice — in the GameEvent collection for analytics and the
 * per-user recent-activity feed.
 *
 * Usage: `void recordGameEvent({ ... })` — never await; analytics must not
 * block the quiz response.
 */
export async function recordGameEvent(opts: {
  userId: string | null;
  gameMode: string;
  correct: boolean;
  ranked?: boolean;
  practice?: boolean;
  score?: number;
}): Promise<void> {
  await prisma.gameEvent.create({
    data: {
      userId: opts.userId ?? null,
      gameMode: opts.gameMode,
      correct: opts.correct,
      ranked: opts.ranked ?? false,
      practice: opts.practice ?? false,
      score: opts.score ?? 0,
    },
  });
}
