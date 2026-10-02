import BottomNav from '@/app/components/BottomNav';
import TopAppBar from '@/app/components/TopAppBar';
import Skeleton from '@/app/components/ui/Skeleton';

export function TranslationQuizSkeleton() {
  return (
    <>
      <TopAppBar activeHref="/quiz" />
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
        {/* Progress header */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        {/* Verse card */}
        <Skeleton className="w-full min-h-45 rounded-2xl" />

        {/* Question text */}
        <div className="w-full text-center flex flex-col items-center gap-2">
          <Skeleton className="w-64 h-7" />
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-52 h-8 mt-1" />
        </div>

        {/* ChoicesGrid: 4 choices in 2-col grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="w-full min-h-25 rounded-xl" />
          <Skeleton className="w-full min-h-25 rounded-xl" />
          <Skeleton className="w-full min-h-25 rounded-xl" />
          <Skeleton className="w-full min-h-25 rounded-xl" />
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

export default function TranslationQuizLoading() {
  return <TranslationQuizSkeleton />;
}
