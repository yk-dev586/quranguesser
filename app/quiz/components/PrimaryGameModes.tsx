import DailyGameCard from './DailyGameCard';
import RankedGameCard from './RankedGameCard';
import SectionHeader from './SectionHeader';
import { PrimaryGameModesProps } from './types';

export default function PrimaryGameModes({
  elo,
  dailyRankedCount,
  dailyRankedLimit,
  rankedLimitReached,
  openModal,
  openJuzPanel,
  activeJuzCount,
}: PrimaryGameModesProps) {
  return (
    <section className="space-y-8">
      <SectionHeader openJuzPanel={openJuzPanel} activeJuzCount={activeJuzCount} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RankedGameCard
          elo={elo}
          dailyRankedCount={dailyRankedCount}
          dailyRankedLimit={dailyRankedLimit}
          rankedLimitReached={rankedLimitReached}
          openModal={openModal}
        />

        <DailyGameCard openModal={openModal} />
      </div>
    </section>
  );
}
