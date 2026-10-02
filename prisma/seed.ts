/**
 * Database seeder — resets all PageElo records to ELO 1000.
 *
 * Usage:
 *   npx tsx prisma/seed.ts
 *
 * With --reset flag also clears user stats (gamesPlayed, mwcCorrect, etc.):
 *   npx tsx prisma/seed.ts --reset
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TOTAL_PAGES = 604;

async function main() {
  const resetUsers = process.argv.includes('--reset');

  console.log('Seeding PageElo records for all 604 Quran pages…');

  // Delete all existing PageElo records and recreate them cleanly.
  const deleted = await prisma.pageElo.deleteMany({});
  console.log(`  Deleted ${deleted.count} existing PageElo records.`);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const data = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
    pageNumber: i + 1,
    elo: 1000,
    totalAttempts: 0,
    correctAttempts: 0,
  }));

  const created = await prisma.pageElo.createMany({ data });
  console.log(`  Created ${created.count} PageElo records (ELO = 1000).`);

  if (resetUsers) {
    console.log('\nResetting user stats (--reset flag detected)…');
    const updated = await prisma.user.updateMany({
      data: {
        elo: 1000,
        gamesPlayed: 0,
        mwcCorrect: 0,
        lvGames: 0,
        lvCorrect: 0,
        nvGames: 0,
        nvCorrect: 0,
      },
    });
    console.log(`  Reset stats for ${updated.count} users.`);

    console.log('\nClearing daily attempt records…');
    const dailyDeleted = await prisma.dailyAttempt.deleteMany({});
    console.log(`  Deleted ${dailyDeleted.count} DailyAttempt records.`);
  }

  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
