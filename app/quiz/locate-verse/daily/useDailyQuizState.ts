'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';

import { submitDailyAnswer, initDailySession, advanceDailyQuestion } from './actions';

import type { Question, SubmitResult } from '@/app/quiz/locate-verse/types';
import { TIMER_LIMIT } from '@/app/quiz/locate-verse/types';

export function useDailyQuizState(
  questions: Question[],
  challengeId: string,
  initialQuestionIndex: number,
  previousScores: number[],
) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialQuestionIndex);
  const [scores, setScores] = useState<number[]>(previousScores);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [initialTimeLeft, setInitialTimeLeft] = useState(TIMER_LIMIT);
  const [isInitializing, setIsInitializing] = useState(!!questions[initialQuestionIndex]);

  useEffect(() => {
    const question = questions[initialQuestionIndex];
    if (!question) {
      return;
    }
    initDailySession(challengeId, initialQuestionIndex, question)
      .then((data) => {
        setSessionToken(data.sessionToken);
        setInitialTimeLeft(data.initialTimeLeft);
        setIsInitializing(false);
      })
      .catch(() => setIsInitializing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const question = questions[currentIndex] ?? null;
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const doSubmit = (page: number, line: number) => {
    if (!question || submitResult !== null) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await submitDailyAnswer(
          challengeId,
          currentIndex,
          question.encryptedVerseKey,
          question.answerToken,
          page,
          line,
        );
        setSubmitResult(result);
        setScores((prev) => [...prev, result.roundScore]);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleSubmit = () => {
    if (selectedPage === null || selectedLine === null) {
      return;
    }
    doSubmit(selectedPage, selectedLine);
  };

  const handleTimerExpire = () => {
    if (submitResult !== null) {
      return;
    }
    doSubmit(selectedPage ?? 0, selectedLine ?? 0);
  };

  const handleNext = () => {
    setSelectedPage(null);
    setSelectedLine(null);
    setSubmitResult(null);
    const next = currentIndex + 1;
    if (next >= 5) {
      setAllDone(true);
      return;
    }
    const nextQuestion = questions[next];
    setCurrentIndex(next);
    setInitialTimeLeft(TIMER_LIMIT);
    if (sessionToken && nextQuestion) {
      startTransition(async () => {
        await advanceDailyQuestion(sessionToken, next, nextQuestion);
      });
    }
  };

  const pageNumbers = useMemo(() => question?.fontPages ?? [], [question]);

  return {
    question,
    currentIndex,
    scores,
    totalScore,
    isPending,
    fetchError,
    selectedPage,
    selectedLine,
    submitResult,
    allDone,
    initialTimeLeft,
    isInitializing,
    submitted: submitResult !== null,
    pageNumbers,
    setSelectedPage,
    setSelectedLine,
    handleSubmit,
    handleTimerExpire,
    handleNext,
  };
}
