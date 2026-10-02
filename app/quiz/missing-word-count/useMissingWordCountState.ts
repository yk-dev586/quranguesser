'use client';

import { useTransition, useState, useMemo, useEffect, useRef } from 'react';

import { initSession, fetchNextQuestion, submitAnswer } from './actions';
import type { Option } from './AnswerGrid';
import { fetchPracticeQuestion, submitPracticeAnswer } from './practice-actions';
import type { Question, SubmitResult } from './types';

import { abandonSession } from '@/app/quiz/actions';
import { loadJuzFilter } from '@/app/quiz/components/JuzFilterSettings';
import { OFFLINE_MODE } from '@/lib/offline-mode';

const TIMER_LIMIT = 90;

export function useMissingWordCountState() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(false);
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

  const [question, setQuestion] = useState<Question | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [initialTimeLeft, setInitialTimeLeft] = useState(TIMER_LIMIT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initCalledRef = useRef(false);

  useEffect(() => {
    if (initCalledRef.current) {
      return;
    }
    initCalledRef.current = true;
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

  const submitted = isSubmitting || submitResult !== null;

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    question?.segments.forEach((seg) => {
      if (seg.type === 'words') {
        seg.words.forEach((w) => {
          if (w.page_number !== undefined) {
            nums.push(w.page_number);
          }
        });
      }
    });
    return [...new Set(nums)];
  }, [question]);

  const doSubmit = (guess: number) => {
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
              guess,
              question.encryptedHiddenWords,
            )
          : await submitAnswer(
              sessionToken!,
              question.encryptedVerseKey,
              question.answerToken,
              guess,
              question.encryptedHiddenWords,
            );
        setSubmitResult(result);
      } catch {
        setFetchError(true);
        setIsSubmitting(false);
      }
    });
  };

  const handleTimerExpire = () => doSubmit(0);
  const handleSubmit = () => doSubmit(selected ?? 0);
  const loadNextQuestion = () => {
    if (!sessionToken && !isPractice) {
      return;
    }
    startTransition(async () => {
      try {
        if (isPractice) {
          const q = await fetchPracticeQuestion(practicePageNumber ?? undefined);
          setQuestion(q);
          setQuestionNumber((n) => n + 1);
          setInitialTimeLeft(TIMER_LIMIT);
        } else {
          const filter = loadJuzFilter().length > 0 ? loadJuzFilter() : undefined;
          const { question: q, questionNumber: qn } = await fetchNextQuestion(
            sessionToken!,
            filter,
          );
          setQuestion(q);
          setQuestionNumber(qn);
          setInitialTimeLeft(TIMER_LIMIT);
        }
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitResult(null);
    setIsSubmitting(false);
    setQuestion(null);
    loadNextQuestion();
  };
  const handleRetry = () => {
    setFetchError(false);
    loadNextQuestion();
  };

  const handleEndSession = async () => {
    if (!isPractice && sessionToken) {
      await abandonSession(sessionToken);
    }
    window.location.href = '/quiz';
  };
  return {
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
    isCorrect: submitResult?.isCorrect ?? false,
    timedOut: selected === null && submitted,
    displayPageElo: submitResult?.newPageElo ?? question?.pageElo ?? null,
    pageNumbers,
    handleTimerExpire,
    handleSubmit,
    handleNext,
    handleRetry,
    handleEndSession,
  };
}
