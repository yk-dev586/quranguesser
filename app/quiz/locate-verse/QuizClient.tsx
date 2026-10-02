'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import ActionRow from './ActionRow';
import { LocateVerseQuizSkeleton } from './loading';
import LocationGrid from './LocationGrid';
import QuizError from './QuizError';
import QuizHeader from './QuizHeader';
import QuizPrompt from './QuizPrompt';
import TimerBar from './TimerBar';
import { useQuizState } from './useQuizState';
import VerseCard from './VerseCard';

import BottomNav from '@/app/components/BottomNav';
import { useQcfFontLoader } from '@/app/quiz/useQcfFontLoader';

export default function QuizClient() {
  const state = useQuizState();
  const loadedPages = useQcfFontLoader(state.pageNumbers);
  const tCommon = useTranslations('common');

  if (state.isInitializing) {
    return <LocateVerseQuizSkeleton />;
  }

  return (
    <>
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
        {state.initError ? (
          <div role="alert" className="flex flex-col items-center gap-3 py-8">
            <span className="text-sm text-error">{tCommon('failedToStart')}</span>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary underline underline-offset-2"
            >
              {tCommon('retry')}
            </button>
          </div>
        ) : (
          <>
            <QuizHeader
              questionNumber={state.questionNumber}
              totalScore={state.totalScore}
              onEndSession={async () => {
                toast.info(tCommon('sessionEnded'));
                await state.handleEndSession();
              }}
            />

            {state.question && (
              <TimerBar
                key={state.questionNumber}
                submitted={state.submitted}
                onExpire={state.handleTimerExpire}
                initialTimeLeft={state.initialTimeLeft}
              />
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={state.questionNumber}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-6"
              >
                <VerseCard
                  verseWords={state.question?.verseWords ?? null}
                  loading={state.isPending && state.question === null}
                  error={state.fetchError}
                  loadedPages={loadedPages}
                  onRetry={state.handleRetry}
                />

                <QuizPrompt />

                {state.question && (
                  <LocationGrid
                    selectedPage={state.selectedPage}
                    selectedLine={state.selectedLine}
                    submitted={state.submitted}
                    correctPage={state.submitResult?.correctPage ?? null}
                    correctLine={state.submitResult?.correctLine ?? null}
                    onSelectPage={state.setSelectedPage}
                    onSelectLine={state.setSelectedLine}
                  />
                )}

                {!state.question && !state.isPending && state.fetchError && (
                  <QuizError onRetry={state.handleRetry} />
                )}

                <ActionRow
                  submitResult={state.submitResult}
                  submitted={state.submitted}
                  selectedPage={state.selectedPage}
                  selectedLine={state.selectedLine}
                  loading={state.isPending}
                  onSubmit={state.handleSubmit}
                  onNext={state.handleNext}
                />
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
}
