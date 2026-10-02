/* eslint-disable @typescript-eslint/naming-convention */
import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import Skeleton from '@/app/components/ui/Skeleton';

function StatsCardSkeleton() {
  return (
    <div className="bg-surface-container-low border border-primary/10 p-6 rounded-3xl">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-20 h-3" />
      </div>
      <Skeleton className="w-24 h-9 mb-2" />
      <Skeleton className="w-36 h-4" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/20 last:border-0">
      <Skeleton className="w-6 h-4 shrink-0" />
      <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      <Skeleton className="w-32 h-4 flex-1" />
      <Skeleton className="w-16 h-4 hidden md:block" />
      <Skeleton className="w-14 h-6 rounded-full hidden md:block" />
      <Skeleton className="w-12 h-4 hidden md:block" />
      <Skeleton className="w-12 h-4 hidden md:block" />
    </div>
  );
}

export default function LeaderboardLoading() {
  return (
    <>
      <TopAppBar activeHref="/leaderboard" />
      <div className="flex h-screen pt-20 overflow-hidden bg-surface text-on-surface">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">
            {/* Title + description */}
            <div>
              <Skeleton className="h-8 w-48 mb-3" />
              <Skeleton className="h-4 w-80" />
            </div>

            {/* Tab bar + search */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
              <Skeleton className="h-9 w-48 rounded-xl" />
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </div>

            {/* Table */}
            <div className="bg-surface-container-low border border-primary/20 rounded-3xl overflow-hidden">
              {/* Table header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/30">
                <Skeleton className="w-6 h-3 shrink-0" />
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-24 h-3 flex-1" />
                <Skeleton className="w-14 h-3 hidden md:block" />
                <Skeleton className="w-12 h-3 hidden md:block" />
                <Skeleton className="w-12 h-3 hidden md:block" />
                <Skeleton className="w-12 h-3 hidden md:block" />
              </div>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar — desktop only */}
        <aside className="hidden md:flex w-72 border-l border-outline-variant/30 flex-col p-6 gap-4 overflow-y-auto">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </aside>
      </div>
      <BottomNav />
    </>
  );
}
