/* eslint-disable @typescript-eslint/naming-convention */
import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import Skeleton from '@/app/components/ui/Skeleton';
function KpiCardSkeleton() {
  return (
    <div className="bg-surface-container-low border border-primary/10 p-5 rounded-3xl">
      <Skeleton className="w-9 h-9 rounded-lg mb-3" />
      <Skeleton className="w-20 h-9 mb-1.5" />
      <Skeleton className="w-28 h-4" />
    </div>
  );
}

function ModeRowSkeleton() {
  return (
    <div className="py-4 border-b border-outline-variant/30 last:border-0">
      <div className="flex items-center justify-between mb-3">
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
      <div className="flex gap-2">
        <Skeleton className="w-28 h-7 rounded-xl" />
        <Skeleton className="w-28 h-7 rounded-xl" />
      </div>
    </div>
  );
}

export default function StatsLoading() {
  return (
    <>
      <TopAppBar activeHref="/stats" />
      <main className="min-h-screen bg-surface text-on-surface pt-20 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
          {/* Page header */}
          <div>
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-80 h-4" />
          </div>

          {/* Hero KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </div>

          {/* Activity chart */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-44 h-5" />
            </div>
            <div className="flex items-end gap-0.75 h-24">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 animate-pulse bg-surface-container-high rounded-sm"
                  style={{ height: `${20 + ((i * 37 + 13) % 70)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Per-mode breakdown */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-44 h-5" />
            </div>
            <ModeRowSkeleton />
            <ModeRowSkeleton />
            <ModeRowSkeleton />
          </div>

          {/* Player origin */}
          <div className="bg-surface-container-low border border-primary/10 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="w-36 h-5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
