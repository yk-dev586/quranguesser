/* eslint-disable @typescript-eslint/naming-convention */
import type { Word } from '@quranjs/api';

import DailyQuizClient from './DailyQuizClient';
import DailyResults from './DailyResults';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { encryptVerseKey, signAnswer } from '@/app/quiz/locate-verse/answerToken';
import type { Question, VerseWord } from '@/app/quiz/locate-verse/types';
import { auth } from '@/auth';
import { getOrCreateDailyChallenge, getUtcDateStr } from '@/lib/daily-challenge';
import { prisma } from '@/lib/prisma';
import { qdcFetchByKey } from '@/lib/qdc-client';
import type { QdcWord } from '@/lib/qdc-client';
import { getContentClient } from '@/lib/qf-server-client';
import { SURAH_NAMES } from '@/lib/quran-pages';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** Map an SDK Word to the app's VerseWord, keeping page/line for answer calculation. */
function mapWord(w: Word): VerseWord & { page_number?: number; line_number?: number } {
  return {
    id: w.id ?? 0,
    position: w.position,
    code_v2: w.codeV2 ?? '',
    // word.text is the default QPC Hafs rendering returned by the Content API.
    text_qpc_hafs: w.text ?? '',
    page_number: w.pageNumber,
    line_number: w.lineNumber,
    char_type_name: w.charTypeName,
  };
}

function qdcWordToVerseWord(
  w: QdcWord,
): VerseWord & { page_number?: number; line_number?: number } {
  return {
    id: w.id,
    position: w.position,
    code_v2: w.code_v2 ?? '',
    text_qpc_hafs: w.text ?? '',
    page_number: w.page_number,
    line_number: w.line_number,
    char_type_name: w.char_type_name,
  };
}

async function fetchVerseByKey(verseKey: string): Promise<{
  verseKey: string;
  words: Array<VerseWord & { page_number?: number; line_number?: number }>;
}> {
  if (!IS_PRODUCTION) {
    const qdcVerse = await qdcFetchByKey(verseKey);
    if (!qdcVerse) {
      throw new Error(`Verse ${verseKey} not found`);
    }
    const words = qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToVerseWord);
    return { verseKey: qdcVerse.verse_key, words };
  }
  try {
    const client = getContentClient();
    const verse = await client.content.v4.verses.byKey(
      verseKey as Parameters<typeof client.content.v4.verses.byKey>[0],
      { words: true, wordFields: { codeV2: true } },
    );
    const words = [...(verse.words ?? [])].sort((a, b) => a.position - b.position).map(mapWord);
    return { verseKey: verse.verseKey, words };
  } catch (err) {
    console.warn(`SDK byKey(${verseKey}) failed, falling back to direct API:`, err);
    const qdcVerse = await qdcFetchByKey(verseKey);
    if (!qdcVerse) {
      throw new Error(`Verse ${verseKey} not found`);
    }
    const words = qdcVerse.words.sort((a, b) => a.position - b.position).map(qdcWordToVerseWord);
    return { verseKey: qdcVerse.verse_key, words };
  }
}

async function buildQuestion(verseKey: string): Promise<Question> {
  const { words } = await fetchVerseByKey(verseKey);
  const firstWord = words.find((w) => w.char_type_name !== 'end');
  const correctPage = firstWord?.page_number ?? words[0]?.page_number ?? 1;
  const correctLine = firstWord?.line_number ?? 1;
  const fontPages = [
    ...new Set(words.map((w) => w.page_number).filter((p): p is number => p !== undefined)),
  ];
  const [surahStr] = verseKey.split(':');
  const surahNum = parseInt(surahStr, 10);
  const surahName = SURAH_NAMES[surahNum] ?? `Surah ${surahNum}`;
  return {
    encryptedVerseKey: encryptVerseKey(verseKey),
    verseWords: words,
    verseReference: `${surahName} · ${verseKey}`,
    fontPages,
    answerToken: signAnswer(verseKey, correctPage, correctLine),
  };
}

export default async function DailyChallengeLocateVersePage() {
  const today = getUtcDateStr();
  const challenge = await getOrCreateDailyChallenge(today);

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const existingResult = userId
    ? await prisma.dailyChallengeResult.findUnique({
        where: { challengeId_userId: { challengeId: challenge.id, userId } },
      })
    : null;

  // Pre-fetch all 5 verses in parallel
  const questions = await Promise.all(challenge.verseKeys.map(buildQuestion));

  if (existingResult?.completed) {
    return (
      <>
        <TopAppBar activeHref="/quiz" />
        <DailyResults
          date={today}
          totalScore={existingResult.totalScore}
          scores={existingResult.scores}
          questions={questions}
        />
        <BottomNav />
      </>
    );
  }

  const initialQuestionIndex = existingResult?.scores.length ?? 0;
  const previousScores = existingResult?.scores ?? [];

  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <DailyQuizClient
        challengeId={challenge.id}
        questions={questions}
        date={today}
        initialQuestionIndex={initialQuestionIndex}
        previousScores={previousScores}
      />
      <BottomNav />
    </>
  );
}
