import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { prisma } from '@/lib/prisma';

/** Quran Foundation OAuth2 base URL (switch via QF_ENVIRONMENT env var). */
const qfAuthBase =
  process.env.QF_ENVIRONMENT === 'production'
    ? 'https://oauth2.quran.foundation'
    : 'https://prelive-oauth2.quran.foundation';

const qfProviderId =
  process.env.QF_ENVIRONMENT === 'production' ? 'quran-foundation' : 'quran-foundation-prelive';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    {
      id: qfProviderId,
      name: 'Quran.com',
      type: 'oidc',
      issuer: qfAuthBase,
      clientId: process.env.QF_CLIENT_ID!,
      clientSecret: process.env.QF_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        url: `${qfAuthBase}/oauth2/auth`,
        params: {
          scope: 'activity_day offline_access openid streak user reading_session',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          response_type: 'code',
          prompt: 'login',
        },
      },
      token: {
        url: `${qfAuthBase}/oauth2/token`,
      },
      userinfo: {
        url: `${qfAuthBase}/userinfo`,
      },
      checks: ['pkce', 'state', 'nonce'],
      profile(profile: {
        sub: string;
        email?: string;
        name?: string;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        first_name?: string;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        last_name?: string;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        photo_url?: string;
      }) {
        return {
          id: profile.sub,
          name:
            [profile.first_name, profile.last_name].filter(Boolean).join(' ') ||
            profile.name ||
            null,
          email: profile.email ?? null,
          image: profile.photo_url ?? null,
        };
      },
    },
  ],

  session: {
    strategy: 'database',
  },

  callbacks: {
    session({ session, user }) {
      // Expose the database user id in the session
      session.user.id = user.id;
      return session;
    },
  },

  events: {
    linkAccount({ account }) {
      if (!account.id_token) {
        console.warn(
          '[auth] id_token not stored for account — RP-Initiated Logout will fall back to local-only sign-out',
        );
      }
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
});
