'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import ActionRow from './ActionRow';
import ChoicesGrid from './ChoicesGrid';
import { NextVerseSkeleton } from './loading';
import QuizProgressHeader from './QuizProgressHeader';
import { useNextVerseState } from './useNextVerseState';
import VerseCard from './VerseCard';

import BottomNav from '@/app/components/BottomNav';
import { useQcfFontLoader } from '@/app/quiz/useQcfFontLoader';

export default function QuizClient() {
  const {
    isInitializing,
    initError,
    question,
    isPending,
    fetchError,
    selected,
    setSelected,
    submitResult,
    questionNumber,
    submitted,
    isCorrect,
    score,
    timeLeft,
    pageNumbers,
    handleSubmit,
    handleNext,
    handleRetry,
    handleEndSession,
  } = useNextVerseState();
  const loadedPages = useQcfFontLoader(pageNumbers);
  const t = useTranslations('nextVerseQuiz');
  const tCommon = useTranslations('common');

  if (isInitializing) {
    return <NextVerseSkeleton />;
  }

  return (
    <>
      <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
        {initError ? (
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
            <QuizProgressHeader
              questionNumber={questionNumber}
              score={score}
              timeLeft={timeLeft}
              onEndSession={async () => {
                toast.info(tCommon('sessionEnded'));
                await handleEndSession();
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={questionNumber}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-6"
              >
                <VerseCard
                  verseWords={question?.verseWords ?? null}
                  loading={isPending && question === null}
                  error={fetchError}
                  verseKey={submitted ? (submitResult?.verseKey ?? null) : null}
                  loadedPages={loadedPages}
                  onRetry={handleRetry}
                />

                <div className="w-full text-center">
                  <h2 className="text-2xl font-semibold text-on-background">{t('whatIsNext')}</h2>
                  <p className="text-sm text-on-surface-variant mt-1">{t('selectContinuation')}</p>
                </div>

                {question && (
                  <ChoicesGrid
                    choices={question.choices}
                    selected={selected}
                    submitted={submitted}
                    correctIndex={submitResult?.correctIndex ?? null}
                    loadedPages={loadedPages}
                    onSelect={setSelected}
                  />
                )}

                {isPending && !question && !fetchError && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((n) => (
                      <div key={n} className="h-24 rounded-xl bg-surface-container animate-pulse" />
                    ))}
                  </div>
                )}

                {!question && !isPending && fetchError && (
                  <div role="alert" className="flex flex-col items-center gap-3 py-8">
                    <span className="text-sm text-error">{tCommon('failedToLoad')}</span>
                    <button
                      onClick={handleRetry}
                      className="text-sm text-primary underline underline-offset-2"
                    >
                      {tCommon('tryAgain')}
                    </button>
                  </div>
                )}

                <ActionRow
                  isCorrect={isCorrect}
                  submitted={submitted}
                  selected={selected}
                  loading={isPending}
                  onSubmit={handleSubmit}
                  onNext={handleNext}
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
