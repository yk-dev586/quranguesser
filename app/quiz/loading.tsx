import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import Skeleton from '@/app/components/ui/Skeleton';

function GameCardSkeleton() {
  return (
    <div
      className="flex flex-col w-full p-8 rounded-2xl"
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline)',
      }}
    >
      {/* Icon + badge row */}
      <div className="flex justify-between items-start mb-6 w-full">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <Skeleton className="w-24 h-7 rounded-full" />
      </div>
      {/* Title */}
      <Skeleton className="w-48 h-7 mb-3" />
      {/* Description */}
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-4/5 h-4 mb-8" />
      {/* Footer */}
      <div
        className="mt-auto flex items-center justify-between rounded-xl p-4 w-full"
        style={{
          background: 'var(--color-surface-container)',
          border: '1px solid var(--color-outline)',
        }}
      >
        <Skeleton className="w-36 h-4" />
        <Skeleton className="w-20 h-9 rounded-lg" />
      </div>
    </div>
  );
}

function SmallCardSkeleton() {
  return (
    <div
      className="p-6 rounded-2xl"
      style={{
        background: 'var(--color-surface-container-lowest)',
        border: '1px solid var(--color-outline)',
      }}
    >
      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
      <Skeleton className="w-28 h-5 mb-2" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4 mt-1" />
    </div>
  );
}

export default function QuizLoading() {
  return (
    <div className="min-h-screen text-on-surface">
      <TopAppBar activeHref="/quiz" />

      {/* Band 1: white — dashboard header */}
      <section
        style={{
          backgroundColor: 'var(--color-background)',
          paddingTop: 80 + 48,
          paddingBottom: 48,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            {/* Left: greeting */}
            <div>
              <Skeleton className="w-28 h-3 mb-3" />
              <Skeleton className="w-72 h-10 mb-3" />
              <Skeleton className="w-56 h-4" />
            </div>
            {/* Right: stat chips panel */}
            <div
              className="flex flex-wrap gap-4 items-center p-4 rounded-2xl shrink-0"
              style={{
                background: 'var(--color-surface-container-low)',
                border: '1px solid var(--color-outline)',
              }}
            >
              <div className="flex items-center gap-3 px-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-8 h-3 mb-1" />
                  <Skeleton className="w-16 h-6" />
                </div>
              </div>
              <div className="w-px h-10 hidden md:block bg-outline-variant" />
              <div className="flex items-center gap-3 px-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="w-12 h-3 mb-1" />
                  <Skeleton className="w-12 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Band 2: soft gray — game modes */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-container-low)',
          paddingTop: 64,
          paddingBottom: 96,
        }}
        className="pb-32 md:pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-10">
          {/* Primary game modes section */}
          <div className="space-y-6">
            <div>
              <Skeleton className="w-20 h-3 mb-2" />
              <Skeleton className="w-40 h-7" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GameCardSkeleton />
              <GameCardSkeleton />
            </div>
          </div>

          {/* Challenge categories section */}
          <div className="space-y-8">
            <div>
              <Skeleton className="w-20 h-3 mb-2" />
              <Skeleton className="w-52 h-7 mb-1" />
              <Skeleton className="w-64 h-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SmallCardSkeleton />
              <SmallCardSkeleton />
              <SmallCardSkeleton />
              <SmallCardSkeleton />
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
