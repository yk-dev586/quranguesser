import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Stats',
  description:
    'Aggregated QuranGuessr statistics across all game modes and players — accuracy, games played, and activity trends.',
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
