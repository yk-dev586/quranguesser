/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Local translation adapter. Translation JSON files live in
 * public/quran/translations/<language>.json and are part of the offline bundle.
 */
import fs from 'node:fs';
import path from 'node:path';

export interface QdcTranslation {
  id: number;
  resource_id: number;
  text: string;
}

export interface QdcTranslationResource {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
  translated_name: { name: string; language_name: string };
}

const LOCAL_TRANSLATIONS = [
  { id: 1001, language: 'en', label: 'English — Saheeh International (local)' },
  { id: 1002, language: 'bn', label: 'বাংলা (local)' },
  { id: 1003, language: 'es', label: 'Español (local)' },
  { id: 1004, language: 'fr', label: 'Français (local)' },
  { id: 1005, language: 'id', label: 'Bahasa Indonesia (local)' },
  { id: 1006, language: 'ru', label: 'Русский (local)' },
  { id: 1007, language: 'sv', label: 'Svenska (local)' },
  { id: 1008, language: 'tr', label: 'Türkçe (local)' },
  { id: 1009, language: 'ur', label: 'اردو (local)' },
  { id: 1010, language: 'zh', label: '简体中文 (local)' },
] as const;

export const TRANSLATION_OPTIONS = [...LOCAL_TRANSLATIONS];
const cache = new Map<string, Map<string, string>>();

type LocalTranslationJson = Record<string, Array<{ chapter?: number; verse?: number; text?: string }>>;

function publicPath(...segments: string[]): string {
  return path.join(process.cwd(), 'public', 'quran', ...segments);
}

function getLanguageForId(id: number): string | null {
  return LOCAL_TRANSLATIONS.find((item) => item.id === id)?.language ?? null;
}

function loadLanguage(language: string): Map<string, string> {
  const existing = cache.get(language);
  if (existing) return existing;
  const file = publicPath('translations', `${language}.json`);
  if (!fs.existsSync(file)) return new Map();
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as LocalTranslationJson;
  const result = new Map<string, string>();
  for (const [chapterKey, verses] of Object.entries(parsed)) {
    if (!Array.isArray(verses)) continue;
    const chapter = Number(chapterKey);
    for (const verse of verses) {
      const c = Number(verse.chapter ?? chapter);
      const v = Number(verse.verse);
      const text = String(verse.text ?? '').trim();
      if (Number.isInteger(c) && Number.isInteger(v) && text) {
        result.set(`${c}:${v}`, text);
      }
    }
  }
  cache.set(language, result);
  return result;
}

export async function qdcFetchTranslation(verseKey: string, translationId: number): Promise<string | null> {
  const language = getLanguageForId(translationId);
  if (!language) return null;
  return loadLanguage(language).get(verseKey) ?? null;
}

export async function qdcFetchTranslationsByRange(
  fromKey: string,
  toKey: string,
  translationId: number,
): Promise<Map<string, string>> {
  const language = getLanguageForId(translationId);
  const result = new Map<string, string>();
  if (!language) return result;
  const data = loadLanguage(language);
  const [fromChapter, fromVerse] = fromKey.split(':').map(Number);
  const [toChapter, toVerse] = toKey.split(':').map(Number);
  if (![fromChapter, fromVerse, toChapter, toVerse].every(Number.isInteger)) return result;

  for (const [key, text] of data) {
    const [chapter, verse] = key.split(':').map(Number);
    const afterStart = chapter > fromChapter || (chapter === fromChapter && verse >= fromVerse);
    const beforeEnd = chapter < toChapter || (chapter === toChapter && verse <= toVerse);
    if (afterStart && beforeEnd) result.set(key, text);
  }
  return result;
}
