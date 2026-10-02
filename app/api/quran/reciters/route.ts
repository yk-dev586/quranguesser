import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://www.mp3quran.net/api/v3/reciters?language=ar', {
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`MP3Quran HTTP ${response.status}`);
    const payload = await response.json();
    return NextResponse.json({ source: 'mp3quran', reciters: payload?.reciters ?? [] });
  } catch (error) {
    console.warn('Online reciter catalog unavailable.', error);
    return NextResponse.json({ source: 'unavailable', reciters: [] }, { status: 502 });
  }
}
