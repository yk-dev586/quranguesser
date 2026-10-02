export interface PrimaryGameModesProps {
  elo: number;
  dailyRankedCount: number;
  dailyRankedLimit: number;
  rankedLimitReached: boolean;
  openModal: (href: string) => void;
  openJuzPanel: () => void;
  activeJuzCount: number;
}
