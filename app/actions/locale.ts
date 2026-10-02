'use server';

import { cookies } from 'next/headers';

import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/request';

export async function setLocale(locale: string): Promise<void> {
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set('locale', locale as SupportedLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}
