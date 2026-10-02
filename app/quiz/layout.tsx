import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Hub',
  description:
    'Choose from multiple Quran quiz modes — Missing Word Count, Locate Verse, Next Verse, and Translation. Track your ELO rating and streaks.',
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
