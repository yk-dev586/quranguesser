import { NextResponse } from 'next/server';

import { getRandomQuestion } from '@/app/quiz/missing-word-count/getQuestion';

export async function GET() {
  try {
    const question = await getRandomQuestion();
    return NextResponse.json(question);
  } catch {
    return NextResponse.json({ error: 'Quran API error' }, { status: 502 });
  }
}
