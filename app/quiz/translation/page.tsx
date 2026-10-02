import type { Metadata } from 'next';

import QuizClient from './QuizClient';

import TopAppBar from '@/app/components/TopAppBar';

export const metadata: Metadata = {
  title: 'Translation Quiz',
  description:
    'Match Quran translations to the correct verse. A fun way to deepen your understanding of the Quran.',
};

export default function TranslationQuiz() {
  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <QuizClient />
    </>
  );
}
