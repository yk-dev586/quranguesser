import type { Metadata } from 'next';

import QuizClient from './QuizClient';

import TopAppBar from '@/app/components/TopAppBar';

export const metadata: Metadata = {
  title: 'Next Verse Quiz',
  description: 'Read a verse and guess which verse comes next. Test your Quran sequence knowledge.',
};

export default function NextVerseQuiz() {
  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <QuizClient />
    </>
  );
}
