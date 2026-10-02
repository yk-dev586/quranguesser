import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const year = Number(url.searchParams.get('year'));
  const month = Number(url.searchParams.get('month'));
  const method = Number(url.searchParams.get('method') ?? 5);
  const school = Number(url.searchParams.get('school') ?? 0);
  const midnightMode = url.searchParams.get('midnightMode');
  const latitudeAdjustmentMethod = url.searchParams.get('latitudeAdjustmentMethod');
  const latitude = url.searchParams.get('latitude');
  const longitude = url.searchParams.get('longitude');
  const address = url.searchParams.get('address');

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: 'Invalid prayer month' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ method: String(method), school: String(school) });
    if (midnightMode) params.set('midnightMode', midnightMode);
    if (latitudeAdjustmentMethod) params.set('latitudeAdjustmentMethod', latitudeAdjustmentMethod);
    let endpoint: string;
    if (latitude && longitude) {
      params.set('latitude', latitude);
      params.set('longitude', longitude);
      endpoint = `https://api.aladhan.com/v1/calendar/${year}/${month}?${params.toString()}`;
    } else if (address) {
      params.set('address', address);
      endpoint = `https://api.aladhan.com/v1/calendarByAddress/${year}/${month}?${params.toString()}`;
    } else {
      return NextResponse.json({ error: 'Missing coordinates or address' }, { status: 400 });
    }

    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error(`AlAdhan HTTP ${response.status}`);
    const payload = await response.json();
    return NextResponse.json({
      source: 'aladhan',
      endpoint,
      fetchedAt: new Date().toISOString(),
      data: Array.isArray(payload?.data) ? payload.data : [],
    });
  } catch (error) {
    console.error('AlAdhan prayer fallback failed.', error);
    return NextResponse.json({ error: 'Online prayer times unavailable' }, { status: 502 });
  }
}
