/* eslint-disable @typescript-eslint/naming-convention */
import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import Skeleton from '@/app/components/ui/Skeleton';

function StatCardSkeleton() {
  return (
    <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
      <Skeleton className="w-10 h-10 rounded-lg mb-3" />
      <Skeleton className="w-16 h-9 mb-2" />
      <Skeleton className="w-24 h-4" />
    </div>
  );
}

function GameModeRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-outline-variant/30 last:border-0">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
        <div>
          <Skeleton className="w-36 h-4 mb-1" />
          <Skeleton className="w-24 h-3" />
        </div>
      </div>
      <div className="text-right">
        <Skeleton className="w-20 h-4 mb-1" />
        <Skeleton className="w-16 h-3" />
      </div>
    </div>
  );
}

export default function ProfileLoading() {
  return (
    <>
      <TopAppBar />
      <main className="min-h-screen bg-surface text-on-surface pt-20 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
          {/* Profile header */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-6 flex items-center gap-5">
            <Skeleton className="w-20 h-20 rounded-full shrink-0" />
            <div className="min-w-0 flex-1">
              <Skeleton className="w-40 h-7 mb-2" />
              <Skeleton className="w-52 h-4 mb-2" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>

          {/* GameStats — top stat cards (2×2 grid) */}
          <div className="grid grid-cols-2 gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* GameStats — game mode breakdown */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-32 h-5" />
            </div>
            <GameModeRowSkeleton />
            <GameModeRowSkeleton />
            <GameModeRowSkeleton />
          </div>

          {/* Recent activity */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-36 h-5" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-outline-variant/30 last:border-0"
                >
                  <Skeleton className="w-28 h-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
