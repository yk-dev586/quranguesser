export type LeaderboardTab = 'player' | 'page' | 'daily';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  elo: number;
  eloChange: number;
  gamesPlayed: number;
  mwcCorrect: number;
  lvGames: number;
  lvCorrect: number;
  nvGames: number;
  nvCorrect: number;
}

export interface PageEloEntry {
  rank: number;
  pageNumber: number;
  elo: number;
  updatedAt: Date;
  juz: number;
  surah: string;
  totalAttempts: number;
  correctAttempts: number;
}

export interface LeaderboardStats {
  // Player ELO stats
  globalAvgPlayerElo: number;
  totalGamesPlayed: number;
  currentUserElo: number | null;
  currentUserEloChange: number;
  totalPlayerEntries: number;
  totalEloUsers: number;
  // Page ELO stats
  globalAvgPageElo: number;
  hardestPageNumber: number | null;
  easiestPageNumber: number | null;
  totalPageEntries: number;
  // Daily challenge stats
  dailyDate: string;
  dailyTopScore: number | null;
  dailyCompletions: number;
  currentUserDailyScore: number | null;
}

export interface DailyChallengeEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  totalScore: number;
  completedAt: Date;
}
