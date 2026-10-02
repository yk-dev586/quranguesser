import { NextResponse } from 'next/server';

import { getContentClient } from '@/lib/qf-server-client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key')?.trim() ?? '';
  if (!/^\d{1,3}:\d{1,3}$/.test(key)) {
    return NextResponse.json({ error: 'Invalid verse key' }, { status: 400 });
  }

  try {
    if (process.env.QF_CLIENT_ID && process.env.QF_CLIENT_SECRET) {
      const verse = await getContentClient().content.v4.verses.byKey(key as `${number}:${number}`, {
        words: true,
        wordFields: { location: true, audio: true },
      });
      return NextResponse.json({ source: 'quran-foundation', verse });
    }
  } catch (error) {
    console.warn('Quran Foundation verse request failed; using public fallback.', error);
  }

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${encodeURIComponent(key)}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Al Quran Cloud HTTP ${response.status}`);
    const payload = await response.json();
    return NextResponse.json({ source: 'alquran-cloud', verse: payload?.data ?? null });
  } catch (error) {
    console.error('Online Quran verse fallback failed.', error);
    return NextResponse.json({ error: 'Online Quran verse lookup failed' }, { status: 502 });
  }
}
