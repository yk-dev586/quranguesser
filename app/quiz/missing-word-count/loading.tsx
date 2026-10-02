import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import Skeleton from '@/app/components/ui/Skeleton';

export function MissingWordCountSkeleton() {
  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
        {/* Header row */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-36 h-2.5" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
          <Skeleton className="w-36 h-9 rounded-full" />
        </div>

        {/* Timer bar */}
        <Skeleton className="w-full h-2.5 rounded-full" />

        {/* Ayah card */}
        <Skeleton className="w-full min-h-45 rounded-2xl" />

        {/* Question text */}
        <Skeleton className="w-72 h-7 mx-auto" />

        {/* AnswerGrid: 4 options */}
        <div className="grid grid-cols-4 gap-2 w-full">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
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

export default function MissingWordCountLoading() {
  return <MissingWordCountSkeleton />;
}
