import type { VerseWord } from './types';

import { qdcFetchByJuz, qdcFetchRandom } from '@/lib/qdc-client';
import type { QdcWord } from '@/lib/qdc-client';
import { pickRandomJuz } from '@/lib/quran-pages';

export interface RawWord extends VerseWord {
  page_number: number;
}

export function qdcToRaw(w: QdcWord): RawWord {
  return {
    id: w.id,
    position: w.position,
    code_v2: w.code_v2 ?? '',
    text_qpc_hafs: w.text ?? '',
    page_number: w.page_number ?? 1,
    char_type_name: w.char_type_name,
  };
}

export async function fetchRandomVerse(juzFilter?: number[]): Promise<{ verseKey: string; words: RawWord[] }> {
  const v = juzFilter?.length ? await qdcFetchByJuz(pickRandomJuz(juzFilter)) : await qdcFetchRandom();
  return {
    verseKey: v.verse_key,
    words: v.words.sort((a, b) => a.position - b.position).map(qdcToRaw),
  };
}
