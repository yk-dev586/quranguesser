/**
 * Browser-side @quranjs/api/public client.
 *
 * Use this in client components or browser code for OAuth2 helper flows
 * (e.g. building authorisation URLs) that do NOT require a client_secret.
 *
 * - Never import @quranjs/api/server from this module.
 * - Never expose QF_CLIENT_SECRET here; it stays on the server.
 * - Content and Search must always be called server-side via qf-server-client.ts.
 */
import { createPublicClient } from '@quranjs/api/public';

export const qfPublicClient = createPublicClient({
  clientId: process.env.NEXT_PUBLIC_QF_CLIENT_ID!,
  clientType: 'confidential-proxy',
});
