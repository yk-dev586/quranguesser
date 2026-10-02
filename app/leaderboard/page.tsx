import LeaderboardClient from './LeaderboardClient';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { auth } from '@/auth';
import { getOrCreateDailyChallenge, getUtcDateStr } from '@/lib/daily-challenge';
import {
  getCachedPlayerLeaderboard,
  getCachedPageLeaderboard,
  getCachedDailyLeaderboard,
} from '@/lib/leaderboard-queries';
import { getJuzForPage, getSurahsForPage } from '@/lib/quran-pages';

export default async function LeaderboardPage() {
  const session = await auth();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;

  // ── Player ELO leaderboard ────────────────────────────────────────────────
  const { topUsers, totalEloUsers } = await getCachedPlayerLeaderboard();

  const playerEntries = topUsers.map((u, idx) => ({
    rank: idx + 1,
    userId: u.id,
    name: u.showOnLeaderboard ? (u.name ?? 'Abdullah') : 'Abdullah',
    image: u.showOnLeaderboard ? (u.image ?? null) : null,
    elo: Math.round(u.elo),
    eloChange: 0,
    gamesPlayed: u.gamesPlayed,
    mwcCorrect: u.mwcCorrect,
    lvGames: u.lvGames,
    lvCorrect: u.lvCorrect,
    nvGames: u.nvGames,
    nvCorrect: u.nvCorrect,
  }));

  // ── Page ELO leaderboard (hardest pages first) ────────────────────────────
  const pageEloRecords = await getCachedPageLeaderboard();

  const pageEntries = pageEloRecords.map((p, idx) => ({
    rank: idx + 1,
    pageNumber: p.pageNumber,
    elo: Math.round(p.elo),
    updatedAt: p.updatedAt,
    juz: getJuzForPage(p.pageNumber),
    surah: getSurahsForPage(p.pageNumber),
    totalAttempts: p.totalAttempts,
    correctAttempts: p.correctAttempts,
  }));

  // ── Daily Challenge leaderboard ───────────────────────────────────────────
  const today = getUtcDateStr();
  const dailyChallenge = await getOrCreateDailyChallenge(today);

  const dailyResults = await getCachedDailyLeaderboard(dailyChallenge.id);

  const dailyEntries = dailyResults.map((r, idx) => ({
    rank: idx + 1,
    userId: r.userId,
    name: r.user.showOnLeaderboard ? (r.user.name ?? 'Abdullah') : 'Abdullah',
    image: r.user.showOnLeaderboard ? (r.user.image ?? null) : null,
    totalScore: r.totalScore,
    completedAt: r.completedAt!,
  }));

  // ── Stats ─────────────────────────────────────────────────────────────────
  const currentEntry = currentUserId
    ? playerEntries.find((e) => e.userId === currentUserId)
    : undefined;

  const globalAvgPlayerElo =
    playerEntries.length > 0
      ? Math.round(playerEntries.reduce((acc, e) => acc + e.elo, 0) / playerEntries.length)
      : 1000;

  const totalGamesPlayed = playerEntries.reduce(
    (acc, e) => acc + e.gamesPlayed + e.lvGames + e.nvGames,
    0,
  );

  const globalAvgPageElo =
    pageEntries.length > 0
      ? Math.round(pageEntries.reduce((acc, e) => acc + e.elo, 0) / pageEntries.length)
      : 1000;

  const stats = {
    globalAvgPlayerElo,
    totalGamesPlayed,
    currentUserElo: currentEntry ? currentEntry.elo : null,
    currentUserEloChange: 0,
    totalPlayerEntries: playerEntries.length,
    totalEloUsers,
    globalAvgPageElo,
    hardestPageNumber: pageEntries[0]?.pageNumber ?? null,
    easiestPageNumber: pageEntries[pageEntries.length - 1]?.pageNumber ?? null,
    totalPageEntries: pageEntries.length,
    dailyDate: today,
    dailyTopScore: dailyEntries[0]?.totalScore ?? null,
    dailyCompletions: dailyEntries.length,
    currentUserDailyScore: currentUserId
      ? (dailyEntries.find((e) => e.userId === currentUserId)?.totalScore ?? null)
      : null,
  };

  return (
    <>
      <TopAppBar activeHref="/leaderboard" />
      <LeaderboardClient
        playerEntries={playerEntries}
        pageEntries={pageEntries}
        dailyEntries={dailyEntries}
        currentUserId={currentUserId}
        stats={stats}
      />
      <BottomNav />
    </>
  );
}
