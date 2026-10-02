import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import Skeleton from '@/app/components/ui/Skeleton';

export default function DailyQuizLoading() {
  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
        {/* Header row */}
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Skeleton className="w-28 h-2.5" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-4" />
              <div className="flex gap-1 ml-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-2 h-2 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          <Skeleton className="w-24 h-9 rounded-full" />
        </div>

        {/* Timer bar */}
        <Skeleton className="w-full h-2.5 rounded-full" />

        {/* Verse card */}
        <Skeleton className="w-full min-h-45 rounded-2xl" />

        {/* Prompt text */}
        <div className="w-full text-center flex flex-col items-center gap-2">
          <Skeleton className="w-48 h-7" />
          <Skeleton className="w-56 h-4" />
        </div>

        {/* LocationGrid: Page (3 boxes) | Row (2 boxes) */}
        <div className="flex items-end justify-center gap-1.5 flex-wrap">
          <div className="flex flex-col gap-1">
            <Skeleton className="w-6 h-2.5 mb-1" />
            <div className="flex gap-1">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <Skeleton className="w-14 h-14 rounded-xl" />
              <Skeleton className="w-14 h-14 rounded-xl" />
            </div>
          </div>
          <div className="w-px h-14 mx-3 bg-outline-variant/30" />
          <div className="flex flex-col gap-1">
            <Skeleton className="w-6 h-2.5 mb-1" />
            <div className="flex gap-1">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <Skeleton className="w-14 h-14 rounded-xl" />
            </div>
          </div>
        </div>

        {/* ActionRow */}
        <div className="w-full flex items-center justify-end">
          <Skeleton className="w-28 h-11 rounded-lg" />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
