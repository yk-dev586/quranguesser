import { useState, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import type { ActiveSession } from '../page';

const HREF_TO_GAME_MODE: Record<string, string> = {
  '/quiz/locate-verse': 'locate-verse',
  '/quiz/next-verse': 'next-verse',
  '/quiz/missing-word-count': 'missing-word-count',
  '/quiz/locate-verse/daily': 'locate-verse-daily',
  '/quiz/translation': 'translation-quiz',
};

export function useGameModesState(
  dailyRankedCount: number,
  dailyRankedLimit: number,
  activeSessions: ActiveSession[],
) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [pendingHref, setPendingHref] = useState('');
  const pendingNavRef = useRef('');

  const openModal = (href: string) => {
    const gameMode = HREF_TO_GAME_MODE[href];
    if (gameMode) {
      const existing = activeSessions.find((s) => s.gameMode === gameMode);
      if (existing) {
        router.push(href);
        return;
      }
    }
    setPendingHref(href);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    pendingNavRef.current = pendingHref;
    setModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen && pendingNavRef.current) {
      const href = pendingNavRef.current;
      pendingNavRef.current = '';
      router.push(href);
    }
  }, [modalOpen, router]);

  const handleClose = () => {
    setModalOpen(false);
  };

  const rankedLimitReached = dailyRankedCount >= dailyRankedLimit;

  return {
    modalOpen,
    modalKey,
    rankedLimitReached,
    openModal,
    handleConfirm,
    handleClose,
  };
}
