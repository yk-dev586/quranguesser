'use server';

import { endQuizSession } from '@/lib/quiz-session';

export async function abandonSession(token: string): Promise<void> {
  await endQuizSession(token);
}
