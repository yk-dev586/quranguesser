import { SURAH_NAMES, SURAH_VERSE_COUNTS } from '../next-verse/surahData';

import { encryptVerseKey, signAnswer } from './answerToken';
import { fetchRandomVerse, qdcToRaw } from './fetchVerse';
import type { Question, VerseWord } from './types';

import { qdcFetchByKey } from '@/lib/qdc-client';
import { qdcFetchTranslation } from '@/lib/qdc-translations';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function candidateKeys(verseKey: string, range: number, exclude: Set<string>): string[] {
  const [s, a] = verseKey.split(':').map(Number) as [number, number];
  const keys: string[] = [];
  for (let i = Math.max(1, a - range); i <= Math.min(SURAH_VERSE_COUNTS[s], a + range); i++) {
    const key = `${s}:${i}`;
    if (!exclude.has(key)) keys.push(key);
  }
  return shuffle(keys);
}

async function collectDistractors(verseKey: string, translationId: number, correct: string) {
  const used = new Set([stripHtml(correct)]);
  const valid: string[] = [];
  const exclude = new Set([verseKey]);
  for (const range of [5, 15, 50]) {
    for (const key of candidateKeys(verseKey, range, exclude)) {
      if (valid.length === 3) return valid;
      exclude.add(key);
      const translated = await qdcFetchTranslation(key, translationId);
      if (!translated) continue;
      const clean = stripHtml(translated);
      if (!used.has(clean)) {
        used.add(clean);
        valid.push(translated);
      }
    }
  }
  return valid.length === 3 ? valid : null;
}

export async function getRandomQuestion(translationId: number, juzFilter?: number[]): Promise<Question> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const { verseKey, words } = await fetchRandomVerse(juzFilter);
    const correct = await qdcFetchTranslation(verseKey, translationId);
    if (!correct) continue;
    const distractors = await collectDistractors(verseKey, translationId, correct);
    if (!distractors) continue;
    const correctIndex = Math.floor(Math.random() * 4);
    const choices: { text: string }[] = [];
    let cursor = 0;
    for (let i = 0; i < 4; i++) choices.push({ text: stripHtml(i === correctIndex ? correct : distractors[cursor++]) });
    const fallback = words.length ? words : ((await qdcFetchByKey(verseKey))?.words.sort((a, b) => a.position - b.position).map(qdcToRaw) ?? []);
    const surah = Number(verseKey.split(':')[0]);
    return {
      encryptedVerseKey: encryptVerseKey(verseKey),
      verseWords: fallback as VerseWord[],
      verseReference: `${SURAH_NAMES[surah] ?? `Surah ${surah}`} · ${verseKey}`,
      choices,
      answerToken: signAnswer(verseKey, correctIndex),
      translationId,
    };
  }
  throw new Error('Failed to generate a local translation question after multiple attempts.');
}
