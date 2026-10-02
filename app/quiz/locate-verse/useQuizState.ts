import { useState, useTransition, useMemo, useEffect } from 'react';

import { initSession, fetchNextQuestion, submitAnswer } from './actions';
import { fetchPracticeQuestion, submitPracticeAnswer } from './practice-actions';
import { TIMER_LIMIT } from './types';
import type { Question, SubmitResult } from './types';

import { abandonSession } from '@/app/quiz/actions';
import { loadJuzFilter } from '@/app/quiz/components/JuzFilterSettings';
import { OFFLINE_MODE } from '@/lib/offline-mode';

export function useQuizState() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [initialTimeLeft, setInitialTimeLeft] = useState(TIMER_LIMIT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPractice] = useState(
    () =>
      typeof window !== 'undefined' &&
      (OFFLINE_MODE || new URLSearchParams(window.location.search).get('practice') === 'true'),
  );
  const [practicePageNumber] = useState<number | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const p = new URLSearchParams(window.location.search).get('page');
    return p ? parseInt(p, 10) : null;
  });

  useEffect(() => {
    if (isPractice) {
      fetchPracticeQuestion(practicePageNumber ?? undefined)
        .then((q) => {
          setQuestion(q);
          setIsInitializing(false);
        })
        .catch(() => {
          setInitError(true);
          setIsInitializing(false);
        });
      return;
    }
    const filter = loadJuzFilter();
    const urlToken = new URLSearchParams(window.location.search).get('token') ?? undefined;
    initSession(urlToken, filter.length > 0 ? filter : undefined)
      .then((data) => {
        setSessionToken(data.sessionToken);
        setQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setTotalScore(data.totalScore);
        setInitialTimeLeft(data.initialTimeLeft);
        if (data.submitResult) {
          setSubmitResult(data.submitResult);
        }
        setIsInitializing(false);
      })
      .catch(() => {
        setInitError(true);
        setIsInitializing(false);
      });
  }, [isPractice, practicePageNumber]);

  const doSubmit = (page: number | null, line: number | null) => {
    if ((!sessionToken && !isPractice) || !question || isSubmitting || submitResult !== null) {
      return;
    }
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = isPractice
          ? await submitPracticeAnswer(
              question.encryptedVerseKey,
              question.answerToken,
              page ?? 0,
              line ?? 0,
            )
          : await submitAnswer(
              sessionToken!,
              question.encryptedVerseKey,
              question.answerToken,
              page ?? 0,
              line ?? 0,
            );
        setSubmitResult(result);
        setTotalScore((s) => s + result.roundScore);
      } catch {
        setFetchError(true);
        setIsSubmitting(false);
      }
    });
  };
  const handleSubmit = () => {
    if (selectedPage === null || selectedLine === null) {
      return;
    }
    doSubmit(selectedPage, selectedLine);
  };
  const handleTimerExpire = () => doSubmit(selectedPage, selectedLine);

  const fetchNext = () => {
    startTransition(async () => {
      try {
        if (isPractice) {
          const q = await fetchPracticeQuestion(practicePageNumber ?? undefined);
          setQuestion(q);
          setQuestionNumber((n) => n + 1);
        } else {
          const juzFilter = loadJuzFilter();
          const { question: q, questionNumber: qn } = await fetchNextQuestion(
            sessionToken!,
            juzFilter.length > 0 ? juzFilter : undefined,
          );
          setQuestion(q);
          setQuestionNumber(qn);
        }
        setInitialTimeLeft(TIMER_LIMIT);
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleNext = () => {
    if (!sessionToken && !isPractice) {
      return;
    }
    setSelectedPage(null);
    setSelectedLine(null);
    setSubmitResult(null);
    setIsSubmitting(false);
    setQuestion(null);
    fetchNext();
  };

  const handleRetry = () => {
    if (!sessionToken && !isPractice) {
      return;
    }
    setFetchError(false);
    fetchNext();
  };

  const handleEndSession = async () => {
    if (!isPractice && sessionToken) {
      await abandonSession(sessionToken);
    }
    window.location.href = '/quiz';
  };
  const submitted = isSubmitting || submitResult !== null;
  const pageNumbers = useMemo(() => question?.fontPages ?? [], [question]);

  return {
    isInitializing,
    initError,
    question,
    isPending,
    fetchError,
    selectedPage,
    selectedLine,
    submitResult,
    questionNumber,
    totalScore,
    submitted,
    pageNumbers,
    initialTimeLeft,
    sessionToken,
    setSelectedPage,
    setSelectedLine,
    handleSubmit,
    handleTimerExpire,
    handleNext,
    handleRetry,
    handleEndSession,
  };
}
