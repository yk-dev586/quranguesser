import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const EDITIONS: Record<string, string> = {
  en: 'en.sahih',
  bn: 'bn.bengali',
  es: 'es.asad',
  fr: 'fr.hamidullah',
  id: 'id.indonesian',
  ru: 'ru.kuliev',
  sv: 'sv.bernstrom',
  tr: 'tr.diyanet',
  ur: 'ur.jalandhry',
  zh: 'zh.jian',
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code')?.trim() ?? '';
  const edition = EDITIONS[code];
  if (!edition) return NextResponse.json({ error: 'Unsupported translation' }, { status: 400 });

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/quran/${encodeURIComponent(edition)}`, {
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Translation HTTP ${response.status}`);
    const payload = await response.json();
    return NextResponse.json({ source: 'alquran-cloud', edition, data: payload?.data ?? null });
  } catch (error) {
    console.error('Online translation fallback failed.', error);
    return NextResponse.json({ error: 'Online translation unavailable' }, { status: 502 });
  }
}
