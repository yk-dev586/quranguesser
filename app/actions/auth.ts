/* eslint-disable @typescript-eslint/naming-convention */
'use server';

import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';

const qfAuthBase =
  process.env.QF_ENVIRONMENT === 'production'
    ? 'https://oauth2.quran.foundation'
    : 'https://prelive-oauth2.quran.foundation';

/**
 * Performs an OIDC RP-Initiated Logout:
 *   1. Clears the local NextAuth session (revokes DB session + clears cookie).
 *   2. Redirects to the Quran Foundation OIDC logout endpoint, which revokes
 *      the user's access/refresh tokens and then sends them back to the app.
 *
 * Spec: https://openid.net/specs/openid-connect-rpinitiated-1_0.html
 */
export async function oidcLogout() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  // Retrieve the id_token stored by NextAuth during the OIDC handshake.
  // The provider requires it when post_logout_redirect_uri is included.
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: 'quran-foundation' },
    select: { id_token: true },
  });

  // Clear the local NextAuth session without triggering its own redirect.
  await signOut({ redirect: false });

  const postLogoutUri = process.env.AUTH_URL ?? 'http://localhost:3000';

  if (account?.id_token) {
    const logoutUrl = new URL(`${qfAuthBase}/oauth2/sessions/logout`);
    logoutUrl.searchParams.set('id_token_hint', account.id_token);
    logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutUri);
    logoutUrl.searchParams.set('state', crypto.randomUUID());

    redirect(logoutUrl.toString());
  }

  // Fallback: id_token not stored — local session is already cleared, go home.
  redirect('/');
}

export async function updateLeaderboardConsent(showOnLeaderboard: boolean) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new Error('Not authenticated');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { showOnLeaderboard },
  });
}
