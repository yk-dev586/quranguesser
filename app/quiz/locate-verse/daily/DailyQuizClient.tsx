'use client';

import DailyResults from './DailyResults';
import { useDailyQuizState } from './useDailyQuizState';

import ActionRow from '@/app/quiz/locate-verse/ActionRow';
import LocationGrid from '@/app/quiz/locate-verse/LocationGrid';
import QuizError from '@/app/quiz/locate-verse/QuizError';
import QuizPrompt from '@/app/quiz/locate-verse/QuizPrompt';
import TimerBar from '@/app/quiz/locate-verse/TimerBar';
import type { Question } from '@/app/quiz/locate-verse/types';
import VerseCard from '@/app/quiz/locate-verse/VerseCard';
import { useQcfFontLoader } from '@/app/quiz/useQcfFontLoader';

interface Props {
  challengeId: string;
  questions: Question[];
  date: string;
  initialQuestionIndex: number;
  previousScores: number[];
}

export default function DailyQuizClient({
  challengeId,
  questions,
  date,
  initialQuestionIndex,
  previousScores,
}: Props) {
  const state = useDailyQuizState(questions, challengeId, initialQuestionIndex, previousScores);
  const loadedPages = useQcfFontLoader(state.pageNumbers);

  if (state.allDone) {
    return (
      <DailyResults
        date={date}
        totalScore={state.totalScore}
        scores={state.scores}
        questions={questions}
      />
    );
  }

  return (
    <main className="flex-1 flex flex-col px-5 max-w-3xl mx-auto w-full gap-6 justify-center min-h-screen pt-20 pb-24 md:pb-8">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Daily Challenge
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-on-background">
              Question {state.currentIndex + 1}
              <span className="text-on-surface-variant text-sm"> / 5</span>
            </span>
            {/* Progress dots */}
            <div className="flex gap-1 ml-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`inline-block w-2 h-2 rounded-full transition-colors ${
                    i < state.scores.length
                      ? 'bg-primary'
                      : i === state.currentIndex
                        ? 'bg-primary/50'
                        : 'bg-surface-container-high'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>
            stars
          </span>
          <span className="text-sm font-semibold text-primary">
            {state.totalScore.toLocaleString()} pts
          </span>
        </div>
      </div>

      {state.question && !state.isInitializing && (
        <TimerBar
          key={state.currentIndex}
          submitted={state.submitted}
          onExpire={state.handleTimerExpire}
          initialTimeLeft={state.initialTimeLeft}
        />
      )}

      <VerseCard
        verseWords={state.question?.verseWords ?? null}
        loading={state.isPending && state.question === null}
        error={state.fetchError}
        loadedPages={loadedPages}
        onRetry={() => {}}
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

      {!state.question && !state.isPending && state.fetchError && <QuizError onRetry={() => {}} />}

      <ActionRow
        submitResult={state.submitResult}
        submitted={state.submitted}
        selectedPage={state.selectedPage}
        selectedLine={state.selectedLine}
        loading={state.isPending}
        onSubmit={state.handleSubmit}
        onNext={state.handleNext}
      />
    </main>
  );
}
