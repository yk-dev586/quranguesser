'use client';

import { useTransition, useState, useEffect, useRef } from 'react';

import { initSession, fetchNextQuestion, submitAnswer } from './actions';
import { fetchPracticeQuestion, submitPracticeAnswer } from './practice-actions';
import { loadTranslationId, saveTranslationId } from './TranslationSelector';
import type { Question, SubmitResult } from './types';

import { abandonSession } from '@/app/quiz/actions';
import { loadJuzFilter } from '@/app/quiz/components/JuzFilterSettings';
import { OFFLINE_MODE } from '@/lib/offline-mode';
import { TRANSLATION_OPTIONS } from '@/lib/qdc-translations';

const QUESTION_TIME_LIMIT = 90;

export function useTranslationQuizState() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(false);
  const [juzFilter, setJuzFilter] = useState<number[]>([]);
  const [translationId, setTranslationId] = useState<number>(
    () => loadTranslationId() ?? TRANSLATION_OPTIONS[0].id,
  );
  const [isPractice] = useState(
    () =>
      typeof window !== 'undefined' &&
      (OFFLINE_MODE || new URLSearchParams(window.location.search).get('practice') === 'true'),
  );

  const [question, setQuestion] = useState<Question | null>(null);
  const [isPending, startTransition] = useTransition();
  const [fetchError, setFetchError] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);

  const initKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const initKey = `${isPractice}:${translationId}`;
    if (initKeyRef.current === initKey) {
      return;
    }
    initKeyRef.current = initKey;

    if (isPractice) {
      fetchPracticeQuestion(translationId)
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJuzFilter(filter);
    const urlToken = new URLSearchParams(window.location.search).get('token') ?? undefined;
    initSession(translationId, urlToken, filter.length > 0 ? filter : undefined)
      .then((data) => {
        setSessionToken(data.sessionToken);
        setQuestion(data.question);
        setQuestionNumber(data.questionNumber);
        setScore(data.totalScore);
        if (data.submitResult) {
          setSubmitResult(data.submitResult);
        }
        setIsInitializing(false);
      })
      .catch(() => {
        setInitError(true);
        setIsInitializing(false);
      });
  }, [isPractice, translationId]);

  const submitted = submitResult !== null;
  const isCorrect = submitResult?.isCorrect ?? false;

  const doSubmit = (guess: number) => {
    if ((!sessionToken && !isPractice) || !question || submitResult !== null) {
      return;
    }
    startTransition(async () => {
      try {
        const result = isPractice
          ? await submitPracticeAnswer(question.encryptedVerseKey, question.answerToken, guess)
          : await submitAnswer(
              sessionToken!,
              question.encryptedVerseKey,
              question.answerToken,
              guess,
            );
        setSubmitResult(result);
        if (result.isCorrect) {
          setScore((s) => s + 1);
        }
      } catch {
        setFetchError(true);
      }
    });
  };

  // Reset timer when a new question arrives

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(QUESTION_TIME_LIMIT);
  }, [question?.encryptedVerseKey]);

  // Count down and auto-submit on expiry
  useEffect(() => {
    if (submitted || !question) {
      return;
    }
    if (timeLeft <= 0) {
      doSubmit(selected ?? 0);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted, question?.encryptedVerseKey]);

  const handleSubmit = () => {
    if (selected === null) {
      return;
    }
    doSubmit(selected);
  };

  const fetchNext = () => {
    startTransition(async () => {
      try {
        if (isPractice) {
          const q = await fetchPracticeQuestion(translationId);
          setQuestion(q);
          setQuestionNumber((n) => n + 1);
        } else {
          const { question: q, questionNumber: qn } = await fetchNextQuestion(
            sessionToken!,
            translationId,
            juzFilter.length > 0 ? juzFilter : undefined,
          );
          setQuestion(q);
          setQuestionNumber(qn);
        }
      } catch {
        setFetchError(true);
      }
    });
  };

  const handleNext = () => {
    if (!sessionToken && !isPractice) {
      return;
    }
    setSelected(null);
    setSubmitResult(null);
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

  const handleTranslationChange = (newId: number) => {
    saveTranslationId(newId);
    setTranslationId(newId);
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
    submitted,
    isCorrect,
    score,
    timeLeft,
    translationId,
    handleTranslationChange,
    handleSubmit,
    handleNext,
    handleRetry,
    handleEndSession,
  };
}
