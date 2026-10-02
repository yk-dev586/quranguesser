import type { Metadata } from 'next';

import QuizClient from './QuizClient';

import TopAppBar from '@/app/components/TopAppBar';

export const metadata: Metadata = {
  title: 'Locate Verse Quiz',
  description:
    'Given a verse, identify which page of the Quran it belongs to. Test your knowledge of verse locations.',
};

export default function LocateVerseQuiz() {
  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <QuizClient />
    </>
  );
}
