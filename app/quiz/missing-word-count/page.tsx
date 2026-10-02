import type { Metadata } from 'next';

import QuizClient from './QuizClient';

import TopAppBar from '@/app/components/TopAppBar';

export const metadata: Metadata = {
  title: 'Missing Word Count Quiz',
  description:
    'Test your Quran memorization — guess how many times a word appears on a page. Earn ELO and climb the rankings.',
};

export default function MissingWordCountQuiz() {
  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <QuizClient />
    </>
  );
}
