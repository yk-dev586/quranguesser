'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import ActionRow from './ActionRow';
import AnswerGrid from './AnswerGrid';
import AyahCard from './AyahCard';
import { MissingWordCountSkeleton } from './loading';
import TimerBar from './TimerBar';
import { useMissingWordCountState } from './useMissingWordCountState';

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
    initialTimeLeft,
    submitted,
    isCorrect,
    timedOut,
    displayPageElo,
    pageNumbers,
    handleTimerExpire,
    handleSubmit,
    handleNext,
    handleRetry,
    handleEndSession,
  } = useMissingWordCountState();
  const loadedPages = useQcfFontLoader(pageNumbers);
  const t = useTranslations('mwc');
  const tCommon = useTranslations('common');

  if (isInitializing) {
    return <MissingWordCountSkeleton />;
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
            <div className="w-full flex justify-between items-center pt-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    toast.info(tCommon('sessionEnded'));
                    await handleEndSession();
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                  aria-label={tCommon('endSession')}
                  title={tCommon('endSessionTitle')}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    {t('title')}
                  </span>
                  <span className="text-base font-medium text-on-background">
                    {tCommon('question', { number: questionNumber })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 18 }}>
                  bar_chart
                </span>
                <span className="text-sm font-semibold text-secondary">
                  {displayPageElo !== null ? t('pageElo', { elo: displayPageElo }) : '—'}
                </span>
              </div>
            </div>

            <TimerBar
              key={questionNumber}
              totalWords={question?.totalWords ?? 0}
              submitted={submitted}
              onExpire={handleTimerExpire}
              initialTimeLeft={initialTimeLeft}
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
                <AyahCard
                  question={question}
                  loading={isPending}
                  error={fetchError}
                  submitted={submitted}
                  isCorrect={isCorrect}
                  verseKey={submitResult?.verseKey ?? null}
                  hiddenWords={submitResult?.hiddenWords ?? null}
                  loadedPages={loadedPages}
                  onRetry={handleRetry}
                />

                {question ? (
                  <>
                    <div className="w-full text-center">
                      <h2 className="text-2xl font-semibold text-on-background">{t('howMany')}</h2>
                    </div>

                    <AnswerGrid
                      selected={selected}
                      submitted={submitted}
                      correctAnswer={submitResult?.correctAnswer ?? null}
                      isCorrect={isCorrect}
                      onSelect={(n) => setSelected(n)}
                    />
                  </>
                ) : isPending ? (
                  <div className="flex flex-col gap-3">
                    <div className="h-7 w-3/4 mx-auto rounded-lg bg-surface-container animate-pulse" />
                    <div className="grid grid-cols-4 gap-2 w-full">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="aspect-square rounded-xl bg-surface-container animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <ActionRow
                  isCorrect={isCorrect}
                  submitted={submitted}
                  selected={selected}
                  loading={isPending}
                  missingCount={submitResult?.correctAnswer ?? null}
                  userEloDelta={submitResult?.userEloDelta ?? null}
                  newUserElo={submitResult?.newUserElo ?? null}
                  ranked={submitResult?.ranked ?? false}
                  timedOut={timedOut}
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
