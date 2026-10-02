import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function normalize(payload: any) {
  const data = Array.isArray(payload?.data?.surahs) ? payload.data.surahs : [];
  const result: Record<string, Array<{ chapter: number; verse: number; text: string; page_number?: number }>> = {};
  for (const surah of data) {
    const chapter = Number(surah?.number);
    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 114) continue;
    const verses = Array.isArray(surah?.ayahs) ? surah.ayahs : [];
    result[String(chapter)] = verses
      .map((ayah: any) => ({
        chapter,
        verse: Number(ayah?.numberInSurah),
        text: String(ayah?.text ?? '').trim(),
        page_number: Number.isInteger(Number(ayah?.page)) ? Number(ayah.page) : undefined,
      }))
      .filter((v: any) => Number.isInteger(v.verse) && v.text);
  }
  return result;
}

export async function GET() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani', {
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Al Quran Cloud HTTP ${response.status}`);
    const payload = await response.json();
    const quran = normalize(payload);
    if (Object.keys(quran).length !== 114) throw new Error('Online Quran dataset is incomplete.');
    return NextResponse.json({ source: 'alquran-cloud', quran });
  } catch (error) {
    console.error('Online full Quran fallback failed.', error);
    return NextResponse.json({ error: 'Online Quran data unavailable' }, { status: 502 });
  }
}
