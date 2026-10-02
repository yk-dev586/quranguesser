'use client';

import { useEffect, useRef } from 'react';

import { useTranslations } from 'next-intl';

import QuizCardItem from './QuizCardItem';

const NAV_HEIGHT = 80;

export default function QuizAccordionSection() {
  const t = useTranslations('quizModes');
  const tCommon = useTranslations('common');
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const QUIZ_MODES = [
    {
      index: '01',
      badge: t('dailyChallenge'),
      badgeColors: { bg: '#fff3cd', text: '#856404' },
      title: t('locateTheVerse'),
      desc: t('locateDesc'),
      image: '/img/locate-verse.png',
      href: '/quiz/locate-verse',
    },
    {
      index: '02',
      badge: tCommon('ranked'),
      badgeColors: { bg: '#ffd1da', text: '#c00030' },
      title: t('missingWordCount'),
      desc: t('missingWordDesc'),
      image: '/img/missing-word-count.png',
      href: '/quiz/missing-word-count',
    },
    {
      index: '03',
      badge: tCommon('casual'),
      badgeColors: { bg: '#d1e7dd', text: '#0a4a28' },
      title: t('nextVerse'),
      desc: t('nextVerseDesc'),
      image: '/img/next-verse.png',
      href: '/quiz/next-verse',
    },
    {
      index: '04',
      badge: tCommon('casual'),
      badgeColors: { bg: '#cfe2ff', text: '#084298' },
      title: t('translationQuiz'),
      desc: t('translationDesc'),
      image: '/img/translation-quiz.png',
      href: '/quiz',
    },
  ];

  useEffect(() => {
    const onScroll = () => {
      innerRefs.current.forEach((inner, i) => {
        if (!inner) {
          return;
        }
        const nextOuter = outerRefs.current[i + 1];
        if (!nextOuter) {
          return;
        }

        const innerHeight = inner.offsetHeight;
        const nextRect = nextOuter.getBoundingClientRect();

        // progress: 0 = next card just arriving at sticky position; 1 = next card fully over this one
        const coverProgress = Math.max(
          0,
          Math.min(1, (NAV_HEIGHT + innerHeight - nextRect.top) / (innerHeight * 0.55)),
        );

        inner.style.transform = `scale(${1 - coverProgress * 0.04})`;
        inner.style.opacity = String(1 - coverProgress * 0.18);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="quiz-modes"
      style={{ backgroundColor: 'var(--color-surface-container-low)', paddingTop: 64 }}
    >
      {/* ── Section header ── */}
      <div className="max-w-5xl mx-auto" style={{ padding: '0 24px 48px' }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {t('label')}
        </p>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-on-surface)',
            lineHeight: 1.3,
            maxWidth: 480,
          }}
        >
          {t('title')}
        </h2>
        <p
          style={{
            fontSize: 16,
            color: 'var(--color-on-surface-variant)',
            lineHeight: 1.6,
            maxWidth: 480,
            marginTop: 8,
          }}
        >
          {t('subtitle')}
        </p>
      </div>

      {/* ── Stacking sticky cards ── */}
      <div style={{ position: 'relative' }}>
        {QUIZ_MODES.map((quiz, i) => (
          <div
            key={quiz.index}
            ref={(el) => {
              outerRefs.current[i] = el;
            }}
            style={{
              position: 'sticky',
              top: NAV_HEIGHT,
              zIndex: i + 1,
              backgroundColor: 'var(--color-surface-container-low)',
              padding: '0 24px',
            }}
          >
            <QuizCardItem
              quiz={quiz}
              priority={i === 0}
              innerRef={(el) => {
                innerRefs.current[i] = el;
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Bottom spacer so last card scrolls fully into view ── */}
      <div style={{ height: 64, backgroundColor: 'var(--color-surface-container-low)' }} />
    </section>
  );
}
