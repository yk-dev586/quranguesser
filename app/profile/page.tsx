import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import GameStats from './GameStats';
import LeaderboardConsentToggle from './LeaderboardConsentToggle';
import LogoutButton from './LogoutButton';
import { timeAgo } from './utils';

import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { fetchQfStreak, fetchQfUserProfile } from '@/lib/qf-api';
import { MODE_DISPLAY } from '@/types/game-mode';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const t = await getTranslations('profilePage');
  const tCommon = await getTranslations('common');
  const tGameModes = await getTranslations('gameModes');
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      elo: true,
      gamesPlayed: true,
      mwcCorrect: true,
      lvGames: true,
      lvCorrect: true,
      nvGames: true,
      nvCorrect: true,
      showOnLeaderboard: true,
      createdAt: true,
      tqGames: true,
      tqCorrect: true,
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch QF Profile alongside the existing queries (true flag fetches QDC data)
  const [streak, recentEvents, qfProfile] = await Promise.all([
    fetchQfStreak(userId),
    prisma.gameEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 15,
    }),
    fetchQfUserProfile(userId, true),
  ]);

  const eloFormatted = Math.round(user.elo).toLocaleString();
  const joinDate = user.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine the display image (QF photoUrl > QF avatar > DB image > null)
  const imageUrl =
    qfProfile?.photoUrl ||
    (qfProfile?.avatarUrls ? (Object.values(qfProfile.avatarUrls)[0] as string) : undefined) ||
    user.image;

  // Determine the display name (QF full name > QF username > DB name > anonymous)
  const userName = qfProfile?.firstName
    ? `${qfProfile.firstName} ${qfProfile.lastName ?? ''}`.trim()
    : (qfProfile?.username ?? user.name ?? t('anonymous'));

  return (
    <>
      <TopAppBar />
      <main className="min-h-screen bg-surface text-on-surface pt-20 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
          {/* Profile header */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={userName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl">person</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-on-surface truncate">{userName}</h1>
                    {user.email && (
                      <p className="text-sm text-on-surface-variant truncate">{user.email}</p>
                    )}
                    <p className="text-xs text-on-surface-variant mt-1">
                      {t('joined', { date: joinDate })}
                    </p>
                  </div>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <GameStats streak={streak} eloFormatted={eloFormatted} user={user} />

          <LeaderboardConsentToggle initialValue={user.showOnLeaderboard} />

          {/* Recent activity */}
          {recentEvents.length > 0 && (
            <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
              <h2 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  calendar_month
                </span>
                {t('recentActivity')}
              </h2>
              <div className="space-y-0.5">
                {recentEvents.map((event) => {
                  const modeMeta = MODE_DISPLAY[event.gameMode];
                  const meta = modeMeta ?? {
                    icon: 'sports_esports',
                    iconCls: 'text-on-surface-variant',
                    dotCls: 'bg-surface-container',
                  };
                  const label = modeMeta ? tGameModes(modeMeta.labelKey) : event.gameMode;
                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between py-2.5 border-b border-outline-variant/30 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${meta.dotCls}`}
                        >
                          <span className={`material-symbols-outlined text-[16px] ${meta.iconCls}`}>
                            {meta.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-on-surface">{label}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {event.ranked && (
                              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                {tCommon('ranked')}
                              </span>
                            )}
                            {event.practice && (
                              <span className="text-[10px] font-semibold bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded-full">
                                {tCommon('practice')}
                              </span>
                            )}
                            {!event.ranked && !event.practice && (
                              <span className="text-[10px] font-semibold bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded-full">
                                {tCommon('casual')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            event.correct ? 'text-green-500' : 'text-red-400'
                          }`}
                        >
                          {event.correct ? 'check_circle' : 'cancel'}
                        </span>
                        <span className="text-xs text-on-surface-variant min-w-14 text-right">
                          {timeAgo(event.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
